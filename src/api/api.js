import request from '../utils/request'
import {
  APP_ID,
  APP_SECRET
} from '../utils/const'

const base_url = 'http://47.105.173.228:8764'

// export function getHomeData(params){
//      return get(`${base_url}/book/home/v2`,params)
// }

//    export function register(params) {
//     return post(`${base_url}/user/register`,params)
//   }
//获取目录菜单
export function getMenus(params) {
  return request.get(`/api-ep-user/menu/getTreeList`, params)
}
//获取备用金申请的历史记录
export function getHistory(params) {
  return request.get(`/api-ep-project/spareMoney/getPage`, params)
}
//获取用户列表
export function getUserOptions(params) {
  return request.post(`/api-ep-user/userController`, params)
}
//获取部门列表
export function getPostOptions(params) {
  return request.post(`/api-ep-user/deptController/list`, params)
}
//获取对应备用金流程列表
export function getFlowList(params) {
  return request.get(`/api-ep-user/flowConfig/getByFormId`, params)
}
//根据流程id查询备用金节点
export function getByFlowId(params) {
  return request.get(`/api-ep-user/flowConfig/getByFlowId`, params)
}
//发起或保存备用金申请
export function startSpareMoney(params) {
  return request.post(`/api-ep-project/spareMoney/add`, params)
}
//查询备用金历史表单详情
export function getSpareMoney(params) {
  return request.get(`/api-ep-project/spareMoney/get`, params)
}

//查询待办和已办
export function getFlowTask(params) {
  return request.get(`/api-ep-user/flowTask/getPage`, params)
}



//根据授权获得code再获取系统里的token
export function getUnionid(params) {
  return request.post(`/api-ep-user/wechatController/wechat/miniappslogin`, params)
}

//登录
export function login(params) {
  mpvue.login({
    success(res) {
      if (res.code) {
        const params={
          code:res.code,
          systemCode:'03'
        }
        getUnionid(params).then(res=>{
          if(res.data.data){
            mpvue.setStorageSync("UserId", res.data.data.userInfo.id);
            mpvue.setStorageSync("Authorization",res.data.data.Authorization);
            }else{
               mpvue.showToast({
                   title: res.data.message+'即将跳转绑定页面',
                   icon: "none",
                   duration: 1000,
                   mask: true,
               });
              console.log(res)
            
            }
        })
      } else {
        console.log(res) // 直接抛出异常
      }
    },
    fail(res) {
      console.log(res) // 直接抛出异常
    }
  })
}

//同意
export function agree(params) {
  return request.post(`/api-ep-user/flowOrder/agree`, params)
}

//驳回
export function disagree(params) {
  return request.post(`/api-ep-user/flowOrder/disagree`, params)
}




//登录
export function accountLogin(params){
  return request.post('/api-ep-user/loginController/auth/login',params)
}