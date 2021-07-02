<template>
  <div>
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <BaseInfo
          title="基本信息"
          :listData="data[page].vanFormData.formData"
          :formData="formData"
          :readonly="true"
        ></BaseInfo>
        <van-button type="info" size="normal" @click="operate">操作</van-button>
      </van-tab>

      <van-tab title="日志" v-if="data[page].hasHistory">
        <div class="header">
          <div v-for="(item, index) in title" :key="index" class="title">{{ item }}</div>
        </div>
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <!-- <van-goods-action v-if="pageType == '历史'">
      <van-goods-action-button type="info" text="编辑" v-if="isEdit" @click="changeText()" />
      <van-goods-action-button type="warning" text="删除" v-if="isEdit" @click="delFlow" />
      <van-goods-action-button type="danger" text="回撤" v-if="isBack" @click="backFlow" />
    </van-goods-action>

    <van-goods-action v-else-if="pageType == '待审批'">
      <van-goods-action-button type="info" text="同意" @click="agree" />
      <van-goods-action-button type="default" text="转审" @click="referral" />
      <van-goods-action-button type="primary" text="驳回" @click="disagree" />
    </van-goods-action>
    <van-goods-action v-else-if="pageType == '已审批'"></van-goods-action>

    <van-goods-action v-else-if="pageType == '已提交'">
      <van-goods-action-button type="info" text="编辑" v-if="isEdit == true" @click="changeText()" />
      <van-goods-action-button type="warning" text="删除" v-if="isEdit == true" @click="delFlow" />
      <van-goods-action-button type="danger" text="回撤" v-if="isBack == true" @click="backFlow" />
    </van-goods-action> -->

    <!-- 同意驳回弹出层 -->
    <!-- <van-popup
      :show="show2"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao"
    >
      <Deal :type="dealType" @quxiao="quxiao" @queding="queding"></Deal>
    </van-popup> -->
    <!-- 删除或者回撤弹出层 -->
    <!-- <van-popup
      :show="show3"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao2"
    >
      <Delete @quxiao="quxiao2" @queding="queding2"></Delete>
    </van-popup> -->

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
import data from "../../api/mockData";
import Deal from "../../components/deal";
import Delete from "../../components/sureDelete";
import Card from "../../components/card";
import User from "../../components/userOptions";
import BaseInfo from "../../components/apply/baseInfo";
import { agree, disagree, backFlow, referral } from "../../api/api";
export default {
  data() {
    return {
      title: ["审批步骤", "处理人", "处理时间", "结果"],
      page: "",
      data: data,
      active: 0,
      formData: {},
      disabled: true,
      show: false,
      show2: false,
      show3: false,
      popUpType: "",
      HistoryList: [],
      //流程图
      flowId: "",
      flowList: [],
      nodeList: [],
      fitNodeList: [],
      flowStatus: 1,
      pageType: "",
      isEdit: false,
      isDel: false,
      isBack: false,
      isApproval:false,
      dealType: "agree",
      DeleteType: "delete",
    };
  },
  components: { Card, Deal, Delete, User, BaseInfo },
  onShow() {
    this.page = this.$route.query.data;
    this.pageType = this.$route.query.type;
    this.getData();
  },
  methods: {
    //操作
    operate() {
     let a1=this.isEdit?['编辑','删除']:[];
     let a2=this.isBack?['回撤']:[];
     let a3 =this.isApproval?['同意','驳回']:[];
     let a0=[...a1,...a2,...a3];
        wx.showActionSheet({
          itemList: a0,
        success:(res) =>{
          if(res.tapIndex == 0){
            this.changeText()
          }else{
            this.queding2()
          }
        },
        fail:(res)=> {
          console.log(res.errMsg);
        },
      });
    },
    //切换标签页面
    change(name) {
      if (name.mp.detail.title == "日志") {
        let params = {
          orderId: this.formData.orderId == null ? "" : this.formData.orderId,
        };
        //获取日志
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
    //选用户后的确认事件
    submit(val) {
      let params = {
        orderId: this.$route.query.orderId,
        userId: val.id,
        approverUserId: mpvue.getStorageSync("UserId"),
      };
      referral(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        this.show = false;
        this.$router.back();
      });
    },

    //获取数据
    getData() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync("UserId"),
      };
      //获取表单数据
      data[this.$route.query.data].getData(params).then((res) => {
        this.formData = res.data.data;
        // Object.keys(data[this.page].formData).map((key)=>this.formData[key] = res.data.data[key])
        // console.log(this.formData)
        this.isEdit =
          res.data.data.isEdit == 1 || res.data.data.isEdit === 'undefined'  ? true : false;
        this.isDel =
          res.data.data.isEdit == 0  ? false : true;
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval=res.data.data.isApproval == 1 ?true:false
      });
    },

    //切换到编辑页面
    changeText() {
      this.$router.push({
        path: "/pages/edit/main",
        query: {
          id: this.$route.query.id,
          orderId: this.$route.query.orderId,
          formId: this.$store.state.formId,
          data: this.$store.state.allData.filter(
            (item) => item.formId == this.$store.state.formId
          )[0].data,
          type: "历史",
        },
      });
      // (this.disabled = false), (this.text = "保存草稿");
    },
    //mpvue的更改选择，异步
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getListByFlowId();
    },
    //回撤
    backFlow() {
      this.DeleteType = "back";
      this.show3 = true;
    },
    //删除
    delFlow() {
      this.DeleteType = "delete";
      this.show3 = true;
    },
    //同意
    agree() {
      this.dealType = "agree";
      this.show2 = true;
    },
    //驳回
    disagree() {
      this.dealType = "disagree";
      this.show2 = true;
    },
    //转审
    referral() {
      this.show = true;
    },
    //关闭转审人菜单
    onClose() {
      this.show = false;
    },
    //确定同意/驳回
    queding(val) {
      let params = {
        ...val,
        userId: mpvue.getStorageSync("UserId"),
        orderId: this.$route.query.orderId,
      };
      if (this.dealType == "agree") {
        agree(params).then((res) => {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true,
          });
          this.show2 = false;
          this.$router.back();
        });
      } else {
        disagree(params).then((res) => {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true,
          });
          this.show2 = false;
          this.$router.back();
        });
      }
    },
    //确定删除
    queding2() {
      if (this.DeleteType == "delete") {
        let params = {
          id: this.formData.id,
          formId: this.$store.state.formId,
          userId: mpvue.getStorageSync("UserId"),
        };
        data[this.$route.query.data].delFlow(params).then((res) => {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true,
          });
          this.show3 = false;
          //重启到某页面，如不是tabar页面会有回主页按钮
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        });
      } else if (this.DeleteType == "back") {
        let params = {
          orderId: this.$route.query.orderId,
        };
        backFlow(params).then((res) => {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            mask: true,
          });
          this.show3 = false;
          //重启到某页面，如不是tabar页面会有回主页按钮
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        });
      }
    },
    //取消对同意/驳回的操作
    quxiao() {
      this.show2 = false;
    },
    //取消删除
    quxiao2() {
      this.show3 = false;
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
.header {
  display: flex;
  line-height: 40px;
  width: 90%;
  margin-left: 5%;
  .title {
    flex: 1;
    text-align: center;
    color: #666666;
    font-weight: 700;
  }
}
</style>
<style>
.van-button--normal {
  width: 80%;
  margin-left: 10%;
  margin-top: 20px;
}
</style>

