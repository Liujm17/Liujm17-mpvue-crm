<template>
  <div>
    <van-tabs :active="active0" @change="change0">
      <van-tab :title="'审批' + listLength" :active="active0">
        <!-- <Search :value='value'></Search> -->
        <van-tabs :active="active" @change="change">
          <van-tab :title="'待审批' + listLength">
            <Card :cardList="cardList2" :more="more" v-if="cardList2.length > 0" @toDetail="toDetail"></Card>
            <div class="empty-text" v-else>暂无记录</div>
          </van-tab>
          <van-tab title="已审批">
            <Card :cardList="cardList2" :more="more" v-if="cardList2.length > 0" @toDetail="toDetail"></Card>
            <div class="empty-text" v-else>暂无记录</div>
          </van-tab>
          <van-tab title="已提交">
            <Card :cardList="cardList" :more="more" v-if="cardList.length > 0" @toDetail="toDetail"></Card>
            <div class="empty-text" v-else>暂无记录</div>
          </van-tab>
          <van-tab title="抄送">
            <Card :cardList="cardList" :more="more" v-if="cardList.length > 0" @toDetail="toDetail"></Card>
            <div class="empty-text" v-else>暂无记录</div>
          </van-tab>
        </van-tabs>
      </van-tab>
      <van-tab :title="'报修' + listLength2">
        <Card :cardList="cardList3" @toDetail="toDetail2"></Card>
            <!-- <div class="empty-text" v-else>暂无记录</div> -->
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Card from "../../components/boxCard.vue";
import Search from '../../components/searchView'
import { getFlowTask, getCount,getReportWait,getReportCount } from "../../api/api";
import data from '../../api/mockData'
export default {
  data() {
    return {
      value: "",
      cardList: [],
      cardList2: [],
      cardList3:[],
      active0:0,
      active: 0,
      nowSatus: 0,
      listLength: 0,
      listLength2: 0,
      pageSize: 10,
      total: 0,
      more: true
    };
  },
  components: { Card, Search },
  //当点击tab页面切换时候的生命周期
  // onTabItemTap(item) {
  //   this.getTask(0);
  // },
  //页面显示生命周期
  onShow() {
    if (this.$route.query.formId) {
      let value = {
        id: this.this.$route.query.id,
        formId: this.$route.query.formId,
        orderId: this.$route.query.orderId
      }
      this.active = this.$store.state.active;
      this.getTask(this.$store.state.active).then(() => this.getCount().then(() => this.toDetail(value)));
    } else {
      this.active = this.$store.state.active;
      this.getTask(this.$store.state.active).then(() => this.getCount());
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    //doing something
    wx.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
    this.getTask(this.nowSatus).then(() => this.getCount());
    //stop doing
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if (this.pageSize <= this.total) {
      this.pageSize += 10
      this.getTask(this.nowSatus);
    } else {
      this.more = false
    }
  },
  methods: {
    //获取待办数
    async getCount() {
      let params = {
        approverUserId: wx.getStorageSync("UserId"),
        status: 0,
      };
      await getCount(params).then((res) => {
        this.listLength = res.data.data
       let num = 0
        num+=res.data.data
        getReportCount().then((res2) => {
          num+=res2.data.data
          this.listLength2=res2.data.data
          if (num > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: num+ "",
          });
        } else {
          wx.removeTabBarBadge({
            index: 2,
          });
        }
        })
      });
    },
    //切换tab
    change(name) {
      this.pageSize = 10
      this.getTask(name.mp.detail.index).then(() => this.getCount());
      this.nowSatus = name.mp.detail.index;
    },
    change0(name){
        if(name.mp.detail.index==0){
            this.getTask(this.nowSatus).then(() => this.getCount());
        }else if(name.mp.detail.index==1){
             this.getTask2().then(() => this.getCount());
        }
    },
    async getTask2(){
       let params = {
        factoryId:wx.getStorageSync('factoryId'),
        pageNum: 1,
        pageSize: 99999,
      };
      getReportWait(params).then((res)=>{
         this.cardList3=res.data.data.list.map((item)=>{
           return{
             id:item.id,
             reportUserName:'报修人:'+item.reportUserName,
             createTime:'报修时间:'+item.createTime,
             deviceName:'报修设备:'+(item.deviceName?item.deviceName:''),
             faultReason:'故障原因:'+item.faultReason
           }
         })
       })
    },
    //已经审批和待审批
    async getTask(status) {
      let params2 = {
        approverUserId: wx.getStorageSync("UserId"),
        pageNum: 1,
        pageSize: this.pageSize,
        status: status,
      };
      await getFlowTask(params2).then((res) => {
        wx.showToast({
          title: "正在加载",
          icon: "loading",
          duration: 300,
          mask: true,
        });
        if (status < 2) {
          this.total = res.data.data.total;
          this.cardList2 = res.data.data.list.map((item) => {

            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle + '(' + item.dataId + ')',
              user: "申请人:" + item.startUserName,
              startTime: '发起时间:' + item.startTime,
              fieldInfoVos: item.fieldInfoVos
            };
          });
        } else if (status == 2) {
          this.total = res.data.data.total;
          this.cardList = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle + '(' + item.dataId + ')',
              user: "申请人:" + item.startUserName,
              startTime: '发起时间:' + item.startTime,
              fieldInfoVos: item.fieldInfoVos
            };
          });
        } else if (status == 3) {
          this.total = res.data.data.total;
          this.cardList = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle + '(' + item.dataId + ')',
              user: "申请人:" + item.startUserName,
              startTime: '发起时间:' + item.startTime,
              fieldInfoVos: item.fieldInfoVos
            };
          });
        }
      });
    },
    //报修详情
    toDetail2(val){
        this.$router.push({
          path:'/pages/extraPages/breakdownDetail/main',
          query:{
            id: val.id,
            type: "历史",
          }
        })
    },
    //历史记录的详情
    toDetail(val) {
      this.$store.commit('changeForm', val.formId)
      this.$store.commit("changeActive", this.nowSatus);
      if (this.nowSatus == 0) {
        this.$router.push({
          path: `${this.$store.state.allData.filter((item) => item.formId == val.formId)[0].detailpage}`,
          query: {
            id: val.id,
            orderId: val.orderId,
            formId: val.formId,
            data: this.$store.state.allData.filter((item) => item.formId == val.formId)[0].data,
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1 || this.nowSatus == 3
                  ? "已审批"
                  : "待审批",
          },
        });
      } else {
        this.$router.push({
          path: `${this.$store.state.allData.filter((item) => item.formId == val.formId)[0].detailpage}`,
          query: {
            id: val.id,
            formId: val.formId,
            orderId: val.orderId,
            data: this.$store.state.allData.filter((item) => item.formId == val.formId)[0].data,
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1 || this.nowSatus == 3
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
