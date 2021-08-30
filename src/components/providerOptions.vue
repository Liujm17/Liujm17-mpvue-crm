<template>
  <div class="options-bg">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
    
      <van-tab title="供应商">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in ProviderList"
            :key="index"
          >
            <div class="name">{{ item.name }}</div>
             <div class="name">{{ item.contacts }}({{item.phone}})</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
     <BottomButton :btList='btList' @clickBt='clickBt'></BottomButton>
  </div>
</template>
<script>
import BottomButton from './bottomButton'
import {  getProviderOptions } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      radio: "",
      radio2: "59",
      ProviderList: [],
       btList:[{name:'取消',click:'cancel'},{name:'确定',click:'submit',color:'blue'}]
    };
  },
    components: {BottomButton},
  onReady() {
    this.getData();
  },
  methods: {
     clickBt(val){
     this[val]()
    },
    //获取数据
    getData() {
     let params = {
        pageNum: 1,
        pageSize: 999,
        searchValues: this.value,
      };
      getProviderOptions(params).then((res) => {
        this.ProviderList = res.data.data.list.map((item) => {
          return {
            id: item.id + "",
            name: item.name,
            phone:item.phone,
            contacts:item.contacts
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
        name: this.ProviderList.filter((item) => item.id == this.radio)[0].name,
        id: this.radio,
        phone: this.ProviderList.filter((item) => item.id == this.radio)[0].phone,
         contacts: this.ProviderList.filter((item) => item.id == this.radio)[0].contacts,
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
