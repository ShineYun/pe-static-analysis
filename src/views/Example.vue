<template>
  <div id="button-group">
    <div class="button-item">程序下载</div>
    <div class="button-item">文档下载</div>
    <div class="button-item">撤回动画</div>
    <div class="button-item">重置动画</div>
  </div>
  <div class="block">
    <el-carousel id="example-carousel" trigger="click" height="100%" :autoplay=false :loop=false>
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eid: -1,
    }
  },
  created() {
    this.eid = window.location.href.split('/example/')[1];
    this.$axios.get(`/api/getExample?eid=${this.eid}`).then(res => {
      console.log(res.data);
    })
  }
}
</script>

<style lang="less">
#button-group{
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 5px;
  border-bottom: black solid;
  height: 35px;
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
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.block{
  width: 100%;
  flex: 1;
}

#example-carousel {
  width: 100%;
  height: 100%;
}

</style>