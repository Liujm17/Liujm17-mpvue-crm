<template>
  <div>
     <!-- 授权页面 -->
    <Auth v-if="Auth" @getUserInfo="getUserInfo"></Auth>
    <div class="header">
      <div class="header-content">
        <div class="header-content-one">
           <div class="one-one">
             <ImageView :src="src" height="100%" round />
           </div>
           <div class="one-two">
             <div>员工姓名:刘佳明</div>
             <div>微信名称:{{nickName}}</div>
             <div>地区:{{city}}</div>
             <div>性别:{{sex}}</div>
           </div>
        </div>
          <div class="header-content-two">
            <div class="two-one">
            <van-field v-model="text" label="个性签名:" :disabled='textDisabled' @click="textDisabled=false" @blur='blur'
             @input="text = $event.mp.detail"
            />
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageView from "../../components/imageView";
import Auth from "../../components/Auth";
export default {
   components: {
      Auth,
    ImageView,
  },
  data(){
    return{
      Auth: false,
      userName:'',
        src: "",
      nickName: "",
      city: "",
      sex:'',
      text:'',
      textDisabled:true
    }
  },
  onReady(){
     if(wx.getStorageSync('userInfo')){
         this.Auth = false;
       this.userName=wx.getStorageSync('applyUserName')
       this.text=wx.getStorageSync('selfText')?wx.getStorageSync('selfText'):''
      var userInfo=JSON.parse(wx.getStorageSync('userInfo'))
        this.src =userInfo.avatarUrl;
        this.nickName =userInfo.nickName;
      this.city = userInfo.city;
      this.sex=userInfo.gender ==1?'男':(userInfo.gender ==2?'女':'')
    }else{
      this.Auth=true
    }
  },
  methods:{
    blur(){
      wx.setStorageSync('selfText',this.text)
      this.textDisabled=true
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
          this.sex=res.userInfo.gender ==1?'男':(res.userInfo.gender ==2?'女':'')
          wx.setStorageSync('userInfo',res.rawData)
        },
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 200px;
  padding: 20px 20px;
  box-sizing: border-box;
  .header-content {
    width: 100%;
    height: 100%;
    border: 2px gray solid;
    border-radius: 30px;
     .header-content-one{
       width: 100%;
       height: 65%;
       display: flex;
       justify-content: center;
       align-items: center;
       .one-one{
         flex: none;
         width: 100px;
         height: 100px;
         padding: 8px;
         box-sizing: border-box;
       }
       .one-two{
         flex:2;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: center;
       }
     }
      .header-content-two{
       width: 100%;
       height: 35%;
          padding: 8px 10px;
         box-sizing: border-box;
       .two-one{
       }
     }
  }
}
</style>