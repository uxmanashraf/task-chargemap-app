import React, {Component} from "react";
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import MainLayout from './containers/MainLayout/MainLayout';

class App extends Component {


    componentDidMount() {
    }

    render() {
        return (
            <MainLayout />
        );
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
