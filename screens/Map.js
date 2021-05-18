import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import CustomMarkerView from "../components/CustomMarkerView";
import CustomCalloutView from "../components/CustomCalloutView";
import PermissionWarning from "../components/PermissionWarning";

//install navigator global object for location
Location.installWebGeolocationPolyfill();

//Map View
const Map = (props) => {
  //location permission
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(
    true
  );

  //initial region (pittsburgh)
  const initialRegion = {
    // latitude: 40.43,
    // longitude: -80.01,
    latitude:35.734,
    longitude:-81.3648,
    latitudeDelta: 0.49,
    longitudeDelta: 0.49,
  };

  //Stations Data state
  // const [stationsData, setStationsData] = useState(props.stationsData);
  const stationsData = props.stationsData;

  //track when map is animated and disable map interaction when fetching location coords
  const [animated, setAnimated] = useState(false);

  //On Mount, Ask Permission
  useEffect(() => {
    stationsData && requestPermission(); //ask permission
  }, []);  

  //MapView reference
  var mapRef = null;

  const warn = () => {
    Alert.alert(
      "Location Needed",
      "You Can't Access Some Features Without Granting Access To Your Location");
  };

  //animate to region
  const animate = (pos, mapRef) => {
    mapRef.animateToRegion(
      {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.39,
        longitudeDelta: 0.39,
      },
      2000
    );
  };

  //check if user granted location permission, then ask to turn on location
  const requestPermission = async (
    retry = false /*retrying location access*/
  ) => {
    try {
      let { granted } = await Location.requestForegroundPermissionsAsync(); //ask permission
      if (granted) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            //user granted permission, animate to region
            animate(pos, mapRef); //pass global ref so animate would cache it
            setAnimated(true); //done animating
            setLocationPermissionGranted(true); //full permission granted
          },
          (error) => {
            warn();
            setAnimated(true); //denied location
            setLocationPermissionGranted(false); //user denied location
          }
        );
      } else {
        warn();
        setLocationPermissionGranted(false); //denied permission
        setAnimated(true); //not granted
      }
    } catch (error) {
      setLocationPermissionGranted(false); //deny on any other error caught
    }
  };


  return (
    <View style={styles.mapWrapper}>
      <MapView
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={locationPermissionGranted}
        ref={(map) => (mapRef = map)}
        // onRegionChangeComplete={r => alert(r.longitude)}
        mapType="standard"
        //all interaction attr. depends on whether user location is available
        scrollEnabled={animated}
        zoomEnabled={animated}
        zoomTapEnabled={animated}
        pitchEnabled={animated}
        rotateEnabled={animated}
        showsBuildings={true}
        loadingEnabled={true}
        loadingIndicatorColor={"#0a0"}
        toolbarEnabled={true}
        followsUserLocation={true}
        followsUserLocation={true}
      >
        {/* MARKERS POPULATION FROM FETCHED DATA */}
        {stationsData && stationsData.map((station, index) => {
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
        })}
      </MapView>
      {/*Expecting floating menu icon as child  */}
      {props.children}
      {
        //permission denial warning view
        !locationPermissionGranted ? (
          <PermissionWarning
            retryRequest={requestPermission.bind(this, true)}
          />
        ) : null
      }
      {
        !stationsData ? 
        <Text>We Couldnt Get {props.currentViewingStations == 1 ? 'Diesel' : 'Gas'} Data</Text> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
