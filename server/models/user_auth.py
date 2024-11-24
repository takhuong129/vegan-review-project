"""
Use for user authentication
"""
from dataclasses import dataclass, field
from typing import List


@dataclass
class UserAuthentication:
    username: str
    password: str
    authentication_type: str
    authentication_identifier: str
    user_id: str = None
