import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router/index"

import 'github-markdown-css/github-markdown.css'
import axios from 'axios';
import {marked} from "marked";
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
const renderer = new marked.Renderer();
marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    highlight: function (code) {
        // 使用highlight 插件解析文档中代码部分,可直接设置高亮显示
        return hljs.highlightAuto(code).value;
    }
});


const app = createApp(App)

// axios.defaults.baseURL = '/api'
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$marked = marked;


// app.directive('dialogDrag', )

app.use(router)
app.use(ElementPlus)
app.mount('#app')

