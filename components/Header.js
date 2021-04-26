import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Image} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

//App logo
import Logo from '../assets/images/logo.png';

const Header = function(props){

    const [logoImageFailed, setLogoImageFailed] = useState(false);

    return (
        <View style={styles.header}>
            {/* Top (arrow/logo) container */}
            <View style={styles.topHeaderNav}>

            {/* Nav Arrow Icon */}
            <View style={styles.arrowIcon}>
                <TouchableOpacity>
                <FontAwesome name="angle-left" size={40} />
                </TouchableOpacity>
            </View>

            {/* Logo */}
            <View style={styles.logoWrapper}>
                <Image
                source={Logo}
                resizeMode="contain"
                onError={e => setLogoImageFailed(true)}
                onLoad={e => setLogoImageFailed(false)}
                style={styles.logoImage}
                />
                {
                //Show Text as logo when image fails to load
                logoImageFailed ? <Text>EscapeesRvClub</Text> : null
                }
            </View>
            </View>

            {/* Current Viewing Status */}
            <View style={
            {
                ...styles.viewStatus,
                backgroundColor:props.currentViewingStations == 1 ? 'green' : 'red'
            }
            }>
            <Text style={styles.viewStatusText}>
                Currently Viewing {props.currentViewingStations == 1 ? 'Diesel Fuel Prices' : 'Gas Prices'}
            </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        flexDirection:'column',
        alignContent:'flex-end',
        alignItems:'stretch',
        justifyContent:'flex-start',
        flex:1,
        maxHeight:80,
        // borderWidth:3,
        // borderColor:'green'
    },
    topHeaderNav:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        paddingLeft:5,
        paddingRight:5,
        paddingTop:0,
        paddingBottom:0
        // borderWidth:1
    },
    arrowIcon:{
        flex:1,
        paddingTop:5,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'stretch',
    },
    logoWrapper:{
        flex:7,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'space-around',
        // borderWidth:1
    },
    logoImage:{
        width:'100%',
        height:'100%',
        // marginTop:3
    },
    viewStatus:{
        flex:0.4,
        // borderWidth:1,
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'stretch'
    },
    viewStatusText:{
        flex:1,
        textAlign:'center',
        color:'white',
        textAlignVertical:'center'
    }
})

export default Header