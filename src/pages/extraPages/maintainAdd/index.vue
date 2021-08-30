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
        :placeholder="item.value"
        :type="item.type"
        :required="item.required"
        input-align="right"
        :readonly="item.readonly"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        @click="item.click == 'device' ? showDevice() : (item.click == 'date'?showDate(item.name):'')"
      ></van-field>
      <van-field
        v-model="formData.reportId"
        readonly
        label="故障报修单号"
        input-align="right"
        type
        placeholder="故障报修单号"
        @input="formData.reportId = $event.mp.detail"
        v-if="formData.reportId"
      />
    </van-cell-group>
    <div class="polling-info">
      <div class="polling-title">维修结果</div>
      <RadioList :typeList="typeList" :active="active" @changeData="changeData"></RadioList>
    </div>
    <div class="polling-text">
      <van-field
        v-model="repairDetail"
        rows="1"
        autosize
        required
        label="维修详情"
        type="textarea"
        placeholder="维修描述信息"
        @input="repairDetail = $event.mp.detail"
      />
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>

    <!-- 设备出层 -->
    <van-popup
      :show="diviceShow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <DeviciOptions @submit="deviceSubmit" :radio="deviceRadio" @cancel="onClose"></DeviciOptions>
    </van-popup>
    <!-- 时间选择器 -->
    <DateTime :show="timeShow" @cancel="timeCancel" @submit="timeSubmit"></DateTime>
    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存" @click="save()" />
      <van-goods-action-button type="default" text="取消" @click="cancel()" />
    </van-goods-action>
  </div>
</template>

<script>
import Accessroy from "../../../components/apply/accessory";
import RadioList from "../../../components/radioButton.vue";
import DeviciOptions from "../../../components/deviceOptions.vue";
import DateTime from "../../../components/utils/dateTimePicker.vue";
import data from "../../../api/mockData";
import { getDeviceReport } from "../../../api/api";
export default {
  components: { Accessroy, RadioList, DeviciOptions, DateTime },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      repairDetail: "",
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},
      typeList: [
        { value: 0, text: "未解决" },
        { value: 1, text: "已解决" },
      ],
      active: 0,
      deviceRadio: "1",
      diviceShow: false,
      timeShow: false,
      clickName: "",
    };
  },
  onLoad() {
    this.formData = data["maintain"].formData;
    this.listData = data["maintain"].vanFormData.formData;
    this.uuid = data.get_uuid();
    wx.setNavigationBarTitle({
      title: "故障维修-新增" + "(" + wx.getStorageSync("factoryName") + ")",
    });
  },
  onReady() {
    if (this.$route.query.deviceId) {
      this.$set(this.formData, "deviceId", this.$route.query.deviceId);
      this.$set(this.formData, "deviceName", this.$route.query.deviceName);
      this.$set(this.formData, "faultTime", this.$route.query.faultTime);
      this.$set(this.formData, "reportId", this.$route.query.reportId);
    }
    this.formData.repairTime = data.getNowTime();
  },
  onUnload() {
    this.formData.deviceId = "";
    this.formData.reportId = "";
    this.formData.faultTime = "";
    this.formData.deviceName = "";
  },
  watch: {},
  methods: {
    onClose() {
      this.diviceShow = false;
    },
    //显示设备列表
    showDevice() {
      this.diviceShow = true;
    },
    //显示年月日时间
    showDate(val) {
      if (val == "faultTime") {
        if (!this.formData.deviceId) {
          wx.showToast({
            title: "请先选择设备",
            icon: "none",
            duration: 2000,
            mask: true,
          });
        } else {
          if (this.formData.reportId) {
            return;
          } else {
            //赋值点击的值
            this.clickName = val;
            this.timeShow = true;
          }
        }
      } else {
        //赋值点击的值
        this.clickName = val;
        this.timeShow = true;
      }
    },
    //时间选择器取消
    timeCancel() {
      this.timeShow = false;
    },
    timeSubmit(val) {
      this.formData[this.clickName] = val;
      this.timeShow = false;
    },
    //设备列表确定
    deviceSubmit(val) {
      this.$set(this.formData, "deviceId", val.id);
      this.$set(this.formData, "deviceName", val.name);
      let params = {
        deviceId: val.id,
      };
      wx.showLoading({
        title: "正在加载数据,请稍等",
      });
      getDeviceReport((params = params)).then((res) => {
        let faultTime = res.data.data ? res.data.data.faultTime : "";
        let id = res.data.data ? res.data.data.id : "";
        this.$set(this.formData, "reportId", id);
        this.$set(this.formData, "faultTime", faultTime);
        this.diviceShow = false;
        wx.hideLoading();
      });
    },
    //更换正常异常
    changeData(item, index) {
      this.active = index;
    },
    //保存
    save() {
      let params = {
        ...this.formData,
        repairResult: this.active,
        repairDetail: this.repairDetail,
        batchId: "",
        factoryId: wx.getStorageSync("factoryId"),
        reportUser: wx.getStorageSync("UserId"),
        reportUserName: wx.getStorageSync("applyUserName"),
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["maintain"].saveOrStart(params).then((res) => {
            if (this.$route.query.deviceId) {
              if (res.data.code == 10000) {
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 3000,
                  mask: true,
                });
                //重启到某页面，如不是tabar页面会有回主页按钮
                this.$router.go(2);
              }
            } else {
              if (res.data.code == 10000) {
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 3000,
                  mask: true,
                });
                //重启到某页面，如不是tabar页面会有回主页按钮
                this.$router.back();
              }
            }
          });
        });
      } else {
        data["maintain"].saveOrStart(params).then((res) => {
          if (this.$route.query.deviceId) {
            if (res.data.code == 10000) {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 3000,
                mask: true,
              });
              //重启到某页面，如不是tabar页面会有回主页按钮
              this.$router.go(2);
            }
          } else {
            if (res.data.code == 10000) {
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 3000,
                mask: true,
              });
              //重启到某页面，如不是tabar页面会有回主页按钮
              this.$router.back();
            }
          }
        });
      }
    },
    //取消
    cancel() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
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