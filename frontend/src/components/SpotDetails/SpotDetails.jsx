import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { getSpotById } from "../../store/spot"
import { getReviewsBySpotId } from "../../store/review";
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import './SpotDetails.css';

dayjs.extend(relativeTime);

function SpotDetails() {
    const dispatch = useDispatch();
    const [showReview, setShowReview] = useState(false);
    const [postedDate, setPostedDate] = useState("");
    const [showPostReview, setShowPostReview] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const spot = useSelector(state => state.spot);
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.review.Reviews)
    const { spotId } = useParams();
    const images = spot.SpotImages;
    const owner = spot.Owner;

    const toggleReview = () => {
        setShowReview(!showReview);
    }
    const toggleAlert = () => {
        setShowAlert(!showAlert);
    }

    useEffect(() => {
        dispatch(getSpotById(spotId))
            .then(dispatch(getReviewsBySpotId(spotId)))


        if (!showReview) return;
        if(!showAlert) return;

        const closeReview = () => {
            setShowReview(false);
        };
        const closeAlert = () => {
                setShowAlert(false);

        }

        document.addEventListener('click', closeReview);
        document.addEventListener('click', closeAlert);
        return () => {
            document.removeEventListener('click', closeReview)
            document.removeEventListener('click', closeAlert)
        }
    }, [dispatch, spotId, showReview, showAlert]);

    useEffect(() => {
        if(user === null) {
            setShowPostReview(false);
        }
        if (reviews) {
            if(reviews.length) {
            const reviewDate = new Date(reviews[0].createdAt);
            const formatted = Intl.DateTimeFormat("en", {
                year: "numeric",
                month: "long",
            }).format(reviewDate);
        setPostedDate(formatted);
            }
            if(user !== null) {
                reviews.map((review) => {
                    if(review.userId === user.id) {
                        setShowPostReview(false)
                    }
                })

            }

        }
    }, [reviews, user])

           if(images && owner) {
            return (
                <div className="spot-details-container">
                    <div className="sd-title">
                        <h2>{spot.name}</h2>
                        <p>{spot.city}, {spot.state}, {spot.country}</p>
                    </div>
                    <div className="images-wrapper">

                        <div className="preview-image-container">
                            {images.map((image) => (
                                image.preview &&
                                <li key={image.id}>
                                    <img src={image.url}></img>
                                </li>
                            ))}
                        </div>
                        <div className="sd-images-container">
                            {images.map((image) => (
                                !image.preview &&

                                <li key={image.id}>
                                    <img className="sd-image" src={image.url}></img>
                                </li>

                            ))}
                        </div>
                    </div>

                    <div className="lower-container">
                        <div className="details-area">
                            <h3>Hosted by: {owner[0].firstName} {owner[0].lastName}</h3>
                            <p>{spot.description}</p>
                        </div>
                        <div className="sd-callout-box">
                            <div id="callout-contents">
                                <p>${spot.price} night</p>
                                <p><FaStar /> {spot.avgStarRating === 0 ? "New" : spot.avgStarRating} {spot.numReviews} reviews</p>
                            </div>
                            <Link to={`/spots/${spotId}/bookings/new`}>
                            <button className="reserve-btn">Reserve</button>
                            </Link>
                        </div>
                    </div>

                    <div className="reviews-container">

                        <div className="review-header">
                            <FaStar /> {spot.avgStarRating === 0 ? "New" : spot.avgStarRating}
                            <p id="review-dot">.</p>
                            <p>{spot.numReviews} reviews</p>
                        </div>

                        {showPostReview && user &&(
                            <OpenModalButton
                                className="post-review-btn"
                                buttonText="Post a Review"
                                onButtonClick={toggleReview}
                                modalComponent={<PostReviewModal spotId={spot.id} />}
                            />
                        )
                        }
                    </div>
                    <div className="spot-reviews">
                        {spot.numReviews === 0 &&  (
                            <p>Be the first to post a review</p>
                        )
                        }
                        {reviews && (
                            <>
                            {reviews.map((review) => (
                                <li key={review.id}>
                                <h2>{review.User.userName}</h2>
                                <p>{postedDate}</p>
                                <p>{review.review}</p>
                                {review.userId === user.id && (
                                   <OpenModalButton
                                   className="delete-review"
                                   buttonText="Delete"
                                   onButtonClick={toggleAlert}
                                   modalComponent={<DeleteReviewModal reviewId={review.id}/>}
                                   />
                                ) }
                                </li>
                            ))}
                            </>



                        )}
                    </div>
                    </div>
            )
        }

        else {
            return (
                <>
                    <p>loading</p>
                </>
            )
        }





}




export default SpotDetails;
