<template>
  <HeaderBar/>
  <div id="display">
    <div id="sidebar">
      <SideBar/>
    </div>
    <div id="info-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import SideBar from "@/components/SideBar";
export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar
  },
}
</script>

<style lang="less">
a {
  text-decoration:none
}

::-webkit-scrollbar-thumb
{
  background-color: #cdcdcd;
  border-radius: 6px;
}

::-webkit-scrollbar-track
{
  border-radius: 10px;
  background-color: rgba(255,255,255,.5);
}

::-webkit-scrollbar
{
  width: 8px;
  height: 8px;
  //background-color: #F5F5F5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#display{
  position: relative;
  height: calc(100vh - 60px);
}
#sidebar{
  width: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  left: 0;
}
#info-view{
  position: absolute;
  left: 220px;
  right: 20px;
  top:20px;
  bottom: 200px;
  //width: auto;
  height: calc(100vh - 100px);
  //margin: auto;
  border: solid;
  border-radius: 5px;
  //overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

</style>
