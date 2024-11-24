"""
Use for creating token for json web
"""
import jwt
from datetime import datetime, timedelta


def generate_token(key: str, user_id: str):
    """
    Generate a JWT token for the given user ID with the key
    """
    payload = {
        'exp': datetime.utcnow() + timedelta(hours=4),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    token = jwt.encode(payload, key, algorithm='HS256')
    return token


def decode_token(key: str, token):
    return jwt.decode(token, key, algorithms=['HS256'])
