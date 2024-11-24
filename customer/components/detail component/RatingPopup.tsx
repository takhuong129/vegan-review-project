import React, { useState, useEffect, useRef } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { getAuth, createReview } from '@/container/RestaurantAPI';

interface RatingPopupProps {
    onClose: () => void; // Function to close the popup
    restaurantId: string;
}

export const RatingPopup: React.FC<RatingPopupProps> = ({ onClose, restaurantId }) => {
    const popupRef = useRef<HTMLDivElement | null>(null); // Reference to the popup container
    const [rating, setRating] = useState<number>(0); // State for selected rating
    const [comment, setComment] = useState<string>(''); // State for the comment
    const [auth, setAuth] = useState<boolean>(false)
    const checkAuth = async () => {
        const checked = await getAuth()
        setAuth(checked || false)
    }

    useEffect(() => {
        checkAuth()
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose(); // Close the popup if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleRatingClick = (star: number) => {
        setRating(star);
    };

    const handleSubmit = async () => {
        const rateData = {
            ratingAmount: rating,
            ratingText: comment,
        }
        if (auth) {
            if (rating > 0 && comment.trim() !== '') {
                const review = await createReview(restaurantId, rateData)
                alert(review)
                //console.log(`${restaurantId}:${rating}, ${comment}`)
                onClose(); // Close the popup after submitting
            } else {
                alert("Vui lòng ghi bình luận và chọn số sao");
            }
        } else {
            alert("Xin hãy đăng nhập trước khi bình luận")
        }

    };

    return (
        <div className="fixed h-screen w-screen inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
                ref={popupRef} // Attach the ref to the popup container
                className="relative w-[30rem] p-6 bg-white rounded-lg shadow-lg"
            >
                <IoIosCloseCircle
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 text-2xl cursor-pointer hover:text-gray-700"
                />
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Viết đánh giá</h2>
                <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>

        </div>
    );
};
