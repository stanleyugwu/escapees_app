import React,{useEffect} from 'react';
import {View, Col, Grid, Row, Text} from 'native-base';
import {FlatList} from 'react-native';
//logbox
import { LogBox } from 'react-native';
//station display
import StationPane from './components/StationPane';

const ListView = (props) => {
    //silence Flatlist warning for nested scrollviews
    useEffect(()=>{
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    },[]);

    //stations data
    const stationLocationsData = props.stationLocationsData;

    //passed down user position
    const userPosition = props.userPosition;

    //renderer for each station in list format
    const renderer = ({item}) => {
        return (
            <StationPane stationData={item} userPosition={userPosition} />
        )
    };

    //renderer for empty list
    const emptyComponentRenderer = () => (
        <View>
            <Text style={{color:'white'}}>No Data to show here, please restart the App.</Text>
        </View>
    );

    return (
        <View style={{backgroundColor:'#3597e2',paddingTop:10,padding:5,}}>
            <FlatList 
                data={stationLocationsData} 
                renderItem={renderer} 
                keyExtractor={(items, index) => index.toString()}
                ListEmptyComponent={emptyComponentRenderer}
            />
        </View>
    )
}


export default ListView