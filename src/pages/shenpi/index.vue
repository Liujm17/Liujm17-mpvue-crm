<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" />
    <van-tabs :active="active" @change="change">
      <van-tab title="待审批">
        <Card
          :cardList="cardList2"
          v-if="cardList2.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
      <van-tab title="已审批">
        <Card
          :cardList="cardList2"
          v-if="cardList2.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
      </van-tab>
      <van-tab title="已提交">
        <Card
          :cardList="cardList"
          v-if="cardList.length > 0"
          @toDetail="toDetail"
        ></Card>
        <div class="empty-text" v-else>暂无记录</div>
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
      cardList2: [],
      active: 0,
      nowSatus: 0,
    };
  },
  components: { Card },
  mounted() {
    this.getTask(0);
  },
  onPullDownRefresh() {
    //doing something
    mpvue.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
    this.getTask(this.nowSatus);
    //stop doing
    wx.stopPullDownRefresh();
  },
  methods: {
    change(name) {
      if (name.mp.detail.title == "已审批") {
        this.nowSatus = name.mp.detail.index;
        this.getTask(name.mp.detail.index);
      } else if (name.mp.detail.title == "待审批") {
        this.getTask(name.mp.detail.index);
        this.nowSatus = name.mp.detail.index;
      } else {
        this.getTask(2);
        this.nowSatus = name.mp.detail.index;
      }
    },
    //已经审批和待审批
    getTask(status) {
      let params2 = {
        approverUserId: mpvue.getStorageSync("UserId"),
        pageNum: 1,
        pageSize: 9999,
        status: status,
      };
      getFlowTask(params2).then((res) => {
        mpvue.showToast({
          title: "正在加载",
          icon: "loading",
          duration: 500,
          mask: true,
        });
        if (status < 2) {
          this.cardList2 = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle,
              user: "申请人:" + item.startUserName,
              status:
                item.orderStatus === 0
                  ? "审批中"
                  : item.orderStatus === 1
                  ? "已结束"
                  : "已驳回",
            };
          });
        } else {
          this.cardList = res.data.data.list.map((item) => {
            return {
              id: item.dataId ? item.dataId : "",
              orderId: item.orderId ? item.orderId : "",
              formId: item.formId ? item.formId : "",
              title: "申请类型:" + item.orderTitle,
              user: "申请人:" + item.startUserName,
              status:
                item.orderStatus == 0
                  ? "审批中"
                  : item.orderStatus == 1
                  ? "已结束"
                  : "已驳回",
            };
          });
        }
      });
    },
    //历史记录的详情
    toDetail(val) {
      if (this.nowSatus == 0) {
        this.$router.push({
          path: "/pages/applyForCashDetail/main",
          query: {
            id: val.id,
            orderId: val.orderId,
            formId: val.formId,
            data: "applyCash",
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1
                ? "已审批"
                : "待审批",
          },
        });
      } else {
        this.$router.push({
          path: "/pages/applyForCashDetail/main",
          query: {
            id: val.id,
            formId: val.formId,
            data: "applyCash",
            type:
              this.nowSatus == 2
                ? "已提交"
                : this.nowSatus == 1
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
