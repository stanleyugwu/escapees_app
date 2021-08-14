import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native-switch';
import {Text} from 'native-base';
import store, { updateSortingParameter } from '../../redux/store';

//Just to disable Animation "useNativeDriver" Warning
import { LogBox } from "react-native";

const SortSwitch = (props) => {

    //Disable the Animation warning to set native driver
    //Switch dependency didn't set it
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

    const [sortingParameter, setSortingParameter] = useState(store.getState().sortingParameter || 1);

    useEffect(() => {
        return store.subscribe(() => {setSortingParameter(store.getState().sortingParameter)})
    }, [])
    
    return (
        <Switch
            value={
                sortingParameter == 1 ? false : true
            }
            onValueChange={_ => {
                store.dispatch(updateSortingParameter(sortingParameter == 1 ? 2 : 1));   
            }}
            //disable if userPosition is null, not object
            disabled={!!store.getState().userPosition}
            activeText="Price"
            inActiveText="Distance"
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
                    {sortingParameter == 1 ? "Price" : "Distance"}
                </Text>
            )}
        />
    )
}

export default SortSwitch