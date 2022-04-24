<template>
  <div>
    <div>测试</div>
    <div class="markdown-body" v-html="articalContent"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      articalContent: ""
    };
  },
  components: {
    // marked
  },
  created() {
    let data;
    let self = this;
    this.did = window.location.href.split('/doc/')[1];
    this.$axios.get(`/api/getDocument?did=${this.did}`).then(res => {
      console.log(res.data);
      data = res.data;
      console.log('doc_url:',data.doc_url);
      getMd(data.doc_url);
    })
    function getMd(doc_url){
      self.$axios.get(doc_url).then(res => {
        const htmlMD = self.$marked(res.data);
        console.log(typeof res.data);
        console.log(htmlMD);
        self.articalContent = htmlMD;
      });
    }
  }
};
</script>