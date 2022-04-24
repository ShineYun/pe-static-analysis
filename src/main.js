import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router/index"

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import axios from 'axios';
import {marked} from "marked";

import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App)

// axios.defaults.baseURL = '/api'
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$marked = marked;


app.use(router)
app.use(ElementPlus)
app.use(VMdPreview);
app.mount('#app')

