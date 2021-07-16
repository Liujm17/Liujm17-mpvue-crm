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
    ></BaseInfo>
       <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>
    <Flow
    :flowStatus='flowStatus'
    :flowId='flowId'
    :flowList='flowList'
    :fitNodeList='fitNodeList'
    @showPopup2='showPopup2'
    @radioChange='radioChange'
    ></Flow>
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
import { getFlowList, getByFlowId, startSpareMoney } from "../../../api/api";
import { getStorageSync } from "../../../api/wechat";
import Accessroy from "../../../components/apply/accessory";
import User from "../../../components/userOptions.vue";
import data from "../../../api/mockData";
import BaseInfo from '../../../components/apply/baseInfo';
import Flow from '../../../components/apply/flow'
export default {
  data() {
    return {
       //附件列表
      photoList: [],
      //附件列表上传索引
      valueIndex: 0,
      //按钮群点击的按钮对应值
      active:0,
      //按钮群的list
      radioList:[],
      page:'applyCash',
      show: false,
      data: data,
      uuid:'',
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
  components: { User,BaseInfo,Flow,Accessroy },
  onLoad() {
     this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    this.formData = data['applyCash'].formData;
      this.listData = this.data['applyCash'].vanFormData.formData;
    this.radioList=data['applyCash'].radioList
     this.uuid= data.get_uuid()
  },
  onReady(){
    this.getData();
      wx.setNavigationBarTitle({
          title: '备用金-新增'+'('+wx.getStorageSync("factoryName")+')',
        });
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
      this.active=index
    },
    //选用户后的确认事件
    submit(val) {
      if (this.popUpType == "表单") {
        this.$set(this.formData, "userId", val.id);
        this.$set(this.formData, "userName", val.name);
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
      if(this.formData.userId){
        this.radio =this.formData.userId+''
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
        userId: mpvue.getStorageSync("UserId"),
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
        userId: mpvue.getStorageSync("UserId"),
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
          factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData,
        batchId: "",
         startFlowDto: {
           type: val == "save" ? 0 : 1,
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        },
      };
        if (this.photoList.length > 0) {
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
           //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["applyCash"].saveOrStart(params).then((res) => {
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
        data["applyCash"].saveOrStart(params).then((res) => {
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
  },
};
</script>
<style lang="scss">
.van-panel {
  margin-bottom: 2rem !important;
}
</style>

