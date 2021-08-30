<template>
  <div>
    <Search :value="value" @onSearch="onSearch" :placeholder="placeholder" @submit="searchSubmit"></Search>
    <RadioButton :active="active" :typeList="typeList" @changeData="changeData"></RadioButton>
    <Card :cardList="cardList" :more="more" @toDetail="toDetail" v-if="cardList.length > 0"></Card>
    <div class="empty-text" v-else>暂无记录</div>
    <van-goods-action>
      <van-goods-action-button type="info" text="新增" @click="onSubmit" v-if="addButton" />
    </van-goods-action>
  </div>
</template>
<script>
import RadioButton from "../../components/radioButton";
import Card from "../../components/boxCard";
import Search from "../../components/searchView";
import data from "../../api/mockData";
export default {
  data() {
    return {
      value: "",
      placeholder: "",
      cardList: [],
      more: true,
      total: 0,
      pageNum: 1,
      max: "",
      min: "",
      pageSize: 15,
      addButton: true,
      filterInfo: "",
      data: data,
      typeList: [],
      active: 0,
      activeValue: "",
      //时间筛选
      classification: "",
      keyword: "",
      params: {},
    };
  },
  components: { Card, Search, RadioButton },
  onShow() {
    this.cardList = [];
    this.pageNum = 1;
    this.value = "";
    //获取对应的页面信息在store里
    this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    //对应的类型数组赋值
    this.typeList = data[this.filterInfo.data].typeList
      ? data[this.filterInfo.data].typeList
      : [];
    //对应搜索默认值
    this.placeholder = data[this.filterInfo.data].searchValues;
    //储存表单id
    this.$store.commit("changeForm", parseInt(this.$route.query.formId));
    //判断新增按钮显隐
    this.addButton = this.$store.state.permissions.includes(
      this.filterInfo.add
    );
    //获取数据
    this.getData(this.activeValue);
    wx.setNavigationBarTitle({
      title: "信息列表" + "(" + wx.getStorageSync("factoryName") + ")",
    });
    //设置状态关键词
    this.keyword = data[this.filterInfo.data].keyword;
  },
  onUnload() {
    this.active = 0;
    this.activeValue = "";
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
    this.pageNum = 1;
    this.cardList = [];
    this.getData(this.activeValue);
    //stop doing
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if (this.more) {
      this.pageNum++;
      this.getData(this.activeValue);
    }
  },
  methods: {
    //输入框失去焦点触发
    // blur(){
    //   console.log(this.pageNum)
    // },
    changeData(item, index) {
       this.pageNum=1
      this.cardList = [];
      this.active = index;
      this.activeValue = item.value;
      this.getData(item.value);
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.cardList = [];
      this.getData(this.activeValue);
    },
    //筛选过滤确定
    searchSubmit(val) {
      this.classification = val;
      this.getData();
    },
    //新增
    onSubmit() {
      this.$router.push({
        path: this.filterInfo.addpage,
        query: {
          data: "",
        },
      });
    },
    //获取数据
    getData(value = "") {
      wx.showLoading({
        title: "正在加载数据",
      });
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applyUserId: wx.getStorageSync("UserId"),
        searchValues: this.value,
        formId: this.$store.state.formId,
        deviceId: this.$route.query.deviceId ? this.$route.query.deviceId : "",
        classification: this.classification,
      };
      this.$set(params, data[this.filterInfo.data].keyword, value);
      data[this.filterInfo.data].getRecord(params).then((res) => {
        if (res.length > 0) {
          if (res.length < 15) {
             this.total = res.length;
            res.forEach((element) => {
              this.cardList.push(element);
            });
            this.classification = "";
               this.more = false;
          } else {
            this.total = res.length;
            res.forEach((element) => {
              this.cardList.push(element);
            });
            this.classification = "";
            this.more = true;
          }
        } else {
          this.pageNum -= 1;
          this.more = false;
        }
        wx.hideLoading();
      });
    },
    //历史记录的详情
    toDetail(val) {
      this.$router.push({
        path: this.filterInfo.detailpage,
        query: {
          id: val.id,
          orderId: val.orderId,
          formId: this.$store.state.formId,
          data: this.filterInfo.data,
          type: "历史",
        },
      });
    },
  },
};
</script>
<style lang="scss">
.top-button {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.van-submit-bar__button {
  width: 100% !important;
}
.empty-text {
  text-align: center;
  margin-top: 2rem;
  font: 24px "隶书";
  color: #84af9b;
}
.radio-bg:nth-child(3) {
  margin-top: 10px;
}
// .text:nth-child(2) {
//   flex: 0.25 !important;
//   flex-wrap: wrap !important;
//   text-align: center !important;
// }
.pageChange {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
