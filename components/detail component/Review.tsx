import React, { useState } from 'react';
import { IoIosStar } from "react-icons/io";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaHeart } from "react-icons/fa6";
import { ReviewData } from '@/container/RestaurantData';
import { CommentPopup } from './CommentPopup';
interface ReviewProp {
    review: ReviewData,
    restaurantId: string
}
const Review: React.FC<ReviewProp> = ({ review, restaurantId }) => {
    const [isLiked, setIsLiked] = useState(false); // Track like state

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
    };
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState<boolean>(false);

    // Toggle function to show or hide the search bar
    const toggleCommentBox = (): void => {
        setIsCommentBoxVisible(prevState => !prevState);
    };
    return (
        <div className="flex flex-col items-center w-full">
            {/*User section*/}
            <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-14 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="avatar" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2"> {/* Margin left to create space */}
                        <h3 className="text-lg">{review.username}</h3>
                        <h4 className="text-sm text-gray-500">{review.dateCreated}</h4>
                        <div className="flex">
                            {Array.from({ length: 5 }, (_, index) => (
                                <IoIosStar key={index} className="text-md text-yellow-400" />
                            ))}
                        </div>
                    </div>
                </div>
                <IoEllipsisHorizontalCircle className="text-4xl hover:cursor-pointer" />
            </div>
            {/*User section*/}
            <div className="flex items-start mt-5 px-16 w-full">
                <p> {review.ratingText}</p>
            </div>
            <div className="flex items-center mt-5 w-full px-16  gap-3">
                <div className="flex items-center gap-1">
                    <div onClick={handleLikeToggle} className="cursor-pointer">
                        {isLiked ? (
                            <FaHeart className="text-3xl text-red-500" />
                        ) : (
                            <CiHeart className="text-3xl" />
                        )}
                    </div>
                </div>
                <TfiCommentAlt onClick={toggleCommentBox} className="text-2xl hover:cursor-pointer " />

            </div>
            {isCommentBoxVisible && <CommentPopup onClose={toggleCommentBox} restaurantId={restaurantId} ratingId={review.ratingId} />}
        </div>
    );
}

export default Review;
