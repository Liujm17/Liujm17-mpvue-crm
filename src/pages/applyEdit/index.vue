<template>
  <div>
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div>
          <van-field
            v-for="(item, index) in data[page].vanFormData.formData"
            :key="index"
            v-model="formData[item.name]"
            :name="item.value"
            :label="item.value"
            :placeholder="item.value"
            input-align="right"
            :rules="[{ required: true, message: '请填写' + item.value }]"
            @input="formData[item.name] = $event.mp.detail"
            :readonly="item.readonly"
             :required="item.required"
               :type="item.type"
           @click="item.click == 'user'? showPopup('表单') : ''"
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
        <div class="line" v-for="(item, index) in fitNodeList" :key="index">
         <div   v-if="item.assigneeType == 'optional'">
           <p>{{item.type == 'start'?'开始':(item.type == 'approver'?'审批':'抄送')}}</p>
            <van-tag
            type="warning"
            @click="showPopup2(item.nodeId)"
            >{{ item.userName ? item.userName : "自选" }}</van-tag
          >
         </div>
         <div v-else>
              <p>{{item.type == 'start'?'开始':(item.type == 'approver'?'审批':'抄送')}}</p>
          <van-tag round :type="item.type == 'start'?'success':(item.type == 'approver'?'success':'primary')" plain size="large">{{
            item.content
          }}</van-tag>
         </div>
        </div>
      </div>
        </van-panel>
      </van-tab>

      <van-tab title="日志">
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <van-goods-action>
      <van-goods-action-button
        color="#7232dd"
        type="info"
        text="保存草稿"
        v-if="isEdit == true"
        @click="saveFlow('save')"
      />
      <van-goods-action-button
        color="#7232dd"
        type="warning"
        text="删除"
        v-if="isEdit == true"
        @click="delFlow"
      />
      <van-goods-action-button
        color="#7232dd"
        type="primary"
        text="保存并发起"
        @click="saveFlow('start')"
      />
      <van-goods-action-button
        color="#7232dd"
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
      <User @submit="submit" @cancel="onClose"></User>
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

      <van-popup
      :show="show3"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao2"
    >
      <Delete  @quxiao="quxiao2" @queding="queding2"></Delete>
    </van-popup>
  </div>
</template>
<script>
import data from "../../api/mockData";
import User from "../../components/userOptions";
import Deal from "../../components/deal";
import Delete from "../../components/sureDelete";
import Card from "../../components/card";
import { agree, disagree } from "../../api/api";
export default {
  data() {
    return {
      page:'',
      data: data,
      active: 0,
      formData: {},
      // disabled: true,
      show: false,
      show2: false,
      show3:false,
      popUpType: "",
      HistoryList: [],
      //流程图
      flowId: "",
      flowList: [],
      nodeList: [],
      fitNodeList: [],
         flowStatus: '流程数:0',
      pageType: "",
      isEdit: false,
      isBack: false,
      dealType: "agree",
    };
  },
  components: { User, Card, Deal ,Delete},
  onShow() {
     this.page=this.$route.query.data
    this.text = "编辑";
    this.getData();
    this.pageType = this.$route.query.type;
  },
  methods: {
    //回撤
    backFlow(){
         this.$router.back()
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
        this.$set(this.formData, "payeeUserName", val.userName);
        // (this.formData.payeeUserId = val.id),
        // (this.formData.payeeUserName = val.userName),
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
    //关闭弹窗
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
    //获取数据
    getData() {
      let params = {
        dataId: this.$route.query.id,
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync('UserId'),
      };

      let params2 = {
        formId: this.$store.state.formId,
        userId: mpvue.getStorageSync('UserId'),
      };
      //获取表单数据
      data[this.$route.query.data].getData(params).then((res) => {
        this.formData = res.data.data;
        this.isEdit = res.data.data.isEdit == 1 ? true : false;
        this.isBack = res.data.data.isBack == 1 ? true : false;
      });

      //获取流程数据
      data[this.$route.query.data].getFlowList(params2).then((res) => {
        if (res.length >= 1) {
          this.flowStatus='流程数:'+res.length
          this.flowList = res;
          this.flowId = res[0].id + "";
          this.getListByFlowId();
        } else if (res.length == 0) {
          console.log("bukeyi");
        }
      });
    },
    //根据流程id查询节点
    getListByFlowId() {
      let paramFlow = {
        flowId: this.flowId,
        userId: mpvue.getStorageSync('UserId'),
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
      this.show3=true
    },
    //保存草稿或发起流程
    saveFlow(val) {
      data.dataFilter2(this.formData);

      let params = {
        ...this.formData,
        formId: this.$store.state.formId,
        flowId: this.flowId,
        userId: mpvue.getStorageSync('UserId'),
        type: val == "save" ? 0 : 1,
        optionalJson: val == "save" ? "" : JSON.stringify(this.fitNodeList),
      };
      data[this.$route.query.data].editOrStartFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          //回退2层
         this.$router.go(2)
        }, 1000);
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
        userId: mpvue.getStorageSync('UserId'),
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
         this.$router.back()
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
        this.$router.back()
        });
      }
    },
    //确定删除
    queding2(){
          let params = {
        id: this.formData.id,
        formId:this.$store.state.formId
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
          this.$router.go(2)
        }, 1000);
      });
    },
    //取消同意/驳回
    quxiao() {
      this.show2 = false;
    },
    quxiao2(){
      this.show3=false
    }
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
  .line:nth-last-child(n+2){
    border-left: 2px black solid;
  }
   .line:nth-last-child(1){
    margin-top: -0.3rem;
  }
   .line:nth-last-child(2){
     height: 1.5rem;
  }
}
</style>

