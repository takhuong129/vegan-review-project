from models.mongo_restaurant import MongoRestaurant, MongoCategory, MongoFood
from database.db_restaurant import RestaurantRepository
from misc.const import CollectionName, UserType

def test_create_restaurant_db():
        mongo_restaurant = MongoRestaurant(
            owner_id='owner123',
            type='Diner',
            name='The Great Eatery',
            description=['Great food!', 'Cozy atmosphere'],
            profile_link='http://example.com',
            phone_number='123-456-7890'
        )
        