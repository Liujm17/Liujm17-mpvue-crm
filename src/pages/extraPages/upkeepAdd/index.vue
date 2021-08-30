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
        @click="item.click == 'device' ? showDevice() : (item.click == 'date'?showDate(item):'')"
      >
      </van-field>
    </van-cell-group>
    <div class="polling-text">
      <van-field
        v-model="remarks"
        rows="1"
        autosize
        required
        label="保养详情"
        type="textarea"
        placeholder="保养描述信息"
           @input="remarks = $event.mp.detail"
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

      <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="dateSubmit"
    ></Picker>

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
import Picker from '../../../components/utils/picker.vue'
import data from "../../../api/mockData";
export default {
  components: { Accessroy, RadioList ,DeviciOptions,Picker},
  data() {
    return {
      data: data,
      uuid: '',
      //问题描述
      remarks: "",
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},
      typeList: [
        { value: 0, text: "未解决" },
        { value: 1, text: "已解决" }
      ],
      active: 0,
      deviceRadio:'1',
      diviceShow:false,
      clickName:'',
      dateShow:false,
    };
  },
  onLoad() {
    this.formData = data["upkeep"].formData;
    this.listData = data["upkeep"].vanFormData.formData;
    this.uuid= data.get_uuid()
     wx.setNavigationBarTitle({
          title: '保养记录-新增'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
    'formData.maintainTime':{
      handler(newVal,oldVal){
        if(newVal){
       this.formData.nextMaintainTime=data.formattingTime(new Date(newVal.replace(/-/g,'/')).getTime()+24*3600*1000*this.formData.maintenanceDay).replace('0:0:0','')
        }
      },
      immediate:false
    },
    'formData.maintenanceDay':{
      handler(newVal,oldVal){
        if(newVal&&this.formData.maintainTime){
       this.formData.nextMaintainTime=data.formattingTime(new Date(this.formData.maintainTime.replace(/-/g,'/')).getTime()+24*3600*1000*newVal).replace('0:0:0','')
        }
      },
      immediate:false
    }
  },
  methods: {
      //日期选择确定
    dateSubmit(val) {
      this.formData[this.clickName] = val;
      this.dateShow = false;
    },
    onClose(){
     this.diviceShow=false
     this.dateShow=false
    },
    //显示设备列表
    showDevice(){
       this.diviceShow=true
    },
    //显示年月日时间
    showDate(val){
      //赋值点击的值
      this.dateShow=true
       this.clickName = val.name;
    },
    //设备列表确定
    deviceSubmit(val){
      this.$set(this.formData, "deviceId", val.id);
      this.$set(this.formData, "deviceName", val.name);
      this.$set(this.formData,'maintenanceDay',val.maintenanceDay)
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
        repairResult: this.active,
        remarks: this.remarks,
        batchId: "",
        factoryId: wx.getStorageSync("factoryId"),
        reportUser:wx.getStorageSync("UserId"),
        reportUserName:wx.getStorageSync("applyUserName"),
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.photoList.length > 0) {
         this.uuid= data.get_uuid()
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["upkeep"].saveOrStart(params).then((res) => {
             if(res.data.code == 10000){
              wx.showToast({
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
        data["upkeep"].saveOrStart(params).then((res) => {
           if(res.data.code == 10000){
              wx.showToast({
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