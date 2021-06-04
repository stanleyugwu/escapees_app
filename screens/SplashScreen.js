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

const SplashScreen = ({ navigation }) => {

  //function to authenticate user
  const authenticateUser = async () => {

    //store keys
    let tokenStore = 'eskp_pv_tokens';
    let dataStore = 'eskp_pv_data';

    SecureStore.isAvailableAsync()
    .then(available => {
      if(available) return true
      else throw Error('Api not available')
    })
    .then(available => {
      if(available){
        SecureStore.getItemAsync(tokenStore)
        .then(data => {

          if(!data) throw Error('no token')

          else if(data && JSON.parse(data) instanceof Object && 'refresh_token' in JSON.parse(data)){
            //token exists
            let token = JSON.parse(data).refresh_token;

            //try access stations data
            SecureStore.getItemAsync(dataStore)
            .then(data => {
              if(!data) throw Error('No data')
              else if(data && JSON.parse(data) instanceof Array){
                //token and data exists
                return navigation.navigate('Home',{tokenAndDataExists:true, refresh_token:token});
              }
            })
            .catch(error => {
              //no data, but theres token (still navigate to Home with indication)
              navigation.navigate('Home',{tokenAndDataExists:false, refresh_token:token});
            })
          }
        })
        .catch(e => {
          navigation.navigate('Login',{storeAvailable:true})
        });//no token (navigate to login)
      }
    })
    .catch(e => {
      //secure-store api not available
      navigation.navigate('Login',{storeAvailable:false})
    })

  }

  //auto navigate to login screen after 2 seconds of mount
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
