<template>
  <div class="allbg">
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div class="title">基本信息</div>
        <van-cell-group>
          <van-field
            v-model="formData.collectionDate"
            label="收款日期"
            placeholder="请选择收款日期"
            required
            readonly
            input-align="right"
            @input="formData.collectionDate = $event.mp.detail"
            @click="showDate2"
          />
          <van-field
            v-model="formData.month"
            label="费用所属期"
            placeholder="请选择费用所属期"
            required
            readonly
            input-align="right"
            @input="formData.month = $event.mp.detail"
            @click="showDate"
          />
          <van-field
            v-model="formData.totalPrice"
            label="总金额"
            required
            readonly
            type="digit"
            input-align="right"
            @input="formData.totalPrice = $event.mp.detail"
          />
        </van-cell-group>

        <div style="width:100%;height:20px"></div>
        <!-- 费用明细列表 -->
        <div
          style="padding:10px;box-sizing:border-box"
          v-for="(item,index) in content"
          :key="index"
        >
          <div class="title" style="display:flex;align-items:center;justify-content:space-between">
            <span>结算单明细({{index+1}})</span>
          </div>
          <van-cell-group>
            <van-field
              v-model="item.type"
              label="类别"
              required
              readonly
              input-align="right"
              @input="item.type = $event.mp.detail"
            ></van-field>
            <van-field
              v-model="item.quantity"
              placeholder="请填写数量"
              label="数量"
              type="digit"
              required
              readonly
              input-align="right"
              @input="item.quantity = $event.mp.detail"
            />
            <van-field
              v-model="item.unitPrice"
              placeholder="请填写单价"
              label="单价"
              type="digit"
              required
              readonly
              input-align="right"
              @input="item.unitPrice = $event.mp.detail"
            />
            <van-field
              v-model="item.totalPrice"
              label="金额"
              type="digit"
              readonly
              required
              input-align="right"
              @input="item.totalPrice = $event.mp.detail"
            />
          </van-cell-group>
        </div>

        <!-- 附件 -->
        <Accessroy :photoList="photoList" :onlyOne="false" :notShow="false"></Accessroy>
        <van-field
          v-model="suggestion"
          rows="1"
          autosize
          label="意见"
          type="textarea"
          placeholder="请输入意见"
          v-if="isApproval"
        />
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
import Accessroy from "../../../components/apply/accessory";
import data from "../../../api/mockData";
import { backFlow, agree, disagree } from "../../../api/api";
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
import Card from "../../../components/card.vue";
export default {
  components: { Card, Accessroy },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      formData: {
        month: "",
        collectionDate: "",
        totalPrice: "",
      },
      //tab栏激活页
      hisTitle: ["审批步骤", "处理人", "处理时间", "结果"],
      active: 0,
      HistoryList: [],
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},

      //费用报销明细
      content: [],
      //审批相关
      isBack: false,
      isEdit: false,
      isDel: false,
      isApproval: false,
      showoperate: true,
      orderId: "",
      //意见
      suggestion: "",
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
  onShow() {
    this.getData();
  },
  onReady() {
    this.formData.userName = wx.getStorageSync("applyUserName");
    this.formData.userId = wx.getStorageSync("UserId");
     wx.setNavigationBarTitle({
          title: '结算单-详情'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
  
  },
  methods: {
    //操作
    operate() {
      let a1 = this.isEdit ? ["编辑"] : [];
      let a2 = this.isBack ? ["回撤"] : [];
      let a3 = this.isApproval ? ["同意", "驳回"] : [];
      let a4 = this.isDel ? ["删除"] : [];
      let b1 = this.isEdit ? ["edit"] : [];
      let b2 = this.isBack ? ["back"] : [];
      let b3 = this.isApproval ? ["agree", "disagree"] : [];
      let b4 = this.isDel ? ["del"] : [];
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
      data["settle"].getData(params).then((res) => {
        this.formData = {
          month: res.data.data.month,
          collectionDate: res.data.data.collectionDate,
          totalPrice: res.data.data.totalPrice,
        };
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
                id: item.id ? item.id : "",
              };
            })
          : [];
        this.content = res.data.data.costStatementDetailVoList.map((item) => {
          return {
            id: item.id ? item.id : "",
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            type: item.typeName,
          };
        });
      });
    },

    edit() {
      this.$router.push({
        path: "/pages/extraPages/settleEdit/main",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    del() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
      };
      data["settle"].delFlow(params).then((res) => {
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
    //同意
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
        closeOnClickOverlay: true,
      })
        .then((res) => {
          let params = {
            orderId: this.orderId,
            suggestion: this.suggestion,
            dealResult: res.type,
          };
          disagree(params).then((res) => {
            this.$router.back();
          });
        })
        .catch(() => {
          // close
          console.log("close");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/list.scss";
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