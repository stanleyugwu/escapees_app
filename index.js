import 'react-native-gesture-handler';
import React from 'react';
import {registerRootComponent} from 'expo';

//navigation packages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

//Load Fonts/Icons
import * as Font from 'expo-font';
import Roboto from 'native-base/Fonts/Roboto.ttf';
import Roboto_medium from 'native-base/Fonts/Roboto_medium.ttf';
import {Ionicons} from '@expo/vector-icons';

//splash delay
import AppLoading from 'expo-app-loading';


//create navigaton root
const Stack = createStackNavigator();

class App extends React.Component{
    constructor(props){
        super(props);

        //App state
        this.state = {
            //state to delay mounting till fonts are loaded
            fontsLoaded: false
        }
    }

    async componentDidMount(){
        //Load Fonts
        await Font.loadAsync({
            Roboto,
            Roboto_medium,
            ...Ionicons.font,
        });
        this.setState({fontsLoaded:true});//load app
    }

    render(){
        return !this.state.fontsLoaded ?
            <AppLoading/> : (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown:false}}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

registerRootComponent(App)