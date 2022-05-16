<template>
  <div style="display:flex;    justify-content:center;    align-items:center; align-content: center; height: 100%">
    <el-card :body-style="{ padding: '0px' }" style="height: 100%;width: 100%">
      <img
          src="https://markdown-1306010242.cos.ap-chongqing.myqcloud.com/_.._logo_font20220514_uugai.com-m9549-16525119077874.png"
          class="image"
      />
      <div style="padding: 5px">
        <span>请从侧边栏选择需要的内容</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
#button-group{
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 5px;
  border-bottom: black solid;
}
.button-item{
  background: #ecf5ff;
  color: #409eff;
  border: #a0cfff solid;
  border-radius: 4px;
  padding: 4px;
  width: 100px;
  &:hover{
    background: #409eff;
    color: #ffffff;
    border: #409eff solid;
  }
}
.button-item + .button-item{
  margin-left: 10px;
}

</style>