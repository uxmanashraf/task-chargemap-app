import * as actionTypes from '../actions/actionTypes';

const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

const initialState = {
    chargingStation: [],
    loading: false,
    error: null,
};

const fetchChargingStationStart = ( state, action ) => {
    return updateObject( state, { 
        loading: true
    } );
};

const fetchChargingStationSuccess = ( state, action ) => {
    return updateObject( state, {
        chargingStation: action.chargingStation,
        loading: false,
        error: null
    } );
};

const fetchChargingStationFail = ( state, action ) => {
    return updateObject( state, { loading: false, readyToLoad: action.readyToLoad, error:action.error } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FETCH_CHARGING_STATION_START: return fetchChargingStationStart( state, action );
        case actionTypes.FETCH_CHARGING_STATION_SUCCESS: return fetchChargingStationSuccess( state, action );
        case actionTypes.FETCH_CHARGING_STATION_FAIL: return fetchChargingStationFail( state, action );

        default: return state;
    }
};

export default reducer;