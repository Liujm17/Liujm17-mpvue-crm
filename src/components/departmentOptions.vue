<template>
  <div class="options-bg">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
    
      <van-tab title="部门">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in deptList"
            :key="index"
          >
            <div class="name">{{ item.name }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
     <BottomButton :btList='btList'  @clickBt='clickBt'></BottomButton>
  </div>
</template>
<script>
import BottomButton from './bottomButton'
import {  getDeptOptions } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      radio: "1",
      radio2: "59",
      deptList: [],
       btList:[{name:'取消',click:'cancel'},{name:'确定',click:'submit',color:'blue'}]
    };
  },
    components: {BottomButton},
  onReady() {
    this.getData();
     this.radio=this.$route.query.userId
  },
  methods: {
     clickBt(val){
     this[val]()
    },
    //获取数据
    getData() {
     
      let params2 = {
        name: this.value,
      };
      getDeptOptions(params2).then((res) => {
        this.deptList = res.data.data.map((item) => {
          return {
            id: item.id + "",
            name: item.name,
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
     submit() {
      var value = {
        name: this.deptList.filter((item) => item.id == this.radio)[0].name,
        id: this.radio,
      };

      this.$emit("submit", value);
    },
  },
};
</script>
<style lang="scss">
.options-bg{
    position: absolute;
  top: 0;
  right: 0;
  bottom: 30px;
  left: 0;
  overflow: auto;
  padding-bottom: 60px;
}
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
