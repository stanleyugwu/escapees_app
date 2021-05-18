import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const FetchLoader = () => (
    <View
    style={{
      flex: 7,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ActivityIndicator size={40} color="#0a0" />
    <Text>Loading...</Text>
    <Text>Make sure you're connected to internet</Text>
  </View>
);

export default FetchLoader;
