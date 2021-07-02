<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
      <van-field
        v-model="materialName"
        label="项目名称"
        placeholder="请输入项目名称"
        required
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
        placeholder="项目描述信息"
        input-align="right"
        @input="remark = $event.mp.detail"
      />
    </div>
    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false" :deleteList="deleteList"></Accessroy>

    <van-button type="info" size="normal" @click="save">保存</van-button>
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
      materialName: "",
      //附件
      photoList: [],
      //编辑中被删除的图片id列表
      deleteList: [],
      //需要上传的列表
      needList: [],
       //附件列表上传索引
      valueIndex: 0,
      //列表
      listData: [],
      //表单
      formData: {},
    };
  },
  onLoad() {
    this.uuid = data.get_uuid();
  
  },
  //一定要用ready 因为onshow在选完图片后会再次调用
  onReady() {
      this.getData();
  },
  watch: {
    //监听图片列表，看有无新上传的
    photoList: {
      handler(newVal, oldVal) {
        this.needList = data.sliceList(newVal.filter((item) => !item.id));
      },
      deep: true,
    },
    //监听图片列表，看有无把旧的图片删除的
    deleteList: {
      handler(newVal, oldVal) {
        this.needList = data.sliceList(newVal);
      },
      deep: true,
    },
  },
  methods: {
    //获取数据
    getData() {
      let params = {
        id: this.$route.query.id,
      };
      data["factory"].getData(params).then((res) => {
        this.materialName = res.data.data.materialName;
        this.remark = res.data.data.remark;
        this.photoList = res.data.data.fileList
          ? res.data.data.fileList.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
                id: item.id ? item.id : "",
              };
            })
          : [];
      });
    },
    //保存
    save() {
      let params = {
        id: this.$route.query.id,
        materialName: this.materialName,
        remark: this.remark,
        batchId: "",
        deleteIds: this.deleteList,
        factoryId: 2020001,
        userId: wx.getStorageSync("UserId"),
        userName: wx.getStorageSync("applyUserName"),
      };
      if (this.needList.length > 0) {
        data.upLoadFile(this.needList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["factory"].editOrStart(params).then((res) => {
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
        data["factory"].editOrStart(params).then((res) => {
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