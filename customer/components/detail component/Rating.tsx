import React from 'react';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

interface RatingProps {
    rating: number;  // rating out of 5
    totalRatings: number;  // total number of ratings
    ratingsCount: number[];  // array with counts of each rating [count1, count2, count3, count4, count5]
}

const Rating: React.FC<RatingProps> = ({ rating, totalRatings, ratingsCount }) => {
    const fullStars = Math.floor(rating);  // Number of full stars
    const halfStar = rating - fullStars >= 0.5;  // Whether there is a half star

    const getRatingPercentage = (count: number) => {
        return (count / totalRatings) * 100;
    };

    return (
        <div className="flex h-full w-full gap-10">
            <div className="flex flex-col items-center justify-center gap-3">
                <h1 className="text-4xl font-bold">{rating.toFixed(1)}</h1>
                <div className="flex justify-center text-2xl text-yellow-400">
                    {[...Array(fullStars)].map((_, i) => (
                        <IoIosStar key={i} />
                    ))}
                    {halfStar && <IoIosStarOutline className="relative"><IoIosStar className="absolute inset-0 text-yellow-400" /></IoIosStarOutline>}
                    {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                        <IoIosStarOutline key={i} />
                    ))}
                </div>
                <h3 className="text-md text-gray-400">{totalRatings} đánh giá</h3>
            </div>
            <div className="flex items-center">
                <div className="w-px h-full bg-gray-500 mx-4"></div> {/* Vertical line */}
            </div>
            <div className="flex flex-col justify-center">
                {[5, 4, 3, 2, 1].map((star, index) => (
                    <div key={star} className="flex items-center gap-4 mb-1">
                        <div className="flex justify-center text-xl text-yellow-400">
                            {[...Array(star)].map((_, i) => (
                                <IoIosStar key={i} />
                            ))}
                            {[...Array(5 - star)].map((_, i) => (
                                <IoIosStarOutline key={i} />
                            ))}
                        </div>
                        <div className="flex-1 w-[52rem] bg-gray-200 h-2 rounded">
                            <div
                                className="bg-yellow-400 h-2 rounded"
                                style={{ width: `${getRatingPercentage(ratingsCount[5 - star])}%` }}
                            ></div>
                        </div>
                        <h3>{getRatingPercentage(ratingsCount[5 - star]).toFixed(1)}%</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Rating;
