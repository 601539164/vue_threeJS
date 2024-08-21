<!--<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
   </div> 
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>-->



<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// import { onBeforeMount, provide } from "vue";
// import useIsMobile from "./hooks/useIsMobile";
// import * as GlobalConfigHook from "@/hooks/useGlobalConfig.js";

// provide("GlobalConfigHook", GlobalConfigHook);
// onBeforeMount(() => {
//   // if (useIsMobile()) {
//     const mobileMeta = document.createElement("META");
//     mobileMeta.name = "viewport";
//     mobileMeta.content =
//       "width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no";
//     document.head.appendChild(mobileMeta);
//     document.documentElement.style.fontSize = "";
//     document.body.style.fontSize = "";
//   // }
// });
</script>

<style scoped></style>
