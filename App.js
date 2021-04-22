import { StatusBar } from 'expo-status-bar';
import React, {Component, Fragment} from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, TouchableOpacity, Alert, Platform, Image, ScrollView, Dimensions, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Switch} from 'react-native-switch'
import {FontAwesome} from '@expo/vector-icons';
import MapView from 'react-native-maps';

//Just to disable Animation "useNativeDriver" Warning
import {LogBox} from 'react-native';

//App logo
import Logo from './assets/images/logo.png';

class App extends Component{

  constructor(props){
    super(props);

    //APP STATE
    this.state = {
      logoImageFailed:false,
      currentView:'Diesel Fuel Prices',
      switchOn:true,
      sortByPrice:false
    }

    //Map Station Switch toggle button inner-circle custom properties
    this.toggleBtn = {
      mapViewToggleInnerCircle:{
        alignItems:'center',
        justifyContent:'center',
      }
    }

  }

  componentDidMount(){

    //Disable the Animation warning to set native driver
    //Switch dependency didn't set it 
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
  }

  render(){
    return (
      <Fragment>
       <SafeAreaView style={styles.container}>
          <View style={styles.appWrapper}>  

            {/* Header */}
            <View style={styles.header}>

              {/* Top (arrow/logo) container */}
              <View style={styles.topHeaderNav}>

                {/* Nav Arrow Icon */}
                <View style={styles.arrowIcon}>
                  <TouchableOpacity>
                    <FontAwesome name="angle-left" size={40} />
                  </TouchableOpacity>
                </View>

                {/* Logo */}
                <View style={styles.logoWrapper}>
                  <Image
                    source={Logo}
                    resizeMode="contain"
                    onError={e => this.setState({logoImageFailed:true})}
                    onLoad={e => this.setState({logoImageFailed:false})}
                    style={styles.logoImage}
                  />
                  {
                    //Show Text as logo when image fails to load
                    this.state.logoImageFailed ? <Text>EscapeesRvClub</Text> : null
                  }
                </View>
              </View>

              {/* Current Viewing Status */}
              <View style={styles.viewStatus}>
                <Text style={styles.viewStatusText}>Currently Viewing {this.state.currentView}</Text>
              </View>

            </View>

            {/* MAP VIEW */}
            <View style={styles.mapWrapper}>
              <MapView
              provider={MapView.PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{latitude:40.4406,longitude:-79.9959, latitudeDelta:6.6552,longitudeDelta:26.7924}}
              showsIndoors={true}
              showsBuildings={true}
              showsUserLocation={true}
              showsCompass={true}
              // showsTraffic={true}
              mapType="standard"
              followsUserLocation={true}
              >
                <MapView.Marker
                  key={Math.random() * 4}
                  coordinate={{latitude:40.4406,longitude:-79.9959}}
                  title="Mark"
                  description="Hello"
                  
                />
              </MapView>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <View style={styles.bottomNav}>

                {/* Switch toggle for gas/diesel view in map*/}
                <View style={styles.stationMapToggleWrapper}>
                  <Switch
                    value={this.state.switchOn}
                    onValueChange={v => this.setState({switchOn:v})}
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
                    innerCircleStyle={
                      {
                        ...this.toggleBtn.mapViewToggleInnerCircle,

                        //Adjust properties depending on current viewing station (gas/diesel)
                        width:this.state.switchOn ? '55%' : '50%',
                        borderColor:this.state.switchOn ? 'green' : 'red',
                      }
                    }
                    renderInsideCircle={() => <Text style={{color:this.state.switchOn ? 'green' : 'red',fontWeight:'bold'}}>{this.state.switchOn ? 'Diesel' : 'Gas'}</Text>}
                    />
                </View>

                <View style={styles.optionsGroup}>

                  {/* Switch toggle for distance/price sorting in list view*/}
                  <View style={styles.listViewSortingToggleWrapper}>
                    <Switch
                      value={this.state.sortByPrice}
                      onValueChange={v => this.setState({sortByPrice:v})}
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
                      innerCircleStyle={
                        {
                          ...this.toggleBtn.mapViewToggleInnerCircle,

                          //Adjust properties depending on current viewing station (gas/diesel)
                          width:this.state.sortByPrice ? '55%' : '68%',
                          borderColor:this.state.sortByPrice ? 'red' : 'blue',
                        }
                      }
                      renderInsideCircle={() => <Text style={{color:this.state.sortByPrice ? 'red' : 'blue',fontWeight:'bold'}}>{this.state.sortByPrice ? 'Price' : 'Distance'}</Text>}
                    />
                  </View>

                  {/* Result Filter button*/}
                  <View style={styles.filterWrapper}>
                    <TouchableOpacity>
                      <FontAwesome name="filter" size={28}/>
                    </TouchableOpacity>
                  </View>

                  {/* Help button*/}
                  <View style={styles.helpWrapper}>
                    <TouchableOpacity>
                      <FontAwesome name="question-circle" size={28}/>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>

            {/*
              //-> Floating Hamburger menu wrapper (absolutely positioned).
              //-> Don't nest it inside footer view, it wont be clickable.
              //-> (last element gets higher z-index)
            */}
            <View style={styles.floatingHamburgerWrapper}>
              <TouchableOpacity onPress={e => alert('Hey')} style={styles.floatingHamburger}>
                <FontAwesome name="bars" size={30} style={{elevation:10}}/>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="white"/>
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  appWrapper:{
    flexDirection:'column',
    flex:1,
    height:'100%'
  },
  header:{
    flexDirection:'column',
    alignContent:'flex-end',
    alignItems:'stretch',
    justifyContent:'flex-start',
    flex:1,
    // borderWidth:3,
    // borderColor:'green'
  },
  topHeaderNav:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    paddingLeft:5,
    paddingRight:5,
    paddingTop:0,
    paddingBottom:0
    // borderWidth:1
  },
  arrowIcon:{
    flex:1,
    paddingTop:5,
    justifyContent:'center',
    alignItems:'center',
    alignContent:'stretch',
  },
  logoWrapper:{
    flex:7,
    alignItems:'center',
    alignContent:'center',
    justifyContent:'space-around',
    // borderWidth:1
  },
  logoImage:{
    width:'100%',
    height:'100%',
    // marginTop:3
  },
  viewStatus:{
    flex:0.4,
    // borderWidth:1,
    borderColor:'red',
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'stretch'
  },
  viewStatusText:{
    flex:1,
    borderWidth:2,
    textAlign:'center',
    textAlignVertical:'center'
  },
  mapWrapper:{
    // width:Dimensions.get('window').width,
    // height:Dimensions.get('window').height - 20,
    flex:6.5,
  },
  map:{
    flex:1,
    // height:Dimensions.get('window').height - 20,
  },
  footer:{
    flex:0.5,
    flexDirection:'column',
    backgroundColor:'white',
    borderWidth:1,
    width:'100%',
    borderWidth:1,
    zIndex:0,
    paddingHorizontal:'1%',
    paddingBottom:0
  },
  floatingHamburgerWrapper:{
    zIndex:9999,
    position:'absolute',
    bottom:'10%',
    right:'5%',
    backgroundColor:'#fff',
    elevation:10
  },
  floatingHamburger:{
    position:'relative',
    padding:10,
    shadowOffset:{x:30,y:30},
    backgroundColor:'white',
  },
  bottomNav:{
    flex:1,
    flexDirection:'row'
  },
  stationMapToggleWrapper:{
    flex:1.1,
    // borderWidth:1,
    alignItems:'center',
    justifyContent:'center'
  },
  optionsGroup:{
    flex:2,
    // borderWidth:1,
    flexDirection:'row',
    alignItems:'center'
  },
  listViewSortingToggleWrapper:{
    flex:3.2,
    alignItems:'center',
  },
  filterWrapper:{
    flex:1,
    alignItems:'center',
  },
  helpWrapper:{
    flex:1,
    alignItems:'center',
  },
});

//flex for horiz axis
//justify = center horiz/vert
//alignitems = cross
export default App
