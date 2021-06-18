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
          {{ item.unitPrice }}
        </div>
        <div class="content-title">
          {{ item.inQuantity }}
        </div>
      </div>
    </div>
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
    <van-goods-action>
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
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import { backFlow } from "../../../api/api";
import Card from '../../../components/card.vue'
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
      orderId: "",
    };
  },
  onShow() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.getData();
  },
  watch: {
    
  },
  methods: {
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
      data["inStorage"].getData(params).then((res) => {
        this.formData = {
          userName: wx.getStorageSync("applyUserName"),
          purchaseId: res.data.data.purchaseId,
          inDate: res.data.data.inDate,
          inType: res.data.data.inType == 1 ? "采购" : "调拨",
        };
        this.isBack = res.data.data.isBack == 0 ? false : true;
        this.isEdit = res.data.data.isEdit == 0 ? false : true;
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
        formId: this.$store.state.formId,
      };
      data['inStorage'].delFlow(params).then((res) => {
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