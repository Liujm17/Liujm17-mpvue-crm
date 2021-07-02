<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group v-if="showDetail">
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
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="
          item.click == 'date'
            ? showDate(item)
            : item.click == 'provider'
            ? showProvider(item)
            : ''
        "
      >
      </van-field>
    </van-cell-group>

     <van-cell-group v-else>
      <van-field
        v-for="(item, index) in listData2"
        :key="index"
        v-model="formData2[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        :type="item.type"
        :autosize="item.type == 'textarea' ? true : false"
        :required="item.required"
        input-align="right"
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData2[item.name] = $event.mp.detail"
         @click="
          item.click == 'date'
            ? showDate(item)
            : item.click == 'provider'
            ? showProvider(item)
            : ''
        "
      >
      </van-field>
    </van-cell-group>

    <div class="polling-info">
      <div class="polling-title">付款类型</div>
      <RadioList
        :typeList="typeList"
        :active="active"
        @changeData="changeData"
      ></RadioList>
    </div>
     <!-- 收款信息 -->
    <div class="title">收款信息</div>
    <van-cell-group>
      <van-field v-model="payData.accountName"    @input="payData.accountName = $event.mp.detail" required input-align="right" label="账户" type="text" placeholder="请输入账户" />
      <van-field v-model="payData.bankName"    @input="payData.bankName = $event.mp.detail" required input-align="right" label="开户行" type="text" placeholder="请输入开户行" />
      <van-field v-model="payData.bankAccount"    @input="payData.bankAccount = $event.mp.detail" required input-align="right" label="银行账户" type="digit" placeholder="请输入银行账户" />
      <van-field v-model="payData.totalPrice"    @input="payData.totalPrice = $event.mp.detail" :readonly="showDetail?true:false" input-align="right" type="digit" label="合计付款金额" placeholder="0" />
    </van-cell-group>

   <!-- 供应商订单信息 -->
 <div class="title" v-if="showDetail">供应商订单信息</div>
   <div class="card-bg" v-if="showDetail">
    <div class="card" v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
      <div class="text" v-for="(label,index2) in item" :key="index2" :style="{color:index2 == 'title'?'black':'#888'}" v-show="index2 !== 'id'&&index2 !== 'orderId'&&index2 !== 'formId'">{{label}}</div>
    </div>
   </div>

 <!-- 供应商订单信息 ---产品列表-->
 <Purchase :paymentList='paymentList' v-if="showDetail"></Purchase>


  
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false" :deleteList='deleteList'></Accessroy>

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="active == 0?formData:formData2"
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
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import RadioList from "../../../components/radioButton.vue";
import Purchase from '../../../components/apply/PurchaseDetails.vue'
import { getFlowList, getByFlowId,getWaitPaymentList } from "../../../api/api";
export default {
  components: { Accessroy, Picker, Provider, Flow, User, RadioList,Purchase },
  data() {
    return {
      //显示采购详情，根据付款类型来判断
      showDetail:true,
      //供应商订单信息
      cardList:[],
      //付款明细
      paymentList:[],
      //类型
      active: 0,
      typeList: [
        { value: 1, text: "库存采购付款" },
        { value: 2, text: "现场采购付款" },
      ],
      //该页面字段方法数据
      data: data,
      uuid: "",
      //该页面数据名
      page: "payment",
      //表单列表
      listData: [],
      //表单值
      formData: {},
      //现场采购下的表单值
      listData2:[
          {
          name: 'userName',
          value: '付款申请人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'paymentDate',
          value: '付款日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
          {
          name: 'purpose',
          value: '用途',
          click: 'normal',
          type:'textarea',
          required:true,
          readonly:false
        },
      ],
      formData2:{
        userName:wx.getStorageSync('applyUserName'),
        paymentDate:'',
        purpose:''
      },
      //收款信息
      payData: {
        accountName:'',
        bankName:'',
        bankAccount:'',
        totalPrice:''
      },
       //附件列表
      photoList: [],
      //编辑中被删除的图片id列表
      deleteList:[],
      //需要上传的列表
      needList:[],
      //附件变化列表
      //附件列表上传索引
      valueIndex: 0,
      //日期选择器
      dateShow: false,
      clickName: "",
      show: false,
      radio: "1",
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
    this.uuid = data.get_uuid();
  },
  onReady() {
    this.getData();
  },
  watch: {
    'formData.supplierId':{
      handler(newVal,oldVal){
        if(newVal){
            this.cardList=[]
            let params={
                supplierId:newVal
            }
            getWaitPaymentList(params).then((res)=>{
              this.cardList.push({
                unpaidQuantity:'供应商未付清订单数:'+res.data.data.unpaidQuantity+'个',
                totalPrice:'总金额:'+res.data.data.totalPrice+'元',
                 unpaidPrice:'未付金额:'+res.data.data.unpaidPrice+'元',
                approvalPrice:'在途金额:'+res.data.data.approvalPrice+'元',
              })
              this.paymentList=res.data.data.unpaidPurchaseVoList.map((item)=>{
                    return{
                      id:item.id,
                      totalPrice:item.totalPrice,
                      unpaidPrice:item.unpaidPrice,
                      approvalPrice:item.approvalPrice,
                      paymentPrice:null,
                      purchaseDetailVoList:item.purchaseDetailVoList
                    }
              })
            })
        } 
      }
    },
    paymentList:{
        handler(newVal,oldVal){
          this.payData.totalPrice=Number(newVal.reduce((total,item)=>total+item.paymentPrice,0))
        },
        deep:true,
    },
    //监听图片列表，看有无新上传的
     photoList:{
       handler(newVal,oldVal){
        this.needList =data.sliceList(newVal.filter((item)=>!item.id))
       },
       deep:true
     },
     //监听图片列表，看有无把旧的图片删除的
     deleteList:{
        handler(newVal,oldVal){
        this.needList=data.sliceList(newVal)
       },
       deep:true
     }

  },
  methods: {
    //更换付款类型
    changeData(item, index) {
      //切换不清空收款信息
      // this.payData = {
      //   accountName:'',
      //   bankName:'',
      //   bankAccount:'',
      //   totalPrice:''
      // },
       this.active = index;
      if(item.text == '现场采购付款'){
       this.showDetail=false
      }else{
        this.showDetail=true
      }
    },
    //获取流程列表和列表数据
    getData() {
      let params={
          formId: this.$store.state.formId,
          id: this.$route.query.id,
       }
        //获取表单数据
      data['payment'].getData(params).then((res) => {
        const data=res.data.data
        if(data.paymentType == 1){
          this.formData={
            userName:wx.getStorageSync('applyUserName'),
            supplierId:data.supplierId,
            supplierName:data.supplierName,
            supplierContacts:data.supplierContacts,
            supplierPhone:data.supplierPhone,
            paymentDate:data.paymentDate,
          }
          this.payData={
             accountName:data.accountName,
             bankName:data.bankName,
             bankAccount:data.bankAccount,
             totalPrice:data.totalPrice
          }
          this.paymentList=data.purchasePaymentVoList
        }else{
            this.formData2={
             userName:wx.getStorageSync('applyUserName'),
             paymentDate:data.paymentDate,
              purpose:data.purpose
          }
          this.payData={
             accountName:data.accountName,
             bankName:data.bankName,
             bankAccount:data.bankAccount,
             totalPrice:data.totalPrice
          }
          this.paymentList=[]
        }
         this.photoList = data.fileList
          ? data.fileList.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
                id:item.id?item.id:''
              };
            })
          : [];
      });
      let params2 = {
        formId: this.$store.state.formId,
      };
      getFlowList(params2).then((res) => {
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
    //保存或发起
    save(val) {
      let purchasePaymentList =this.paymentList.map((item)=>{
        return{
          purchaseId:item.id,
          paymentPrice:item.paymentPrice
        }
      })
      let params ={}
       if(this.active == 0){
        params = {
        factoryId: 2020001,
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData,
        ...this.payData,
        purchasePaymentList,
        batchId: "",
        deleteIds:this.deleteList,
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        },
      };
       }else if(this.active == 1){
         params = {
        factoryId: 2020001,
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData2,
        ...this.payData,
        purchasePaymentList,
        deleteIds:this.deleteList,
        batchId: "",
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        },
      };
       }
     
      params.startFlowDto.type = val;
      params.paymentType=this.active+1
      if (this.needList.length > 0) {
        data.upLoadFile(this.needList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["payment"].saveOrStart(params).then((res) => {
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
          });
        });
      } else {
        data["payment"].saveOrStart(params).then((res) => {
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
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.show = false;
      this.usershow = false;
    },
    //日期确认
    submit2(val) {
      if(this.active == 0){
            this.formData[this.clickName] = val;
      //这个的时候他不需要id值 只需要name，value为undifined
      // this.formData[this.clickValue] = val;
      this.dateShow = false;
      }else if(this.active == 1){
          this.formData2[this.clickName] = val;
      //这个的时候他不需要id值 只需要name，value为undifined
      // this.formData[this.clickValue] = val;
      this.dateShow = false;
      }
   
    },
    //供应商确认
    submit(val) {
      this.$set(this.formData, "supplierId", val.id);
      this.$set(this.formData, "supplierName", val.name);
      this.show = false;
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

<style lang="scss" scoped>
@import "../../../style/list.scss";
</style>
<style lang="scss" scoped>
.allbg {
  margin-bottom: 150px;
}
.polling-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 15px;
  box-sizing: border-box;
}
.polling-text {
  margin-top: 20px;
}
.polling-info2 {
  margin-top: 20px;
  .polling-title2 {
    font-weight: 500;
  }
}
.card-bg {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    width: 95%;
    line-height: 40px;
    border: 1px solid #aaa;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    // float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .text{
      width: 50%;
      text-align: center;
    }
  }
}
</style>