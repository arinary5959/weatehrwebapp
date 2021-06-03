<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <WeatherHome v-if="agree == true"></WeatherHome>
  <Disagree v-else></Disagree>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import WeatherHome from './components/WeatherHome.vue'
import Disagree from './components/Disagree.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
    WeatherHome,
    Disagree
  },
  data(){
    return{
      agree: true,
    }
  },
  created(){
    if(confirm('지역 날씨 확인을 위해 위치 정보를 제공하시겠습니까? \n!!참고사항)\n지도가 화면에 나타나지 않을 경우 새로고침해 주세요!')){
        console.log('확인');
        // this.$store.dispatch('FETCH_LOCATION');
        this.agree = true;
    }else{
        console.log('확인하지 않음');
        this.agree = false;
    }
  }
}
</script>

<style>
@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
body,h1,h2,h3,h4,h5,h6,p,a,ul,ol,li,dl,dt,dd,table,th,td,form,fieldset,input,legend,textarea,
button, select{
  margin: 0;
  padding: 0;
}
ol,ul,li{
  list-style: none;
}
button{
  border:none;
	background-color: transparent;
	outline: none;
	cursor: pointer;
}
#app {
  width: 100%;
  min-width: 1440px;
  color:#414141;
}
body{
  background-color: #fff;
  font-family: 'GmarketSansMedium';
}

</style>
