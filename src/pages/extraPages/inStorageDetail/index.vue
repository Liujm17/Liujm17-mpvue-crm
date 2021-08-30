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
          {{ item.unitPrice }}
        </div>
        <div class="content-title">
          {{ item.inQuantity }}
        </div>
      </div>
    </div>
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
import Card from '../../../components/boxCard.vue'
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
      title: ["产品名称", "规格型号",'单价', "数量"],
      content: [],
      //采购清单list
      purchaseDetailList: [],
      //该页面字段方法数据
      data: data,
      //该页面数据名
      page: "inStorage",
      //表单列表
      listData: [],
      //表单值
      formData: {},
      isBack: false,
      isEdit: false,
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
          title: '入库单-详情'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
      formData: {
      handler(newVal, oldVal) {
        if(!this.isBack&&!this.isEdit&&!this.isApproval){
          this.showoperate=false
        }else{
          this.showoperate=true
        }
        // this.getData()
      },
    },
  },
  methods: {
     //操作
    operate() {
     let a1=this.isEdit?['编辑','删除']:[];
     let a2=this.isBack?['回撤']:[];
     let a3 =this.isApproval?['同意','驳回']:[];
     let b1=this.isEdit?['edit','del']:[];
     let b2=this.isBack?['back']:[];
     let b3 =this.isApproval?['agree','disagree']:[];
     let a0=[...a1,...a2,...a3];
     let b0=[...b1,...b2,...b3];
        wx.showActionSheet({
          itemList: a0,
        success:(res) =>{
          this[b0[res.tapIndex]]()
        },
        fail:(res)=> {
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
           wx.showToast({
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
        formId: 6,
        id: this.$route.query.id,
      };
      data["inStorage"].getData(params).then((res) => {
        this.formData = {
          userName: res.data.data.userName,
          purchaseId: res.data.data.purchaseId,
          inDate: res.data.data.inDate,
          inType: res.data.data.inType == 1 ? "采购" : "调拨",
        };
         this.isEdit =res.data.data.isEdit == 1 || res.data.data.isEdit === 'undefined' ? true : false;
        this.isBack = res.data.data.isBack == 1 ? true : false;
        this.isApproval=res.data.data.isApproval == 1 ?true:false
        this.orderId = res.data.data.orderId ? res.data.data.orderId : "";
        this.content = res.data.data.stockInDetailVoList.map((item) => {
          return {
            name: item.productName,
            specs: item.specs,
            inQuantity: item.inQuantity,
            unitPrice:item.unitPrice?item.unitPrice:''
          };
        });
      });
    },
    edit() {
       this.$router.push({
        path: "/pages/extraPages/inStorageEdit/main",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    del() {
          let params = {
        id: this.$route.query.id,
        formId: 6,
      };
      data['inStorage'].delFlow(params).then((res) => {
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
    //撤回
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