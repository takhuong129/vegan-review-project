export interface userData {
    email: string;
    profileImageLink: string;
    phoneNumber: string;
    address: string;
    fullName: string;
}

export interface DeliveryLink {
    company: string;
    link: string;
}

export interface AddressData {
    addressText: string;
    mapLocation: string;
    branchName: string;
}

export interface StoreData {
    restaurantId: string;
    name: string;
    categoryDescription: string;
    profileImageLink: string;
    promoImageCollection: string[];
    addressCollection: AddressData[];
    openHours: string;
    openDays: string;
    highestPrice: number;
    lowestPrice: number;
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

export interface filterRestaurant {
    pureVegan: boolean;
    takeAway: boolean;
    dineIn: boolean;
    buffet: boolean;
    foodCountryTypes: string;
    deliveryTypes: string[];
    priceOver: string;
    priceUnder: string;
}

export interface MenuData {
    categoryId: string;
    description: string;
    foodId: string;
    name: string;
    price: number;
    imageLink: string;
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