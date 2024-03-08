
const SET_DETAILS = "spots/setSpotsDetails"

const setSpotDetails = (spotDetails) => {
    return {
        type: SET_DETAILS,
        spotDetails
    }
}


export const getSpotDetails = (id) => async (dispatch) => {
    // console.log(id)
    const response = await fetch(`/api/spots/${id}`)
    const data = await response.json();
    dispatch(setSpotDetails(data))
    // console.log("details", data)
    return data;
}


const initialState = {};

const spotDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        // case SET_SPOTS:
        //     return { ...action.spots.Spots };
        case SET_DETAILS:
            return { ...action.spotDetails };
        default:
            return state;
    }
};

export default spotDetailReducer;
