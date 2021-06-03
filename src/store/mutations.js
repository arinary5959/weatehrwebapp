export default {
    SET_LOCATION(state, locationData){
        // console.log(locationData);
        // state.lat = locationData.lat;
        // state.lon = locationData.lon;
        state.geoLocation = {'lat':locationData.lat, 'lon':locationData.lon };
        state.city = locationData.city;
        state.countryCode = locationData.countryCode;
        // console.log(state.location);
    },
    SET_WEATHER(state, weatherData){
        // state.weatherData
        // console.log(state)
        // console.log(weatherData.current)
        state.crrInfo = weatherData.current;
        state.dailyInfo = weatherData.daily;
        state.hourlyInfo = weatherData.hourly;
    },
    SET_COORDINATE(state, coordinateData){
        console.log(coordinateData)
        state.coordinateInfo = coordinateData;
    },
    // SET_MAP(state, coordinateData){
    //     console.log(coordinateData)
    //     state.coordinateInfo = coordinateData;
    // }
}

// function caclCelius(temp) {
//     let celsius = Math.round(temp - 273.15);
//     return celsius
// }