import React, { useState, useEffect } from 'react';
import { Root, Container, Text, Button, Header, Content, Footer, Left, Body, Right, Icon, Grid, Col, Row, View, Spinner, H3, Title,} from 'native-base';

//components import
import AppHeader from '../components/AppHeader';

//viewingStations Switch component
import StationSwitch from '../components/StationSwitch';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import SortSwitch from '../components/SortSwitch';

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
                                <View style={{...styles.Center,height:'100%',}}>
                                    <Spinner size={50} color="#090"/>
                                    <Text style={{fontSize:17,fontWeight:'bold',color:'#555'}}>Loading Stations Data...</Text>
                                </View>
                            ) : null
                        }{/* RESOURCE LOAD INDICATOR */}
                            
                        {
                            //false == 'load failed'
                            dataLoaded == false ? (
                                <View style={{...styles.Center,height:'100%',padding:20}}>
                                    <Icon name="cloud" type="FontAwesome5" style={{fontSize:35,}}/>
                                    <Text style={{color:'red',fontSize:17,fontWeight:'bold'}}>Error Loading Data..</Text>
                                    <Text style={{textAlign:'center',fontSize:17}}>Make sure you're connected to the internet and try again.</Text>

                                    <TouchableOpacity 
                                        transparent bordered 
                                        style={{...styles.Center,...styles.RetryButton}}
                                        onPress={fetchData}
                                    >
                                        <Icon name="refresh" style={{color:'#090'}}/>
                                        <Text style={{color:'#090',fontWeight:'bold'}}>Try Again</Text>
                                    </TouchableOpacity>
                                </View>
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
    RetryButton:{
        marginTop:20,
        flexDirection:'row',
        padding:5,
        paddingHorizontal:10,
        borderWidth:1,
        borderColor:'#090'
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