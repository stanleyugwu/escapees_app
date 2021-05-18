import { StatusBar } from "expo-status-bar";
import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  Dimensions,
  Button,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "react-native-switch";
import { MaterialIcons } from "@expo/vector-icons";


//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

//App Header
import Header from "./components/Header";
//Map Wrapper
import Map from "./screens/Map";
//api data fetch failure error
import FetchError from "./components/FetchError";
//fetching loader
import FetchLoader from "./components/FetchLoader";

//API DATA ADAPTERS
import getDieselStationsData from './adapters/diesel-stations.adapter';
import getGasStationsData from './adapters/gas-stations.adapter';

//Second View
import StationsListView from "./screens/StationsListView";

class App extends Component {
  constructor(props) {
    super(props);

    //methods (this) bindings
    this.switchToView = this.switchToView.bind(this);
    this.fetchData = this.fetchData.bind(this);

    //APP STATE
    this.state = {
      //Check if logo image failed to load so as to display text
      logoImageFailed: false,

      //currentScreenView = 1 for map view and 2 for list menu view
      currentScreenView: 1,

      //currentViewingStations = 1 for diesel and 2 for gas
      currentViewingStations: 1,

      //loaded stations data (null|object)
      fetchedData: {dieselStations:null,gasStations:null},

      //data that couldnt fetch (null = none, 1 = diesel, 2 = gas)
      firstFetchFailed: false,

      //request completion
      requestCompleted:false,

      //loading state `true` when loading ,`failed` when failed to fetch,`loaded` when fetched data
      loading: true,

      switchOn: true,
      sortByPrice: false,
    };

    //Map Station Switch toggle button inner-circle custom properties
    this.toggleBtn = {
      mapViewToggleInnerCircle: {
        alignItems: "center",
        justifyContent: "center",
      },
    };
  }

  componentDidMount() {
    //Disable the Animation warning to set native driver
    //Switch dependency didn't set it
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
    this.fetchData();
  }

  //Fetch Data
  async fetchData() {

    //temp state object for underlying operations (to avoid frequest state updates betwenn data fetching)
    let stateCache = {
      loading:true,
      firstFetchFailed:false,
      fetchedData:{
        dieselStations:null,
        gasStations:null
      }
    };

    //fetch diesel stations data
    await getDieselStationsData().then(data => {
      stateCache['fetchedData']['dieselStations'] = data;
    }).catch(e => {
      console.log('failed diesel');
      stateCache['firstFetchFailed'] = true;        
    });

    //fetch gas stations data
    await getGasStationsData().then(data => {
      stateCache['fetchedData']['gasStations'] = data;
      stateCache['loading'] = 'loaded';
    }).catch(e => {
      console.log('failed gas');
      stateCache['loading'] = stateCache['firstFetchFailed'] ? 'failed' : 'loaded';
    });

    this.setState(stateCache);
  }

  //toggle display btw map and stations-list view
  switchToView(view = 2) {
    this.setState({ currentScreenView: view });
  }

  //Util to check if data was fetched
  dataWasFecthed(){
    var store = this.state.fetchedData;
    return store && 
    (('dieselStations' in store && store['dieselStations']) || ('gasStations' in store && store['gasStations']))
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.container}>
          <View style={styles.appWrapper}>
            

            {/* Header */}
            <Header
              currentScreenView={this.state.currentScreenView}
              currentViewingStations={this.state.currentViewingStations}
              switchToView={this.switchToView}
            />

            {this.state.loading == true ? (
              //show loader when fetching data
              <FetchLoader />
            ) : this.state.loading == "failed" ? (
              //show failed when loading == 'failed'
              <FetchError />
            ) : this.state.loading == "loaded" ? (
              /* show map when loading == 'loaded' */
              <View style={styles.screensWrapper}>
                <View
                  style={{
                    flex: 1,
                    display:
                      this.state.currentScreenView == 1 ? "flex" : "none",
                  }}
                >
                  <Map 
                  stationsData={
                    this.state.currentViewingStations == 1 ?
                    this.state.fetchedData.dieselStations :
                    this.state.fetchedData.gasStations
                  }
                  >
                    {/*
                  //-> Floating Hamburger menu wrapper (absolutely positioned).
                  //-> Don't nest it inside footer view, it wont be clickable.
                  //-> (last element gets higher z-index)
                  */}
                    {this.state.currentScreenView == 1 ? (
                      <View style={styles.floatingHamburgerWrapper}>
                        <TouchableOpacity
                          onPress={(e) => this.switchToView(2)}
                          style={styles.floatingHamburger}
                          //disable if theres nothing fetched
                          disabled={
                            false
                          }
                        >
                          <MaterialIcons
                            name="toc"
                            size={30}
                            style={{ elevation: 10 }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </Map>
                </View>

                <View
                  style={{
                    flex: 1,
                    display:
                      this.state.currentScreenView == 2 ? "flex" : "none",
                  }}
                >
                  <StationsListView stationsData = {
                    this.state.currentViewingStations == 1 ?
                    this.state.fetchedData.dieselStations :
                    this.state.fetchedData.gasStations
                    }
                   />
                </View>
              </View>
            ) : (
              <Text>App Error!!!</Text>
            )}

            {/* FOOTER */}
            <View style={styles.footer}>
              <View style={styles.bottomNav}>
                {/* Switch toggle for gas/diesel view in map*/}
                <View style={styles.stationMapToggleWrapper}>
                  {
                    //show only when theres stations to display
                    this.dataWasFecthed() ? (
                      <Switch
                        value={
                          this.state.currentViewingStations == 1 ? true : false
                        }
                        onValueChange={(v) =>
                          this.setState({ currentViewingStations: v })
                        }
                        activeText="Gas"
                        inActiveText="Diesel"
                        backgroundActive="#ccc"
                        backgroundInactive="#ccc"
                        circleActiveColor="#fff"
                        circleInActiveColor="#fff"
                        circleBorderWidth={1}
                        barHeight={25}
                        switchWidthMultiplier={3}
                        changeValueImmediately={true}
                        innerCircleStyle={{
                          ...this.toggleBtn.mapViewToggleInnerCircle,

                          //Adjust properties  depending on current viewing station (gas/diesel)
                          width:
                            this.state.currentViewingStations == 1
                              ? "55%"
                              : "50%",
                          borderColor:
                            this.state.currentViewingStations == 1
                              ? "#0a0"
                              : "red",
                        }}
                        renderInsideCircle={() => (
                          <Text
                            style={{
                              color:
                                this.state.currentViewingStations == 1
                                  ? "#0a0"
                                  : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {this.state.currentViewingStations == 1
                              ? "Diesel"
                              : "Gas"}
                          </Text>
                        )}
                      />
                    ) : null
                  }
                </View>

                <View style={styles.optionsGroup}>
                  {/* Switch toggle for distance/price sorting in list view*/}
                  <View style={styles.listViewSortingToggleWrapper}>
                    {
                      //show only when theres stations to display and in second view
                      this.state.currentScreenView == 2 &&
                      this.dataWasFecthed() ? (
                        <Switch
                          value={this.state.sortByPrice}
                          onValueChange={(v) =>
                            this.setState({ sortByPrice: v })
                          }
                          activeText="Distance"
                          inActiveText="Price"
                          backgroundActive="#ccc"
                          backgroundInactive="#ccc"
                          circleActiveColor="#fff"
                          circleInActiveColor="#fff"
                          circleBorderWidth={1}
                          barHeight={25}
                          switchWidthMultiplier={3}
                          changeValueImmediately={true}
                          innerCircleStyle={{
                            ...this.toggleBtn.mapViewToggleInnerCircle,

                            //Adjust properties depending on current viewing station (gas/diesel)
                            width: this.state.sortByPrice ? "55%" : "68%",
                            borderColor: this.state.sortByPrice
                              ? "red"
                              : "blue",
                          }}
                          renderInsideCircle={() => (
                            <Text
                              style={{
                                color: this.state.sortByPrice ? "red" : "blue",
                                fontWeight: "bold",
                              }}
                            >
                              {this.state.sortByPrice ? "Price" : "Distance"}
                            </Text>
                          )}
                        />
                      ) : null
                    }
                  </View>

                  {/* Result Filter button*/}
                  <View style={styles.filterWrapper}>
                    <TouchableOpacity>
                      <MaterialIcons name="filter-alt" size={33} />
                    </TouchableOpacity>
                  </View>

                  {/* Help button*/}
                  <View style={styles.helpWrapper}>
                    <TouchableOpacity>
                      <MaterialIcons name="help-center" size={33} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="white" />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    width:'100%'
  },
  appWrapper: {
    flexDirection: "column",
    flex: 1,
    minHeight: "100%",
    width: "100%",
  },
  screensWrapper: {
    minHeight: "76%",
    width: "100%",
  },
  footer: {
    flexDirection: "column",
    backgroundColor: "white",
    borderWidth: 1,
    minHeight:'12%',
    width: "100%",
    borderWidth: 1,
    zIndex: 0,
    paddingHorizontal: "1%",
    paddingBottom: 0,
  },
  floatingHamburgerWrapper: {
    zIndex: 9999,
    position: "absolute",
    bottom: "5%",
    right: "8%",
    elevation: 10,
  },
  floatingHamburger: {
    position: "relative",
    padding: 10,
    // borderRadius:50,
    borderWidth: 1,
    borderColor: "#999",
    shadowOffset: { x: 30, y: 30 },
    shadowColor: "#999",
    backgroundColor: "white",
  },
  bottomNav: {
    flex: 1,
    flexDirection: "row",
  },
  stationMapToggleWrapper: {
    flex: 1.1,
    // borderWidth:1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsGroup: {
    flex: 2,
    // borderWidth:1,
    flexDirection: "row",
    alignItems: "center",
  },
  listViewSortingToggleWrapper: {
    flex: 3.2,
    alignItems: "center",
  },
  filterWrapper: {
    flex: 1,
    alignItems: "center",
  },
  helpWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

//flex for horiz axis
//justify = center horiz/vert
//alignitems = cross
export default App;
