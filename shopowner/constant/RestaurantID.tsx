export const getRestaurantID = async (token: string) => {
    const response = await fetch('http://127.0.0.1:8080/api/user/get_user', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (response.ok) {
        return data.userData.restaurant_id
    } else {
        console.log(data.error)
    }
}