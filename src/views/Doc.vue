<template>
  <div
      v-loading="loading"
      element-loading-text="Loading..."
      style="height: 100%;"
  >
    <div class="markdown-body" v-html="articalContent" style="text-align: left"></div>
  </div>
</template>
<script>
import { ref, getCurrentInstance } from "vue";

export default {
  components: {
    // marked
  },
  setup(){
    //proxy代理 类似this
    const { proxy } = getCurrentInstance();
    const articalContent = ref();
    const loading = ref(true);
    function getDoc(){
      const data = ref();
      proxy.did = window.location.href.split('/doc/')[1];
      proxy.$axios.get(`/api/getDocument?did=${proxy.did}`).then(res => {
        console.log(res.data);
        data.value = res.data;
        console.log('doc_url:',data.value.doc_url);
        getMd(data.value.doc_url);
        loading.value = false;
      })
    };
    //获取文档的写法

    function getMd(url){
      proxy.$axios.get(url).then(res => {
        const htmlMD = proxy.$marked(res.data);
        console.log(typeof res.data);
        console.log(htmlMD);
        articalContent.value = htmlMD;
      })
    }
    getDoc();
    return {
      articalContent,
      loading,
    };
  },

};
</script>

<style lang="less">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
pre{
  display: block;
  background-color:#f3f3f3;
  padding: .5rem !important;
  overflow-y: auto;
  font-weight: 300;
  border-radius: .3rem;
  background-color: #283646 !important;
}
pre >code{
  border:0px !important;
  background-color: #283646 !important;
  color:#FFF;

}
code {
  display: inline-block ;
  background-color:#f3f3f3;
  border:1px solid #fdb9cc;
  border-radius:3px;
  font-size: 12px;
  padding-left: 5px;
  padding-right: 5px;
  color:#4f4f4f;
  margin: 0px 3px;
}
</style>