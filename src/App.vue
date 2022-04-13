<template>
  <HeaderBar/>
  <div id="sidebar">
    <SideBar/>
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
  }
}
</script>

<style lang="less">
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
#sidebar{
  width: 200px;
  height: calc(100vh - 60px);
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>
