<template>
  <div class="bg">
    <div class="box-card" v-for="(item, index) in Menulist" :key="index">
      <div class="title">{{item.name}}</div>
      <div class="content">
        <van-row>
          <van-col span="6" v-for="(item2, index2) in item.children" :key="index2">
            <div class="box">
              <div class="box-content" @click="toPage(item2.route)">
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
import { getUnionid ,getMenus} from "../../api/api";
export default {
  data() {
    return {
      Menulist:[]
    };
  },
  components: {},
  mounted() {
    this.getCode();
    this.getMenus()
  },
  methods: {
    //获取菜单
    getMenus(){
      let params={
        systemCode:'03'
      }
      getMenus(params).then((res)=>{
        this.Menulist=res.data.data
      })
    },
    // getSetting() {
    //   getSetting(
    //     "userInfo",
    //     (res) => {
    //       //已经获得授权，页面不再是授权页
    //       console.log(res);
    //       //获取授权信息
    //       this.getCode();
    //     },
    //     (res) => {
    //       console.log("2", res);
    //     }
    //   );
    // },
    //获取code
    getCode() {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            let params = {
              code: res.code,
              systemcode: "05",
            };
            getUnionid(params).then((res) => {
              console.log(res);
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    },

    //到申请页面
    toPage(val) {
      console.log(val);
      this.$router.push({
        path: val,
        query: "1",
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
