<template>
  <div class="allbg">
    <van-tabs :active="active" @change="change">
      <van-tab title="详情">
        <div class="title">基本信息</div>
        <van-cell-group>
          <van-field v-model="id" label="采购订单编号" readonly input-align="right" @input="id = $event.mp.detail" />
          <van-field v-for="(item, index) in listData" :key="index" v-model="formData[item.name]" :name="item.value" :label="item.value" :placeholder="item.click == 'radioGroup' ? '' : item.value"
            :type="item.type" :autosize="item.type == 'textarea' ? true : false" input-align="right" :readonly="true" :rules="[{ required: true, message: '请填写' + item.value }]"
            @input="formData[item.name] = $event.mp.detail"></van-field>
        </van-cell-group>

        <!-- 关联产品 -->
        <div class="title">采购清单</div>
        <div class="table">
          <div class="table-header">
            <div v-for="(item, index) in title" :key="index" class="header-title">{{ item }}</div>
          </div>
          <div class="table-content" v-for="(item, index) in content" :key="index">
            <div class="content-title">{{ item.name }}</div>
            <div class="content-title" v-if="approveStep==3">{{ item.unitPrice }}</div>
            <div class="content-title">{{ item.purchaseQuantity }}</div>
            <div class="content-title" v-if="approveStep==3">{{ item.totalPrice }}</div>
          </div>
        </div>
        <Accessroy :photoList="photoList2" :onlyOne="false" :notShow="false"  v-if="approveStatus==1"></Accessroy>
        <van-field v-model="suggestion" @input="suggestion = $event.mp.detail" rows="1" autosize label="意见" type="textarea" placeholder="请输入意见" v-if="isApproval" />
        <van-button type="info" size="normal" @click="operate" v-if="showoperate">操作</van-button>
        <van-button type="info" size="normal" @click="operate2" v-if="approveStatus==1">操作</van-button>
      </van-tab>

      <van-tab title="付款申请" v-if="!showoperate">
        <div>
          <Card :more="false" :cardList="payCardList" @toDetail="payToDetail" v-if="payCardList.length > 0"></Card>
          <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>
      <van-tab title="入库单" v-if="!showoperate">
        <div>
          <Card :more="false" :cardList="inCardList" @toDetail="inToDetail" v-if="inCardList.length > 0"></Card>
          <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>

      <van-tab title="日志">
        <div class="header">
          <div v-for="(item, index) in hisTitle" :key="index" class="title">{{ item }}</div>
        </div>
        <Card2 :cardList="HistoryList"></Card2>
      </van-tab>
    </van-tabs>
    <div class="mask" v-if="maskShow">
      <div class="mask-item">
        <!-- 采购清单 -->
        <div class="table">
          <div class="table-header">
            <div v-for="(item, index) in title2" :key="index" class="header-title">{{ item }}</div>
          </div>
          <div class="table-content" v-for="(item, index) in content" :key="index">
            <div class="content-title">{{ item.name }}</div>
            <div class="content-title">
              <van-stepper v-model="item.unitPrice" @change="content[index].unitPrice = $event.mp.detail" min="0" />
            </div>
            <div class="content-title">{{ item.purchaseQuantity }}</div>
            <div class="content-title">{{ item.totalPrice }}</div>
          </div>
        </div>

        <van-field v-for="(item, index) in listData2" :key="index" v-model="formData2[item.name]" :name="item.value" :label="item.value" :placeholder="item.click == 'radioGroup' ? '' : item.value"
          :type="item.type" :autosize="item.type == 'textarea' ? true : false" :required="item.required" :readonly="readonly ? readonly : item.readonly" input-align="right"
          :rules="[{ required: true, message: '请填写' + item.value }]" @input="formData2[item.name] = $event.mp.detail" @click="
          item.click == 'date'
            ? showDate(item)
            : item.click == 'provider'
            ? showProvider(item)
            : ''
        " />
        <div style="width:100%;height:200px"></div>
        <div class="mask-bt">
          <span @click="maskShow=false">取消</span>
          <span @click="maskSubmit">同意</span>
        </div>
      </div>
    </div>

    <!-- 第三步弹出层 -->
    <div class="mask" v-if="maskShow2">
      <div class="mask-item" style="padding:0 20px;box-sizing:border-box">
        <h1 style="text-align:center">上传附件</h1>
        <!-- 附件 -->
        <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>
        <div style="width:100%;height:200px"></div>
        <div class="mask-bt">
          <span @click="maskShow2=false">取消</span>
          <span @click="maskSubmit2">同意</span>
        </div>
      </div>
    </div>

    <!-- 日期 -->
    <Picker :show="dateShow" click="date" :formData="formData" :clickName="clickName" @cancel="onClose" @submit="submit2"></Picker>
    <!-- 供应商弹出层 -->
    <van-popup :show="show" position="right" custom-style="width: 80%; height: 100%;" @close="onClose">
      <Provider @submit="submit" :radio="radio" @cancel="onClose"></Provider>
    </van-popup>

    <van-dialog2 id="van-dialog" />
  </div>
</template>

<script>
import data from "../../../api/mockData";
import Accessroy from "../../../components/apply/accessory";
import BottomButton from "../../../components/bottomButton.vue";
import Delete from "../../../components/sureDelete";
import Picker from "../../../components/utils/picker.vue";
import Provider from "../../../components/providerOptions.vue";
import Card from "../../../components/boxCard";
import Card2 from "../../../components/boxCard";
import { backFlow, agree, disagree } from "../../../api/api";
import Dialog2 from "../../../../dist/wx/vant-weapp/dist/dialog2/dialog";
export default {
  components: { Accessroy, BottomButton, Delete, Card, Card2, Picker, Provider },
  data() {
    return {
      id: "",
      //tab栏激活页
      hisTitle: [],
      active: 0,
      HistoryList: [],
      payCardList: [],
      inCardList: [],
      //采购清单
      title: ["产品名称", "单价", "数量", "总金额"],
      title2: ["产品名称", "单价", "数量", "总金额"],
      content: [],
      //采购清单string
      purchaseDetailJson: "",
      //该页面字段方法数据
      data: data,
      //该页面数据名
      page: "PO",
      //表单列表
      listData: [],
      formData: {},
      //表单值
      formData2: {
        supplierId: '',
        supplierName: '',
        supplierContacts: '',
        supplierPhone: '',
        totalPrice: 0
      },
      formData3: {
        userName: wx.getStorageSync('applyUserName'),
        supplierId: '',
        supplierName: '',
        supplierContacts: '',
        supplierPhone: '',
        purchaseDate: '',
        purpose: '',
        type: '',
        totalPrice: 0
      },
      listData2: [
        {
          name: 'supplierName',
          value: '供应商名称',
          click: 'provider',
          type: '',
          required: true,
          readonly: true
        },
        {
          name: 'supplierContacts',
          value: '供应商联系人',
          click: 'provider',
          type: '',
          required: true,
          readonly: true
        },
        {
          name: 'supplierPhone',
          value: '供应商电话',
          click: 'provider',
          type: 'digit',
          required: true,
          readonly: true
        },
        {
          name: 'estimateArrivalDate',
          value: '预计到货日期',
          click: 'date',
          type: '',
          required: true,
          readonly: true
        },
        {
          name: 'totalPrice',
          value: '采购总金额',
          click: '',
          type: '',
          required: false,
          readonly: true
        },
      ],
      listData3: [{
        name: 'userName',
        value: '采购人',
        click: 'normal',
        type: '',
        required: true,
        readonly: true
      },
      {
        name: 'purchaseDate',
        value: '采购日期',
        click: 'date',
        type: '',
        required: true,
        readonly: true
      },
      {
        name: 'supplierName',
        value: '供应商名称',
        click: 'provider',
        type: '',
        required: true,
        readonly: true
      },
      {
        name: 'supplierContacts',
        value: '供应商联系人',
        click: 'normal',
        type: '',
        required: true,
        readonly: false
      },
      {
        name: 'supplierPhone',
        value: '供应商电话',
        click: 'normal',
        type: 'digit',
        required: false,
        readonly: false
      },
      {
        name: 'estimateArrivalDate',
        value: '预计到货日期',
        click: 'date',
        type: '',
        required: true,
        readonly: true
      },
      {
        name: 'totalPrice',
        value: '采购总金额',
        click: '',
        type: '',
        required: false,
        readonly: true
      },
      {
        name: 'purpose',
        value: '用途',
        click: '',
        type: 'textarea',
        required: false,
        readonly: false
      },],
      //附件列表
      photoList: [],
      photoList2: [],
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
      orderId: "",
      //mask
      maskShow: false,
      maskShow2: false,
      //审核步骤
      approveStep: '',
      approveStatus: ''
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
  onUnload(){
     if(this.approveStep==2){
       this.formData2.supplierId=''
       this.formData2.supplierName=''
       this.formData2.supplierContacts=''
       this.formData2.supplierPhone=''
     }
      this.approveStep= '',
      this.approveStatus= ''
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
    approveStep: {
      handler(newVal, oldVal) {
        if (newVal == 2 || newVal == 0) {
          this.title = ["产品名称", "数量"]
        } else {
           if (!this.isApproval) {
            if(this.approveStatus){
              this.title = ["产品名称", "单价", "数量", "总金额"],
            this.listData = this.listData3
            this.formData = this.formData3
            }else{
               this.title = ["产品名称", "单价", "数量", "总金额"],
              this.listData = this.listData
            this.formData = this.formData
            }
          }else{
             this.title = ["产品名称", "单价", "数量", "总金额"],
              this.listData = this.listData
            this.formData = this.formData
          }
        }
      }
    },
    content: {
      handler(newValue, oldValue) {
        newValue.forEach((item) => {
          item.totalPrice = item.unitPrice * item.purchaseQuantity
        })
        this.formData2.totalPrice = newValue.reduce((total, item) => total + item.unitPrice * item.purchaseQuantity, 0)
        this.purchaseDetailList = newValue.map((item) => {
          return {
            productId: item.id,
            unitPrice: item.unitPrice,
            purchaseQuantity: item.purchaseQuantity,
            totalPrice: item.totalPrice
          }
        })
      },
      //首次监听
      //  immediate: true,
      //深度监听
      deep: true,
    },
  },
  methods: {
    //日期确认
    submit2(val) {
      this.formData2[this.clickName] = val;
      //这个的时候他不需要id值 只需要name，value为undifined
      // this.formData[this.clickValue] = val;
      this.dateShow = false;
    },
    //供应商确认
    submit(val) {
      this.$set(this.formData2, "supplierId", val.id);
      this.$set(this.formData2, "supplierName", val.name);
      this.$set(this.formData2, "supplierContacts", val.contacts);
      this.$set(this.formData2, "supplierPhone", val.phone);
      this.show = false;
    },
    showDate(val) {
      this.dateShow = true;
      this.clickName = val.name;
    },
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.show = false;
    },
    //显示供应商列表弹窗
    showProvider(val) {
      this.show = true;
    },
    //
    maskSubmit() {
      this.maskShow = false
      let params = {
        factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData2,
        purchaseDetailList: this.purchaseDetailList,
        batchId: this.uuid,
        deleteIds: this.deleteList,
        id: Number(this.$route.query.id),
        startFlowDto: {
          type: 2,
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: 5,
          flowId: Number(this.flowId),
        },
      };

      data["PO"].editOrStart2(params).then((res) => {
        if (res.data.code == 10000) {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 3000,
            mask: true,
          });
          //重启到某页面，如不是tabar页面会有回主页按钮
          setTimeout(() => {
            //回退2层
            let params = {
              orderId: this.orderId,
              suggestion: this.suggestion,
            };
            agree(params).then((res) => {
              this.getData();
              this.$router.back();
            });
          }, 1000);
        }
      });
    },
    maskSubmit2() {
      let params = {
        factoryId: wx.getStorageSync("factoryId"),
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
        ...this.formData3,
        batchId: this.uuid,
         purchaseDetailList: this.purchaseDetailList,
        id: Number(this.$route.query.id),
        startFlowDto: {
          type: 2,
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: 5,
          flowId: Number(this.flowId),
        },
      };
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["PO"].editOrStart2(params).then((res) => {
            this.maskShow2 = false
            if (res.data.code == 10000) {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 3000,
                mask: true,
              });
              //重启到某页面，如不是tabar页面会有回主页按钮
              setTimeout(() => {
                //回退2层
                let params = {
                  orderId: this.orderId,
                  suggestion: this.suggestion,
                };
                agree(params).then((res) => {
                  this.getData();
                  this.$router.back();
                });
              }, 1000);
            }
          });
        });
      } else {
        wx.showToast({
          title: '请先上传附件',
          icon: "none",
          duration: 3000,
          mask: true,
        });
      }

    },
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
              path: "/pages/extraPages/paymentAdd/main",
              query: {
                data: "payment",
                supplierId: this.formData.supplierId,
                supplierName: this.formData.supplierName,
                supplierContacts: this.formData.supplierContacts,
                supplierPhone: this.formData.supplierPhone,
              },
            });
          } else if (res.tapIndex == 1) {
            this.$router.push({
              path: "/pages/extraPages/inStorageAdd/main",
              query: {
                data: "inStorage",
                purchaseId: this.id
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
          wx.showToast({
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
          wx.showToast({
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
          wx.showToast({
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
        formId: 5,
        id: this.$route.query.id,
      };
      //获取表单数据
      data["PO"].getData(params).then((res) => {
        this.id = res.data.data.id;
        this.approveStep = res.data.data.approveStep;
        this.approveStatus = res.data.data.approveStatus
        this.formData = {
          userName: res.data.data.userName,
          supplierId: res.data.data.supplierId,
          supplierName: res.data.data.supplierName,
          supplierContacts: res.data.data.supplierContacts,
          supplierPhone: res.data.data.supplierPhone,
          purchaseDate: res.data.data.purchaseDate,
          purpose: res.data.data.purpose,
          totalPrice: res.data.data.totalPrice,
          estimateArrivalDate: res.data.data.estimateArrivalDate
        };
        this.formData3 = {
          userName: res.data.data.userName,
          supplierId: res.data.data.supplierId,
          supplierName: res.data.data.supplierName,
          supplierContacts: res.data.data.supplierContacts,
          supplierPhone: res.data.data.supplierPhone,
          purchaseDate: res.data.data.purchaseDate,
          purpose: res.data.data.purpose,
          totalPrice: res.data.data.totalPrice,
          estimateArrivalDate: res.data.data.estimateArrivalDate
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
            id: item.productId,
            name: item.productName,
            purchaseQuantity: item.purchaseQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice ? item.totalPrice : 0,
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
          this.photoList2 = res.data.data.fileList
          ? res.data.data.fileList.map((item) => {
            return {
              type: item.type == 0 ? "image" : "video",
              img: item.type == 0 ? item.address : "",
              video: item.type == 1 ? item.address : "",
            };
          })
          : [];
        this.uuid = res.data.data.batchId ? res.data.data.batchId : this.data.get_uuid()
      });
    },
    //删除
    del() {
      let params = {
        id: this.$route.query.id,
        formId: 5,
      };
      data["PO"].delFlow(params).then((res) => {
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
      if (this.approveStep == 2) {
        this.maskShow = true
      } else if (this.approveStep == 3) {
        this.maskShow2 = true
      }
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
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  .mask-item {
    width: 100%;
    min-height: 300px;
    background: white;
    box-sizing: border-box;
    position: relative;
    .mask-group {
      width: 100%;
      padding: 0 10px;
      min-height: 150px;
      overflow-y: auto;
      .select {
        text-align: center;
        font-size: 20px;
        line-height: 30px;
        border-bottom: 1px solid #1ba9ba;
      }
    }
    .mask-bt {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        height: 100%;
        flex: 1;
        text-align: center;
        border: 1px solid gray;
      }
    }
  }
}
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