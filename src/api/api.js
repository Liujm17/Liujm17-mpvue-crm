import request from '../utils/request'
import {
  APP_ID,
  APP_SECRET
} from '../utils/const'
import {setStorageSync} from './wechat'


//获取用户所属监控项目列表
export function getProjects0(params) {
  return request.get(`/api-ep-main/projectScreen/getProjectByFactoryAndUser`, params)
}

//获取用户所属项目列表
export function getProjects(params) {
  return request.get(`/api-ep-project/factory/getIncludeProjects`, params)
}
//获取不同项目类型
export function getProjects2(params){
  return request.get('/api-ep-project/factory/getList',params)
}
//获取目录菜单
export function getMenus(params) {
  return request.get(`/api-ep-user/menu/getMenus`, params)
}
//获取审批待办数量
export function getCount(params) {
  return request.get(`/api-ep-user/flowTask/getCount`, params)
}
//获取待办数量
export function getReportCount(params) {
  return request.get(`/api-ep-project/device/getToDoReportCount`, params)
}
//获取备用金申请的历史记录
export function getHistory(params) {
  return request.get(`/api-ep-project/spareMoney/getPage`, params)
}
//获取用户列表
export function getUserOptions(params) {
  return request.post(`/api-ep-user/userController`, params)
}

//获取项目底下用户列表
export function getUserOptions2(params) {
  return request.get(`/api-ep-user/userController/getUsersByFactoryId`, params)
}
//获取供应商列表
export function getProviderOptions(params) {
  return request.get(`/api-ep-project/supplier/getPage`, params)
}
//获取供应商采购列表
export function getWaitPaymentList(params) {
  return request.get(`/api-ep-project/purchase/getWaitPaymentList`, params)
}
//获取部门列表
export function getDeptOptions(params) {
  return request.post(`/api-ep-user/deptController/list`, params)
}
//获取岗位列表
export function getPostOptions(params) {
  return request.get(`/api-ep-user/dictItemController/getDictItemWithDictId`, params)
}
//获取产品列表
export function getProductOptions(params) {
  return request.post('/api-ep-project/product/getProducts', params)
}
//获取入库单里的产品列表
export function getProductItemOptions(params) {
  return request.get('/api-ep-project/purchase/getProductList', params)
}

//获取采购订单列表
export function getOrderOptions(params){
  return request.get('/api-ep-project/purchase/selectByType',params)
}
//获取可变更采购信息
export function getChangeList(params){
  return request.get('/api-ep-project/purchase/getCanChangeList',params)
}
//获取设备信息列表
export function getDeviceList(params){
  return request.post('/api-ep-project/device/getDeviceList',params)
}
//获取对应备用金流程列表
export function getFlowList(params) {
  return request.get(`/api-ep-user/flowConfig/getByFormId`, params)
}
//根据流程id查询备用金节点
export function getByFlowId(params) {
  return request.get(`/api-ep-user/flowConfig/getByFlowId`, params)
}

//查询备用金历史表单详情
export function getSpareMoney(params) {
  return request.get(`/api-ep-project/spareMoney/get`, params)
}

//获取费用报销类别
export function getCostType(params){
  return request.get('/api-ep-project/common/getSelectBoxList',params)
}
//查询待办和已办
export function getFlowTask(params) {
  return request.get(`/api-ep-user/flowTask/getPage`, params)
}
//获取历史巡检记录
export function getHistoryInspects(params) {
  return request.get(`/api-ep-project/device/getHistoryInspects`, params)
}
//扫码获取设备信息
export function getDeviceByQrCode(params) {
  return request.get(`/api-ep-project/device/getDeviceByQrCode`, params)
}

//获取当前设备故障报修单
export function getDeviceReport(params) {
  return request.get(`/api-ep-project/device/getDeviceReport`, params)
}

//获取维修工名单
export function getRepairByFactoryId(params) {
  return request.get(`/api-ep-user/userController/getRepairByFactoryId`, params)
}

//获取报修待办
export function getReportWait(params){
  return request.get('/api-ep-project/device/getToDoReport',params)
}

//根据授权获得code再获取系统里的Authorization
export function getUnionid(params) {
  return request.post(`/api-ep-user/wechatController/wechat/miniappslogin`, params)
}

//登录
export function login() {
  wx.login({
    success(res) {
      if (res.code) {
        const { code } = res
        let params ={
          code:code,
          systemcode:'05'
        }
        getUnionid(params).then(res => {
          if(res.data.data.Authorization){
            setStorageSync("UserId", res.data.data.userInfo.id);
            setStorageSync("applyUserName", res.data.data.userInfo.name);
            setStorageSync("Authorization", res.data.data.Authorization);
            wx.reLaunch({
              url: '/pages/index/main'
            })
          }else{
                 setStorageSync("unionid", res.data.data.unionid);
                 setStorageSync("openid", res.data.data.openid);
          }
        }).catch(err => {
          console.log(err) // 直接抛出异常
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

//回撤
export function backFlow(params){
  return request.get('/api-ep-user/flowOrder/startUserRevoke',params)
}

//转审
export function referral(params){
  return request.post('/api-ep-user/flowOrder/referral',params)
}

//登录
export function accountBind(params){
  return request.post('/api-ep-user/wechatController/wechat/bind',params)
}



//////库存相关接口 没formid

//获取可出库的产品列表
export function getOutProductIOptions(params) {
  return request.get('/api-ep-project/stock/getList', params)
}

//添加盘点单
export function addStockCheck(params) {
  return request.post('/api-ep-project/stockCheck/add', params)
}
//修改盘点单
export function editStockCheck(params) {
  return request.post('/api-ep-project/stockCheck/edit', params)
}
//盘点单列表
export function stockList(params){
  return request.get('/api-ep-project/stockCheck/getPage',params)
}
//盘点单详情
export function stockDetail(params){
  return request.get('/api-ep-project/stockCheck/getInfo',params)
}
//盘点单删除
export function stockDel(params){
  return request.post('/api-ep-project/stockCheck/del',params)
}

