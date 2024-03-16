import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/setSpots";
const GET_USER_SPOTS = "spots/getUserSpots"
const CLEAR_SPOTS = "spots/clearSpots"
// const GET_SPOT_DETAILS = "spots/getSpotDetails"


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

// const setSpotDetails = (spot) => {
//     const payload = {};
//     payload[spot.id] = spot;
//     return {
//         type: GET_SPOT_DETAILS,
//         payload
//     }
// }



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

export const deleteSpot = (id) => async (dispatch) => {
    const options = {
        method: "DELETE"
    }

    const response = await csrfFetch(`/api/spots/${id}`, options);
    const data = await response.json();
    dispatch(getUserSpots())
    return data;
}

export const createSpot = (spotInfo) => async () => {

    //separate into two distinct thunks if time permits
    // info should be an about that contains {address, city, state, country, lat, lng, name, description, price}
    // urls should be an array of image objects
    const { urls, info } = spotInfo;
    const body = JSON.stringify(info);
    const spotData = {
        method: "POST",
        body: body,
    }

    const response = await csrfFetch(`/api/spots`, spotData);
    const data = await response.json();

    const { id } = data;

    // console.log("Spot ID: ", id);
    urls.forEach(async image => {
        image.spotId = parseInt(id);
        const body = JSON.stringify(image);
        const options = {
            method: "POST",
            body: body
        }
        const response = await csrfFetch(`/api/spots/${id}/images`, options);
        await response.json()

    })


    return data;
}

export const updateSpot = (spotInfo) => async () => {

    const { info } = spotInfo;
    const body = JSON.stringify(info);
    const spotData = {
        method: "PUT",
        body: body,
    }

    const response = await csrfFetch(`/api/spots/${info.id}`, spotData);
    const data = await response.json();

    // info.urls.forEach(image => {
    //     image.spotId = parseInt(id);
    //     const body = JSON.stringify(image);
    //     const options = {
    //         method: "POST",
    //         body: body
    //     }

    // })
    // console.log("Spot ID: ", id);
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
    await dispatch(setUserSpots(data))
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
