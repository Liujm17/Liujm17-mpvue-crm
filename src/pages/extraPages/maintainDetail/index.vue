<template>
  <div class="allbg">
     <van-tabs :active="tabsActive">
      <van-tab title="详情">
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
        <van-field
          v-model="formData.repairResultStr"
          label="维修结果"
          readonly
          input-align="right"
          placeholder="维修结果"
          @input="repairDetail = $event.mp.detail"
        />
          <van-field
            v-model="formData.repairDetail"
            rows="1"
            autosize
            label="故障原因"
            type="textarea"
            readonly
            placeholder="故障报修描述信息"
            @input="repairDetail = $event.mp.detail"
          />
        </van-cell-group>
        <!-- 附件 -->
        <Accessroy
          :photoList="photoList"
          :onlyOne="false"
          :notShow="false"
        ></Accessroy>
        <div v-if="managerUserIs">
          <div class="polling-info">
            <div class="polling-title">处理意见</div>
            <RadioList
              :typeList="typeList"
              :active="active"
              @changeData="changeData"
            ></RadioList>
          </div>
          <div style="margin-top: 30px">
            <van-field
              v-model="formData.repairUserName"
              label="选择维修人员"
              readonly
              input-align="right"
              placeholder="维修人员"
              @input="repairDetail = $event.mp.detail"
              @click="usershow = true"
            />
          </div>
        </div>
         </van-tab>
      <van-tab title="设备信息">
        <DeviceInfo :dataId="deviceId"></DeviceInfo>
         </van-tab>
    </van-tabs>
    <!-- 用户弹出层 -->
    <van-popup
      :show="usershow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="usersubmit" :radio="userradio" @cancel="onClose"></User>
    </van-popup>
    <van-goods-action>
      <van-goods-action-button
        type="info"
        :text="saveText"
        @click="save()"
        v-if="managerUserIs || repairUserIs"
      />
    </van-goods-action>
  </div>
</template>

<script>
import data from "../../../api/mockData";
import Accessroy from "../../../components/apply/accessory.vue";
import RadioList from "../../../components/radioButton.vue";
import User from "../../../components/userOptions";
import DeviceInfo from '../../../components/detail/deviceInfo.vue'
export default {
  components: { Accessroy, RadioList, User,DeviceInfo },
  data() {
    return {
      tabsActive:0,
      //列表
      listData: [
        {
          name: "deviceName",
          value: "故障设备",
          click: "device",
          type: "",
          required: true,
          readonly: true,
        },
        {
          name: "factoryId",
          value: "故障报修编号",
          click: "device",
          type: "",
          required: true,
          readonly: true,
        },
        {
          name: "repairResult",
          value: "维修结果",
          click: "device",
          type: "",
          required: true,
          readonly: true,
        },
        {
          name: "faultTime",
          value: "故障时间",
          click: "device",
          type: "",
          required: true,
          readonly: true,
        },
         {
          name: "repairTime",
          value: "维修时间",
          click: "device",
          type: "",
          required: true,
          readonly: true,
        },
      ],
      //表单
      formData: {
        deviceName: "",
        factoryId: "",
        faultTime: "",
        repairResult: "",
        repairDetail: "",
        repairResultStr: "",
        repairUserName: "",
        repairUser: "",
      },
      //附件
      photoList: [],
      //按钮群
      active: 1,
      typeList: [
        { value: 0, text: "批准维修" },
        { value: 1, text: "密切关注" },
        { value: 2, text: "暂不处理" },
      ],
      userradio: "1",
      usershow: false,
      //底部按钮名称
      saveText: "保存",
      //是否是项目经理
      managerUserIs: false,
      //是否是维修工
      repairUserIs: false,
      deviceId:'',
    };
  },
  onShow() {
    this.getData();
  },
  computed: {
    saveText() {
      if (this.managerUserIs) {
        return "确定";
      } else if (this.repairUserIs) {
        return "创建维修";
      } else {
        return "";
      }
    },
  },
  methods: {
    onClose() {
      this.usershow = false;
    },
    //用户确认
    usersubmit(val) {
      this.$set(this.formData, "repairUser", val.id);
      this.$set(this.formData, "repairUserName", val.name);
      this.usershow = false;
    },
    //更换正常异常
    changeData(item, index) {
      this.active = index;
    },
    //获取数据
    getData() {
      let params = {
        id: this.$route.query.id,
      };
      data["maintain"].getData(params).then((res) => {
        const {
          deviceName,
          factoryId,
          faultTime,
          repairTime,
          repairResult,
          repairDetail,
          repairResultStr,
          repairUserName,
          repairUser,
        } = res.data.data;
        this.formData = {
          deviceName,
          factoryId,
          faultTime,
          repairTime,
          repairResult,
          repairDetail,
          repairResultStr,
          repairUserName,
          repairUser,
        };
        this.managerUserIs = res.data.data.managerUserIs;
        this.repairUserIs = res.data.data.repairUserIs;
        this.deviceId=res.data.data.deviceId
        this.photoList = res.data.data.fileVos
          ? res.data.data.fileVos.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
              };
            })
          : [];
      });
    },
    //保存
    save() {
      let params = {
        id: this.$route.query.id,
        handleOption: this.active,
        repairUser: this.formData.repairUser,
        repairUserName: this.formData.repairUserName,
      };
      data["maintain"].editOrStart(params).then((res) => {
        if(res.data.code == 10000){
              mpvue.showToast({
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