"use client";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getRestaurantInfo } from '@/constant/RestaurantAPI';
import { restaurantData } from '@/constant/RestaurantData';
import ImageLoader from '@/components/ImageLoader';
import { FaRegEye } from "react-icons/fa";

const DisplayStorePage = () => {
    const [restaurantData, setRestaurantData] = useState<restaurantData | null>(null)

    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    useEffect(() => {
        const fetchRestaurantData = async () => {
            const data = await getRestaurantInfo()
            console.log(data)
            setRestaurantData(data);
        };

        fetchRestaurantData();
    }, []);

    if (!restaurantData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-5 h-full w-full bg-white shadow-lg rounded-2xl p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">{restaurantData.name}</h1>
                    <p className="text-gray-600 max-w-[100rem]">{restaurantData.categoryDescription}</p>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold mb-2">Ảnh chính</h1>
                    <div className="w-[12rem] h-[12rem]">
                        <ImageLoader
                            path={restaurantData.profileImageLink}
                            alt={restaurantData.name}
                            width={192}
                            height={192}
                            cloudinaryAttributes={{
                                crop: "fill",
                                gravity: "auto",
                                quality: "auto",
                                fetch_format: "auto",
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold mb-2">Ảnh phụ</h1>
                    <div className="flex items-center gap-6">
                        {restaurantData.promoImageCollection.map((image, index) => (
                            <div className="w-[10rem] h-[10rem]" key={index}>
                                <ImageLoader
                                    path={image}
                                    alt={restaurantData.name}
                                    width={192}
                                    height={192}
                                    cloudinaryAttributes={{
                                        crop: "fill",
                                        gravity: "auto",
                                        quality: "auto",
                                        fetch_format: "auto",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold">Địa chỉ chi nhánh</h2>
                    {restaurantData.addressCollection.map((address, index) => (
                        <p key={index}>{address.addressText}</p>
                    ))}
                </div>
                <div>
                    <h2 className="font-semibold">Chi tiết liên hệ</h2>
                    <p>Điện thoại: {restaurantData.phoneNumber}</p>
                    <p>Quốc gia: {restaurantData.foodCountryType}</p>
                    <ImageLoader path={restaurantData.foodCountryImageLink} alt={restaurantData.foodCountryType} width={32} height={32} />
                </div>
                <div>
                    <h2 className="font-semibold">Giờ mở cửa</h2>
                    <p>{restaurantData.openHours} ({restaurantData.openDays})</p>
                </div>

                <div>
                    <h2 className="font-semibold">Giá cả</h2>
                    <p>Giá thấp nhất: {formatNumber(Number(restaurantData.lowestPrice))} VND</p>
                    <p>Giá cao nhất: {formatNumber(Number(restaurantData.highestPrice))} VND</p>
                </div>

                <div>
                    <h2 className="font-semibold">Các tùy chọn giao hàng</h2>
                    {restaurantData.deliveryCollection.map((delivery, index) => (
                        <p key={index}>{delivery.company}: <a href={delivery.link} target="_blank" className="text-blue-500 underline">{delivery.link}</a></p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DisplayStorePage;
