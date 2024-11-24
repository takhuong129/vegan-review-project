"use client"
import React, { useState } from 'react'
import StoreTest from '@/components/test component/StoreTest'
import { getRestaurantHome } from '@/container/RestaurantAPI'
import { StoreData } from '@/container/RestaurantData'
import StoreSliderTest from '@/components/test component/StoreSliderTest'
const TestPage = () => {
    /*
    const [storeList, setStoreList] = useState<StoreData[]>([]);
    const handleGetRestaurant = async () => {
        const data = await getRestaurantHome(1, 7);
        console.log(data)
        setStoreList(data)

    }*/
    return (
        <div>
            <h1>this is store test page</h1>
            {/** 
            <button onClick={handleGetRestaurant}>click</button>
            {storeList.map((store, index) => (
                <div key={index}>
                    <StoreTest store={store} />
                </div>
            ))}*/}
        </div>
    )
}

export default TestPage