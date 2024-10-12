import { csrfFetch } from "./csrf";

const ADD_SPOT = "spot/addSpot";
const LOAD_SPOTS = "spot/loadSpots"
const LOAD_CURRENT_USER_SPOTS = "spot/loadCurrentUserSpots"


const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    };
};


const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const loadCurrentUserSpots = (spots) => {
    return {
        type: LOAD_CURRENT_USER_SPOTS,
        spots
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const {

        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        } = spot;
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify({address, city, state, country, lat, lng,
            name, description, price
        })
    });
    const data = await response.json();
    dispatch(addSpot(data));
    return data;

}






export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots")
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return data;
}

export const getCurrentUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')
    console.log(response)
    const data = await response.json();
    console.log(data)
    dispatch(loadCurrentUserSpots(data.Spots));
    return response;
}

const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SPOT: {
            const newState = { ...state, ...action.spot };
            return newState;
        }
        case LOAD_SPOTS: {
            const newState = {...state, ...action.spots}
            return newState;
        }

        case LOAD_CURRENT_USER_SPOTS: {
            const newState= {...state, ...action.spots}
            return newState;
        }
            default: return state;
    }

}

export default spotReducer;
