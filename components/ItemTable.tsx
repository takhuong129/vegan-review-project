"use client"
import React, { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi';
import ImageLoader from './ImageLoader';
import { vegan } from '@/constant/ImageConstant';
import Link from 'next/link';
import { getFood } from '@/constant/RestaurantAPI';
import { FoodData } from '@/constant/RestaurantData';
export const ItemTable = () => {
    const [foods, setFoods] = useState<FoodData[]>([]);
    const [search, setSearch] = useState('');
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    useEffect(() => {
        const fetchFoodList = async () => {
            setFoods(await getFood())
            //console.log(await getFood())
        }
        fetchFoodList()
    }, []);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
                {/*Searching bar and filter*/}
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-500 rounded-md px-4 py-[0.6rem] focus-within:ring-1 focus-within:ring-black">
                        <FiSearch className="text-gray-500 mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm"
                            className="w-full outline-none"
                        />
                    </div>
                    <select className="select select-bordered w-52 border-gray-500 focus-within:ring-1 focus-within:ring-black ">
                        <option disabled value="" selected>Bộ lọc</option>
                        <option>Giá cao nhất</option>
                        <option>Giá thấp nhất</option>
                        <option>Sản phẩm mới</option>
                    </select>
                </div>

                {/*Adding product*/}
                <Link href={"/add-new-product"}><button className="btn btn-wide bg-[#ff4444] text-white hover:bg-[#ED3C3C]">Thêm sản phẩm mới</button></Link>
            </div>
            {/*Products table*/}
            <table className="table min-w-full bg-white">
                <thead className="bg-gray-200 text-left text-md">
                    <tr>
                        <th className="">Tên sản phẩm</th>
                        <th className="">Giá</th>
                        <th>Mô tả</th>
                        <th className="">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food) => (
                        <tr key={food.foodId} className="border-b-1 border-gray-400">
                            <td>
                                <div className="flex items-center gap-3">
                                    <ImageLoader
                                        path={food.imageLink}  // Use food image if available, otherwise default
                                        alt={food.name}
                                        width={64}
                                        height={64}
                                        cloudinaryAttributes={{
                                            crop: "fill", // Ensure the image fills the container
                                            gravity: "auto", // Adjust gravity as needed
                                            quality: "auto", // Let Cloudinary determine the optimal quality
                                            fetch_format: "auto", // Let Cloudinary determine the optimal format
                                        }}
                                    />
                                    <p>{food.name}</p>
                                </div>
                            </td>
                            <td>{formatNumber(Number(food.price))} VND</td>
                            <td className="" >{food.description}</td>
                            <td className="flex flex-col w-32 gap-2">
                                <h3 className="text-blue-500 hover:cursor-pointer">Chỉnh sửa</h3>
                                <h3 className="text-red-600 hover:cursor-pointer">Xóa sản phẩm</h3>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
