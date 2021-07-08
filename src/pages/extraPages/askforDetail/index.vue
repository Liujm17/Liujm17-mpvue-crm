<template>
  <div class="allbg">
      <van-tabs :active="active" @change="change">
      <van-tab title="详情">
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
        readonly
        placeholder="申请事项描述信息"
        input-align="right"
        @input="reason = $event.mp.detail"
      />
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"  :notShow="false"></Accessroy>
    <van-field
          v-model="suggestion"
          rows="1"
          autosize
          label="意见"
          type="textarea"
          placeholder="请输入意见"
          v-if="isApproval"
        />
      <!-- 空白区域 -->
    <div style="width:100%;height:20px"></div>
     <van-button type="info" size="normal" @click="operate" v-if="showoperate">操作</van-button>

     </van-tab>
      <van-tab title="日志">
        <div class="header">
          <div v-for="(item, index) in hisTitle" :key="index" class="title">{{ item }}</div>
        </div>
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

      <van-dialog2 id="van-dialog" />
  </div>
</template>

<script>
import data from "../../../api/mockData";
import { backFlow, agree, disagree } from "../../../api/api";
import Card from "../../../components/card.vue";
import Accessroy from "../../../components/apply/accessory.vue";
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
export default {
    components: { Card, Accessroy },
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
        //表单值
      formData: {},
      isBack: false,
      isEdit: false,
      isDel:false,
      isApproval: false,
      showoperate: true,
       orderId: "",
       suggestion:'',
      //表单
      formData: {},
      //日志
       active: 0,
      HistoryList: [],
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
   onShow() {
     this.getData()
      wx.setNavigationBarTitle({
          title: '请求单-详情'+'('+wx.getStorageSync("factoryName")+')',
        });
  },
  watch: {},
  methods: {
    //操作
    operate() {
      let a1 = this.isEdit ? ["编辑"] : [];
      let a2 = this.isBack ? ["回撤"] : [];
      let a3 = this.isApproval ? ["同意", "驳回"] : [];
      let a4 = this.isDel?['删除']:[];
      let b1 = this.isEdit ? ["edit"] : [];
      let b2 = this.isBack ? ["back"] : [];
      let b3 = this.isApproval ? ["agree", "disagree"] : [];
      let b4 = this.isDel ? [ "del"] : [];
      let a0 = [...a1, ...a2, ...a3, ...a4];
      let b0 = [...b1, ...b2, ...b3, ...b4];
      wx.showActionSheet({
        itemList: a0,
        success: (res) => {
          this[b0[res.tapIndex]]();
        },
        fail: (res) => {
          console.log(res.errMsg);
        },
      });
    },
     //切换标签页面
    change(name) {
      if (name.mp.detail.title == "日志") {
        let params = {
          orderId: this.orderId,
        };
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
     //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      data["askfor"].getData(params).then((res) => {
        this.applyDate=res.data.data.applyDate
        this.reason=res.data.data.reason

        this.isEdit =
          res.data.data.isEdit == 1 || res.data.data.isEdit === "undefined"
            ? true
            : false;
        this.isDel = res.data.data.isDel == 1 ? true : false;
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval = res.data.data.isApproval == 1 ? true : false;
        this.orderId = res.data.data.orderId ? res.data.data.orderId : "";
        this.photoList = res.data.data.fileList
          ? res.data.data.fileList.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
              };
            })
          : [];
      });
    },
      agree() {
      let params = {
        orderId: this.orderId,
        suggestion: this.suggestion,
      };
      agree(params).then((res) => {
        this.$router.back();
      });
    },
    //不同意
    disagree() {
       Dialog2.confirm({
        title: "操作",
        message: "审批驳回",
        //开启按空白处关闭弹窗
        closeOnClickOverlay:true
      })
        .then((res) => {
          let params={
            orderId: this.orderId,
            suggestion: this.suggestion,
            dealResult:res.type
          }
          disagree(params).then((res) => {
             this.$router.back();
          });
        })
        .catch(() => {
          // close
          console.log("close");
        });
    },
    //编辑
      edit() {
      this.$router.push({
        path: "/pages/extraPages/askforEdit/main",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    //删除
    del() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
      };
      data["askfor"].delFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      });
    },
     //回撤
    back() {
      let params = {
        orderId: this.orderId,
      };
      backFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      });
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