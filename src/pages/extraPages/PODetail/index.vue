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
            :readonly="true"
            :rules="[{ required: true, message: '请填写' + item.value }]"
            @input="formData[item.name] = $event.mp.detail"
          >
          </van-field>
        </van-cell-group>

        <!-- 关联产品 -->
        <div class="title">采购清单</div>
        <div class="table">
          <div class="table-header">
            <div
              v-for="(item, index) in title"
              :key="index"
              class="header-title"
            >
              {{ item }}
            </div>
          </div>
          <div
            class="table-content"
            v-for="(item, index) in content"
            :key="index"
          >
            <div class="content-title">{{ item.name }}</div>
            <div class="content-title">{{ item.specs }}</div>
            <div class="content-title">{{ item.unitPrice }}</div>
            <div class="content-title">{{ item.purchaseQuantity }}</div>
            <div class="content-title">{{ item.totalPrice }}</div>
          </div>
        </div>
        <Accessroy
          :photoList="photoList"
          :onlyOne="false"
          :notShow="false"
        ></Accessroy>
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
import Accessroy from "../../../components/apply/accessory";
import BottomButton from "../../../components/bottomButton.vue";
import Delete from "../../../components/sureDelete";
import Card from '../../../components/card.vue'
import { backFlow } from "../../../api/api";
export default {
  components: { Accessroy, BottomButton, Delete,Card },
  data() {
    return {
      //tab栏激活页
       hisTitle: ["审批步骤", "处理人", "处理时间","结果"],
      active: 0,
      HistoryList:[],
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
      orderId: "",
    };
  },
  onShow() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.getData();
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
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      //获取表单数据
      data["PO"].getData(params).then((res) => {
        Object.keys(this.formData).map(
          (item) => (this.formData[item] = res.data.data[item])
        );
        this.isBack = res.data.data.isBack == 0 ? false : true;
        this.isEdit = res.data.data.isEdit == 0 ? false : true;
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