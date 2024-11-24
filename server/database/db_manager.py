"""
Use to handle all of the process that is linekd to the database as well as some helper function
"""
from pymongo import MongoClient
from bson.objectid import ObjectId


class DatabaseManager:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self, host: str, db_name: str):
        self.client = MongoClient(host)
        self.db = self.client[db_name]

    def get_collection(self, collection_name: str):
        return self.db[collection_name]

    def get_all_docs_from_collection(self, collection_name: str):
        return list(self.get_collection(collection_name).find({}, {'_id': 0}))

    def count_documents_by_field(self, collection_name: str, field_name: str, field_value: object):
        """Count total documents from a specific field name and value."""
        collection = self.get_collection(collection_name)
        count = collection.count_documents({field_name: field_value})
        return count
    
    def get_field_value_by_id(self, collection_name: str, document_id: str, field_required: str, field_id: str = '_id'):
        """Retrieve a specific field value from a document by its field, default _id."""
        try:
            collection = self.get_collection(collection_name)
            
            # Query to find the document by ID and project the specific field
            if field_id == '_id':
                result = collection.find_one(
                    {field_id: ObjectId(document_id)},
                    {field_required: 1}  # Project only the specified field
                )
            else:
                result = collection.find_one(
                    {field_id: document_id},
                    {field_required: 1}  # Project only the specified field
                )
            
            # Return the field value if found
            if result and field_required in result:
                return result[field_required]
            else:
                return None  # Field not found or document does not exist
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
    def close(self):
        self.client.close()

# Helper function to convert MongoDB documents to JSON serializable format

def serialize_document(doc):
    if isinstance(doc, list):
        for item in doc:
            item['_id'] = str(item['_id'])
    elif isinstance(doc, dict):
        doc['_id'] = str(doc['_id'])
    return doc
