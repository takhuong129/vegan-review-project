"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

import { GrNext } from "react-icons/gr";
import { StoreData } from "@/container/RestaurantData";
import { getRestaurantHome } from "@/container/RestaurantAPI";
import Store from "./Store";

const StoreSlider: React.FC = () => {
    const [storeList, setStoreList] = useState<StoreData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: {
            perView: 4,
            spacing: 15,
        },
    });
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const data = await getRestaurantHome(1, 6); // Wait for the API response
                setStoreList(data); // Set the store list
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
                setIsLoading(false); // Handle loading state even if an error occurs
            }
        }
        fetchRestaurant()
    }, []); // Adding an empty dependency array to run the effect only once
    if (isLoading) {
        return (
            <div>
                <button className="btn btn-square">
                    <span className="loading loading-spinner"></span>
                </button>
            </div>)
    }
    return (
        <div className="flex items-center w-full ">
            <button
                className="bg-white p-2 rounded-full shadow-lg border-4 border-black outline-none hover:opacity-60"
                onClick={() => instanceRef.current?.prev()}
            >
                <GrNext className="text-4xl rotate-180" />
            </button>
            <div ref={sliderRef} className="keen-slider flex-1 mx-4">
                {storeList.map((store, index) => (
                    <div key={index} className="keen-slider__slide">
                        <Link key={store.restaurantId} href={`/store/${store.restaurantId}`}>
                            <Store store={store} />
                        </Link>
                    </div>
                ))}
            </div>
            <button
                className="bg-white p-2 rounded-full shadow-lg border-4 border-black outline-none hover:opacity-60"
                onClick={() => instanceRef.current?.next()}
            >
                <GrNext className="text-4xl" />
            </button>
        </div>
    );
};

export default StoreSlider;