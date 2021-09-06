import React, { Component } from "react";
import { InputNumber, Space, Checkbox, Row, Col } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const FiltersBar = (props) => {
  const filterCheckBoxes = Object.keys(props.filterCheckBoxes).map((key) => {
    return (
      <Checkbox
        key={key}
        name={key}
        checked={props.filterCheckBoxes[key].checked}
        onChange={props.onCheckBoxesChanged}
      >
        {props.filterCheckBoxes[key].label}
      </Checkbox>
    );
  });

  return (
    <Row justify="start " align="middle">
      <Col span={24}>
        <Space align="center">
          <strong>Max distance in KM</strong>
          <InputNumber
            onChange={props.onDistanceChanged}
            onBlur = {props.fetchChargingStationData}
            value={props.distanceRange}
          />
        <strong>Connector Types</strong> {filterCheckBoxes}
        </Space>
      </Col>
    </Row>
  );
};

export default FiltersBar;
