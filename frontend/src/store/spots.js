import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/setSpots";
const GET_USER_SPOTS = "spots/getUserSpots"
const CLEAR_SPOTS = "spots/clearSpots"
const GET_SPOT_DETAILS = "spots/getSpotDetails"


const setSpots = (spots) => {
    return {
        type: SET_SPOTS,
        spots
    };
};

const setUserSpots = (spots) => {
    return {
        type: GET_USER_SPOTS,
        spots
    }
}

const setSpotDetails = (spot) => {
    const payload = {};
    payload[spot.id] = spot;
    return {
        type: GET_SPOT_DETAILS,
        payload
    }
}

export const clearSpots = () => {
    return {
        type: CLEAR_SPOTS
    }
}

// const setSpotDetails = (spotDetails) => {
//     return {
//         type: SET_DETAILS,
//         spotDetails
//     }
// }
const normalizeData = (rawData) => {
    const obj = {};
    const values = Object.values(rawData.Spots);
    values.forEach(el => {
        obj[el.id] = el
    })
    return obj;
};

export const getSpotDetails = (id) => async (dispatch) => {
    // console.log(id)
    const response = await fetch(`/api/spots/${id}`)
    const rawData = await response.json()
    // console.log("RAAAAAAAAAAAAAAAAWWWW", rawData);
    const data = { ...rawData };
    dispatch(setSpotDetails(data))
    // console.log("details/////////////////////", data)
    return data;
}

export const getAllSpots = () => async (dispatch) => {
    dispatch(clearSpots);
    const response = await fetch("/api/spots");
    const rawData = await response.json();
    const data = normalizeData(rawData);
    // console.log(data)
    dispatch(setSpots(data));
    return data;
};

export const getUserSpots = () => async (dispatch) => {
    // console.log(id)
    dispatch(clearSpots);
    const response = await csrfFetch("/api/spots/current")
    const data = await response.json();
    dispatch(setUserSpots(data))
    // console.log(data)
    return data;
}

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPOTS:
            return { ...action.spots };
        case GET_USER_SPOTS:
            // console.log("stttttttttttaaaaaaaate", state)
            return { ...action.spots };
        case CLEAR_SPOTS:
            return {};
        // case GET_SPOT_DETAILS:
        // console.log("ACTIOOOOOON//////////", action)
        // action[action.spot.id] = action.spot;
        // console.log('acccccccccshuuuuuuun', action[action.spot.id])
        // state[action.spot.id] = action.spot
        // console.log('llllllllllllll', action.payload[Object.keys(action.payload)[0]]);
        // return { ...state,  }
        default:
            return state;
    }
};

export default spotsReducer;
