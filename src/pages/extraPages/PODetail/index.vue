<template>
  <div class="allbg">
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div class="title">基本信息</div>
        <van-cell-group>
          <van-field
            v-model="id"
            label="采购订单编号"
            required
            readonly
            input-align="right"
            @input="id = $event.mp.detail"
          />
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
            :readonly="true"
            :rules="[{ required: true, message: '请填写' + item.value }]"
            @input="formData[item.name] = $event.mp.detail"
          ></van-field>
        </van-cell-group>

        <!-- 关联产品 -->
        <div class="title">采购清单</div>
        <div class="table">
          <div class="table-header">
            <div v-for="(item, index) in title" :key="index" class="header-title">{{ item }}</div>
          </div>
          <div class="table-content" v-for="(item, index) in content" :key="index">
            <div class="content-title">{{ item.name }}</div>
            <div class="content-title">{{ item.specs }}</div>
            <div class="content-title">{{ item.unitPrice }}</div>
            <div class="content-title">{{ item.purchaseQuantity }}</div>
            <div class="content-title">{{ item.totalPrice }}</div>
          </div>
        </div>
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
        <van-button type="info" size="normal" @click="operate2" v-if="!showoperate">操作</van-button>
      </van-tab>

      <van-tab title="付款申请" v-if="!showoperate">
        <div>
          <Card
            :more="false"
            :cardList="payCardList"
            @toDetail="payToDetail"
            v-if="payCardList.length > 0"
          ></Card>
          <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>
      <van-tab title="入库单" v-if="!showoperate">
        <div>
          <Card
            :more="false"
            :cardList="inCardList"
            @toDetail="inToDetail"
            v-if="inCardList.length > 0"
          ></Card>
          <div class="empty-text" v-else>暂无记录</div>
        </div>
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
import Accessroy from "../../../components/apply/accessory";
import BottomButton from "../../../components/bottomButton.vue";
import Delete from "../../../components/sureDelete";
import Card from "../../../components/card.vue";
import { backFlow, agree, disagree } from "../../../api/api";
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
export default {
  components: { Accessroy, BottomButton, Delete, Card },
  data() {
    return {
      id: "",
      //tab栏激活页
      hisTitle: ["审批步骤", "处理人", "处理时间", "结果"],
      active: 0,
      HistoryList: [],
      payCardList: [],
      inCardList: [],
      //采购清单
      title: ["产品名称", "规格型号", "单价", "数量", "总金额"],
      content: [],
      //采购清单string
      purchaseDetailJson: "",
      //该页面字段方法数据
      data: data,
      //该页面数据名
      page: "PO",
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
      show2: false,
      radio: "1",
      radio2: "1",
      //底部按钮
      btList: [
        { name: "编辑", click: "edit", color: "blue" },
        { name: "删除", click: "del", color: "red" },
        { name: "回撤", click: "back", color: "orange" },
      ],
      isBack: false,
      isEdit: false,
      isDel: false,
      isApproval: false,
      showoperate: true,
      suggestion: "",
      purchaseId: "",
      orderId:''
    };
  },
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.getData();
    wx.setNavigationBarTitle({
      title: "采购订单-详情" + "(" + wx.getStorageSync("factoryName") + ")",
    });
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        if (!this.isBack && !this.isEdit && !this.isApproval && !this.isDel) {
          this.showoperate = false;
        } else {
          this.showoperate = true;
        }
        // this.getData()
      },
    },
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
    //操作2
    operate2() {
      let a0 = ["创建付款申请", "入库"];
      wx.showActionSheet({
        itemList: a0,
        success: (res) => {
          if (res.tapIndex == 0) {
            this.$router.push({
              path: "pages/extraPages/paymentAdd/main",
              query: {
                data: "payment",
              },
            });
          } else if (res.tapIndex == 1) {
            this.$router.push({
              path: "pages/extraPages/inStorageAdd/main",
              query: {
                data: "inStorage",
              },
            });
          }
        },
        fail: (res) => {
          console.log(res.errMsg);
        },
      });
    },
    //付款详情
    payToDetail(val) {
      this.$router.push({
        path: "/pages/extraPages/paymentDetail/main",
        query: {
          id: val.id,
        },
      });
    },
    //入库信息详情
    inToDetail(val) {
      this.$router.push({
        path: "/pages/extraPages/inStorageDetail/main",
        query: {
          id: val.id,
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
      } else if (name.mp.detail.title == "付款申请") {
        let params = {
          pageNum: 1,
          pageSize: 999999999,
          searchValues: "",
          approveStatus: "",
          paymentType: "",
          purchaseId: this.purchaseId ? this.purchaseId : "",
        };
        data["payment"].getRecord(params).then((res) => {
          mpvue.showToast({
            title: "正在加载",
            icon: "loading",
            duration: 500,
            mask: true,
          });
          this.payCardList = res;
        });
      } else if (name.mp.detail.title == "入库单") {
        let params = {
          pageNum: 1,
          pageSize: 999999999,
          searchValues: "",
          approveStatus: "",
          purchaseId: this.purchaseId ? this.purchaseId : "",
        };
        data["inStorage"].getRecord(params).then((res) => {
          mpvue.showToast({
            title: "正在加载",
            icon: "loading",
            duration: 500,
            mask: true,
          });
          this.inCardList = res;
        });
      }
    },
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      //获取表单数据
      data["PO"].getData(params).then((res) => {
        this.id = res.data.data.id;
        this.formData = {
          userName: res.data.data.userName,
          supplierId: res.data.data.supplierId,
          supplierName: res.data.data.supplierName,
          supplierContacts: res.data.data.supplierContacts,
          supplierPhone: res.data.data.supplierPhone,
          purchaseDate: res.data.data.purchaseDate,
          purpose: res.data.data.purpose,
          totalPrice: res.data.data.totalPrice,
        };
        this.isEdit =
          res.data.data.isEdit == 1 || res.data.data.isEdit === "undefined"
            ? true
            : false;
        this.isDel = res.data.data.isDel == 1 ? true : false;
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval = res.data.data.isApproval == 1 ? true : false;
        this.purchaseId = res.data.data.id ? res.data.data.id : "";
         this.orderId = res.data.data.orderId ? res.data.data.orderId : "";
        this.content = res.data.data.purchaseDetailVoList.map((item) => {
          return {
            id: item.id,
            name: item.productName,
            specs: item.specs,
            purchaseQuantity: item.purchaseQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          };
        });
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
    //删除
    del() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
      };
      data["PO"].delFlow(params).then((res) => {
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
    //编辑
    edit() {
      this.$router.push({
        path: "/pages/extraPages/POEdit/main",
        query: {
          id: this.$route.query.id,
        },
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

<style scoped lang="scss">
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
</style>