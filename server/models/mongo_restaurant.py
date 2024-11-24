"""
Use for inserting with mongo restaurant 
"""
from dataclasses import dataclass, field
from typing import List
from misc.utils import to_camel_case
from database.geopy_location import GeocodingManager
from datetime import datetime
from datetime import date, timedelta as td

"""
Dataclass for MongoDB
"""
@dataclass
class MongoDeliveryLink:
    """
    Use for delivery
    """
    company: str = ''
    link: str = ''

@dataclass
class MongoAddress:
    """
    Use for address
    """
    address_text: str = ''
    map_latitude: float = 0
    map_longitude: float = 0
    branch_name: str = '' 

@dataclass
class MongoRestaurant:
    """
    Use for restaurant info
    """
    owner_id: str
    name: str
    category_description: List[str] = field(default_factory=list)
    
    profile_image_link: str = ''
    promo_image_collection: List[str] = field(default_factory=list)
    
    food_country_type: str = ''
    food_country_image_link: str = ''
    
    address_collection: List[MongoAddress] = field(default_factory=list)
    phone_number: str = ''
    open_hours: dict = ''
    open_days: str = ''
    
    pure_vegan: bool = None
    take_away: bool = None
    dine_in: bool = None
    buffet: bool = None
    
    lowest_price: int = 0
    highest_price: int = 0
    delivery_collection: List[MongoDeliveryLink] = field(default_factory=list)
    payment_method: List[str] = field(default_factory=list)
    
    review_manager_id: str = ''

@dataclass
class MongoCategory:
    """
    Use for category
    """
    shop_id: str = ''
    name: str = ''
    total_food_amount: int = 0

@dataclass
class MongoFood:
    """
    Use for food
    """
    shop_id: str = ''
    category_id: str = ''
    name: str = ''
    description: str = ''
    price: float = 0
    image_link: str = ''

@dataclass
class MongoFilteredRestaurant:
    """
    Use for filteriong option in restaurant
    """
    pure_vegan: bool
    take_away: bool
    dine_in: bool
    buffet: bool
    
    food_country_types: str
    delivery_types: list[str] = field(default_factory=list)
    price_over: int = 0
    price_under: int = 0

@dataclass
class MongoReviewManager:
    """
    Use for managing Reviews
    """
    restaurant_id: str   
    average_rating: float = 0.0
    total_rating: int = 0
    total_comment: int = 0

@dataclass
class MongoReviewRating:
    """
    Use for first layer reviews, have rating for them
    """
    review_manager_id: str = ''
    restaurant_id: str = ''
    user_id: str = ''
    user_type: str = ''
    username: str = ''
    user_image: str = ''
    date_created: datetime = datetime.now()  # Set default to today's date
    rating_amount: float = 0.0
    rating_text: str = ''
    count_comment: int = 0

@dataclass
class MongoReviewComment:
    """
    Use for second layer reviews, replied to first layer, no rating
    """
    review_manager_id: str = ''
    restaurant_id: str = ''
    user_id: str = ''
    user_type: str = ''
    username: str = ''
    user_image: str = ''
    date_created: datetime = datetime.now()
    rating_id: str = ''
    comment_text: str = ''
    
"""
Converter function from json into dataclass
"""
def create_address_data_from_json(json_data: object, geocoding_manager: GeocodingManager) -> MongoAddress:
    address = json_data.get('addressText', '')
    location = geocoding_manager.geocode(address)
    return MongoAddress(
            address_text=address,
            map_latitude=location[0] if bool(location and location[0]) else 0,
            map_longitude=location[1] if bool(location and location[1]) else 0,
            branch_name=json_data.get('branchName', '')
        )

def create_delivery_data_from_json(json_data: object) -> MongoAddress:
    return MongoDeliveryLink(
            company=json_data.get('company', ''),
            link=json_data.get('link', '')
        )
    
def create_restaurant_data_from_json(owner_id: str, json_data: object, geocoding_manager: GeocodingManager) -> MongoRestaurant:
    address_list = [create_address_data_from_json(address_json, geocoding_manager) for address_json in json_data.get('addressCollection', [])]
    delivery_list = [create_delivery_data_from_json(delivery_json) for delivery_json in json_data.get('deliveryCollection', [])]
    
    restaurant_data = MongoRestaurant(
        owner_id=owner_id,
        name=json_data.get('name', ''),
        category_description=json_data.get('categoryDescription', ''),
                
        food_country_type=json_data.get('foodCountryType', ''),
        food_country_image_link=json_data.get('foodCountryImageLink', ''),
        
        address_collection=address_list,
        phone_number=json_data.get('phoneNumber', ''),
        open_hours=json_data.get('openHours', ''),
        open_days=json_data.get('openDays', ''),
        
        pure_vegan=json_data.get('pureVegan'),
        take_away=json_data.get('takeAway'),
        dine_in=json_data.get('dineIn'),
        buffet=json_data.get('buffet'),
        
        lowest_price=json_data.get('lowestPrice', 0),
        highest_price=json_data.get('highestPrice', 0),
        delivery_collection=delivery_list,
        payment_method=json_data.get('paymentMethod', [])
        
    )
    return restaurant_data

def create_category_data_from_json(shop_id: str, json_data: object) -> MongoCategory:
    restaurant_data = MongoCategory(
        shop_id=shop_id,
        name=json_data.get('name', ''),
        total_food_amount=json_data.get('totalFoodAmount', 0)
    )
    return restaurant_data

def create_food_data_from_json(shop_id: str, json_data: object) -> MongoFood:
    food_data = MongoFood(
        shop_id=shop_id,
        category_id=json_data.get('categoryId', ''),
        name=json_data.get('name', ''),
        description=json_data.get('description', ''),
        price=json_data.get('price', 0)
    )
    
    test_price = food_data.price
    if isinstance(test_price, str):
        food_data.price = int(test_price)
        
    return food_data

def create_filtered_restaurant_from_json(json_data: object) -> MongoFilteredRestaurant:
    filter = MongoFilteredRestaurant(
        pure_vegan=json_data.get('pureVegan', False),
        take_away=json_data.get('takeAway', False),
        dine_in=json_data.get('dineIn', False),
        buffet=json_data.get('buffet', False),
        
        food_country_types=json_data.get('foodCountryTypes', ''),
        delivery_types=json_data.get('deliveryTypes', []),
        price_over=json_data.get('priceOver', 0),
        price_under=json_data.get('priceUnder', 0)
    )
    return filter

def create_review_rating_from_json(restaurant_id: str, user_id: str, user_type: str, username: str, user_image: str, json_data: object) -> MongoReviewRating:
    review_rating = MongoReviewRating(
        restaurant_id=restaurant_id,
        user_id=user_id,
        user_type=user_type,
        username=username,
        user_image=user_image,
        rating_amount=json_data.get('ratingAmount', 0.0),
        rating_text=json_data.get('ratingText', '')
    )
    return review_rating

def create_review_comment_from_json(restaurant_id: str, user_id: str, user_type: str, username: str, user_image: str, json_data: object) -> MongoReviewComment:
    review_comment = MongoReviewComment(
        restaurant_id=restaurant_id,
        user_id=user_id,
        user_type=user_type,
        username=username,
        user_image=user_image,
        rating_id=json_data.get('ratingId', ''),
        comment_text=json_data.get('commentText', '')
    )
    return review_comment
