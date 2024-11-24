import { DeliveryLink } from "./DeliveryLink";
import { AddressData } from "./AddressData";
export interface userData {
    email: string;
    profileImageLink: string;
    phoneNumber: string;
    address: string;
    fullName: string;
}

export interface restaurantData {
    name: string;
    restaurantId: string;
    categoryDescription: string;
    profileImageLink: string;
    promoImageCollection: string[];
    addressCollection: AddressData[];
    openHours: string;
    openDays: string;
    highestPrice: string;
    lowestPrice: string;
    phoneNumber: string;
    foodCountryType: string;
    pureVegan: boolean;
    takeAway: boolean;
    dineIn: boolean;
    buffet: boolean;
    deliveryCollection: DeliveryLink[];
    paymentMethod: string[];
    foodCountryImageLink: string;
}
export interface FoodData {
    name: string;
    description: string;
    price: string;
    imageLink: string;
    foodId: string;

}
export interface ReviewData {
    ratingId: string; // ID of the rating
    ratingAmount: number; // Rating value
    ratingText: string; // Text content of the rating
    dateCreated: string; // Date the rating was created
    userId: string; // ID of the user who submitted the rating
    username: string; // Username of the user
    userImage: string; // URL of the user's profile image
    userType: string; // Type of the user (e.g., "owner_other")
    countComment: number; // Number of comments on this rating
    comments: CommentData[]; // Array of comments associated with this rating
}

export interface CommentData {
    commentId: string; // ID of the comment
    commentText: string; // Text content of the comment
    dateCreated: string; // Date the comment was created
    userId: string; // ID of the user who submitted the comment
    username: string; // Username of the user
    userImage: string; // URL of the user's profile image
    userType: string; // Type of the user (e.g., "owner_other")
}
