<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" />
    <van-tabs :active="active" @change="change">
      <van-tab title="已提交">
        <Card :cardList="cardList"></Card>
      </van-tab>
      <van-tab title="已审批">
         <Card :cardList="cardList2"></Card>
      </van-tab>
      <van-tab title="待审批"> 
          <Card :cardList="cardList2"></Card>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Card from "../../components/card";
import { getHistory, getFlowTask } from "../../api/api";
export default {
  data() {
    return {
      value: "",
      cardList: [],
      cardList2:[],
      active: 0,
    };
  },
  components: { Card },
  mounted() {
    this.getData();
  },
  onPullDownRefresh() {
    //doing something
    mpvue.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
    //stop doing
    wx.stopPullDownRefresh();
  },
  methods: {
     change(name) {
      if(name.mp.detail.title == '已审批'){
        this.getTask(1)
      }else if(name.mp.detail.title == '待审批'){
         this.getTask(0)
      }
    },
    getData() {
      let params = {
        pageNum: 1,
        pageSize: 999,
        applyUserId: 1,
        month: "",
        formId: 1,
      };
      //已经提交的
      getHistory(params).then((res) => {
        this.cardList = res.data.data.list
          .filter((item) => item.approveStatus !== -1)
          .map((item) => {
            return {
              title: "备用金申请",
              money: "申请金额为:" + item.money,
              remark: "备注:" + item.remark,
              status:
                item.approveStatus == -1
                  ? "未提交"
                  : item.approveStatus == 0
                  ? "审批中"
                  : item.approveStatus == 1
                  ? "已结束"
                  : "起始状态",
            };
          });
      });
    },
    //已经审批和待审批
    getTask(status){
      let params2 = {
        approverUserId: 1,
        pageNum: 1,
        pageSize: 9999,
        status: status,
      };
      getFlowTask(params2).then((res) => {
         mpvue.showToast({
          title: '正在加载',
          icon: "loading",
          duration: 500,
          mask: true,
        });
        this.cardList2=res.data.data.list.map((item)=>{
          return {
             id: item.id?item.id:'',
            orderId:item.orderId?item.orderId:'',
            title:'申请类型:'+item.orderTitle,
            user:'申请人:'+item.startUserName
          }
        })
      });
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
