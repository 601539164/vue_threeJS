import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from "vite-plugin-html";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // element-plust
import { VantResolver } from "unplugin-vue-components/resolvers"; // vant
import { ArcoResolver } from "unplugin-vue-components/resolvers"; // arco
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        "./src/main.js",
        "./src/components/**/*.vue",
        "./src/views/components/**/*.vue",
        "./src/hooks/**/*.js",
      ],
    },
  },
  // build: {
  //   minify: "esbuild",
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id, { getModuleInfo }) {
  //         if (id.includes("node_modules")) {
  //           //拆包
  //           if (id.includes("/element-plus")) {
  //             return "vendorElementPlus";
  //           } else if (id.includes("/@element-plus+icons-vue")) {
  //             return "vendorElementPlusIcon";
  //           } else if (id.includes("/echarts")) {
  //             return "vendorEcharts";
  //           } else if (id.includes("/zrender")) {
  //             return "vendorZrender";
  //           } else if (id.includes("/wangeditor")) {
  //             return "vendorEditor";
  //           } else if (id.includes("/xlsx")) {
  //             return "vendorXlsx";
  //           } else if (id.includes("/html2canvas")) {
  //             return "vendorHtml2canvas";
  //           } else if (id.includes("/jsqr")) {
  //             return "vendorJsqr";
  //           } else if (id.includes("/lodash")) {
  //             return "vendorLodash";
  //           } else if (id.includes("/vant")) {
  //             return "vendorVant";
  //           }
  //           return "vendor";
  //         } else if (id.includes("/src")) {
  //           if (id.includes("/assets")) {
  //             return "src-assets";
  //           }
  //           return "src-code";
  //         }
  //         // const srcComponentsRef = /(.*)\/src\/components\/(.*)/;
  //         // if (srcComponentsRef.test(id)) {
  //         //   const importersLen = getModuleInfo(id).importers.length;
  //         //   // 被多处引用
  //         //   if (importersLen > 1) {
  //         //     return "common";
  //         //   }
  //         // }
  //         // const srcViewsRef = /(.*)\/src\/views\/(.*)/;
  //         // if (srcViewsRef.test(id)) {
  //         //   const importersLen = getModuleInfo(id).importers.length;
  //         //   // 被多处引用
  //         //   if (importersLen > 1) {
  //         //     return "common";
  //         //   }
  //         // }
  //         // 其他src不能拆分，否则打包后到线上报错
  //         // return "src-code";
  //       },
  //     },
  //   },
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ArcoResolver({
          exclude: ["vant", "element-plus", "map", "MapLocation", "Map"],
        }),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
      imports: ["vue"],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
        ArcoResolver({
          sideEffect: true,
          exclude: ["vant", "element-plus", "map", "MapLocation", "Map"],
        }),
        VantResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    /** 注入时间和环境 */
    createHtmlPlugin({
      minify: true,
      entry: "src/main.js",
    }),
  ],
})
