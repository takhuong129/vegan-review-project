import React from 'react'

export const Notify = () => {
    const notifyData = [
        {
            time: "2024-10-26 10:00 AM",
            type: "Đánh giá",
            description: "Cuong Peter đã đánh giá 5 sao shop của bạn."
        },
        {
            time: "2024-10-26 11:30 AM",
            type: "Hệ thống",
            description: "Thu hút thêm khách hàng với chiến dịch quảng cáo của chúng tôi"
        },
        {
            time: "2024-10-26 01:15 PM",
            type: "Bình luận",
            description: "Truong Minh đã bình luận về cửa shop của bạn"
        },
        {
            time: "2024-10-26 02:00 PM",
            type: "Đánh giá",
            description: "Long Duy đã đánh giá 4.5 sao shop của bạn"
        },
        {
            time: "2024-10-26 03:45 PM",
            type: "Theo dõi",
            description: "Quoc Anh đã yêu thích và theo dõi cửa hàng của bạn"
        },
        {
            time: "2024-10-26 03:45 PM",
            type: "Theo dõi",
            description: "Le Minh đã yêu thích và theo dõi cửa hàng của bạn"
        }
    ]

    return (
        <div className="w-full">
            <ul>
                {notifyData.map((notify, index) => (
                    <li key={index} className="mb-4 p-4 bg-white rounded-lg">
                        <p className="text-gray-600 text-sm">{notify.time}</p>
                        <p className="font-semibold text-lg">{notify.type}</p>
                        <p className="text-gray-800">{notify.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}