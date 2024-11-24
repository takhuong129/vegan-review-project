"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "./Menu";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { GrNext } from "react-icons/gr";
import { MenuData } from "@/container/RestaurantData";
import { getFoods } from "@/container/RestaurantAPI";
interface MenuSliderProps {
    restaurantId: string;
}
const MenuSlider: React.FC<MenuSliderProps> = ({ restaurantId }) => {
    const [food, setFood] = useState<MenuData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: {
            perView: 5,
            spacing: 15,
        },
    });
    useEffect(() => {
        const fetchFoods = async () => {
            const foods = await getFoods(restaurantId);
            setFood(foods);
            setIsLoading(false);
            if (instanceRef.current) {
                instanceRef.current.update();
            }
        }
        fetchFoods();
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
                {food?.map((items, index) => (
                    <div key={index} className="keen-slider__slide">
                        <Menu menu={items} />
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

export default MenuSlider;
