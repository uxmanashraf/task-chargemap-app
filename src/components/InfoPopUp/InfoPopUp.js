import React from "react";
import { Skeleton, Card, Table, Row, Col } from "antd";

const style = { background: "#0092ff", padding: "8px 0" };

const InfoPopUp = (props) => {
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "plug type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "max power",
      dataIndex: "maxPowerInKW",
      key: "maxPowerInKW",
    },
  ];

  const connectors = props.chargePoint.connectors.map((connector, index) => {
    return {
      key: index,
      type: connector.type,
      maxPowerInKW: connector.maxPowerInKW,
    };
  });

  /**
   * to display skeleton if distance not calculated yet
   */
  const distanceElem = props.chargePoint.calculatedDistance ? (
    (props.chargePoint.calculatedDistance / 1000).toFixed(1) + " KM"
  ) : (
    <Skeleton.Button active={true} size="small" shape="round" block={false} />
  );

  return (
    <Card bordered={false} style={{ width: 350 }}>
      <Row>
        <Col span={24}>
          <h4>
            {props.chargePoint.address.street} {props.chargePoint.address.zip}{" "}
            {props.chargePoint.address.town} (
            {props.chargePoint.address.countryCode})
          </h4>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <strong>Operator</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          <strong>Latitude</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          {props.chargePoint.location.lat}
        </Col>

        <Col className="gutter-row" span={12}>
          {props.chargePoint.operatorName}
        </Col>
        <Col className="gutter-row" span={6}>
          <strong>Longitude</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          {props.chargePoint.location.lon}
        </Col>

        <Col className="gutter-row" span={6}>
          <strong>Available</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          {props.chargePoint.available ? "Yes" : "No"}
        </Col>

        <Col className="gutter-row" span={6}>
          <strong>Distance</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          {distanceElem}
        </Col>

        <Col className="gutter-row" span={24}>
          <strong>Connectors</strong>
        </Col>

        <Col className="gutter-row" span={18}>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columns}
            dataSource={connectors}
          />
        </Col>
        <Col className="gutter-row" span={6}></Col>
      </Row>
      <Row>
        <Col className="gutter-row" span={6}>
          <strong>Pricing info</strong>
        </Col>
        <Col className="gutter-row" span={6}>
          {props.chargePoint.priceInfo?props.chargePoint.priceInfo: "N/A"}
        </Col>
      </Row>
    </Card>
  );
};

export default InfoPopUp;
