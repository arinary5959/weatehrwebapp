import { fetchLocation, fetchWeather, fetchCoordinate, fetchMap } from '../api/index.js';

export default {
    // FETCH_LOCATION(context){
    //     console.log('actions')
    //     fetchLocation()
    //         .then(response => {
    //             console.log(response.data);
    //             context.commit('SET_LOCATION', response.data);
    //             return response.data
    //         })
    //         .catch(error =>{ 
    //             console.log(error);
    //         });
    // },
    FETCH_WEATHER(context){
        fetchLocation()
            .then(response => {
                console.log(response.data);
                context.commit('SET_LOCATION', response.data);
                let lat = response.data.lat
                let lon = response.data.lon
                fetchWeather(lat, lon)
                    .then(response =>{
                        // console.log(response);
                        // console.log(response.data.current);
                        // let weatherData = JSON.stringify(response.data);
                        // console.log(weatherData)
                        context.commit('SET_WEATHER', response.data);
                        return response.data
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                return response.data
            })
            .catch(error =>{ 
                console.log(error);
            });
    },
    FETCH_COORDINATE(context, query){
        console.log('coordi')
        fetchCoordinate(query)
            .then(response =>{
                console.log(response.data);
                
                return response.data;
            })
            .then(data => {
                if (data.addresses.length > 1) {
                  console.log(`${query}에는 여러 주소가 있어요.`);
                  context.commit('SET_COORDINATE', data);
                } else if (data.addresses.length === 0) {
                  console.log(`${query}에 해당되는 좌표가 없어요.`);
                  return [-1, -1];
                }
                // return [data.addresses[0].x, data.addresses[0].y];
              })
            .catch(error=>{
                console.log(error);
            })
            // return coord;

    },
    FETCH_MAP(context, payLoad){
        console.log(context)
        console.log(payLoad)
        fetchMap(payLoad)
            .then(response =>{
                console.log(response.data);
                return response.data;
            })
    }
}