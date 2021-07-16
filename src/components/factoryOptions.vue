<template>
  <div class="fac-bg">
    <!-- <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch" />
    <van-tabs :active="active">
      <van-tab title="项目">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio class="select" :name="item.id" v-for="(item, index) in deptList" :key="index">
            <div class="name">{{ item.factoryName }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>-->

    <div class="fac-box">
      <div
        class="fac-box-item"
        v-for="(item, index) in deptList"
        :key="index"
        @click="submit(item)"
        :style="{backgroundColor:factoryId==item.id?'rgb(0,191,255)':''}"
      >{{ item.factoryName }}</div>
    </div>
    <div class="fac-cancel" @click="cancel">收起</div>
    <!-- <BottomButton :btList='btList'  @clickBt='clickBt' /> -->
  </div>
</template>
<script>
import BottomButton from "./bottomButton";
import { getProjects } from "../api/api";
export default {
  components: { BottomButton },
  data() {
    return {
      active: 0,
      value: "",
      deptList: [],
      btList: [
        { name: "取消", click: "cancel" },
        { name: "确定", click: "submit", color: "blue" },
      ],
    };
  },
  props: {
    factoryId: {
      type: String,
      default: "",
    },
  },
  onLoad() {
    this.getData();
  },
  methods: {
    clickBt(val) {
      this[val]();
    },
    //获取数据
    getData() {
      let params2 = {
        name: this.value,
      };
      getProjects(params2).then((res) => {
        this.deptList = res.data.data.map((item) => {
          return {
            id: item.id + "",
            factoryName: item.factoryName,
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
    radioChange(val) {
      this.radio = val.mp.detail;
    },
    cancel() {
      this.$emit("cancel");
    },
    submit(item) {
      var value = {
        factoryName: item.factoryName,
        id: item.id,
      };
      this.factoryId=item.id
      this.$emit("submit", value);
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
.fac-bg {
  width: 100%;
  height: 100%;
  .fac-box {
    width: 100%;
    height: 90%;
    overflow-y: auto;
    background: #242f42;
    .fac-box-item {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
  }
  .fac-cancel {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ff4d4d;
  }
}
</style>
