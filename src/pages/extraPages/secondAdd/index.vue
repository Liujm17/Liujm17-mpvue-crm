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
            : item.click == 'user'
            ? showUser(item)
            : item.click == 'factory'?factoryshow=true:''
        "
      ></van-field>
    </van-cell-group>

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

    <!-- 项目弹出层 -->
    <van-popup
      :show="factoryshow"
      position="right"
      custom-style="width: 60%; height: 100%;"
      @close="onClose"
    >
      <!-- <Factory /> -->
      <Factory @submit="factorysubmit" @cancel="onClose"></Factory>
    </van-popup>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存草稿" @click="save(0)" />
      <van-goods-action-button type="primary" text="保存提交" @click="save(1)" />
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import Accessroy from "../../../components/apply/accessory";
// import BottomButton from "../../../components/bottomButton";
import Picker from "../../../components/utils/picker.vue";
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions2";
import Factory from "../../../components/factoryOptions2.vue";
import { getFlowList, getByFlowId, getWaitPaymentList } from "../../../api/api";
export default {
  components: { Accessroy, Picker, Flow, User, Factory },
  data() {
    return {
      //供应商订单信息
      cardList: [],
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
      page: "second",
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
      //项目弹窗
      factooryradio: "",
      factoryshow: false,
    };
  },
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.uuid = data.get_uuid();
  },
  onReady() {
    this.getData();
    wx.setNavigationBarTitle({
      title: "借调结算-新增" + "(" + wx.getStorageSync("factoryName") + ")",
    });
  },
  watch: {},
  methods: {
    //更换付款类型
    changeData(item, index) {
      this.active = index;
    },
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
        userId: wx.getStorageSync("UserId"),
        factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        ...this.formData,
        batchId: "",
        startFlowDto: {
          type: val,
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
        },
      };
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["second"].saveOrStart(params).then((res) => {
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
        data["second"].saveOrStart(params).then((res) => {
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
    showDate(val) {
      if (!this.$route.name.includes("Detail")) {
        if (val.name == "endDate") {
          if (!this.formData.startDate) {
            wx.showToast({
              title: "请先选择开始日期",
              icon: "none",
              duration: 2000,
              mask: true,
            });
          } else {
            this.dateShow = true;
            this.clickName = val.name;
          }
        } else {
          this.dateShow = true;
          this.clickName = val.name;
        }
      } else {
        return;
      }
    },
    //显示用户列表弹窗
    showUser(val) {
      this.popUpType = "表单";
      this.usershow = true;
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
      this.usershow = false;
      this.factoryshow = false;
    },
    //日期确认
    submit2(val) {
      if (this.clickName == "endDate") {
        if (this.formData.startDate) {
          if (new Date().setFullYear(val.split('-')[0],val.split('-')[1],val.split('-')[2]) >new Date().setFullYear(this.formData.startDate.split('-')[0],this.formData.startDate.split('-')[1],this.formData.startDate.split('-')[2])) {
            this.formData[this.clickName] = val;
            this.dateShow = false;
          } else {
            wx.showToast({
              title: "结束日期请大于开始日期",
              icon: "none",
              duration: 2000,
              mask: true,
            });
          }
        } else {
          wx.showToast({
            title: "请先选择开始日期",
            icon: "none",
            duration: 2000,
            mask: true,
          });
        }
      } else {
        this.formData[this.clickName] = val;
        this.dateShow = false;
      }
    },
    //项目确认
    factorysubmit(val) {
      this.$set(this.formData, "toFactoryId", val.id);
      this.$set(this.formData, "toFactoryName", val.factoryName);
      this.factoryshow = false;
    },
    //流程选用户后的确认事件
    usersubmit(val) {
      if (this.popUpType == "表单") {
        this.$set(this.formData, "dispatchUserId", val.id);
        this.$set(this.formData, "dispatchUserName", val.name);
        this.usershow = false;
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
        this.usershow = false;
      }
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
    .text {
      width: 50%;
      text-align: center;
    }
  }
}
</style>