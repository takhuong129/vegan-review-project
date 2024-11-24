"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
function Page() {
    const [pagination, setPagination] = useState({ pageNumber: "1", itemPerPage: "10" });
    const [product, setProduct] = useState<string[]>([]);

    const checkApi = async () => {
        try {
            const token = Cookies.get('token')
            console.log(token)
            const res = await fetch('http://127.0.0.1:8080/api/user/get_user', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (res.ok) {
                setProduct(data); // Adjust based on the response structure
                console.log(data.userData.restaurantId);
            } else {
                console.log(data.error)

            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        checkApi();
    }, []);

    return (
        <div>

        </div>
    );
}

export default Page;
