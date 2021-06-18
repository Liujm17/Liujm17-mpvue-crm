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
        :required="item.required"
        input-align="right"
        :readonly="readonly ? readonly : item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="item.click == 'date' ? showDate(item) : ''"
      >
        <RadioButton
          :typeList="radioList"
          :active="active"
          @changeData="changeData"
          v-if="item.click == 'radioGroup'"
        ></RadioButton>
      </van-field>
    </van-cell-group>

    <!-- 附件 -->
    <Accessroy :photoList="photoList"></Accessroy>

    <!-- 关联产品 -->
    <div class="title">关联配件</div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.specs }}</div>
        <div class="content-title" style="color: red" @click="delList(index)">
          删除
        </div>
      </div>
    </div>
    <div class="table-add">
      <van-button round plain hairline type="info" @click="addProduct"
        >添加配件</van-button
      >
    </div>

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="dateSubmit"
    ></Picker>

    <!-- 产品弹出层 -->
    <van-popup
      :show="productShow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <Product
        @submit="productSubmit"
        :radio="productRadio"
        @cancel="onClose"
      ></Product>
    </van-popup>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存" @click="save()" />
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import RadioButton from "../../../components/radioButton";
import Accessroy from "../../../components/apply/accessory";
import Picker from "../../../components/utils/picker.vue";
import Product from "../../../components/productOptions.vue";
export default {
  components: { RadioButton, Accessroy, Picker, Product },
  data() {
    return {
      //该页面字段方法数据
      data: data,
      uuid:'',
      //表单列表
      listData: [],
      //表单值
      formData: {},
      //状态多选按钮
      radioList: [],
      //附件列表
      photoList: [],
      active: 0,
      page: "deviceInfo",
      //关联产品
      title: ["产品名称", "规格型号", "操作"],
      content: [],
      //日期选择器
      dateShow: false,
      clickName: "",
      //产品弹窗相关
      productShow: false,
      productRadio: "1",
    };
  },
  onLoad() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.radioList = this.data[this.page].radioList;
     this.uuid= data.get_uuid(),
    this.formData.statusName=''
  },
  methods: {
    //按钮群点击更换高亮事件
    changeData(item, index) {
      this.active = index;
    },
    //保存
    save() {
      let params = {
        ...this.formData,
        fileCode: "",
        factoryId: 2020001,
        systemCode: "05",
        userId: wx.getStorageSync("UserId"),
      };
      params.status = this.active + 1;
      params.productIds = this.content.map((item) => Number(item.id));
      if (this.photoList.length > 0) {
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.fileCode = resData.data.code;
          data["deviceInfo"].saveOrStart(params).then((res) => {
             mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        this.$router.back()
          });
        });
      } else {
        data["deviceInfo"].saveOrStart(params).then((res) => {
            mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 3000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        this.$router.back()
        });
      }
    },
    //关闭弹窗
    onClose() {
      this.dateShow = false;
      this.productShow = false;
    },
    //打开日期弹窗
    showDate(val) {
      if (!this.$route.name.includes("Detail")) {
        this.dateShow = true;
        this.clickName = val.name;
      } else {
        return;
      }
    },
    //日期选择确定
    dateSubmit(val) {
      this.formData[this.clickName] = val;
      this.dateShow = false;
    },
    //产品弹窗确认
    productSubmit(val) {
      this.content.push(val);
      this.productShow = false;
    },
    //删除产品列表对应产品
    delList(val) {
      this.content.splice(val, 1);
    },
    //产品弹窗
    addProduct() {
      this.productShow = true;
    },
  },
};
</script>


<style scoped>
.allbg {
  margin-bottom: 150px;
}
.title {
  color: gray;
  font-size: 13px;
}
</style>
<style lang="scss" scoped>
.table-add {
  width: 100%;
  font-size: 25px;
  text-align: center;
  color: black;
  font-weight: 500;
}
.table {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .table-header {
    display: flex;
    line-height: 40px;
    background-color: #87cefa;
    border-left: 1px solid;
    border-top: 1px solid;
    .header-title {
      flex: 1;
      text-align: center;
      color: #666666;
      font-weight: 700;
      border-right: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .table-content {
    display: flex;
    line-height: 40px;
    border-left: 1px solid #999999;
    border-top: 1px solid #999999;
    .content-title {
      flex: 1;
      text-align: center;
      border-right: 1px solid #999999;
      border-bottom: 1px solid #999999;
    }
  }
}
</style>