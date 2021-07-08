//npm install flyio --save  下载依赖
import Fly from 'flyio/dist/npm/wx'
//创建实例
const request = new Fly()
request.config.baseURL = 'https://www.hxhb-test.icu:8004'
// request.config.baseURL = 'https://www.saddlepoint.cn:8003'
request.config.timeout = 3000 

var jsonUrl=['/api-ep-project/device/addDevice','/api-ep-project/purchase/add','/api-ep-project/device/updateDevice','/api-ep-project/purchase/add','/api-ep-project/purchase/edit','/api-ep-project/stockIn/add','/api-ep-project/stockIn/edit','/api-ep-project/device/addDeviceInspect','/api-ep-project/device/addDeviceReport','/api-ep-project/device/addDeviceRepair','/api-ep-project/device/addDeviceMaintain','/api-ep-project/payment/add','/api-ep-project/payment/edit','/api-ep-project/spareMoney/add','/api-ep-project/spareMoney/edit','/api-ep-project/purchaseChange/add','/api-ep-project/purchaseChange/edit','/api-ep-project/stockOut/add','/api-ep-project/stockOut/edit','/api-ep-project/stockCheck/add','/api-ep-project/stockCheck/edit','/api-ep-project/cost/lend/addCostLend','/api-ep-project/cost/lend/editCostLend','/api-ep-project/factoryMaterial/add','/api-ep-project/factoryMaterial/edit','/api-ep-project/apply/add','/api-ep-project/apply/edit','/api-ep-project/costReimburse/addReimburse','/api-ep-project/costReimburse/editReimburse','/api-ep-project/costStatement/add','/api-ep-project/costStatement/edit']
//请求拦截
request.interceptors.request.use((request) => {
 //给所有请求添加自定义header,传参太多要用json传参，其他不能用
 if(jsonUrl.includes(request.url)){
  request.headers["content-type"] = "application/json;charset=UTF-8";
 }else{
  request.headers["content-type"] = "application/x-www-form-urlencoded";
 }
  request.headers['Authorization'] = mpvue.getStorageSync('Authorization')// 让每个请求携带自定义token 请根据实际情况自行修改
  var defaults = {
    factoryId:wx.getStorageSync("factoryId"),
    systemCode:'05',
    userId:wx.getStorageSync('UserId')
  }
  request.params = {
    ...defaults,
    ...request.params
  }
   return request;
})

//响应拦截
request.interceptors.response.use(
    (response) => {
        if(response.data.code == -1){
          console.log(response.data.code)
            mpvue.showToast({
                title: response.data.message,
                icon: "none",
                duration: 2000,
              });
        }else if(response.data.code == 10000){
          return response
        }
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
