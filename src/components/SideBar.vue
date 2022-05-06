<template>
      <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          router=true
      >
        <el-sub-menu
            v-for="category in categories"
            :index="category.index"
        >
          <template #title>
            <span>{{category.title}}</span>
          </template>
          <el-menu-item v-for="item in category.item" :index="item.route">{{item.name}}123</el-menu-item>
        </el-sub-menu>
      </el-menu>
</template>

<script>
import {getCurrentInstance, onMounted, ref} from "vue";

export default {
  name: "SideBar",
  setup(){
    const data=ref();
    const { proxy } = getCurrentInstance();
    const categories = ref();
    async function getSidebar() {
      await proxy.$axios.get(`/api/sideBar`).then(async res => {
        data.value = await res.data;
        categories.value = await Promise.all([
          {
            index:'doc',
            title:'逆向入手文档',
            item:data.value.doc,
          },
          {
            index:'example',
            title:'样本',
            item:data.value.example,
          }
        ])
      })
    }
    onMounted(()=>{
      getSidebar();
    })
    return{
      categories
    }
  },
}
</script>

<style lang="less">
.el-menu-vertical-demo{
  height: 100%;
}


.el-menu-item-group__title {
  display: flex;
  font-size: 15px !important;
  border-top: solid 1px var(--el-menu-border-color) !important;
  border-bottom: solid 1px var(--el-menu-border-color) !important;
  font-weight: bold;
  color: black !important;
 }
.el-sub-menu__title{
  border-top: solid 1px var(--el-menu-border-color) !important;
  border-bottom: solid 1px var(--el-menu-border-color) !important;
  & span{
    font-weight: bolder !important;
    font-size: 18px;
  }
}

</style>