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
import {Grid, Col, Row} from 'react-native-easy-grid';
import { Dimensions, ImageBackground, StyleSheet } from "react-native";

import * as SecureStore from 'expo-secure-store';//credentials store package
import logo from "../assets/images/logo.png";//app logo
import bg from "../assets/images/splash-bg4.jpg";//background image
import {decrypt} from '../utils/cryptor';//cryptography helper function

const SplashScreen = ({ navigation }) => {

  //timeout ref
  let timeout = null;

  //login creds exists in system
  let exists = true;

  //if user credentials exists, redirect to Home, else redirect to Login
  let nextScreen = exists ? 'Home' : 'Login';

  //function to extract creds from store
  const extractData = async () => {
    let storeName = 'eskp_pv_data';
    let dataHash = await SecureStore.getItemAsync(storeName);
    if(!dataHash || dataHash.length < 2) return false
    let dataObject = JSON.parse(decrypt(dataHash));
    return dataObject
  }

  //function to authenticate user
  const authenticateUser = () => {
    let dataObject = extractData();
    // if(!dataObject) return navigation.navigate('Login')
  }

  //auto navigate to login screen after 2 seconds of mount
  useEffect(()=>{
    authenticateUser();
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
