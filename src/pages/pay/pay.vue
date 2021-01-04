<template>
    <div class="container">
    <div class="total">
      <div class="label">订单金额</div>
      <div class="txt">{{actualPrice}}元</div>
    </div>
    <div class="pay-list">
        <div class="h">请选择支付方式</div>
        <div class="b">
            <div class="item">
                <div class="checkbox"></div>
                <div class="icon-alipay"></div>
                <div class="name">支付宝</div>
            </div>
            <div class="item">
                <div class="checkbox"></div>
                <div class="icon-net"></div>
                <div class="name">网易支付</div>
            </div>
            <div class="item">
                <div class="checkbox checked"></div>
                <image src="/static/images/wxpay.png" class="icon"/>
                <div class="name">微信支付</div>
            </div>
        </div>
    </div>
    <div class="tips">小程序只支持微信支付，如需其它支付方式，请在网页版支付</div>
    <div class="pay-btn" @click="startPay">确定</div>
</div>
</template>
<script>
export default {
    data(){
        return{
            actualPrice: null,
            okOrOk:true,
            noOrNo:false
        }
    },
    computed:{

    },
    mounted(){
this.getPrice()
    },
    methods:{
        getPrice(){
      this.actualPrice=this.$route.query.id
        },
        startPay(){
        if(this.okOrOk){
            console.log(1)
              wx.redirectTo({
               url:'../payresult/payresult.vue?status='+this.okOrOk
             })
              console.log(2)
        }else{
              wx.redirectTo({
               url:'../payresult/payresult.vue?status='+this.noOrNo
             })
        }
            // 先post或者get请求向后台传递对应数据有openid，商品价格，商品描述等
            // ，然后用返回数据填写 wx.requestPayment这个api所需的数据 
            
        //       wx.requestPayment({
        //   'timeStamp': res.timeStamp ,
        //   'nonceStr': res.nonceStr,
        //   'package': res.package,
        //   'signType': 'MD5',
        //   'paySign': res.paySign,
        //   'success': function (res) {
            //  wx.redirectTo({
            //   url: 支付成功页面
            // })
        //     console.log("支付成功！")
        //   },
        //   'fail': function (res) {
             //  wx.redirectTo({
            //   url: 支付失败页面
            // })
        //   }
        // })
        }
    }
}
</script>
<style scoped>
page{
    min-height: 100%;
    width: 100%;
    background: red;
}

.container{
  padding-top: 20rpx;
}

.total{
  height: 104rpx;
  background: #fff;
  width: 92%;
  line-height: 104rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.total .label{
  float: left;
}

.total .txt{
  float: right;
}

.pay-list{
    margin-top: 30rpx;
    height: auto;
    width: 100%;
    overflow: hidden;
}
.pay-list .h{
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    margin-left: 31.25rpx;
    margin-bottom: 31.25rpx;
}

.pay-list .item{
    height: 108rpx;
    padding-left: 31.25rpx;
    background: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
}

.pay-list .checkbox{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -448rpx no-repeat;
    background-size: 38rpx 486rpx;
    width: 40rpx;
    height: 40rpx;
    display: inline-block;
    vertical-align: middle;
    margin-right: 30rpx;
}

.pay-list .checkbox.checked{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -192rpx no-repeat;
    background-size: 38rpx 486rpx;
}

.pay-list .icon-alipay{
    display: inline-block;
    vertical-align: middle;
    background-image: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/payMethod-s3c1faebee4-d754da9c65.png);
    background-repeat: no-repeat;
    background-size: 56.25rpx 189.583rpx;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .icon-net{
    display: inline-block;
    vertical-align: middle;
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/payMethod-s3c1faebee4-d754da9c65.png) 0 -66.7rpx no-repeat;
    background-size: 56.25rpx 189.583rpx;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .icon{
    display: inline-block;
    vertical-align: middle;
    margin-right: 10.5rpx;
    width: 56.25rpx;
    height: 56.25rpx;
}

.pay-list .name{
    display: inline-block;
    vertical-align: middle;
    height: 56.25rpx;
    line-height: 56.25rpx;
}

.pay-btn{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    text-align: center;
    line-height: 100rpx;
    background: hsl(358, 64%, 43%);
    color: #fff;
    font-size: 30rpx;
}

.tips{
  height: 40rpx;
  width: 92%;
  font-size: 24rpx;
  color: #999;
  line-height: 40rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
}
</style>