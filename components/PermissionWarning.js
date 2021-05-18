import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Location from 'expo-location';
import { MaterialIcons } from "@expo/vector-icons";

export default (props) => {
  const [shown, setShown] = useState(true);

  //retry location access
  const retry = () => props.retryRequest();

  return (
    <Fragment>
      {shown ? (
        <View style={styles.permissionWarning}>
          {/* retry pane */}
          <View style={styles.retryPane}>
            <TouchableOpacity onPress={retry}>
              <Text
                style={[
                  styles.warningText,
                  { color: "blue", fontWeight: "bold" },
                ]}
              >
                Click Here to enable location access
              </Text>
            </TouchableOpacity>
          </View>
          {/* Close button */}
          <View style={styles.closeBtn}>
            <TouchableOpacity onPress={() => setShown(false)}>
              <MaterialIcons name="close" size={27} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  permissionWarning: {
    position: "absolute",
    top: 1,
    right: 0,
    left: 0,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  warningText: {
    color: "#888",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  retryPane: {
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    padding: 5,
    borderRightColor: "#999",
  },
  closeBtn: {
    width: "15%",
    position: "relative",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
  },
});
