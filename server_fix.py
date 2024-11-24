from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from functools import wraps
import jwt
from dataclasses import asdict
from database.db_manager import DatabaseManager, serialize_document
from database.db_user import UserRepository
from database.db_restaurant import RestaurantRepository
from database.cloudinary_image import CloudinaryManager
from database.geopy_location import GeocodingManager
from models.mongo_restaurant import create_restaurant_data_from_json, create_category_data_from_json, create_food_data_from_json, create_filtered_restaurant_from_json, create_review_rating_from_json, create_review_comment_from_json
from models.mongo_user import create_diner_data_from_json, create_owner_data_from_json, create_user_auth_from_json
from misc.signup_data import create_signup_data_from_json
from misc.const import ResponseKey, UserType
from misc.token import generate_token, decode_token
from misc.utils import dataclass_to_dict

# MongoDB connection
MY_URI = "mongodb+srv://dolongduy:vegan1234@test.ussqay0.mongodb.net/?retryWrites=true&w=majority&appName=Test"
DB_NAME = "vegan"
DB_MANAGER = DatabaseManager(MY_URI, DB_NAME)

# Cloudinary manager
CLOUDINARY_NAME = 'dzxlzh6hh'
CLOUDINARY_KEY = '451518431196965'
CLOUDINARY_SECRET = 'PDYOYg1BaYJrPY616mK6zlh9lA4'
CLOUDINARY_FOLDER_USERS = 'Users'
CLOUDINARY_FOLDER_RESTAURANTS = 'Restaurants'
CLOUDINARY_FOLDER_FOODS = 'Foods'
CLOUDINARY_MANAGER = CloudinaryManager(CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET)

# Geocode manager
GEOCODER_USER_AGENT = 'VEGAN_REVIEW_APP_COS40005'
GEOCODER_MANAGER = GeocodingManager(GEOCODER_USER_AGENT)

# app instance
app = Flask(__name__)
CORS(app)

# improtant constance
TEST_KEY = 'vegan-review-test-key'
USER_REPO = UserRepository(DB_MANAGER)
RESTAURANT_REPO = RestaurantRepository(DB_MANAGER)

# OpenAPI UI configuration
OPENAPI_DOC = '/openapi_doc'  # URL for accessing the Swagger UI
API_FILES = {
    "users": '/doc_api/user_api.yaml',
    "restaurant": '/doc_api/restaurant_api.yaml',
}

# Default to one API file (you can change this as needed)
swagger_ui_blueprint = get_swaggerui_blueprint(
    OPENAPI_DOC,
    API_FILES["restaurant"],  # Default to users API
    config={
        'app_name': 'Vegan App OpenAPI docs'
    }
)

app.register_blueprint(swagger_ui_blueprint, url_prefix=OPENAPI_DOC)

"""
Helper function that need jsonify or wrapper functions
"""
def api_response_message(key: str, message: str, status: int = 200) -> tuple[object, int]:
    """Use to return a small message"""
    return jsonify({key: message}), status

def api_response_error(message: str, status: int = 400) -> tuple[object, int]:
    """Use to notify for error"""
    return jsonify({ResponseKey.Error: message}), status

def api_response_data(message_key: str, message_result: str, sent_key: str, sent_data: str, status: int = 200) -> tuple[object, int]:
    """Use to return data"""
    return jsonify({message_key: message_result, sent_key: sent_data}), status

def require_jwt_token(func):
    """
    Decorator to require a valid JWT token for the decorated route.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return api_response_error('No token provided', 401)

        try:
            data = decode_token(TEST_KEY, token)
            # The user ID is stored in the 'sub' claim of the JWT token
            user_id = data['sub']
        except jwt.ExpiredSignatureError:
            return api_response_error('Token has expired', 401)
        except jwt.InvalidTokenError:
            return api_response_error('Invalid token', 401)

        # Pass the user ID to the decorated function
        return func(user_id, *args, **kwargs)
    return wrapper

def require_user_is_owner(func):
    """
    Decorator to check if the user exists in the owner document.
    """
    @wraps(func)
    def wrapper(user_id, *args, **kwargs):
        # Check if the user exists as an owner
        if not USER_REPO.check_if_user_exist_from_id(user_id, UserType.Owner):
            return api_response_error('Not allowed to create restaurant', 403)

        # If the check passes, call the decorated function
        return func(user_id, *args, **kwargs)
    return wrapper

def require_owner_of_restaurant(func):
    """
    Decorator to check if user is the owner of the restaurant
    """
    @wraps(func)
    def wrapper(user_id, *args, **kwargs):
        # Check if the user exists as an owner
        if not USER_REPO.check_if_user_exist_from_id(user_id, UserType.Owner):
            return api_response_error('Not allowed to create restaurant', 403)

        # If the check passes, call the decorated function
        return func(user_id, *args, **kwargs)
    return wrapper

"""
Helper function others
"""
def check_review_user_type(message_key: str, message_result: str, sent_key: str, sent_data: str, status: int = 200) -> tuple[object, int]:
    """Use to return data"""
    return jsonify({message_key: message_result, sent_key: sent_data}), status

@app.route('/doc_api/<path:filename>', methods=['GET'])
def serve_api_files(filename):
    """
    File routes for opendoc api
    """
    return send_from_directory('doc_api', filename)

"""
API functions for users
"""
# Signup for user
@app.route('/api/user/signup', methods=['POST'])
def signup():
    try:
        json_data = request.get_json()
        signup_data = create_signup_data_from_json(json_data)
        user_type = json_data.get('userType')  # Get user type from the request
        
        user_id = USER_REPO.create_user(signup_data)
        if user_id:
            
            if user_type == UserType.Owner:
                restaurant_id = RESTAURANT_REPO.create_restaurant_template(user_id)
                USER_REPO.update_owner_restaurant_id(user_id, restaurant_id)
                RESTAURANT_REPO.create_category_templates(restaurant_id)
                
            return api_response_message(ResponseKey.UserID, user_id, 201)
        else:
            return api_response_error('Sign up failed')
        
    except Exception as e:
        return api_response_error(e, 500)

# Get user id to create a token
@app.route('/api/user/login', methods=['POST'])
def login():   
    try:
        json_data = request.get_json()
        username = json_data.get('username')
        password = json_data.get('password')
        user_type = json_data.get('userType')

        # Authenticate the user using MongoDB
        user_id = USER_REPO.get_user_id_from_login(username, password, user_type)
        if user_id:
            token = generate_token(TEST_KEY, user_id)
            return api_response_message(ResponseKey.Token, token, 201)
        else:
            return api_response_error('Invalid username or password', 401)
        
    except Exception as e:
        return api_response_error(e, 500)

@app.route('/api/user/get_user', methods=['GET'])
@require_jwt_token
def get_user_data(user_id):
    """
    A protected API endpoint that requires a valid JWT token.
    """
    try:
        # Fetch the user's data from MongoDB using the user_id
        user = USER_REPO.get_user_data_from_id(user_id)
        if user:
            return api_response_data(ResponseKey.Message, 'Get user info successful', 
                                    ResponseKey.KeyUser, dataclass_to_dict(user, True))
        else:
            return api_response_error('Invalid credentials', 401)
        
    except Exception as e:
        return api_response_error(e, 500)
    
# Return user info after fetching their id
@app.route('/api/user/get_auth', methods=['GET'])
@require_jwt_token
def get_user_auth(user_id):
    """
    Get authentication, should only be use when changing it
    """
    try:
        auth = USER_REPO.get_user_auth_from_id(user_id)
        if auth:
            return api_response_data(ResponseKey.Message, 'Get authentication sucessfully', 
                                    ResponseKey.KeyAuth, dataclass_to_dict(auth, True))
        else:
            return api_response_error('Invalid credentials', 401)
        
    except Exception as e:
        return api_response_error(e, 500)
    
# Update user info after fetching their id    
@app.route('/api/user/update_user', methods=['PATCH'])
@require_jwt_token  # Ensure the user is authenticated
def update_user_data(user_id):
    """
    Update user data (e.g., name, email).
    """
    try:
        json_data = request.get_json()
        user_type = json_data.get('userType')  # Get user type from the request

        if user_type not in [UserType.Diner, UserType.Owner]:
            return api_response_error('Invalid user types', 404)
        
        # Create data objects based on your model (adjust as necessary)
        user_data = create_diner_data_from_json(json_data) if user_type == UserType.Diner else create_owner_data_from_json(json_data)
        profile_image_json = json_data.get('profileImageLink')
        if profile_image_json is not None:
            user_data.profile_image_link = CLOUDINARY_MANAGER.upload_and_get_db_link(profile_image_json, CLOUDINARY_FOLDER_USERS, f"{user_id}_profile")
        
        success = USER_REPO.update_diner_data(user_id, user_data) if user_type == UserType.Diner else USER_REPO.update_owner_data(user_id, user_data)
        if success:
            return api_response_message(ResponseKey.Message, 'Update user data successfully')
        else:
            return api_response_error('Update user data failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    

# Update user authentication after fetching their id    
@app.route('/api/user/update_auth', methods=['PATCH'])
@require_jwt_token  # Ensure the user is authenticated
def update_user_auth(user_id):
    """
    Update user authentications (e.g., username, password).
    """
    try:
        json_data = request.get_json()
        user_type = json_data.get('userType')  # Get user type from the request

        if user_type not in [UserType.Diner, UserType.Owner]:
            return api_response_error('Invalid user types', 401)

        auth_data = create_user_auth_from_json(json_data, user_id)
        
        # Create data objects based on your model (adjust as necessary)
        if user_type == UserType.Diner:
            success = USER_REPO.update_diner_auth(user_id, auth_data)  # Update diner data
        else:  # owner
            success = USER_REPO.update_owner_auth(user_id, auth_data)  # Update owner data

        if success:
            return api_response_message(ResponseKey.Message, 'Update user authentication successfully')
        else:
            return api_response_error('Update user authentication failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
    
# Get all users
@app.route('/api/user/get_users', methods=['GET'])
def get_users():
    """
    Get all users, used to test
    """
    users = USER_REPO.get_all_users()
    return jsonify(users), 200

    
"""
API functions for restaurant
"""   
@app.route('/api/restaurant', methods=['POST'])
@require_jwt_token
@require_user_is_owner
def create_restaurant(user_id):
    """
    A protected API endpoint that allow user to create restaurant, no longer used currently
    """
    json_data = request.get_json()
    restaurant_data = create_restaurant_data_from_json(user_id, json_data, GEOCODER_MANAGER)
    restaurant_id = RESTAURANT_REPO.create_restaurant_db(restaurant_data)
    USER_REPO.update_owner_restaurant_id(user_id, restaurant_id)
    return api_response_message(ResponseKey.RestaurantID, restaurant_id, 201)

@app.route('/api/restaurant/<string:restaurant_id>', methods=['PATCH'])
@require_jwt_token
@require_user_is_owner
def update_restaurant_info(user_id, restaurant_id):
    """
    A protected API endpoint that allow user to update restaurant info
    """
    try:
        json_data = request.get_json()
        restaurant_data = create_restaurant_data_from_json(user_id, json_data, GEOCODER_MANAGER)
        
        profile_image_json = json_data.get('profileImageLink')
        promo_images_json = json_data.get('promoImageCollection')
        if profile_image_json is not None:
            restaurant_data.profile_image_link = CLOUDINARY_MANAGER.upload_and_get_db_link(profile_image_json, CLOUDINARY_FOLDER_RESTAURANTS, f"{restaurant_id}_profile")
        
        if promo_images_json is not None and len(promo_images_json) > 0:
            promo_images_link = []
            for index, promo_image_json in enumerate(promo_images_json):
                if promo_image_json is not None:
                    promo_images_link.append(CLOUDINARY_MANAGER.upload_and_get_db_link(promo_image_json, CLOUDINARY_FOLDER_RESTAURANTS, f"{restaurant_id}_promo_{index}"))

            restaurant_data.promo_image_collection = promo_images_link
            
        restaurant_update = RESTAURANT_REPO.update_restaurant_db(restaurant_id, restaurant_data)
        if restaurant_update:
            return api_response_message(ResponseKey.Message, 'Update restaurant info sucessfully')
        else:
            return api_response_error('Update restaurant info failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    

@app.route('/api/restaurant/<string:restaurant_id>/categories', methods=['POST'])
@require_jwt_token
@require_user_is_owner
def create_restaurant_category(user_id, restaurant_id):
    """
    Allow user to create category
    """
    try:
        json_data = request.get_json()
        category_data = create_category_data_from_json(restaurant_id, json_data)
        category_id = RESTAURANT_REPO.create_category_db(category_data)
        if category_id:
            return api_response_message(ResponseKey.Message, 'Create restaurant category sucessfully', 201)
        else:
            return api_response_error('Create category failed')
        
    except Exception as e:
        return api_response_error(e, 500)

@app.route('/api/restaurant/<string:restaurant_id>/categories/<string:category_id>', methods=['PATCH'])
@require_jwt_token
@require_user_is_owner
def update_restaurant_category(user_id, restaurant_id, category_id):
    """
    Allow user to update category
    """
    try:
        json_data = request.get_json()
        category_data = create_category_data_from_json(restaurant_id, json_data)
        category_update = RESTAURANT_REPO.update_category_db(category_id, category_data)
        if category_update:
            return api_response_message(ResponseKey.Message, 'Update restaurant category sucessfully')
        else:
            return api_response_error('Update category failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
@app.route('/api/restaurant/<string:restaurant_id>/foods', methods=['POST'])
@require_jwt_token
@require_user_is_owner
def create_restaurant_food(user_id, restaurant_id):
    """
    Allow user to create food info
    """
    try:
        json_data = request.get_json()
        image_json = json_data.get('imageLink')
        food_data = create_food_data_from_json(restaurant_id, json_data)
        food_id = RESTAURANT_REPO.create_food_db(food_data)
        
        if food_id:
            if image_json is not None:
                image_link = CLOUDINARY_MANAGER.upload_and_get_db_link(image_json, CLOUDINARY_FOLDER_FOODS, f"{food_id}_food_image")
                RESTAURANT_REPO.update_food_image(food_id, image_link)
            
            return api_response_message(ResponseKey.Message, 'Create restaurant food sucessfully', 201)
        else:
            return api_response_error('Create restaurant food failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
 
@app.route('/api/restaurant/<string:restaurant_id>/foods/<string:food_id>', methods=['PATCH'])
@require_jwt_token
@require_user_is_owner
def update_restaurant_food(user_id, restaurant_id, food_id):
    """
    Allow user to update food
    """
    try:
        json_data = request.get_json()
        image_json = json_data.get('imageLink')
        food_data = create_food_data_from_json(restaurant_id, json_data)
        
        if image_json is not None:
            food_data.image_link = CLOUDINARY_MANAGER.upload_and_get_db_link(image_json, CLOUDINARY_FOLDER_FOODS, f"{food_id}_food_image")
                
        food_update = RESTAURANT_REPO.update_food_db(food_id, food_data)
        if food_update:
            return api_response_message(ResponseKey.Message, 'Update restaurant food sucessfully')
        else:
            return api_response_error('Update food failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
@app.route('/api/restaurant/<string:restaurant_id>/foods/<string:food_id>', methods=['DELETE'])
@require_jwt_token
@require_user_is_owner
def delete_restaurant_food(user_id, restaurant_id, food_id):
    """
    Allow user to delete food
    """
    try:
        food_image_link = RESTAURANT_REPO.get_food_image_link(food_id)
        if food_image_link:
            food_public_id = CLOUDINARY_MANAGER.get_public_id(food_image_link)
            delete_food_image = CLOUDINARY_MANAGER.delete_image(food_public_id) if food_public_id else False
            
            if not delete_food_image:
                return api_response_error('Food image not found', 404)
            
        food_delete = RESTAURANT_REPO.delete_food_db(food_id)
        
        if food_delete:
            return api_response_message(ResponseKey.Message, 'Delete restaurant food sucessfully')
        else:
            return api_response_error('Deleted food failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
@app.route('/api/restaurant/<string:restaurant_id>', methods=['GET'])
def get_restaurant_info(restaurant_id):
    """
    Get restaurant info
    """
    try:
        restaurant_info = RESTAURANT_REPO.get_restaurant_info(restaurant_id)
        if restaurant_info:
            return api_response_data(ResponseKey.Message, 'Get restaurant info successfully', 
                                 ResponseKey.RestaurantInfo, dataclass_to_dict(restaurant_info, True))
        else:
            return api_response_error('Restaurant not found', 404)
        
    except Exception as e:
        return api_response_error(e, 500)
          
@app.route('/api/restaurant/<string:restaurant_id>/categories', methods=['GET'])
def get_restaurant_categories(restaurant_id):
    """
    Only get restaurant categories
    """
    try:
        restaurant_categories = RESTAURANT_REPO.get_restaurant_categories(restaurant_id)
        if restaurant_categories:
            return api_response_data(ResponseKey.Message, 'Get restaurant categories successfully', 
                                 ResponseKey.RestaurantCategories, restaurant_categories)
        else:
            return api_response_error('Restaurant not found', 404)
    
    except Exception as e:
        return api_response_error(e, 500)

@app.route('/api/restaurant/<string:restaurant_id>/foods', methods=['GET'])
def get_restaurant_foods(restaurant_id):
    """
    Only get restaurant foods
    """
    try:
        restaurant_foods = RESTAURANT_REPO.get_restaurant_foods(restaurant_id)
        if restaurant_foods:
            return api_response_data(ResponseKey.Message, 'Get restaurant foods successfully', 
                                 ResponseKey.RestaurantFoods, restaurant_foods)
        else:
            return api_response_error('Restaurant not found', 404)
    
    except Exception as e:
        return api_response_error(e, 500)


@app.route('/api/restaurant/<string:restaurant_id>/review_rating', methods=['POST'])
@require_jwt_token
def create_review_rating(user_id, restaurant_id):
    """
    Create review rating (first layer)
    """
    try:
        json_data = request.get_json()
        review_user_type = USER_REPO.get_review_user_type(user_id, restaurant_id)
        image_link = USER_REPO.get_user_image(user_id)
        username = USER_REPO.get_username(user_id)
        rating_data = create_review_rating_from_json(restaurant_id, user_id, review_user_type, username, image_link, json_data)
        rating_id = RESTAURANT_REPO.create_review_rating(rating_data)
        
        if rating_id:            
            return api_response_message(ResponseKey.Message, 'Create review rating succesfully', 201)
        else:
            return api_response_error('Create review rating failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
@app.route('/api/restaurant/<string:restaurant_id>/review_comment', methods=['POST'])
@require_jwt_token
def create_review_comment(user_id, restaurant_id):
    """
    Create review comment (second layer)
    """
    try:
        json_data = request.get_json()
        review_user_type = USER_REPO.get_review_user_type(user_id, restaurant_id)
        image_link = USER_REPO.get_user_image(user_id)
        username = USER_REPO.get_username(user_id)
        comment_data = create_review_comment_from_json(restaurant_id, user_id, review_user_type, username, image_link, json_data)
        comment_id = RESTAURANT_REPO.create_review_comment(comment_data)
        
        if comment_id:            
            return api_response_message(ResponseKey.Message, 'Create review comment succesfully', 201)
        else:
            return api_response_error('Create review comment failed')
        
    except Exception as e:
        return api_response_error(e, 500)

@app.route('/api/restaurant/<string:restaurant_id>/reviews', methods=['GET'])
def get_reviews(restaurant_id):
    """
    Get all reviews
    """
    try:
        reviews = RESTAURANT_REPO.get_reviews(restaurant_id)
        
        if reviews:            
            return api_response_data(ResponseKey.Message, 'Get all reviews successfully', 
                                 ResponseKey.Reviews, reviews)
        else:
            return api_response_error('Get all reviews failed')
        
    except Exception as e:
        return api_response_error(e, 500)

@app.route('/api/restaurant/<string:restaurant_id>/review_manager', methods=['GET'])
@require_jwt_token
@require_user_is_owner
def get_review_manager(user_id, restaurant_id):
    """
    Get review manager
    """
    try:
        review_manager = RESTAURANT_REPO.get_review_manager(restaurant_id)
        
        if review_manager:            
            return api_response_data(ResponseKey.Message, 'Get review manager successfully', 
                                 ResponseKey.ReviewManager, dataclass_to_dict(review_manager))
        else:
            return api_response_error('Get review manager failed')
        
    except Exception as e:
        return api_response_error(e, 500)
    
    
@app.route('/api/restaurant/home/info_amount', methods=['GET'])
def get_all_restaurant_info_count():
    """
    Get the total count of restaurant, use for pagination
    """
    try:
        count = RESTAURANT_REPO.get_home_restaurant_amount()
        return api_response_data(ResponseKey.Message, 'Get restaurant total amount successfully', 
                                 ResponseKey.TotalRestaurantCountInfo, count)
        
    except Exception as e:
        return api_response_error(e, 500)    

@app.route('/api/restaurant/home/food_amount', methods=['GET'])
def get_all_restaurants_food_count():
    """
    Get the total count of foods
    """
    try:
        count = RESTAURANT_REPO.get_home_food_amount()
        return api_response_data(ResponseKey.Message, 'Get food total amount successfully', 
                                 ResponseKey.TotalRestaurantCountFoods, count)
        
    except Exception as e:
        return api_response_error(e, 500)    

@app.route('/api/restaurant/home/info_list', methods=['POST'])
def get_all_restaurant_info_list():
    """
    Get the list of total restaurant info, divided by pagination
    """
    try:
        json_data = request.get_json()
        page_number = json_data.get('pageNumber')
        item_per_page = json_data.get('itemPerPage')
        list_info = RESTAURANT_REPO.get_home_restaurant_list(page_number, item_per_page)
        if list_info:
            return api_response_data(ResponseKey.Message, 'Get restaurant info list successfully', 
                                 ResponseKey.TotalRestaurantListInfo, list_info)
        else:
            return api_response_error('Restaurants not found', 404)
        
    except Exception as e:
        return api_response_error(e, 500)    

@app.route('/api/restaurant/home/food_list', methods=['POST'])
def get_all_restaurants_food_list():
    """
    Get the list of total restaurant foods, divided by pagination, return by food list
    """
    try:
        json_data = request.get_json()
        page_number = json_data.get('pageNumber', 1)
        item_per_page = json_data.get('itemPerPage', 10)
        list_foods= RESTAURANT_REPO.get_home_food_list(page_number, item_per_page)
        if list_foods:
            return api_response_data(ResponseKey.Message, 'Get restaurant foods list successfully', 
                                 ResponseKey.TotalRestaurantListFoods, list_foods)
        else:
            return api_response_error('Foods not found', 404)
               
    except Exception as e:
        return api_response_error(e, 500)    


@app.route('/api/restaurant/home/filtered_info_list', methods=['POST'])
def get_filtered_restaurant_info_list():
    """
    Get the list of filtered restaurant info
    """
    try:
        json_data = request.get_json()
        filter_data = create_filtered_restaurant_from_json(json_data)
        filtered_list_info = RESTAURANT_REPO.get_filtered_restaurant_list(filter_data)
        if filtered_list_info:
            return api_response_data(ResponseKey.Message, 'Get all filtered restaurant info list successfully', 
                                 ResponseKey.FilteredRestaurantInfoOption, filtered_list_info)
        else:
            return api_response_error('Filtered restaurants not found', 404)
        
    except Exception as e:
        return api_response_error(e, 500)
    
@app.route('/api/restaurant/home/searched_info_list', methods=['POST'])
def get_searched_restaurant_info_list():
    """
    Get the list of searched restaurant info based on query
    """
    try:
        json_data = request.get_json()
        searh_query = json_data.get('searchQuery')
        searched_list_info = RESTAURANT_REPO.get_searched_restaurant_list(searh_query)
        if searched_list_info:
            return api_response_data(ResponseKey.Message, 'Get all searched restaurant list successfully', 
                                 ResponseKey.SearchedRestaurantInfo, searched_list_info)
        else:
            return api_response_error('Searched restaurants not found', 404)
        
    except Exception as e:
        return api_response_error(e, 500)

"""
Server
"""
if __name__ == '__main__':
    app.run(debug=True, port=8080)