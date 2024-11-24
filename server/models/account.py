"""
Use for account
"""
from dataclasses import dataclass, field
from typing import List


@dataclass
class User:
    username: str
    password: str
    full_name: str
    email: str
    birth_year: int
    image_link: str
    user_type: str


@dataclass
class Diner(User):
    favorite_restaurants: List[str] = field(default_factory=list)
    phone: str = None


@dataclass
class ShopOwner(User):
    food_list: List[str] = field(default_factory=list)
    restaurant_phone: str = None
