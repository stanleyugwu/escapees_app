import React from "react";
import { View, Text, Icon } from "native-base";
import {TouchableOpacity, StyleSheet} from 'react-native';

const FetchError = (props) => (
  <View style={{...styles.Center,height:'100%',padding:20}}>
      <Icon name="cloud" type="FontAwesome5" style={{fontSize:35,}}/>
      <Text style={{color:'red',fontSize:17,fontWeight:'bold'}}>Error Loading Data..</Text>
      <Text style={{textAlign:'center',fontSize:17}}>Make sure you're connected to the internet and try again.</Text>

      <TouchableOpacity 
          transparent bordered 
          style={{...styles.Center,...styles.RetryButton}}
          onPress={props.fetchData}
      >
          <Icon name="refresh" style={{color:'#090'}}/>
          <Text style={{color:'#090',fontWeight:'bold'}}>Try Again</Text>
      </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  Center:{
    alignItems:'center',
    justifyContent:'center'
  },
  RetryButton:{
    marginTop:20,
    flexDirection:'row',
    padding:5,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:'#090'
},
})


export default FetchError;
