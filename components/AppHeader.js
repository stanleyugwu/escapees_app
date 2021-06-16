import React, { useMemo } from 'react';
import {Text, Button, Header, Left, Body, Thumbnail, View } from 'native-base';

//app logo
import logo from '../assets/images/logo.png';
//icon pack
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';


const AppHeader = (props) => {

    //props destructure
    const {viewingStations, stationsDisplayView, setStationsDisplayView,dataLoaded} = props;
    
    //station in view
    const stationInView = viewingStations == 1 ? 'Diesel Fuel' : 'Gas';

    //memoize for speed
    return useMemo(() => {
        return (
            <View>
                <Header
                    backgroundColor="#fff"
                    style={{backgroundColor:'#fff'}}
                    iosBarStyle="light-content"
                    noShadow={true}
                    androidStatusBarColor={viewingStations == 1 ? '#090' : 'red'}
                >
                    <Left style={{maxWidth:'15%',paddingTop:11}}>
                        {
                            //only show arrow on stations-list-view
                            stationsDisplayView == 2 ? (
                                <Button transparent style={{padding:0}}>
                                    <TouchableOpacity onPress={e => setStationsDisplayView(1)} >
                                        <Icon name="arrow-back-ios" size={38} color="#555"/>
                                    </TouchableOpacity>
                                </Button>
                            ) : null
                        }
                    </Left>
                    <Body>
                        <Thumbnail large source={logo} square resizeMode="contain" style={{width:'100%',height:'100%'}}/>
                    </Body>
                </Header>

                {/* Viewing Stations status bar */}
                <View style={{backgroundColor: viewingStations == 1 ? '#090' : 'red'}}>
                    <Text style={{color:'white',textAlign:'center'}}>
                        {
                            dataLoaded ? `Currently Viewing ${stationInView} Prices`  : 'Loading...'
                        }
                    </Text>
                </View>
            </View>
        
        )
    }, [viewingStations, stationsDisplayView, dataLoaded]);//re-render determinants

};

export default AppHeader