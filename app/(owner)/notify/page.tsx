import React from 'react'
import { Notify } from '@/components/Notify'
const NotiPage = () => {
    return (
        <div>
            <div className="flex flex-col w-full bg-white shadow-lg rounded-2xl p-6 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Thông báo</h1>
                </div>
                <div className="w-full h-full mt4 p-4">
                    <Notify />
                    <button className="btn w-full bg-custom-grey text-white hover:bg-gray-700 mt-10">Xem thêm</button>
                </div>
            </div>
        </div>
    )
}

export default NotiPage