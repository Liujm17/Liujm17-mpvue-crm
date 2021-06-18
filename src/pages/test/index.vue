<template>
  <div>
    <Accessroy :photoList="photoList" :onlyOne="false"></Accessroy>
    <Charges
      title="费用报销"
      :delShow="true"
      v-for="(item, index) in list"
      :key="index"
      @deleteTable="deleteTable"
    ></Charges>
    <div @click="addTable">新增</div>
    <div @click="test">测试上传</div>
    <div @click="send">扫描</div>
    <div style="width: 100px; height: 100px" @click="showDetail()">
      <ImageView :src="src" height="100%"></ImageView>
    </div>
  </div>
</template>

<script>
import Accessroy from "../../components/apply/accessory";
import Charges from "../../components/apply/detailsOfCharges";
import ImageView from "../../components/imageView.vue";
import data from "../../api/mockData";
export default {
  components: { Accessroy, Charges, ImageView },
  data() {
    return {
      list: [],
      photoList: [],
      valueIndex: 0,
      data: data,
      uuid: '',
    };
  },
  onShow() {
     this.uuid= data.get_uuid()
  },
  methods: {
    //显示详情
    showDetail() {
      console.log("1");
      const media = [{ url: this.src, type: "video" }];
      wx.previewMedia({
        current: 0, // 当前显示图片的http链接
        sources: media, // 需要预览的图片http链接列表
        url: media[0],
      });
    },
    send() {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          console.log(res);
        },
      });
    },
    //添加表单
    addTable() {
      this.list.push(1);
    },
    deleteTable(val) {
      this.list.splice(val, 1);
    },
    test() {
      this.test2(this.photoList, this.valueIndex, this.uuid).then(() => {
        console.log("promise");
      });
    },
    //上传视频图片
    test2(list, valueIndex, uuid) {
      return new Promise((resolve, reject) => {
        const uploadTask = wx.uploadFile({
          url: `https://www.hxhb-test.icu:8004/api-ep-project/file/upload`, //仅为示例，非真实的接口地址
          filePath:
            list[valueIndex].type == "image"
              ? list[valueIndex].img
              : list[valueIndex].video,
          method: "POST",
          name: "file",
          header: {
            "content-type": "multipart/form-data",
            Authorization: wx.getStorageSync("Authorization"),
          },
          formData: {
            batchId: uuid,
          },
          success: (res) => {
            console.log("succ");
          },
          complete: () => {
            ++valueIndex;
            if (valueIndex < list.length) {
              console.log(valueIndex);
              console.log(list.length);
              resolve(this.test2(list, valueIndex, uuid));
            } else {
              //递归归0
              valueIndex = 0;
              console.log(valueIndex);
              wx.hideLoading();
              resolve();
            }
          },
        });
        uploadTask.onProgressUpdate((res) => {
          wx.showLoading({
            title: "上传进度：" + res.progress + "%",
          });
        });
      });
    },
  },
};
</script>

<style scoped>
.add-button {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  color: #1989fa;
  padding: 10px 10px;
  /* height: 40px;
      line-height: 40px; */
}
</style>
<style>
.value-class {
  flex: none !important;
}
</style>