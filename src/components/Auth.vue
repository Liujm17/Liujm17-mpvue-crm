<template>
  <div class="auth-wrapper">
    <div class="auth">
      <div class="auth-info">
        <div class="sub-title">个人信息微信授权</div>
        <div class="title">本次授权用于该小程序获取用户微信部分信息。</div>
      </div>
       <div class="bt"><button @click="getUserInfo">授权</button></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
      getUserInfo() {
        this.$emit('getUserInfo')
      }
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
  .bt{
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      button{
          width: 100%!important;
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
