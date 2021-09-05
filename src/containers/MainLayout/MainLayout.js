import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';


import 'antd/dist/antd.css';
import './mainLayout.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import MapWrapped from '../../components/MapWrapped/MapWrapped';

class MainLayout extends Component {

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
        

        const { Header, Footer, Content } = Layout;

        return (
            <Layout className="layout">
                <Header>
                <div className="logo" />
                </Header>
                <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <MapWrapped chargingStation = {this.props.chargingStation} />
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
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
export default connect( mapStateToProps, mapDispatchToProps )(MainLayout);