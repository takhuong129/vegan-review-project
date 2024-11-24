import React from 'react'
import { FaStar } from "react-icons/fa";
import { Notify } from '@/components/Notify';
const OverviewPage = () => {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col w-full h-[24rem] bg-white shadow-lg rounded-2xl p-6 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Tổng quan cửa hàng</h1>
                    <h3 className="text-lg text-blue-500"> Xem thêm &gt;</h3>
                </div>
                <div className="grid grid-rows-2 grid-cols-3 gap-4 w-full h-full  mt-4 p-4">
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <h1 className="font-bold">200</h1>
                            <h1>Số người xem</h1>
                        </div>
                    </div>
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <h1 className="font-bold">58</h1>
                            <h1>Số người yêu thích</h1>
                        </div>
                    </div>
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold">4.9</h1>
                                <FaStar className="text-2xl text-yellow-400" />
                            </div>
                            <h1>Đánh giá</h1>
                        </div>
                    </div>
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <h1 className="font-bold">351</h1>
                            <h1>Số lượt đánh giá</h1>
                        </div>
                    </div>
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <h1 className="font-bold">512</h1>
                            <h1>Bình luận</h1>
                        </div>
                    </div>
                    <div className=" p-4">
                        <div className="flex flex-col h-full items-center justify-center text-2xl">
                            <h1 className="font-bold">26</h1>
                            <h1>Tổng sản phẩm</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full bg-white shadow-lg rounded-2xl p-6 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Thông báo</h1>
                    <h3 className="text-lg text-blue-500"> Xem thêm &gt;</h3>
                </div>
                <div className="w-full h-full mt4 p-4">
                    <Notify />
                </div>
            </div>
        </div>

    )
}

export default OverviewPage