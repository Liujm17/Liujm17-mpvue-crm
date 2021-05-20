import request from '../utils/request'
import {getStorageSync} from './wechat'


const base_url = 'http://47.105.173.228:8764'



// 时间格式化
function formattingTime(time) {
  var d = new Date(time);
 
 var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
 
 return times
}

//过滤null的传参--清除id
function dataFilter(data){
    if (data) {
        for (var key in data) {
          if (
            data[key] == null ||
            typeof data[key] == "undefined" ||key == 'id'
          ) {
            delete data[key];
          }
        }
      }
}
//过滤null的传参--不清除id
function dataFilter2(data){
  if (data) {
      for (var key in data) {
        if (
          data[key] == null ||
          typeof data[key] == "undefined" 
        ) {
          delete data[key];
        }
      }
    }
}

//备用金申请
const applyCash = {
  vanFormData: {
    formData: [{
        name: 'applyUserName',
        value: '用户名',
        click: 'normal',
        type:'',
        required:true,
        readonly:true
      }, {
        name: 'payeeUserName',
        value: '收款人',
        click: 'user',
        type:'',
        required:true,
        readonly:true
      },
      {
        name: 'money',
        value: '金额',
        click: 'normal',
        type:'number',
        required:true
      },
      {
        name: 'month',
        value: '所属期',
        click: 'normal',
        type:'digit',
        required:true
      },
      {
        name: 'subject',
        value: '事由',
        click: 'normal',
        type:'',
      },
      {
        name: 'remark',
        value: '备注',
        click: 'normal',
        type:''
      },
      {
        name: 'bankName',
        value: '收款人银行',
        click: 'normal',
        type:'',
        required:true
      },
      {
        name: 'bankAccount',
        value: '收款人账号',
        click: 'normal',
        type:'digit',
        required:true
      }
    ]
  },
  formData: {
    // applyUserId:getStorageSync('UserId'),
    // applyUserName:getStorageSync('applyUserName') ,
    applyUserId:"",
    applyUserName:"",
    payeeUserId: "",
    payeeUserName: "",
    money: "",
    month: "",
    subject: "",
    remark: "",
    bankName: "",
    bankAccount: "",
  },
  backPath: "/pages/applyForCashHis/main",
  //获取表单详情
  getData: function (params) {
    return request.get(`/api-ep-project/spareMoney/get`, params)
  },
  //获取流程数据
  getFlowList: function (params) {
    return request.get(`/api-ep-user/flowConfig/getByFormId`, params)
      .then((res) => {
        let data = []
        if (res.data.data.length >= 1) {
          data = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.flowName,
            };
          });
        } else if (res.data.data.length == 0) {
          data = []
          return data;
        }
        return data
      })
  },
  //根据流程id查询节点
  getByFlowId: function (params) {
    return request.get(`/api-ep-user/flowConfig/getByFlowId`, params)
      .then((res) => {
        let data = []
        data = res.data.data.map((item) => {
          return {
            ...item,
            userId: "",
          };
        });
        return data
      })
  },
  //发起或保存备用金申请---新增中
  saveOrStartFlow:function(params){
    return request.post(`/api-ep-project/spareMoney/add`,params)
  },
   //发起或保存备用金申请---草稿中
 editOrStartFlow:function(params){
    return request.post(`/api-ep-project/spareMoney/edit`,params)
  },
  //删除备用金可以编辑的流程
  delFlow:function(params){
    return request.post(`/api-ep-project/spareMoney/delete`,params)
  },
  //日志
  getHistory: function (params) {
    return request.get(`/api-ep-user/FlowLogController/selectFlowLogList`, params)
      .then((res) => {
        let data = []
        data = res.data.data.map((item) => {
          return {
            title: '审批步骤:' + item.nodeTitle,
            userName: "处理人:" + item.userName,
            dealTime: item.dealTime?"处理时间:" + formattingTime(item.dealTime + ''):'',
            status: "审批结果:" + (item.dealResult == 1 ? "同意" : (item.dealResult == 2 ? "驳回到发起人" :(item.dealResult == 3 ? "驳回上一步" :'转审'))),
          };
        })
        return data
      })
  }
}

export default {
  applyCash,
  formattingTime,
  dataFilter,
  dataFilter2
}
