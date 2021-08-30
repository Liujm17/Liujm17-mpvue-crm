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
      listData: [
        {
          name: 'name',
          value: '设备名称',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'serialNumber',
          value: '设备序号',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'address',
          value: '设备地点',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'statusName',
          value: '设备状态',
          click: 'radioGroup',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'producer',
          value: '生产商名称',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'salesman',
          value: '售后联系人',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'salesmanPhone',
          value: '售后电话',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'specification',
          value: '规格型号',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'productionTime',
          value: '出厂日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'scrapTime',
          value: '预计报废日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'maintenanceDay',
          value: '保养周期(单位：天)',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'nextMaintainTime',
          value: '下次保养日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'nameplate',
          value: '铭牌信息',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
      ],
      //表单值
      formData: {
        name:"",
      serialNumber:'',
      address:'',
      status:'',
      statusName:'',
      producer:'',
      salesman:'',
      salesmanPhone:'',
      specification: '',
      productionTime:'',
      scrapTime:'',
      maintenanceDay:'',
      nextMaintainTime:'',
      nameplate: '',
      },
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
  onShow() {
    
  },
  onReady() {
    
  },
  watch: {
    dataId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.getData()
        }
      },
      deep:true,
      immediate:true
    },
  },
  methods: {
    async getData() {
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
          formId: 4,
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
        wx.showToast({
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
      font-size:15px;
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