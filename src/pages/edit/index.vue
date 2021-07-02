<template>
  <div>
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <BaseInfo
          title='基本信息'
          :listData="data[page].vanFormData.formData"
          :formData="formData"
           :radioList='radioList'
          :active='active'
          @changeData='changeData'
          @showPopup="showPopup"
            v-if="showComponents[0]"
        ></BaseInfo>
        <Flow
          :flowStatus="flowStatus"
          :flowId="flowId"
          :flowList="flowList"
          :fitNodeList="fitNodeList"
          @showPopup2="showPopup2"
          @radioChange='radioChange'
            v-if="showComponents[1]"
        ></Flow>
      </van-tab>

      <van-tab title="日志"  v-if="data[page].hasHistory">
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <van-goods-action>
      <van-goods-action-button
        type="info"
        text="保存草稿"
        v-if="isEdit == true"
        @click="saveFlow('save')"
      />
      <van-goods-action-button
        type="warning"
        text="删除"
        @click="delFlow"
      />
      <van-goods-action-button
        type="primary"
        text="保存并提交"
        @click="saveFlow('start')"
      />
      <van-goods-action-button
        type="danger"
        text="回撤到草稿"
        v-if="isBack == true"
        @click="backFlow"
      />
    </van-goods-action>

    <!-- 收款人弹出层 -->
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="submit" :radio='radio'  @cancel="onClose"></User>
    </van-popup>

    <!-- 同意驳回弹出层 -->
    <van-popup
      :show="show2"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao"
    >
      <Deal :type="dealType" @quxiao="quxiao" @queding="queding"></Deal>
    </van-popup>
   <!-- 删除弹出框 -->
    <van-popup
      :show="show3"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao2"
    >
      <Delete @quxiao="quxiao2" @queding="queding2"></Delete>
    </van-popup>
  </div>
</template>
<script>
import data from "../../api/mockData";
import User from "../../components/userOptions";
import Deal from "../../components/deal";
import Delete from "../../components/sureDelete";
import Card from "../../components/card";
import BaseInfo from "../../components/apply/baseInfo";
import Flow from "../../components/apply/flow";
import { agree, disagree } from "../../api/api";
export default {
  data() {
    return {
      //按钮群点击的按钮对应值
      active:0,
      //按钮群的list
      radioList:[],
      page: "",
      data: data,
      active: 0,
      formData: {},
      // disabled: true,
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
      flowStatus: "流程数:0",
      pageType: "",
      isEdit: false,
      isBack: false,
      dealType: "agree",
      nodeId:'',
      radio:'1',
       //该页面动态显示
      filterInfo:[],
      showComponents:[false,true]
    };
  },
  components: { User, Card, Deal, Delete, BaseInfo, Flow },
  onShow() {
    //过滤获取对应页面信息
     this.filterInfo = this.$store.state.allData.filter(
      (item) => item.formId == this.$store.state.formId
    )[0];
    this.page = this.$route.query.data;
    this.text = "编辑";
    this.getData();
    this.pageType = this.$route.query.type;
  },
   watch: {
    filterInfo(val){
       this.showComponents=val.components
       console.log(this.showComponents)
    }
  },
  methods: {
     changeData(item,index){
      this.active=index
      console.log(item)
      console.log(this.formData)
    },
    //回撤
    backFlow() {
      this.$router.back();
    },
    //切换标签页面
    change(name) {
      if (name.mp.detail.title == "日志") {
        let params = {
          orderId: this.$route.query.orderId,
        };
        //获取日志
        data[this.$route.query.data].getHistory(params).then((res) => {
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
      if (this.popUpType == "表单") {
        this.show = false;
        this.$set(this.formData, "payeeUserId", val.id);
        this.$set(this.formData, "payeeUserName", val.name);
        // (this.formData.payeeUserId = val.id),
        // (this.formData.payeeUserName = val.userName),
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
    //关闭弹窗
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
    //获取数据
    getData() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync("UserId"),
      };

      let params2 = {
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync("UserId"),
      };
      //获取表单数据
      data[this.$route.query.data].getData(params).then((res) => {
        this.formData = res.data.data;
        // Object.keys(data[this.page].formData).map((key)=>this.formData[key] = res.data.data[key])
        // console.log(this.formData)
        this.isEdit = res.data.data.isEdit == 1 ? true : false;
        this.isBack = res.data.data.isBack == 1 ? true : false;
      });
       

      if(this.showComponents[1]){
          //获取流程数据
      data[this.$route.query.data].getFlowList(params2).then((res) => {
        if (res.length >= 1) {
          this.flowStatus = "流程数:" + res.length;
          this.flowList = res;
          this.flowId = res[0].id + "";
          this.getListByFlowId();
        } else if (res.length == 0) {
          console.log("bukeyi");
        }
      });
      }
    },
    //根据流程id查询节点
    getListByFlowId() {
      let paramFlow = {
        flowId: this.flowId,
        userId: mpvue.getStorageSync("UserId"),
      };
      //根据流程id查询节点
      data[this.$route.query.data].getByFlowId(paramFlow).then((res) => {
        this.fitNodeList = res;
      });
    },
    //mpvue的更改选择，异步
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getListByFlowId();
    },
    //切换编辑保存
    // changeText() {
    //   (this.disabled = false), (this.text = "保存草稿");
    // },
    //打开删除确定框
    delFlow() {
      this.show3 = true;
    },
    //保存草稿或发起流程
    saveFlow(val) {

      let params = {
        ...this.formData,
        formId: this.$store.state.formId,
        flowId: this.flowId,
        userId: mpvue.getStorageSync("UserId"),
        type: val == "save" ? 0 : 1,
        optionalJson: val == "save" ? "" : JSON.stringify(this.fitNodeList),
      };
      data.dataFilter2(params);
      data[this.$route.query.data].editOrStart(params).then((res) => {
        if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
             setTimeout(() => {
               //回退2层
                 this.$router.go(2);
                }, 1000);
             }
      });
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
          this.$router.go(2);
        }, 1000);
      });
    },
    //取消同意/驳回
    quxiao() {
      this.show2 = false;
    },
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
  .line {
    height: 1.2rem;
    margin-left: 0.5rem;
  }
  .line:nth-last-child(n + 2) {
    border-left: 2px black solid;
  }
  .line:nth-last-child(1) {
    margin-top: -0.3rem;
  }
  .line:nth-last-child(2) {
    height: 1.5rem;
  }
}
</style>

