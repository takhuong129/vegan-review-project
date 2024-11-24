import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface ImageUploadProps {
    profileImage: string | null;
    setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
    collectionImages: string[];
    setCollectionImages: React.Dispatch<React.SetStateAction<string[]>>;
}
export const ImageUpload: React.FC<ImageUploadProps> = ({ profileImage, setProfileImage, collectionImages, setCollectionImages }) => {

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCollectionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedImages = [...collectionImages];
                updatedImages[index] = reader.result as string;
                setCollectionImages(updatedImages);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* Profile Image Upload Row */}
            <div className="flex items-start gap-4">
                <h1 className="w-48 font-medium">*Hình ảnh cửa hàng</h1>
                <div className="relative h-24 w-24">
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleProfileImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-24 w-24 object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-24 w-24 border-dashed border-2 rounded-md gap-2">
                            <AiOutlineCloudUpload className="text-4xl text-red-600" />
                            <p className="text-red-600 text-sm">Thêm ảnh</p>
                        </div>
                    )}
                </div>
                <ul className="text-gray-500 text-sm w-[23rem]">
                    <li>Tải ảnh lên hình ảnh 1:1</li>
                    <li>Ảnh bìa sẽ được hiển thị tại các trang: Kết quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn</li>
                </ul>
            </div>

            {/* Collection Images Upload Row */}
            <div className="flex items-start gap-4 mt-10">
                <h1 className="w-48 font-medium">*Hình ảnh cửa hàng</h1> {/* Fixed width for title */}
                <div className="flex gap-2">
                    {collectionImages.map((image, index) => (
                        <div key={index} className="h-24 w-24 relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleCollectionImageChange(index, e)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {image ? (
                                <img src={image} alt={`Collection ${index}`} className="h-24 w-24 object-cover" />
                            ) : (
                                <div className="flex flex-col h-24 w-24 items-center justify-center border-dashed border-2 rounded-md gap-2 ">
                                    <AiOutlineCloudUpload className="text-4xl text-red-600" />
                                    <p className="text-red-600 text-sm ">Thêm ảnh</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};