<template>
  <div>
    <Search
      :value="value"
      @onSearch="onSearch"
      :placeholder="placeholder"
    ></Search>
    <RadioButton
      :active="active"
      :typeList="typeList"
      @changeData="changeData"
    ></RadioButton>
    <Card
      :cardList="cardList"
      :more="more"
      @toDetail="toDetail"
      v-if="cardList.length > 0"
    ></Card>
    <div class="empty-text" v-else>暂无记录</div>
    <BottomButton :btList="btList" @clickBt="clickBt"></BottomButton>
  </div>
</template>
<script>
import RadioButton from "../../../components/radioButton";
import Card from "../../../components/card";
import Search from "../../../components/searchView";
import BottomButton from "../../../components/bottomButton.vue";
import data from "../../../api/mockData";
import {getDeviceByQrCode} from '../../../api/api'
export default {
  data() {
    return {
      value: "",
      placeholder: "",
      cardList: [],
      more: true,
      total: 0,
      pageSize: 10,
      addButton: true,
      filterInfo: "",
      data: data,
      typeList: [],
      active: 0,
      activeValue: "",
      //底部按钮群
      btList: [
        { name: "开始扫码巡检", click: "send", color: "gray" },
        { name: "历史巡检记录", click: "history", color: "blue" },
      ],
    };
  },
  components: { Card, Search, RadioButton, BottomButton },
    //下拉刷新
  onPullDownRefresh() {
    //doing something
    mpvue.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
    this.getData(this.activeValue);
    //stop doing
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if (this.pageSize <= this.total) {
      this.pageSize += 10;
      this.getData(this.activeValue);
    } else {
      this.more = false;
    }
  },
  onShow() {
    this.value = "";
    //获取对应的页面信息在store里
    this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    //对应的类型数组赋值
    this.typeList = data[this.filterInfo.data].typeList;
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
          title: '巡检记录'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  methods: {
    changeData(item, index) {
      this.active = index;
      this.activeValue = item.value;
      this.getData(item.value);
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData(this.activeValue);
    },
    //新增
    onSubmit() {
      this.$router.push({
        path: this.filterInfo.addpage,
        query: {
          data: this.filterInfo.data,
        },
      });
    },
    //获取数据
    getData(value = "") {
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        applyUserId: mpvue.getStorageSync("UserId"),
        searchValues: this.value,
        formId: this.$store.state.formId,
        deviceId: this.$route.query.deviceId ? this.$route.query.deviceId : "",
      };
      this.$set(params, data[this.filterInfo.data].keyword, value);
      data[this.filterInfo.data].getRecord(params).then((res) => {
        this.total = res.length;
        this.cardList = res;
      });
    },
    //历史记录的详情
    toDetail(val) {
      this.$router.push({
        path: this.filterInfo.detailpage,
        query: {
          id: val.id,
        },
      });
    },
    //自定义底部按钮
    clickBt(val) {
      this[val]();
    },
    //扫码
    send() {
      // 允许从相机和相册扫码
      wx.scanCode({
        success:(res) =>{
         this.$router.push({
           path:'/pages/extraPages/pollingAdd/main',
           query:{
              qrCode:res.result
           }
         })
        },
      });
    },
    history() {
       this.$router.push({
         path: this.filterInfo.addpage
       })
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
</style>
