import React, { useState, useEffect, useRef } from "react";
import {
  Root,
  Container,
  Content,
  Footer,
  Icon,
  Grid,
  Col,
  Row,
  View,
  Text,
} from "native-base";
import { StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

//components import
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/Footer/AppFooter";

import FetchLoader from "../components/FetchLoader"; //resource fetch loader
import FetchError from "../components/FetchError"; //fetch error view

//resource adapters
import getAllStationLocations from "../adapters/all-stations.adapter";
import getToken from "../adapters/get-token.adapter";

//Icon set
import { MaterialIcons } from "@expo/vector-icons";

//MAIN VIEWS WRAPPER
import MainViewsWrapper from "../components/MainViews/index";

//data storage and retrieval utils
import { storeData, retrieveData } from "../utils/localDataAdapters";
import store, { signOutUser, updateStationsData } from "../redux/store";

const HomeScreen = (props) => {

  //=>resource data (null = 'loading', [data] = 'loaded', false = 'encountered error')
  const [stationLocationsData, setStationLocationsData] = useState(null);
  //currently showing stations display type (1 = MapView, 2 = ListView )
  const [stationsDisplayType,setStationsDisplayType] = useState(1);

  //prevent going back to splash screen
  props.navigation.addListener("beforeRemove", (e) => e.preventDefault());


  //polymorphic data fetch function (fetches stations data with token or username/password)
  const fetchData = async (token, username, password) => {
    if(token){
      return await getAllStationLocations(token)
    }

    let tokenResult = await getToken(username,password);
    if(tokenResult.error) return tokenResult

    return await fetchData(tokenResult['access_token'])
  };

  //variable to track unmounts to avoid mem-leak
  var screenMounted = true;

  async function setUp(){
    
    var stationsData = store.getState().stationsData;
    if(stationsData){
      //signed in before
      screenMounted && setStationLocationsData(stationsData.slice(0,10));
    }else{
      let token = store.getState().authTokens;
      if(token){
        //just signing in
        console.log('just logged in')
        let result = await fetchData(token['access_token']);
        if(result.error){
          screenMounted && setStationLocationsData(false);
          return
        }
        screenMounted && setStationLocationsData(result.data);
        store.dispatch(updateStationsData(result.data));

        //store locally
        //schema
        let data = {
          login:store.getState().userLoginDetails,
          stationsData:result.data,
          tokens:token
        }

        let stored = await storeData('eskp_pv_data',data,true);
        if(!stored) console.log('Failed to store stations data');
      }else{
        //want to check prices
        let isGuest = store.getState().userStatus == 'guest';
        if(isGuest){
          console.log('guest')
          let genericLoginCreds = store.getState().genericLoginDetails;
          //fetch data with generic creds
          let result = await fetchData(false,genericLoginCreds.email, genericLoginCreds.password);
          if(result.error){
            screenMounted && setStationLocationsData(false);
            return
          }
          screenMounted && setStationLocationsData(result.data.slice(0,10));
          store.dispatch(updateStationsData(result.data));
        }else{
          store.dispatch(signOutUser());
        }
      }
    }
  }

  //resource loader
  useEffect(() => {
    setUp();
    return () => {
      screenMounted = false;
    }
  }, []);

  return (
    <Root>
      <Container>
        <AppHeader
          dataLoaded={!stationLocationsData ? false : true}
          showViewStatusBar={true}
        />
        <Content contentContainerStyle={{ flex: 1, height:'100%' }}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            {
              //data exists and not empty array
              stationLocationsData ? (
                <MainViewsWrapper
                  stationsDisplayType={stationsDisplayType}
                  stationLocationsData={stationLocationsData}
                />
              ) : null
            }
            {/* WRAPPER FOR MAP AND LIST VIEWS */}

            {
              //null == 'loading'
              stationLocationsData == null ? <FetchLoader /> : null
            }
            {/* RESOURCE LOAD INDICATOR */}

            {
              //false == 'load failed'
              stationLocationsData == false ? (
                <FetchError retry={setUp} />
              ) : null
            }
            {/* RESOURCE LOAD ERROR */}
          </View>
          <AppFooter 
            navigate={props.navigation.navigate} 
            stationsDataExists={stationLocationsData instanceof Array && stationLocationsData.length} 
            stationsDisplayType={stationsDisplayType} 
            setStationsDisplayType={setStationsDisplayType}
          />
        </Content>
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  Center: {
    alignItems: "center",
    justifyContent: "center",
  },
  RowStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  MenuItemTouchable: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  MenuItemIconWrapper: {
    alignItems: "flex-end",
    marginRight: 20,
  },
  MenuItemTextWrapper: {
    alignItems: "flex-start",
  },
  MenuItemText: {
    color: "#323232",
    fontFamily: "Roboto_medium",
  },
});

export default HomeScreen;
