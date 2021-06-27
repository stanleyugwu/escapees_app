import React, {useState} from 'react';
import {View} from 'native-base';
import { StyleSheet } from 'react-native';

const RadioButton = (props) => {
    //radio button check state
    const {checked = false, customWrapperStyle, customInnerCircleStyle} = props;

    return (
        <View
            style={[
                styles.radio,
                customWrapperStyle
            ]}
        >
            {
                checked ? (<View style={[styles.innerCircle, customInnerCircleStyle]}/>) : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    radio:{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle:{
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#3597e2',
    }
});

export default RadioButton