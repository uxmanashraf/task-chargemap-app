import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import "antd/dist/antd.css";
import "./mainLayout.css";
import { Layout, Menu, Breadcrumb } from "antd";
import MapWrapped from "../../components/MapWrapped/MapWrapped";
import FiltersBar from "../FiltersBar/FiltersBar";
import Spinner from "../../components/Spinner/Spinner";

class MainLayout extends Component {
  state = {
    filterCheckBoxes: {
      25: { label: "Type 2", value: "25", checked: true },
      2: { label: "CCS", value: "2", checked: false },
      33: { label: "CHAdeMO", value: "33", checked: false },
    },
    distanceRange: 50,
    userLocation: null,
  };

  /**
   * will request for user's location
   */
  componentDidMount() {
    let that = this;
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                const location = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                };
                that.setState({
                  userLocation: { ...location },
                });
                that.fetchChargingStationData();
              },
              function (error) {
                // console.error("Error Code = " + error.code + " - " + error.message);
              }
            );
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
            // console.log(result);
          }
          result.onchange = function () {
            // console.log(result.state);
          };
        });
    } else {
      // console.log("not available");
    }
  }

  /**
   * will trigger action of fetching charging station data from API
   */
  fetchChargingStationData = () => {
    if (this.state.userLocation && !this.props.loading) {
      let connectiontypeids = [];
      Object.keys(this.state.filterCheckBoxes).forEach((key) => {
        if (this.state.filterCheckBoxes[key].checked) {
          connectiontypeids.push(key);
        }
      });

      let params = {
        distance: this.state.distanceRange,
        distanceunit: "KM",
        connectiontypeid: connectiontypeids.join(),
        latitude: this.state.userLocation.lat,
        longitude: this.state.userLocation.lon,
      };
      this.props.onFetchChargingStation(params);
    }
  };

  /**
   * onChange method for filter checkbox 
   * @param {*} event 
   */
  onfilterCheckBoxesChanged = (event) => {
    if (!this.props.loading) {
      this.setState(
        (prevState) => {
          let updatedCheckBox = {
            ...prevState.filterCheckBoxes[event.target.name],
            checked: event.target.checked,
          };

          let updatedFilterCheckBoxes = {
            ...prevState.filterCheckBoxes,
          };
          updatedFilterCheckBoxes[event.target.name] = { ...updatedCheckBox };
          return {
            filterCheckBoxes: { ...updatedFilterCheckBoxes },
          };
        },
        function () {
          this.fetchChargingStationData();
        }
      );
    }
  };


  /**
   * onChange method for distance value changed
   * @param {int} value 
   */
  onDistanceChanged = (value) => {
    if (!this.props.loading) {
      this.setState({ distanceRange: +value });
    }
  };

  render() {
    const { Header, Footer, Content } = Layout;

    return (
      <Layout className="layout">
        <Header>
          <h3 style={{ color: "#fff" }}>Chargepoint Finder</h3>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div style={{ margin: "16px 0", padding: "8px 0" }}>
            <FiltersBar
              distanceRange={this.state.distanceRange}
              filterCheckBoxes={this.state.filterCheckBoxes}
              onDistanceChanged={this.onDistanceChanged}
              fetchChargingStationData={this.fetchChargingStationData}
              onCheckBoxesChanged={this.onfilterCheckBoxesChanged}
            />
          </div>
          <div className="site-layout-content">
            {this.state.userLocation && (
              <MapWrapped
                dataLoading={this.props.loading}
                userLocation={this.state.userLocation}
                chargingStation={this.props.chargingStation}
              />
            )}
            {!this.state.userLocation && (
              <Spinner />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by Usman Ashraf</Footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chargingStation: state.chargingStation.chargingStation,
    loading: state.chargingStation.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchChargingStation: (queryParams) =>
      dispatch(actions.fetchChargingStation(queryParams)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
