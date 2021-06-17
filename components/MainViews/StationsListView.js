import React,{useEffect} from 'react';
import {View, Text, Icon} from 'native-base';
import {FlatList, LogBox} from 'react-native';
//station display
import StationPane from './components/StationPane';
//distance calculator helper
import distanceFromCoords from '../../utils/distanceFromCoords';


//price sorting function
const _priceSorter = (stationA, stationB) => {
    return stationA.memberPrice < stationB.memberPrice ? -1 : 1;//low to high sorting
}

//distance sorting function
const _distanceSorter = (stationA, stationB) => {

    //extract distance number from stations distanceFromUser prop value for sorting 
    let stationADistance = +stationA.distanceFromUser.substring(0,stationA.distanceFromUser.indexOf(' ')),
    stationBDistance = +stationB.distanceFromUser.substring(0,stationB.distanceFromUser.indexOf(' '));

    return stationADistance < stationBDistance ? -1 : 1;//low to high sort
}

//renderer for empty list
const emptyComponentRenderer = () => (
    <View>
        <Text style={{color:'white'}}>No Data to show here, please restart the App.</Text>
    </View>
);

//renderer for each station in list format
const stationRenderer = ({item}) => {
    return (
        <StationPane stationData={item}/>
    )
};

//list header component
const listHeaderRenderer = (sortingParameter) => (
    <Text style={{fontSize:12,color:'#ddd',fontWeight:'700',lineHeight:17}}>
        Sorted by: { sortingParameter == 1 ? 'Your Price' : 'Distance'} (ascending) 
    </Text>
);

const ListView = (props) => {
    //silence Flatlist warning for nested scrollviews
    useEffect(()=>{
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    },[]);
    
    //data destructure
    const {stationLocationsData, userPosition, sortingParameter} = props;
    
    //loop through stations data and add distanceFromUser prop to each station
    let stationsData = stationLocationsData.map((station) => {
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
    });
    
    //sort stations data by sorting paramter and calculate stations miles from userPosition
    stationsData = stationsData.sort(sortingParameter == 1 ? _priceSorter : _distanceSorter);

    return (
        <View style={{backgroundColor:'#3597e2',paddingTop:10,padding:5,}}>
            <FlatList 
                data={stationsData} 
                renderItem={stationRenderer} 
                ListHeaderComponent={() => listHeaderRenderer(sortingParameter)}
                keyExtractor={(items, index) => index.toString()}
                ListEmptyComponent={emptyComponentRenderer}
            />
        </View>
    )
}


export default ListView