import React, {useEffect} from "react";
import {
  Root,
  Container,
  Text,
  Thumbnail,
  Content,
  Spinner,
  View,
  Title
} from "native-base";
import {Grid, Row} from 'react-native-easy-grid';
import { Dimensions, ImageBackground, StyleSheet,} from "react-native";

//images
import logo from "../assets/images/logo.png";//app logo
// import bg from "../assets/images/splash-bg4.jpg";//background image

import {retrieveData} from '../utils/localDataAdapters';
import AsyncStorage from "@react-native-async-storage/async-storage";


//store key
var storeKey = 'eskp_pv_data';

const SplashScreen = ({ navigation }) => {

  //function to authenticate user
  const authenticateUser = async () => {
    //get persisted data
    var data = await retrieveData(storeKey,true);
    
    if(!data){
      return navigation.navigate('Login')
    }else if(
      data && typeof data == 'object' &&
      'stationsData' in data && 
      data['stationsData'] &&
      'login' in data
    ){
      return navigation.navigate('Home',{dataAvailable:true})
    }else {
      return navigation.navigate('Login')
    }

  }

  //auto navigate to login screen after 1 second of mount
  useEffect(()=>{
    setTimeout(authenticateUser, 1000);
  },[]);

  return (
    <Root>
      <Container>
        <Content contentContainerStyle={styles.Content} padder>
          <ImageBackground
            source={null}
            resizeMode="repeat"
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              flex: 1,
            }}
          >
            <Grid>
              <Row size={9} style={styles.Center}>
                <Thumbnail
                  large
                  square
                  source={logo}
                  resizeMode="contain"
                  style={{ width: "90%", height: "100%" }}
                />
              </Row>
              <Row size={3} style={styles.Center}>
                <View>
                    <View>
                        <Spinner color="#090" size={50} />
                    </View>
                    <View>
                        <Title style={{fontWeight:'bold',color:'#000'}}>Loading</Title>
                    </View>
                </View>
              </Row>
              <Row size={1} style={styles.Center}>
                <Text style={{ color: "#090", fontWeight: "bold" }}>
                    Escapees Fuel Program App
                </Text>
              </Row>
            </Grid>
          </ImageBackground>
        </Content>
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  Content: {
    alignItems: "center",
    justifyContent: "center",
    height:'100%',
  },
  Grid: { alignItems: "center", justifyContent: "center", height: "100%" },
  Row: {
    alignItems: "center",
    justifyContent: "center",
  },
  Center:{
      alignItems:'center',
      justifyContent:'center'
  }
});

export default SplashScreen;
