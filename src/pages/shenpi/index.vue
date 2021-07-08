<template>
  <div>
    <Search :value='value'></Search>
    <van-tabs :active="active" @change="change">
      <van-tab :title="'待审批' + listLength">
        <Card
          :cardList="cardList2"
          :more="more"
          v-if="cardList2.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
      <van-tab title="已审批">
        <Card
          :cardList="cardList2"
           :more="more"
          v-if="cardList2.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
      <van-tab title="已提交">
        <Card
          :cardList="cardList"
           :more="more"
          v-if="cardList.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
       <van-tab title="抄送">
        <Card
          :cardList="cardList"
           :more="more"
          v-if="cardList.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Card from "../../components/boxCard.vue";
import Search from '../../components/searchView'
import { getFlowTask, getCount } from "../../api/api";
export default {
  data() {
    return {
      value: "",
      cardList: [],
      cardList2: [],
      active: 0,
      nowSatus: 0,
      listLength: 0,
      pageSize:10,
      total:0,
      more:true
    };
  },
  components: { Card,Search },
  //当点击tab页面切换时候的生命周期
  // onTabItemTap(item) {
  //   this.getTask(0);
  // },
  //页面显示生命周期
  onShow() {
    this.active = this.$store.state.active;
    this.getTask(this.$store.state.active);
    this.getCount();
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
    this.getTask(this.nowSatus);
       this.getCount();
    //stop doing
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if(this.pageSize<=this.total){
    this.pageSize+=10
    this.getTask(this.nowSatus);
    }else{
      this.more=false
    }
  },
  methods: {
    //获取待办数
    getCount() {
      let params = {
        approverUserId: mpvue.getStorageSync("UserId"),
        status: 0,
      };
      getCount(params).then((res) => {
        this.listLength=res.data.data
        wx.setTabBarBadge({
          index: 1,
          text: res.data.data + "",
        });
      });
    },
    //切换tab
    change(name) {
      this.pageSize=10
      this.getTask(name.mp.detail.index);
      this.nowSatus = name.mp.detail.index;
    },
    //已经审批和待审批
    getTask(status) {
      let params2 = {
        approverUserId: mpvue.getStorageSync("UserId"),
        pageNum:1,
        pageSize:this.pageSize,
        status: status,
      };
      getFlowTask(params2).then((res) => {
        mpvue.showToast({
          title: "正在加载",
          icon: "loading",
          duration: 300,
          mask: true,
        });
        if (status < 2) {
          this.total=res.data.data.total;
          this.cardList2 = res.data.data.list.map((item) => {
             
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle+'(单号'+item.dataId+')',
              user: "申请人:" + item.startUserName,
              fieldInfoVos:item.fieldInfoVos
            };
          });
        } else if(status == 2){
            this.total=res.data.data.total;
          this.cardList = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle+'(单号'+item.dataId+')',
              user: "申请人:" + item.startUserName,
               fieldInfoVos:item.fieldInfoVos
            };
          });
        }else if(status == 3){
            this.total=res.data.data.total;
          this.cardList = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle+'(单号'+item.dataId+')',
              user: "申请人:" + item.startUserName,
               fieldInfoVos:item.fieldInfoVos
            };
          });
        }
      });
    },
    //历史记录的详情
    toDetail(val) {
       this.$store.commit('changeForm',val.formId)
      this.$store.commit("changeActive", this.nowSatus);
      if (this.nowSatus == 0) {
        this.$router.push({
          path: `${this.$store.state.allData.filter((item)=>item.formId==val.formId)[0].detailpage}`,
          query: {
            id: val.id,
            orderId: val.orderId,
            formId: val.formId,
            data: this.$store.state.allData.filter((item)=>item.formId==val.formId)[0].data,
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1 ||this.nowSatus == 3
                ? "已审批"
                : "待审批",
          },
        });
      } else {
        this.$router.push({
          path: `${this.$store.state.allData.filter((item)=>item.formId==val.formId)[0].detailpage}`,
          query: {
            id: val.id,
            formId: val.formId,
            orderId: val.orderId,
            data: this.$store.state.allData.filter((item)=>item.formId==val.formId)[0].data,
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1 ||this.nowSatus == 3
                ? "已审批"
                : "待审批",
          },
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-text {
  text-align: center;
  margin-top: 2rem;
  font: 24px "隶书";
  color: #84af9b;
}
</style>
