"""
Create for the purpose of getting the login data and creating the user data and authentication
"""
from dataclasses import dataclass, field
from typing import List
from models.mongo_user import DinerData, OwnerData, UserAuthentication
from misc.const import UserType, AuthenticationType


@dataclass
class SignUpData:
    username: str
    password: str
    email: str
    phone: str
    user_type: str

def create_user_data_and_auth_from_signup_data(signup_data: SignUpData):
    user_auth = UserAuthentication(
        signup_data.username, signup_data.password, AuthenticationType.Base, signup_data.email)
    if signup_data.user_type == UserType.Diner:
        user_data = DinerData(
            signup_data.email, signup_data.phone)
    elif signup_data.user_type == UserType.Owner:
        user_data = OwnerData(
            signup_data.email, signup_data.phone)

    return user_data, user_auth

def create_signup_data_from_json(json_data) -> SignUpData:
    signup_data = SignUpData(
        username=json_data.get('username'),
        password=json_data.get('password'),
        email=json_data.get('email'),
        phone=json_data.get('phoneNumber'),
        user_type=json_data.get('userType')
    )
    return signup_data
