const Address = function(_addressInfo) {
    this.street = _addressInfo?.addressLine1;
    this.zip = _addressInfo?.postcode;
    this.town = _addressInfo?.town;
    this.countryCode = _addressInfo?.country?.isoCode;
}

const Location = function(_location) {
    this.lat = _location?.latitude;
    this.lon = _location?.longitude;
}
const Connector = function(_connector) {
    this.number = _connector?.connectionType?.id;
    this.type = _connector?.connectionType?.title;
    this.maxPowerInKW = _connector?.powerKW;
}

const sanitizeConnectorsList = (_connections) => {
    return _connections?_connections.map(connector => new Connector(connector)):[];
}

const ChargingStation = function(_station) {
        this.chargePointID = _station?.id;
        this.address = new Address(_station.addressInfo);
        this.location =  new Location(_station.addressInfo);
        this.operatorName = _station.operatorInfo?.title;
        this.priceInfo = _station?.usageCost;
        this.connectors =  sanitizeConnectorsList(_station.connections);
        this.available = _station?.statusType?.isUserSelectable;

}

export default ChargingStation;