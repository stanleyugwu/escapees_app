import Constants from 'expo-constants';

const stationsDataEndpoint = Constants.manifest.extra.stations_data_endpoint;

const getAllStationLocations = (token) => {

    var requestOptions = {
    method: 'GET',
    headers: {
        "Authorization": `Bearer ${token}`
    },
    redirect: 'follow'
    };

    return fetch(stationsDataEndpoint, requestOptions)
 
}

export default getAllStationLocations