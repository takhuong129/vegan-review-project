import React from 'react';
import { useState } from 'react';
import { IoIosStar } from "react-icons/io";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaHeart } from "react-icons/fa6";
import { CommentData } from '@/container/RestaurantData';
interface CommentProp {
    comment: CommentData
}
const Comment: React.FC<CommentProp> = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(false); // Track like state

    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
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
                        <h3 className="text-lg">{comment.username}</h3>
                        <h4 className="text-sm text-gray-500">{comment.dateCreated}</h4>
                    </div>
                </div>
                <IoEllipsisHorizontalCircle className="text-4xl hover:cursor-pointer" />
            </div>
            {/*User section*/}
            <div className="flex items-start mt-5 px-16 w-full">
                <p> {comment.commentText}</p>
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
            </div>
        </div>
    );
}

export default Comment;
