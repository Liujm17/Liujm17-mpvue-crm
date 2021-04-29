import request from '../utils/request'



const base_url = 'http://47.105.173.228:8764'



// 时间格式化
function formattingTime(time) {

  var DateString = time + '';
  var time = new Date(DateString);
  // 注意js里面的getMonth是从0开始的
  var FormattedDateTime =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    time.getDate() +
    " " +
    time.getHours() +
    ":" +
    time.getMinutes() +
    ":" +
    time.getSeconds();
  return FormattedDateTime
}

//过滤null的传参
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

//备用金申请
const applyCash = {
  vanFormData: {
    formData: [{
        name: 'applyUserName',
        value: '用户名',
        type: 'normal'
      }, {
        name: 'payeeUserName',
        value: '付款人',
        type: 'user'
      },
      {
        name: 'money',
        value: '金额',
        type: 'normal'
      },
      {
        name: 'month',
        value: '所属期',
        type: 'normal'
      },
      {
        name: 'subject',
        value: '事由',
        type: 'normal'
      },
      {
        name: 'remark',
        value: '备注',
        type: 'normal'
      },
      {
        name: 'bankName',
        value: '收款人银行',
        type: 'normal'
      },
      {
        name: 'bankAccount',
        value: '收款人账号',
        type: 'normal'
      }
    ]
  },
  formData: {
    applyUserId: 1,
    applyUserName: "",
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
  //发起或保存备用金申请
  saveOrStartFlow:function(params){
    return request.post(`/api-ep-project/spareMoney/add`,params)
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
            dealTime: "处理时间:" + formattingTime(item.dealTime + ''),
            status: "审批结果:" + (item.dealResult == 1 ? "同意" : (item.dealResult == 2 ? "驳回到发起人" : "驳回上一步")),
          };
        })
        return data
      })
  }
}

export default {
  applyCash,
  formattingTime,
  dataFilter
}
