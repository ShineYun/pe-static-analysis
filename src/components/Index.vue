<template>
  <div id="button-group">
    <div class="button-item">程序下载</div>
    <div class="button-item">文件下载</div>
    <div class="button-item">撤回动画</div>
    <div class="button-item">重置动画</div>
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