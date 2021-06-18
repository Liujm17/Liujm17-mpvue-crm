<template>
  <div>
    <!-- 授权页面 -->
    <Auth v-if="Auth" @getUserInfo="getUserInfo"></Auth>
    <!-- 内容页 -->
    <div class="auth-wrapper" v-else>
      <div class="auth">
        <div class="auth-info">
          <div class="auth-img">
            <ImageView :src="src" height="100%" round />
          </div>
          <div class="sub-title">{{ nickName }}</div>
          <div class="title">{{ city }}</div>
      <div @click="ceshi">测试</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageView from "../../components/imageView";
import Auth from "../../components/Auth";
import {setStorageSync,getStorageSync} from "../../api/wechat"
export default {
  data() {
    return {
      radio: "1",
      Auth: true,
      src: "",
      nickName: "",
      city: "",
    };
  },
  components: {
    Auth,
    ImageView,
  },
  onShow() {
    if(getStorageSync('userInfo')){
      var userInfo=JSON.parse(getStorageSync('userInfo'))
      this.Auth = false;
          this.src =userInfo.avatarUrl;
          this.nickName =userInfo.nickName;
          this.city = userInfo.city;
    }else{
      this.Auth=true
    }
    // let pages = getCurrentPages(); //当前页面栈
    // //当前页面为页面栈的最后一个元素
    // let prevPage = pages[pages.length - 1]; //当前页面
    // // or
    // // pop() 方法用于删除并返回数组的最后一个元素
    // // let prevPage = pages.pop();//当前页面
    // console.log(prevPage);
  },
  onLoad() {},
  methods: {
    // touchS(e){
    //   console.log(e)
    // },
    //  touchE(e){
    //   console.log(e)
    // },
    //测试视频上传
    ceshi(){
const media= [{url:'http://47.105.173.228:8010/icon/spare_money.png'}]
    wx.previewMedia({
  current:0, // 当前显示图片的http链接
  sources: media, // 需要预览的图片http链接列表
  url:media[0]
})
    },
    getUserInfo() {
      wx.getUserProfile({
        desc: "用于完善会员资料",
        lang: "zh_CN", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.Auth = false;
          this.src = res.userInfo.avatarUrl;
          this.nickName = res.userInfo.nickName;
          this.city = res.userInfo.city;
          setStorageSync('userInfo',res.rawData)
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .bt {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    button {
      width: 100% !important;
      background-color: cornflowerblue;
    }
  }
  .auth {
    position: relative;
    width: 270px;
    height: 248px;
    background: #f5f5f5;
    border-radius: 18px;
    .auth-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 22.5px;
      .auth-img {
        width: 74px;
        height: 74px;
      }
      .sub-title {
        font-size: 13px;
        color: #999;
        line-height: 18.5px;
        margin-top: 18px;
      }
      .title {
        font-size: 16px;
        color: #333;
        font-weight: 400;
        line-height: 22.5px;
        margin-top: 3.5px;
      }
    }
    .auth-btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 49px;
      line-height: 49px;
      font-size: 15px;
      color: #fff;
      background-image: linear-gradient(90deg, #1ea3f5 0%, #0f87fc 100%);
      border-radius: 0 0 18px 18px;
    }
  }
}
</style>

