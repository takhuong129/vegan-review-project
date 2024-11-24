"""
Noted that for some reason, it cant import if you run inside any other folders
"""
from bson.objectid import ObjectId
from models.mongo_restaurant import MongoRestaurant, MongoCategory, MongoFood, MongoReviewRating
from database.db_restaurant import RestaurantRepository
from misc.const import CollectionName, UserType
from database.db_manager import DatabaseManager
from database.db_user import UserRepository
from database.cloudinary_image import CloudinaryManager
import random
from geopy.geocoders import Nominatim

actual_id ='67162174f9b8ff18eda6aaaf'

MY_URI = "mongodb+srv://dolongduy:vegan1234@test.ussqay0.mongodb.net/?retryWrites=true&w=majority&appName=Test"
DB_NAME = "vegan"
DB_MANAGER = DatabaseManager(MY_URI, DB_NAME)
RESTAURANT_REPO = RestaurantRepository(DB_MANAGER)
USER_REPO = UserRepository(DB_MANAGER)

# Cloudinary manager
CLOUDINARY_NAME = 'dzxlzh6hh'
CLOUDINARY_KEY = '451518431196965'
CLOUDINARY_SECRET = 'PDYOYg1BaYJrPY616mK6zlh9lA4'
CLOUDINARY_FOLDER_USERS = 'Users'
CLOUDINARY_FOLDER_RESTAURANTS = 'Restaurants'
CLOUDINARY_FOLDER_FOODS = 'Foods'
CLOUDINARY_MANAGER = CloudinaryManager(CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET)

def test_create_restaurant(restaurant):
    return RESTAURANT_REPO.create_restaurant_db(restaurant)

def test_get_restaurant_info(restaurant_id):
    return RESTAURANT_REPO.get_restaurant_info(restaurant_id)

def test_get_user_data_from_id(user_id):
    return USER_REPO.get_user_data_from_id(user_id)

def test_get_user_auth_from_id(user_id):
    return USER_REPO.get_user_auth_from_id(user_id)

def create_categories_and_foods(shop_id: str):
    # Step 1: Create 5 categories
    categories = []
    for i in range(5):
        category_name = f"Category {i + 1}: {shop_id}"
        mongo_category = MongoCategory(
            shop_id=shop_id,
            name=category_name,
            total_food_amount = 0  # Initial count
        )
        category_id = RESTAURANT_REPO.create_category_db(mongo_category)
        categories.append(category_id)

    # Step 2: Create 25 food items
    food_names = [
        "Pizza", "Burger", "Pasta", "Salad", "Sushi",
        "Tacos", "Sandwich", "Steak", "Ice Cream", "Pancakes",
        "Dumplings", "Curry", "Fries", "Wings", "Quiche",
        "Bagel", "Burrito", "Brownie", "Cupcake", "Nachos",
        "Kebab", "Stew", "Chowder", "Pita", "Frittata"
    ]

    for i in range(25):
        food_name = random.choice(food_names)
        category_id = random.choice(categories)  # Randomly assign a category
        mongo_food = MongoFood(
            shop_id=shop_id,
            category_id=category_id,
            name=food_name,
            description=f"Delicious {food_name}",
            price=round(random.uniform(5.0, 20.0), 2),  # Random price between 5 and 20
            image_link=f"http://example.com/{food_name.lower().replace(' ', '_')}.jpg"
        )
        RESTAURANT_REPO.create_food_db(mongo_food)


def display_grouped_foods(restaurant_id: str):
    """
    Retrieve and print all foods for a specific restaurant, grouped by their categories.

    :param repo: An instance of the repository class containing the method.
    :param restaurant_id: The ID of the restaurant (shop_id) to retrieve foods for.
    """
    try:
        # Call the method to get grouped foods
        grouped_foods = RESTAURANT_REPO.get_restaurant_foods_grouped_by_category(restaurant_id)

        # Check if any foods were found
        if not grouped_foods:
            print(f"No foods found for restaurant ID: {restaurant_id}")
            return

        # Print the results
        for category in grouped_foods:
            print(f"Category: {category['name']}")
            for food in category["food_list"]:
                print(f"  - {food['name']} (Price: ${food['price']})")

    except Exception as e:
        print(f"An error occurred: {e}")

def create_and_update_review_manager(restaurant_id: str):
    review_manager_id = RESTAURANT_REPO.create_review_manager(restaurant_id)
    check = RESTAURANT_REPO.update_restaurant_review_manager_id(restaurant_id, review_manager_id)
    return 'Success' if check else 'Failed'

restaurant_id_list = ['6737f9b398d326f7c25b2acb', '6737f9e898d326f7c25b2ad4', '6737fa4b98d326f7c25b2add', '6737fb5498d326f7c25b2ae6', '673a2c5e865d1f7f0d18be17', '673a2c8e865d1f7f0d18be20', '673a2ccc865d1f7f0d18be29', '673a2cf3865d1f7f0d18be32', '673a2d13865d1f7f0d18be3b']
test = '6737f9b398d326f7c25b2acb'
def upload_and_get_image_link(image_path: object, folder:str = '', public_id: str = None) -> str:
        response = CLOUDINARY_MANAGER.upload_image(image_path, folder, public_id)
        if response is not None:
            version = response["version"]
            public_id = response["public_id"]
            format = response["format"]
            return CLOUDINARY_MANAGER.generate_db_link(version, public_id, format)
        else:
            return ''

def create_fake_food(image_path: object, food_data: MongoFood):
    food_id = RESTAURANT_REPO.create_food_db(food_data)
    if food_id:
        link = upload_and_get_image_link(image_path, CLOUDINARY_FOLDER_FOODS, f"{food_id}_food_image")
        RESTAURANT_REPO.update_food_image(food_id, link)
        print(f"Create food object {food_data.name} ({food_id}) for {food_data.shop_id} succesfully")
    else:
        print("Create food fails")

dict_foods = [
    #  Main
    {
        "food_mongo": MongoFood(name = 'Cơm chiên Paella chay', price= 75000),
        "food_image": "spain_main_paella.jpg",
        "food_category": "Món chính"
    },
    {
        "food_mongo": MongoFood(name = 'Súp lạnh Gazpacho chay', price= 75000),
        "food_image": "spain_main_gazpacho.jpg",
        "food_category": "Món chính"
    },
    {
        "food_mongo": MongoFood(name = 'Bún Fideua chay', price= 75000),
        "food_image": "spain_main_fideua.jpg",
        "food_category": "Món chính"
    },
    # Support
    {
        "food_mongo": MongoFood(name = 'Migas chay', price= 45000),
        "food_image": "spain_support_migas.jpg",
        "food_category": "Món phụ"
    },
    {
        "food_mongo": MongoFood(name = 'Patatas Bravas chay', price= 45000),
        "food_image": "spain_support_patatas_bravas.jpg",
        "food_category": "Món phụ"
    },
    # Desert
    {
        "food_mongo": MongoFood(name = 'Bánh Bruschetta', price= 30000),
        "food_image": "spain_desert_bruschetta.jpg",
        "food_category": "Tráng miệng"
    },
    {
        "food_mongo": MongoFood(name = 'Bánh Croquette nhân rau củ', price= 30000),
        "food_image": "spain_desert_croquette.jpg",
        "food_category": "Tráng miệng"
    }
    # Combo
    # {
    #     "food_mongo": MongoFood(name = 'Lẩu kim chi 4 người', price= 300000),
    #     "food_image": "korea_combo_lau_kim_chi.jpg",
    #     "food_category": "Combo"
    # }
]

def populate_restaurant_foods(restaurant_id: str, dict_foods: list[dict]) -> None:
    categories = RESTAURANT_REPO.get_restaurant_categories(restaurant_id)
    for category in categories:
        for dict_food in dict_foods:
            if category["name"] == dict_food["food_category"]:
                category_id = category["categoryId"]
                food_name = dict_food["food_mongo"].name
                dict_food["food_mongo"].shop_id = restaurant_id
                dict_food["food_mongo"].category_id = category_id
                
                if dict_food["food_category"] == "Món chính":
                    dict_food["food_mongo"].description = f"{food_name} ngon đậm đà ko thể cưỡng."
                if dict_food["food_category"] == "Món phụ":
                    dict_food["food_mongo"].description = f"{food_name} ngon hơn khi ăn kèm món chính."
                if dict_food["food_category"] == "Tráng miệng":
                    dict_food["food_mongo"].description = f"{food_name} để bắt đầu bũa ăn."
                if dict_food["food_category"] == "Combo":
                    dict_food["food_mongo"].description = f"{food_name} ngon hơn khi ăn chung nhiều người."
                
                create_fake_food(dict_food["food_image"], dict_food["food_mongo"])

def print_restaurant(restaurant_id: str) -> None:
    restaurant = RESTAURANT_REPO.get_restaurant_info(restaurant_id)
    print(f"Name: {restaurant.name}")
    print(f"Description: {restaurant.category_description}")
    print(f"Food Country type: {restaurant.food_country_type}")

print(len(restaurant_id_list))
print_restaurant(restaurant_id_list[8])
# populate_restaurant_foods(restaurant_id_list[8], dict_foods)
print(RESTAURANT_REPO.get_restaurant_foods(restaurant_id_list[8]))