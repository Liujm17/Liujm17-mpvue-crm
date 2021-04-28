<template>
  <div>
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
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
            :readonly="readonly"
            @click="
              item.type == 'user' && readonly == false ? showPopup('表单') : ''
            "
          />
        </div>
        <van-panel title="流程选择" :status="flowStatus" v-if="text !== '编辑'">
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
      </van-tab>

      <van-tab title="日志">
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <van-goods-action>
      <van-goods-action-button
        color="#7232dd"
        type="info"
        :text="text"
        @click="text == '编辑' ? changeText() : saveFlow('save')"
      />
      <van-goods-action-button
        color="#7232dd"
        type="primary"
        :text="text2"
        v-if="text == '保存草稿'"
        @click="saveFlow('start')"
      />
      <!-- <van-goods-action-button color="#be99ff" type="warning" text="保存并提交"  @click="saveFlow('start')"/> -->
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
import data from "../../api/mockData";
import User from "../../components/userOptions";
import Card from "../../components/card";
export default {
  data() {
    return {
      data: data,
      active: 0,
      formData: {},
      readonly: true,
      show: false,
      popUpType: "",
      text: "编辑",
      text2: "提交审批",
      HistoryList: [],
      //流程图
      flowId: "",
      flowList: [],
      nodeList: [],
      fitNodeList: [],
      flowStatus: 1,
    };
  },
  components: { User, Card },
  mounted() {
    this.getData();
    this.formData = data[this.$route.query.data].formData;
  },
  methods: {
    //切换标签页面
     change(name) {
      if(name.mp.detail.title == '日志'){
         let params = {
        orderId: this.$route.query.id,
      };
       //获取日志
      data[this.$route.query.data].getHistory(params).then((res) => {
         mpvue.showToast({
          title: '正在加载',
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
        console.log(this.formData.payeeUserName);
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
        formId: 1,
        userId: 1,
      };
     
      let params2 = {
        formId: 1,
        userId: 1,
      };
      //获取表单数据
      data[this.$route.query.data].getData(params).then((res) => {
        this.formData = res.data.data;
      });
      
      //获取流程数据
      data[this.$route.query.data].getFlowList(params2).then((res) => {
        if (res.length >= 1) {
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
        userId: 1,
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
    changeText() {
      (this.readonly = false), (this.text = "保存草稿");
    },
    //保存草稿或发起流程
    saveFlow(val) {
      this.$delete(this.formData, "createTime");
      this.$delete(this.formData, "createUser");
      this.$delete(this.formData, "updataTime");
      this.$delete(this.formData, "updataUser");
      this.$delete(this.formData, "id");
      this.$delete(this.formData, "test");
      let params = {
        ...this.formData,
        formId: 1,
        flowId: this.flowId,
        userId: 1,
        type: val == "save" ? 0 : 1,
        optionalJson: val == "save" ? "" : JSON.stringify(this.fitNodeList),
      };
      data[this.$route.query.data].saveOrStartFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          this.$router.push({
            path: data[this.$route.query.data].backPath,
            reLaunch: true,
          });
        }, 1000);
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

