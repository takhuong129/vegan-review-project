from dataclasses import dataclass, asdict, is_dataclass, field
from typing import Any, Dict

def to_camel_case(snake_str: str) -> str:
    """Convert a snake_case string to camelCase."""
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def convert_value(value: object, camel_case: bool) -> list | dict[str, object] | object:
    """Recursively convert values to they are dataclasses, lists, or dictionaries, have a check on wheher camelCase or not."""
    if isinstance(value, list):
        return [convert_value(item, camel_case) for item in value]  # Recursively convert each item in the list
    elif isinstance(value, dict):
        return {to_camel_case(key): convert_value(val, camel_case) for key, val in value.items()} if camel_case else value
    elif is_dataclass(value):
        return dataclass_to_dict(value, camel_case)  # Convert dataclass instances
    return value  # Return the value unchanged if it's not a list, dict, or dataclass

def dataclass_to_dict(dataclass: object, camel_case: bool = False) -> dict[str, object]:
    """Convert the dataclass to a dictionary, excluding empty or None values, auto convert into camelCase if needed."""
    if not is_dataclass(dataclass):
        raise ValueError("Provided object is not a dataclass instance.")

    return {
        to_camel_case(key) if camel_case else key: convert_value(value, camel_case) 
        for key, value in asdict(dataclass).items()
        if value not in (None, '', [], (), 0)
    }
    


