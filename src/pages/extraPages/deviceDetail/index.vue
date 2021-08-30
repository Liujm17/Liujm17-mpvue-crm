<template>
  <div class="allbg">
    <van-tabs :active="tabsActive" @change="tabsChange">
      <van-tab title="详情">
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
          </div>
        </div>
        <div class="tags">
          <van-tag type="primary" size="large">{{
            formData.statusName
          }}</van-tag>
        </div>
        <div class="img">
          <ImageView :src="QRSrc" height="100%" />
        </div>
         <van-button type="info" size="normal" @click="operate">操作</van-button>
      </van-tab>
      <van-tab title="巡检记录">
        <div>
          <Card
            :more="false"
            :cardList="cardList"
            @toDetail="toDetail"
            v-if="cardList.length > 0"
          ></Card>
           <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>
       <van-tab title="报修记录">
        <div>
          <Card
            :more="false"
            :cardList="cardList2"
            @toDetail="toDetail2"
            v-if="cardList2.length > 0"
          ></Card>
           <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>
       <van-tab title="保养记录">
        <div>
          <Card
            :more="false"
            :cardList="cardList3"
            @toDetail="toDetail3"
            v-if="cardList3.length > 0"
          ></Card>
           <div class="empty-text" v-else>暂无记录</div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 删除或者回撤弹出层 -->
    <van-popup
      :show="deleteshow"
      position="bottom"
      custom-style="width: 100%; min-height: 30%;display:flex;flex-direction: column;justify-content: center;"
      @close="quxiao"
    >
      <Delete @quxiao="quxiao" @queding="queding"></Delete>
    </van-popup>

    <!-- <BottomButton :btList="btList" @clickBt="clickBt"></BottomButton> -->
  </div>
</template>

<script>
import data from "../../../api/mockData";
import BottomButton from "../../../components/bottomButton.vue";
import ImageView from "../../../components/imageView";
import Delete from "../../../components/sureDelete";
import Card from "../../../components/boxCard.vue";
export default {
  components: { ImageView, BottomButton, Delete, Card},
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
      //巡检记录
      tabsActive: 0,
      cardList:[],
      cardList2:[],
      cardList3:[],
      page: "deviceInfo",
      //关联产品
      title: ["产品名称", "规格型号"],
      content: [],
      src: "",
      QRSrc: "",
      //删除弹窗
      deleteshow: false,
      //设备id
      deviceId:''
    };
  },
  onShow() {
    this.formData = this.data[this.page].formData;
    this.listData = this.data[this.page].vanFormData.formData;
    this.getData();
      wx.setNavigationBarTitle({
          title: '设备信息-详情'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  methods: {
     //操作
    operate() {
     let a1=['编辑','删除'];
     let b1=['edit','del'];
        wx.showActionSheet({
          itemList: a1,
        success:(res) =>{
          this[b1[res.tapIndex]]()
        },
        fail:(res)=> {
          console.log(res.errMsg);
        },
      });
    },
    //巡检详情
    toDetail(val){
        this.$router.push({
        path: '/pages/extraPages/pollingDetail/main',
        query: {
          id: val.id,
        },
      });
    },
     //报修详情
    toDetail2(val){
        this.$router.push({
        path: '/pages/extraPages/breakdownDetail/main',
        query: {
          id: val.id,
        },
      });
    },
     //保养详情
    toDetail3(val){
        this.$router.push({
        path: '/pages/extraPages/upkeepDetail/main',
        query: {
          id: val.id,
        },
      });
    },
    //切换tab
    tabsChange(val) {
      //切换标签页面
      if (val.mp.detail.title == "巡检记录") {
        let params = {
        pageNum: 1,
        pageSize: 999999999,
        searchValues: '',
        deviceId: this.deviceId ? this.deviceId : "",
      };
      data['polling'].getRecord(params).then((res) => {
        this.cardList = res;
      });
      }else if(val.mp.detail.title == "报修记录"){
           let params = {
        pageNum: 1,
        pageSize: 999999999,
        searchValues: '',
        deviceId: this.deviceId ? this.deviceId : "",
      };
      data['breakdown'].getRecord(params).then((res) => {
        this.cardList2 = res;
      });
      }else if(val.mp.detail.title == "保养记录"){
            let params = {
        pageNum: 1,
        pageSize: 999999999,
        searchValues: '',
        deviceId: this.deviceId ? this.deviceId : "",
      };
      data['upkeep'].getRecord(params).then((res) => {
        this.cardList3 = res;
      });
      }
    },
    showDetail() {},
    getData() {
      let params = {
        formId: 4,
        id: this.$route.query.id,
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
        this.deviceId=res.data.data.id
        //  Object.keys(this.formData).map((item)=>this.formData[item]=res.data.data[item])
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
@import "../../../style/list.scss";
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