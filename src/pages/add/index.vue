<template>
  <div>
    <BaseInfo
    title='基本信息'
    :listData='data[page].vanFormData.formData'
    :formData='formData'
    :radioList='radioList'
    :active='active'
    @changeData='changeData'
    @showPopup='showPopup'
    v-if="showComponents[0]"
    ></BaseInfo>
    <van-goods-action>
      <van-goods-action-button
        type="info"
        text="保存草稿"
        @click="saveFlow('save')"
        v-if="data[page].isApprove"
      />
      <van-goods-action-button
        type="warning"
        text="保存并提交"
        @click="saveFlow('start')"
      />
    </van-goods-action>
    <!-- 用户弹出层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="submit" :radio='radio' @cancel="onClose"></User>
    </van-popup>
   
  </div>
</template>
<script>
import { getFlowList, getByFlowId, startSpareMoney } from "../../api/api";
import { getStorageSync } from "../../api/wechat";
import User from "../../components/userOptions";
import data from "../../api/mockData";
import BaseInfo from '../../components/apply/baseInfo';
import Flow from '../../components/apply/flow'
import indexVue from '../extraPages/POAdd/index.vue';
export default {
  data() {
    return {
      //按钮群点击的按钮对应值
      active:0,
      //按钮群的list
      radioList:[],
      page:'',
      show: false,
      data: data,
      formData: {},
      flowId: "",
      flowList: [],
      fitNodeList: [],
      flowStatus: '流程数:0',
      popUpType: "",
      nodeId: "",
      radio:'1',
      //该页面动态显示
      filterInfo:[],
      showComponents:[false,false]
    };
  },
  components: { User,BaseInfo,Flow },
  onShow() {
     this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    this.page=this.filterInfo.data
    this.formData = data[this.page].formData;
    this.radioList=data[this.page].radioList
  },
  onReady(){
    // this.getData();
     wx.setNavigationBarTitle({
          title: '新增'+'('+wx.getStorageSync("factoryName")+')',
        });
  },
  onUnload(){
     this.show=false
  },
  watch: {
    formData:function(val){
    this.formData.userId=getStorageSync('UserId')
     this.formData.userName=getStorageSync('applyUserName') 
    },
    filterInfo(val){
       this.showComponents=val.components
    }
  },
  methods: {
     changeData(item,index){
      this.active=indexVue
    },
    //选用户后的确认事件
    submit(val) {
      if (this.popUpType == "表单") {
        this.$set(this.formData, "payeeUserId", val.id);
        this.$set(this.formData, "payeeUserName", val.name);
        this.show = false;
        this.popUpType = "";
      } else if (this.popUpType == "流程") {
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
        this.show = false;
      }
    },

    onClose() {
      this.show = false;
      this.popUpType = "";
    },
    //表单弹窗
    showPopup(val) {
      this.show = true;
      this.popUpType = val;
      if(this.formData.payeeUserId){
        this.radio =this.formData.payeeUserId+''
      }else{
        this.radio='1'
      }
    },
    //流程弹窗
    showPopup2(val) {
      this.show = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.radio=val.userId+''
    },
    //根据流程id查询节点
    getByFlowId() {
      let params = {
        flowId: this.flowId,
        userId: wx.getStorageSync("UserId"),
      };
      //设置流程列表
      getByFlowId(params).then((res) => {
        if (this.$route.query.fitNodeList) {
          this.fitNodeList = JSON.parse(this.$route.query.fitNodeList);
        } else {
          this.fitNodeList = res.data.data.map((item) => {
            return {
              ...item,
            };
          });
        }
      });
    },
    //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        userId: wx.getStorageSync("UserId"),
      };
       if(this.showComponents[1]){
           getFlowList(params).then((res) => {
        if (res.data.data.length >= 1) {
          this.flowStatus='流程数:'+res.data.data.length
          this.flowList = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.flowName,
            };
          });
          if (this.$route.query.flowId) {
            this.flowId = this.$route.query.flowId;
          } else {
            this.flowId = res.data.data[0].id + "";
          }
          this.getByFlowId();
        } else if (res.data.data.length == 0) {
          console.log("bukeyi");
        }
      });
       }
    },
    //mpvue的更改选择，异步
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getByFlowId();
    },
    //mpvue设置对应输入框的值
    // change(event) {
    //   var value = Object.keys(this.formData)[
    //     event.currentTarget.dataset.eventid
    //   ];
    //   this.formData[value] = event.mp.detail;
    // },
    //保存草稿或发起流程
    saveFlow(val) {
      let params = {
        ...this.formData,
        formId: this.$store.state.formId,
        flowId: this.flowId,
        userId: wx.getStorageSync("UserId"),
        factoryId: wx.getStorageSync("factoryId"),
        type: val == "save" ? 0 : 1,
        optionalJson: val == "save" ? "" : JSON.stringify(this.fitNodeList),
      };
      data[this.page].saveOrStart(params).then((res)=>{
          if(res.data.code == 10000){
              wx.showToast({
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
<style lang="scss">
.van-panel {
  margin-bottom: 2rem !important;
}
</style>

