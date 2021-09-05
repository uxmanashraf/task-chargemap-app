import ChargingStation from "../Entities/ChargingStation";

export const parseChargingStationsApiData = (_chargingStations) => {
    return _chargingStations.map(station => new ChargingStation(station));
}