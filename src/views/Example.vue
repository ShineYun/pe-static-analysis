<template>
  <div id="button-group">
    <a :href="program_url">
      <div class="button-item">程序下载</div>
    </a>

    <a :href="doc_url">
      <div class="button-item">文档下载</div>
    </a>
    <a href="#">
      <div class="button-item" @click="dialogVisible = true">静态信息</div>
    </a>
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
        <div id="page-one-left" style="border-right: solid ;">
          <div class="img-info-card" v-for="item of imgList" :key="index">
            <div class="img-info-card-title">{{ item.title }}</div>
            <el-image class="img-info-card-img" :src="item.src" :fit="contain" />
          </div>
        </div>
        <div id="page-one-right">
          <div class="markdown-body" v-html="firstContent" style="text-align: left"></div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div id="page-two-left">
          <h2 style="border-bottom: solid; background: #FFFFFF" >16进制信息如下</h2>
          <div class="content">
            <div class="markdown-body" v-html="secondContent" style="text-align: left;overflow-y: scroll;"></div>
          </div>
        </div>
        <div id="page-two-right">
          <div style="padding: 5px 5px; border-bottom:solid;">
            <el-radio-group v-model="radio" >
              <el-radio-button id="asm-button" label="asm">汇 编</el-radio-button>
              <el-radio-button id="reverse-asm-button" label="reverse_asm" >反汇编</el-radio-button>
            </el-radio-group>
          </div>
            <div class="content">
              <div class="markdown-body" v-if="radio === 'asm'" v-html="asmContent" style="text-align: left;overflow-y: scroll;"></div>
              <div class="markdown-body" v-if="radio === 'reverse_asm'" v-html="reverseAsmContent" style="text-align: left;overflow-y: scroll;"></div>
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

import {getCurrentInstance, onMounted, ref} from 'vue'

export default {
  data() {
    return {
      program_url:'http://www.baidu.com',
      doc_url:'https://markdown-1306010242.cos.ap-chongqing.myqcloud.com/pe.md',
    }
  },
  setup() {
    const radio = ref('asm')
    const { proxy } = getCurrentInstance();
    const dialogVisible = ref(false);
    const imgList = ref();
    const firstContent = ref();
    const secondContent = ref();
    const asmContent = ref();
    const reverseAsmContent = ref();
    function getExample(){
      proxy.eid = window.location.href.split('/example/')[1];
      proxy.$axios.get(`/api/getExample?eid=${proxy.eid}`).then(async res => {
        const data = res.data;
        console.log(res.data);
        imgList.value = data.introduction.imgList;
        // console.log('doc_url:',data.doc_url);
        firstContent.value = await getMd(data.introduction.markdown);
        secondContent.value = await getMd(data.hexData);
        asmContent.value = await getMd(data.asmData);
        reverseAsmContent.value = await getMd(data.reverseAsmData);
      })
    }
    async function getMd(url){
      return await proxy.$axios.get(url).then(async res => {
        const htmlMD = await proxy.$marked(res.data);
        // async await实现异步等待
        return htmlMD;
      })
    }

    getExample()
    const onDialogOpen = () => {
      document.getElementsByClassName('myDialog')[0].parentElement.parentElement.style.pointerEvents = 'none';
      document.getElementsByClassName('myDialog')[0].style.pointerEvents = 'auto';
      // document.getElementsByClassName('myDialog')[0].style.
    }


    return {
      onDialogOpen,
      radio,
      dialogVisible,
      imgList,
      firstContent,
      secondContent,
      asmContent,
      reverseAsmContent
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

.content{
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
}

#page-one-left{
  width: 50%;
  height: 100%;
  position: absolute;
  border-left: solid;
  left: 0;
  background: #ffffff;
  overflow-y: auto;
  &{
    margin: 0;
  }
  & :deep(h3) {
    line-height: 15px !important;
    //深度选择器，覆盖组件样式
  }
}

.img-info-card:not(:first-child) {
  //margin-top: 20px;
}

.img-info-card-title {
  font-size: 28px;
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
  position: absolute;
  //overflow-y: scroll;
  //overflow-x: hidden;
  border-left: solid;
  left: 0;
  background: #d3dce6;
  & :deep(h3) {
    line-height: 15px !important;
    //深度选择器，覆盖组件样式
  }
  & :deep(h2){
    padding: 5px 5px !important;
    margin: 0 !important;
  }
}

#page-two-right{
  width: 50%;
  height: 100%;
  position: absolute;
  //overflow-y: scroll;
  //overflow-x: hidden;
  border-left: solid;
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



</style>