

const SET_SPOTS = "spots/setSpots";
// const SET_DETAILS = "spots/setSpotsDetails"


const setSpots = (spots) => {
    return {
        type: SET_SPOTS,
        spots
    };
};

// const setSpotDetails = (spotDetails) => {
//     return {
//         type: SET_DETAILS,
//         spotDetails
//     }
// }

export const getAllSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    const data = await response.json();
    dispatch(setSpots(data));
    return data;
};

// export const getSpotDetails = (id) => async (dispatch) => {
//     // console.log(id)
//     const response = await fetch(`/api/spots/${id}`)
//     const data = await response.json();
//     dispatch(setSpotDetails(data))
//     console.log(data)
//     return data;
// }

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPOTS:
            return { ...action.spots.Spots };
        // case SET_DETAILS:
        //     return { ...action.spotDetails };
        default:
            return state;
    }
};

export default spotsReducer;
