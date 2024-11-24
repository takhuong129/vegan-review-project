from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

class GeocodingManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(GeocodingManager, cls).__new__(cls)
        return cls._instance

    def __init__(self, user_agent: str):
        self.geolocator = Nominatim(user_agent = user_agent)

    def geocode(self, address: str) -> tuple | None:
        """Geocode an address to latitude and longitude in order."""
        try:
            location = self.geolocator.geocode(address)
            if location:
                return (location.latitude, location.longitude)
            else:
                return None
        except GeocoderTimedOut:
            return self.geocode(address)  # Retry on timeout

    def reverse_geocode(self, latitude, longitude) -> str | None:
        """Reverse geocode latitude and longitude to an address."""
        try:
            location = self.geolocator.reverse((latitude, longitude))
            if location:
                return location.address
            else:
                return None
        except GeocoderTimedOut:
            return self.reverse_geocode(latitude, longitude)  # Retry on timeout

# Example usage
if __name__ == "__main__":
    geocoder = GeocodingManager()
    
    # Geocode an address
    address = "1600 Amphitheatre Parkway, Mountain View, CA"
    coordinates = geocoder.geocode(address)
    print(f"Coordinates of '{address}': {coordinates}")
    
    # Reverse geocode coordinates
    if coordinates:
        address = geocoder.reverse_geocode(coordinates[0], coordinates[1])
        print(f"Address for coordinates {coordinates}: {address}")