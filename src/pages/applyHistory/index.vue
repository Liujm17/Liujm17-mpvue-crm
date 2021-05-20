<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入所属期"
      @search="onSearch"
    />
    <Card
      :cardList="cardList"
      :more="more"
      @toDetail="toDetail"
      v-if="cardList.length > 0"
    ></Card>
    <div class="empty-text" v-else>暂无记录</div>
    <van-goods-action>
      <van-goods-action-button
        color="#be99ff"
        type="info"
        text="新增"
        @click="onSubmit"
        v-if="addButton"
      />
    </van-goods-action>
  </div>
</template>
<script>
import Card from "../../components/card";
import { getHistory } from "../../api/api";
export default {
  data() {
    return {
      value: "",
      cardList: [],
      more:true,
      total:0,
      pageSize:10,
      addButton:true
    };
  },
  components: { Card },
  onShow() {
    this.$store.commit("changeForm",parseInt(this.$route.query.formId) );
     this.addButton=this.$store.state.permissions.includes('Imprest:Add')
    this.getData();
  },
    //下拉刷新
  onPullDownRefresh() {
    //doing something
    mpvue.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
   this.getData();
    //stop doing
    wx.stopPullDownRefresh();
  },
    // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if(this.pageSize<this.total){
    this.pageSize+=10
    this.getData();
    }else{
      this.more=false
    }
  },
  methods: {
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //新增
    onSubmit() {
      this.$router.push({
        path: "/pages/applyAdd/main",
        query: {
             data: this.$store.state.allData.filter((item)=>item.formId==this.$store.state.formId)[0].data,
        },
      });
    },
    //获取数据
    getData() {
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        applyUserId: mpvue.getStorageSync("UserId"),
        month: this.value,
        formId: this.$store.state.formId,
      };
      getHistory(params).then((res) => {
        this.total=res.data.data.total
        this.cardList = res.data.data.list.map((item) => {
          return {
            id: item.id,
            orderId: item.orderId ? item.orderId : "",
            title: "备用金申请",
            money: "申请金额为:" + item.money,
            remark: "备注:" + item.remark,
            status:
              item.approveStatus == -1
                ? "未提交"
                : item.approveStatus == 0
                ? "审批中"
                : item.approveStatus == 1
                ? "已通过"
                : "起始状态",
          };
        });
      });
    },
    //历史记录的详情
    toDetail(val) {
      this.$router.push({
          path: `/pages/${this.$store.state.allData.filter((item)=>item.formId== this.$store.state.formId)[0].page}/main`,
        query: {
          id: val.id,
          orderId:val.orderId,
          formId: this.$store.state.formId,
          data: this.$store.state.allData.filter((item)=>item.formId== this.$store.state.formId)[0].data,
          type: "历史",
        },
      });
    },
  },
};
</script>
<style lang="scss">
.van-submit-bar__button {
  width: 100% !important;
}
.empty-text {
  text-align: center;
  margin-top: 2rem;
  font: 24px "隶书";
  color: #84af9b;
}
</style>
