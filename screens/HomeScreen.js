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

//viewingStations Switch and sort components
import StationSwitch from "../components/StationSwitch";
import SortSwitch from "../components/SortSwitch";

import FetchLoader from "../components/FetchLoader"; //resource fetch loader
import FetchError from "../components/FetchError"; //fetch error view

//resource adapters
import getAllStationLocations from "../adapters/all-stations.adapter";

//Icon set
import { MaterialIcons } from "@expo/vector-icons";

//MAIN VIEWS WRAPPER
import MainViewsWrapper from "../components/MainViews/index";

//data storage and retrieval utils
import { storeData, retrieveData } from "../utils/localDataAdapters";

const HomeScreen = (props) => {
  //=>currently showing station type (1 = diesel, 2 = gas)
  const [viewingStations, setViewingStations] = useState(1);

  //=>currently showing stations display type (1 = MapView, 2 = ListView )
  const [stationsDisplayView, setStationsDisplayView] = useState(1);

  //=>resource data (null = 'loading', [data] = 'loaded', false = 'encountered error')
  const [stationLocationsData, setStationLocationsData] = useState(null);

  //seperate gas and diesel from data set (0 = diesel, 1 = gas)
  if (stationLocationsData) {
    var dieselStations = stationLocationsData.filter(
        (station) => station.fuelTypeId == 0
      ),
      gasStations = stationLocationsData.filter(
        (station) => station.fuelTypeId == 1
      );
  }

  //=>fuel display type preference (1 = diesel, 2 = gasoline, 3 = gasoline&diesel)
  const [fuelTypePreference, setFuelTypePreference] = useState(
    3 /**gasoline&diesel */
  );

  //stations extract based on stations in view
  const stationsInView = viewingStations == 1 ? dieselStations : gasStations;

  //prevent going back to splash screen
  props.navigation.addListener("beforeRemove", (e) => e.preventDefault());

  //=>sorting prameter (1 = Price, 2 = Distance)
  const [sortingParameter, setSortingParameter] = useState(1);

  //=>user current latLng position
  const [userPosition, setUserPosition] = useState(null);

  //slide up menu state (1 = visible, 0 = hidden)
  const [slideUpMenuVisible, setSlideUpMenuVisibile] = useState(0);

  //secure-store-api availability
  const { dataAvailable, passedToken, login, hasNewPreference } =
    props.route.params; //passed params

  //online data fetch
  const fetchData = (token, username, password) => {
    // data store key
    var storeKey = "eskp_pv_data";

    getAllStationLocations(token)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error(false); //server error
      })
      .then((stationsData) => {
        //data fetched
        //data validity checks
        if (stationsData && stationsData instanceof Array) {
          setStationLocationsData(stationsData.slice(0, 10));

          //persist data
          let stored = storeData(
            storeKey,
            {
              login: {
                usernameOrEmail: username,
                password: password,
              },
              stationsData,
            },
            true
          );

          stationsData = null; //clear memory

          if (!stored) throw Error("native side error"); //error while storing
        } else throw Error(false); //server error
      })
      .catch((error) => {
        if (error.message == false) return props.navigation.navigate("Login");
        //server error
        else if (error.message == "native side error")
          return props.navigation.navigate("Login");
        else stationLocationsData != false && setStationLocationsData(false); //network error
      });
  };

  //data loader
  const loadData = async () => {
    var storeKey = "eskp_pv_data"; //data store key
    // setDataLoaded(null);//show loader

    if (dataAvailable) {
      //user logged in before, and data was fetched
      let data = await retrieveData(storeKey, true);

      //data validity checks
      if (
        data &&
        typeof data == "object" &&
        "stationsData" in data &&
        data["stationsData"] &&
        "login" in data
      ) {
        setStationLocationsData(data["stationsData"].slice(0, 10));
        data = null; //clear memory
        // setDataLoaded(true);
        return;
      } else return props.navigation.navigate("Login"); //invalid credentials
    } else if (
      !dataAvailable &&
      passedToken &&
      !!login &&
      "usernameOrEmail" in login &&
      "password" in login
    ) {
      //no data but token was passed, (get data online)
      return fetchData(
        passedToken,
        login["usernameOrEmail"],
        login["password"]
      );
    } else {
      //no stored data or token to fetch it
      return props.navigation.navigate("Login");
    }
  };

  const loadPreferences = async () => {
    let storeKey = "eskp_pv_preferences";
    let preferences = await retrieveData(storeKey, false);

    if (preferences) {
      var { fuelType, fuelPrice, fuelUnit } = preferences;
      let ftp = fuelType == "diesel" ? 1 : fuelType == "gasoline" ? 2 : 3;
      setFuelTypePreference(ftp);

      //also sync view and data with preference when set
      if (ftp < 3) {
        setViewingStations(ftp);
      }
    }
  };

  //reload preference if theres new preference set from preferenceScreen
  if (hasNewPreference) {
    loadPreferences();
  }

  //resource loader
  useEffect(() => {
    props.navigation.isFocused() && loadPreferences();
    loadData(); //isomorphic data loader //load up and sync app with preferences
  }, []);

  return (
    <Root>
      <Container>
        <AppHeader
          viewingStations={viewingStations}
          dataLoaded={!stationLocationsData ? false : true}
          showViewStatusBar={true}
        />

        <Content contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            {
              //data exists and not empty array
              stationLocationsData && stationLocationsData.length ? (
                <MainViewsWrapper
                  setStationsDisplayView={setStationsDisplayView}
                  stationsInView={stationsInView}
                  stationsDisplayView={stationsDisplayView}
                  userPosition={userPosition}
                  setUserPosition={setUserPosition}
                  sortingParameter={sortingParameter}
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
                <FetchError retry={loadData} />
              ) : null
            }
            {/* RESOURCE LOAD ERROR */}
          </View>

          <Grid
            style={{
              backgroundColor: "white",
              width: "100%",
              display: slideUpMenuVisible ? "flex" : "none",
            }}
          >
            <Row style={{ maxHeight: 30 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#606060",
                  width: "100%",
                  ...styles.Center,
                }}
                onPress={() => setSlideUpMenuVisibile(0)}
              >
                <Icon
                  name="chevron-thin-down"
                  type="Entypo"
                  style={{ color: "white", fontWeight: "700" }}
                />
              </TouchableOpacity>
            </Row>
            {/* Close button */}

            <Row style={styles.RowStyle}>
              <TouchableOpacity
                style={styles.MenuItemTouchable}
                onPress={() => props.navigation.navigate("Preferences")}
              >
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="star-sharp" type="Ionicons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Preferences</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (preferences)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity
                style={styles.MenuItemTouchable}
                onPress={() => props.navigation.navigate("Transactions")}
              >
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="receipt" type="MaterialCommunityIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Transaction History</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (transaction history)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity style={styles.MenuItemTouchable}>
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="account-circle" type="MaterialIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Account Info</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (Account Info)*/}

            <Row style={styles.RowStyle}>
              <TouchableOpacity style={styles.MenuItemTouchable}>
                <Col size={33} style={styles.MenuItemIconWrapper}>
                  <Icon name="help" type="MaterialIcons" />
                </Col>
                <Col size={67} style={styles.MenuItemTextWrapper}>
                  <Text style={styles.MenuItemText}>Help and Instructions</Text>
                </Col>
              </TouchableOpacity>
            </Row>
            {/* menu items (Help and Instruction)*/}
          </Grid>
          {/* Slide Menu */}
        </Content>

        <Footer style={{ height: 75, backgroundColor: "white" }}>
          <Grid style={{ position: "relative", width: "100%" }}>
            <Row size={38}>
              <TouchableHighlight
                onPress={() =>
                  setStationsDisplayView(stationsDisplayView == 1 ? 2 : 1)
                }
                style={{
                  backgroundColor: "#3597e2",
                  width: "100%",
                  display:
                    stationLocationsData && stationLocationsData.length
                      ? "flex"
                      : "none",
                  ...styles.Center,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  {stationsDisplayView == 1 ? "List View" : "Map View"}
                </Text>
              </TouchableHighlight>
            </Row>
            {/* Views Toggler */}

            <Row size={62}>
              <Col style={styles.Center} size={35}>
                {stationLocationsData && stationLocationsData.length ? (
                  <StationSwitch
                    viewingStations={viewingStations}
                    setViewingStations={setViewingStations}
                    fuelTypePreference={fuelTypePreference}
                    screenFocused={props.navigation.isFocused()}
                  />
                ) : null}
              </Col>

              <Col size={35} style={styles.Center}>
                {stationsDisplayView == 2 &&
                stationsInView &&
                stationsInView.length ? (
                  <SortSwitch
                    sortingParameter={sortingParameter}
                    setSortingParameter={setSortingParameter}
                    //disable sort toggle if no user position
                    notToggleable={
                      userPosition == false || userPosition == "true"
                        ? true
                        : false
                    }
                  />
                ) : null}
              </Col>

              <Col style={styles.Center} size={30}>
                <Row>
                  <Col style={{ ...styles.Center, paddingLeft: 3 }}>
                    <TouchableOpacity>
                      <Icon name="filter" /*funnel*/ type="AntDesign" />
                    </TouchableOpacity>
                  </Col>
                  <Col
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "space-around",
                      paddingLeft: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setSlideUpMenuVisibile(slideUpMenuVisible ? 0 : 1)
                      }
                    >
                      <Icon
                        name="menu"
                        type="Entypo"
                        style={{ fontSize: 38, color: "#444" }}
                      />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Footer>
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
