import React from 'react';
import { Card } from 'antd';

const InfoPopUp = (props) => {
    return (
        <Card  style={{ width: 300 }}>
            <h3>{props.chargePoint.address.street} {props.chargePoint.address.zip} {props.chargePoint.address.town} ({props.chargePoint.address.countryCode})</h3>
            <p><strong>Latitude</strong> {props.chargePoint.location.lat}</p>
            <p><strong>Longitude</strong> {props.chargePoint.location.lon}</p>
            <p><strong>Pricing Info</strong> {props.chargePoint.priceInfo}</p>
            <p><strong>Available</strong> {props.chargePoint.available? "Yes": "No"}</p>
        </Card>
    );
};

export default InfoPopUp;