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
         <iframe :src="peStaticUrl" height="100%" width="100%"/>
       </div>
      </el-dialog>
  </div>


  <div class="block">
    <el-carousel
        id="example-carousel"
        trigger="click"
        height="100%"
        initial-index="0"
        :autoplay=false
        :loop=false
        v-loading="loading"
        element-loading-text="Loading..."
        @change="switchPage">
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
          <div class="content" style="background: #FFFFFF">
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
            <h1 style="margin: 5px !important;">壳检测分析</h1>
            <el-descriptions v-if="packInfo" :column="2" border >
              <el-descriptions-item
                  label="Entry Point"
                  label-align="right"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  width="200px"
              >{{ packInfo.entryPoint}} </el-descriptions-item>
              <el-descriptions-item label="EP Section" label-align="right" align="center"
              >{{ packInfo.epSection }}</el-descriptions-item
              >
              <el-descriptions-item label="File Offset" label-align="right" align="center"
              >{{ packInfo.fileOffset }}</el-descriptions-item
              >
              <el-descriptions-item label="First Bytes" label-align="right" align="center">
                {{ packInfo.firstBytes }}
              </el-descriptions-item>
              <el-descriptions-item label="Linker Info" label-align="right" align="center"
              >{{ packInfo.linkerInfo }}</el-descriptions-item>
              <el-descriptions-item label="SubSystem" label-align="right" align="center"
              >{{ packInfo.subSystem }}
              </el-descriptions-item>
              <el-descriptions-item label="File Size" label-align="right" align="center"
              >{{ packInfo.fileSize }}</el-descriptions-item>
              <el-descriptions-item label="Overlay" label-align="right" align="center"
              >{{ packInfo.overlay }}</el-descriptions-item>

              <el-descriptions-item label="壳信息" label-align="right" align="center"
              >{{ packInfo.pack }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div id="page-three-left-down">
            <h2>VirusTotal Result</h2>
            <el-progress type="circle"
                         :percentage="100"
                         :status="virusStatus"
            />
            <div v-if="virusStatus==='success'">
            <p>No security vendors and no sandboxes flagged this file as malicious</p>
            </div>
            <div v-else>
              <p> Sandboxes flagged this file as malicious </p>
            </div>
          </div>
        </div>

        <div id="page-three-right">
          <div class="markdown-body" v-html="packVirusContent" style="text-align: left"></div>
        </div>
      </el-carousel-item>

      <el-carousel-item style="background: #FFFFFF">
        <div id="page-four-left" style="height: 100%">
          <div>
            <h1>程序结构图</h1>
            <div class="demo-image__lazy">
              <el-image  :src="structOfPE"
                         :preview-src-list="srcList"
              />
            </div>
          </div>
        </div>
      </el-carousel-item>

      <el-carousel-item style="background: #FFFFFF">
        <div id="page-five" style="height: 100%;overflow-y: scroll;">
          <h1>分析过程/结果</h1>
          <div>
            <div class="markdown-body" v-html="analyzeContent" style="text-align: left"></div>
          </div>
        </div>
      </el-carousel-item>


    </el-carousel>
  </div>
</template>

<script>

import {getCurrentInstance, ref} from 'vue'

export default {

  setup() {
    const radio = ref('asm')
    const { proxy } = getCurrentInstance();
    const dialogVisible = ref(false);
    const imgList = ref();
    const firstContent = ref();
    const secondContent = ref();
    const asmContent = ref();
    const reverseAsmContent = ref();
    const analyzeContent = ref();
    const data = ref();   //请求得到的json数据
    const loadedPage = [];
    const peStaticUrl = ref('');
    const loading = ref(true);
    const virusStatus=ref();
    const packInfo = ref();
    const pageSize = ref(5);
    const packVirusContent=ref();
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const structOfPE = ref();
    const srcList=ref([])
    const program_url=ref()
    const doc_url=ref()
    const resultContent=ref();


    //触发换页函数

    const switchPage = async (newPage,oldPage)=>{
      loading.value = true;
      const index = loadedPage.indexOf(newPage);
      if(index === -1){
        if(newPage === 1){
          secondContent.value =  await getMd(data.value.hexData);
          asmContent.value =  await getMd(data.value.asmData);
          reverseAsmContent.value =  await getMd(data.value.reverseAsmData);
        }
        else if(newPage === 2){
          packVirusContent.value = await getMd(data.value.packVirusData);
        }
        else if(newPage === 3){
          structOfPE.value = await data.value.structOfPE;
          srcList.value.push(data.value.structOfPE);
        }
        else if(newPage === 4){
          analyzeContent.value = await getMd(data.value.analyzeContent);
        }
        loadedPage.push(newPage);
      }
      loading.value = false;
    }

    const onTableRowDblClick = (row, column, event) => {
      console.log(row.id)
    }

    const defaultProps = {
      children: 'children',
      label: 'label',
    };

    function getExample(){
      proxy.eid = window.location.href.split('/example/')[1];
      proxy.$axios.get(`/api/getExample?eid=${proxy.eid}`).then(async res => {
        data.value = await res.data;
        program_url.value = await data.value.program_url;
        doc_url.value  = await data.value.doc_url;
        packInfo.value = await data.value.packInfo;
        srcList.value.push(data.value.structOfPE);
        console.log(data.value.structOfPE);
        virusStatus.value = await data.value.virusStatus;
        imgList.value = data.value.introduction.imgList;
        firstContent.value = await getMd(data.value.introduction.markdown);
        peStaticUrl.value = await data.value.peStaticUrl;
        structOfPE.value = await data.value.structOfPE;
        //todo delete next line
        packVirusContent.value = await getMd(data.value.packVirusData);
        loading.value = false;

      })

    }
     const getMd = async (url) => {
      return proxy.$axios.get(url).then(async res => {
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
      reverseAsmContent,
      analyzeContent,
      defaultProps,
      onTableRowDblClick,
      switchPage,
      data,
      loading,
      peStaticUrl,
      virusStatus,
      packVirusContent,
      small,
      background,
      disabled,
      pageSize,
      structOfPE,
      srcList,
      packInfo,
      program_url,
      doc_url,
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
  overflow-x: scroll;
  overflow-y: scroll;
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
    background: #ffffff;
    h1{
      margin: 0 !important;
    }
  }
}

#page-three-right{
  width: 50%;
  height: 100%;
  position: absolute;
  //overflow-y: scroll;
  //overflow-x: hidden;
  border-left: solid;
  right: 0;
  background: #FFFFFF;
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