<template>
  <div>
    <div class="input">
      <van-field
        v-model="account"
        label="账号"
        @input="account = $event.mp.detail"
        placeholder="请输入用户名"
      />
      <van-field
        v-model="password"
        label="密码"
        type="password"
        @input="password = $event.mp.detail"
        placeholder="请输入密码"
      />
      <div class="bt">
        <van-button type="primary" @click="notBind">不绑定</van-button>
        <van-button type="info" @click="bind">绑定</van-button>
      </div>
    </div>
    <!-- <Auth v-else @getUserInfo='getUserInfo'></Auth> -->
  </div>
</template>
<script>
// var CryptoJS = require('crypto-js')
// var secretKey = "ahhxhbkjtltxywxm";
import { accountBind, login } from "../../api/api";
import Auth from "../../components/Auth";
import AES from "../../utils/Aes";
import {
  getSetting,
  getUserInfo,
  setStorageSync,
  getStorageSync,
  showLoading,
  hideLoading,
} from "../../api/wechat";
//十六位十六进制数作为秘钥
var key = AES.CryptoJS.enc.Utf8.parse("ahhxhbkjtltxywxm");
//十六位十六进制数作为秘钥偏移量
var iv = AES.CryptoJS.enc.Utf8.parse("1234567890123456");
export default {
  data() {
    return {
      account: "",
      password: "",
      // auth:false
    };
  },
  components: { Auth },
  onShow() {
      // wx.closeSocket()
    this.init();
  },
  methods: {
    init() {
      login();
    },
    //密码AES加密
    EncryptBASE64(word) {
      var srcs1 = AES.CryptoJS.enc.Utf8.parse(word);
      var encrypted1 = AES.CryptoJS.AES.encrypt(srcs1, key, {
        iv: iv,
        mode: AES.CryptoJS.mode.ECB,
        padding: AES.CryptoJS.pad.Pkcs7,
      });
      //返回base64加密结果
      return encrypted1.toString();
    },
    //授权按钮事件
    // getUserInfo(){
    //    getUserInfo()
    // },
    bind() {
      let params = {
        account: this.account,
        password: this.EncryptBASE64(this.password),
        unionid: getStorageSync("unionid"),
        openid: getStorageSync("openid")
      };
      accountBind(params).then((res) => {
        if (res.data.code == 10000) {
          setStorageSync("UserId", res.data.data.userInfo.id);
          setStorageSync("applyUserName", res.data.data.userInfo.name);
          setStorageSync("Authorization", res.data.data.Authorization);
          this.$router.push({
            path: "/pages/index/main",
            reLaunch: true,
            query:{
              id:res.data.data.userInfo.id
            }
          });
        } else {
          mpvue.showToast({
            title: res.data.message,
            icon: "none",
            duration: 3000,
          });
        }
      });
    },
    notBind() {
      // wx.login({
      //   success(res) {
      //     console.log(res.code);
      //   },
      // });
      this.$router.push({
        path: "/pages/index/main",
        reLaunch: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input {
  position: absolute;
  top: 30%;
  left: 15%;
  .bt {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>

