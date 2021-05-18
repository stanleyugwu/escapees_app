import React from "react";
import { View, Text } from "react-native";
import {MaterialIcons} from '@expo/vector-icons';

const FetchError = () => (
  <View
    style={{
      flex: 7,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <MaterialIcons name="cloud-off" size={40} color="red" />
    <Text>Loading Failed...</Text>
    <Text>Make sure you're connected to internet, and try again</Text>
  </View>
);

export default FetchError;
