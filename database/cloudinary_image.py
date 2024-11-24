"""
Use to handle all of the process that is linked to Cloudinary
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
import io
import base64
from typing import List

class CloudinaryManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(CloudinaryManager, cls).__new__(cls)
        return cls._instance

    def __init__(self, cloud_name : str, api_key : str, api_secret : str):
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )

    def upload_image(self, image_path: str, folder: str = '', public_id: str = None) -> object:
        """Uploads a single image to a specified folder in Cloudinary and returns the response."""
        response = cloudinary.uploader.upload(image_path, folder = folder, public_id = public_id)
        return response

    def upload_image_from_base64(self, base64_string: str, folder:str = '', public_id: str = None) -> object:
        """Uploads an image from base64, convert to binary before upload to directly to Cloudinary."""

        # Check if the input is a string
        if not isinstance(base64_string, str):
            raise TypeError("Expected a string for the Base64 input.")

        # Remove metadata if present (e.g., data:image/jpeg;base64,)
        if ',' in base64_string:
            base64_string = base64_string.split(',', 1)[1]  # Split only once

        # Debug: Print the length of the Base64 string
        print(f"Base64 string length: {len(base64_string)}")

        # Decode the Base64 string
        try:
            image_data = base64.b64decode(base64_string)
        except Exception as e:
            raise ValueError(f"Failed to decode Base64 string: {e}")
        
        if isinstance(image_data, bytes):
            image_file = io.BytesIO(image_data)
        else:
            return None

        return self.upload_image(image_file, folder=folder, public_id=public_id)
      
    def generate_url(self, public_id: str, width : int = None, height : str = None, crop: str ='fill'):
        """Generates a URL for a Cloudinary image with optional transformations."""
        return cloudinary.CloudinaryImage(public_id).build_url(
            width=width,
            height=height,
            crop=crop
        )
        
    def generate_db_link(self, version: str, public_id: str, format: str) -> str:
        """Generates the final part of the link onto database"""
        link = f"v{version}/{public_id}.{format}"
        return link
    
    def upload_and_get_db_link(self, image_data: object, folder:str = '', public_id: str = None) -> str:
        response = self.upload_image_from_base64(image_data, folder, public_id)
        if response is not None:
            version = response["version"]
            public_id = response["public_id"]
            format = response["format"]
            return self.generate_db_link(version, public_id, format)
        else:
            return ''
    def get_public_id(self, image_link: str) -> str:
        try:
            public_id = "/".join(image_link.split("/")[1:]).rsplit(".", 1)[0]
            print(public_id)
            return public_id
        
        except Exception as e:
            print("Error deleting image:", e)
            return ''
        
    def delete_image(self, public_id: str) -> bool:
        try:
            result = cloudinary.api.delete_resources(public_id)
            if result['deleted'].get(public_id) == 'deleted':
                print("Image deleted successfully!")
                return True
            else:
                print("Image deletion failed.")
                return False
        except Exception as e:
            print("Error deleting image:", e)
            return False
        
    def list_all_images(self) -> list[str]:
        try:
            # Retrieve resources
            response = cloudinary.api.resources(type="upload", resource_type="image", max_results=500)

            # Extract image URLs
            image_urls = [resource['public_id'] for resource in response['resources']]
            return image_urls

        except Exception as e:
            print("Error retrieving images:", e)
            return []