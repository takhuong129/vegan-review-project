import Cookies from "js-cookie"
const token = Cookies.get('token')
//CheckLogin
export const getAuth = async () => {
    if (!token) return false
    const response = await fetch('http://127.0.0.1:8080/api/user/get_auth', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    if (response.ok) {
        return true
    }
}
//Get user data
export const getUserData = async () => {
    const response = await fetch('http://127.0.0.1:8080/api/user/get_user', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (response.ok) {
        return data.userData
    } else {
        console.log(data.error)
    }
}

// update user data 
export const updateUser = async (updatedData: any) => {
    const response = await fetch('http://127.0.0.1:8080/api/user/update_user', {
        method: 'PATCH',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    const data = await response.json()
    if (response.ok) {
        return data.message
    } else {
        console.log(data.error)
    }
}
// get authentication data
export const getAuth2 = async () => {
    const response = await fetch('http://127.0.0.1:8080/api/user/get_auth', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    if (response.ok) {
        const data = await response.json()
        return data.authData.username
    }
}
// update authentication
export const updateAuth = async (updateData: any) => {
    const response = await fetch('http://127.0.0.1:8080/api/user/update_auth', {
        method: 'PATCH',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    })
    if (response.ok) {
        const data = await response.json()
        return data.error
    }
}

//Get Restaurant Home Info
export const getRestaurantHome = async (pageNumber: number, itemPerPage: number) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/home/info_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageNumber, itemPerPage }),

    });
    const data = await response.json();
    if (response.ok) return data.totalRestaurantInfoList

}
// Get Restaurant Detail Info
export const getRestaurantDetail = async (restaurantId: string) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    if (response.ok) return data.restaurantInfo
}
//Filter Restaurants
export const getFilterRestaurant = async (filterData: any) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/home/filtered_info_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterData),
    })
    const data = await response.json();
    if (response.ok) return data.filteredRestaurantInfoOption

}

// Get list of restaurants from search
export const getSearchRestaurant = async (keyword: string) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/home/searched_info_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: keyword }),
    })
    const data = await response.json();
    if (response.ok) return data.searchedRestaurantInfoList

}
// Get Categories 
export const getCategories = async (restaurantId: string) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    if (response.ok) return data.restaurantCategories

}

// Get Categories 
export const getFoods = async (restaurantId: string) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}/foods`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    if (response.ok) return data.restaurantFoods

}

//create comment and rating (layer1)
export const createReview = async (restaurantId: string, rateData: any) => {
    const token = Cookies.get('token')
    if (!token) return console.log("Token was not found")
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}/review_rating`, {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rateData),
    })
    const data = await response.json();
    if (response.ok) return data.message

}

//create comment (layer2)
export const createComment = async (restaurantId: string, commentData: any) => {
    const token = Cookies.get('token')
    if (!token) return console.log("Token was not found")
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}/review_comment`, {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    })
    const data = await response.json();
    if (response.ok) return data.message

}
//get comment and rating 
export const getReview = async (restaurantId: string) => {
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${restaurantId}/reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    if (response.ok) return data.reviews

}