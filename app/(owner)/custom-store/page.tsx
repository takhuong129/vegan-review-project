"use client"
import React, { useState } from 'react';
import { DeliveryLink, deliveryCompanies } from '@/constant/DeliveryLink';
import { ImageUpload } from '@/components/ImageUpload';
import { AddressData } from '@/constant/AddressData';
import { createRestaurant } from '@/constant/RestaurantAPI';
import { Flags } from '@/constant/CountryFlag';

const CustomStorePage = () => {
    const [storeName, setStoreName] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [collectionImages, setCollectionImages] = useState<string[]>(new Array(4).fill(null));
    const [countryFlag, setCountryFlag] = useState<string>("");
    const [categoryDesc, setCategoryDesc] = useState<string>()
    const [branches, setBranches] = useState<number>(1);
    const [addresses, setAddresses] = useState([{ addressText: "", branchName: "" }]);
    const [hours, setHours] = useState<string>("");
    const [openDays, setOpenDays] = useState<string>("");
    const [highPrice, setHighPrice] = useState<string>("");
    const [lowPrice, setLowPrice] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [cuisineType, setCuisineType] = useState<string>("");
    const [isVegan, setIsVegan] = useState<boolean>(false);
    const [takeout, setTakeout] = useState<boolean>(false);
    const [dineIn, setDineIn] = useState<boolean>(false);
    const [buffet, setBuffet] = useState<boolean>(false);
    const [deliveryLinks, setDeliveryLinks] = useState<DeliveryLink[]>([{ company: "", link: "" }]);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

    //separate var
    const [reload, setReload] = useState(false);

    const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numberOfBranches = parseInt(e.target.value, 10) || 1;
        setBranches(numberOfBranches);
        setAddresses(Array(numberOfBranches).fill(''));
    };

    const handleAddressChange = (index: number, field: keyof AddressData, value: string) => {
        const newAddresses = [...addresses];
        newAddresses[index] = {
            ...newAddresses[index],
            [field]: value,
            branchName: ""    // Always set branch_name as empty
        }
        setAddresses(newAddresses);
    };
    const handleLinkChange = (index: number, field: keyof DeliveryLink, value: string) => {
        const newLinks = [...deliveryLinks];
        newLinks[index][field] = value;
        setDeliveryLinks(newLinks);
    };

    const addLink = () => {
        setDeliveryLinks([...deliveryLinks, { company: "", link: "" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = deliveryLinks.filter((_, i) => i !== index);
        setDeliveryLinks(newLinks);
    };
    const handlePaymentChange = (method: string) => {
        setPaymentMethods((prevMethods) =>
            prevMethods.includes(method)
                ? prevMethods.filter((m) => m !== method)
                : [...prevMethods, method]
        );
    };
    const handleCountryChange = (newCountry: string) => {
        setCuisineType(newCountry);
        const flagLink = (newCountry: string) => {
            const flag = Flags.find(flag => flag.alt === newCountry);
            return flag?.link || "";
        }
        setCountryFlag(flagLink);
    };

    const resetData = () => {
        setReload(!reload);
        setStoreName("")
        setPhoneNumber("")
        setCountryFlag("")
        setAddresses([])
        setBranches(1)
        setBuffet(false)
        setCategoryDesc("")
        setCuisineType("")
        setBuffet(false)
        setDineIn(false)
        setTakeout(false)
        setIsVegan(false)
        setDeliveryLinks([{ company: "", link: "" }])
        setHours("")
        setOpenDays("")
        setLowPrice("")
        setHighPrice("")
        setPaymentMethods([])
        setProfileImage(null);
        setCollectionImages(new Array(4).fill(null));
    }
    const cuisineOptions = [
        "Việt Nam", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Thái",
        "Ý", "Pháp", "Mê Xi Cô", "Ấn Độ", "Mỹ",
        "Tây Ban Nha", "Đức", "Nga"
    ];
    const daysOfWeek = [
        "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"
    ];
    const handleSubmitStore = async () => {
        const data = {
            name: storeName,
            categoryDescription: categoryDesc,
            addressCollection: addresses,
            openHours: hours,
            openDays: openDays,
            highestPrice: highPrice,
            lowestPrice: lowPrice,
            phoneNumber: phoneNumber,
            foodCountryType: cuisineType,
            pureVegan: isVegan,
            takeAway: takeout,
            dineIn: dineIn,
            buffet: buffet,
            deliveryCollection: deliveryLinks,
            paymentMethod: paymentMethods,
            profileImageLink: profileImage,
            promoImageCollection: collectionImages,
            foodCountryImageLink: countryFlag
        };
        console.log(data)
        createRestaurant(data)
    }
    return (
        <div>
            <div className="h-full w-full bg-white shadow-lg rounded-2xl p-6">
                <div className="grid grid-cols-1 gap-6 pb-20" key={reload ? 'reload-true' : 'reload-false'}>
                    <h1 className="text-2xl font-semibold">Thông tin cửa hàng</h1>
                    {/* Store Name */}
                    <div>
                        <label className="font-semibold">Tên cửa hàng:</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Nhập tên cửa hàng" onChange={(e) => setStoreName(e.target.value)} />
                    </div>

                    {/* Number of Branches */}
                    <div>
                        <label className="font-semibold">Số chi nhánh:</label>
                        <input
                            type="number"
                            value={branches}
                            onChange={handleBranchChange}
                            className="w-full p-2 border rounded excluded"
                            placeholder="Nhập số chi nhánh"
                        />
                    </div>

                    {/* Branch Addresses */}
                    <div>
                        <label className="font-semibold">Địa chỉ chi nhánh:</label>
                        {Array.from({ length: branches }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                value={addresses[index]?.addressText || ""}
                                onChange={(e) => handleAddressChange(index, "addressText", e.target.value)}
                                className="w-full p-2 border rounded mt-2"
                                placeholder={`Địa chỉ chi nhánh ${index + 1}`}
                            />
                        ))}
                    </div>
                    {/* Phone Number */}
                    <div>
                        <label className="font-semibold">Số điện thoại:</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Nhập số điện thoại" onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    {/* Opening and Closing Hours */}
                    <div>
                        <label className="font-semibold">Thời gian mở và đóng cửa:</label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Opening Time */}
                            <div>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setHours(prev => `${e.target.value} - ${prev.split(" - ")[1] || ""}`)}
                                >
                                    <option value="">Chọn giờ mở cửa</option>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                            {`${i.toString().padStart(2, '0')}:00`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Closing Time */}
                            <div>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setHours(prev => `${prev.split(" - ")[0] || ""} - ${e.target.value}`)}
                                >
                                    <option value="">Chọn giờ đóng cửa</option>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                            {`${i.toString().padStart(2, '0')}:00`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Open Days */}
                    <div className="mt-4">
                        <label className="font-semibold">Ngày mở cửa và đóng cửa trong tuần:</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setOpenDays(prev => `${e.target.value} - ${prev.split(" - ")[1] || ""}`)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Chọn ngày mở cửa</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setOpenDays(prev => `${prev.split(" - ")[0] || ""} - ${e.target.value}`)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Chọn ngày đóng cửa</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Price Range */}
                    <div>
                        <label className="font-semibold">Giá tiền dao động:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                placeholder="Giá thấp nhất"
                                onChange={(e) => setLowPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                placeholder="Giá cao nhất"
                                onChange={(e) => setHighPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Cuisine Type */}
                    <div>
                        <label className="font-semibold">Thức ăn thuộc quốc gia nào:</label>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => {
                                const selectedFlag = Flags.find(flag => flag.link === e.target.value);
                                if (selectedFlag) {
                                    setCuisineType(selectedFlag.alt);
                                    setCountryFlag(selectedFlag.link);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Chọn quốc gia</option>
                            {Flags.map((flag) => (
                                <option key={flag.alt} value={flag.link}>
                                    {flag.alt}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Options (Checkboxes) */}
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="font-semibold mr-2">Thuần chay:</label>
                            <input type="checkbox" className="w-6 h-6" onChange={(e) => setIsVegan(e.target.checked)} />
                        </div>
                        <div>
                            <label className="font-semibold mr-2">Mang đi:</label>
                            <input type="checkbox" className="w-6 h-6" onChange={(e) => setTakeout(e.target.checked)} />
                        </div>
                        <div>
                            <label className="font-semibold mr-2">Ăn tại chỗ:</label>
                            <input type="checkbox" className="w-6 h-6" onChange={(e) => setDineIn(e.target.checked)} />
                        </div>
                        <div>
                            <label className="font-semibold mr-2">Buffet:</label>
                            <input type="checkbox" className="w-6 h-6" onChange={(e) => setBuffet(e.target.checked)} />
                        </div>
                    </div>
                    {/* Payment Methods */}
                    <div>
                        <label className="font-semibold">Phương thức thanh toán:</label>
                        <div className="flex flex-col">
                            {["tiền mặt", "chuyển khoản", "ví điện tử"].map((method) => (
                                <label key={method} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={paymentMethods.includes(method)}
                                        onChange={() => handlePaymentChange(method)}
                                        className="mr-2"
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Delivery Service Link */}
                    <div>
                        <label className="font-semibold">Dịch vụ mang đi:</label>
                        {deliveryLinks.map((link, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <select
                                    className="w-full p-2 border rounded"
                                    value={link.company}
                                    onChange={(e) => handleLinkChange(index, 'company', e.target.value)}
                                >
                                    <option value="">Chọn công ty giao hàng</option>
                                    {deliveryCompanies.map((company, idx) => (
                                        <option key={idx} value={company}>{company}</option>
                                    ))}
                                </select>
                                <input
                                    type="url"
                                    className="w-full p-2 border rounded"
                                    placeholder="Link của dịch vụ giao hàng"
                                    value={link.link}
                                    onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                                />
                                <button onClick={() => removeLink(index)} className="bg-red-500 text-white px-2 rounded">X</button>
                            </div>
                        ))}
                        <button onClick={addLink} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Thêm Link</button>
                    </div>
                </div>
            </div>
            <div className="h-full w-full bg-white shadow-lg rounded-2xl p-6 mt-6" key={reload ? 'reload-true' : 'reload-false'}>
                <h1 className="text-2xl font-semibold pt-4 pb-12">Giới thiệu cửa hàng</h1>
                {/*Upload image */}
                <ImageUpload
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    collectionImages={collectionImages}
                    setCollectionImages={setCollectionImages}
                />
                {/*Store description */}
                <div className="flex mt-10">
                    <h1 className="w-60 font-medium">*Giới thiệu về cửa hàng</h1>
                    <textarea rows={10} className="w-full p-2 border-2 rounded" placeholder="Giới thiệu đôi chút về cửa hàng" onChange={(e) => setCategoryDesc(e.target.value)} />
                </div>
            </div>
            {/* Fixed Bottom Navbar */}
            <div className="fixed bottom-0 left-2 w-full bg-gray-100 border-t p-4 px-16 flex justify-end space-x-4">
                <button onClick={resetData} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Hủy</button>
                <button onClick={handleSubmitStore} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Lưu</button>
            </div>
        </div>
    );
};

export default CustomStorePage;
