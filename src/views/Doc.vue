<template>
  <div>
    <div>测试</div>
    <div v-html="articalContent"></div>
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
    this.did = window.location.href.split('/doc/')[1];
    this.$axios.get("test"+this.did+".md").then(res => {
      const htmlMD = this.$marked(res.data);
      console.log(typeof res.data);
      console.log(htmlMD);
      this.articalContent = htmlMD;
    });
  }
};
</script>