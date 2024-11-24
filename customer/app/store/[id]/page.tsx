"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BannerDetail from '@/components/detail component/BannerDetail';
import { ImageLoader } from '@/components';
import MenuSlider from '@/components/detail component/MenuSlider';
import Rating from '@/components/detail component/Rating';
import CommentHolder from '@/components/detail component/CommentHolder';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import { IoTimeOutline } from "react-icons/io5";
import { SlTag } from "react-icons/sl";
import { IoIosStar } from "react-icons/io";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { GoInfo } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { getRestaurantDetail } from '@/container/RestaurantAPI';
import { StoreData } from '@/container/RestaurantData';
import { useRouter } from 'next/navigation';
import { RatingPopup } from '@/components/detail component/RatingPopup';

const StoreDetailPage: React.FC = () => {
    const pathname = usePathname();
    const lastSegment = (pathname.split('/').pop() ?? '') as string;
    const serviceOptions: (keyof StoreData)[] = ['takeAway', 'dineIn', 'buffet'];

    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [isRatingBoxVisible, setIsRatingBoxVisible] = useState<boolean>(false);

    // Toggle function to show or hide the search bar
    const toggleRatingBox = (): void => {
        setIsRatingBoxVisible(prevState => !prevState);
    };

    const ratingsCount = [60, 20, 15, 3, 2]; // The counts should reflect the total percentage as given
    const totalRatings = ratingsCount.reduce((a, b) => a + b, 0); // Sum of all ratings counts
    const router = useRouter();
    const navigateMenu = () => {
        router.push(`/store/${lastSegment}/menu`)
    }
    const titles = [
        'Tên cửa hàng',
        'Chứng nhận thuần chay',
        'Danh mục',
        'Quốc gia',
        'Điện thoại',
        'Địa chỉ chi nhánh',
        'Phạm vi giá',
        'Giờ Mở cửa',
        'Phương thức thanh toán',
        'Dịch vụ giao hàng',
    ];

    const dataValues = storeData ? [
        storeData.name ?? '',
        storeData.pureVegan ? 'Có chứng nhận thuần chay' : 'Không chứng nhận thuần chay',
        storeData.dineIn || storeData.buffet || storeData.takeAway ? serviceOptions
            .filter(option => storeData[option]) // Only include options that are true
            .map((option, index, filteredOptions) => (
                (option === 'takeAway' && 'Mang về') ||
                (option === 'dineIn' && 'Ăn tại quán') ||
                (option === 'buffet' && 'Buffet')
            ))
            .join(', ') : '',
        storeData.foodCountryType ?? '',
        storeData.phoneNumber ?? '',
        storeData.addressCollection?.map((address, index) => (
            <ul>
                <li key={index}>- {address.addressText}</li>
            </ul>
        )) ?? '',
        `${new Intl.NumberFormat().format(storeData.lowestPrice ?? 0)} - ${new Intl.NumberFormat().format(storeData.highestPrice ?? 0)}`,
        `${storeData.openHours ?? ''} (${storeData.openDays ?? ''})`,
        storeData.paymentMethod?.join(', ') ?? '',
        storeData.deliveryCollection?.map((delivery) => delivery.company).join(', ') ?? ''
    ] : [];

    useEffect(() => {
        console.log(lastSegment)
        try {
            const fetchStoreDetail = async () => {
                const data = await getRestaurantDetail(lastSegment);
                setStoreData(data);
                setLoading(false);
            };
            fetchStoreDetail();

        } catch (error) {
            console.error("Error fetching restaurant data:", error);
            setLoading(true);
        }
    }, [lastSegment]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <progress className="progress w-56 "></progress>
        </div>
    )

    return (
        <div className="flex flex-col px-40 py-12 w-full">
            {storeData && (
                <>
                    {/*Banner and Content info*/}
                    <div className="flex w-full justify-between gap-20">
                        <div className="w-1/2">
                            <BannerDetail bannerCollection={storeData.promoImageCollection ?? []} />
                        </div>
                        {/*Detail info section*/}
                        <div className=" w-1/2 flex flex-col gap-5">
                            <div className="flex items-start justify-between ">
                                {/*Title name of store*/}
                                <h1 className="text-2xl font-bold ">{storeData.name}</h1>
                                {/*Report and save button*/}
                                <div className="flex gap-3 hover:cursor-pointer">
                                    <span className="tooltip" data-tip="Báo cáo vi phạm">
                                        <AiOutlineExclamationCircle className="text-3xl text-red-600 " />
                                    </span>
                                    <span className="tooltip" data-tip="Lưu cửa hàng yêu thích">
                                        <CiBookmark className="text-3xl" />
                                    </span>
                                </div>
                            </div>
                            {/*Certificate section*/}
                            {storeData?.pureVegan && (
                                <div className="flex items-center justify-start gap-4">
                                    <ImageLoader
                                        path="v1720186874/Vegan_Certification_h8z6cd.png"
                                        alt="certificate"
                                        width={24}
                                        height={24}
                                    />
                                    <h3>Chứng nhận thuần chay</h3>
                                </div>
                            )}
                            {/*Address section*/}
                            <div className="flex items-center justify-start gap-4">
                                <LuMapPin className="text-2xl" />
                                {storeData.addressCollection[0] && (
                                    <h3>{storeData.addressCollection[0].addressText}</h3>
                                )}
                            </div>
                            <div className="flex items-center justify-start gap-4">
                                <IoTimeOutline className="text-2xl" />
                                <h3>{storeData.openHours} ({storeData.openDays})</h3>
                            </div>
                            {/*Country section*/}
                            <div className="flex items-center justify-start gap-4">
                                <ImageLoader
                                    path={storeData.foodCountryImageLink}
                                    alt="country"
                                    width={24}
                                    height={24} />
                                <h3>{storeData.foodCountryType}</h3>
                            </div>
                            {/*Price section*/}
                            <div className="flex items-center justify-start gap-4">
                                <SlTag className="text-xl" />
                                <h3>{storeData.lowestPrice / 1000}K ~ {storeData.highestPrice / 1000}K</h3>
                            </div>

                            {/*Rating section*/}
                            <div className="flex items-center justify-start gap-4">
                                <IoIosStar className="text-2xl text-yellow-400" />
                                <div className="flex gap-2">
                                    <h3>4.5/5.0</h3>
                                    <span className="tooltip" data-tip="Số người đánh giá">
                                        <h3 className="underline text-blue-600 hover:cursor-pointer">({totalRatings})</h3>
                                    </span>
                                </div>
                            </div>
                            {/*Phone section*/}
                            <div className="flex items-center justify-start gap-4">
                                <IoPhonePortraitOutline className="text-2xl" />
                                <h3>{storeData.phoneNumber}</h3>
                            </div>
                            {/*Tag section*/}
                            <div className="flex items-center justify-start gap-4">
                                < GoInfo className="text-2xl" />
                                <h3>
                                    {serviceOptions
                                        .filter(option => storeData[option]) // Only include options that are true
                                        .map((option, index, filteredOptions) => (
                                            <span key={index}>
                                                {option === 'takeAway' && 'Mang về'}
                                                {option === 'dineIn' && 'Ăn tại quán'}
                                                {option === 'buffet' && 'Buffet'}
                                                {index < filteredOptions.length - 1 && ', '} {/* Add a comma unless it's the last item */}
                                            </span>
                                        ))}
                                </h3>

                            </div>
                            {/*Delivery section*/}
                            <div className="flex items-center justify-start gap-4">
                                <TbTruckDelivery className="text-2xl" />
                                {storeData.deliveryCollection.map((delivery, index) => (
                                    <button key={index} className="btn btn-success bg-custom-green text-white font-normal btn-sm">{delivery.company}</button>
                                ))}
                            </div>
                        </div>
                        {/*Detail info section*/}
                    </div>
                    {/*Banner and Content info*/}
                    {/*Description section*/}
                    <div className="flex flex-col w-full mt-12 gap-5">
                        <h1 className="text-3xl font-bold">Giới Thiệu Về {storeData.name}</h1>
                        <p>{storeData.categoryDescription}</p>
                        <div className="h-[2px] bg-gray-500 w-full"></div>
                    </div>
                    {/*Description section*/}
                    {/*Menu slider section*/}
                    <div className="flex flex-col w-full mt-12 gap-5">
                        <h1 className="text-3xl font-bold mb-5">Thực đơn</h1>
                        <div>
                            <MenuSlider restaurantId={lastSegment} />
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <button onClick={navigateMenu} className="btn btn-wide bg-custom-grey text-white hover:bg-gray-700 mt-10">Xem thêm</button>
                        </div>
                    </div>
                    {/*Rating  section*/}
                    <div className="flex flex-col w-full mt-12 gap-2">
                        <h1 className="text-3xl font-bold mb-5">Đánh giá</h1>
                        <div className="">
                            <Rating rating={4.5} totalRatings={totalRatings} ratingsCount={ratingsCount} />
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-full my-2">

                        <button onClick={toggleRatingBox} className="btn btn-wide bg-yellow-500 text-white hover:bg-gray-700 mt-10">Viết bình luận</button>
                    </div>
                    {/*Rating section*/}
                    <div className="flex flex-col w-full mt-12 gap-2">
                        <div className="">
                            <CommentHolder restaurantId={lastSegment} />
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="btn btn-wide bg-custom-grey text-white hover:bg-gray-700 mt-10">Xem thêm</button>
                        </div>
                    </div>
                    {/*Info  section*/}
                    <div className="flex flex-col w-full mt-12 gap-2">
                        <h1 className="text-3xl font-bold mb-5">Thông tin</h1>
                        <div className="flex gap-4 border-t border-b p-4">
                            {/* Left Column: Store Info */}
                            <div className="w-1/2 space-y-2">
                                {titles.map((title, index) => (
                                    <div key={index} className="flex">
                                        <div className="w-1/3 font-semibold bg-yellow-100 p-2 border">{title}</div>
                                        <div className="w-2/3 p-2 border">
                                            {dataValues[index] || 'No data available'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column: Image */}
                            <div className="w-1/2 flex items-center justify-center">
                                <a href="https://shorturl.at/pZyab">
                                    <ImageLoader
                                        path='v1722315790/Capture_fiohdy.png'
                                        alt='map'
                                        width={500}
                                        height={400}
                                        cloudinaryAttributes={{
                                            crop: "fill",
                                            gravity: "auto",
                                            quality: "auto",
                                            fetch_format: "auto",
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/*Info  section*/}
                </>
            )}
            {isRatingBoxVisible && <RatingPopup onClose={toggleRatingBox} restaurantId={lastSegment} />}
        </div>
    );
};

export default StoreDetailPage;
