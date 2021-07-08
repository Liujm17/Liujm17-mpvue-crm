<template>
  <div class="allbg">
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div class="title">盘点信息</div>
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
          ></van-field>
        </van-cell-group>


   <!-- 盘点表 -->
      <div class="table">
      <div class="header">
        <div v-for="(item, index) in title" :key="index" class="title">
          {{ item }}
        </div>
      </div>
      <div class="content" v-for="(item, index) in content" :key="index">
        <div class="title">{{ item.productName }}</div>
        <div class="title">{{ item.specs }}</div>
        <div class="title">{{ item.bookQuantity }}</div>
        <div class="title">
         {{item.checkQuantity}}
        </div>
        <div class="title">{{ item.lossQuantity }}</div>
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
          <div v-for="(item, index) in hisTitle" :key="index" class="title">{{ item }}</div>
        </div>
        <Card :cardList="HistoryList"></Card>
      </van-tab>
    </van-tabs>

    <van-dialog2 id="van-dialog" />
  </div>
</template>

<script>
import { backFlow, agree, disagree,stockDetail,stockDel } from "../../../api/api";
import Card from "../../../components/card.vue";
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
import data from '../../../api/mockData'
export default {
  components: { Card },
  data() {
    return {
       data,
      active: 0,
      HistoryList: [],
       title: ["产品名称", "规格型号", "账面数量","实盘数量","盈亏数量"],
      content:[],
      //采购清单list
      purchaseDetailList: [],
      //表单列表
      listData: [
        {
          name: "userName",
          value: "盘点人",
          click: "normal",
          type: "",
          required: true,
          readonly: true,
        },
        {
          name: "checkDate",
          value: "盘点时间",
          click: "normal",
          type: "",
          required: true,
          readonly: true,
        },
      ],
      //表单值
      formData: {
        userName: "",
        checkDate: "",
      },
      isBack: false,
      isEdit: false,
      isDel: false,
      isApproval: false,
      showoperate: true,
      suggestion: "",
      orderId: "",
    };
  },
  onShow() {
    this.getData();
     wx.setNavigationBarTitle({
          title: '库存盘点-详情'+'('+wx.getStorageSync("factoryName")+')',
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
      stockDetail(params).then((res)=>{
        this.formData={
          userName:res.data.data.userName,
          checkDate:res.data.data.checkDate,
        }
          this.isEdit =res.data.data.isEdit == 1 || res.data.data.isEdit === 'undefined' ? true : false;
         this.isDel = res.data.data.isDel == 1 ?true:false
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval=res.data.data.isApproval == 1 ?true:false
        this.orderId = res.data.data.orderId ? res.data.data.orderId : "";
      this.content=res.data.data.stockCheckDetailVoList.map((item)=>{
           return{
             productId:item.productId,
             productName:item.productName,
             specs:item.specs,
             bookQuantity:item.bookQuantity,
             checkQuantity:item.checkQuantity,
             lossQuantity:item.lossQuantity
           }
         })
      })
    },
    //编辑
    edit() {
      this.$router.push({
        path: "/pages/extraPages/storageEdit/main",
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
      stockDel(params).then((res) => {
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

<style scoped lang="scss">
@import "../../../style/list.scss";
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}

</style>