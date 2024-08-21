import { createApp } from 'vue'
// 初始化css
import "./assets/reset.css";
// 引入相关的css
import "./assets/style.css";
// 引入动画css库
import "./assets/animate.css";
// import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import router from "@/router/index.js";

import eventBus from 'vue3-eventbus'



const app = createApp(App)
app.use(createPinia()).use(router).use(eventBus)
app.mount('#app')
