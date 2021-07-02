<template>
  <div>
    <div style="width:100%;height:10px"></div>
    <RadioButton :active="active" :typeList="typeList" @changeData="changeData"></RadioButton>
    <div style="width:100%;height:10px"></div>
    <Card :cardList="cardList" :more="more" @toDetail="toDetail" v-if="cardList.length > 0"></Card>
  </div>
</template>

<script>
import Card from "../../../components/card";
import RadioButton from '../../../components/radioButton.vue'
import {stockList} from '../../../api/api'
export default {
  components: { Card,RadioButton },
  data() {
    return {
      cardList: [],
      more: false,
      active: 0,
      activeValue:'',
      //历史tab栏
      typeList: [
        { value: "", text: "全部" },
        { value: -1, text: "草稿" },
        { value: 0, text: "审批中" },
        { value: 1, text: "已结束" },
        { value: 2, text: "已驳回" },
      ],
    };
  },
  onShow(){
    //获取数据
    this.getData(this.activeValue);
  },
  methods: {
     //历史记录的详情
    toDetail(val) {
      this.$router.push({
        path: '/pages/extraPages/storageDetail/main',
        query: {
          id: val.id,
          formId: this.$store.state.formId,
          type: "历史",
        },
      });
    },
     changeData(item,index){
      this.active=index
      this.activeValue=item.value
      this.getData(item.value)
    },
    //获取数据
    getData(value ='') {
       wx.showLoading({
      title: '正在加载数据',
    });
      let params = {
        pageNum: 1,
        pageSize: 9999999,
        approveStatus:value
      };
      stockList(params).then((res)=>{
        this.cardList=res.data.data.list.map((item,index)=>{
          return{
            id:item.id,
            index:index+1,
            name:item.userName,
            time:item.checkDate
          }
        })
         wx.hideLoading();
      })
    },
  },
};
</script>

<style>
</style>