import allStationLocations from '../dummy-api-data-models/all-station-locations.json';
import Constants from 'expo-constants';

const stationsDataEndpoint = Constants.manifest.extra.stations_data_endpoint;

const getAllStationLocations = async (token) => {
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    return fetch(stationsDataEndpoint, requestOptions)
 
}

export default getAllStationLocations