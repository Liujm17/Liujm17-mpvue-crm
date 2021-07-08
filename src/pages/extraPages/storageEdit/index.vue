<template>
  <div class="allbg">
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div class="title">盘点信息</div>
        <van-cell-group>
          <van-field
            v-for="(item, index) in listData"
            :key="index"
            v-model="formData[item.name]"
            :name="item.value"
            :label="item.value"
            :placeholder="item.click == 'radioGroup' ? '' : item.value"
            :type="item.type"
            :autosize="item.type == 'textarea' ? true : false"
            :required="item.required"
            input-align="right"
            readonly
            :rules="[{ required: true, message: '请填写' + item.value }]"
            @input="formData[item.name] = $event.mp.detail"
          ></van-field>
        </van-cell-group>


   <!-- 盘点表 -->
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
        
    
      </van-tab>
      <van-tab title="日志">
        <div class="header">
          <div v-for="(item, index) in hisTitle" :key="index" class="title">{{ item }}</div>
        </div>
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>
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
import { stockDetail,getFlowList, getByFlowId ,editStockCheck} from "../../../api/api";
import Card from "../../../components/card.vue";
import data from '../../../api/mockData'
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
export default {
  components: { Card,Flow ,User },
  data() {
    return {
       data,
      active: 0,
      HistoryList: [],
       title: ["产品名称", "规格型号", "账面数量","实盘数量","盈亏数量"],
      content:[],
      //采购清单list
      purchaseDetailList: [],
      //表单列表
      listData: [
        {
          name: "userName",
          value: "盘点人",
          click: "normal",
          type: "",
          required: true,
          readonly: true,
        },
        {
          name: "checkDate",
          value: "盘点时间",
          click: "normal",
          type: "",
          required: true,
          readonly: true,
        },
      ],
      //表单值
      formData: {
        userName: "",
        checkDate: "",
      },
      orderId: "",
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
    };
  },
  onShow() {
    this.getData();
     wx.setNavigationBarTitle({
          title: '库存盘点-编辑'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
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
    //切换标签页面
    change(name) {
      if (name.mp.detail.title == "日志") {
        let params = {
          orderId: this.orderId,
        };
        data.getHistory(params).then((res) => {
          mpvue.showToast({
            title: "正在加载",
            icon: "loading",
            duration: 500,
            mask: true,
          });
          this.HistoryList = res;
        });
      }
    },
    //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      stockDetail(params).then((res)=>{
        this.formData={
          userName:res.data.data.userName,
          checkDate:res.data.data.checkDate,
        }
      this.content=res.data.data.stockCheckDetailVoList.map((item)=>{
           return{
             productId:item.productId,
             productName:item.productName,
             specs:item.specs,
             bookQuantity:item.bookQuantity,
             checkQuantity:item.checkQuantity,
             lossQuantity:item.lossQuantity
           }
         })
      })
    },

    //保存
    save(val) {
      let params={
        id:this.$route.query.id,
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
      editStockCheck(params).then((res)=>{
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

<style scoped lang="scss">
@import "../../../style/list.scss";
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
