<template>
    <div class="home_wrap">
        <h1 class="blind">오늘 날씨</h1>
        <section class="search">
            <div class="search_location">
            <!-- <label for="searchlocation"> -->
                <input v-model="locationInfo" type="text" name="searchlocation" placeholder="도시명을 입력해 주세요.. --구현중입니다!--">
                <button v-on:click="coordinate" class="search_btn" type="submit">검색</button>
            <!-- </label> -->
            </div>
        </section>
        <section class="today">
            <div class="weather_info">
                <div class="main_info">
                    <span>now, {{ timeFromUnix(getCrrInfo.dt) }}</span>
                    <h2>{{ getCity }}, {{ getCountryCode }}</h2>
                    <div class="description">
                        <div class="weather_icon">
                            <img :src="crrIconURL(getCrrInfo)" alt="">
                        </div>
                        <p>{{ caclCelius(getCrrInfo.temp) }}&#8451;</p>
                    </div>
                </div>
                <div class="sub_info">
                    <ul>
                        <li>체감 온도 {{ caclCelius(getCrrInfo.feels_like) }}&#8451;</li>
                        <li>최고 기온 {{ maxminTemp().crrMaxTemp }}&#8451;</li>
                        <li>최저 기온 {{ maxminTemp().crrMinTemp }}&#8451;</li>
                        <li>습도 {{ getCrrInfo.humidity }}&#37;</li>
                        <li>UVI {{ crrUVI() + ` (${getCrrInfo.uvi})` }}</li>
                        <li>날씨 {{ getCrrInfo.weather[0].description }}</li>
                        <li>일출 {{ getTimeFromUnix(getCrrInfo.sunrise) }}</li>
                        <li>일몰 {{ getTimeFromUnix(getCrrInfo.sunset) }}</li>
                    </ul>
                </div>
            </div>
            <div id="map">
            </div>
        </section>
        <section class="forecast">
            <div class="hourly_info">
                <h3>시간별 날씨 정보</h3>
                <ul v-for="item, index in fiveHourlyInfo()" :key="index">
                    <!-- {{fiveHourlyInfo()}} -->
                    <li class="forecast_info">
                        <div class="main_info">
                            <h4>{{ timeFromUnix(item.dt) }}</h4>
                            <div class="description">
                                <div class="description_inner">
                                    <div class="weather_icon">
                                        <img :src="crrIconURL(item)" :alt="item.weather[0].main">
                                    </div>
                                    <p>{{ caclCelius(item.temp) }}&#8451;</p>
                                </div>
                            </div>
                            <span>{{ item.weather[0].description }} </span>
                        </div>
                        <!-- <div class="sub_info">
                            <ul>
                                <li>
                                    <span>체감온도 {{ item.feels_like }}</span>
                                </li>
                                <li>
                                    <span>풍속 {{ item.wind_speed }}</span>
                                </li>
                                <li>
                                    <span>습도 {{ item.humidity }}%</span>
                                </li>
                            </ul>
                        </div> -->
                    </li>
                </ul>
            </div>
            <div class="daily_info">
                <h3>일별 날씨 정보</h3>
                <ul>
                    <li v-for="item, index in daysInfo()" :key="index" :class="`forecast_info forecast_info_`+index" :ref="'forecastInfo' + index">
                        <div class="main_info">
                            <h4>{{ dateFromUnix(item) }}일 {{dayFromUnix(item)}}</h4>
                            <div class="description">
                                <div class="weather_icon">
                                    <img :src="crrIconURL(item)" :alt="item.weather[0].main">
                                </div>
                                <p>{{ caclCelius(item.temp.day) }}/{{ caclCelius(item.temp.max) }}/{{ caclCelius(item.temp.min) }}&#8451;</p>
                            </div>
                            <span>{{ item.weather[0].description }} 
                                <button v-on:click="openSubInfo(index, $event)"><i class="fas fa-sort-down"></i></button>
                            </span>
                        </div>
                        <!-- <div :class="'sub_info'+index" :ref="'subInfo' + index"> -->
                        <div :class="'sub_info sub_info_'+index" :ref="'subInfo' + index">
                            <ul>
                                <li>UVI: {{ item.uvi }}</li>
                                <li>습도: {{ item.humidity }}%</li>
                                <li>
                                    <table class="day_table">
                                        <tr>
                                            <th></th>
                                            <th>Morning</th>
                                            <th>Afternoon</th>
                                            <th>Evening</th>
                                            <th>Night</th>
                                        </tr>
                                        <tr>
                                            <td>TEMPERATURE</td>
                                            <td>{{ caclCelius(item.temp.morn) }}&#8451;</td>
                                            <td>{{ caclCelius(item.temp.day) }}&#8451;</td>
                                            <td>{{ caclCelius(item.temp.eve) }}&#8451;</td>
                                            <td>{{ caclCelius(item.temp.night) }}&#8451;</td>
                                        </tr>
                                        <tr>
                                            <td>FEELS LIKE</td>
                                            <td>{{ caclCelius(item.feels_like.morn) }}&#8451;</td>
                                            <td>{{ caclCelius(item.feels_like.day) }}&#8451;</td>
                                            <td>{{ caclCelius(item.feels_like.eve) }}&#8451;</td>
                                            <td>{{ caclCelius(item.feels_like.night) }}&#8451;</td>
                                        </tr>
                                    </table>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
// import { onMounted } from "vue";
import { mapGetters } from 'vuex';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
export default {
    data(){
        return {
            today:new Date().getDate(),
        }
    },
    created(){
        // 1차 방법: navigator 사용하려 했으나 정확하지 않아서(다른 동을 보여줌) 
        // 지역정보 api를 사용함. 시단위로 보여줌
        // 2차 방법: navigator 가 더 정확해짐??-> navigator로 지역 정보를 가져오는 방법 //??보는 날에 따라 lat lon의 정확도가 왜 다를까
        // // 정확도? api로 lat,lon좌표가져오기 or 브라우저 내장함수로 가져오기
        navigator.geolocation.getCurrentPosition( position => {
            console.log('네이게이터')
            this.lon = position.coords.longitude;
            this.lat = position.coords.latitude;
        });
        // 날씨 정보 가져오기. 지역정보 api 사용
        this.$store.dispatch('FETCH_WEATHER');
    },
    mounted(){
        // 지도 그리기
        console.log(this.lon)
        console.log(this.lat)
        navigator.geolocation.getCurrentPosition( position => {
            console.log('네이게이터')
            this.lon = position.coords.longitude;
            this.lat = position.coords.latitude;
        });
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpbmFyaTU5NTkiLCJhIjoiY2tsbHF0dDA5MDF4ZjJ3cG05dDR3amFzciJ9.1xIaEnCPbqruyz6m_kteIA';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            // center: [`${this.getGeoLocation.lon}`,`${this.getGeoLocation.lat}`], //starting position [lng, lat]
            center: [this.lon, this.lat], //starting position [lng, lat]
            zoom: 10 // starting zoom
        });
        new mapboxgl.Marker({
            // color: "#FFFFFF",
            draggable: true
        // }).setLngLat([`${this.getGeoLocation.lon}`,`${this.getGeoLocation.lat}`])
        }).setLngLat([this.lon, this.lat])
        .addTo(map);
        map.on('load', ()=>{
            console.log(map)
        })
        console.log(map)
        return map
    },
     computed:{
        ...mapGetters(['getGeoLocation', 'getCrrInfo', 'getDailyInfo', 'getCity', 'getCountryCode', 'getHourlyInfo']),
    },
    methods:{
        caclCelius(temp){
             return Math.round(temp - 273.15)
        },
        crrIconURL(item){
            // console.log(this.getCrrInfo)
            let crrIconCode = item.weather[0].icon
            let iconURL = `http://openweathermap.org/img/wn/${crrIconCode}@2x.png`;
            return iconURL;
        },
        crrUVI(){
            if(this.getCrrInfo.uvi < 2){
                return '낮음'
            }else if(this.getCrrInfo.uvi <= 5){
                return '보통'
            }else if(this.getCrrInfo.uvi <= 7){
                return '높음'
            }else if(this.getCrrInfo.uvi <= 10){
                return '매우 높음'
            }else if(this.getCrrInfo.uvi > 10){
                return '위험'
            }
        },
        getTimeFromUnix(unixTime){
            let date = new Date(unixTime * 1000)
            let hours = date.getHours();
            let minutes = date.getMinutes();
            // let seconds = date.getSeconds();
            // console.log(date)
            return (`${hours}:${minutes}`)
        },
        maxminTemp(){
            let dayOfdailyInfo = new Date(this.getDailyInfo[0].dt * 1000).getDate();
            let crrMaxMinTemp = {};
            if(this.today == dayOfdailyInfo){
                let crrMaxTemp = Math.round(this.getDailyInfo[0].temp.max - 273.15)
                let crrMinTemp = Math.round(this.getDailyInfo[0].temp.min - 273.15)
                crrMaxMinTemp = {'crrMaxTemp': crrMaxTemp, 'crrMinTemp': crrMinTemp}
            }else{
                console.log('false');
            }
            return crrMaxMinTemp;
        },
        fiveHourlyInfo(){
            // const days =['일', '월', '화', '수', '목', '금', '토'];
            console.log(this.getHourlyInfo[0])
            let hourlyForecastItems = [];
            for(let i = 0; i < this.getHourlyInfo.length; i++){
                if(this.getCrrInfo.dt < this.getHourlyInfo[i].dt && hourlyForecastItems.length < 5){
                    hourlyForecastItems.push(this.getHourlyInfo[i])
                }
            }
            // console.log(hourlyForecastItems)
            return hourlyForecastItems
        },
        timeFromUnix(unixTime){
            console.log(unixTime)
            let date = new Date(unixTime * 1000)
            let hours = date.getHours();
            // let minutes = date.getMinutes();
            let time;
            if(hours > 12){
                time = `${hours - 12}pm`;
            }else if(hours < 12){
                time = `${hours}am`;
            }else if( hours == 12){
                time = `${hours - 12 }am`;
            }           
            return time;
        },
        daysInfo(){
            console.log(this.getDailyInfo[0].dt)
            console.log(this.getCrrInfo.dt)
            console.log(new Date(this.getCrrInfo.dt * 1000).getDate())
            console.log(this.getCrrInfo.dt == this.getDailyInfo[0].dt)
            let date;
            let dayInfoItems = [];
            for(let i = 0; i < this.getDailyInfo.length; i++){
                date = new Date(this.getDailyInfo[i].dt * 1000).getDate()
                if(date > new Date(this.getCrrInfo.dt * 1000).getDate() && dayInfoItems.length < 5){
                    dayInfoItems.push(this.getDailyInfo[i])
                }
            }
            console.log(dayInfoItems)
            return dayInfoItems;
        },
        dayFromUnix(item){
            const days =['일', '월', '화', '수', '목', '금', '토']
            let dayOfNum = new Date(item.dt * 1000).getDay();
            console.log(dayOfNum)
            console.log(days[dayOfNum])
            return days[dayOfNum];
        },
        dateFromUnix(item){
            return new Date(item.dt * 1000).getDate();
        },
        openSubInfo(index, event){
            console.dir(this.$refs[`subInfo${index}`])
            console.dir(this.$refs[`forecastInfo${index}`])
            // console.dir(index)
            console.dir(event.target)
            if(this.$refs[`subInfo${index}`].classList.contains('on')){
                this.$refs[`subInfo${index}`].classList.remove('on')
                for(let i = 0; i < 5; i++){
                    this.$refs[`forecastInfo${i}`].classList.remove('on')
                }
            }else{
                this.$refs[`subInfo${index}`].classList.add('on')
                for(let i = 0; i < 5; i++){
                    console.log(i)
                    console.log(index)
                    if(i == index)return;
                    console.log(i)
                    this.$refs[`forecastInfo${i}`].classList.add('on')
                }
            }
        },
        coordinate(e){
            console.log(e)
            console.log(this.locationInfo)
            let query = `${this.locationInfo}`
            this.$store.dispatch('FETCH_COORDINATE', query)
        },
        weatherMap(){
            // 기상청 소스 활용
            // var rs = dfs_xy_conv("toLL",`${this.getGeoLocation.lat}`,`${this.getGeoLocation.lon}`);
            // console.log(rs.lat, rs.lng);
            // LCC DFS 좌표변환을 위한 기초 자료
            var RE = 6371.00877; // 지구 반경(km)
            var GRID = 5.0; // 격자 간격(km)
            var SLAT1 = 30.0; // 투영 위도1(degree)
            var SLAT2 = 60.0; // 투영 위도2(degree)
            var OLON = 126.0; // 기준점 경도(degree)
            var OLAT = 38.0; // 기준점 위도(degree)
            var XO = 43; // 기준점 X좌표(GRID)
            var YO = 136; // 기1준점 Y좌표(GRID)
            //
            // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
            //
            function dfs_xy_conv(code, v1, v2) {
                var DEGRAD = Math.PI / 180.0;
                var RADDEG = 180.0 / Math.PI;

                var re = RE / GRID;
                var slat1 = SLAT1 * DEGRAD;
                var slat2 = SLAT2 * DEGRAD;
                var olon = OLON * DEGRAD;
                var olat = OLAT * DEGRAD;

                var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
                sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
                var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
                sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
                var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
                ro = re * sf / Math.pow(ro, sn);
                var rs = {};
                if (code == "toXY") {
                    rs['lat'] = v1;
                    rs['lng'] = v2;
                    var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
                    ra = re * sf / Math.pow(ra, sn);
                    var theta = v2 * DEGRAD - olon;
                    if (theta > Math.PI) theta -= 2.0 * Math.PI;
                    if (theta < -Math.PI) theta += 2.0 * Math.PI;
                    theta *= sn;
                    rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
                    rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
                }
                else {
                    rs['x'] = v1;
                    rs['y'] = v2;
                    var xn = v1 - XO;
                    var yn = ro - v2 + YO;
                    ra = Math.sqrt(xn * xn + yn * yn);
                    if (sn < 0.0) - ra;
                    var alat = Math.pow((re * sf / ra), (1.0 / sn));
                    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

                    if (Math.abs(xn) <= 0.0) {
                        theta = 0.0;
                    }
                    else {
                        if (Math.abs(yn) <= 0.0) {
                            theta = Math.PI * 0.5;
                            if (xn < 0.0) - theta;
                        }
                        else theta = Math.atan2(xn, yn);
                    }
                    var alon = theta / sn + olon;
                    rs['lat'] = alat * RADDEG;
                    rs['lng'] = alon * RADDEG;
                }
                return rs;
            }
            let xyData = dfs_xy_conv("toXY",`${this.getGeoLocation.lat}`,`${this.getGeoLocation.lon}`);
            console.log(xyData.x)
            this.$store.dispatch('FETCH_MAP', xyData)
            return xyData
        },
        mapBox(){
            // var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
            // console.log(mapboxgl)
            // mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpbmFyaTU5NTkiLCJhIjoiY2tsbHF0dDA5MDF4ZjJ3cG05dDR3amFzciJ9.1xIaEnCPbqruyz6m_kteIA';
            // var map = new mapboxgl.Map({
            //     container: 'map',
            //     style: 'mapbox://styles/mapbox/light-v10',
            //     center: [`${this.getGeoLocation.lat}`,`${this.getGeoLocation.lon}`],
            //     zoom: 3 // starting zoom
            // });
            // map.on('load', () => {
            //     // TODO: Here we want to load a layer
            //     // TODO: Here we want to load/setup the popup
            // });
            // return map

        }
    }
}
</script>

<style scoped>
.home_wrap{
    width: 80%;
    margin: 5% auto 5%;
    border-radius: 50px;
    background: #fff;
    box-shadow:  20px 20px 60px #d9d9d9,
                -20px -20px 60px #ffffff;
}
.blind{
    width: 1px;
    height: 1px;
    margin: -1px;
    visibility: hidden;
    overflow: hidden;
    text-indent: -9999999px;
    position: absolute;
    top: 0;
    left: 0;
}
.search_location{
    /* border:1px solid red; */
    padding:80px 10% 50px;
}
button.search_btn{
    width: 100px;
    height: 36px;
    background-color: rgb(65, 65, 65);
    color:white;
    border-radius: 0 5px 5px 0;
}
input[type='text']{
    width: calc(100% - 120px);
    height: 36px;
    border: none;
    vertical-align: top;
    padding: 0 10px;
    border-radius: 5px 0 0 5px;
    background-color: #f3f3f3;
}
input[type='text']:focus{
    border: none;
    outline: none;
}
section.forecast{
    padding: 0 10%;
}
section.today {
    margin: 0 10% 40px;
    position: relative;
}
section.today > div{
    float: left;
}
section.today:after{
    content: "";
    display: block;
    clear: both;
}
section.today #map{
    width: 50%;
    height: 210px;
    /* margin-top: 20px; */
    position: absolute;
    bottom: 0;
    right: 0;
}
.weather_info{
    /* width: calc(50% - 4%); */
    width: 50%;
    /* padding: 2%; */
    border-radius: 20px;
}
.weather_info .main_info h2{
    font-size: 28px;
    margin-bottom: 28px;
}
.weather_info .main_info div.description{
    position: relative;
    /* text-align: center; */
    font-size: 24px;
    margin-bottom: 8px;
}
.description_inner{
    width: fit-content;
    /* border:1px solid green; */
    position: relative;
}
.weather_info .main_info div.description p,
.forecast_info .main_info div.description p{
    margin-left: 50px;
}
.weather_icon {
    width:50px;
    height:50px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}
.weather_icon img{
    width: 100%;
}
.sub_info{
   width: 100%;
}
.sub_info > ul{
     display: flex;
    /* flex-direction: row; */
    flex-wrap: wrap;
    justify-content: space-between;
}
.sub_info > ul > li{
    width: 50%;
}
.forecast::after{
    content: "";
    display: block;
    clear: both;
    margin-bottom: 80px;
}
.forecast h3{
    margin-bottom: 14px;
}
.forecast > div{
    width: calc(50% - 1%);
    float: left;
}
.forecast > div:nth-child(1){
    padding-right: 1%;
}
.forecast > div:nth-child(2){
    padding-left: 1%;
}
.forecast_info .description{
    position: relative;
    /* border:1px solid red; */
}
.forecast_info .main_info{
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid #dbdbdb;
    padding: 6px 0; 
}
.forecast_info .main_info span{
    font-size: 12px;
    width:35%;
    text-align: right;
}
.forecast_info .main_info h4{
    width: 30%;
    line-height: 20.8px;
}
.forecast_info .main_info .description{
    width: 35%;
    /* text-align: center; */
}
.daily_info {
    height: 212px;
    overflow: hidden;
}
.forecast_info.on,
.daily_info .sub_info{
    display: none;
}
.daily_info > ul > li.forecast_info > .sub_info > ul > li:nth-child(1),
.daily_info > ul > li.forecast_info > .sub_info > ul > li:nth-child(2){
    /* border-top:1px solid red; */
    margin-top: 8px;
}
.forecast_info,
.daily_info .sub_info.on{
    display: block;
}
.day_table tr td:not(:first-child){
    text-align: center;
}
.day_table th,
.day_table tr:not(:nth-child(1)) td:first-child {
    font-size: 14px;
}
.day_table td{
    font-size: 14px;
}
.day_table th,
.day_table td{
    padding: 4px 10px;
}
.day_table{
    margin-top:18px;
}
</style>