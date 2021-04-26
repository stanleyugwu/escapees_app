import { StatusBar } from "expo-status-bar";
import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
  Platform,
  Image,
  Dimensions,
  Button,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "react-native-switch";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

//App Header
import Header from "./components/Header";
//Map Wrapper
import Map from "./components/Map";
//Permission Denied Error
import LocationPermissionDeniedError from "./components/LocationPermissionDeniedError";
//Gps off error
import GPSOffError from './components/GpsOffError';

class App extends Component {
  constructor(props) {
    super(props);

    //APP STATE
    this.state = {
      //Check if logo image failed to load so as to display text
      logoImageFailed: false,

      //currentScreenView = 1 for map view and 2 for list menu view
      currentScreenView: 1,

      //currentViewingStations = 1 for diesel and 2 for gas
      currentViewingStations: 1,

      //location oermission stat
      locationPermissionGranted: true,

      //user location coords
      userLocation: {},

      //loaded stations data
      fetchedData: [],

      //loading state
      loading: false,

      //data fetch failure
      loadingFailed: false,
      gpsOn:true,

      //gps state
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

    //invoke permission requester
    this.requestPermission();
  }

  //Location Permission request function
  async requestPermission() {
    //If location permission has been granted, go on to turning gps, else request permission
    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      this.setState({ locationPermissionGranted: false });
      return;
    }
    this.setState({locationPermissionGranted:true})
    //if granted, fetch data
    this.state.fetchedData.length == 0 && this.fetchData()
  }

  //Fetch Data
  fetchData() {
    this.setState({ loading: true });

    const fetched = async () => {
      let gpsOn = await Location.hasServicesEnabledAsync();
      if(gpsOn) return this.setState({fetchedData:[{a:1}], loading:false})

      Location.enableNetworkProviderAsync().then(() => {
        this.setState({fetchedData:[{a:1}], loading:false})
      }).catch(error => {
        this.setState({loading:false, gpsOn:false});
        this.registerGpsListener([{a:1}])
      })
    }

    //mock function for fetching data with delay
    setTimeout(
      fetched,
      2000
    );
  }

  //GPS State Listener
  registerGpsListener(data){
    let interval = setInterval(async () => {
      let gpsOn = await Location.hasServicesEnabledAsync();
      if(gpsOn) this.setState({fetchedData:data, gpsOn:true}) ?? clearInterval(interval);
    }, 1000)
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.container}>
          <View style={styles.appWrapper}>
            {/* Header */}
            <Header
              currentViewingStations={this.state.currentViewingStations}
            />

            {/* MAP VIEW */}
            {this.state.fetchedData.length > 0 ? (
              <Map fetchedData={this.state.fetchedData} />
            ) : null}

            {/* GPS Turn on denied Error View */}
            {!this.state.gpsOn ? <GPSOffError/> : null}

            {/* No Permission Error View */}
            {!this.state.locationPermissionGranted ? (
              <LocationPermissionDeniedError
                turnOnLocation={function(){this.requestPermission()}.bind(this)}
              />
            ) : null}

            {/* Loading View */}
            {this.state.loading ? (
              <View
                style={{
                  flex: 7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size={40} color="green" />
                <Text>Fetching Data...</Text>
                <Text>Make sure you're connected to internet</Text>
              </View>
            ) : null}

            {/* Loading Failed */}
            {this.state.loadingFailed ? (
              <View
                style={{
                  flex: 7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="chain-broken" size={40} color="red" />
                <Text>Loading Failed</Text>
                <Text>
                  Make sure you're connected to internet, and try again
                </Text>
              </View>
            ) : null}

            {/* FOOTER */}
            {this.state.fetchedData.length ? (
              <View style={styles.footer}>
                <View style={styles.bottomNav}>
                  {/* Switch toggle for gas/diesel view in map*/}
                  <View style={styles.stationMapToggleWrapper}>
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

                        //Adjust properties depending on current viewing station (gas/diesel)
                        width:
                          this.state.currentViewingStations == 1
                            ? "55%"
                            : "50%",
                        borderColor:
                          this.state.currentViewingStations == 1
                            ? "green"
                            : "red",
                      }}
                      renderInsideCircle={() => (
                        <Text
                          style={{
                            color:
                              this.state.currentViewingStations == 1
                                ? "green"
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
                  </View>

                  <View style={styles.optionsGroup}>
                    {/* Switch toggle for distance/price sorting in list view*/}
                    <View style={styles.listViewSortingToggleWrapper}>
                      <Switch
                        value={this.state.sortByPrice}
                        onValueChange={(v) => this.setState({ sortByPrice: v })}
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
                          borderColor: this.state.sortByPrice ? "red" : "blue",
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
                    </View>

                    {/* Result Filter button*/}
                    <View style={styles.filterWrapper}>
                      <TouchableOpacity>
                        <FontAwesome name="filter" size={28} />
                      </TouchableOpacity>
                    </View>

                    {/* Help button*/}
                    <View style={styles.helpWrapper}>
                      <TouchableOpacity>
                        <FontAwesome name="question-circle" size={28} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {/*
              //-> Floating Hamburger menu wrapper (absolutely positioned).
              //-> Don't nest it inside footer view, it wont be clickable.
              //-> (last element gets higher z-index)
            */}
            <View style={styles.floatingHamburgerWrapper}>
              <TouchableOpacity
                onPress={(e) => alert("Hey")}
                style={styles.floatingHamburger}
                disabled={this.state.fetchedData.length == 0}
              >
                <FontAwesome name="bars" size={30} style={{ elevation: 10 }} />
              </TouchableOpacity>
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
  },
  appWrapper: {
    flexDirection: "column",
    flex: 1,
    height: "100%",
  },
  footer: {
    flex: 0.5,
    flexDirection: "column",
    backgroundColor: "white",
    borderWidth: 1,
    width: "100%",
    borderWidth: 1,
    zIndex: 0,
    paddingHorizontal: "1%",
    paddingBottom: 0,
  },
  floatingHamburgerWrapper: {
    zIndex: 9999,
    position: "absolute",
    bottom: "10%",
    right: "5%",
    backgroundColor: "#fff",
    elevation: 10,
  },
  floatingHamburger: {
    position: "relative",
    padding: 10,
    shadowOffset: { x: 30, y: 30 },
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

export default App;
