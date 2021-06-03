import { createStore } from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'

export const store = createStore({
    state: {
        // location:{},
        lat: 0,
        lon: 0,
        city: '',
        countryCode: '',
    },
    getters:{
        getCrrInfo(state){
            return state.crrInfo;
        },
        getDailyInfo(state){
            return state.dailyInfo;
        },
        getHourlyInfo(state){
            return state.hourlyInfo;
        },
        getGeoLocation(state){
            return state.geoLocation;
        },
        getCity(state){
            return state.city;
        },
        getCountryCode(state){
            return state.countryCode;
        },
    },
    actions,
    mutations
})