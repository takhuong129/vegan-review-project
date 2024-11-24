import React, { useEffect, useState } from 'react';
import ImageLoader from '../ImageLoader';
import { StoreData } from '@/container/RestaurantData';
interface InfoDetail {
    storeData: StoreData;
}

const InfoDetailComponent: React.FC<InfoDetail> = ({ storeData }) => {
    const [data, setData] = useState<InfoDetail | null>(null);

    const titles = [
        'Tên cửa hàng',
        'Chứng nhận thuần chay',
        'Danh mục',
        'Điện thoại',
        'Địa chỉ',
        'Phạm vi giá',
        'Giờ Mở cửa',
        'Phương thức thanh toán',
        'Dịch vụ giao hàng',
    ];

    const dataValues = [
        storeData.name,
        storeData.pureVegan ? 'Có' : 'Không',
        storeData.categoryDescription,
        storeData.phoneNumber,
        storeData.addressCollection.map((address) => address.addressText).join(', '),
        `${storeData.lowestPrice} - ${storeData.highestPrice}`,
        storeData.openDays + ' ' + storeData.openHours,
        storeData.paymentMethod.join(', '),
        storeData.deliveryCollection.map((delivery) => delivery.company).join(', '),
    ]

    return (
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
    );
};

export default InfoDetailComponent;
