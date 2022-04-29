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
        <div id="page-one-left">
          <div id="page-one-left-top">
            <div>程序运行如下：</div>
          </div>
          <div id="page-one-left-down">
            <div>程序结果如下：</div>
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
        <div id="page-two-right">汇编or反汇编结果</div>
      </el-carousel-item>
      <el-carousel-item >
        <h1 class="small">这是步骤：3</h1>
      </el-carousel-item>

    </el-carousel>
  </div>
</template>

<script>

export default {
  data() {
    return {
      eid: -1,
      dialogVisible : false,
      program_url:'http://www.baidu.com',
    }
  },
  directives: {
    // dialogDrag
  },
  created() {
    this.eid = window.location.href.split('/example/')[1];
    this.$axios.get(`/api/getExample?eid=${this.eid}`).then(res => {
      console.log(res.data);
      data = res.data;
      console.log('doc_url:',data.doc_url);
      getMd(data.doc_url);
    })
  },
  mounted() {
  },
  setup() {
    const onDialogOpen = () => {
      document.getElementsByClassName('myDialog')[0].parentElement.parentElement.style.pointerEvents = 'none';
      document.getElementsByClassName('myDialog')[0].style.pointerEvents = 'auto';
      // document.getElementsByClassName('myDialog')[0].style.
    }

    return {
      onDialogOpen
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
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  left: 0;
  background: #ffffff;
  &{
    margin: 0;
  }
  #page-one-left-top{
    height: 50%;
    overflow-y: scroll;
    h1{
      margin: 0 !important;
    }
  }
  #page-one-left-down{
    height: 50%;
    overflow-y: scroll;
    background: #0055aa;
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
  right: 0;
  background: #d3dce6;
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