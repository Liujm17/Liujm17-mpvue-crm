//npm install flyio --save  下载依赖
import Fly from 'flyio/dist/npm/wx'
//创建实例
const request = new Fly()
request.config.baseURL = 'http://47.105.173.228:8764'
request.config.timeout = 3000 

//请求拦截
request.interceptors.request.use((request) => {
 //给所有请求添加自定义header
  request.headers["content-type"] = "application/x-www-form-urlencoded";
  request.headers['Authorization'] = 'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjoie1wiaWRcIjoxLFwibmFtZVwiOlwi6LaF57qn55So5oi3XCIsXCJhY2NvdW50XCI6XCJhZG1pblwiLFwicGFzc3dvcmRcIjpcIm9UbEtVc1dQL1RSTWdIRm1DUTdJdXc9PVwiLFwiZW1haWxcIjpcIjQ3MzAzMTQ0NkBxcS5jb21cIixcInBob25lXCI6XCIxNTE2MTE3MTY1NlwiLFwic3RhdHVzXCI6MSxcImRlcHRJZFwiOjEsXCJwb3N0SWRcIjoyMCxcInJlbWFya1wiOlwiXCIsXCJjcmVhdGVUaW1lXCI6MTYxNjA3MjU0NTAwMCxcImNyZWF0ZVVzZXJcIjpudWxsLFwidXBkYXRlVGltZVwiOjE2MTkwNzM2NzgwMDAsXCJ1cGRhdGVVc2VyXCI6bnVsbCxcIm9wZW5pZFwiOm51bGwsXCJoZWFkaW1nXCI6bnVsbH0iLCJqdGkiOiJZVEpoTVdJME5UY3ROakl5WWkwMFlqZGlMVGs0TURFdE1UVTRPVGM0TmpNNE0yWTIiLCJleHAiOjE2MTk2MjgwNjl9.i7kyUANrT-yIjzUGrEh6n3iHznAxacncX_KHrN1ZERLXgPW6mdRI7xCG0f0MA0TuTAZwLJeAn3bpxkv7XK5ZdNKRSbvmzKS_zRdx08fCq6TDNO2WYmLSdWmZFhNiA1FrvSAax7DVKYTXQW5q891eQyqdlm09eWtYAsAYe3vAQj4cEI6pRItMhkrBjfPv2_JrNWTm4zMQDE8b1DIYdHiHDyVvm2DYYBkIesdyeRlFeWCNiq8Ezg6phO_pJU-TB37Kz2MRpviwA-U8XxPFZOs2slKdOumXX1y44odxwhJxzcLcl3D_VoH6FvT7PrDUVzS_EOQZaeCN6VqOggcdh846Zw'// 让每个请求携带自定义token 请根据实际情况自行修改
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
        if (err.status == 0) {
            console.log("网络连接异常");
            return
        } else if (err.status == 1) {
            console.log("网络连接超时");
            return
        } else if (err.status == 401) {
            console.log("用户未登录");
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
