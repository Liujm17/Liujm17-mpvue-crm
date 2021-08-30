<template>
  <div class="bg">
    <van-dialog2 id="van-dialog" />
    <!-- <div class="home-swiper">
      <div
        class="swiper-item tran"
        v-for="(item,index) in homeSrc"
        :key="index"
        :style="{transform:transform}"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <img :src="item" alt />
      </div>
      <div class="swiper-num">{{moveNum+1}}/{{homeSrc.length}}</div>
    </div> -->
    <MoveButton @send="send" @openPrj="openPrj" :title3="prjName" v-if="showMove"></MoveButton>
    <div style="width:100%;height:10px"></div>
    <div class="prj-box" v-show="showPrj">
      <div class="prj-box-content">
        <div class="prj-box-item" v-for="(item,index) in prjList" :key="index" @click="pickPrj(item,index)" :style="{backgroundColor:factoryId==item.id?'#1C86EE':''}">{{item.nickName}}</div>
      </div>
      <div class="prj-cancel" @click="showPrj=false">收起</div>
    </div>
    <div class="box-card" v-for="(item, index) in Menulist" :key="index">
      <div class="title">{{ item.title }}</div>
      <div class="content">
        <van-row>
          <van-col span="8" v-for="(item2, index2) in item.subs" :key="index2">
            <div class="box">
              <div class="box-content" @click="toPage(item2)">
                <ImageView height="100%" :src="item2.icon"></ImageView>
              </div>
              <div class="box-name">{{ item2.title }}</div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div></div>
  </div>
</template>
<script>
import { getMenus, getCount, getReportCount, getProjects } from "../../api/api";
import ImageView from "../../components/imageView";
import { getStorageSync } from "../../api/wechat";
import Dialog2 from "../../../dist/wx/vant-weapp/dist/dialog2/dialog";
import MoveButton from "../../components/utils/moveBotton.vue";
export default {
  data() {
    return {
      Menulist: [],
      show: false,
      prjList: [],
      factoryId: "",
      showPrj: false,
      factoyName: "",
      prjName: "选择项目",
      btLeft: "0",
      showMove: false,
      timer: null,
      timer2: null,
      homeSrc: [
        "http://47.105.173.228:8010/icon/news/swiper1.png",
        "http://47.105.173.228:8010/icon/news/swiper2.png",
        "http://47.105.173.228:8010/icon/news/swiper3.png",
      ],
      transform: "",
      wxWidth: wx.getSystemInfoSync().windowWidth,
      moveNum: 0,
      moveX: 0,
      startX: "",
    };
  },
  components: { ImageView, Dialog2, MoveButton },
  onShow() {
    //接收websocket消息
    if (getStorageSync("UserId") && getStorageSync("Authorization")) {
      this.getMenus();
      this.getSetting();
    } else {
      this.$router.push({
        path: "/pages/login/main",
        reLaunch: true,
      });
    }
    this.getProjects();
    //延时器
    this.timer = setTimeout(() => {
      this.showMove = true;
    }, 1000);
    //定时器
    this.timer2 = setInterval(() => {
      this.next();
    }, 5000);
  },
  onHide() {
    clearTimeout(this.timer);
    clearInterval(this.timer2);
    this.timer = null;
    this.timer2 = null;
  },
  onPullDownRefresh() {
    //doing something
    wx.showToast({
      title: "下拉刷新成功",
      icon: "none",
      duration: 1000,
      mask: true,
    });
    this.getMenus();
    this.getCount();
    //stop doing
    wx.stopPullDownRefresh();
  },
  watch: {
    factoyName: {
      handler(newVal, oldVal) {
        this.$set(this, "prjName", newVal);
      },
    },
  },
  methods: {
    touchStart(e) {
      this.startX = e.mp.changedTouches[0].pageX;
    },
    touchEnd(e) {
      if (e.mp.changedTouches[0].pageX > this.startX) {
        this.next();
      } else if (e.mp.changedTouches[0].pageX < this.startX) {
        this.pre();
      } else {
        return null;
      }
    },
    //下一个
    next() {
      this.moveNum += 1;
      if (this.moveNum == this.homeSrc.length) {
        this.moveNum = 0;
        this.moveX = 0;
      } else {
        this.moveX += this.wxWidth;
      }
      this.transform = `translateX(-${this.moveX}px)`;
    },
    //上一个
    pre() {
      this.moveNum -= 1;
      if (this.moveNum < 0) {
        this.moveNum = this.homeSrc.length - 1;
        this.moveX = this.moveNum * this.wxWidth;
      } else {
        this.moveX -= this.wxWidth;
      }
      this.transform = `translateX(-${this.moveX}px)`;
    },
    //授权
    getSetting() {
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.userLocation"]) {
            wx.authorize({
              scope: "scope.userLocation",
              success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.showToast({
                  title: "授权成功",
                  icon: "success",
                  duration: 1000,
                  mask: true,
                });
              },
              fail() {
                wx.showToast({
                  title: "授权失败",
                  icon: "none",
                  duration: 1000,
                  mask: true,
                });
              },
            });
          }
        },
      });
    },
    //扫码
    send() {
      // 允许从相机和相册扫码
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          this.$router.push({
            path: "/pages/extraPages/pollingAdd/main",
            query: {
              qrCode: res.result,
            },
          });
        },
      });
    },
    //选择项目
    openPrj() {
      this.showPrj = !this.showPrj;
    },
    //选择项目
    pickPrj(val, index) {
      this.factoryId = val.id;
      this.factoyName = val.nickName;
      this.showPrj = false;
      wx.setStorageSync("factoryName", val.nickName);
      wx.setStorageSync("factoryId", val.id);
      wx.setNavigationBarTitle({
        title: "主页" + "(" + wx.getStorageSync("factoryName") + ")",
      });
    },
    //mpvue的更改选择
    radioChange(val) {
      this.radio = val.mp.detail;
    },
    getProjects() {
      getProjects().then((res) => {
        this.prjList = res.data.data.map((item) => {
          return {
            nickName: item.nickName,
            id: item.id,
          };
        });
        //以前选过项目
        if (wx.getStorageSync("factoryId")) {
          this.factoyName = wx.getStorageSync("factoryName");
          this.factoryId = wx.getStorageSync("factoryId");
          this.prjName = wx.getStorageSync("factoryName");
        } else {
          //以前没选过
          if (res.data.data.length > 0) {
            this.factoyName = res.data.data[0].nickName;
            this.factoryId = res.data.data[0].id;
            this.prjName = res.data.data[0].nickName;
            wx.setStorageSync("factoryName", res.data.data[0].nickName);
            wx.setStorageSync("factoryId", res.data.data[0].id);
          }
        }
        wx.setNavigationBarTitle({
          title: "主页" + "(" + wx.getStorageSync("factoryName") + ")",
        });
        this.getCount();
      });
    },
    //获取待办数
    getCount() {
      let params = {
        approverUserId: wx.getStorageSync("UserId"),
        status: 0,
      };
      getCount(params).then((res) => {
        let num = 0
        num+=res.data.data
        getReportCount().then((res2) => {
          num+=res2.data.data
          if (num > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: num+ "",
          });
        } else {
          wx.removeTabBarBadge({
            index: 2,
          });
        }
        })
      });

    },

    //获取菜单
    getMenus() {
      let params = {
        systemCode: "05",
      };
      getMenus(params).then((res) => {
        this.Menulist = res.data.data.menus;
        this.$store.commit("setPermissions", res.data.data.permissions);
      });
    },

    //到申请页面
    async toPage(val) {
      if (this.showPrj) {
        wx.showToast({
          title: "请先收起项目弹窗",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      } else {
        await this.$store.commit(
          "changeForm",
          parseInt(val.index.match(/\d+/g)[0])
        );
        await this.$router.push({
          path: val.index,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home-swiper {
  width: 100%;
  height: 200px;
  display: -webkit-box;
  position: relative;
  .swiper-item {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .swiper-num {
    position: absolute;
    bottom: 0;
    left: 45%;
    z-index: 100;
  }
}
.tran {
  transition: all 1s;
}
//右到左
@keyframes fadeleftIn {
  0% {
    -webkit-transform: translate3d(100%, 0, 0);
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
//上到下
@keyframes fadeInDown {
  0% {
    -webkit-transform: translate3d(0, -20%, 0);
    -webkit-transform: translate3d(0, -20%, 0);
    transform: translate3d(0, -20%, 0);
    transform: translate3d(0, -20%, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
//下到上
@keyframes fadelogIn {
  0% {
    -webkit-transform: translate3d(0, 100%, 0);
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}

.bg {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #f5f6f7;
  .box-card {
    width: 90%;
    min-height: 2.5rem;
    // border: 1px solid #96c2f1;
    background-color: white;
    border-radius: 0.2rem;
    overflow: hidden;
    margin: 0.1rem 0;
    .title {
      width: 100%;
      height: 0.5rem;
      text-align: left;
      padding: 0 10px;
      box-sizing: border-box;
      color: #555666;
      font-size: 15px;
      border-bottom: 1px solid #f5f6f7;
    }
    .box {
      width: 100%;
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .box-content {
        width: 50%;
        height: 60%;
        // border: 1px solid #96c2f1;
        // background-color: #eff7ff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        img {
          height: 100%;
        }
      }
      .box-name {
        width: 90%;
        height: 25%;
        color: #333;
        //  background-color: white;
        font-size: 13px;
        text-align: center;
      }
    }
  }
}
.header-prj {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
//项目按钮
.prj-bt {
  height: 30px;
  width: 80%;
  padding: 0 8px;
  font-size: 12px;
  line-height: 28px;
  border: 1px solid #07c160;
  text-align: center;
  border-radius: 30px;
  background: #ffdead;
}
.prj-send {
  height: 50px;
  width: 30%;
  line-height: 50px;
  border: 1px solid #07c160;
  text-align: center;
  border-radius: 30px;
  background: #ffdead;
}
.prj-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 30%;
  height: 50%;
  z-index: 10001;
  background: #c6e2ff;
  animation: fadeInDown 0.4s;
  color: black;
}
.prj-box-content {
  width: 100%;
  height: 85%;
  overflow-y: auto;
  .prj-box-item {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.prj-cancel {
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  color: black;
}
</style>
