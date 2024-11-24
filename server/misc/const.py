from enum import Enum

class CollectionName:
    DinerData = 'diner_data'
    DinerAuthentication = 'diner_auth'
    OwnerData = 'owner_data'
    OwnerAuthentication = 'owner_auth'
    RestaurantData = 'restaurant_data'
    RestaurantCategory = 'restaurant_category'
    RestaurantFood = 'restaurant_food'
    ReviewManager = 'review_manager'
    ReviewRating = 'review_rating'
    ReviewComment = 'review_comment'
    # Originally, we allow user to create their own category, until we dont
    RestaurantCategoryNames = ["Món chính", "Món phụ", "Tráng miệng", "Đồ uống", "Đặc biệt", "Combo"]


class ResponseKey:
    """
    Use for returning jsonify key
    """
    Token = 'token'
    Message = 'message'
    Error = 'error'
    UserID = 'userId'
    Users = 'users'
    RestaurantID = 'restaurantId'
    RestaurantInfo = 'restaurantInfo'
    RestaurantFoods = 'restaurantFoods'
    RestaurantCategories = 'restaurantCategories'
    TotalRestaurantCountInfo = 'totalRestaurantInfoAmount'
    TotalRestaurantCountFoods= 'totalRestaurantFoodAmount'
    TotalRestaurantListInfo = 'totalRestaurantInfoList'
    TotalRestaurantListFoods= 'totalRestaurantFoodList'
    FilteredRestaurantInfoOption = 'filteredRestaurantInfoOption'
    SearchedRestaurantInfo = 'searchedRestaurantInfoList'
    Reviews = 'reviews'
    ReviewManager = 'reviewManager'
    KeyUser = 'userData'
    KeyAuth = 'authData'


class AuthenticationType:
    Base = 'base'
    Google = 'google'


class UserType:
    Diner = 'diner'
    Owner = 'owner'

class ReviewUserType:
    Diner = 'diner'
    OwnerOther = 'owner_other'
    OwnerSame = 'owner_same'
    
user_auth_conversion = {
    
}