<template>
  <div class="container">
    <form>
      <label
        v-for="(item, index) in control.controls"
        :key="index + item.name"
        @click="control.activeFun(item, index)"
      >
        <input
          type="radio"
          name="radio"
          :checked="index === control.activeVar"
        />
        <span>{{ item.name }}</span>
      </label>
    </form>
    <!-- 楼层返回 -->
    <div
      class="back animated fadeIn"
      @click="control.backFloorBase"
      v-if="control.isShowFloorBack"
    >
      <img src="../../../../assets/image/back.png" alt="" />
      <p>返回</p>
    </div>
    <!-- 楼层UI -->
    <Layer
      v-if="control.isShowFloorBack"
      :layers="control.layerData"
      :active="control.currentLayer"
      @change="control.changeLayer"
      :styles="{ top: '55%', left: '72%', height: '400px' }"
    ></Layer>
    <!-- 提示框 -->
    <Tooltip
      v-if="control.roomTooltipStyle.show"
      :style="{
        left: control.roomTooltipStyle.x + 'px',
        top: control.roomTooltipStyle.y + 'px',
      }"
      :data="control.roomTooltipStyle"
    ></Tooltip>
  </div>
</template>

<script setup>
import { loaderFloorManage, setModelLayer } from "@/three/floorManage";
import {
  setModelDefaultMaterial,
  destroyControlsGroup,
} from "@/three/loaderModel";
import {
  loaderParkElectricity,
  destroyParkElectricity,
} from "@/three/parkElectricity";
import { loaderParkWater, destroyParkWater } from "@/three/parkWater";
import { parkData, cameraUrls } from "@/assets/mock/mock";
import EventBus from "vue3-eventbus";
import Layer from "@/components/layer.vue";
import Tooltip from "@/components/tooltip.vue";
import { onMounted, reactive } from "vue";

const control = reactive({
  roomTooltipStyle: {
    show: false,
    x: 0,
    y: 0,
    name: "",
  },
  controls: [
    {
      name: "首页",
      goFunction: () => {
        if (app.id === 'screen') {
            app.flyTo({
              position: app.cameraPosition,
              controls: app.controlsTarget,
            });
        }
      },
      backFunction: () => {},
    },
    {
      name: "楼层管理",
      goFunction: () => {
        loaderFloorManage(window.app);
      },
      backFunction: () => {
        destroyControlsGroup(window.app, "floorText-3d");
        control.isShowFloorBack = false;
        control.roomTooltipStyle.show = false;
        if (control.curFloorModel && control.currentLayer !== "全楼") {
          control.currentLayer = "全楼";
          setModelLayer(
            window.app,
            control.curFloorModel,
            control.currentLayer,
            control.layerData,
            () => {
              setModelDefaultMaterial(window.app);
              control.curFloorModel = null;
            }
          );
        } else {
          setModelDefaultMaterial(window.app);
        }
      },
    },
    {
      name: "电力监测",
      goFunction: () => {
        loaderParkElectricity(window.app);
      },
      backFunction: () => {
        destroyParkElectricity(window.app);
      },
    },
    {
      name: "水力监测",
      goFunction: () => {
        loaderParkWater(window.app);
      },
      backFunction: () => {
        destroyParkWater(window.app);
      },
    },
  ],
  activeVar: 0,
  isShowFloorBack: false,
  currentLayer: "全楼",
  // 楼层层数
  layerData: [],
  // 楼层模型
  curFloorModel: null,
  activeFun(item, index) {
    control.activeVar = index;
  },
  backFloorBase() {
    control.isShowFloorBack = false;
    control.roomTooltipStyle.show = false;

    if (control.curFloorModel && control.currentLayer !== "全楼") {
      control.currentLayer = "全楼";
      setModelLayer(
        window.app,
        control.curFloorModel,
        control.currentLayer,
        control.layerData,
        () => {
          loaderFloorManage(window.app);
          setModelDefaultMaterial(window.app);
          control.curFloorModel = null;
        }
      );
    } else {
      loaderFloorManage(window.app);
      setModelDefaultMaterial(window.app);
    }
  },
  changeLayer(layer) {
    control.currentLayer = layer;
    setModelLayer(window.app, control.curFloorModel, layer, control.layerData);
  },
  // 控制roomTooltipStyle隐藏事件
  roomTooltipStyleShowEvent() {
    control.roomTooltipStyle.show = false;
    window.removeEventListener("mousedown", control.roomTooltipStyleShowEvent);
  },
});
onMounted(() => {
  EventBus.on("changeFloorUI", (obj) => {
    control.isShowFloorBack = obj.isShowFloorBack;
    control.curFloorModel = obj.model;
    const layerNames = obj.model.children
      .filter((item) => item.name.indexOf("F") > -1)
      .map((item) => item.name);
    control.layerData = [control.currentLayer].concat(layerNames);
  });
  EventBus.on("changeRoomTooltip", (obj) => {
    if (obj.name.indexOf("摄像头") > -1) {
      control.roomTooltipStyle = Object.assign(
        {
          楼栋: control.curFloorModel.name,
          楼层: control.currentLayer,
          摄像头: obj.name,
          视频: cameraUrls[obj.name.substr(0, 4)],
        },
        obj
      );
    } else {
      const roomName = obj.name.substr(0, 3);
      control.roomTooltipStyle = Object.assign(
        {
          楼栋: control.curFloorModel.name,
          楼层: control.currentLayer,
          房间号: roomName,
          度数: parkData[control.curFloorModel.name][control.currentLayer][
            roomName
          ][obj.type],
        },
        obj
      );
    }
  });
  EventBus.on("changeTooltip", (obj) => {
    control.roomTooltipStyle = obj;
  });
});
watch(
  () => control.activeVar,
  (newVal, oldVal) => {
    const oldControl = control.controls.filter(
      (item) => item.name === control.controls[oldVal]?.name
    );
    oldControl[0]?.backFunction();
    const newControl = control.controls.filter(
      (item) => item.name === control.controls[newVal].name
    );
    newControl[0].goFunction();
  },
  { deep: true, immediate: true }
);
watch(
  () => control.roomTooltipStyle,
  () => {
    //使标签在显示后再点击鼠标隐藏标签
    if (control.roomTooltipStyle.show) {
      setTimeout(() => {
        window.addEventListener("mousedown", control.roomTooltipStyleShowEvent);
      }, 100);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.back {
  width: 48px;
  position: fixed;
  bottom: 15%;
  left: 25%;
  z-index: 3;
  cursor: pointer;
  font-size: 18px;

  img {
    width: 100%;
  }

  p {
    color: #fff;
    text-align: center;
  }
}

.container form {
  display: flex;
  flex-wrap: wrap;
}

.container label {
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
}

.container label input {
  position: absolute;
  left: -9999px;
}

.container label input:checked + span {
  background-color: #414181;
  color: white;
}

.container label input:checked + span:before {
  box-shadow: inset 0 0 0 0.4375em #00005c;
}

.container label span {
  display: flex;
  align-items: center;
  padding: 0.375em 0.75em 0.375em 0.375em;
  border-radius: 99em;
  transition: 0.25s ease;
  color: #414181;
}

.container label span:hover {
  background-color: #d6d6e5;
}

.container label span:before {
  display: flex;
  flex-shrink: 0;
  content: "";
  background-color: #fff;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-right: 0.375em;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 0.125em #00005c;
}
</style>