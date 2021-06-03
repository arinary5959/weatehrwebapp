<template>
  <div class="disagree_wrap">
      <p>위치 정보 제공 미동의로 지역 날씨 조회가 되지 않았습니다.</p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.disagree_wrap{
  /* width: 1440px; */
  /* margin:0 auto; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.disagree_wrap:after {
  content: "";
  display: block;
  width: 250px;
  height: 250px;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: center/contain no-repeat url('../assets/denied.png');
  opacity: .1;
}
p {
  font-size: 20px;
}
</style>