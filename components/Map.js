import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";


//Map View
const Map = (props) => {

  return (
    <View style={styles.mapWrapper}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          showsIndoors={true}
          minZoomLevel={2}
          zoomTapEnabled={true}
          zoomControlEnabled={false}
          showsBuildings={true}
          showsUserLocation={true}
          showsCompass={true}
          showsTraffic={true}
          toolbarEnabled={true}
          mapType="standard"
          followsUserLocation={true}
        >
          {/* <MapView.Marker
            key={Math.random() * 4}
            coordinate={currentLocation}
            title="Mark"
            description="Hello"
          /> */}
          <MapView.Marker
            key={Math.random() * 4}
            coordinate={{ latitude: 20.4406, longitude: -79.9959 }}
            title="Mark"
            description="Hello"
          />
        </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapWrapper: {
    // width:Dimensions.get('window').width,
    // height:Dimensions.get('window').height - 20,
    flex: 6.5,
  },
  map: {
    flex: 1,
    // height:Dimensions.get('window').height - 20,
  },
});

export default Map;
