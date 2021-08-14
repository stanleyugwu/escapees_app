import React, { useMemo } from 'react';
import {Text, Button, Header, Left, Body, Thumbnail, View } from 'native-base';

//app logo
import logo from '../assets/images/logo.png';
//icon pack
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import store from '../redux/store';


const AppHeader = (props) => {

    //props destructure
    const {dataLoaded, showViewStatusBar} = props;
    
    //station in view
    const stationsInView = store.getState().stationsInView == 1 ? 'Diesel Fuel' : 'Gas';

    //memoize for speed
    return useMemo(() => {
        return (
            <View>
                <Header
                    backgroundColor="#fff"
                    style={{backgroundColor:'#fff'}}
                    iosBarStyle="light-content"
                    noShadow={true}
                    androidStatusBarColor={showViewStatusBar ? stationsInView == 'Diesel Fuel' ? '#090' : 'red' : 'black'}
                >
                    <Body style={{paddingHorizontal:10}}>
                        <Thumbnail large source={logo} square resizeMode="contain" style={{width:'100%',height:'100%'}}/>
                    </Body>
                </Header>

                {/* Viewing Stations status bar */}
                {
                    showViewStatusBar ? (
                    <View style={{backgroundColor: stationsInView == 'Diesel Fuel' ? '#090' : 'red'}}>
                        <Text style={{color:'white',textAlign:'center'}}>
                            {
                                dataLoaded ? `Currently Viewing ${stationsInView} Prices`  : 'Loading...'
                            }
                        </Text>
                    </View>
                    ) : null
                }
            </View>
        
        )
    }, [stationsInView,dataLoaded, showViewStatusBar]);//re-render determinants

};

export default AppHeader