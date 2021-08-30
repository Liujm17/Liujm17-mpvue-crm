<template>
  <div class="bg">
    <div class="title">附件</div>
    <div class="icon">
      <van-icon
        name="photo-o"
        size="60px"
        @click="onlyOne ? chooseOneMedia() : chooseMedia()"
        v-if="notShow"
      />
      <div class="content">
        <div
          class="content-item"
          v-for="(item, index) in photoList"
          :key="index"
        >
          <ImageView
            :src="item.img"
            height="100%"
            @onClick="showDetail(item, index)"
          />
          <div class="item-del" @click="delPhoto(index)" v-if="notShow">x</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageView from "../../components/imageView";
export default {
  props: {
    photoList: {
      type: Array,
      default: [],
    },
    //父组件为false后可以上传多张图片
    onlyOne: {
      type: Boolean,
      default: true,
    },
    notShow:{
      type:Boolean,
      default:true
    },
    deleteList:{
      type: Array,
      default: [],
    }
  },
  data() {
    return {};
  },
  components: {
    ImageView,
  },
  methods: {
    //删除指定照片
    async delPhoto(val) {
       if(this.photoList[val].id){
         await  this.deleteList.push(this.photoList[val].id)
        await this.photoList.splice(val, 1);
      }else{
         await this.photoList.splice(val, 1);
      }
    },
    //显示详情
    showDetail(item, index) {
      // console.log(item,index)
      if (item.type == "image") {
        const media = [{ url: item.img, type: "image" }];
        wx.previewMedia({
          current: 0, // 当前显示图片的http链接
          sources: media, // 需要预览的图片http链接列表
          url: media[0],
        });
      } else {
        const media = [{ url: item.video, type: "video" }];
        wx.previewMedia({
          current: 0, // 当前显示图片的http链接
          sources: media, // 需要预览的图片http链接列表
          url: media[0],
        });
      }
    },
    chooseMedia() {
      wx.chooseMedia({
        count: 9,
        mediaType: ["image", "video"],
        sourceType: ["album", "camera"],
        maxDuration: 30,
        camera: "back",
        success: (res) => {
          if (res.type == "image") {
            res.tempFiles.forEach((item) => {
              this.photoList.push({
                type: "image",
                img: item.tempFilePath,
                video:''
              });
            });
          } else {
            // let duration = res.tempFiles[0].duration //选定视频的时间长度
            //  let size = parseFloat(res.tempFiles[0].size/1024/1024).toFixed(1) //选定视频的数据量大小
            //  console.log(duration,size)
            res.tempFiles.forEach((item) => {
              let size = parseFloat(item.size / 1024 / 1024).toFixed(1); //选定视频的数据量大小
              let duration = item.duration; //选定视频的时间长度
              if (duration <= 60) {
                this.photoList.push({
                  type: "video",
                  img: item.thumbTempFilePath,
                  video: item.tempFilePath,
                });
              } else {
                wx.showToast({
                  title:'视频大小超出限制',
                  icon:'none'
                })
              }
            });
          }
        },
      });
    },
    //只能选一个
    chooseOneMedia() {
      if (this.photoList.length < 1) {
        wx.chooseMedia({
          count: 9,
          mediaType: ["image", "video"],
          sourceType: ["album", "camera"],
          maxDuration: 30,
          camera: "back",
          success: (res) => {
            if (res.type == "image") {
              res.tempFiles.forEach((item) => {
                this.photoList.push({
                  type: "image",
                  img: item.tempFilePath,
                  video:''
                });
              });
            } else {
              // let duration = res.tempFiles[0].duration //选定视频的时间长度
            //  let size = parseFloat(res.tempFiles[0].size/1024/1024).toFixed(1) //选定视频的数据量大小
            //  console.log(duration,size)
            res.tempFiles.forEach((item) => {
              let size = parseFloat(item.size / 1024 / 1024).toFixed(1); //选定视频的数据量大小
              let duration = item.duration; //选定视频的时间长度
              if (duration <= 60) {
                this.photoList.push({
                  type: "video",
                  img: item.thumbTempFilePath,
                  video: item.tempFilePath,
                });
              } else {
                wx.showToast({
                  title:'视频大小超出限制',
                  icon:'none'
                })
              }
            });
            }
          },
        });
      } else {
        wx.showToast({
          title: "只能上传一张图片",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.del {
  color: white;
  background-color: red;
  display: table-caption;
}
.title {
  color: gray;
  font-size: 13px;
}
.icon {
  min-height: 100px;
}
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .content-item {
    width: 75px;
    height: 75px;
    position: relative;
    .item-del {
      position: absolute;
      right: -10px;
      top: -10px;
      width: 10px;
      height: 10px;
      z-index: 2;
    }
  }
}
</style>