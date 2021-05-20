
 //是否获得授权
 export function getSetting(auth, onSuccess, onFail) {
  mpvue.getSetting({
    success(res) {
      if (res.authSetting[`scope.${auth}`]) {
        onSuccess(res)
      } else {
        onFail(res)
      }
    },
    fail(res) {
      console.log(res) // 直接抛出异常
    }
  })
}

export function getUserInfo(onSuccess, onFail) {
  wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
     console.log(res)
    }
  })
  // wx.getUserProfile({
  //   success(res) {
  //     let { userInfo } = res
  //     if (userInfo) {
  //       onSuccess(userInfo)
  //     } else {
  //       onFail(res)
  //     }
  //   },
  //   fail(res) {
  //     console.log(res) // 直接抛出异常
  //   }
  // })
}

export function setStorageSync(key,data){
  mpvue.setStorageSync(key, data)
}

export function getStorageSync(key) {
 return mpvue.getStorageSync(key)
}
//这里的return是能让取值渠道当前定义域，没return取不到值

// export function getUserOpenId(){
//     mpvue.login({
//       success(res) {
//         if (res.code) {
//           const { code } = res
//           getOpenId(code).then(response => {
//             const { data: { data: { openid } } } = response
//             setStorageSync('openId', openid)
//             // callback && callback()
//           }).catch(err => {
//             console.log(err) // 直接抛出异常
//           })
//         } else {
//           console.log(res) // 直接抛出异常
//         }
//       },
//       fail(res) {
//         console.log(res) // 直接抛出异常
//       }
//     })
// }


export function showLoading(title) {
  mpvue.showLoading({
    title,
    mask: true
  })
}


export function hideLoading(){
  mpvue.hideLoading()
}
