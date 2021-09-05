import * as actionTypes from './actionTypes';
import {serverApi} from '../../axiosHelper';

export const fetchChargingStationSuccess = ( rawData ) => {

    let minChargingStation = rawData.map(station => {

        let connectorsList = station.connections.map(connector => {
            return {
                number: connector.connectionType.id,
                type: connector.connectionType.title,
                maxPowerInKW: connector.powerKW
            }
        });

        return {
            chargePointID: station.id,
            address: {
                street: station.addressInfo.addressLine1,
                zip: station.addressInfo.postcode,
                town: station.addressInfo.town,
                countryCode: station.addressInfo.country.isoCode
            },
            location: {
                lat: station.addressInfo.latitude,
                lon: station.addressInfo.longitude
            },
            operatorInfo: {
                title: station.operatorName
            },
            priceInfo: station.usageCost,
            connectors: connectorsList,
            available: station.statusType.isUserSelectable
        };
    });

    

    return {
        type: actionTypes.FETCH_CHARGING_STATION_SUCCESS,
        chargingStation: minChargingStation,
    };
};

export const fetchChargingStationFail = ( error ) => {
    return {
        type: actionTypes.FETCH_CHARGING_STATION_FAIL,
        error: error
    };
};

export const fetchChargingStationStart = () => {
    return {
        type: actionTypes.FETCH_CHARGING_STATION_START
    };
};

export const fetchChargingStation = (params) => {

    let queryParams = {
        key: " ",
        output: "json",
        camelcase: true,
        ...params
    }

    return (dispatch, getState) => {
        dispatch(fetchChargingStationStart());
        serverApi.get( '?' + Object.keys(queryParams).map((key) => [key, queryParams[key]].join('=')).join('&'))
            .then( res => {
                if(res) {
                    dispatch(fetchChargingStationSuccess(res.data));
                } else {
                    dispatch(fetchChargingStationFail(res.data.error, false));
                }
            } )
            .catch( error => {
                if (error.response) {
                    dispatch(fetchChargingStationFail(error.response));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    dispatch(fetchChargingStationFail(error.message));
                } else {
                    // Something happened in setting up the request that triggered an Error
                    dispatch(fetchChargingStationFail(error.message));
                }
            } );
    };
};