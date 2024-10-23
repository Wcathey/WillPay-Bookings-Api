import { csrfFetch } from "./csrf";


const LOAD_REVIEWS = "review/loadReviews";
const ADD_IMAGE = "review/addImage";
const UPDATE_REVIEW ="review/updateReview";
const DELETE_REVIEW = "review/deleteReview";


const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

const addImage = (image) => {
    type: ADD_IMAGE,
    image
}

const updateReview = (reviewId) => {
    type: UPDATE_REVIEW,
    reviewId
}

const deleteReview = (reviewId) =>{
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

const getCurrentUserReviews = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current')
    const data = await response.json();
    dispatch(loadReviews(data.Reviews));
    return response;
}

const addReviewImage = (image, reviewId) => async (dispatch) => {
    const {url} = image;
    const response = await csrfFetch(`api/reviews/${reviewId}/images`, {
        method: "POST",
        body: JSON.stringify({url})
    });
    const data = await response.json();
    dispatch(addImage(data));
    return response;
}

const updateReviewById = (newReview, reviewId) => async (dispatch) => {
    const {review, stars} = newReview;
    const response = await csrfFetch(`api/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify({review, stars})
    });
    const data = await response.json();
    dispatch(updateReview(data));
    return data;
}

const deleteReviewById = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`api/reviews/${reviewId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    dispatch(deleteReview(data));
    dispatch(getCurrentUserReviews());
    return response;
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS: {
            const newState = {...state, Reviews: action.reviews}
            return newState;
        }
        case ADD_IMAGE: {
            const newState = {...state, ...action.reviewId}
            return newState;
        }
        case DELETE_REVIEW: {
            const deletedReview = action.reviewId;
            const newState = {...state, deletedReview};
            delete newState.deletedReview;
            return newState;
        }
        default: return state;
    }
}

export default reviewReducer;
