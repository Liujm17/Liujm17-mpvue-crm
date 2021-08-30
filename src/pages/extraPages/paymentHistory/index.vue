<template>
  <div>
    <Search :value="value" @onSearch="onSearch" :placeholder='placeholder' @submit='searchSubmit'></Search>
    <RadioButton :active="active" :typeList='typeList' @changeData="changeData"></RadioButton>
    <RadioButton :active="active2" :typeList='typeList2' @changeData="changeData2"></RadioButton>
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
import RadioButton from '../../../components/radioButton'
import Card from "../../../components/boxCard";
import Search from "../../../components/searchView";
import data from "../../../api/mockData";
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
      typeList2:[],
      active:0,
      active2:0,
      activeValue:'',
      activeValue2:1,
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
     this.typeList2=data[this.filterInfo.data].typeList2?data[this.filterInfo.data].typeList2:[]
    //对应搜索默认值
    this.placeholder=data[this.filterInfo.data].searchValues
    //储存表单id
    this.$store.commit("changeForm", parseInt(this.$route.query.formId));
    //判断新增按钮显隐
    this.addButton = this.$store.state.permissions.includes(
      this.filterInfo.add
    );
    //获取数据
    this.getData(this.activeValue,this.activeValue2);
     wx.setNavigationBarTitle({
          title: '付款申请-历史记录'+'('+wx.getStorageSync("factoryName")+')',
      });
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
    this.getData(this.activeValue,this.activeValue2);
    //stop doing
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom: function () {
    //执行上拉执行的功能
    if (this.pageSize <= this.total) {
      this.pageSize += 10;
      this.getData(this.activeValue,this.activeValue2);
    } else {
      this.more = false;
    }
  },
  methods: {
    changeData(item,index){
      this.active=index
      this.activeValue=item.value
      this.getData(this.activeValue,this.activeValue2);
    },
     changeData2(item,index){
      this.active2=index
      this.activeValue2=item.value
       this.getData(this.activeValue,this.activeValue2);
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData(this.activeValue,this.activeValue2);
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
    getData(value ='',value2 =1) {
       wx.showLoading({
      title: '正在加载数据',
    });
      let params = {
        pageNum: 1,
        pageSize: this.pageSize,
        applyUserId: wx.getStorageSync("UserId"),
        searchValues: this.value,
        formId: this.$store.state.formId,
        classification:this.classification
      };
        this.$set(params, data[this.filterInfo.data].keyword , value);
        this.$set(params, 'paymentType' , value2);
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
</style>
