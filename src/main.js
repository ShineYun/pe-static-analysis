import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router/index"

import 'github-markdown-css'
import axios from 'axios';
import {marked} from "marked";




const app = createApp(App)

// axios.defaults.baseURL = '/api'
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$marked = marked;


app.use(router)
app.use(ElementPlus)
app.mount('#app')

