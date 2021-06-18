<template>
  <div>
    <div class="table">
      <div class="header">
        <div v-for="(item, index) in title" :key="index" class="title">
          {{ item }}
        </div>
      </div>
      <div class="content" v-for="(item, index) in content" :key="index">
        <div class="title">{{ item.name }}</div>
        <div class="title">{{ item.size }}</div>
        <div class="title">
          <van-stepper
            v-model="item.num"
            :disabled="disabled"
            @change="content[index].num = $event.mp.detail"
          />
        </div>
      </div>
    </div>
    <div></div>
    <div></div>
    <BottomButton :btList="btList" @clickBt="clickBt"></BottomButton>
  </div>
</template>
<script>
import BottomButton from "../../../components/bottomButton";
export default {
  data() {
    return {
      title: ["产品名称", "规格型号", "数量"],
      content: [
        { name: "1", size: "5", num: 6 },
        { name: "2", size: "4", num: 7 },
        { name: "3", size: "3", num: 9 },
      ],
      btList: [{ name: "保存", click: "save",color:"blue" }],
      disabled: false,
    };
  },
  components: { BottomButton },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "当前页面",
    });
  },
  onShow() {},
  methods: {
    onChange(val) {
      console.log(val);
    },
    //底部按钮点击事件，跳转到具体的点击事件
    clickBt(val) {
      this[val]();
    },
    save() {
      console.log(this.content);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}
</style>

