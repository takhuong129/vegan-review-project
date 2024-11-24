import React from 'react'
import ImageLoader from '@/components/ImageLoader';
import { IoIosStar } from "react-icons/io";
import { SlTag } from "react-icons/sl";
import { StoreData } from '@/container/RestaurantData';
interface StoreProp {
    store: StoreData

}
const StoreTest: React.FC<StoreProp> = ({ store }) => {
    return (
        <div className="flex flex-col items-center justify-center hover: cursor-pointer">
            <div className="relative flex justify-center items-center">
                <ImageLoader
                    path={store.profileImageLink}
                    alt="item"
                    width={250}
                    height={250}
                    className="rounded-xl transition duration-100 hover:scale-105"
                    cloudinaryAttributes={{
                        crop: "fill", // Ensure the image fills the container
                        gravity: "auto", // Adjust gravity as needed
                        quality: "auto", // Let Cloudinary determine the optimal quality
                        fetch_format: "auto", // Let Cloudinary determine the optimal format
                    }}
                />
                {store.pureVegan && (
                    <div className="absolute bottom-4 right-4 p-2 rounded-badge bg-custom-green-light tooltip" data-tip="chứng nhận thuần chay">
                        <ImageLoader
                            path="v1720186874/Vegan_Certification_h8z6cd.png"
                            alt="certificate"
                            width={32}
                            height={32}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center mt-4">
                <h3 className="text-lg font-bold">{store.name}</h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-center gap-2 tooltip" data-tip="số sao đánh giá">
                        <h3 className="text-md">4.9</h3>
                        <IoIosStar className="text-xl text-yellow-400" />
                    </div>
                    <div className="flex items-center justify-center gap-2 tooltip" data-tip="ẩm thực các nước">
                        <ImageLoader
                            path={store.foodCountryImageLink}
                            alt="item"
                            width={32}
                            height={32}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 tooltip" data-tip="giá" >
                        <SlTag className="text-xl text-custom-green" />
                        <h3 className="text-md">{store.lowestPrice / 1000}K~{store.highestPrice / 1000}K</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreTest