import { csrfFetch } from "./csrf";
import { getSpotDetails } from "./spot-details";


const STORE_REVIEWS = 'reviews/storeReviews'

const storeReviews = (reviews) => {
    return {
        type: STORE_REVIEWS,
        reviews
    }
}

export const deleteReview = (id, spotId) => async (dispatch) => {
    const options = {
        method: "DELETE",
    }
    const response = await csrfFetch(`/api/reviews/${id}`, options);
    const data = await response.json();
    console.log(response);
    console.log(id)
    await dispatch(getReviews(spotId));
    await dispatch(getSpotDetails(spotId));
    return data;
}

export const createReview = (info) => async (dispatch) => {
    const { id } = info
    // console.log("star type", typeof info.stars)
    const body = JSON.stringify(info);
    const options = {
        method: "POST",
        body: body
    };
    const response = await csrfFetch(`/api/spots/${id}/reviews`, options);
    const data = await response.json();
    await dispatch(getReviews(id));
    await dispatch(getSpotDetails(id));
    return data;
}

export const getReviews = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}/reviews/`)
    const data = await response.json();
    const obj = {}
    data.Reviews.forEach(element => {
        obj[element.id] = element
    });
    await dispatch(storeReviews(obj))
    return data
}

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_REVIEWS:
            return { ...action.reviews };
        // case SET_DETAILS:
        //     return { ...action.spotDetails };
        default:
            return state;
    }
};

export default reviewsReducer
