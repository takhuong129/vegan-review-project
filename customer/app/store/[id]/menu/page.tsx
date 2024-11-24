"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCategories, getFoods } from "@/container/RestaurantAPI";
import { MenuData } from "@/container/RestaurantData";
import Menu from "@/components/detail component/Menu";

interface CategoryProp {
    categoryId: string;
    name: string;
}

const MenuPage = () => {
    const [categories, setCategories] = useState<CategoryProp[]>([]);
    const [food, setFood] = useState<MenuData[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [loadingFoods, setLoadingFoods] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();
    const segments = pathname.split("/");
    const restaurantId = segments[2] as string;

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoadingFoods(true);
                const foods = await getFoods(restaurantId);
                setFood(foods);
            } catch (err) {
                setError("Failed to fetch foods.");
            } finally {
                setLoadingFoods(false);
            }
        };

        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const cate = await getCategories(restaurantId);
                setCategories(cate);
            } catch (err) {
                setError("Failed to fetch categories.");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
        fetchFoods();
    }, [restaurantId]);

    // If data is still loading or there is an error
    if (loadingCategories || loadingFoods) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>{error}</div>
            </div>
        );
    }

    // Filter and group food by category
    const groupedFood = categories.map((category) => ({
        ...category,
        foods: food.filter((menu) => menu.categoryId === category.categoryId),
    }));

    return (
        <div className="px-40 py-12 w-full">
            {groupedFood.map((group) => (
                <div key={group.categoryId} className="mb-10">
                    <h2 className="flex items-center justify-center text-2xl text-white font-bold mb-4 p-2 bg-green-800 rounded-md">{group.name}</h2>
                    <div className="grid grid-cols-5 gap-6">
                        {group.foods.map((menu, index) => (
                            <div key={index}>
                                <Menu menu={menu} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuPage;
