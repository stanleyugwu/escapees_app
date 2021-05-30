import React, { useState, useEffect } from 'react';
import { Root, Container, Text, Button, Header, Content, Footer, Left, Body, Right, Icon, Grid, Col, Row, View, Spinner, H3, Title,} from 'native-base';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

//components import
import AppHeader from '../components/AppHeader';

//viewingStations Switch and sort components
import StationSwitch from '../components/StationSwitch';
import SortSwitch from '../components/SortSwitch';

import FetchLoader from '../components/FetchLoader';//resource fetch loader
import FetchError from '../components/FetchError';//fetch error view

//resource adapters
import getAllStationLocations from '../adapters/all-stations.adapter';

//Icon set
import { MaterialIcons } from "@expo/vector-icons";

//MAIN VIEWS WRAPPER
import MainViewsWrapper from '../components/MainViews/index';



const HomeScreen = (props) => {

    //currently showing station type (1 = diesel, 2 = gas)
    const [viewingStations, setViewingStations] = useState(1);

    //currently showing stations display type (1 = MapView, 2 = ListView)
    const [stationsDisplayView, setStationsDisplayView] = useState(1);

    //track data fetch progress (null = 'loading', true = 'loaded', false = 'encountered error')
    const [dataLoaded, setDataLoaded] = useState(false);//default is loading

    //resource data
    const [stationLocationsData, setStationLocationsData] = useState([]);

    //stations extract based on stations in view
    const stationsInView = stationLocationsData.filter((station) => {
        return station.locationId == viewingStations
    });

    //prevent going back to splash screen
    props.navigation.addListener('beforeRemove', e => e.preventDefault());

    //sorting prameter (1 = Distance, 2 = Price)
    const [sortingParameter,setSortingParameter] = useState(1);

    //data loader
    const fetchData = () => {
        setDataLoaded(null);
        getAllStationLocations()/*then(res => res.json())*/.then(data => {
            setStationLocationsData(data);
            setDataLoaded(true);
        }).catch(error => {
            setDataLoaded(false);
        })
    }

    //resource loader
    useEffect(fetchData,[])

    return (
        <Root>
            <Container>
                <AppHeader
                    stationsDisplayView={stationsDisplayView}
                    viewingStations={viewingStations}
                    setStationsDisplayView={setStationsDisplayView}
                    dataLoaded={dataLoaded}
                />

                <Content contentContainerStyle={{flex:1,}}>
                    <View style={{flex:1,backgroundColor:'transparent'}}>
                        {
                            //true == 'loaded'
                            dataLoaded == true ? (
                                <MainViewsWrapper
                                    setStationsDisplayView={setStationsDisplayView} 
                                    stationsInView={stationsInView}
                                    stationsDisplayView={stationsDisplayView}
                                />
                            ) : null 
                        }
                        {/* WRAPPER FOR MAP AND LIST VIEWS */}

                        {
                            //null == 'loading'
                            dataLoaded == null ? (
                                <FetchLoader/>
                            ) : null
                        }{/* RESOURCE LOAD INDICATOR */}
                            
                        {
                            //false == 'load failed'
                            dataLoaded == false ? (
                                <FetchError/>
                            ) : null
                        }{/* RESOURCE LOAD ERROR */}
                        
                    </View>
                </Content>

                {
                    stationsDisplayView == 1 && dataLoaded ? (
                        <TouchableOpacity style={{...styles.FloatingMenu,}} onPress={e => setStationsDisplayView(2)}>
                            <MaterialIcons name="toc" size={35} />
                        </TouchableOpacity>
                    ) : null
                }
                {/* Floating Hamburger Menu for switching views */}
                

                <Footer style={{ backgroundColor: '#fff',borderWidth:1, height:50}}>
                    <Grid style={styles.Center}>
                        <Col style={styles.Center} size={35}>
                            {
                                dataLoaded ? (
                                    <StationSwitch viewingStations={viewingStations} setViewingStations={setViewingStations}/>
                                ) : null
                            }
                        </Col>

                        <Col size={35} style={styles.Center}>
                            {
                                stationsDisplayView == 2 && dataLoaded ? (
                                    <SortSwitch
                                        sortingParameter={sortingParameter}
                                        setSortingParameter={setSortingParameter}
                                    />
                                ) : null
                            }
                        </Col>

                        <Col style={styles.Center} size={30}>
                            <Row>
                                <Col style={{...styles.Center,paddingLeft:5}}>
                                    <TouchableOpacity>
                                        <Icon name="filter"/*funnel*/ type="AntDesign" />
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{alignItems:'flex-start',justifyContent:'space-around',paddingLeft:5}}>
                                    <TouchableOpacity>
                                        <Icon name="help-circle-outline"/>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </Col>
                    </Grid>
                </Footer>
            </Container>
        </Root>
    )
};

const styles = StyleSheet.create({
    Center:{
        alignItems:'center',
        justifyContent:'center'
    },
    FloatingMenu:{
        backgroundColor:'white',
        elevation:8,
        borderWidth:1,
        borderColor:'#999',
        padding:7,
        borderRadius:10,
        position:'absolute',
        bottom:80,
        right:30,
    }
})

export default HomeScreen