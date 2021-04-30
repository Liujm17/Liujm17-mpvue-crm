//npm install flyio --save  下载依赖
import Fly from 'flyio/dist/npm/wx'
import { getUnionid } from "../api/api";
//创建实例
const request = new Fly()
request.config.baseURL = 'https://www.saddlepoint.cn:8003'
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
        return response
    },
    (err) => {
        if (err.status == 403) {
            console.log("网络连接异常");
            return
        } else if (err.status == 400) {
            console.log("网络连接超时");
            return
        } else if (err.status == 401) {
            mpvue.removeStorage('Authorization')
            wx.login({
                success(res) {
                  if (res.code) {
                    //发起网络请求
                    let params = {
                      code: res.code,
                      systemcode: "05",
                    };
                    getUnionid(params).then((res) => {
                      mpvue.setStorageSync("UserId", res.data.data.userInfo.id);
                      mpvue.setStorageSync("Authorization",res.data.data.Authorization);
                    });
                  } else {
                    console.log("登录失败！" + res.errMsg);
                  }
                },
              });
            return
        } else {
            if (err.response.data.message) {
                return err.response.data.message
            } else {
                return '请求数据失败,请稍后再试'
            }
        };
        // Do something with response error
    }
)

export default request
