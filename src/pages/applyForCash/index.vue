<template>
  <div>
    <div>
      <van-field
        v-for="(item, index) in data.applyCash.vanFormData.formData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        input-align="right"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="item.type == 'user' ? showPopup('表单') : ''"
      />
    </div>
    <van-panel title="流程选择" :status="flowStatus">
      <van-radio-group :value="flowId" @change="radioChange">
        <van-radio
          :name="item.id"
          v-for="(item, index) in flowList"
          :key="index"
          >{{ item.name }}</van-radio
        >
      </van-radio-group>
      <div class="liuchengtu">
        <div class="test" v-for="(item, index) in fitNodeList" :key="index">
          <van-tag
            type="warning"
            v-if="item.assigneeType == 'optional'"
            @click="showPopup2(item.nodeId)"
            >{{ item.userName ? item.userName : "自选" }}</van-tag
          >
          <van-tag round type="success" plain size="large" v-else>{{
            item.content
          }}</van-tag>
        </div>
      </div>
    </van-panel>
    <!-- <van-button type="info" size="normal" block @click="startFlow"
      >发起</van-button
    > -->
    <van-goods-action>
      <van-goods-action-button
        color="#7232dd"
        type="info"
        text="保存草稿"
        @click="saveFlow('save')"
      />
      <van-goods-action-button
        color="#be99ff"
        type="warning"
        text="保存并提交"
        @click="saveFlow('start')"
      />
    </van-goods-action>
    <!-- 收款人弹出层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="submit" @cancel="onClose"></User>
    </van-popup>
  </div>
</template>
<script>
import { getFlowList, getByFlowId, startSpareMoney } from "../../api/api";
import User from "../../components/userOptions";
import data from "../../api/mockData";
export default {
  data() {
    return {
      show: false,
      data: data,
      formData: {
      },
      flowId: "",
      flowList: [],
      nodeList: [],
      fitNodeList: [],
      flowStatus: 1,
      popUpType: "",
      nodeId: "",
    };
  },
  components: { User },
  mounted() {
    this.getData();
    this.formData = data.applyCash.formData;
  },
  watch: {},
  methods: {
    //选用户后的确认事件
    submit(val) {
      if (this.popUpType == "表单") {
             this.$set(this.formData, "payeeUserId", val.id);
        this.$set(this.formData, "payeeUserName", val.userName);
          (this.show = false);
        this.popUpType = "";
      } else if (this.popUpType == "流程") {
        this.$set(
          this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
          "userName",
          val.userName
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
    },
    //流程弹窗
    showPopup2(val) {
      this.show = true;
      (this.popUpType = "流程"), (this.nodeId = val);
    },
    //根据流程id查询节点
    getByFlowId() {
      let params = {
        flowId: this.flowId,
        userId:mpvue.getStorageSync('UserId')
      };
      //设置流程列表
      getByFlowId(params).then((res) => {
        if (this.$route.query.fitNodeList) {
          this.fitNodeList = JSON.parse(this.$route.query.fitNodeList);
        } else {
          this.fitNodeList = res.data.data.map((item) => {
            return {
              ...item,
              userId: "",
            };
          });
        }
      });
    },
    //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync('UserId'),
      };
      getFlowList(params).then((res) => {
        if (res.data.data.length >= 1) {
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
    },
    //mpvue的更改选择，异步
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.$route.query = {};
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
        userId: mpvue.getStorageSync('UserId'),
        type: val == "save" ? 0 : 1,
        optionalJson: val == "save" ? "" : JSON.stringify(this.fitNodeList),
      };
      startSpareMoney(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        this.$router.push({
          path: "/pages/applyForCashHis/main",
          reLaunch: true,
        });
      });
    },
  },
};
</script>
<style lang="scss">
.van-panel {
  margin-bottom: 2rem !important;
}
</style>
<style lang="scss" scoped>
.liuchengtu {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  .test {
    border-left: 2px black solid;
    height: 1.2rem;
    margin-left: 1rem;
  }
}
</style>
