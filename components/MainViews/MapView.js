import React, { useEffect, useRef, useMemo, useState } from "react";
import { View, Text, Icon, Grid, Col } from "native-base";
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from "react-native";

//MAP AND LOCATION PACKAGES
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

//Map Components
import CustomMarkerView from "./components/CustomMarkerView";
import CustomCalloutView from "./components/CustomCalloutView";
import store, { updateUserPosition } from "../../redux/store";

//install navigator global object for location
Location.installWebGeolocationPolyfill();

const AppMapView = (props) => {
  //props destructure
  const { stationLocationsData, } = props;
  const position = store.getState().userPosition;

  const [paneVisible, setPaneVisible] = useState(null);
  const [userPosition, setUserPosition] = useState(position)

  //initial region (pittsburgh)
  const initialRegion = {
    latitude: 40.43,
    longitude: -80.01,
    latitudeDelta: 7,
    longitudeDelta: 7,
  };

  //map reference
  var mapRef = useRef();
  
  //track umounts
  var screenFocused = true;

  //show location access denial warning
  const warn = () =>
    Alert.alert(
      "Access to location failed!",
      "There was an error accessing your location. If you denied location access, click 'enable' to enable it",
      [
        {
          text: "Enable",
          onPress: requestLocation,
          style: "default",
        },
        {
          text: "Cancel",
          onPress: (e) => screenFocused && setPaneVisible(true),
          style: "destructive",
        },
      ]
    );


  //location and permission request
  const requestLocation = async () => {

    //check for foreground location permission
    const status = await Location.getForegroundPermissionsAsync();

    //demand permission if not granted already
    if (!status.granted && screenFocused) {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted && screenFocused) return setPaneVisible(true); //never grab user location info if permission not granted
    }

    //if permission granted (if didn't return)
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          let region = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.39,
            longitudeDelta: 0.39,
          }

          //animate to user position coords
          screenFocused && mapRef && mapRef.animateToRegion(
            region,
            1000
          );
          setPaneVisible(false);
          store.dispatch(updateUserPosition(region));
          console.log(store.getState().userPosition)
        },
        (error) => {
          console.log(error)
          warn();
        },
        { enableHighAccuracy: Location.Accuracy.High }
      );
    } catch (e) {
      console.log(e)
      //catch any other thrown error
      warn();
    }
  };

  //request location on mount
  useEffect(() => {
    if(!userPosition) requestLocation();
    let unsubscribe = store.subscribe(() => {
      setUserPosition(store.getState().userPosition);
    });

    return () => {
      unsubscribe();
      screenFocused = false;
    }
  }, []);

  return (
    <View>
      <MapView
        accessible={true}
        collapsable={true}
        followsUserLocation={true}
        initialRegion={initialRegion}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        ref={(ref) => (mapRef = ref)}
        style={styles.MapStyle}
        showsCompass={true}
        showsMyLocationButton={true}
        showsUserLocation={true}
        rotateEnabled={true}
        toolbarEnabled={true}
        userLocationAnnotationTitle="You are here"
      >
        {stationLocationsData &&
          stationLocationsData.map((station, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
              >
                <CustomMarkerView
                  memberPrice={station.memberPrice}
                  logoUrl={station.logoUrl}
                />
                <Callout tooltip={true} alphaHitTest={true}>
                  <CustomCalloutView stationData={station} viewType={1} />
                </Callout>
              </Marker>
            );
          })}
      </MapView>

      {!userPosition && paneVisible ? (
        <View style={styles.Warning}>
          <Grid style={{ alignItems: "center", justifyContent: "center" }}>
            <Col size={88}>
              <TouchableOpacity
                onPress={(e) => {
                  setPaneVisible(false);
                  requestLocation();
                }}
              >
                <Text style={styles.Link}>Click here to turn on location</Text>
              </TouchableOpacity>
            </Col>
            <Col size={12}>
              <TouchableOpacity
                onPress={(e) => {
                  setPaneVisible(false);
                }}
              >
                <Icon name="close" />
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      ) : null}
      {/* LOCATION ACCESS DENIAL WARNING */}
    </View>
  );
};

const styles = StyleSheet.create({
  MapStyle: {
    height: Dimensions.get("window").height - 100,
    width: "100%",
    maxHeight: "100%",
  },
  Warning: {
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "blue",
  },
  Link: {
    textAlign: "center",
    fontWeight: "bold",
    color: "blue",
  },
});

export default AppMapView;
