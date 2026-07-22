import { Star } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postReview, deleteReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isReviewDeleting, isPostingReview } = useSelector(
    (state) => state.product,
  );
  const dispatch = useDispatch();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("rating", rating);
    data.append("comment", comment);
    dispatch(postReview({ productID: product.id, reviewData: data }));
    setComment("");
    setRating(1);
  };

  return (
    <>
      {authUser && (
        <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
          <h4 className="text-lg font-semibold">Write a Review</h4>

          {/* STAR RATING INPUT */}
          <div>
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`text-2xl ${
                  index < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ☆
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full p-3 border rounded-lg focus:ring focus:ring-primary/20 bg-background text-foreground"
            rows="4"
            required
          />

          <button
            type="submit"
            disabled={isPostingReview}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-green-700 transition disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isPostingReview ? "Posting..." : "Submit Review"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold text-foreground mb-6">
        Customer Reviews
      </h3>

      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div
              key={review.review_id || review.id}
              className="p-4 border rounded-lg bg-secondary"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                  alt={review.reviewer?.name || "Reviewer"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-semibold">
                      {review.reviewer?.name || "Anonymous"}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 ${
                            index < Math.floor(review.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                  {authUser?.id === review.reviewer?.id && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteReview({
                            productID: product.id,
                            reviewData: {
                              reviewId: review.review_id || review.id,
                            },
                          }),
                        )
                      }
                      disabled={isReviewDeleting}
                      className="mt-4 flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isReviewDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <span>Delete Review</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      )}
    </>
  );
};

export default ReviewsContainer;
