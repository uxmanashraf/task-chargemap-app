import React, {Component} from "react";
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

class App extends Component {


  componentDidMount() {
    let params = {
      distance: 50,
      distanceunit: "KM",
      connectiontypeid: "25,2,33",
      latitude: 51.905445,
      longitude: 4.466637
    }
    this.props.onFetchChargingStation(params);
  }

  render() {
      return (<h1>chargemapapp</h1>);
  }
}

const mapStateToProps = state => {
    return {
        chargingStation: state.chargingStation.chargingStation,
        loading: state.chargingStation.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchChargingStation: (queryParams) => dispatch( actions.fetchChargingStation(queryParams) )
    };
};
export default connect( mapStateToProps, mapDispatchToProps )(App);
