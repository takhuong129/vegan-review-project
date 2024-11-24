import unittest
from unittest.mock import MagicMock, patch
from bson.objectid import ObjectId
from models.mongo_restaurant import MongoRestaurant, MongoCategory, MongoFood
from database.db_restaurant import RestaurantRepository
from misc.const import CollectionName

class TestRestaurantRepository(unittest.TestCase):

    def setUp(self):
        # Set up a mock database manager
        self.db_manager = MagicMock()
        self.repo = RestaurantRepository(self.db_manager)

    def test_create_restaurant_db(self):
        mongo_restaurant = MongoRestaurant(
            owner_id='owner123',
            type='Diner',
            name='The Great Eatery',
            description=['Great food!', 'Cozy atmosphere'],
            profile_link='http://example.com',
            phone_number='123-456-7890'
        )

        # Mock the collection and insert_one
        collection_mock = MagicMock()
        collection_mock.insert_one.return_value.inserted_id = ObjectId()
        self.db_manager.get_collection.return_value = collection_mock

        restaurant_id = self.repo.create_restaurant_db(mongo_restaurant)

        self.assertIsNotNone(restaurant_id)
        collection_mock.insert_one.assert_called_once_with(mongo_restaurant.__dict__)

    def test_get_restaurant_info(self):
        restaurant_id = "507f1f77bcf86cd799439011"
        mock_data = {
            "_id": ObjectId(restaurant_id),
            "owner_id": "owner123",
            "type": "Diner",
            "name": "The Great Eatery",
            "description": ["Great food!", "Cozy atmosphere"],
            "profile_link": "http://example.com",
            "phone_number": "123-456-7890"
        }

        # Mock the collection and find_one
        collection_mock = MagicMock()
        collection_mock.find_one.return_value = mock_data
        self.db_manager.get_collection.return_value = collection_mock

        restaurant_info = self.repo.get_restaurant_info(restaurant_id)

        self.assertEqual(restaurant_info.name, "The Great Eatery")
        collection_mock.find_one.assert_called_once_with({"_id": ObjectId(restaurant_id)})

    def test_update_restaurant_db(self):
        restaurant_id = "507f1f77bcf86cd799439011"
        mongo_restaurant = MongoRestaurant(
            owner_id='owner123',
            type='Diner',
            name='The Great Eatery Updated',
            description=['Updated description'],
            profile_link='http://example.com',
            phone_number='123-456-7890'
        )

        # Mock the collection and update_one
        collection_mock = MagicMock()
        collection_mock.update_one.return_value.modified_count = 1
        self.db_manager.get_collection.return_value = collection_mock

        result = self.repo.update_restaurant_db(restaurant_id, mongo_restaurant)

        self.assertTrue(result)
        collection_mock.update_one.assert_called_once_with(
            {"_id": ObjectId(restaurant_id)},
            {"$set": mongo_restaurant.__dict__}
        )

    def test_create_category_db(self):
        mongo_category = MongoCategory(
            shop_id='shop123',
            name='Desserts',
            total_food_amount=0
        )

        # Mock the collection and insert_one
        collection_mock = MagicMock()
        collection_mock.insert_one.return_value.inserted_id = ObjectId()
        self.db_manager.get_collection.return_value = collection_mock

        category_id = self.repo.create_category_db(mongo_category)

        self.assertIsNotNone(category_id)
        collection_mock.insert_one.assert_called_once_with(mongo_category.__dict__)

    # Update your test_create_food_db method
    def test_create_food_db(self):
        mongo_food = MongoFood(
            shop_id='shop123',
            category_id=str(ObjectId()),  # Use a valid ObjectId
            name='Chocolate Cake',
            description='Delicious chocolate cake',
            price=5.99,
            picture_link='http://example.com/cake.jpg'
        )

        # Mock the collections
        food_collection_mock = MagicMock()
        category_collection_mock = MagicMock()
        food_collection_mock.insert_one.return_value.inserted_id = ObjectId()
        self.db_manager.get_collection.side_effect = [food_collection_mock, category_collection_mock]

        food_id = self.repo.create_food_db(mongo_food)

        self.assertIsNotNone(food_id)
        food_collection_mock.insert_one.assert_called_once_with(mongo_food.__dict__)
        category_collection_mock.update_one.assert_called_once_with(
            {"_id": ObjectId(mongo_food.category_id)},
            {"$inc": {"total_food_amount": 1}}
        )

    def test_get_home_restaurant_amount(self):
        # Mock the collection and count_documents
        collection_mock = MagicMock()
        collection_mock.count_documents.return_value = 10
        self.db_manager.get_collection.return_value = collection_mock

        count = self.repo.get_home_restaurant_amount()

        self.assertEqual(count, 10)
        collection_mock.count_documents.assert_called_once_with({})

    def test_get_home_food_list(self):
        # Create a chainable mock for the find() method
        limit_mock = MagicMock()
        limit_mock.skip.return_value = limit_mock  # Allow chaining
        limit_mock.limit.return_value = [
            {"name": "Pizza", "price": 9.99},
            {"name": "Burger", "price": 5.99}
        ]

        collection_mock = MagicMock()
        collection_mock.find.return_value = limit_mock
        self.db_manager.get_collection.return_value = collection_mock

        result = self.repo.get_home_food_list(page=1, page_size=2)

        self.assertEqual(len(result['foods']), 2)
        collection_mock.find.assert_called_once()
        limit_mock.skip.assert_called_once_with(0)
        limit_mock.limit.assert_called_once_with(2)

    def test_get_restaurant_foods_grouped_by_category(self):
        restaurant_id = "shop123"
        mock_foods = [
            {"name": "Pizza", "category_id": str(ObjectId()), "shop_id": restaurant_id},
            {"name": "Pasta", "category_id": str(ObjectId()), "shop_id": restaurant_id},
            {"name": "Salad", "category_id": str(ObjectId()), "shop_id": restaurant_id},
        ]
        mock_categories = [
            {"_id": ObjectId(mock_foods[0]["category_id"]), "name": "Italian"},
            {"_id": ObjectId(mock_foods[1]["category_id"]), "name": "Italian"},
            {"_id": ObjectId(mock_foods[2]["category_id"]), "name": "Salads"},
        ]

        # Mock the collections
        food_collection_mock = MagicMock()
        category_collection_mock = MagicMock()
        food_collection_mock.find.return_value = mock_foods
        category_collection_mock.find.return_value = mock_categories
        self.db_manager.get_collection.side_effect = [food_collection_mock, category_collection_mock]

        result = self.repo.get_restaurant_foods_grouped_by_category(restaurant_id)

        self.assertEqual(len(result), 2)
        self.assertIn("Italian", [group["category"]["name"] for group in result])
        self.assertIn("Salads", [group["category"]["name"] for group in result])

if __name__ == '__main__':
    unittest.main()