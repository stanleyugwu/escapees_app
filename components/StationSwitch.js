import React, { useEffect, useState } from "react";
import { Switch } from "react-native-switch";
import { Text, Badge } from "native-base";

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

import store, {updateStationsInView} from "../redux/store";

const StationSwitch = () => {

  let {fuelTypePreference:ftp = 3,stationsInView:siv = 1} = store.getState();

  //fuel type display preference (1 = diesel, 2 = gasoline, 3 = gasAndDiesel)
  const [fuelTypePreference, setFuelTypePreference] = useState(ftp);
  
  //state for gasAndDiesel toggle btw gas/diesel stations
  const [stationsInView, setStationsInView] = useState(siv);

  useEffect(() => {
    let stationsInViewUnsub = store.subscribe(() => {setStationsInView(store.getState().stationsInView)})
    let fuelTypePreferenceUnsub = store.subscribe(() => {setFuelTypePreference(store.getState().fuelTypePreference)})
    return () => {
      stationsInViewUnsub();
      fuelTypePreferenceUnsub();
    }
  }, []);

  //Disable the Animation warning to set native driver
  //Switch dependency didn't set it
  LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

  return fuelTypePreference == 1 ? (
    <Badge success style={{ marginLeft: 10 }}>
      <Text style={{ fontWeight: "700" }}>Diesel</Text>
    </Badge>
  ) : fuelTypePreference == 2 ? (
    <Badge danger style={{ marginLeft: 10 }}>
      <Text style={{ fontWeight: "700" }}>Gasoline</Text>
    </Badge>
  ) : (
    <Switch
      value={stationsInView == 1 ? true /*disel*/ : false /*gas*/}
      onValueChange={(bool) =>{
        store.dispatch(updateStationsInView(!bool ? 2 /*gas*/ : 1 /*diesel*/))
      }}
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
        borderColor: stationsInView == 1 ? "#090" : "red",
      }}
      renderInsideCircle={() => (
        <Text
          style={{
            color: stationsInView == 1 ? "#090" : "red",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          {stationsInView == 1 ? "Diesel" : "Gas"}
        </Text>
      )}
    />
  );
};

export default StationSwitch;
