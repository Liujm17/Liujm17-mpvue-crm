<template>
  <movable-area class="movable-area">
    <movable-view :class="show1?'movable-view':'movable-view2'" direction="all" inertia @change="change">
        <div class="movable-hide" @click="showDetail"></div>
        <div class="movable-content" v-if="show">
          <div class="content-item" @click="send">扫码巡检</div>
          <div class="content-item" @click="openPrj">切换项目</div>
          <div class="content-item2">{{title3}}</div>
        </div>
    </movable-view>
  </movable-area>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      show1: true,
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight,
    };
  },
  props: {
    title3: {
      type: String,
      default: "",
    },
  },
  methods: {
    showDetail() {
      this.show = !this.show;
    },
    send() {
      this.$emit("send");
      this.show=false
    },
    openPrj() {
      this.$emit("openPrj");
    },
    //监听按钮所在位置，更换内容朝向
    change(e) {
      if (e.y >= this.height / 2) {
        this.show1 = false;
      } else {
        this.show1 = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.movable-area {
  pointer-events: none; // 这个属性设置为none,让所有事件穿透过去
  z-index: 10000;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.movable-view {
  pointer-events: auto; // 重设为auto,覆盖父属性设置
  height: 50px;
  width: 50px;
  background: url("../../../static/images/menu.png") no-repeat;
  background-size: 100% 100%;
}

.movable-hide {
  height: 50px;
  width: 50px;
}
.movable-content {
  background: #ffdead;
}
.content-item {
  border: 1px solid black;
  text-align: center;
}
.content-item2 {
  border: 1px solid black;
  text-align: center;
  background: white;
}
.movable-view2 {
  pointer-events: auto; // 重设为auto,覆盖父属性设置
  height: 50px;
  width: 50px;
  background: url("../../../static/images/menu.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row-reverse;
   flex-wrap: wrap-reverse;
}
</style>

