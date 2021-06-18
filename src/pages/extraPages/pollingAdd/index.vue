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
        readonly
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
      >
      </van-field>
    </van-cell-group>
    <div class="polling-info">
      <div class="polling-title">巡检信息</div>
      <RadioList
        :typeList="typeList"
        :active="active"
        @changeData="changeData"
      ></RadioList>
    </div>
    <div class="polling-text">
      <van-field
        v-model="remarks"
        rows="1"
        autosize
        label="问题描述"
        type="textarea"
        placeholder="该设备巡检描述信息"
          @input="remarks = $event.mp.detail"
      />
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>

    <div class="polling-info2">
      <div class="polling-title2">是否报修</div>
      <div class="polling-radio2">
        <van-radio-group
          v-model="radio"
          style="display: flex;justify-content: space-around;align-items: center;"
          @change="onChange"
        >
          <van-radio name="1" shape="square">否</van-radio>
          <van-radio name="2" shape="square">是</van-radio>
        </van-radio-group>
      </div>
    </div>
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
import data from "../../../api/mockData";
export default {
  components: { Accessroy, RadioList },
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
        { value: 0, text: "正常" },
        { value: 1, text: "异常" },
      ],
      active: 0,
      radio: "1",
    };
  },
  onLoad() {
    this.formData = this.data["polling"].formData;
    this.listData = this.data["polling"].vanFormData.formData;
     this.uuid= data.get_uuid(),
    this.getData();
  },
  watch: {},
  methods: {
    //更换正常异常
    changeData(item, index) {
      this.active = index;
    },
    //单选框更换
    onChange(val) {
      this.radio = val.mp.detail;
    },
    //获取数据
    getData() {
      let params = {
        qrCode: this.$route.query.qrCode,
      };
      data["polling"].getDeviceByQrCode(params).then((res) => {
        this.formData = res.data.data;
      });
    },
    //保存
    save() {
      let params = {
        deviceId: this.formData.id,
        deviceStatus: this.active == "0" ? "正常" : "异常",
        remarks: this.remarks,
        batchId: "",
        factoryId: 2020001,
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.photoList.length > 0) {
        console.log(this.uuid)
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["polling"].saveOrStart(params).then((res) => {
            mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.back();
          });
        });
      } else {
        data["polling"].saveOrStart(params).then((res) => {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 3000,
            mask: true,
          });
          //重启到某页面，如不是tabar页面会有回主页按钮
          this.$router.back();
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
  .polling-title {
    font-weight: 500;
  }
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