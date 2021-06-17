import React, {useState} from 'react';
import {View} from 'native-base';

//main views (map and list)
import MapView from './MapView';
import ListView from './StationsListView';

const MainViewsWrapper = (props) => {

    //props destructure
    const {stationsInView,setStationsDisplayView,stationsDisplayView, userPosition, setUserPosition,sortingParameter} = props;

    return (
        <View>
            <View style={{
                display:stationsDisplayView == 1 ? 'flex' : 'none',//hide child (Map) on list view
            }}>
                <MapView
                    stationLocationsData={stationsInView}
                    setStationsDisplayView={setStationsDisplayView}
                    setUserPosition={setUserPosition}
                    userPosition={userPosition}
                />
            </View>
        

            <View style={{
                display:stationsDisplayView == 2 ? 'flex' : 'none',//hide child (List) on map view
            }}>
                <ListView
                    stationLocationsData={stationsInView}
                    userPosition={userPosition}
                    sortingParameter={sortingParameter}
                />
            </View>
        </View>
    )
}

export default MainViewsWrapper