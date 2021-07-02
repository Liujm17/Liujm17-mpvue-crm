<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
    
      <van-tab title="项目">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in deptList"
            :key="index"
          >
            <div class="name">{{ item.factoryName }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
     <BottomButton :btList='btList'  @clickBt='clickBt'></BottomButton>
  </div>
</template>
<script>
import BottomButton from './bottomButton'
import {  getProjects } from "../api/api";
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
  mounted() {
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
     submit() {
      var value = {
        factoryName: this.deptList.filter((item) => item.id == this.radio)[0].factoryName,
        id: this.radio,
      };

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
</style>
