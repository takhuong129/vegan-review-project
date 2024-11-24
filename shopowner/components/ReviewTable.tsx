"use client"
import React, { useState, useEffect } from 'react'
import ImageLoader from './ImageLoader';
import { ReviewData } from '@/constant/RestaurantData'
import { getReview } from '@/constant/RestaurantAPI'
import { FiSearch } from 'react-icons/fi';
import { vegan } from '@/constant/ImageConstant';
import { ReviewPopup } from './ReviewPopup';

const ReviewTable: React.FC = () => {
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [visiblePopups, setVisiblePopups] = useState<{ [key: string]: boolean }>({});

    const toggleCommentBox = (ratingId: string): void => {
        setVisiblePopups((prev) => ({
            ...prev,
            [ratingId]: !prev[ratingId],
        }));
    };

    useEffect(() => {
        const fetchReviewList = async () => {
            setReviews(await getReview())
        }
        fetchReviewList()
    }, [])

    return (
        <div className="flex flex-col gap-4">
            {/* Searching bar and filter */}
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-500 rounded-md px-4 py-[0.6rem] focus-within:ring-1 focus-within:ring-black">
                    <input
                        type="text"
                        placeholder="Tìm thông tin đánh giá"
                        className="w-full outline-none"
                    />
                    <FiSearch className="text-gray-500 mr-2" size={20} />
                </div>
                <select className="select select-bordered w-52 border-gray-500 focus-within:ring-1 focus-within:ring-black ">
                    <option value="" disabled selected>Bộ lọc</option>
                    <option value="high" >Đánh giá mới nhất</option>
                    <option value="low" >Đánh giá từ cao tới thấp</option>
                    <option value="newest" >Đánh giá từ thấp tới cao </option>
                </select>
            </div>
            <table className="table min-w-full bg-white">
                <thead className="bg-gray-200 text-left text-md">
                    <tr>
                        <th className="">Tên người dùng</th>
                        <th className="">Số sao</th>
                        <th>Bình luận</th>
                        <th className="">Số người phản hồi</th>
                        <th className="">Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {reviews.map((rev) => (
                        <tr key={rev.ratingId} className="border-b-1 border-gray-400">
                            <td>
                                <div className="flex items-center gap-3">
                                    <ImageLoader
                                        path={vegan.link}
                                        alt={vegan.alt}
                                        width={64}
                                        height={64}
                                        cloudinaryAttributes={{
                                            crop: "fill",
                                            gravity: "auto",
                                            quality: "auto",
                                            fetch_format: "auto",
                                        }}
                                    />
                                    <p>{rev.username}</p>
                                </div>
                            </td>
                            <td>{rev.ratingAmount}</td>
                            <td className="" >{rev.ratingText}</td>
                            <td>{rev.countComment}</td>
                            <td
                                onClick={() => toggleCommentBox(rev.ratingId)}
                                className="text-blue-500 hover:cursor-pointer"
                            >
                                Phản hồi
                            </td>
                            {visiblePopups[rev.ratingId] && (
                                <ReviewPopup
                                    onClose={() => toggleCommentBox(rev.ratingId)}
                                    ratingId={rev.ratingId}
                                />
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReviewTable;
