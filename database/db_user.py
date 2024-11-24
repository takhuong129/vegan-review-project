from dataclasses import asdict
from bson.objectid import ObjectId
from database.db_manager import DatabaseManager
from models.mongo_user import DinerData, OwnerData, UserAuthentication
from misc.const import CollectionName, UserType, ReviewUserType
from misc.signup_data import SignUpData, create_user_data_and_auth_from_signup_data
from misc.utils import dataclass_to_dict

def convert_doc_to_diner_data(doc):
    return DinerData(
        email=doc['email'],
        phone_number=doc['phone_number'],
        full_name=doc['full_name'],
        profile_image_link=doc['profile_image_link'],
        address=doc['address'],
        favorite_restaurants=doc['favorite_restaurants']
    )


def convert_doc_to_owner_data(doc):
    return OwnerData(
        email=doc['email'],
        phone_number=doc['phone_number'],
        full_name=doc['full_name'],
        profile_image_link=doc['profile_image_link'],
        restaurant_id=doc['restaurant_id']
    )


class UserRepository:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    def create_diner_db(self, diner_data: DinerData, diner_auth: UserAuthentication) -> str:
        """
        Create a diner user.
        """
        collection_diner_data = self.db_manager.get_collection(
            CollectionName.DinerData)
        collection_diner_auth = self.db_manager.get_collection(
            CollectionName.DinerAuthentication)

        doc_diner_data = collection_diner_data.insert_one(asdict(diner_data))

        diner_id = str(doc_diner_data.inserted_id)
        print(diner_id)
        diner_auth.user_id = diner_id

        collection_diner_auth.insert_one(asdict(diner_auth))

        return diner_id

    def update_diner_data(self, diner_id: str, diner_data: DinerData) -> bool:
        """
        Update a diner user data.
        """
        collection_diner_data = self.db_manager.get_collection(
            CollectionName.DinerData)

        # Update diner data
        result_data = collection_diner_data.update_one(
            {"_id": ObjectId(diner_id)},
            {"$set": dataclass_to_dict(diner_data)}
        )

        # Return true if at least one of the updates was successful
        return result_data.modified_count > 0

    def update_diner_auth(self, diner_id: str, diner_auth: UserAuthentication) -> bool:
        """
        Update a diner user authentication.
        """
        collection_diner_auth = self.db_manager.get_collection(
            CollectionName.DinerAuthentication)

        # Update diner authentication
        result_auth = collection_diner_auth.update_one(
            {"user_id": diner_id},
            {"$set": dataclass_to_dict(diner_auth)}
        )

        # Return true if at least one of the updates was successful
        return result_auth.modified_count > 0
    
    def create_owner_db(self, owner_data: OwnerData, owner_auth: UserAuthentication) -> str:
        """
        Create an owner user.
        """
        collection_owner_data = self.db_manager.get_collection(
            CollectionName.OwnerData)
        collection_owner_auth = self.db_manager.get_collection(
            CollectionName.OwnerAuthentication)

        doc_owner_data = collection_owner_data.insert_one(asdict(owner_data))
        owner_id = str(doc_owner_data.inserted_id)
        owner_auth.user_id = owner_id

        collection_owner_auth.insert_one(asdict(owner_auth))

        return owner_id

    def update_owner_restaurant_id(self, owner_id: str, restaurant_id: str) -> bool:
        """
        Update an owner user data.
        """
        collection_owner_data = self.db_manager.get_collection(
            CollectionName.OwnerData)

        # Update owner data
        result_data = collection_owner_data.update_one(
            {"_id": ObjectId(owner_id)},
            {"$set": { "restaurant_id": restaurant_id } }
        )

        # Return true if at least one of the updates was successful
        return result_data.modified_count > 0
        
    def update_owner_data(self, owner_id: str, owner_data: OwnerData) -> bool:
        """
        Update an owner user data.
        """
        collection_owner_data = self.db_manager.get_collection(
            CollectionName.OwnerData)

        # Update owner data
        result_data = collection_owner_data.update_one(
            {"_id": ObjectId(owner_id)},
            {"$set": dataclass_to_dict(owner_data)}
        )

        # Return true if at least one of the updates was successful
        return result_data.modified_count > 0

    def update_owner_auth(self, owner_id: str, owner_auth: UserAuthentication) -> bool:
        """
        Update an owner user authetication.
        """
        collection_owner_auth = self.db_manager.get_collection(
            CollectionName.OwnerAuthentication)

        # Update owner authentication
        result_auth = collection_owner_auth.update_one(
            {"user_id": owner_id},
            {"$set": dataclass_to_dict(owner_auth)}
        )

        # Return true if at least one of the updates was successful
        return result_auth.modified_count > 0
    
    def create_user(self, signup_data: SignUpData) -> str:
        """
        Create user because they have the same interface
        """
        user_data, user_auth = create_user_data_and_auth_from_signup_data(
            signup_data)
        if signup_data.user_type == UserType.Diner:
            user_id = self.create_diner_db(user_data, user_auth)
        elif signup_data.user_type == UserType.Owner:
            user_id = self.create_owner_db(user_data, user_auth)
        return user_id

    def get_user_id_from_login(self, username: str, password: str, user_type: str) -> str:
        """
        Get the username and password from frontend and return its user_id from user_auth
        """
        collection_users = ''
        if user_type == UserType.Diner:
            collection_users = self.db_manager.get_collection(
                CollectionName.DinerAuthentication)
        elif user_type == UserType.Owner:
            collection_users = self.db_manager.get_collection(
                CollectionName.OwnerAuthentication)

        user = collection_users.find_one({'username': username,
                                          'password': password})

        if user:
            return user['user_id']
        else:
            return None

    def get_user_data_from_id(self, user_id: str) -> DinerData | OwnerData:
        collection_diners = self.db_manager.get_collection(
            CollectionName.DinerData)

        user_doc = collection_diners.find_one({'_id': ObjectId(user_id)})
        user_data = None
        if user_doc:
            user_data = convert_doc_to_diner_data(user_doc)
        else:
            collection_owners = self.db_manager.get_collection(
                CollectionName.OwnerData)
            user_doc = collection_owners.find_one({'_id': ObjectId(user_id)})
            if user_doc is None:
                return None
            user_data = convert_doc_to_owner_data(user_doc)

        return user_data
    
    def get_user_auth_from_id(self, user_id: str) -> UserAuthentication:
        collection_diner_auth = self.db_manager.get_collection(
            CollectionName.DinerAuthentication)

        user_doc = collection_diner_auth.find_one({'user_id': user_id})
        if user_doc is None:
            collection_owner_auth = self.db_manager.get_collection(
                CollectionName.OwnerAuthentication)
            user_doc = collection_owner_auth.find_one({'user_id': user_id})
            if user_doc is None:
                return None

        user_doc.pop('_id', None)  # Remove _id if MongoRestaurant doesn't accept it
        user_auth = UserAuthentication(**user_doc)
        return user_auth

    def check_if_user_exist_from_id(self, user_id: str, user_type: str) -> bool:
        collection = None
        if user_type == UserType.Diner:
            collection = self.db_manager.get_collection(
                CollectionName.DinerData)
        elif user_type == UserType.Owner:
            collection = self.db_manager.get_collection(
                CollectionName.OwnerData)
        else:
            return False
        user_doc = collection.find_one({'_id': ObjectId(user_id)})
        return False if user_doc is None else True
    
    def get_review_user_type(self, user_id: str, restaurant_id: str) -> str:
        if self.check_if_user_exist_from_id(user_id, UserType.Diner):
            return ReviewUserType.Diner
        
        if self.check_if_user_exist_from_id(user_id, UserType.Owner):
            # Check if owner of the same restaurant
            owner_of_restaurant = self.db_manager.get_field_value_by_id(CollectionName.OwnerData, user_id, 'restaurant_id') == restaurant_id
            return ReviewUserType.OwnerSame if owner_of_restaurant else ReviewUserType.OwnerOther

        return ''
    
    def get_user_image(self, user_id: str) -> str:
        if self.check_if_user_exist_from_id(user_id, UserType.Diner):
            return self.db_manager.get_field_value_by_id(CollectionName.DinerData, user_id, 'profile_image_link')
        
        if self.check_if_user_exist_from_id(user_id, UserType.Owner):
            return self.db_manager.get_field_value_by_id(CollectionName.OwnerData, user_id, 'profile_image_link')

        return ''
    
    def get_username(self, user_id: str) -> str:
        if self.check_if_user_exist_from_id(user_id, UserType.Diner):
            return self.db_manager.get_field_value_by_id(CollectionName.DinerAuthentication, user_id, 'username', 'user_id')
        
        if self.check_if_user_exist_from_id(user_id, UserType.Owner):
            return self.db_manager.get_field_value_by_id(CollectionName.OwnerAuthentication, user_id, 'username', 'user_id')

        return ''
    
    def get_all_users(self):
        diner_data = self.db_manager.get_all_docs_from_collection(
            CollectionName.DinerData)
        diner_auth = self.db_manager.get_all_docs_from_collection(
            CollectionName.DinerAuthentication)
        owner_data = self.db_manager.get_all_docs_from_collection(
            CollectionName.OwnerData)
        owner_auth = self.db_manager.get_all_docs_from_collection(
            CollectionName.OwnerAuthentication)

        # Organize the data
        data = {
            'diner_data': diner_data,
            'diner_auth': diner_auth,
            'owner_data': owner_data,
            'owner_auth': owner_auth
        }
        return data
