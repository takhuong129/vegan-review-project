import Cookies from "js-cookie";

const token = Cookies.get('token');
// ID of the restaurant

const getRestaurantID = async () => {
    const response = await fetch('http://127.0.0.1:8080/api/user/get_user', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (response.ok) {
        return data.userData.restaurantId
    } else {
        console.log(data.error)
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
export const getAuth = async () => {
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
//update restaurant data
export const createRestaurant = async (data: any) => {
    if (!token) return console.log("cannot retrieve token")

    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data.message)
        alert(data.message)
    } else {
        console.error('Error fetching data');
    }

}

export const getRestaurantInfo = async () => {
    if (!token) return console.log("cannot retrieve token")

    const resID = await getRestaurantID();
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data.restaurantInfo
    } else {
        console.error('Error fetching data');
    }
}

// get category list
export const getCategoryList = async () => {
    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json()
        return data.restaurantCategories
    }
}
// create food from category id
export const createFood = async (foodData: any) => {
    if (!token) return console.log("cannot retrieve token")
    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}/foods`, {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
    })
    if (response.ok) {
        const data = await response.json()
        alert(data.message)
    }
}

// get food list 
export const getFood = async () => {
    if (!token) return console.log("cannot retrieve token")
    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}/foods`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (response.ok) {
        const data = await response.json()
        return data.restaurantFoods
    }
}
// get review list
export const getReview = async () => {
    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}/reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    if (response.ok) return data.reviews

}


//create comment (layer2)
export const createComment = async (commentData: any) => {
    const token = Cookies.get('token')
    if (!token) return console.log("Token was not found")
    const resID = await getRestaurantID()
    const response = await fetch(`http://127.0.0.1:8080/api/restaurant/${resID}/review_comment`, {
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