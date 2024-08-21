/*
 * @Author: ReturnMars
 * @Date: 2024-08-21 11:10:14
 * @LastEditors: 601539164@qq.com
 * @LastEditTime: 2024-08-21 14:32:58
 * @Description: 路由定义
 */

import { createRouter, createWebHashHistory } from "vue-router";
import { useStorage } from "@vueuse/core";
import HomeView from '../views/HomeView.vue'

const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
// 监听路由文件变化，更新版本后刷新浏览器
const refreshCount = useStorage("RefreshCount", 2);
router.afterEach(() => {
    refreshCount.value = 2;
});
router.onError(() => {
    if (refreshCount.value > 0) {
        window.location.reload();
        refreshCount.value--;
    }
});
export default router;
