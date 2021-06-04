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
import * as SecureStore from 'expo-secure-store';//credentials store package


const HomeScreen = (props) => {

    //currently showing station type (1 = diesel, 2 = gas)
    const [viewingStations, setViewingStations] = useState(1);

    //currently showing stations display type (1 = MapView, 2 = ListView)
    const [stationsDisplayView, setStationsDisplayView] = useState(1);

    //track data fetch progress (null = 'loading', true = 'loaded', false = 'encountered error')
    const [dataLoaded, setDataLoaded] = useState(null);//default is loading

    //resource data
    const [stationLocationsData, setStationLocationsData] = useState([]);

    //stations extract based on stations in view
    const stationsInView = stationLocationsData.filter((station) => {
        return true//station.locationId == viewingStations
    });

    //prevent going back to splash screen
    props.navigation.addListener('beforeRemove', e => e.preventDefault());

    //sorting prameter (1 = Distance, 2 = Price)
    const [sortingParameter,setSortingParameter] = useState(1);

    //secure-store-api availability
    const {storeAvailable, tokenAndDataExists, refresh_token, access_token} = props.route.params;//passed params
    const dataStore = 'eskp_pv_data';
    console.log(props.route.params)

    //online data fetch
    const fetchData = (token, storeAvailable, token_type = 'refresh') => {
        // getAllStationLocations(token, token_type)
        // .then(res => {
        //     if(res.ok) return res.json()
        //     else throw Error(false)
        // })
        // .then(stationsData => {
        //     if(storeAvailable){
        //         SecureStore.setItemAsync(dataStore,stationsData)
        //         .then()
        //         .catch()
        //     }
        //     setStationLocationsData(stationsData);
        //     setDataLoaded(true);
        // })
        // .catch(error => {
        //     console.log('online fetch error')
        //     if(error.message == false) return props.navigation.navigate('Login')
        //     else{
        //         dataLoaded != false && setDataLoaded(false);

        //     }
        // })
    }

    //data loader
    const loadData = async () => {
        setDataLoaded(null);//show loader

        if(tokenAndDataExists && storeAvailable){
            SecureStore.getItemAsync(dataStore)
            .then(data => {
                if(!data) throw Error('no data')
                else return JSON.parse(data)
            })
            .then(data => {
                if(data && data instanceof Array){
                    setStationLocationsData(data);
                    setDataLoaded(true);
                }else throw Error('invalid data')
            })
            .catch(error => {
                //couldnt get data from store
                if(refresh_token){
                    fetchData(refresh_token, storeAvailable);//get data online
                }else {
                    console.log('no data or token but said there was')
                    props.navigation.navigate('Login')
                }
            })

        }
        else if(!tokenAndDataExists && refresh_token){
            console.log('tn data yesy refresh token')
            fetchData(refresh_token, storeAvailable);//get data online with refresh_token
        }
        else if(!tokenAndDataExists && !refresh_token && access_token){
            //access_token exists (user just logged in)
            console.log('yes access')
            fetchData(access_token, storeAvailable, 'access');
        }
        else if(!tokenAndDataExists && !refresh_token && !access_token){
            console.log('no data or token')
            //no stored data or token to fetch it
            props.navigation.navigate('Login')
        }

    }

    //resource loader
    useEffect(() => {
        loadData()
        // SecureStore.getItemAsync('eskp_pv_data').then(console.log)
    },[])

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
                                <FetchError retry={loadData}/>
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