# mpvue+微信小程序开发归纳
获得微信登录凭证code，然后通过后端接口去获取token，openid unionid
==================
```js
wx.login({
    success(res){
        //code为登录凭证
        console.log(res.code)
    }
})
```
=================
获取用户信息
<button @click="getUserInfo">授权</button>
```js
  <script>
      getUserInfo function() {
      wx.getUserProfile({
        desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写,
        lang: "zh_CN",//返回为中文简体
        success: (res) => {
          console.log(res);
        },
      })
    }
      </script>
```

=================
获取路由信息
```js
  let pages = getCurrentPages(); //当前页面栈
      //当前页面为页面栈的最后一个元素
      let prevPage = pages[pages.length - 1]; //当前页面
      //或者pop()为数组的最后一个元素，即  let prevPage = pages.pop()
```
================
给tabar图标右上角显示小红点
```js
//只能在tabar的页面赋值，其他页面不可以
   wx.setTabBarBadge({
          index: 1,
          text: '1'
        });
```
==============
密码进行Aes加密 填充为pks系列
详情看该项目吧
=============
微信小程序生命周期
```js
 //app
onLaunch () {
	console.log('小程序 [page-index] 生命周期: onLaunch: 初始化') 
},
onShow () {
	console.log('小程序 [page-index] 生命周期: onShow: 当小程序启动，或从后台进入前台显示') 
},
onHide () {
	console.log('小程序 [page-index] 生命周期: onHide: 当小程序从前台进入后台') 
},
// 小程序页面自有生命周期 
onLoad () {
	console.log('小程序 [page-index] 生命周期: onLoad: 监听页面加载') 
},
onShow () {
	console.log('小程序 [page-index] 生命周期: onShow: 监听页面显示') 
},
onReady () { 
	console.log('小程序 [page-index] 生命周期: onReady: 监听页面初次渲染完成') },
onHide () { 
	console.log('小程序 [page-index] 生命周期: onHide: 监听页面隐藏')
},
onUnload () {
	console.log('小程序 [page-index] 生命周期: onUnload: 监听页面卸载') 
},
```
===============
下拉事件和上拉事件
```js
  //下拉刷新
  onPullDownRefresh() {
    //doing something

    //stop doing
    wx.stopPullDownRefresh();
  },
    // 上拉加载
  onReachBottom() {
     //doing something

    //stop doing
    wx.stopPullDownRefresh();
  },
```
