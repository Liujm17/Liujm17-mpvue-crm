<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
      <van-tab title="产品">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in radioList"
            :key="index"
          >
            <div class="name">{{ item.name }}</div>
            <div class="name">{{ item.specs }}</div>
             <div class="name">未入库数量:{{ item.waitInQuantity }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
    <BottomButton :btList="btList" @clickBt="clickBt"></BottomButton>
  </div>
</template>
<script>
import BottomButton from "./bottomButton";
import { getProductItemOptions } from "../api/api";
export default {
  props: {
    radioList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      active: 0,
      value: "",
      radio: "1",
      btList: [
        { name: "取消", click: "cancel" },
        { name: "确定", click: "submit", color: "blue" },
      ],
    };
  },
  components: { BottomButton },
  mounted() {
    // this.getData();
    // console.log(this.$route)
  },
  methods: {
    clickBt(val) {
      this[val]();
    },
  
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange(val) {
      this.radio = val.mp.detail;
    },
    cancel() {
      this.$emit("cancel");
    },
    submit() {
      var value = {
        id: this.radio,
        name: this.radioList.filter((item) => item.id == this.radio)[0].name,
        specs: this.radioList.filter((item) => item.id == this.radio)[0].specs,
         productId: this.radioList.filter((item) => item.id == this.radio)[0].productId,
        inQuantity: this.radioList.filter((item) => item.id == this.radio)[0].inQuantity,
         waitInQuantity: this.radioList.filter((item) => item.id == this.radio)[0].waitInQuantity,
      };

      this.$emit("submit",value);
    },
  },
};
</script>
<style lang="scss">
.select {
  font-size: 0.3rem;
  .name {
  }
  .post {
    color: #777;
  }
}
.van-radio {
  margin-top: 0.2rem !important;
  margin-left: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}
</style>
