"""
Use for user data
"""
from dataclasses import dataclass, field
from typing import List


@dataclass
class UserData:
    email: str
    phone_number: str
    full_name: str = ''
    profile_image_link: str = ''


@dataclass
class DinerData(UserData):
    address: str = ''
    favorite_restaurants: List[str] = field(default_factory=list)


@dataclass
class OwnerData(UserData):
    restaurant_id: str = ''
