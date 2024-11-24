from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

# app instance
app = Flask(__name__)
CORS(app)

# MongoDB connection
uri = "mongodb+srv://admin123:admin123@veganreview.xb51ssf.mongodb.net/?retryWrites=true&w=majority&appName=VeganReview"
client = MongoClient(uri)
db = client['my_db']
collection = db['my_collection']

# Helper function to convert MongoDB documents to JSON serializable format
def serialize_document(doc):
    if isinstance(doc, list):
        for item in doc:
            item['_id'] = str(item['_id'])
    elif isinstance(doc, dict):
        doc['_id'] = str(doc['_id'])
    return doc

# /api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    data = list(collection.find({}, {'_id': 1, 'username': 1, 'password': 1}))
    data = serialize_document(data)
    return jsonify(data), 200

# /api/signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400
    collection.insert_one({'username': username, 'password': password})
    return jsonify({'message': 'User signed up successfully'}), 200

# /api/login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = collection.find_one({'username': username, 'password': password})
    if user:
        user = serialize_document(user)
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# /api/users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = list(collection.find({}, {'_id': 0, 'username': 1, 'password': 1}))
    for user in users:
        user['password'] = str(user['password'])  # Convert password to string
    return jsonify(users), 200


if __name__ == "__main__":
    app.run(debug=True, port=8080)
