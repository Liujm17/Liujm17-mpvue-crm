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
      >
      </van-field>
    </van-cell-group>
   <div class="polling-info">
      <div class="polling-title">设备状态</div>
      <RadioList
        :typeList="typeList"
        :active="active"
        @changeData="changeData"
      ></RadioList>
    </div>
    <div class="polling-text">
      <van-field
        v-model="faultReason"
        rows="1"
        autosize
        label="故障原因"
        type="textarea"
        placeholder="故障报修描述信息"
           @input="faultReason = $event.mp.detail"
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
      <DeviciOptions
        @submit="deviceSubmit"
        :radio="deviceRadio"
        @cancel="onClose"
      ></DeviciOptions>
    </van-popup>
    <!-- 时间选择器 -->
    <DateTime :show="timeShow" @cancel='timeCancel' @submit="timeSubmit"></DateTime>
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
import DeviciOptions from '../../../components/deviceOptions.vue'
import DateTime from '../../../components/utils/dateTimePicker.vue'
import data from "../../../api/mockData";
export default {
  components: { Accessroy, RadioList ,DeviciOptions,DateTime},
  data() {
    return {
      data: data,
      uuid: '',
      //问题描述
      faultReason: "",
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},
      typeList: [
        { value: 1, text: "运行中" },
        { value: 2, text: "停机维修" },
        { value: 3, text: "未上线" },
      ],
      active: 0,
      deviceRadio:'1',
      diviceShow:false,
      timeShow:false,
      clickName:''
    };
  },
  onLoad() {
    this.formData = data["breakdown"].formData;
    this.listData = data["breakdown"].vanFormData.formData;
    this.uuid= data.get_uuid()
  },
  watch: {},
  methods: {
    onClose(){
     this.diviceShow=false
    },
    //显示设备列表
    showDevice(){
       this.diviceShow=true
    },
    //显示年月日时间
    showDate(val){
      //赋值点击的值
      this.clickName=val
      this.timeShow=true
    },
    //时间选择器取消
    timeCancel(){
      this.timeShow=false
    },
    timeSubmit(val){
      this.formData[this.clickName]=val
      this.timeShow=false
    },
    //设备列表确定
    deviceSubmit(val){
         this.$set(this.formData, "deviceId", val.id);
         this.$set(this.formData, "deviceName", val.name);
         this.diviceShow=false
    },
    //更换正常异常
    changeData(item, index) {
      this.active = index;
    },
    //保存
    save() {
      let params = {
        ...this.formData,
        deviceStatus: this.active == "0" ? "运行中" : (this.active == '1'?'停机维护':'未上线'),
        faultReason: this.faultReason,
        batchId: "",
        factoryId: 2020001,
        reportUser:wx.getStorageSync("UserId"),
        reportUserName:wx.getStorageSync("applyUserName"),
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.photoList.length > 0) {
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["breakdown"].saveOrStart(params).then((res) => {
             if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.back();
            }
          });
        });
      } else {
        data["breakdown"].saveOrStart(params).then((res) => {
           if(res.data.code == 10000){
              mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.back();
            }
        });
      }
    },
    //取消
    cancel() {},
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