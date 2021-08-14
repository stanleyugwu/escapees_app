import React, {useEffect, useState} from 'react';
import {View, Text} from 'native-base';

//main views (map and list)
import MapView from './MapView';
import ListView from './StationsListView';
import store, { signOutUser } from '../../redux/store';

const MainViewsWrapper = (props) => {

    //props destructure
    var {stationsDisplayType/*1 = map or 2 = list view */,stationLocationsData} = props;
    let siv = store.getState().stationsInView;
    // console.log(stationLocationsData.filter(s => s.fuelTypeId == 0))

    //1 = diesel or 2 = gas
    const [stationsInView, setStationsInView] = useState(siv);

    useEffect(() => {
        //sign out user if no stations data
        if(!(stationLocationsData instanceof Array && stationLocationsData.length)){
            store.dispatch(signOutUser());
        }
        return store.subscribe(() => {
            setStationsInView(store.getState().stationsInView);
        })
    }, []);


    //filter out relevant stations data based on currently viewed station type (diesel/gas)
    let filteredStationsData = stationsInView == 1/* diesel */ ? (
        stationLocationsData.filter(station => station.fuelTypeId == 0/* diesel */)
    ) : (
        stationLocationsData.filter(station => station.fuelTypeId == 1/* gas */)
    );

    return (
        <View>
            <View style={{
                display:stationsDisplayType == 1 ? 'flex' : 'none',//hide child (Map) on list view
            }}>
                <MapView
                    stationLocationsData={filteredStationsData}
                />
            </View>
        

            <View style={{
                display:stationsDisplayType == 2 ? 'flex' : 'none',//hide child (List) on map view
            }}>
                <ListView
                    stationLocationsData={filteredStationsData}
                />
            </View>
        </View>
    )
}

export default MainViewsWrapper