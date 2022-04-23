<template>
  <div id="header-1-level">
    <router-link to="/">
      <div id="header-title">
        PE文件逆向仿真系统
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
#header-1-level{
  background: #05a !important;;
  width: 100vm;
  height: 60px;
  justify-content: center;
  align-items: center;
}

#header-title{
  height: 60px;
  display: flex;
  margin-left: 20px;
  align-items: center;
  line-height: 60px;
  font-size: 30px;
  font-weight: bolder;
  color: white;
}
</style>