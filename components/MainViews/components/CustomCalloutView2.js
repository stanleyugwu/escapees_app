import React from 'react';
import {TouchableOpacity, Alert, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {View, Text,} from 'native-base';
import {Grid, Row, Col} from 'react-native-easy-grid';

const CustomCalloutView = (props) => {
    //shorthand
    const s = props.stationData || {};

    //shorthand for viewType i.e where the callout is used (Map = 1, Second-Screen = 2)
    const viewType = props.viewType;

    //seperate cents change (to be superscripted) from whole retail price
    let regularPrice = s.regularPrice.toString();
    let regularPriceWhole = regularPrice;
    let regularPriceChange = '';

    //if regularPrice has cents change seperate it
    if(regularPrice.includes('.') && regularPrice.length > 4){
        regularPriceWhole = regularPrice.substring(0,regularPrice.length-1);
        regularPriceChange = regularPrice[regularPrice.length-1];
    }

    //seperate cents change (to be superscripted) from whole member price
    let memberPrice = s.memberPrice.toString();
    let memberPriceWhole = memberPrice;
    let memberPriceChange = '';

    //if memberPrice has cents change seperate it
    if(memberPrice.includes('.') && memberPrice.length > 4){
        memberPriceWhole = memberPrice.substring(0,memberPrice.length-1);
        memberPriceChange = memberPrice[memberPrice.length-1];
    }

    //Member Savings from price
    let saving = (+s.regularPrice - +s.memberPrice).toPrecision(3);
    let savingDollarWhole = saving;
    let savingChange = '';

    // if saving has cents change seperate it
    if(saving.includes('.') && saving.length > 4){
        savingDollarWhole = saving.substring(0,saving.length-1);
        savingChange = +saving[saving.length-1] || ''; //remove trailing zero from cent change if any
    }

    return (
        <View style={{width:'100%'}}>
            <View style={{
                backgroundColor:'white',
                borderWidth:1,
                width:'100%',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-around',
                display:'flex',
                padding:6
            }}>
                <Text style={{width:'100%'}}>Calling from somewhere</Text>
            </View>
            <Arrow/>
        </View>
    )
}

const Arrow = styled.View`
    width:0;
    height:0;
    z-index:999;
    display:flex;
    align-items:center;
    justify-content:center;
    align-self:center;
    border-left-width:7px;
    border-right-width:7px;
    border-top-width:12px;
    border-style:solid;
    background-color:transparent;
    border-left-color:transparent;
    border-right-color:transparent;
    border-top-color:#888;
`;

export default CustomCalloutView;