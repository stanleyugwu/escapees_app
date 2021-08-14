import React, { useEffect, useState } from "react";
import { View, Text, Icon } from "native-base";
import { FlatList, LogBox } from "react-native";
//station display
import StationPane from "./components/StationPane";
//distance calculator helper
import distanceFromCoords from "../../utils/distanceFromCoords";
import store from "../../redux/store";

//price sorting function
const _priceSorter = (stationA, stationB) => {
  return stationA.memberPrice < stationB.memberPrice ? -1 : 1; //low to high sorting
};

//distance sorting function
const _distanceSorter = (stationA, stationB) => {
  //extract distance number from stations distanceFromUser prop value for sorting
  let stationADistance = +stationA.distanceFromUser.substring(
      0,
      stationA.distanceFromUser.indexOf(" ")
    ),
    stationBDistance = +stationB.distanceFromUser.substring(
      0,
      stationB.distanceFromUser.indexOf(" ")
    );

  return stationADistance < stationBDistance ? -1 : 1; //low to high sort
};

//renderer for empty list
const emptyComponentRenderer = () => (
  <View
    style={{
      flex: 1,
      height: "100%",
      minHeight: 100,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#eee", fontWeight: "700", fontSize: 15 }}>
      No Data for now, Please check back later
    </Text>
  </View>
);

//renderer for each station in list format
const stationRenderer = ({ item }) => {
  return <StationPane stationData={item} />;
};

//list header component
const listHeaderRenderer = (sortingParameter, dataAvailable) =>
  dataAvailable ? (
    <Text
      style={{ fontSize: 13, color: "#ddd", fontWeight: "700", lineHeight: 17 }}
    >
      Sorted by: {sortingParameter == 1 ? "Your Price" : "Distance"} (ascending)
    </Text>
  ) : null;

const ListView = (props) => {
  

  //data destructure
  const { stationLocationsData } = props;
  const {userPosition:pos, sortingParameter:sort} = store.getState();

  const [userPosition, setUserPosition] = useState(pos);
  const [sortingParameter, setSortingParameter] = useState(sort);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    return store.subscribe(() => {
      setUserPosition(store.getState().userPosition);
      setSortingParameter(store.getState().sortingParameter);
    });
  }, []);
  //loop through stations data and add distanceFromUser prop to each station
  let stationsData =
    stationLocationsData &&
    stationLocationsData.map((stationObj) => {
      let station = {...stationObj};//copy station object beacuse its immutable
      if (!userPosition || userPosition == "true") {
        station.distanceFromUser = false;
        return station;
      }

      try {
        //LatLng shorthands
        let { latitude: ulat, longitude: ulon } = userPosition,
          { latitude: slat, longitude: slon } = station;
        station.distanceFromUser = distanceFromCoords(ulat, slat, ulon, slon);
        console.log(station.distanceFromUser)
      } catch (error) {
        station.distanceFromUser = false;
      }

      return station;
    });

  //sort stations data by sorting paramter and calculate stations miles from userPosition
  stationsData =
    stationsData &&
    stationsData.sort(sortingParameter == 1 ? _priceSorter : _distanceSorter);

  return (
    <View
      style={{
        backgroundColor: "#3597e2",
        paddingTop: 10,
        padding: 5,
      }}
    >
      <FlatList
        data={stationsData}
        renderItem={stationRenderer}
        ListHeaderComponent={() =>
          listHeaderRenderer(sortingParameter, !!stationsData.length)
        }
        keyExtractor={(items, index) => index.toString()}
        ListEmptyComponent={emptyComponentRenderer}
      />
    </View>
  );
};

export default ListView;
