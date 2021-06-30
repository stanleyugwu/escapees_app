import React, { useEffect, useState } from "react";
import { Switch } from "react-native-switch";
import { Text, Badge } from "native-base";

//preferences adapters
import { retrieveData } from "../utils/localDataAdapters";

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

const StationSwitch = (props) => {
  //fuel type display preference (0 = gasoline, 1 = diesel, 2 = gasAndDiesel)
  const [displayPreference, setDisplayPreference] = useState(2);

  //props destructure
  const {
    viewingStations,
    setViewingStations,
    fuelTypePreference,
    screenFocused,
  } = props;
  fuelTypePreference != undefined &&
    displayPreference != fuelTypePreference &&
    setDisplayPreference(fuelTypePreference);

  const loadPreference = async () => {
    let storeKey = "eskp_pv_preferences";
    let preference = await retrieveData(storeKey, false);
    if (preference) {
      let { fuelType } = preference;
      screenFocused &&
        setDisplayPreference(
          fuelType == "gasoline" ? 0 : fuelType == "diesel" ? 1 : 2
        );
    }
  };

  useEffect(() => {
    fuelTypePreference == undefined && loadPreference();
  }, []);

  //Disable the Animation warning to set native driver
  //Switch dependency didn't set it
  LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

  return displayPreference == 0 ? (
    <Badge danger style={{ marginLeft: 10 }}>
      <Text style={{ fontWeight: "700" }}>Gas</Text>
    </Badge>
  ) : displayPreference == 1 ? (
    <Badge success style={{ marginLeft: 10 }}>
      <Text style={{ fontWeight: "700" }}>Diesel</Text>
    </Badge>
  ) : (
    <Switch
      value={viewingStations == 1 ? true /*disel*/ : false /*gas*/}
      onValueChange={(bool) =>
        setViewingStations(!bool ? 2 /*gas*/ : 1 /*diesel*/)
      }
      activeText="Gas"
      inActiveText="Diesel"
      backgroundActive="#ccc"
      backgroundInactive="#ccc"
      circleActiveColor="#fff"
      circleInActiveColor="#fff"
      circleBorderWidth={1}
      barHeight={22}
      switchWidthMultiplier={3}
      changeValueImmediately={true}
      innerCircleStyle={{
        width: "auto",
        minWidth: "50%",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        borderColor: viewingStations == 1 ? "#090" : "red",
      }}
      renderInsideCircle={() => (
        <Text
          style={{
            color: viewingStations == 1 ? "#090" : "red",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          {viewingStations == 1 ? "Diesel" : "Gas"}
        </Text>
      )}
    />
  );
};

export default StationSwitch;
