import allStationLocations from '../dummy-api-data-models/all-station-locations.json';
import Constants from 'expo-constants';

const stationsDataEndpoint = Constants.manifest.extra.stations_data_endpoint;

const getAllStationLocations = async (token, token_type) => {

    if(token_type == 'refresh'){
        //we need to get access_token with refresh_token before data fetch
        
    }
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