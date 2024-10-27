import { useState } from "react";
import { createReview } from "../../store/spot";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';

import './PostReview.css';

function PostReviewModal({spotId}) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("5");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const newReview = {review, stars}
        return dispatch(createReview(newReview, spotId))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <div className="review-input-container">
            <h1>How was your stay?</h1>

            <form onSubmit={handleSubmit}>
                <div className="review-text">
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
                </div>
                {errors.review && <p>{errors.review}</p>}
                <div className="stars-container">
                <label>
                    Stars
                </label>
                <select
                    onChange={(e) => setStars(e.target.value)}
                    defaultValue={stars}
                    >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                </div>

                <button className="submit-review-btn" type="submit">Submit Review</button>

            </form>
        </div>
    )

}

export default PostReviewModal;
