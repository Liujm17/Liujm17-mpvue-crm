<template>
  <div class="bg">
    <van-dialog2 id="van-dialog" />
    <MoveButton @send='send' @openPrj='openPrj' :title3='"("+prjName+")"'></MoveButton>
    <div style="width:100%;height:10px"></div>
    <!-- <div style="width:100%" class="header-prj">
      <div class="prj-bt" @click="openPrj">当前项目:{{prjName}}(点击切换项目)</div>
       <div class="prj-send" @click="send">扫码巡检</div>
    </div> -->
    <!-- <van-button plain type="primary" size="small" @click="openPrj">{{prjName}}</van-button> -->
    <div class="prj-box" v-show="showPrj">
      <div class="prj-box-content">
        <div
          class="prj-box-item"
          v-for="(item,index) in prjList"
          :key="index"
          @click="pickPrj(item,index)"
          :style="{backgroundColor:factoryId==item.id?'rgb(0,191,255)':''}"
        >{{item.nickName}}</div>
      </div>
      <div class="prj-cancel" @click="showPrj=false">收起</div>
    </div>
    <div class="box-card" v-for="(item, index) in Menulist" :key="index">
      <div class="title">{{ item.title }}</div>
      <div class="content">
        <van-row>
          <van-col span="6" v-for="(item2, index2) in item.subs" :key="index2">
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
import { getMenus, getCount, getProjects } from "../../api/api";
import ImageView from "../../components/imageView";
import { getStorageSync } from "../../api/wechat";
import Dialog2 from "../../../dist/wx/vant-weapp/dist/dialog2/dialog";
import MoveButton from '../../components/utils/moveBotton.vue'
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
    };
  },
  components: { ImageView, Dialog2,MoveButton},
  onShow() {
    //接收websocket消息
    if (getStorageSync("UserId") && getStorageSync("Authorization")) {
      this.getMenus();
      this.getCount();
    } else {
      this.$router.push({
        path: "/pages/login/main",
        reLaunch: true,
      });
    }
    this.getProjects();
  },
  onPullDownRefresh() {
    //doing something
    mpvue.showToast({
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
     //扫码
    send() {
      // 允许从相机和相册扫码
      wx.scanCode({
        success:(res) =>{
         this.$router.push({
           path:'/pages/extraPages/pollingAdd/main',
           query:{
              qrCode:res.result
           }
         })
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
          this.factoyName = res.data.data[0].nickName;
          this.factoryId = res.data.data[0].id;
          this.prjName = res.data.data[0].nickName;
          wx.setStorageSync("factoryName", res.data.data[0].nickName);
          wx.setStorageSync("factoryId", res.data.data[0].id);
        }
        wx.setNavigationBarTitle({
          title: "主页" + "(" + wx.getStorageSync("factoryName") + ")",
        });
      });
    },
    //获取待办数
    getCount() {
      let params = {
        approverUserId: wx.getStorageSync("UserId"),
        status: 0,
      };
      getCount(params).then((res) => {
        wx.setTabBarBadge({
          index: 1,
          text: res.data.data + "",
        });
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
  .box-card {
    width: 90%;
    min-height: 2.5rem;
    border: 1px solid #96c2f1;
    background-color: #eff7ff;
    border-radius: 0.2rem;
    overflow: hidden;
    margin: 0.1rem 0;
    .title {
      width: 100%;
      height: 0.5rem;
      text-align: center;
    }
    .box {
      width: 100%;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .box-content {
        width: 90%;
        height: 70%;
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
.prj-send{
   height: 50px;
  width: 30%;
   line-height: 50px;
  border: 1px solid #07c160;
  text-align: center;
  border-radius: 30px;
  background: #ffdead;
}
.prj-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 50%;
  z-index: 10001;
  background: #242f42;
  animation: fadeInDown 0.4s;
  color: white;
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
  background: #ff4d4d;
}
</style>
