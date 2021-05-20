//npm install flyio --save  下载依赖
import Fly from 'flyio/dist/npm/wx'
//创建实例
const request = new Fly()
request.config.baseURL = 'https://www.hxhb-test.icu:8004'
// request.config.baseURL = 'https://www.saddlepoint.cn:8003'
request.config.timeout = 3000 

//请求拦截
request.interceptors.request.use((request) => {
 //给所有请求添加自定义header
  request.headers["content-type"] = "application/x-www-form-urlencoded";
  request.headers['Authorization'] = mpvue.getStorageSync('Authorization')// 让每个请求携带自定义token 请根据实际情况自行修改
  // if (getToken()) {
  //    request.headers['Authorization'] = 'ljm'// 让每个请求携带自定义token 请根据实际情况自行修改
  //  }
   return request;
})

//响应拦截
request.interceptors.response.use(
    (response) => {
        if(response.data.code == -1){
            mpvue.showToast({
                title: response.data.message,
                icon: "none",
                duration: 2000,
              });
        }
        return response
    },
    (err) => {
        mpvue.showToast({
            title:err,
            duration: 3000,
            mask: true,
          });
        if (err.status == 403) {
            mpvue.showToast({
                title:"网络连接超时",
                icon: "none",
                duration: 2000,
              });
            return
        } else if (err.status == 400) {
            mpvue.showToast({
                title:"网络连接超时",
                icon: "none",
                duration: 2000,
              });
            return
        } else if (err.status == 401) {
            wx.clearStorageSync()
            wx.reLaunch({
                url: '/pages/login/main'
              })
            return
        } else {
            if (err.response.data.message) {
                mpvue.showToast({
                    title:err.response.data.message,
                    icon: "none",
                    duration: 2000,
                  });
                return 
            } else {
                mpvue.showToast({
                    title:"网络连接超时",
                    icon: "none",
                    duration: 2000,
                  });
                return 
            }
        };
        // Do something with response error
    }
)

export default request
