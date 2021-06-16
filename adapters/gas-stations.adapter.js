import gasStationsData from '../dummy-api-data-models/all-station-locations.json';

const getGasStations = () => {
    return new Promise((res,rej) => {
        setTimeout(()=>{
            res(gasStationsData);
        }, 2000)
    })
}

export default getGasStations