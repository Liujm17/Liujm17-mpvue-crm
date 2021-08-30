<template>
  <div class="bottom-bt">
    <div
      class="bt-item"
      v-for="(item,index) in btList"
      :key="index"
      @click="clickBt(item.click?item.click:'')"
      :style="{color:item.color?item.color:''}"
    >{{item.name}}</div>
  </div>
</template>

<script>
export default {
  props: {
    btList: {
      type: Array,
      default: [],
    },
    zIndex: {
      type: Number,
      default: 10000,
    },
  },
  methods: {
    clickBt(val) {
      this.$emit("clickBt", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom-bt {
  z-index: 10000!important;
  width: 100%;
  display: flex;
  height: 40px;
  position: fixed;
  bottom: 60px;
  left: 0;
  .bt-item {
    flex: 1;
    height: 100%;
    background-color: white;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>