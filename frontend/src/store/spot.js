import { csrfFetch } from "./csrf";

const ADD_SPOT = "spot/addSpot";
const LOAD_SPOTS = "spot/loadSpots";
const LOAD_CURRENT_USER_SPOTS = "spot/loadCurrentUserSpots";
const ADD_IMAGE = "spot/addImage";
const SPOT_DETAILS = "spot/spotDetails";
const UPDATE_SPOT = "/spot/updateSpot";
const DELETE_SPOT = "/spot/deleteSpot";

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

const addImage = (image) => {
    return {
        type: ADD_IMAGE,
        image
    }
}

const spotDetails = (spotId) => {
    return {
        type: SPOT_DETAILS,
        spotId
    }
}

const updateSpot = (spotId) => {
    return {
        type: UPDATE_SPOT,
        spotId
    }
}

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
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
    return response
}

export const getCurrentUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')
    const data = await response.json();
    dispatch(loadCurrentUserSpots(data.Spots));
    return response;
}

export const uploadSpotImage = (image) => async (dispatch) => {
    const {spotId, url, preview} = image;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify({url, preview})
    });
    const data = await response.json();
    dispatch(addImage(data));
    return response;

}

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json();
    dispatch(spotDetails(data));
    return response;
}

export const updateSpotById = (spot, spotId) => async (dispatch) => {
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

    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify({address, city, state, country,
            lat, lng, name, description, price
        })
    });
    const data = await response.json();
    dispatch(updateSpot(data));
    return data;
}

export const deleteSpotById =(spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    dispatch(deleteSpot(data));
    dispatch(getCurrentUserSpots());
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
            const newState = {...state, Spots: action.spots}
            return newState;
        }

        case LOAD_CURRENT_USER_SPOTS: {
            const newState= {...state, Spots: action.spots}
            return newState;
        }
        case SPOT_DETAILS: {
            const newState = {...state, ...action.spotId}
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = {...state, ...action.spotId}
            return newState;
        }
        case DELETE_SPOT: {
            const deletedSpot = action.spotId;
            const newState = {...state, deletedSpot};
            delete newState.deletedSpot;
            return newState

        }

            default: return state;
    }

}

export default spotReducer;
