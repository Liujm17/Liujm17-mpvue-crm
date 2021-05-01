<template>
  <div>
    <div class="input">
      <van-field v-model="account" label="账号"    @input="account = $event.mp.detail" placeholder="请输入用户名" />
      <van-field v-model="password" label="密码"  @input="password = $event.mp.detail" placeholder="请输入密码" />
      <div class="bt">
        <van-button type="primary" @click="notLogin">不登录</van-button>
        <van-button type="info"  @click="login">登录</van-button>
      </div>
    </div>
  </div>
</template>
<script>
// var CryptoJS = require('crypto-js')
// var secretKey = "ahhxhbkjtltxywxm";
import {accountLogin} from '../../api/api'
export default {
  data() {
    return {
      account: "",
      password:"jC/8arY4qmB4tuUSvOaQ5w=="
    };
  },
  components: {},
  mounted() {
  },
  methods: {
     //aes密码加密
        // aesEncrypt(content) {
        //     let key = CryptoJS.enc.Utf8.parse(secretKey);
        //     let srcs = CryptoJS.enc.Utf8.parse(content);
        //     let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        //     return encrypted.toString();
        // },
    login(){
      let params={
        account:this.account,
        password:this.password
      }
         accountLogin(params).then((res)=>{
           if(res.data.code ==10000){
               mpvue.setStorageSync("UserId", res.data.data.userInfo.id);
                     mpvue.setStorageSync("applyUserName", res.data.data.userInfo.name);
                  mpvue.setStorageSync(
                    "Authorization",
                    res.data.data.Authorization
                  )
            this.$router.push({
            path: "/pages/index/main",
            reLaunch: true,
          });
           }else{
             console.log(res.data.message)
           }
         })
    },
    notLogin(){
        this.$router.push({
            path: "/pages/index/main",
            reLaunch: true,
          });
    }
  },
};
</script>
<style lang="scss" scoped>
.input {
  position: absolute;
  top: 30%;
 left: 15%;
  .bt{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>

