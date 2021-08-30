<template>
  <div class="allbg">
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
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="
          item.click == 'date'
            ? showDate(item)
            : item.click == 'order'
            ? showOrder(item)
            : ''
        "
      >
        <RadioButton
          :typeList="radioList"
          :active="active"
          @changeData="changeData"
          v-if="item.click == 'radioGroup'"
        ></RadioButton>
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
          <van-stepper
            v-model="item.unitPrice"
            @change="content[index].unitPrice = $event.mp.detail"
            min="0"
            :disabled="stepDisabled"
          />
        </div>
        <div class="content-title">
          <van-stepper
            v-model="item.inQuantity"
            @change="content[index].inQuantity = $event.mp.detail"
            min="0"
            :max="item.waitInQuantity ? item.waitInQuantity : 99999999999"
          />
        </div>
        <div class="content-title" style="color: red" @click="delList(index)">
          删除
        </div>
      </div>
    </div>
    <div class="table-add">
      <van-button round plain hairline type="info" @click="addProduct"
        >添加产品</van-button
      >
    </div>

    <!-- 附件 -->
    <!-- <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy> -->

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="submit2"
    ></Picker>

    <!-- 采购产品弹出层 -->
    <van-popup
      :show="show2"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <ProductItem
        :radioList="ProductItemList"
        @submit="submit3"
        :radio="radio2"
        @cancel="onClose"
      ></ProductItem>
    </van-popup>

    <!-- 流程//流程必有用户弹出层 -->
    <Flow
      :flowStatus="flowStatus"
      :flowId="flowId"
      :flowList="flowList"
      :fitNodeList="fitNodeList"
      @showPopup2="showPopup2"
      @radioChange="radioChange"
    ></Flow>

    <!-- 用户弹出层 -->
    <van-popup
      :show="usershow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="usersubmit" :radio="userradio" @cancel="onClose"></User>
    </van-popup>

    <!-- 订单出层 -->
    <van-popup
      :show="ordershow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <Order
        @submit="ordersubmit"
        :radio="orderradio"
        @cancel="onClose"
      ></Order>
    </van-popup>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存草稿" @click="save(0)" />
      <van-goods-action-button
        type="primary"
        text="保存提交"
        @click="save(1)"
      />
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import Accessroy from "../../../components/apply/accessory";
import RadioButton from "../../../components/radioButton.vue";
import Picker from "../../../components/utils/picker.vue";
import ProductItem from "../../../components/productIemOptions.vue";
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import Order from "../../../components/orderOptions.vue";
import {
  getFlowList,
  getByFlowId,
  getProductItemOptions,
} from "../../../api/api";
export default {
  components: {
    Accessroy,
    Picker,
    ProductItem,
    Flow,
    User,
    Order,
    RadioButton,
  },
  data() {
    return {
      active: 0,
      //入库类型按钮群
      radioList: [],
      //符合的产品选项列表
      ProductItemList: [],
      //采购清单
      title: ["产品名称", "规格型号", "单价", "数量", "操作"],
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
      //附件列表上传索引
      valueIndex: 0,
      //日期选择器
      dateShow: false,
      clickName: "",
      show2: false,
      radio2: "",
      orderradio: "",
      //流程
      flowId: "",
      flowList: [],
      fitNodeList: [],
      flowStatus: "流程数:0",
      popUpType: "",
      nodeId: "",
      //流程中的用户弹窗
      usershow: false,
      ordershow: false,
      userradio: "1",
      stepDisabled: true,
    };
  },
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.radioList = this.data[this.page].radioList;
  },
  onReady() {
    this.getData();
      wx.setNavigationBarTitle({
          title: '入库单-编辑'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
    active: {
      handler(newValue, oldValue) {
        //切换类型的时候清空产品
        // this.content = [];
        if (newValue == 1) {
          this.$set(this.formData, "purchaseId", "");
          this.stepDisabled = false;
        } else {
          this.stepDisabled = true;
        }
      },
      //首次监听
      immediate: true,
      //深度监听
      deep: true,
    },
    //监听产品弹出层
    show2: {
      handler(newValue, oldValue) {
        if (newValue) {
          let params = {
            id: this.formData.purchaseId,
            inType: this.active + 1,
          };
          getProductItemOptions(params).then((res) => {
            this.ProductItemList = res.data.data.map((item) => {
              return {
                id: item.productId,
                productId: item.productId,
                name: item.productName,
                specs: item.specs,
                inQuantity: item.inQuantity,
                unitPrice: item.unitPrice ? item.unitPrice : "",
              };
            });
          });
        } else {
          return;
        }
      },
      //深度监听
      deep: true,
    },
    //产品列表
    content: {
      handler(newValue, oldValue) {
        this.purchaseDetailList = newValue.map((item) => {
          return {
            productId: item.productId,
            inQuantity: item.inQuantity,
            unitPrice: item.unitPrice ? item.unitPrice : "",
          };
        });
      },
      //首次监听
      //  immediate: true,
      //深度监听
      deep: true,
    },
  },
  methods: {
    //获取流程列表
    getData() {
      let params = {
        formId: 6,
        id: this.$route.query.id,
      };
      data["inStorage"].getData(params).then((res) => {
        // Object.keys(this.formData).map(
        //   (item) => (this.formData[item] = res.data.data[item])
        // );
        this.formData = {
          userName: wx.getStorageSync("applyUserName"),
          purchaseId: res.data.data.purchaseId,
          inDate: res.data.data.inDate,
          inType: res.data.data.inType,
        };
        this.content = res.data.data.stockInDetailVoList.map((item) => {
          return {
            productId: item.productId,
            name: item.productName,
            specs: item.specs,
            inQuantity: item.inQuantity,
            unitPrice: item.unitPrice ? item.unitPrice : "",
            // waitInQuantity: item.waitInQuantity
            //   ? item.waitInQuantity
            //   : 999999999,
          };
        });
        this.formData.inType = "";
        this.active = res.data.data.inType - 1;
      });
      let params2 = {
        formId: 6,
      };
      getFlowList(params2).then((res) => {
        if (res.data.data.length >= 1) {
          this.flowStatus = "流程数:" + res.data.data.length;
          this.flowList = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.flowName,
            };
          });
          this.flowId = res.data.data[0].id + "";
          this.getByFlowId();
        } else if (res.data.data.length == 0) {
          console.log("bukeyi");
        }
      });
    },
    //根据流程id查询节点
    getByFlowId() {
      let params = {
        flowId: this.flowId,
      };
      //设置流程列表
      getByFlowId(params).then((res) => {
        this.fitNodeList = res.data.data.map((item) => {
          return {
            ...item,
          };
        });
      });
    },
    //保存或发起
    save(val) {
      let params = {
        id: Number(this.$route.query.id),
        factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData,
        stockInDetailList: this.purchaseDetailList,
        batchId:'',
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: 6,
          flowId: Number(this.flowId),
        },
      };
      params.inType = this.active + 1;
      params.startFlowDto.type = val;
      data["inStorage"].editOrStart(params).then((res) => {
        if(res.data.code == 10000){
              wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
             setTimeout(() => {
               //回退2层
                 this.$router.go(1);
                }, 1000);
             }
      });
    },
    //按钮群点击更换高亮事件
    changeData(item, index) {
      this.active = index;
    },
    //显示日期弹窗
    showDate(val) {
      if (!this.$route.name.includes("Detail")) {
        this.dateShow = true;
        this.clickName = val.name;
        // this.clickValue = val.clickValue;
      } else {
        return;
      }
    },
    //采购订单弹窗
    showOrder() {
      if (this.active == 0) {
        this.ordershow = true;
      } else {
        wx.showToast({
          title: "调拨单无产品订单",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
    },
    //产品弹窗
    addProduct() {
      if (this.formData.purchaseId || this.active == 1) {
        this.show2 = true;
      } else {
        wx.showToast({
          title: "请先添加采购订单",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
    },
    //流程弹窗
    showPopup2(val) {
      this.usershow = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.userradio = val.userId + "";
    },
    //mpvue的更改选择，异步，更改流程列表
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getByFlowId();
    },
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.show2 = false;
      this.usershow = false;
      this.ordershow = false;
    },
    //日期确认
    submit2(val) {
      this.formData[this.clickName] = val;
      //这个的时候他不需要id值 只需要name，value为undifined
      // this.formData[this.clickValue] = val;
      this.dateShow = false;
    },
    //采购订单确认
    ordersubmit(val) {
      this.$set(this.formData, "purchaseId", Number(val.id));
      this.ordershow = false;
    },
    //产品确认
    submit3(val) {
      this.show2 = false;
      this.content.push(val);
    },
    //删除产品列表对应产品
    delList(val) {
      this.content.splice(val, 1);
    },
    //流程选用户后的确认事件
    usersubmit(val) {
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userName",
        val.name
      );
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userId",
        val.id
      );
      this.usershow = false;
    },
  },
};
</script>

<style scoped>
@import "../../../style/list.scss";
</style>