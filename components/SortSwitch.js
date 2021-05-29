import React from 'react';
import { Switch } from 'react-native-switch';
import {Text} from 'native-base';

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

const SortSwitch = (props) => {

    //Disable the Animation warning to set native driver
    //Switch dependency didn't set it
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

    //props sorting paramter destructure /-> 1 = Distance, 2 = Price <-/
    const { setSortingParameter, sortingParameter } = props;

    return (
        <Switch
            value={
                sortingParameter == 1 ? false : true
            }
            onValueChange={v => {
                setSortingParameter(sortingParameter == 1 ? 2 : 1);   
            }}
            activeText="Distance"
            inActiveText="Price"
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
                borderColor:sortingParameter == 1 ? "blue" : "red",
            }}
            renderInsideCircle={() => (
                <Text
                    style={{
                        color:sortingParameter == 1 ? "blue" : "red",
                        fontWeight: "bold",
                        fontSize:13,
                    }}
                >
                    {sortingParameter == 1 ? "Distance" : "Price"}
                </Text>
            )}
        />
    )
}

export default SortSwitch