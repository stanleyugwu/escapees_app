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

//splash delay
import AppLoading from "expo-app-loading";
//redux store
import store, {signInUser} from "./redux/store";
import { View, Text,  } from "native-base";

//create navigaton root
const Stack = createStackNavigator();

//function to authenticate user
const authenticateUser = async () => {
  //store key
  var storeKey = "eskp_pv_data";

  //get persisted data
  var data = await retrieveData(storeKey, true);
  return false

  if (!data) {
    return false
  } else if (
    data &&
    typeof data == "object" &&
    "stationsData" in data &&
    data["stationsData"] &&
    "login" in data
  ) {
    return true
  } else {
    return false
  }
};

const App = () => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    const setUp = async () => {
      //Load Fonts
      await Font.loadAsync({
        Roboto,
        Roboto_medium,
        ...Ionicons.font,
      });

      let signedIn = await authenticateUser();
      setUserSignedIn(signedIn);
      setIsLoading(false);
    }
    setUp();

    return store.subscribe(() => {setUserSignedIn(store.getState().userAuthenticated)});

  },[])

  return isLoading ? (
    <AppLoading/>
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
