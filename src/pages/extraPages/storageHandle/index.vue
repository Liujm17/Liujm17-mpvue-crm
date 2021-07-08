<template>
  <div>
    <div class="table">
      <div class="header">
        <div v-for="(item, index) in title" :key="index" class="title">
          {{ item }}
        </div>
      </div>
      <div class="content" v-for="(item, index) in content" :key="index">
        <div class="title">{{ item.productName }}</div>
        <div class="title">{{ item.specs }}</div>
        <div class="title">{{ item.bookQuantity }}</div>
        <div class="title">
          <van-stepper
            v-model="item.checkQuantity"
            :disabled="disabled"
            @change="content[index].checkQuantity = $event.mp.detail"
            min="0"
          />
        </div>
        <div class="title">{{ item.lossQuantity }}</div>
      </div>
    </div>
    <!-- 空白区域 -->
    <div style="width:100%;height:20px"></div>
      <!-- 流程//流程必有用户弹出层 -->
    <Flow
      :flowStatus="flowStatus"
      :flowId="flowId"
      :flowList="flowList"
      :fitNodeList="fitNodeList"
      @showPopup2="showPopup2"
      @radioChange="radioChange"
    ></Flow>


      <!-- 用户弹出层 -->
    <van-popup
      :show="usershow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="usersubmit" :radio="userradio" @cancel="onClose"></User>
    </van-popup>
    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存草稿" @click="save(0)" />
      <van-goods-action-button
        type="primary"
        text="保存提交"
        @click="save(1)"
      />
    </van-goods-action>
  </div>
</template>
<script>
import {getOutProductIOptions,addStockCheck,getFlowList, getByFlowId } from '../../../api/api';
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
export default {
  data() {
    return {
      title: ["产品名称", "规格型号", "账面数量","实盘数量","盈亏数量"],
      content: [],
      disabled: false,
       //流程
      flowId: "",
      flowList: [],
      fitNodeList: [],
      flowStatus: "流程数:0",
      popUpType: "",
      nodeId: "",
      //流程中的用户弹窗
      usershow: false,
      userradio: "1",
      //盘点清单list
      purchaseDetailList: [],
    };
  },
  components: { Flow ,User},
  onLoad() {
   
  },
  onReady() {
    this.getData()
    this.getData2()
     wx.setNavigationBarTitle({
          title: '库存盘点-盘点'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch:{
       content:{
         handler(newVal,oldVal){
           newVal.forEach((item)=>{
           item.lossQuantity=(item.checkQuantity-item.bookQuantity).toFixed(2)
           })
           this.purchaseDetailList=newVal.map((item)=>{
            return{
           productId:item.productId,
           bookQuantity:item.bookQuantity,
           checkQuantity:item.checkQuantity,
           lossQuantity:item.lossQuantity
         }
       })
         },
         deep:true
       }
  },
  methods: {
      //获取流程列表
    getData2() {
      let params = {
        formId: this.$store.state.formId,
      };
      getFlowList(params).then((res) => {
        if (res.data.data.length >= 1) {
          this.flowStatus = "流程数:" + res.data.data.length;
          this.flowList = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.flowName,
            };
          });
          this.flowId = res.data.data[0].id + "";
          this.getByFlowId();
        } else if (res.data.data.length == 0) {
          console.log("bukeyi");
        }
      });
    },
    //根据流程id查询节点
    getByFlowId() {
      let params = {
        flowId: this.flowId,
      };
      //设置流程列表
      getByFlowId(params).then((res) => {
        this.fitNodeList = res.data.data.map((item) => {
          return {
            ...item,
          };
        });
      });
    },
     //获取数据
    getData(){
      let params={
        searchValues:''
      }
       getOutProductIOptions(params).then((res)=>{
         this.content=res.data.data.map((item)=>{
           return{
             productId:item.productId,
             productName:item.productName,
             specs:item.specs,
             bookQuantity:item.stockQuantity,
             checkQuantity:item.stockQuantity,
             lossQuantity:0
           }
         })
       })
    },
    //流程相关方法
     //流程弹窗
    showPopup2(val) {
      this.show = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.userradio = val.userId + "";
    },
     //mpvue的更改选择，异步，更改流程列表
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.$route.query = {};
      this.getByFlowId();
    },
      //流程选用户后的确认事件
    usersubmit(val) {
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userName",
        val.name
      );
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userId",
        val.id
      );
      this.usershow = false;
    },
     //关闭弹窗
    onClose() {
      this.usershow = false;
    },
    //保存
    save(val) {
      let params={
        factoryId: wx.getStorageSync("factoryId"),
        userId: wx.getStorageSync("UserId"),
        stockCheckDetailList:this.purchaseDetailList,
        startFlowDto:{
           optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        }
      }
      params.startFlowDto.type = val;
      addStockCheck(params).then((res)=>{
         if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.back();
            }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}

</style>
<style>
.van-stepper__input {
  width: 90%!important;
}
</style>

