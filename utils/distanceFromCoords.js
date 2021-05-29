const distanceInMeter = (lat1, lat2, lon1, lon2) => {

    // JavaScript program to calculate Distance Between
    // Two Points on Earth
 
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371000;//radius in meters

    //unit
    var unit = ' m';

    // calculate the result
    const staticDist = (c * r);

    var dist = (c * r);

    if(dist >= 1000 && dist < 1609.344){
        unit = ' km';
        dist /= 1000
    }

    if(dist >= 1609.344){
        dist /= 1609.344
        unit = ' mile'+ (dist > 1 ? 's' : '')
    }

    return dist.toFixed() + unit

    // Driver code   

    // let lat1 = 53.32055555555556;
    // let lat2 = 53.31861111111111;
    // let lon1 = -1.7297222222222221;
    // let lon2 = -1.6997222222222223;
    // document.write(distance(lat1, lat2,lon1, lon2) + " K.M");

}

export default distanceInMeter