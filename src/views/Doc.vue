<template>
  <div>
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
    this.$axios.get("test.md").then(res => {
      const htmlMD = this.$marked(res.data);
      console.log(typeof res.data);
      console.log(htmlMD);
      this.articalContent = htmlMD;
    });
  }
};
</script>