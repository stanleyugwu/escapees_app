import dieselStationsData from '../api-data-models/diesel-stations-data.json';

const getDieselStations = () => {
    return new Promise((res,rej) => {
        setTimeout(()=>{
            res(dieselStationsData);
        }, 1000)
    })
}

export default getDieselStations