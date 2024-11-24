import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import Review from './Review';
import { ReviewData } from '@/container/RestaurantData';
import { getReview } from '@/container/RestaurantAPI';

interface CommentHolderProp {
    restaurantId: string;
}

const CommentHolder: React.FC<CommentHolderProp> = ({ restaurantId }) => {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set()); // Tracks which reviews have comments visible

    useEffect(() => {
        // Fetch review data
        const fetchReviews = async () => {
            const reviewData = await getReview(restaurantId);
            console.log(reviewData);
            setReviews(reviewData);
        };
        fetchReviews();
    }, [restaurantId]);

    // Toggle the visibility of comments for a specific review
    const toggleCommentsVisibility = (reviewId: string) => {
        setVisibleComments((prev) => {
            const updated = new Set(prev);
            if (updated.has(reviewId)) {
                updated.delete(reviewId); // Hide comments
            } else {
                updated.add(reviewId); // Show comments
            }
            return updated;
        });
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex flex-col gap-6">
                {reviews.map((review, reviewIndex) => (
                    <div key={reviewIndex} className="flex flex-col gap-6">
                        {/* Render the Review component */}
                        <Review key={reviewIndex} review={review} restaurantId={restaurantId} />
                        {/* Toggle Button */}
                        {review.comments.length > 0 && (
                            <button
                                className="flex justify-start items-center pl-12  text-blue-500 hover:underline"
                                onClick={() => toggleCommentsVisibility(review.ratingId)}
                            >
                                {visibleComments.has(review.ratingId) ? 'Ẩn bình luận' : 'Xem bình luận'}
                            </button>
                        )}
                        {visibleComments.has(review.ratingId) && (
                            <div className="w-full flex flex-col pl-12 mt-4">
                                {review.comments.map((comment, commentIndex) => (
                                    <Comment key={comment.commentId || commentIndex} comment={comment} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentHolder;
