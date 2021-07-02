<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-model="userName"
        label="申请人"
        required
        readonly
        input-align="right"
        @input="userName = $event.mp.detail"
      />
      <van-field
        v-model="applyDate"
        label="申请日期"
        placeholder="请选择申请日期"
        required
        readonly
        input-align="right"
        @input="applyDate = $event.mp.detail"
         @click='showDate'
      />
    </van-cell-group>
    <div class="polling-text">
      <van-field
        v-model="reason"
        rows="1"
        autosize
        label="申请事项"
        type="textarea"
        placeholder="申请事项描述信息"
        input-align="right"
        @input="reason = $event.mp.detail"
      />
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
    ></Picker>

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
import Accessroy from "../../../components/apply/accessory";
import data from "../../../api/mockData";
import {getFlowList, getByFlowId } from '../../../api/api';
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import Picker from "../../../components/utils/picker.vue";
export default {
  components: { Accessroy,Flow,User,Picker},
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      reason: "",
      userName:wx.getStorageSync('applyUserName'),
      applyDate:'',
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
      dateShow:false,
      clickName:''
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
   onReady() {
    this.getData2()
  },
  watch: {},
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
      this.dateShow =false
    },

    //日期选择
    //显示日期
      showDate() {
      this.dateShow=true
    },
     //日期确认
    submit2(val) {
      this.applyDate=val
      this.dateShow=false
    },
    //保存
    save(val) {
      let params = {
        userName: this.userName,
        reason: this.reason,
        applyDate:this.applyDate,
        batchId: "",
        factoryId: 2020001,
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
         startFlowDto:{
           optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
          type:val
        }
      };
      if (this.photoList.length > 0) {
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["askfor"].saveOrStart(params).then((res) => {
            if (res.data.code == 10000) {
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
        data["askfor"].saveOrStart(params).then((res) => {
          if (res.data.code == 10000) {
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