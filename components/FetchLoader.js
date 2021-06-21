import React from "react";
import { View, Text, Spinner } from "native-base";
import {StyleSheet} from 'react-native';

const FetchLoader = (props) => (
  <View style={{...styles.Center,height:'100%',}}>
    <Spinner size={50} color="#090"/>
    <Text style={{fontSize:17,fontWeight:'bold',color:'#555'}}>
      {
        props.loadingText || 'Loading Stations Data...'
      }
    </Text>
  </View>
);

const styles = StyleSheet.create({
  Center:{
    alignItems:'center',
    justifyContent:'center'
  }
})


export default FetchLoader;
