import React from 'react'
import ImageLoader from '../ImageLoader';
import { MenuData } from '@/container/RestaurantData'
interface MenuProp {
    menu: MenuData

}
const Menu: React.FC<MenuProp> = ({ menu }) => {
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return (
        <div className="flex flex-col items-center justify-center hover: cursor-pointer tooltip" data-tip={menu.description}>
            <div className="relative flex justify-center items-center">
                <ImageLoader
                    path={menu.imageLink}
                    alt="item"
                    width={200}
                    height={200}
                    className="rounded-xl transition duration-100 hover:scale-105"
                    cloudinaryAttributes={{
                        crop: "fill", // Ensure the image fills the container
                        gravity: "auto", // Adjust gravity as needed
                        quality: "auto", // Let Cloudinary determine the optimal quality
                        fetch_format: "auto", // Let Cloudinary determine the optimal format
                    }}
                />
            </div>
            <div className="flex flex-col items-center mt-4 tooltip" data-tip={`${menu.description}`}>
                <h3 className="text-md">{menu.name}</h3>
                <h3 className="text-md">{formatNumber(Number(menu.price))}</h3>
            </div>
        </div>
    );
};

export default Menu