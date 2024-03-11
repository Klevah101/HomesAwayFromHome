

const STORE_REVIEWS = 'reviews/storeReviews'

const storeReviews = (reviews) => {
    return {
        type: STORE_REVIEWS,
        reviews
    }
}


export const getReviews = (id) => async (dispatch) => {
    const response = await fetch(`/api/spots/${id}/reviews/`)
    const data = await response.json();
    const obj = {}
    data.Reviews.forEach(element => {
        obj[element.id] = element
    });
    dispatch(storeReviews(obj))
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
