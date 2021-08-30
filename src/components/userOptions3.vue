<template>
  <div class="user-bg">
    <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch" />
    <van-tabs :active="active">
      <van-tab title="用户">
        <van-radio-group v-model="radio" @change="radioChange1">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in UserList"
            :key="index"
            @click="test"
          >
            <div class="name">{{ item.name }}</div>
            <div class="post">维修师傅</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
    <BottomButton :btList="btList" @clickBt="clickBt" />
  </div>
</template>
<script>
import BottomButton from "./bottomButton";
import { getRepairByFactoryId } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      UserList: [],
      btList: [
        { name: "取消", click: "cancel" },
        { name: "确定", click: "submit", color: "blue" },
      ],
    };
  },
  props: {
    radio: {
      type: String,
      default: "1",
    },
  },
  components: { BottomButton },
  onLoad() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      let params = {
        pageNum: 1,
        pageSize: 999,
        stationId:3,
        searchValues: this.value,
      };
      getRepairByFactoryId(params).then((res) => {
        this.UserList = res.data.data.map((item) => {
          return {
            name: item.name,
            stationName: item.stationName,
            id: item.id + "",
          };
        });
      });
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange1(val) {
      this.radio = val.mp.detail;
    },
    //mpvue的更改选择
    // radioChange2(val) {
    //   this.radio2 = val.mp.detail;
    // },
    //自定义底部按钮
    clickBt(val) {
      this[val]();
    },
    cancel() {
      this.$emit("cancel");
    },
    submit() {
      var value = {
        name: this.UserList.filter((item) => item.id == this.radio)[0].name,
        id: this.radio,
      };

      this.$emit("submit", value);
    },
  },
};
</script>
<style lang="scss">
.van-radio {
  margin-top: 0.2rem !important;
  margin-left: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}
</style>
<style lang="scss" scoped>
.select {
  font-size: 0.3rem;
  .post {
    color: #777;
  }
}
.user-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 30px;
  left: 0;
  overflow: auto;
  padding-bottom: 60px;
}
.bottom-bt {
  z-index: 1000;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
