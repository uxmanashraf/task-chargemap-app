import React, { Component } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  OverlayView,
  MarkerClusterer,
} from "@react-google-maps/api";

import InfoPopUp from "../InfoPopUp/InfoPopUp";

import markerGreen from "../../assets/images/marker_green.svg";
import markerRed from "../../assets/images/marker_red.svg";
import Spinner from "../Spinner/Spinner";

class MapWrapped extends Component {
  state = {
    scriptLoaded: false,
    selectedChargePoint: null,
    hoveredChargingPoint: null,
    mapOptions: {
      center: { lat: 50.110924, lng: 8.682127 },
      zoom: 8,
    },
    mapRef: null,
    userLocation: null,
  };

  componentDidMount() {
    let comp = this;
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
                comp.setState({
                  userLocation: { ...location },
                });
              },
              function (error) {
                // console.error("Error Code = " + error.code + " - " + error.message);
              }
            );
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(function (
              success,
              errors,
              options
            ) {
              // console.log(success, errors, options);
            });
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

  scriptLoadedHandler = () => {
    this.setState({ scriptLoaded: true });
  };

  fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    this.props.chargingStation.map((chargePoint) =>
      bounds.extend({
        lat: +chargePoint.location.lat,
        lng: +chargePoint.location.lon,
      })
    );
    map.fitBounds(bounds);
  };

  mapLoadedHandler = (map) => {
    this.fitBounds(map);
    this.setState({ mapRef: map });
  };

  chargingPointSelectedHandler = (chargingPoint) => {
    this.setState({
      selectedChargePoint: chargingPoint,
    });
    this.calculateDistance(chargingPoint);
  };

  calculateDistance = () => {
    const chargePointID = this.state.selectedChargePoint.chargePointID;
    if (this.state.userLocation) {
      const origin = new window.google.maps.LatLng(
        this.state.userLocation.lat,
        this.state.userLocation.lon
      );
      const destination = new window.google.maps.LatLng(
        this.state.selectedChargePoint.location.lat,
        this.state.selectedChargePoint.location.lon
      );

      const service = new window.google.maps.DistanceMatrixService();

      const request = {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      service.getDistanceMatrix(request).then((response) => {
        if (this.state.selectedChargePoint) {
          let modChargePoint = { ...this.state.selectedChargePoint };
          modChargePoint.calculatedDistance =
            chargePointID == modChargePoint.chargePointID
              ? response.rows[0].elements[0].distance.value
              : null;

          this.setState({ selectedChargePoint: { ...modChargePoint } });
        }
      });
    }
  };

  infoWindowClosedHandler = () => this.setState({ selectedChargePoint: null });

  getPixelPositionOffset = (offsetWidth, offsetHeight, labelAnchor) => {
    return {
      x: offsetWidth + labelAnchor.x,
      y: offsetHeight + labelAnchor.y,
    };
  };

  markerHover = (chargingPoint) =>
    this.setState({
      hoveredChargingPoint: chargingPoint,
    });

  render() {
    const mapContainerStyle = {
      height: "100%",
      width: "100%",
    };

    const options = {
      // styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
    };

    const infoWindow = this.state.selectedChargePoint ? (
      <InfoWindow
        zIndex={0}
        position={{
          lat: +this.state.selectedChargePoint.location.lat,
          lng: +this.state.selectedChargePoint.location.lon,
        }}
        onCloseClick={() => this.infoWindowClosedHandler()}
      >
        <InfoPopUp chargePoint={this.state.selectedChargePoint} />
      </InfoWindow>
    ) : null;

    const mapOptions = {
      mapCenter: { lat: 50.110924, lng: 8.682127 },
      zoom: 8,
    };

    let mapContents = <Spinner />;

    return (
      <LoadScript
        loadingElement={<Spinner />}
        onLoad={this.scriptLoadedHandler}
        googleMapsApiKey={"AIzaSyASm_pdPPMnKA3vSjM_yYi45h6xLW9BWZ0"}
      >
        <GoogleMap
          id="map"
          ref="googleMap"
          onLoad={this.mapLoadedHandler}
          zoom={this.state.mapOptions.zoom}
          mapContainerStyle={mapContainerStyle}
          defaultCenter={this.state.mapOptions.center}
          center={this.state.mapOptions.center}
          options={options}
        >
          <React.Fragment>
            <MarkerClusterer
              averageCenter
              enableRetinaIcons
              options={{
                imagePath:
                  "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
              }}
            >
              {(clusterer) =>
                this.props.chargingStation.map((chargePoint) => {
                  return (
                    <Marker
                      key={chargePoint.chargePointID}
                      position={{
                        lat: +chargePoint.location.lat,
                        lng: +chargePoint.location.lon,
                      }}
                      onClick={() =>
                        this.chargingPointSelectedHandler(chargePoint)
                      }
                      title={chargePoint.operatorName}
                      clusterer={clusterer}
                      onMouseOver={() => this.markerHover(chargePoint)}
                      onMouseOut={() => this.markerHover(null)}
                      icon={{
                        url: `${
                          chargePoint.available ? markerGreen : markerRed
                        }`,
                        scaledSize:
                          this.state.hoveredChargingPoint &&
                          this.state.hoveredChargingPoint.chargePointID ===
                            chargePoint.chargePointID
                            ? new window.google.maps.Size(40, 40)
                            : new window.google.maps.Size(32, 32),
                      }}
                    />
                  );
                })
              }
            </MarkerClusterer>
            {infoWindow}
          </React.Fragment>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default MapWrapped;
