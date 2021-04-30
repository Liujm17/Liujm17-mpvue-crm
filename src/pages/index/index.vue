<template>
  <div class="bg">
    <div class="box-card" v-for="(item, index) in Menulist" :key="index">
      <div class="title">{{ item.name }}</div>
      <div class="content">
        <van-row>
          <van-col
            span="6"
            v-for="(item2, index2) in item.children"
            :key="index2"
          >
            <div class="box">
              <div class="box-content" @click="toPage(item2)">
                <van-icon :name="item2.icon" dot size="40px" />
              </div>
              <div class="box-name">
                {{ item2.name }}
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getUnionid, getMenus } from "../../api/api";
export default {
  data() {
    return {
      Menulist: [],
    };
  },
  components: {},
  created() {
    // this.getCode()
  },
  mounted() {
    // this.$nextTick(() => {
      this.getMenus();
    // });
    // this.init().then((res) => {
    //   this.getMenus();
    //   console.log("jieshu");
    // });
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
    //stop doing
    wx.stopPullDownRefresh();
  },
  methods: {
    init() {
      return new Promise(function (resolve, reject) {
        mpvue.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              let params = {
                code: res.code,
                systemcode: "05",
              };
              getUnionid(params).then((res) => {
                if (res.data.data) {
                  mpvue.setStorageSync("UserId", res.data.data.userInfo.id);
                     mpvue.setStorageSync("applyUserName", res.data.data.userInfo.name);
                  mpvue.setStorageSync(
                    "Authorization",
                    res.data.data.Authorization
                  );
                } else {
                  mpvue.showToast({
                    title: res.data.message + "即将跳转绑定页面",
                    icon: "none",
                    duration: 1000,
                    mask: true,
                  });
                }
              });
            } else {
              console.log("登录失败！" + res.errMsg);
            }
          },
        });
        resolve();
      });
    },
    //获取菜单
    getMenus() {
      let params = {
        systemCode: "03",
      };
      getMenus(params).then((res) => {
        this.Menulist = res.data.data;
      });
    },
    //获取code
    getCode() {
      mpvue.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            let params = {
              code: res.code,
              systemcode: "05",
            };
            getUnionid(params).then((res) => {
              if (res.data.data) {
                mpvue.setStorageSync("UserId", res.data.data.userInfo.id);
                 mpvue.setStorageSync("applyUserName", res.data.data.userInfo.name);
                mpvue.setStorageSync(
                  "Authorization",
                  res.data.data.Authorization
                );
              } else {
                mpvue.showToast({
                  title: res.data.message + "即将跳转绑定页面",
                  icon: "none",
                  duration: 1000,
                  mask: true,
                });
                setTimeout(() => {
                  // this.$router.push({
                  //   path: "/pages/bind/main",
                  // })
                });
              }
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    },

    //到申请页面
    toPage(val) {
      this.$store.commit("changeForm", val.menuUrl);
      this.$router.push({
        path: val.route,
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
