<template>
  <div class="allbg">
      <van-tabs :active="active" @change="change">
      <van-tab title="详情">
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
        readonly
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      >
      </van-field>
    </van-cell-group>

    <!-- 关联产品 -->
    <div class="title">入库信息</div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.specs }}</div>
        <div class="content-title">
          {{ item.outQuantity }}
        </div>
      </div>
    </div>
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
        <div v-for="(item, index) in hisTitle" :key="index" class="title">
          {{ item }}
        </div>
      </div>
         <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <!-- 底部按钮 -->
    <!-- <van-goods-action>
      <van-goods-action-button
        type="info"
        text="编辑"
        @click="edit"
        v-if="isEdit"
      />
      <van-goods-action-button
        type="warning"
        text="删除"
        @click="del"
        v-if="isEdit"
      />
      <van-goods-action-button
        type="primary"
        text="回撤"
        @click="back"
        v-if="isBack"
      />
    </van-goods-action> -->
      <van-dialog2 id="van-dialog" />
  </div>
</template>

<script>
import data from "../../../api/mockData";
import { backFlow,agree,disagree } from "../../../api/api";
import Card from '../../../components/card.vue'
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
export default {
  components:{Card},
  data() {
    return {
        //tab栏激活页
       hisTitle: ["审批步骤", "处理人", "处理时间","结果"],
      active: 0,
      HistoryList:[],
      radioList: [],
      //采购清单
      title: ["产品名称", "规格型号", "数量"],
      content: [],
      //采购清单list
      purchaseDetailList: [],
      //该页面字段方法数据
      data: data,
      //该页面数据名
      page: "outStorage",
      //表单列表
      listData: [],
      //表单值
      formData: {},
      isBack: false,
      isEdit: false,
      isDel:false,
      isApproval:false,
      showoperate:true,
      suggestion:'',
      orderId: "",
    };
  },
  onShow() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.getData();
     wx.setNavigationBarTitle({
          title: '出库单-详情'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
      formData: {
      handler(newVal, oldVal) {
        if (!this.isBack && !this.isEdit && !this.isApproval&&!this.isDel) {
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
        let params={
          orderId:this.orderId
        }
        data.getHistory(params).then((res)=>{
           mpvue.showToast({
            title: "正在加载",
            icon: "loading",
            duration: 500,
            mask: true,
          });
          this.HistoryList = res;
        })
      }
    },
    //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      data["outStorage"].getData(params).then((res) => {
        this.formData = {
          userName: wx.getStorageSync("applyUserName"),
          outDate: res.data.data.outDate,
          outType: res.data.data.outType == 1 ? "领用" : "调拨",
          purpose:res.data.data.purpose
        };
         this.isEdit =res.data.data.isEdit == 1 || res.data.data.isEdit === 'undefined' ? true : false;
         this.isDel = res.data.data.isDel == 1 ?true:false
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval=res.data.data.isApproval == 1 ?true:false
        this.orderId = res.data.data.orderId ? res.data.data.orderId : "";
        this.content = res.data.data.stockOutDetailVoList.map((item) => {
          return {
            name: item.productName,
            specs: item.specs,
            outQuantity: item.outQuantity,
          };
        });
      });
    },
    edit() {
       this.$router.push({
        path: "/pages/extraPages/outStorageEdit/main",
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
      data['outStorage'].delFlow(params).then((res) => {
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