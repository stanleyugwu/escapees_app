import React from 'react';
import { Switch } from 'react-native-switch';
import {Text} from 'native-base';

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

const StationSwitch = (props) => {

    //Switch button inner-circle custom properties
    const switchInnerCircleStyle = {
        alignItems: "center",
        justifyContent: "center",
    };

    //Disable the Animation warning to set native driver
    //Switch dependency didn't set it
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

    //props destructure
    const { viewingStations, setViewingStations } = props;

    return (
        <Switch
            value={
                viewingStations == 1 ? true/*disel*/ : false/*gas*/
            }
            onValueChange={(bool) => setViewingStations(!bool ? 2/*gas*/ : 1 /*diesel*/)}
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
                width:'auto',
                minWidth:'50%',
                alignItems:'center',
                justifyContent:'center',
                padding:3,
                borderColor:viewingStations == 1 ? "#090" : "red",
            }}
            renderInsideCircle={() => (
                <Text
                    style={{
                        color:viewingStations == 1 ? "#090" : "red",
                        fontWeight: "bold",
                        fontSize:15,
                    }}
                >
                    {viewingStations == 1 ? "Diesel" : "Gas"}
                </Text>
            )}
        />
    )
}

export default StationSwitch