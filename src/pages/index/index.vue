<template>
  <div class="bg">
    <div class="box-card" v-for="(item, index) in Menulist" :key="index">
      <div class="title">{{ item.title }}</div>
      <div class="content">
        <van-row>
          <van-col
            span="6"
            v-for="(item2, index2) in item.subs"
            :key="index2"
          >
            <div class="box">
              <div class="box-content" @click="toPage(item2)">
                <ImageView height="100%" round :src="item2.icon"></ImageView>
              </div>
              <div class="box-name">
                {{ item2.title }}
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>
<script>
import { getMenus, getCount } from "../../api/api";
import ImageView from "../../components/imageView";
import User from '../../components/userOptions'
import { getStorageSync } from "../../api/wechat";
export default {
  data() {
    return {
      Menulist: [],
      show:false
    };
  },
  components: { ImageView,User},
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
  methods: {
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
        this.$store.commit('setPermissions',res.data.data.permissions)
      });
    },

    //到申请页面
    toPage(val) {
      this.$router.push({
        path: val.index,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  display: flex;

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
</style>
