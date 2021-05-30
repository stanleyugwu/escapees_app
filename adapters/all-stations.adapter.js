import allStationLocations from '../api-data-models/all-station-locations.json';

const getAllStationLocations = () => {
    return new Promise((res,rej) => {
        setTimeout(()=>{
            res(allStationLocations);
        }, 1000)
    })
}

export default getAllStationLocations