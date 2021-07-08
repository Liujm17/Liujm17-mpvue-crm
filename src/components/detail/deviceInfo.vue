<template>
  <div class="allbg">
    <div class="img">
      <ImageView :src="src" height="100%" />
    </div>
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
        readonly
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      >
      </van-field>
    </van-cell-group>
    <div class="title">关联产品</div>
    <div class="table">
      <div class="table-header">
        <div v-for="(item, index) in title" :key="index" class="header-title">
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-for="(item, index) in content" :key="index">
        <div class="content-title">{{ item.name }}</div>
        <div class="content-title">{{ item.specs }}</div>
      </div>
    </div>
    <div class="tags">
      <van-tag type="primary" size="large">{{ formData.statusName }}</van-tag>
    </div>
    <div class="img">
      <ImageView :src="QRSrc" height="100%" />
    </div>
  </div>
</template>

<script>
import data from "../../api/mockData";
import BottomButton from "../../components/bottomButton.vue";
import ImageView from "../../components/imageView";
import Delete from "../../components/sureDelete";
export default {
  components: { ImageView, BottomButton, Delete },
  props: {
    dataId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      //表单列表
      listData: [],
      //表单值
      formData: {},
      //状态多选按钮
      radioList: [],
      //附件列表
      photoList: [],
      //底部按钮
      btList: [
        { name: "编辑", click: "edit", color: "blue" },
        { name: "删除", click: "del", color: "red" },
      ],
      data: data,
      active: 0,
      page: "deviceInfo",
      //关联产品
      title: ["产品名称", "规格型号"],
      content: [],
      src: "",
      QRSrc: "",
      //删除弹窗
      deleteshow: false,
      //设备id
      deviceId: "",
    };
  },
  onShow() {},
  onReady() {},
  watch: {
    dataId: {
      handler(newVal, oldVal) {
        this.formData = data[this.page].formData;
        this.listData = data[this.page].vanFormData.formData;
        this.getData();
      },
    },
  },
  methods: {
    getData() {
      let params = {
        id: this.dataId,
      };
      data["deviceInfo"].getData(params).then((res) => {
        Object.keys(this.formData).map(
          (item) => (this.formData[item] = res.data.data[item])
        );
        this.content = res.data.data.products.map((item) => {
          return {
            name: item.name,
            specs: item.specs,
          };
        });
        this.src = res.data.data.imgUrl;
        this.QRSrc = res.data.data.qrCodeUrl;
        this.deviceId = res.data.data.id;
      });
    },
    //自定义底部按钮
    clickBt(val) {
      this[val]();
    },
    edit() {
      this.$router.push({
        path: "/pages/extraPages/deviceEdit/main",
        query: {
          id: this.$route.query.id,
          formId: this.$store.state.formId,
        },
      });
    },
    del() {
      this.deleteshow = true;
    },
    quxiao() {
      this.deleteshow = false;
    },
    queding() {
      let params = {
        id: this.$route.query.id,
        factoryId: wx.getStorageSync("factoryId"),
      };
      data["deviceInfo"].delFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        this.deleteshow = false;
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      });
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
.img {
  margin-left: 25%;
  width: 50%;
  height: 150px;
}
.tags {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
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
.empty-text {
  text-align: center;
  margin-top: 2rem;
  font: 24px "隶书";
  color: #84af9b;
}
</style>