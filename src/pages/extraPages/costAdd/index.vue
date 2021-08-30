<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-model="formData.userName"
        label="申请人"
        required
        readonly
        input-align="right"
        @input="formData.userName = $event.mp.detail"
      />
      <van-field
        v-model="formData.isPay"
        label="是否已付款"
        required
        readonly
        input-align="right"
        @input="formData.isPay = $event.mp.detail"
      >
        <RadioButton :typeList="radioList1" :active="active1" @changeData="changeData1"></RadioButton>
      </van-field>
      <van-field
        v-model="formData.month"
        label="费用所属期"
        placeholder="请选择费用所属期"
        required
        readonly
        input-align="right"
        @input="formData.month = $event.mp.detail"
        @click="showDate"
      />
    </van-cell-group>
    <div class="polling-text">
      <van-field
        v-model="formData.accountName"
        placeholder="请填写账户"
        label="账户"
        required
        input-align="right"
        @input="formData.accountName = $event.mp.detail"
        v-if="active1==0"
      />
      <van-field
        v-model="formData.bankName"
        placeholder="请填写开户行"
        label="开户行"
        required
        input-align="right"
        @input="formData.bankName = $event.mp.detail"
         v-if="active1==0"
      />
      <van-field
        v-model="formData.bankAccount"
        placeholder="请填写银行账号"
        label="银行账号"
        required
        type="digit"
        input-align="right"
        @input="formData.bankAccount = $event.mp.detail"
         v-if="active1==0"
      />
      <van-field
        v-model="formData.totalPrice"
        label="合计付款金额"
        required
        readonly
         type="digit"
        input-align="right"
        @input="formData.totalPrice = $event.mp.detail"
      />
    </div>
    <div style="width:100%;height:20px"></div>
    <!-- 费用明细列表 -->
     <div style="padding:10px;box-sizing:border-box" v-for="(item,index) in content" :key="index" >
        <div class="title" style="display:flex;align-items:center;justify-content:space-between"><span>费用报销单明细({{index+1}})</span><span style="color:red;font-size:20px" @click="delList(index)">删除</span></div>
      <van-cell-group>
      <van-field
        v-model="item.purpose"
        placeholder="请填写费用用途"
        label="费用用途"
        required
        input-align="right"
        @input="item.purpose = $event.mp.detail"
      />
       <van-field
        label="费用类别"
        required
        input-align="right"
      >
        <div style="display:flex;flex-wrap:nowrap;align-items:center" class="radio-bg" slot="button">
        <van-button :type="item.active == index2?'info':'default'" size="small" v-for="(item2,index2) in radioList2" :key="index2" @click="changeData2(item2,index2,index)">{{item2.text}}</van-button>
        </div>
      </van-field>
       <van-field
        v-model="item.money"
        placeholder="请填写报销金额"
        label="报销金额"
        type="digit"
        required
        input-align="right"
        @input="item.money = $event.mp.detail"
      />
       <van-field
        v-model="item.remark"
        placeholder="请填写备注"
        label="备注"
        required
        input-align="right"
        @input="item.remark = $event.mp.detail"
      />

    </van-cell-group>
     </div>
  
   <div class="table-add">
      <van-button round plain hairline type="info" @click="addProduct"
        >添加明细</van-button
      >
    </div>

    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>
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

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="submit2"
      :showDay="showDay"
    ></Picker>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存草稿" @click="save(0)" />
      <van-goods-action-button type="primary" text="保存提交" @click="save(1)" />
    </van-goods-action>
  </div>
</template>

<script>
import Accessroy from "../../../components/apply/accessory";
import data from "../../../api/mockData";
import RadioButton from "../../../components/radioButton.vue";
import { getFlowList, getByFlowId,getCostType } from "../../../api/api";
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import Picker from "../../../components/utils/picker.vue";
export default {
  components: { Accessroy, Flow, User, Picker, RadioButton },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      formData: {
        userId: "",
        isPay: "",
        userName: "",
        month: "",
        accountName: "",
        bankName: "",
        bankAccount: "",
        totalPrice: "",
      },
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},
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

      //日期
      dateShow: false,
      showDay: false,
      clickName: "",
      //是否付款
      radioList1: [
        { text: "否", value: 0 },
        { text: "是", value: 1 },
      ],
      active1: 0,
      //费用报销类别
      radioList2:[],
      active2:0,
      //费用报销明细
      content:[{money:'',remark:'',purpose:'',type:1,active:0}]
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
  onReady() {
    this.formData.userName = wx.getStorageSync("applyUserName");
    this.formData.userId = wx.getStorageSync("UserId");
    this.getData2();
    this.getType()
    this.getUserInfo()
     wx.setNavigationBarTitle({
          title: '费用报销-新增'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
    content: {
      handler(newValue, oldValue) {
       this.formData.totalPrice=newValue.reduce((total,item)=>total+item.money*1,0)
      },
        //首次监听
      //  immediate: true,
       //深度监听
      deep: true,
    },
  },
  methods: {
    //获取费用类型
    getType(){
       let params={
         type:1
       }
       getCostType(params).then((res)=>{
         this.radioList2=res.data.data.map((item)=>{
           return {
             value:item.optionValue,
             text:item.optionText
           }
         })
       })
    },
    //获取员工信息
    getUserInfo(){
         let params={
           id: wx.getStorageSync("UserId"),
         }
         data['staff'].getData(params).then((res)=>{
           this.formData.bankName=res.data.data.bankName
           this.formData.accountName=res.data.data.name
           this.formData.bankAccount=res.data.data.bankAccount
         })
    },
    //添加明细
    addProduct(){
      this.content.push({money:'',remark:'',purpose:'',type:1,active:0})
    },
    ///删除费用列表对应
    delList(val) {
      this.content.splice(val, 1);
    },
    //是否按钮群点击更换高亮事件
    changeData1(item, index) {
      this.active1 = index;
    },
     //费用报销按钮群点击更换高亮事件
    changeData2(item2, index2,index) {
     this.content[index].active=index2
     this.content[index].type=index2+1
    },
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
      this.usershow = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.userradio = val.userId + "";
    },
    //mpvue的更改选择，异步，更改流程列表
    radioChange(val) {
      this.flowId = val.mp.detail;
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
      this.dateShow = false;
    },

    //日期选择
    //显示日期
    showDate() {
      this.dateShow = true;
    },
    //日期确认
    submit2(val) {
         var time=val.split('-')
      if(time[1].length == 1){
         time[1]='0'+time[1]
      }
      this.$set(this.formData, "month", time.join('-'));
      this.dateShow = false;
    },
    //保存
    save(val) {
      let params = {
        ...this.formData,
        batchId: "",
        factoryId: wx.getStorageSync("factoryId"),
        costReimburseDetailList:this.content,
        isPay:'',
        userId: wx.getStorageSync("UserId"),
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
          type: val,
        },
      };
      params.isPay=this.active1
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["cost"].saveOrStart(params).then((res) => {
            if (res.data.code == 10000) {
              wx.showToast({
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
        data["cost"].saveOrStart(params).then((res) => {
          if (res.data.code == 10000) {
            wx.showToast({
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
  },
};
</script>

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
</style>