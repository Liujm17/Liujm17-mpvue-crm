<template>
  <div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">{{ item }}</div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.size }}</div>
        <div class="content-title">{{item.num}}</div>
      </div>
    </div>
    <BottomButton :btList="btList" @clickBt="clickBt"></BottomButton>
  </div>
</template>
<script>
import BottomButton from "../../../components/bottomButton";
import {getOutProductIOptions} from '../../../api/api';
export default {
  data() {
    return {
      title: ["产品名称", "规格型号", "数量"],
      content: [
      ],
      btList: [
        { name: "盘点", click: "check", color: "blue" },
        { name: "历史", click: "histroy" },
      ],
      disabled: true,
    };
  },
  components: { BottomButton },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "当前页面",
    });
  },
  onShow() {
    this.getData()
  },
  methods: {
    //获取数据
    getData(){
      let params={
        searchValues:''
      }
       getOutProductIOptions(params).then((res)=>{
         this.content=res.data.data.map((item)=>{
           return{
             name:item.productName,
             size:item.specs,
             num:item.stockQuantity
           }
         })
       })
    },
    //底部按钮点击事件，跳转到具体的点击事件
    clickBt(val) {
      this[val]();
    },
    check() {
      this.$router.push("/pages/extraPages/storageHandle/main");
    },
    histroy() {
      this.$router.push("/pages/extraPages/storageHis/main");
    },
    save() {
      console.log(this.content);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .table-header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .header-title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .table-content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .content-title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}
</style>

