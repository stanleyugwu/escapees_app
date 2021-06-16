import React,{useEffect} from 'react';
import {View, Text} from 'native-base';
import {FlatList} from 'react-native';
//logbox
import { LogBox } from 'react-native';
//station display
import StationPane from './components/StationPane';
//distance calculator helper
import distanceFromCoords from '../../utils/distanceFromCoords';


//price sorting function
const priceSorter = (stationA, stationB) => {
    return stationA.memberPrice < stationB.memberPrice ? -1 : 1
}

//distance sorting function
const distanceSorter = (stationA, stationB) => {
    //this function performs just inverse price sorting for now
    return stationA.memberPrice < stationB.memberPrice ? 1 : -1
}

const ListView = (props) => {
    //silence Flatlist warning for nested scrollviews
    useEffect(()=>{
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    },[]);

    //data destructure
    const {stationLocationsData, userPosition, sortingParameter} = props;

    //sort stations data by sorting paramter and calculate stations miles from userPosition
    let stationsData = stationLocationsData.sort(sortingParameter == 1 ? priceSorter : distanceSorter);

    //loop through stations data and add distanceFromUser prop to each station
    stationsData = stationsData.map((station,idx,arr) => {
        if(!userPosition || !('latitude' in userPosition)){
            station.distanceFromUser = false;
            return station
        }

        try {

            //LatLng shorthands
            let {latitude:ulat, longitude:ulon} = userPosition,
            {latitude:slat, longitude:slon} = station
            station.distanceFromUser = distanceFromCoords(ulat,slat,ulon,slon);

        } catch (error) {
            station.distanceFromUser = false
        }

        return station
    })
    
    

    //renderer for each station in list format
    const renderer = ({item}) => {
        return (
            <StationPane stationData={item}/>
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
                data={stationsData} 
                renderItem={renderer} 
                keyExtractor={(items, index) => index.toString()}
                ListEmptyComponent={emptyComponentRenderer}
            />
        </View>
    )
}


export default ListView