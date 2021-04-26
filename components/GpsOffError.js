import React from 'react';
import {View, Text, TouchableOpacity, Linking, StyleSheet, Platform} from 'react-native';


const GPSError = () => {

    const redirectToSetting = () => {
        Platform.OS == 'ios' ?
        Linking.openURL('app-settings:') :
        Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    }

    return (
        <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>Turn on your location to continue</Text>
            <TouchableOpacity onPress={redirectToSetting} style={styles.openBtn}>
                <Text style={styles.openBtnText}>Turn On Location</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    errorWrapper:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        fontSize:20
    },
    openBtn:{
        marginTop:15,
        borderWidth:1,
        borderColor:'green',
        padding:5
    },
    errorText:{
        fontWeight:'bold',
    },
    openBtnText:{
        color:'green'
    }
})

export default GPSError