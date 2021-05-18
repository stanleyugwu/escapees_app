import gasStationsData from '../api-data-models/gas-stations-data.json';

const getGasStations = () => {
    return new Promise((res,rej) => {
        setTimeout(()=>{
            res(gasStationsData);
        }, 1000)
    })
}

export default getGasStations