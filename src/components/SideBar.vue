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
          <el-menu-item v-for="item in category.item" :index="item.route">{{item.name}}</el-menu-item>
        </el-sub-menu>
      </el-menu>
</template>

<script>
export default {
  name: "SideBar",
  data(){
    return{
      categories:[
        {
          index:1,
          title:'入门分析手册',
          item:[
            {
              name:'文档1',
              url:'发送请求位置',
              route: '/doc/1',
            },
            {
              name:'文档2',
              url:'发送请求位置',
              route: '/doc/2',
            },
            {
              name:'文档3',
              url:'发送请求位置',
              route: '/doc/3',
            },
          ]
        },
        {
          index:2,
          title:'逆向基础',
          item:[
            {
              name:'样例1-1',
              route:'/example/1',
            },
            {
              name:'样例1-2',
              route:'/example/2',
            },
          ]
        },
        {
          index:3,
          title:'逆向进阶',
          item:[
            {
              name:'样例2-1',
              route:'/example/1',
            },
            {
              name:'样例2-2',
              route:'/example/1',
            },
          ]
        },
        {
          index:4,
          title:'实际应用',
          item:[
            {
              name:'样例3-1',
              route:'/example/1',
            },
            {
              name:'样例3-2',
              route:'/example/1',
            },
          ]
        }
      ]
    }
  }
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