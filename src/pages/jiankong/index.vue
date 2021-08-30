<template>
  <view class="page-body">
  <view class="page-section page-section-gap">
    <web-view :src="src"></web-view>
  </view>
</view>

</template>

<script>
export default {
    data(){
      return{
        src:`https://www.saddlepoint.cn:8004/#/`
      }
    },
    onShow(){
      if(wx.getStorageSync('Authorization')){
        this.src=`https://www.saddlepoint.cn:8004/#/innerScreen?token=${wx.getStorageSync('Authorization')}&id=${wx.getStorageSync('factoryId')}&name=${wx.getStorageSync('factoryName')}&time=1`
      }
    }
}
</script>

<style>
.page-section-gap{
  box-sizing: border-box;
  padding: 0 30rpx;
}
</style>