<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-model="materialName"
        label="项目名称"
        placeholder="请输入项目名称"
        required
        readonly
        input-align="right"
        @input="materialName = $event.mp.detail"
      />
    </van-cell-group>
    <div class="polling-text">
      <van-field
        v-model="remark"
        rows="1"
        autosize
        label="备注"
        type="textarea"
        input-align="right"
        placeholder="项目描述信息"
        @input="remark = $event.mp.detail"
        readonly
      />
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false" :notShow="false"></Accessroy>


      <van-button type="info" size="normal" @click="operate">操作</van-button>

  </div>
</template>

<script>
import Accessroy from "../../../components/apply/accessory";
import data from "../../../api/mockData";
export default {
  components: { Accessroy },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      remark: "",
      materialName:'',
      //附件
      photoList: [],
      //列表
      listData: [],
      //表单
      formData: {},
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  },
  onShow() {
    this.getData();
  },
  watch: {},
  methods: {
     //操作
    operate() {
     var a0=['编辑','删除']
     var b0=['edit','del']
      wx.showActionSheet({
        itemList: a0,
        success: (res) => {
          this[b0[res.tapIndex]]();
        },
        fail: (res) => {
          console.log(res.errMsg);
        },
      });
    },
      edit() {
      this.$router.push({
        path: "/pages/extraPages/factoryEdit/main",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    del() {
      let params = {
        id: this.$route.query.id,
        formId: this.$store.state.formId,
      };
      data["factory"].delFlow(params).then((res) => {
        mpvue.showToast({
          title: res.data.message,
          icon: "none",
          duration: 1000,
          mask: true,
        });
        //重启到某页面，如不是tabar页面会有回主页按钮
        setTimeout(() => {
          this.$router.back();
        }, 1000);
      });
    },
    //获取数据
    getData(){
      let params={
        id:this.$route.query.id
      }
       data['factory'].getData(params)
         .then((res)=>{
           this.materialName=res.data.data.materialName
           this.remark=res.data.data.remark
           this.photoList = res.data.data.fileList
          ? res.data.data.fileList.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
              };
            })
          : [];
         })
    },
    //保存
    save() {
      let params = {
        materialName: this.materialName,
        remark: this.remark,
        batchId: "",
        factoryId: 2020001,
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.photoList.length > 0) {
        data.upLoadFile(this.photoList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["factory"].saveOrStart(params).then((res) => {
            if (res.data.code == 10000) {
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
        data["factory"].saveOrStart(params).then((res) => {
          if (res.data.code == 10000) {
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