import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default (props) => {
    const [pressed, setPressed] = useState(false);
  return (
    //Error View to show On denied location permission
    <View style={styles.errorWrapper}>
      <Text style={styles.errorMsg}>
        Sorry!, You must grant location permissions to use this app.
      </Text>
      {/* Retry Button to reshow permission dialog */}
      <TouchableOpacity
        onPress={e => props.turnOnLocation()}
        style={styles.turnLocationBtn}
      >
        <Text style={styles.turnOnLocationText}>Turn On Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorWrapper: { flex: 7, justifyContent: "center", alignItems: "center" },
  turnLocationBtn: {
    borderWidth: 1,
    borderColor: "green",
    marginTop: 20,
    padding: 15,
  },
  turnOnLocationText: {
    fontWeight: "bold",
    color: "green",
  },
  errorMsg: {
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
