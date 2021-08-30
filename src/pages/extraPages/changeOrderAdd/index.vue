<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-for="(item, index) in listData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :type="item.type"
        :autosize="item.type == 'textarea' ? true : false"
        :required="item.required"
        input-align="right"
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      >
      </van-field>
    </van-cell-group>



     <!-- 关联产品 -->
        <div class="title">变更前采购产品  金额:{{agoTotalPrice}}</div>
        <div class="table">
          <div class="table-header">
            <div
              v-for="(item, index) in agotitle"
              :key="index"
              class="header-title"
            >
              {{ item }}
            </div>
          </div>
          <div
            class="table-content"
            v-for="(item, index) in agocontent"
            :key="index"
          >
            <div class="content-title">{{ item.name }}</div>
            <div class="content-title">{{ item.specs }}</div>
            <div class="content-title">{{ item.unitPrice }}</div>
            <div class="content-title">{{ item.purchaseQuantity }}</div>
            <div class="content-title">{{ item.totalPrice }}</div>
          </div>
        </div>

    <!-- 变更产品 -->
    <div class="title">变更后采购产品  金额{{totalPrice}}</div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.specs }}</div>
        <div class="content-title">
          <van-stepper
            v-model="item.unitPrice"
            @change="content[index].unitPrice = $event.mp.detail"
            min="0"
          />
        </div>
        <div class="content-title">
          <van-stepper
            v-model="item.purchaseQuantity"
            @change="content[index].purchaseQuantity = $event.mp.detail"
             min="0"
          />
        </div>
        <div class="content-title">
          {{item.totalPrice?item.totalPrice:0}}
        </div>
      </div>
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="submit2"
    ></Picker>
    <!-- 供应商弹出层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <Provider @submit="submit" :radio="radio" @cancel="onClose"></Provider>
    </van-popup>

    <!-- 采购产品弹出层 -->
    <van-popup
      :show="show2"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <Product @submit="submit3" :radio="radio2" @cancel="onClose"></Product>
    </van-popup>

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
import data from "../../../api/mockData";
import Accessroy from "../../../components/apply/accessory";
// import BottomButton from "../../../components/bottomButton";
import Picker from "../../../components/utils/picker.vue";
import Provider from "../../../components/providerOptions.vue";
import Product from "../../../components/productOptions.vue";
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import { getFlowList, getByFlowId,getChangeList } from "../../../api/api";
export default {
  components: { Accessroy, Picker, Provider, Product, Flow, User },
  data() {
    return {
      //采购清单
      title: ["产品名称", "规格型号", "单价", "数量", "总金额(元)"],
      agotitle: ["产品名称", "规格型号", "单价", "数量", "总金额(元)"],
      content: [],
      agocontent:[],
      agoTotalPrice:0,
      totalPrice:0,
      //采购清单list
      purchaseDetailList: [],
      //该页面字段方法数据
      data: data,
      uuid:'',
      //该页面数据名
      page: "changeOrder",
      //表单列表
      listData: [],
      //表单值
      formData: {},
      //附件列表
      photoList: [],
      //附件列表上传索引
      valueIndex: 0,
      //日期选择器
      dateShow: false,
      clickName: "",
      show: false,
      show2: false,
      radio: "1",
      radio2: "1",
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
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
     this.uuid= data.get_uuid()
  },
  onReady() {
    this.getData();
      wx.setNavigationBarTitle({
          title: '采购订单变更-新增'+'('+wx.getStorageSync("factoryName")+')',
        });
  },
  watch:{
       content: {
      handler(newValue, oldValue) {
       newValue.forEach((item)=>{
         item.totalPrice=item.unitPrice*item.purchaseQuantity
       })
       this.totalPrice=newValue.reduce((total,item)=>total+item.unitPrice*item.purchaseQuantity,0)
       this.purchaseDetailList=newValue.map((item)=>{
         return{
           productId:item.id,
           newUnitPrice:item.unitPrice,
           newPurchaseQuantity:item.purchaseQuantity,
           newTotalPrice:item.totalPrice
         }
       })
      },
        //首次监听
      //  immediate: true,
       //深度监听
      deep: true,
    },
  },
  methods: {
    //获取流程列表
    getData() {
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
      let params2={
        type:3
      }
      getChangeList(params2).then((res)=>{
          var filterData=res.data.data.filter((item)=>item.id==this.$route.query.id)[0]
          this.formData={
            userName: wx.getStorageSync("applyUserName"),
            supplierId:filterData.supplierId,
            supplierName:filterData.supplierName,
            supplierContacts:filterData.supplierContacts,
            supplierPhone:filterData.supplierPhone,
            purchaseDate:filterData.purchaseDate,
            purpose:filterData.purpose
          }
          this.agoTotalPrice=filterData.totalPrice
          this.agocontent=filterData.purchaseDetailVoList.map((item)=>{
         return{
            id: item.productId,
            name: item.productName,
            specs: item.specs,
            purchaseQuantity: item.purchaseQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
         }
       })
        this.content=filterData.purchaseDetailVoList.map((item)=>{
         return{
            id: item.productId,
            name: item.productName,
            specs: item.specs,
            purchaseQuantity: item.purchaseQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
         }
       })
      })
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
    //保存或发起
    save(val) {
      let params = {
         factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        //采购单id
        purchaseId:this.$route.query.id,
        ...this.formData,
        newTotalPrice:this.totalPrice,
        purchaseChangeDetailList:this.purchaseDetailList,
        batchId: "",
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        },
      };
      params.startFlowDto.type = val;
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
           //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["changeOrder"].saveOrStart(params).then((res) => {
              if(res.data.code == 10000){
              wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.go(2);
            }
          });
        });
      } else {
        data["changeOrder"].saveOrStart(params).then((res) => {
             if(res.data.code == 10000){
              wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.go(2);
            }
        });
      }
    },
    showDate(val) {
      if (!this.$route.name.includes("Detail")) {
        this.dateShow = true;
        this.clickName = val.name;
        // this.clickValue = val.clickValue;
      } else {
        return;
      }
    },
    //显示供应商列表弹窗
    showProvider(val) {
      this.show = true;
    },
    //产品弹窗
    addProduct() {
      this.show2 = true;
    },
    //流程弹窗
    showPopup2(val) {
      this.usershow = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.userradio = val.userId + "";
    },
    //mpvue的更改选择，异步，更改流程列表
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getByFlowId();
    },
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.show = false;
      this.show2 = false;
      this.usershow = false;
    },
    //日期确认
    submit2(val) {
      this.formData[this.clickName] = val;
      //这个的时候他不需要id值 只需要name，value为undifined
      // this.formData[this.clickValue] = val;
      this.dateShow = false;
    },
    //供应商确认
    submit(val) {
      this.$set(this.formData, "supplierId", val.id);
      this.$set(this.formData, "supplierName", val.name);
      this.show = false;
    },
    //产品确认
    submit3(val) {
      this.show2 = false;
      this.content.push(val);
    },
    //删除产品列表对应产品
    delList(val) {
      this.content.splice(val, 1);
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
  },
};
</script>

<style scoped>
@import "../../../style/list.scss";
</style>