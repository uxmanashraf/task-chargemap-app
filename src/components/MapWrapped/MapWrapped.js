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
  };

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
  };

  infoWindowClosedHandler = () => this.setState({ selectedChargePoint: null });

  getPixelPositionOffset = (offsetWidth, offsetHeight, labelAnchor) => {
    return {
      x: offsetWidth + labelAnchor.x,
      y: offsetHeight + labelAnchor.y,
    };
  };

  setMarkerLabels = (markerLables) => {
    this.setState({
      markerLabels: markerLables,
    });
  };

  markerLabelsHandler = (clusterer) => {
    const markerLabelsList = [];

    const labelAnchor = { x: -30, y: 0 };

    let allClusters = clusterer.clusters,
      allMarkers;
    allClusters.forEach((cluster, clusterIndex) => {
      allMarkers = cluster.getMarkers();
      allMarkers.forEach((marker, MarkerIndex) => {
        if (allMarkers.length < 2) {
          markerLabelsList.push(
            <OverlayView
              key={"m_" + clusterIndex + "_" + MarkerIndex}
              position={marker.position}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(x, y) =>
                this.getPixelPositionOffset(x, y, labelAnchor)
              }
            >
              <div
                style={{
                  background: `#203254`,
                  padding: `7px 12px`,
                  fontSize: "11px",
                  color: `white`,
                  borderRadius: "4px",
                }}
              >
                {marker.title}
              </div>
            </OverlayView>
          );
        }
      });
    });
    this.setMarkerLabels(markerLabelsList);
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
