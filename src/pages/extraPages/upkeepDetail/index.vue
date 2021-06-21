<template>
  <div class="allbg">
    <van-tabs :active="tabsActive" @change="tabsChange">
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
            v-model="formData.repairDetail"
            rows="1"
            autosize
            label="备注"
            type="textarea"
            readonly
            placeholder="保养描述信息"
            @input="repairDetail = $event.mp.detail"
          />
        </van-cell-group>
        <!-- 附件 -->
        <Accessroy
          :photoList="photoList"
          :onlyOne="false"
          :notShow="false"
        ></Accessroy>
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
  components: { Accessroy, RadioList, User ,DeviceInfo},
  data() {
    return {
      tabsActive:0,
      //列表
      listData: [
       {
          name: 'deviceName',
          value: '保养设备',
          click: 'device',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'maintenanceDay',
          value: '保养周期(天)',
          click: '',
          type:'dight',
          required:true,
          readonly:false
        },
        {
          name: 'maintainTime',
          value: '保养时间',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'nextMaintainTime',
          value: '下次保养时间',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
      ],
      //表单
      formData: {
        deviceName:'',
      deviceId:'',
      maintenanceDay:'',
      maintainTime:'',
      nextMaintainTime:''
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
       //切换tab
    tabsChange(val) {
      //切换标签页面
      if (val.mp.detail.index == 1) {
        this.DeviceInfoShow=true
      }
    },
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
      data["upkeep"].getData(params).then((res) => {
        const {
          deviceName,
          factoryId,
          maintenanceDay,
          maintainTime,
          nextMaintainTime,
          remarks,
        } = res.data.data;
        this.formData = {
          deviceName,
          factoryId,
           maintenanceDay,
          maintainTime,
          nextMaintainTime,
          remarks,
        };
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
      data["upkeep"].editOrStart(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          //回退2层
          this.$router.back();
        }, 1000);
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