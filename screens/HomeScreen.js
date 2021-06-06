import React, { useState, useEffect } from 'react';
import { Root, Container, Text, Button, Header, Content, Footer, Left, Body, Right, Icon, Grid, Col, Row, View, Spinner, H3, Title,} from 'native-base';
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

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

//storage helper packages
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encrypt, decrypt} from '../utils/cryptor';

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
    const {dataAvailable, tokens} = props.route.params;//passed params

    // data store key
    var storeKey = 'eskp_pv_data';

    //data retriever
    async function retrieveData() {
        try {   
        const data = await AsyncStorage.getItem(storeKey);
        if (data !== null && data.length > 0) {
            //decrypt data and parse it twice. parsing once doesn't work
            let decrypted = JSON.parse(JSON.parse(decrypt(data)));
            return decrypted
        }else return false
    
        } catch (error) {
            // There was an error on the native side
            return false
        }
    }

    //data persistor
    async function storeData(data) {
        try {
            await AsyncStorage.setItem(
                storeKey,
                encrypt(JSON.stringify(data))
            );
            //data stored
        } catch (error) {
            // There was an error on the native side
            Alert.alert(
                null,
                "Sorry! we couldn't save stations data on your device."
            )
        }
    }
    

    //online data fetch
    const fetchData = (token) => {
        getAllStationLocations(token['access_token'])
        .then(res => {
            if(res.ok) return res.json()
            else throw Error(false);//server error
        })
        .then(stationsData => {
            //data fetched
            //data validity checks
            if(stationsData && stationsData instanceof Array){
                setStationLocationsData(stationsData.slice(0,50));
                setDataLoaded(true);

                //persist data
                storeData({
                    tokens,
                    stationsData
                });

            }else throw Error(false);//server error
        })
        .catch(error => {
            if(error.message == false) return props.navigation.navigate('Login');//server error
            else dataLoaded != false && setDataLoaded(false);//network error
        })
    }

    //data loader
    const loadData = async () => {
        setDataLoaded(null);//show loader

        if(dataAvailable){
            //user logged in before, and data was fetched
            let data = await retrieveData();
            //data validity checks
            if(data && typeof data == 'object' && 'stationsData' in data && 'tokens' in data){
                setStationLocationsData(data['stationsData'].slice(0,5));
                setDataLoaded(true);
                return
            }else return props.navigation.navigate('Login');//invalid credentials

        }else if(!dataAvailable && tokens && 'access_token' in tokens){
            //no data but token was passed, (get data online)
            return fetchData(tokens);
        }else {
            //no stored data or token to fetch it
            return props.navigation.navigate('Login')
        }
    }

    //resource loader
    useEffect(() => {
        loadData();//isomorphic data loader
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