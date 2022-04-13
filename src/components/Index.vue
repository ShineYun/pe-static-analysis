<template>
  <v-md-editor v-model="text" height="100%" mode="preview" :model-value="markdown"></v-md-editor>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      markdown: '',
    };
  },
}
</script>

<style scoped>

</style>