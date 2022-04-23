<template>
      <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          router=true
      >
        <el-sub-menu
            v-for="category in categories"
            index={{category.index}}
        >
          <template #title>
            <span>{{category.title}}</span>
          </template>
<!--          <el-menu-item-group v-for="item in category.examples" :index="item.route">-->
          <el-menu-item v-for="item in category.examples" :index="item.route">{{item.name}}</el-menu-item>
<!--          </el-menu-item-group>-->
        </el-sub-menu>
<!--        <el-sub-menu index="1">-->
<!--          <template #title>-->
<!--          <span>入门分析手册</span>-->
<!--          </template>-->
<!--          <el-menu-item-group title="PE文件结构">-->
<!--            <el-menu-item index="1-1">初识结构</el-menu-item>-->
<!--            <el-menu-item index="1-2">深入了解</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--          <el-menu-item-group title="逆向分析入门">-->
<!--            <el-menu-item index="1-3">分析方式</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-sub-menu>-->
<!--        <el-sub-menu index="2">-->
<!--          <template #title>-->
<!--            <span>基本程序</span>-->
<!--          </template>-->
<!--          <el-menu-item-group title="汇编基础">-->
<!--            <el-menu-item index="2-1">HelloWorld</el-menu-item>-->
<!--            <el-menu-item index="2-2">寄存器使用</el-menu-item>-->
<!--            <el-menu-item index="2-3">函数跳转</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-sub-menu>-->
<!--        <el-sub-menu index="3">-->
<!--          <template #title>-->
<!--            <span>进阶程序</span>-->
<!--          </template>-->
<!--          <el-menu-item-group title="加壳程序">-->
<!--            <el-menu-item index="3-1">item one</el-menu-item>-->
<!--            <el-menu-item index="3-2">item one</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--          <el-menu-item-group title="代码混淆">-->
<!--            <el-menu-item index="3-3">item three</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-sub-menu>-->
<!--        <el-sub-menu index="4">-->
<!--          <template #title>-->
<!--            <span>实际应用程序</span>-->
<!--          </template>-->
<!--          <el-menu-item-group title="病毒">-->
<!--            <el-menu-item index="4-1">item one</el-menu-item>-->
<!--            <el-menu-item index="4-2">item one</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--          <el-menu-item-group title="电脑应用程序">-->
<!--            <el-menu-item index="4-3">item three</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-sub-menu>-->
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
          docs:[
            {
              name:'文档1',
              url:'发送请求位置',
              route: '/example/1'
            },
            {
              name:'文档2',
              url:'发送请求位置'
            },
            {
              name:'文档3',
              url:'发送请求位置'
            },
          ]
        },
        {
          index:2,
          title:'逆向基础',
          examples:[
            {
              name:'样例1-1',
              route:'/example/1',
              url:'发送样例请求',
            },
            {
              name:'样例1-2',
              url:'发送样例请求',
              route:'/example/2',
            },
          ]
        },
        {
          index:3,
          title:'逆向进阶',
          examples:[
            {
              name:'样例2-1',
              url:'发送样例请求',
            },
            {
              name:'样例2-2',
              url:'发送样例请求',
            },
          ]
        },
        {
          index:3,
          title:'实际应用',
          examples:[
            {
              name:'样例3-1',
              url:'发送样例请求',
            },
            {
              name:'样例3-2',
              url:'发送样例请求',
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