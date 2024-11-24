"use client"
import React, { useState, useEffect } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { getCategoryList, createFood, getFood, } from '@/constant/RestaurantAPI';


interface CategoryProp {
    categoryId: string,
    name: string,
    totalFoodAmount: number,
}
const AddNewProductPage = () => {
    const [category, setCategory] = useState<CategoryProp[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [foodImage, setFoodImage] = useState<string | null>(null);
    const [foodName, setFoodName] = useState<string>('');
    const [foodDescription, setFoodDescription] = useState<string>('');
    const [foodPrice, setFoodPrice] = useState<string>("");

    const [reload, setReload] = useState(false);

    // convert image to base64 and set into foodImage
    const handleFoodImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoodImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAddNewProduct = () => {
        const data = {
            categoryId: selectedCategory,
            name: foodName,
            description: foodDescription,
            price: foodPrice,
            imageLink: foodImage,
        }
        console.log(data);
        createFood(data)

    }
    const resetData = () => {
        setReload(!reload);
        setSelectedCategory("")
        setFoodImage(null);
        setFoodName("");
        setFoodDescription("");
        setFoodPrice("");
    }
    // fetching category list for user to select
    useEffect(() => {
        const saveCategoryList = async () => {
            setCategory(await getCategoryList())
            console.log(getCategoryList())
        }
        saveCategoryList()
    }, []);

    return (
        <div>
            <div className="h-full w-full bg-white shadow-lg rounded-2xl p-6" key={reload ? 'reload-true' : 'reload-false'}>
                <h1 className="text-2xl font-semibold">Thêm sản phẩm</h1>
                <div className="flex flex-col gap-4 mt-4">
                    <label className="font-semibold">Loại sản phẩm</label>
                    <select
                        className="p-2 border rounded"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Chọn loại sản phẩm</option>
                        {category.map((category) => (
                            <option key={category.categoryId} value={category.categoryId} >{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <label className="font-semibold">Tên sản phẩm</label>
                    <input type="text" className="p-2 border rounded" placeholder="Nhập tên sản phẩm" onChange={(e) => setFoodName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <label className="font-semibold">mô tả sản phẩm</label>
                    <textarea className="p-2 border rounded h-32" placeholder="Nhập mô tả về sản phẩm" onChange={(e) => setFoodDescription(e.target.value)}></textarea>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <label className="font-semibold">Giá sản phẩm</label>
                    <input type="number" className="p-2 border rounded" placeholder="Nhập giá sản phẩm" onChange={(e) => setFoodPrice(e.target.value)} />
                </div>
                <div className="flex flex-col gap-4 mt-4 w-full">
                    <label className="font-semibold">Ảnh sản phẩm</label>
                    <div className="flex items-center w-full gap-10 border p-2 rounded">
                        <div className=" relative h-24 w-24">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFoodImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {foodImage ? (
                                <img src={foodImage} alt="Profile" className="h-24 w-24 object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-24 w-24 border-dashed border-2 rounded-md gap-2">
                                    <AiOutlineCloudUpload className="text-4xl text-red-600" />
                                    <p className="text-red-600 text-sm">Thêm ảnh</p>
                                </div>
                            )}
                        </div>
                        <ul className="text-gray-500 text-sm w-[32rem]">
                            <li>Tải ảnh lên hình ảnh 1:1</li>
                            <li>Ảnh sản phẩm sẽ được hiển thị tại các trang: Cửa hàng, Gợi ý hôm nay,... Việc sử dụng ảnh sản phẩm đẹp sẽ thu hút thêm lượt truy cập vào cửa hàng của bạn</li>
                        </ul>
                    </div>
                </div>
                {/* Fixed Bottom Navbar */}
                <div className="w-full border-t p-4 px-16 flex justify-end space-x-4">
                    <button onClick={resetData} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Hủy</button>
                    <button onClick={handleAddNewProduct} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default AddNewProductPage;