<template>
  <div class="bg">
    <div class="card" v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
      <div
        class="text"
        v-for="(label,index2) in item"
        :key="index2"
        :style="{color:item.color?item.color:''}"
        v-show="index2 !== 'id'&&index2 !== 'orderId'&&index2 !== 'color'&&index2 !== 'fieldInfoVos'&&index2 !== 'formId'"
      >{{label}}</div>
      <div
        class="text"
        v-for="(label2,index22) in item.fieldInfoVos"
        :key="index22"
        :style="{color:index22 == 'title'?'black':'#888'}"
        v-show="index22 !== 'id'&&index22 !== 'orderId'&&index22 !== 'formId'"
      >{{label2.name?label2.name:''}}{{label2.name&&label2.value?':':''}}{{label2.value?label2.value:''}}</div>
    </div>
    <div v-show="more" class="moretext">下拉加载</div>
    <div v-show="!more" class="moretext">没有更多了</div>
    <div style="width:100%;height:8rem"></div>
  </div>
</template>

<script>
export default {
  props: {
    cardList: {
      type: Array,
      default: [],
    },
    more: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    toDetail(val) {
      this.$emit("toDetail", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    width: 95%;
    line-height: 40px;
    border: 1px solid #aaa;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    box-shadow: inset 0 0 10px #ccc;
    // float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .text {
      min-width: 50%;
      text-align: left;
    }
  }
}
</style>
