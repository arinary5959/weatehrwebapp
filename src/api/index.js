import axios from 'axios'
export { fetchLocation, fetchWeather, fetchCoordinate, fetchMap }
// const config = {
//     baseUrl: 'https://api.hnpwa.com/v0/'
// };
// const pcDevice = ['Win16', 'Win32', 'Win64', 'Mac', 'Macintel'];
const APIkey = '7c42536af39c0c7215b9ce7416dac5d4';
function fetchLocation(){
    // console.log('fetchLocation')
    return axios.get('http://ip-api.com/json');
}
function fetchWeather(lat, lon){
    console.log('fetchWeather')
    return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${APIkey}`)
}
function fetchMap(payLoad){
    console.log('fetchWeather')
    console.log(payLoad.x)
    // const z = '5'
    return axios.get(`https://tile.openweathermap.org/map/{temp_new}/{10}/${payLoad.x}/${payLoad.y}.png?appid=${APIkey}`)
}
// 네이버 geocorde
function fetchCoordinate(query){
    // 프록시 서버 설치 후 url 변경, 기존 URL : https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode
    const apiKeyID = 'zucn7pfgsr';
    const apiKey = 'BWiHXjsNq1nem3RQxIvqWazo1W26uA6IageZ7SJ2';
    const config = {
        method:'get',
        params: {
            query,
        },
        headers:{
            "X-NCP-APIGW-API-KEY-ID": `${apiKeyID}`,
            "X-NCP-APIGW-API-KEY": `${apiKey}`,
            "Content-Type": "application/json",
        },
        url:'/api/map-geocode/v2/geocod'
    }
    return axios(config);
}
