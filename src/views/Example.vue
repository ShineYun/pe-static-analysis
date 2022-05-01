<template>
  <div id="button-group">
    <a :href="program_url">
      <div class="button-item">程序下载</div>
    </a>
    <div class="button-item">文档下载</div>
    <div class="button-item" @click="dialogVisible = true">静态信息</div>
  </div>
  <div class="all-dialog" >
      <el-dialog v-model="dialogVisible"
                 title="静态信息" width="50%"
                 :modal="false"
                 draggable
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 custom-class="myDialog"
                 @opened="onDialogOpen"
      >
       <div id="dialog-body">
         <el-descriptions title="User Info">
           <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
           <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
           <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
           <el-descriptions-item label="Remarks">
             <el-tag size="small">School</el-tag>
           </el-descriptions-item>
           <el-descriptions-item label="Address"
           >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
             Province</el-descriptions-item
           >
         </el-descriptions>
       </div>
      </el-dialog>
  </div>


  <div class="block">
    <el-carousel id="example-carousel" trigger="click" height="100%" :autoplay=false :loop=false>
      <el-carousel-item >
        <div id="page-one-left" style="border-right: solid ;margin-right: 5px">
          <div id="page-one-left-top">
            <h3 style="border-bottom: solid">程序运行显示界面</h3>
            <div class="demo-image__error">

              <div class="block">
                <el-image src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" fit="fill" />
              </div>
              </div>

          </div>
          <div id="page-one-left-down">
            <h3 style="border-bottom: solid">程序运行结果界面</h3>

          </div>
        </div>
        <div id="page-one-right">
          <div>test介绍文档</div>
<!--          <div class="markdown-body" v-html="articalContent" style="text-align: left">测试</div>-->
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div id="page-two-left">
          <h1>16进制信息如下</h1>
        </div>
        <div id="page-two-right">
          <div style="margin-top: 5px;">
            <el-radio-group v-model="radio" >
              <el-radio-button label="汇 编" />
              <el-radio-button label="反汇编" />
            </el-radio-group>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item >
        <div id="page-three-left">
          <div id="page-three-left-top">
            PE基本信息表

          </div>
          <div id="page-three-left-down">
            正确信息显示
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item >
        <h1 class="small">这是步骤：4</h1>
      </el-carousel-item>

    </el-carousel>
  </div>
</template>

<script>

import {getCurrentInstance, ref} from 'vue'

export default {
  data() {
    return {
      program_url:'http://www.baidu.com',
      a: null
    }
  },
  // created() {
  //   this.eid = window.location.href.split('/example/')[1];
  //   this.$axios.get(`/api/getExample?eid=${this.eid}`).then(res => {
  //     console.log(res.data);
  //     data = res.data;
  //     console.log('doc_url:',data.doc_url);
  //     getMd(data.doc_url);
  //   })
  // },
  setup() {
    const radio = ref('汇 编')
    const { proxy } = getCurrentInstance();
    const dialogVisible = ref(false);
    function getExample(){
      proxy.eid = window.location.href.split('/example/')[1];
      proxy.$axios.get(`/api/getExample?eid=${proxy.eid}`).then(res => {
        console.log(res.data);
        // data = res.data;
        // console.log('doc_url:',data.doc_url);
        // getMd(data.doc_url);
      })
    }
    getExample()
    function getMd(url){
      proxy.$axios.get(url).then(res => {
        const htmlMD = proxy.$marked(res.data);
        console.log(typeof res.data);
        console.log(htmlMD);
        // articalContent.value = htmlMD;
      })
    }
    const onDialogOpen = () => {
      document.getElementsByClassName('myDialog')[0].parentElement.parentElement.style.pointerEvents = 'none';
      document.getElementsByClassName('myDialog')[0].style.pointerEvents = 'auto';
      // document.getElementsByClassName('myDialog')[0].style.
    }

    return {
      onDialogOpen,
      radio,
      dialogVisible,
    }
  }
}
</script>

<style scoped lang="less">

.block{
  overflow-y:auto;
}
#dialog-body{
  height: 60vh;
  overflow-x: auto;
  overflow-y: auto;
}

#button-group{
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 5px;
  border-bottom: black solid;
  height: 35px;
}



#page-one-left{
  width: 50%;
  height: 100%;
  position: absolute;
  border-left: solid;
  left: 0;
  background: #ffffff;
  &{
    margin: 0;
  }
  & :deep(h3) {
    line-height: 15px !important;
    //深度选择器，覆盖组件样式
  }
  #page-one-left-top{
    height: 50%;
    border-bottom: solid;
  }
  #page-one-left-down{
    height: 50%;
    background: #ffffff;
    h1{
      margin: 0 !important;
    }
  }
}

#page-one-right{
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  border-left: solid;
  border-bottom: solid;
  right: 0;
  background: #FFFFFF;
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
}

#page-two-left{
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  left: 0;
  background: #d3dce6;
}

#page-two-right{
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  right: 0;
  background: #FFFFFF;
}

#page-three-left{
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  left: 0;
  background: #ffffff;
  &{
    margin: 0;
  }
  #page-three-left-top{
    height: 50%;
    overflow-y: scroll;
    h1{
      margin: 0 !important;
    }
  }
  #page-three-left-down{
    height: 50%;
    overflow-y: scroll;
    background: #0055aa;
    h1{
      margin: 0 !important;
    }
  }
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

.demo-image__error .block {
  padding: 30px 0;
  text-align: center;
  display: inline-block;
  width: 80%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__error .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__error .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 100%;
  width: 100%;
  height: 200px;
}

.demo-image__error .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}


</style>