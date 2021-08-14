import Constants from 'expo-constants';
import timeoutRejector from '../utils/timeoutRejector';

const stationsDataEndpoint = Constants.manifest.extra.stations_data_endpoint;

const getAllStationLocations = (token) => {

    var requestOptions = {
    method: 'GET',
    headers: {
        "Authorization": `Bearer ${token}`
    },
    redirect: 'follow'
    };

    var errorObj = {
        error:true,
        message:'An error occured on our side, please try again.'
    }

    try {
        let response = await Promise.race([fetch(stationsDataEndpoint, requestOptions), timeoutRejector(10000)])
        
        if(response.ok){
            let stationsData = await response.json();
            if(stationsData && stationsData instanceof Array){
                return {error:false,data:stationsData}
            }
            throw Error('Invalid Response!')
        }
        throw Error('Server Error')

    } catch (e) {
        //handle request timeout error
        if(e == '__REQUEST_TIMEOUT__'){
            errorObj.message = 'Low internet speed, please try again';
            return errorObj
        }
        //handle no network/internet error
        if(e.message.indexOf('Network request failed') > -1){
            errorObj.message = `You're not connected to internet`;
            return errorObj
        }
        return errorObj
    }
 
}

export default getAllStationLocations