<template>
  <div class="allbg">
     <van-tabs :active="active" @change="change">
      <van-tab title="详情">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-model="formData.userName"
        label="申请人"
        readonly
        input-align="right"
        @input="formData.userName = $event.mp.detail"
      />
      <van-field
        v-model="formData.isPay"
        label="是否已付款"
        readonly
        input-align="right"
        @input="formData.isPay = $event.mp.detail"
      >
        <!-- <RadioButton :typeList="radioList1" :active="active1" @changeData="changeData1"></RadioButton> -->
      </van-field>
      <van-field
        v-model="formData.month"
        label="费用所属期"
        placeholder="请选择费用所属期"
        readonly
        input-align="right"
        @input="formData.month = $event.mp.detail"
        @click="showDate"
      />
    </van-cell-group>
     <div class="title">付款信息</div>
    <div class="polling-text">
      <van-field
        v-model="formData.accountName"
        placeholder="请填写账户"
        label="账户"
        readonly
        input-align="right"
        @input="formData.accountName = $event.mp.detail"
          v-if="formData.isPay == '否'"
      />
      <van-field
        v-model="formData.bankName"
        placeholder="请填写开户行"
        label="开户行"
        readonly
        input-align="right"
        @input="formData.bankName = $event.mp.detail"
          v-if="formData.isPay == '否'"
      />
      <van-field
        v-model="formData.bankAccount"
        placeholder="请填写银行账号"
        label="银行账号"
        readonly
        type="digit"
        input-align="right"
        @input="formData.bankAccount = $event.mp.detail"
          v-if="formData.isPay == '否'"
      />
      <van-field
        v-model="formData.totalPrice"
        label="合计付款金额"
        readonly
        type="digit"
        input-align="right"
        @input="formData.totalPrice = $event.mp.detail"
      />
    </div>
    <div style="width:100%;height:20px"></div>
    <!-- 费用明细列表 -->
    <div style="padding:10px;box-sizing:border-box" v-for="(item,index) in content" :key="index">
      <div class="title" style="display:flex;align-items:center;justify-content:space-between">
        <span>费用报销单明细({{index+1}})</span>
      </div>
      <van-cell-group>
        <van-field
          v-model="item.purpose"
          placeholder="请填写费用用途"
          label="费用用途"
          readonly
          input-align="right"
          @input="item.purpose = $event.mp.detail"
        />
        <van-field label="费用类别"   v-model="item.type"   readonly  input-align="right"   @input="item.type = $event.mp.detail"></van-field>
        <van-field
          v-model="item.money"
          placeholder="请填写报销金额"
          label="报销金额"
          type="digit"
          readonly
          input-align="right"
          @input="item.money = $event.mp.detail"
        />
        <van-field
          v-model="item.remark"
          placeholder="请填写备注"
          label="备注"
          readonly
          input-align="right"
          @input="item.remark = $event.mp.detail"
        />
      </van-cell-group>
    </div>

    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false" :notShow="false"></Accessroy>
    <van-field
          v-model="suggestion" @input="suggestion = $event.mp.detail"
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
import Card from "../../../components/boxCard.vue";
export default {
 components: { Card, Accessroy },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      formData: {
        userId: "",
        isPay: "",
        userName: "",
        month: "",
        accountName: "",
        bankName: "",
        bankAccount: "",
        totalPrice: "",
      },
       //tab栏激活页
      hisTitle: [],
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
      isDel:false,
      isApproval: false,
      showoperate: true,
      orderId: "",
      //意见
      suggestion:''
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
  onShow() {
    this.getData();
  },
  onReady() {
      wx.setNavigationBarTitle({
          title: '费用报销-详情'+'('+wx.getStorageSync("factoryName")+')',
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
    content: {
      handler(newValue, oldValue) {
        this.formData.totalPrice = newValue.reduce(
          (total, item) => total + item.money * 1,
          0
        );
      },
      //首次监听
      //  immediate: true,
      //深度监听
      deep: true,
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
        let params = {
          orderId: this.orderId,
        };
        data.getHistory(params).then((res) => {
          wx.showToast({
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
        formId: 15,
        id: this.$route.query.id,
      };
      data["cost"].getData(params).then((res) => {
        this.formData = {
          isPay: res.data.data.isPay ==0?'否':'是',
          userName: res.data.data.userName,
          month: res.data.data.month,
          accountName: res.data.data.accountName,
          bankName: res.data.data.bankName,
          bankAccount: res.data.data.bankAccount,
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
          this.content=res.data.data.costReimburseDetailVoList.map((item)=>{
            return {
              id:item.id?item.id:'',
              money:item.money,
              purpose:item.purpose,
              remark:item.remark,
              type:item.typeName
            }
          })
      });
    },
  
  
  edit() {
      this.$router.push({
        path: "/pages/extraPages/costEdit/main",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    del() {
      let params = {
        id: this.$route.query.id,
        formId: 15,
      };
      data["cost"].delFlow(params).then((res) => {
        wx.showToast({
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
        wx.showToast({
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
        this.getData();
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
          this.getData()
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