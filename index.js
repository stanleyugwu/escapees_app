import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { registerRootComponent } from "expo";

//navigation packages
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PreferenceScreen from "./screens/PreferenceScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import LandingScreen from "./screens/LandingScreen";

//Load Fonts/Icons
import * as Font from "expo-font";
import Roboto from "native-base/Fonts/Roboto.ttf";
import Roboto_medium from "native-base/Fonts/Roboto_medium.ttf";
import { Ionicons } from "@expo/vector-icons";

//util
import { retrieveData } from "./utils/localDataAdapters";
// import AsyncStorage from "@react-native-async-storage/async-storage";

//redux store
import store, {signInUser, updatePreferences, updateStationsData, updateUserLoginDetails, updateUserStatus} from "./redux/store";

//create navigaton root
const Stack = createStackNavigator();

//function to authenticate user
const authenticateUser = async () => {
  //store key
  var storeKey = "eskp_pv_data";

  //get persisted data
  var data = await retrieveData(storeKey, true);
  // return {isSignedIn:false}

  if (!data) {
    return {isSignedIn:false}
  } else if (
    data &&
    typeof data == "object" &&
    "stationsData" in data &&
    data["stationsData"] &&
    "login" in data
  ) {
    return {
      isSignedIn:true,
      login:data['login'],
      stationsData:data['stationsData']
    }
  } else {
    return {isSignedIn:false}
  }
};

const App = () => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    const setUp = async () => {
      // AsyncStorage.multiRemove([
      //   "eskp_pv_data",
      //   "eskp_pv_preferences",
      //   "eskp_pv_transactions",
      // ]).then(console.log);
      // return
      //Load Fonts
      await Font.loadAsync({
        Roboto,
        Roboto_medium,
        ...Ionicons.font,
      });

      let user = await authenticateUser();
      setUserSignedIn(user.isSignedIn);
      setIsLoading(false);
      
      if(user.isSignedIn){
        store.dispatch(updateUserStatus('member'));//update status
        store.dispatch(updateStationsData(user.stationsData || null));//load stations data
        store.dispatch(updateUserLoginDetails(user.login));//store login creds
        store.dispatch(signInUser());//sign in user
        let preferences = await retrieveData('eskp_pv_preferences',false);
        if(preferences){
          store.dispatch(updatePreferences(preferences));//load preferences
        }
      }
    }
    setUp();

    return store.subscribe(() => {setUserSignedIn(store.getState().userAuthenticated)});

  },[])

  return isLoading ? (
    <SplashScreen/>
  ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false,}}>
      {
        userSignedIn == true ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Preferences" component={PreferenceScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
          </>
        ) 
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


registerRootComponent(App);
