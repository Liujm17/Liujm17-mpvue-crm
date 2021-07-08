<template>
  <div>
    <Search :value="value" @onSearch="onSearch" :placeholder='placeholder' @submit='searchSubmit'></Search>
    <RadioButton :active="active" :typeList='typeList' @changeData="changeData"></RadioButton>
    <Card
      :cardList="cardList"
      :more="more"
      @toDetail="toDetail"
      v-if="cardList.length > 0"
    ></Card>
    <div class="empty-text" v-else>暂无记录</div>
    <van-goods-action>
      <van-goods-action-button
        type="info"
        text="新增"
        @click="onSubmit"
        v-if="addButton"
      />
    </van-goods-action>
  </div>
</template>
<script>
import RadioButton from '../../components/radioButton'
import Card from "../../components/card";
import Search from "../../components/searchView";
import data from "../../api/mockData";
export default {
  data() {
    return {
      value: "",
      placeholder:'',
      cardList: [],
      more: true,
      total: 0,
      pageSize: 10,
      addButton: true,
      filterInfo: "",
      data: data,
      typeList:[],
      active:0,
      activeValue:'',
      //时间筛选
      classification:''
    };
  },
  components: { Card, Search,RadioButton},
  onShow() {
    this.value=''
    //获取对应的页面信息在store里
    this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    //对应的类型数组赋值
    this.typeList=data[this.filterInfo.data].typeList?data[this.filterInfo.data].typeList:[]
    //对应搜索默认值
    this.placeholder=data[this.filterInfo.data].searchValues
    //储存表单id
    this.$store.commit("changeForm", parseInt(this.$route.query.formId));
    //判断新增按钮显隐
    this.addButton = this.$store.state.permissions.includes(
      this.filterInfo.add
    );
    //获取数据
    this.getData(this.activeValue);
      wx.setNavigationBarTitle({
          title: '信息列表'+'('+wx.getStorageSync("factoryName")+')',
        });
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
  methods: {
    changeData(item,index){
      this.active=index
      this.activeValue=item.value
      this.getData(item.value)
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData(this.activeValue);
    },
    //筛选过滤确定
    searchSubmit(val){
      this.classification=val
     this.getData()
    },
    //新增
    onSubmit() {
      this.$router.push({
        path:this.filterInfo.addpage,
        query: {
          data: this.filterInfo.data,
        },
      });
    },
    //获取数据
    getData(value ='') {
       wx.showLoading({
      title: '正在加载数据',
    });
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        applyUserId: mpvue.getStorageSync("UserId"),
        searchValues: this.value,
        formId: this.$store.state.formId,
        deviceId:this.$route.query.deviceId?this.$route.query.deviceId:'',
        classification:this.classification
      };
        this.$set(params, data[this.filterInfo.data].keyword , value);
      data[this.filterInfo.data].getRecord(params).then((res) => {
        this.total = res.length;
        this.cardList = res;
        this.classification=''
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
.top-button{
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
.radio-bg:nth-child(3){
  margin-top:10px
}
.text:nth-child(2){
       flex: 0.25!important;
      flex-wrap: wrap!important;
      text-align: center!important;
    }
</style>
