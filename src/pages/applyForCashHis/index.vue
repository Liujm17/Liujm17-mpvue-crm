<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <Card
      :cardList="cardList"
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
    };
  },
  components: { Card },
  mounted() {
    this.getData();
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
        path: "/pages/applyForCash/main",
        query: "1",
      });
    },
    //获取数据
    getData() {
      let params = {
        pageNum: 1,
        pageSize: 999,
        applyUserId: mpvue.getStorageSync("UserId"),
        month: this.value,
        formId: this.$store.state.formId,
      };
      getHistory(params).then((res) => {
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
                ? "已结束"
                : "起始状态",
          };
        });
      });
    },
    //历史记录的详情
    toDetail(val) {
      this.$router.push({
        path: "/pages/applyForCashDetail/main",
        query: {
          id: val.id,
          formId:this.$store.state.formId,
          data: "applyCash",
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
