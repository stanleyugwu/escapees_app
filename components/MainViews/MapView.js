import React, {useEffect, useRef, useState} from 'react';
import { View, Text, Container, Root, Content, Button, Icon, Grid, Col,} from 'native-base';
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

//MAP AND LOCATION PACKAGES
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

//Map Components
import CustomMarkerView from './components/CustomMarkerView';
import CustomCalloutView from './components/CustomCalloutView';


//install navigator global object for location
Location.installWebGeolocationPolyfill();

const AppMapView = (props) => {

    //props destructure
    const {stationLocationsData, setUserPosition, userPosition} = props;

    //initial region (pittsburgh)
    const initialRegion = {
        // latitude: 40.43,
        // longitude: -80.01,
        latitude: 35.734,
        longitude: -81.3648,
        latitudeDelta: 0.49,
        longitudeDelta: 0.49,
    };

    //map reference
    var mapRef = useRef();

    //show location access denial warning
    const warn = () => Alert.alert(
        "Access to location failed!",
        "This could be because you denied access to your location, or the app failed to access your location.\nClick 'enable' to enable location",
        [
            {
              text: "Enable",
              onPress: requestLocation,
              style: "default"
            },
            { text: "Cancel", onPress: e => setUserPosition(false), style:"destructive" }
        ]
    );

    //request location on mount
    useEffect(()=>{
        requestLocation();
    },[]);

    //location and permission request
    const requestLocation = async ()  => {

        if(userPosition instanceof Object) return

        //check for foreground location permission
        const status = await Location.getForegroundPermissionsAsync();
        
        //demand permission if not granted already
        if(!status.granted){
            const {granted} = await Location.requestForegroundPermissionsAsync();
            if(!granted) return setUserPosition(false); //never grab user location info if permission not granted
        }

        //if permission granted (if didn't return)
        try{
            navigator.geolocation.getCurrentPosition((pos) => {

                //animate to user position coords
                mapRef.animateToRegion({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    latitudeDelta: 0.39,
                    longitudeDelta: 0.39,
                },1000);

                setUserPosition(pos.coords);

            },(error) => {
                console.log(error)
                setUserPosition(false);//failed or denied by user
                warn();
            },{enableHighAccuracy:Location.Accuracy.High});

        }catch(e){
            //catch any other thrown error
            warn()
            setUserPosition(false);
        }

    }

    return (
        
        <View>
            <MapView
                accessible={true}
                collapsable={true}
                followsUserLocation={true}
                initialRegion={initialRegion}
                mapType="standard"
                provider={PROVIDER_GOOGLE}
                ref={ref => mapRef = ref}
                style={styles.MapStyle}
                showsCompass={true}
                showsMyLocationButton={true}
                showsUserLocation={true}
                rotateEnabled={true}
                toolbarEnabled={true}
                userLocationAnnotationTitle="You are here"
            >
                {
                    stationLocationsData && stationLocationsData.map((station, index) => {
                        return (
                            <Marker
                              key={index}
                              coordinate={{
                                latitude: station.latitude,
                                longitude: station.longitude,
                              }}
                            >
                              <CustomMarkerView memberPrice={station.memberPrice}/>
                              <Callout tooltip={true} alphaHitTest={true}>
                                <CustomCalloutView stationData={station} viewType={1} />
                              </Callout>
                            </Marker>
                          );
                    })
                }
            </MapView>

            {
                userPosition == false ? (
                    <View style={styles.Warning}>
                        <Grid style={{alignItems:'center',justifyContent:'center'}}>
                            <Col size={88}>
                                <TouchableOpacity onPress={e => {requestLocation()}}>
                                    <Text style={styles.Link}>Click here to turn on location</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={12}>
                                <TouchableOpacity onPress={e => {setUserPosition(true)}}>
                                    <Icon name="close"/>
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    </View>
                ) : null
            }{/* LOCATION ACCESS DENIAL WARNING */}
            
        </View>     

    )
}

const styles = StyleSheet.create({
    MapStyle:{
        height:Dimensions.get('window').height - 100,
        width:'100%',
        maxHeight:'100%',
    },
    Warning:{
        position:'absolute',
        backgroundColor:'white',
        width:'100%',
        borderBottomWidth:1,
        borderBottomColor:'blue'
    },
    Link:{
        textAlign:'center',
        fontWeight:'bold',
        color:'blue'
    }
})

export default AppMapView