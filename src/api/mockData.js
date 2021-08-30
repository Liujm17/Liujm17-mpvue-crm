import request from '../utils/request'


 //数组去重
 function sliceList(obj) {
  var uniques = [];
  var stringify = {};
  for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function(a, b) {
          return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
      }
  }
  uniques = uniques;
  return uniques;
}

//获取当前时间
// function getNowTime(){
//   let  date=new Date();
//   let  newdate=date.toLocaleString('chinese', { hour12: false });
//   return newdate.split('/').join('-')
// }

function getNowTime() {//获取当前时间
  let now= new Date();
  let _month =  now.getMonth()+1;
  let _day = now.getDate();
  let _hour = ( 10 > now.getHours() ) ? '0' + now.getHours() : now.getHours();
  let _minute = ( 10 > now.getMinutes() ) ? '0' + now.getMinutes() : now.getMinutes();
  let _second = ( 10 > now.getSeconds() ) ? '0' + now.getSeconds() : now.getSeconds();
  return now.getFullYear() + '-' + _month + '-' + _day +  ' '  + _hour + ':' + _minute + ':' + _second;
}

function getNowDay() {//获取当前日期
  let now= new Date();
  let _month =  now.getMonth()+1;
  let _day = now.getDate();
  let _hour = ( 10 > now.getHours() ) ? '0' + now.getHours() : now.getHours();
  let _minute = ( 10 > now.getMinutes() ) ? '0' + now.getMinutes() : now.getMinutes();
  let _second = ( 10 > now.getSeconds() ) ? '0' + now.getSeconds() : now.getSeconds();
  return now.getFullYear() + '-' + _month + '-' + _day
}


//生成uuid
function get_uuid(){
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
  // s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

  //日志
  function getHistory(params) {
    return request.get(`/api-ep-user/FlowLogController/selectFlowLogList`, params)
      .then((res) => {
        let data = []
        data = res.data.data.map((item) => {
          return{
            title:item.nodeTitle+':'+item.userName,
            dealTime:'处理时间:'+(item.dealTime? (item.dealTime + ''):''),
            status:'审批结果:'+(item.dealResult == 1 ? "同意" : (item.dealResult == 2 ? "驳回到发起人" :(item.dealResult == 3 ? "驳回上一步" :'转审'))),
            dealSuggestion:'审批意见:'+(item.dealSuggestion?item.dealSuggestion:'')
          }
        })
        return data
      })
  }

//上传附件 
 function upLoadFile(list,index,uuid){
  return new Promise((resolve,reject)=>{
    const uploadTask = wx.uploadFile({
    url: `https://www.saddlepoint.cn:8004/api-ep-project/file/upload`, //仅为示例，非真实的接口地址
    filePath: list[index].type == 'image'?list[index].img:list[index].video,
    method: "POST",
    name: "file",
    header: {
      "content-type": "multipart/form-data",
      Authorization: wx.getStorageSync('Authorization')
    },
    formData: {
      batchId: uuid,
    },
    success: (res) => {
       
    },
    complete:(res)=>{
      index++
      if(index<list.length){
        //递归也要resolve,不然不能异步
       resolve(upLoadFile(list,index,uuid))
      }else{
      wx.hideLoading();
      //递归归0
      index=0
      resolve(res)
      }
    }
  });
  //显示上传进度
  uploadTask.onProgressUpdate((res) => {
    wx.showLoading({
      title: "上传进度：" + res.progress + "%",
    });
  });
 })
}

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
          typeof data[key] == "undefined"  || key == 'createTime'|| key == 'updateTime'|| key == 'undifined'|| key.includes('[')||typeof(data[key]) =='object'
        ) {
          delete data[key];
        }
      }
    }
}

//字段校验
function textFilter(arr1,arr2){
    let emptys=[]
    arr1.forEach((item,index)=>{
      if(this[item]||this[item.length>0]){
         return
       }else{
         emptys.push(arr2[index])
       }
    })
    if (emptys.length > 0) {
      wx.showToast({
        title: emptys.toString() + "不能为空",
        icon: "none",
        duration: 1000,
        mask: true,
      });
    }else{
      return true
    }  
}

//备用金申请
const applyCash = {
  mustKeyCn:'借款金额,事由,账户,开户行,银行账号',
  mustKeyEn:'money,subject,accountName,bankName,bankAccount',
  // 搜索词
  searchValues:'申请人',
  //历史tab栏
  typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
  //历史里类型判断关键词
  keyword:'approveStatus',
  //有日志
  hasHistory:true,
  //是否是审批
  isApprove:true,
  vanFormData: {
    formData: [{
        name: 'userName',
        value: '申请人',
        click: 'normal',
        type:'',
        required:true,
        readonly:true
      }, 
      {
        name: 'money',
        value: '借款金额',
        click: 'normal',
        type:'number',
        required:true,
        readonly:false
      },
      {
        name: 'subject',
        value: '事由',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'accountName',
        value: '账户',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'bankName',
        value: '开户行',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'bankAccount',
        value: '银行账号',
        click: 'normal',
        type:'digit',
        required:true,
        readonly:false
      }
    ]
  },
  formData: {
    userId:wx.getStorageSync('UserId'),
    userName:"",
    money: "",
    subject: "",
    accountName:'',
    bankName: "",
    bankAccount: "",
  },
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
          };
        });
        return data
      })
  },
  //备用金历史记录
 getRecord:function(params) {
    return request.get(`/api-ep-project/spareMoney/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          money: "申请金额为:" + item.money,
          subject: "事由:" + item.subject,
          status:
            item.approveStatus == -1
              ? "未提交"
              : item.approveStatus == 0
              ? "审批中"
              : item.approveStatus == 1
              ? "已通过"
              : "起始状态",
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
  //发起或保存备用金申请---新增中(新增)
  saveOrStart:function(params){
     if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/spareMoney/add`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //发起或保存备用金申请---详情中(修改)
 editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/spareMoney/edit`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
  },
  //删除备用金可以编辑的流程--(删除)
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
            title:  item.nodeTitle,
            userName:item.userName,
            dealTime: item.dealTime? (item.dealTime + ''):'',
            status:(item.dealResult == 1 ? "同意" : (item.dealResult == 2 ? "驳回到发起人" :(item.dealResult == 3 ? "驳回上一步" :'转审'))),
          };
        })
        return data
      })
  }
}

//员工管理
const staff= {
  mustKeyCn:'账号,姓名,电话,岗位名称',
  mustKeyEn:'account,name,phone,stationName',
  //状态选择数组
  radioList:[{text:'已经'},{text:'还未'},{text:'测试2'}],
   // 搜索词
   searchValues:'姓名',
  typeList:[{value:'',text:'全部'},{value:0,text:'内部员工'},{value:1,text:'外聘员工'}],
  //历史里类型判断关键词
  keyword:'isOutside',
   //有日志
   hasHistory:false,
   //是否是审批
   isApprove:false,
  vanFormData: {
    formData: [
      {
        name: 'account',
        value: '账号',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'name',
        value: '名称',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'phone',
        value: '电话',
        click: 'normal',
        type:'digit',
        required:true,
        readonly:false
      },
      {
        name: 'stationName',
        value: '岗位名称',
        click: 'post',
        type:'',
        required:true,
        readonly:true,
        clickValue:"stationId"
      },
      {
        name: 'entryDate',
        value: '入职日期',
        click: 'date',
        type:'',
        required:false,
        readonly:true,
      },
      {
        name: 'bankName',
        value: '开户行',
        click: 'normal',
        type:'',
        required:false,
        readonly:false
      },
      {
        name: 'bankAccount',
        value: '银行账号',
        click: 'normal',
        type:'digit',
        required:false,
        readonly:false
      },
      {
        name: 'remark',
        value: '备注',
        click: 'normal',
        type:'',
        required:false,
        readonly:false
      },
      {
        name: 'isOutsideName',
        value: '是否外聘员工',
        click: 'normal',
        type:'',
        required:false,
        readonly:true
      }
    ]
  },
  formData: {
    id:"",
    // applyUserId:getStorageSync('UserId'),
    // applyUserName:getStorageSync('applyUserName') ,
    userId:"",
    userName:"",
    account: "",
    name: "",
    phone: "",
    stationName:'',
    stationId: "",
    bankName: "",
    bankAccount: "",
    remark:"",
    entryDate:'',
    isOutsideName:"是"
  },
   //员工列表
 getRecord:function(params) {
  return request.get(`/api-ep-user/userController/getPageByProjectId`, params)
  .then((res) => {
    let data = []
    data  = res.data.data.list.map((item,index) => {
      return {
        id: item.id,
        index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
        name:"姓名:"+item.name,
        stationName:"岗位:"+item.stationName
      };
    });
    return data
  })
},
 //获取表单详情
 getData: function (params) {
  return request.post(`/api-ep-user/userController/getUserById`, params)
             .then((res)=>{
               let data= {data:{data:{
                      ...res.data.data,
                      isOutsideName:res.data.data.isOutside == 0?'否':'是'
               }}}
               return data
             })
},
//员工管理---新增中(新增)
saveOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-user/userController/addStaff`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //员工管理---详情中(修改)
editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-user/userController/editStaff`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //--(删除)
 delFlow:function(params){
  return request.post(`/api-ep-user/userController/invalidStaff`,params)
},
}


//供应商管理
const provider= {
  mustKeyCn:'供应商名称,供应商联系人,供应商电话,户名,开户行,银行账号',
  mustKeyEn:'name,contacts,phone,accountName,bankName,bankAccount',
   // 搜索词
   searchValues:'供应商名称,联系人,联系电话',
  typeList:[],
  //历史里类型判断关键词
  keyword:'type',
   //是否有日志
   hasHistory:false,
   //是否是审批
   isApprove:false,
  vanFormData: {
    formData: [
      {
        name: 'name',
        value: '供应商名称',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'contacts',
        value: '供应商联系人',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'phone',
        value: '供应商电话',
        click: 'normal',
        type:'digit',
        required:true,
        readonly:false
      },
      {
        name: 'accountName',
        value: '户名',
        click: 'normal',
        type:'',
        required:true,
        readonly:false,
      },
      {
        name: 'bankName',
        value: '开户行',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
      {
        name: 'bankAccount',
        value: '银行账号',
        click: 'normal',
        type:'digit',
        required:true,
        readonly:false
      },
    ]
  },
  formData: {
    id:"",
    name:'',
    contacts:'',
    phone:'',
    // typeName:'',
    // type:'',
    accountName:'',
    bankName: '',
    bankAccount:''
  },
   //供应商列表
 getRecord:function(params) {
  return request.get(`/api-ep-project/supplier/getPage`, params)
  .then((res) => {
    let data = []
    data  = res.data.data.list.map((item,index) => {
      return {
        id: item.id,
        index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
        name:"供应商名称:"+item.name,
        contacts:"供应商联系人:"+item.contacts,
        phone:"供应商电话:"+item.phone
      };
    });
    return data
  })
},
 //获取表单详情
 getData: function (params) {
  return request.get(`/api-ep-project/supplier/getInfo`, params)
},
//供应商---新增中(新增)
saveOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/supplier/add`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //供应商---详情中(修改)
editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/supplier/edit`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }           
},
 //--(删除)
 delFlow:function(params){
  return request.post(`/api-ep-project/supplier/del`,params)
},
}

//设备信息
const deviceInfo ={
  mustKeyCn:'设备名称,设备序号,设备地点,保养周期',
  mustKeyEn:'name,serialNumber,address,maintenanceDay',
  //状态选择数组
    radioList:[{text:'运行中',value:1},{text:'停机维修',value:2},{text:'未上线',value:3}],
    // 搜索词
    searchValues:'设备名称,联系人,联系电话',
    typeList:[{text:'全部',value:''},{text:'运行中',value:1},{text:'停机维修',value:2},{text:'未上线',value:3}],
    //历史里类型判断关键词
    keyword:'status',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'name',
          value: '设备名称',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'serialNumber',
          value: '设备序号',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'address',
          value: '设备地点',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'statusName',
          value: '设备状态',
          click: 'radioGroup',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'producer',
          value: '生产商名称',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'salesman',
          value: '售后联系人',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'salesmanPhone',
          value: '售后电话',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'specification',
          value: '规格型号',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'productionTime',
          value: '出厂日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'scrapTime',
          value: '预计报废日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'maintenanceDay',
          value: '保养周期(单位：天)',
          click: 'normal',
          type:'digit',
          required:true,
          readonly:false
        },
        {
          name: 'nextMaintainTime',
          value: '下次保养日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'nameplate',
          value: '铭牌信息',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
      ]
    },
    formData: {
      name:"",
      serialNumber:'',
      address:'',
      status:'',
      statusName:'',
      producer:'',
      salesman:'',
      salesmanPhone:'',
      specification: '',
      productionTime:'',
      scrapTime:'',
      maintenanceDay:'',
      nextMaintainTime:'',
      nameplate: '',
      productIds:[]
    },
     //设备信息列表
   getRecord:function(params) {
    return request.post(`/api-ep-project/device/getDeviceList`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          name:"设备名称:"+item.name,
          address:"设备地址:"+item.address,
          status:"设备状态:"+(item.status == 1?'运行中':(item.status ==2?'停机维修中':'未上线'))
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/device/getDeviceDetail`, params)
  },
  //设备信息---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/addDevice`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //供应商---详情中(修改)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/updateDevice`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }           
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/device/delDevice`,params)
  },
}

//采购订单
const PO ={
  mustKeyCn:'采购日期,采购清单',
  mustKeyEn:'purchaseDate,purchaseDetailList',
  mustKeyCn2:'供应商,预计到货日期',
  mustKeyEn2:'supplierId,estimateArrivalDate',
  //状态选择数组
    radioList:[{text:'运行中',value:0},{text:'停机维修',value:1},{text:'未上线',value:2}],
    // 搜索词
    searchValues:'申请人,采购类别',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '采购人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'purchaseDate',
          value: '采购日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        // {
        //   name: 'supplierName',
        //   value: '供应商名称',
        //   click: 'provider',
        //   type:'',
        //   required:true,
        //   readonly:true
        // },
        // {
        //   name: 'supplierContacts',
        //   value: '供应商联系人',
        //   click: 'normal',
        //   type:'',
        //   required:true,
        //   readonly:false
        // },
        // {
        //   name: 'supplierPhone',
        //   value: '供应商电话',
        //   click: 'normal',
        //   type:'digit',
        //   required:false,
        //   readonly:false
        // },
        // {
        //   name: 'estimateArrivalDate',
        //   value: '预计到货日期',
        //   click: 'date',
        //   type:'',
        //   required:true,
        //   readonly:true
        // },
        // {
        //   name: 'totalPrice',
        //   value: '采购总金额',
        //   click: '',
        //   type:'',
        //   required:false,
        //   readonly:true
        // },
        {
          name: 'purpose',
          value: '用途',
          click: '',
          type:'textarea',
          required:false,
          readonly:false
        },
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      supplierId:'',
      supplierName:'',
      supplierContacts:'',
      supplierPhone:'',
      purchaseDate:'',
      purpose:'',
      type:'',
      totalPrice:0
    },
     //采购单列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/purchase/getPage`, params)
    .then((res) => {
      let data = []
      // let allData=[{title1:'序号',title2:'供应商',title3:'金额',title4:'付款状态',title5:'日期',},...data]
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          number:"编号:"+item.id,
          supplierName:"供应商名称:"+(item.supplierName?item.supplierName:''),
          totalPrice:'订单金额:'+(item.totalPrice?item.totalPrice:'')+"(元)",
          paymentStatusName:"付款状态:"+item.paymentStatusName,
          purchaseDate:"申请日期:"+item.purchaseDate,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/purchase/getInfo`, params)
  },
  //采购订单---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/purchase/add`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  
  },
   //采购订单---详情中(修改)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/purchase/edit`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }           
  },
   //采购订单---审批中(修改)
   editOrStart2:function(params){
    if(textFilter.call(params,this.mustKeyEn2.split(','),this.mustKeyCn2.split(','))){
      return request.post(`/api-ep-project/purchase/editAgree`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }           
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/purchase/del`,params)
  },
  
}

//入库单
const inStorage ={
  mustKeyCn:'采购订单,入库日期',
  mustKeyEn:'purchaseId,inDate',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'申请人,入库类别',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '处理人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'purchaseId',
          value: '采购订单',
          click: 'order',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'inDate',
          value: '入库日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'inType',
          value: '入库类型',
          click: 'radioGroup',
          type:'',
          required:false,
          readonly:true
        }
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      purchaseId:'',
      inDate:'',
      inType:'',
    },
     //入库单列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/stockIn/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          userName:"申请人:"+item.userName,
          inTypeName:"入库类别:"+item.inTypeName,
          inDate:"入库日期:"+item.inDate,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/stockIn/getInfo`, params)
  },
  //入库单---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/stockIn/add`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //入库单---详情中(修改)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/stockIn/edit`,params)   
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }       
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/stockIn/del`,params)
  },
}

//巡检记录
const polling ={
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'设备名称,巡检人',
    //历史tab栏
    typeList:[],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
     vanFormData: {
      formData: [
        {
          name: 'name',
          value: '设备名称',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'serialNumber',
          value: '设备序号',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'address',
          value: '设备地点',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'producer',
          value: '生产商名称',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'salesman',
          value: '售后联系人',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'salesmanPhone',
          value: '售后电话',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'specification',
          value: '规格型号',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
        {
          name: 'productionTime',
          value: '出厂日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'scrapTime',
          value: '预计报废日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'maintenanceDay',
          value: '保养周期(单位：天)',
          click: 'normal',
          type:'digit',
          required:true,
          readonly:false
        },
        {
          name: 'nextMaintainTime',
          value: '下次保养日期',
          click: 'date',
          type:'',
          required:false,
          readonly:true
        },
        {
          name: 'nameplate',
          value: '铭牌信息',
          click: 'normal',
          type:'',
          required:false,
          readonly:false
        },
      ]
    },
    formData: {
      name:"",
      serialNumber:'',
      address:'',
      producer:'',
      salesman:'',
      salesmanPhone:'',
      specification: '',
      productionTime:'',
      scrapTime:'',
      maintenanceDay:'',
      nextMaintainTime:'',
      nameplate: '',
    },
     //巡检纪录列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/device/getDeviceInspects`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          deviceId:"设备编号:"+item.deviceId,
          deviceName:"设备名称:"+item.deviceName,
          inspectUserName:"巡检人:"+item.inspectUserName,
          inspectTime:"巡检时间:"+item.inspectTime,
          color:item.deviceStatus=='正常'?'#009933':'#FF0000'
        };
      });
      return data
    })
  },
   //扫码获取设备详情
   getDeviceByQrCode: function (params) {
    return request.get(`/api-ep-project/device/getDeviceByQrCode`, params)
  },
    //获取表单详情
    getData: function (params) {
      return request.get(`/api-ep-project/device/getDeviceInspectDetail`, params)
    },
  //巡检记录---新增中(新增)
  saveOrStart:function(params){
    return request.post(`/api-ep-project/device/addDeviceInspect`,params)
  },
   //入库单---详情中(修改)
  editOrStart:function(params){
    return request.post(`/api-ep-project/stockIn/edit`,params)           
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/stockIn/del`,params)
  },
}

//故障报修
const breakdown ={
  mustKeyCn:'设备名称,故障原因',
  mustKeyEn:'deviceName,faultReason',
  mustKeyCn1:'故障原因',
  mustKeyEn1:'faultReason',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'设备名称',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:0,text:'未解决'},{value:1,text:'已解决'},{value:2,text:'暂无'}],
    //历史里类型判断关键词
    keyword:'repairResult',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'reportUser',
          value: '报修人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'deviceName',
          value: '设备名称',
          click: 'device',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'faultTime',
          value: '故障时间',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      reportUser:wx.getStorageSync('applyUserName'),
      deviceName:'',
      deviceId:'',
      faultTime:'',
    },
     //故障报修列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/device/getDeviceReports`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          deviceName:"设备名称:"+item.deviceName,
          faultTime:"故障时间:"+item.faultTime,
          repairResultStr:"故障状态:"+item.repairResultStr,
          color:item.repairResultStr == '已解决'?'#00CC99':(item.repairResultStr == '未解决'?'#FF0000':(item.repairResultStr == '暂无'?'#6699FF':''))
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/device/getDeviceReportDetail`, params)
  },
  //故障报修---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/addDeviceReport`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }  
  },
   //故障报修---详情中(处理)
  editOrStart:function(params){
    return request.post(`/api-ep-project/device/managerHandle`,params)  
    // if(textFilter.call(params,this.mustKeyEn1.split(','),this.mustKeyCn1.split(','))){
    //   return request.post(`/api-ep-project/device/managerHandle`,params)    
    //  }else{
    //    return  new Promise((resolve, reject) => {
    //     let data={
    //       data:{code:-1}
    //     }
    //       resolve(data);
    //   });
    //  }         
  },

}

//故障维修
const maintain ={
  mustKeyCn:'设备名称,故障时间,维修时间,维修详情',
  mustKeyEn:'deviceName,faultTime,repairTime,repairDetail',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'设备名称',
    //历史tab栏
    typeList:[],
    //历史里类型判断关键词
    keyword:'status',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'deviceName',
          value: '设备名称',
          click: 'device',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'faultTime',
          value: '故障时间',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'repairTime',
          value: '维修时间',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      deviceName:'',
      deviceId:'',
      faultTime:'',
      repairTime:'',
      reportId:''
    },
     //故障维修列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/device/getDeviceRepairs`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          deviceName:"设备名称:"+item.deviceName,
          repairTime:"维修时间:"+item.repairTime,
          repairDetail:"维修详情:"+item.repairDetail,
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/device/getDeviceRepairDetail`, params)
  },
  //故障维修---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/addDeviceRepair`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //故障报修---详情中(处理)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/managerHandle`,params)   
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }        
  },

}

//设备保养
const upkeep ={
  mustKeyCn:'保养设备,保养周期,保养时间,保养详情',
  mustKeyEn:'deviceName,maintenanceDay,maintainTime,remarks',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'设备名称',
    //历史tab栏
    typeList:[],
    //历史里类型判断关键词
    keyword:'status',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'deviceName',
          value: '保养设备',
          click: 'device',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'maintenanceDay',
          value: '保养周期(天)',
          click: '',
          type:'dight',
          required:true,
          readonly:true
        },
        {
          name: 'maintainTime',
          value: '保养时间',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'nextMaintainTime',
          value: '下次保养时间',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      deviceName:'',
      deviceId:'',
      maintenanceDay:'',
      maintainTime:'',
      nextMaintainTime:''
    },
     //保养记录列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/device/getDeviceMaintains`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          deviceName:"设备名称:"+item.deviceName,
          maintainTime:"保养时间:"+item.maintainTime.slice(0,10),
          nextMaintainTime:"下次保养时间:"+item.nextMaintainTime.slice(0,10),
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/device/getDeviceMaintainDetail`, params)
  },
  //保养---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/addDeviceMaintain`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //故障报修---详情中(处理)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/device/managerHandle`,params) 
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }          
  },

}

//付款申请
const payment ={
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'申请人,入库类别',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    typeList2:[{value:1,text:'库存采购付款'},{value:2,text:'现场采购付款'}],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
     vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '付款申请人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierName',
          value: '供应商名称',
          click: 'provider',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierContacts',
          value: '供应商联系人',
          click: 'provider',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierPhone',
          value: '供应商电话',
          click: 'provider',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'paymentDate',
          value: '付款日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      supplierId:'',
      supplierName:'',
      supplierContacts:'',
      supplierPhone:'',
      paymentDate:'',
    },
     //付款申请列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/payment/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          supplierName:"供应商名称:"+(item.supplierName?item.supplierName:'无供应商'),
          totalPrice:"总金额:"+item.totalPrice,
          paymentDate:"付款日期:"+item.paymentDate,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取付款表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/payment/getInfo`, params)
  },
  //付款申请---新增中(新增)
  saveOrStart:function(params){
    return request.post(`/api-ep-project/payment/add`,params)
  },
   //付款申请---详情中(修改)
  editOrStart:function(params){
    return request.post(`/api-ep-project/payment/edit`,params)           
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/payment/del`,params)
  },
}

//采购订单变更
const changeOrder ={
  //状态选择数组
    radioList:[{text:'运行中',value:0},{text:'停机维修',value:1},{text:'未上线',value:2}],
    // 搜索词
    searchValues:'申请人,采购类别',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '采购人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierName',
          value: '供应商名称',
          click: 'provider',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierContacts',
          value: '供应商联系人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierPhone',
          value: '供应商电话',
          click: 'normal',
          type:'digit',
          required:true,
          readonly:true
        },
        {
          name: 'purchaseDate',
          value: '采购日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'purpose',
          value: '用途',
          click: '',
          type:'textarea',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      supplierId:'',
      supplierName:'',
      supplierContacts:'',
      supplierPhone:'',
      purchaseDate:'',
      purpose:'',
      type:'',
    },
     //采购变更单列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/purchaseChange/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          supplierName:"供应商名称:"+item.supplierName,
          oldTotalPrice:'原金额:'+item.oldTotalPrice+"(元)",
          newTotalPrice:'变更后金额:'+item.newTotalPrice+"(元)",
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取表单详情
  getData: function (params) {
    return request.get(`/api-ep-project/purchaseChange/getInfo`, params)
  },
  //采购订单变更---新增中(新增)
  saveOrStart:function(params){
    return request.post(`/api-ep-project/purchaseChange/add`,params)
  },
   //采购订单变更---详情中(修改)
  editOrStart:function(params){
    return request.post(`/api-ep-project/purchaseChange/edit`,params)           
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/purchaseChange/del`,params)
  },
  
}

//出库单
const outStorage ={
  mustKeyCn:'出库日期,出库用途,出库产品',
  mustKeyEn:'outDate,purpose,stockOutDetailList',
  //状态选择数组
    radioList:[{text:'领用',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'申请人,出库类别',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
    vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '处理人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'outDate',
          value: '出库日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'purpose',
          value: '出库用途',
          click: '',
          type:'textarea',
          required:true,
          readonly:false
        },
        {
          name: 'outType',
          value: '出库类型',
          click: 'radioGroup',
          type:'',
          required:true,
          readonly:true
        }
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      outDate:'',
      outType:'',
      purpose:''
    },
     //入库单列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/stockOut/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          userName:"申请人:"+item.userName,
          outType:"出库类型:"+(item.outType == 1?'领用':'调拨'),
          outDate:"出库日期:"+item.outDate,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/stockOut/getInfo`, params)
  },
  //出库单---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/stockOut/add`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //出库单---详情中(修改)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/stockOut/edit`,params)  
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }         
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/stockOut/del`,params)
  },
}
//借调结算
const second ={
  mustKeyCn:'调入项目,派工人,派工原因,日结标准,开始日期,结束日期',
  mustKeyEn:'toFactoryName,dispatchUserName,dispatchReason,dailySalary,startDate,endDate',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'调入项目、派工人、结算金额',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    typeList2:[],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
     vanFormData: {
      formData: [
        {
          name: 'toFactoryName',
          value: '调入项目',
          click: 'factory',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'dispatchUserName',
          value: '派工人',
          click: 'user',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'dispatchReason',
          value: '派工原因',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'dailySalary',
          value: '日结标准',
          click: 'normal',
          type:'digit',
          required:true,
          readonly:false
        },
        {
          name: 'startDate',
          value: '开始日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'endDate',
          value: '结束日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'settlementMoney',
          value: '结算金额',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'remark',
          value: '备注',
          click: 'normal',
          type:'textarea',
          required:false,
          readonly:false
        }
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      toFactoryName:'',
      toFactoryId:'',
      dispatchUserId:'',
      dispatchUserName:'',
      dispatchReason:'',
      dailySalary:'',
      startDate:'',
      endDate:'',
      settlementMoney:'',
      remark:''
    },
     //借调结算列表
   getRecord:function(params) {
    return request.post(`/api-ep-project/cost/lend/getCostLendList`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          toFactoryName:"调入项目:"+item.toFactoryName,
          dispatchUserName:"派工人:"+item.dispatchUserName,
          dispatchReason:"派遣原因:"+item.dispatchReason,
          settlementMoney:"结算总金额:"+item.settlementMoney,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取借调结算表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/cost/lend/getCostLendDetail`, params)
  },
  //借调结算---新增中(新增)
  saveOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/cost/lend/addCostLend`,params)
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }
  },
   //借调结算---详情中(修改)
  editOrStart:function(params){
    if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
      return request.post(`/api-ep-project/cost/lend/editCostLend`,params)  
     }else{
       return  new Promise((resolve, reject) => {
        let data={
          data:{code:-1}
        }
          resolve(data);
      });
     }         
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/cost/lend/delCostLend`,params)
  },
}
//费用报销
const cost ={
  mustKeyCn:'费用所属期,项目名称,账户,开户行,银行账号,费用报销明细',
  mustKeyEn:'month,factoryId,accountName,bankName,bankAccount,costReimburseDetailList',
  mustKeyCn1:'费用所属期,费用报销明细',
  mustKeyEn1:'month,costReimburseDetailList',
  //状态选择数组
    radioList:[{text:'采购',value:1},{text:'调拨',value:2},],
    // 搜索词
    searchValues:'申请人',
    //历史tab栏
    typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
    typeList2:[],
    //历史里类型判断关键词
    keyword:'approveStatus',
     //是否有日志
     hasHistory:false,
     //是否是审批
     isApprove:false,
     vanFormData: {
      formData: [
        {
          name: 'userName',
          value: '付款申请人',
          click: 'normal',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierName',
          value: '供应商名称',
          click: 'provider',
          type:'',
          required:true,
          readonly:true
        },
        {
          name: 'supplierContacts',
          value: '供应商联系人',
          click: 'normal',
          type:'',
          required:true,
          readonly:false
        },
        {
          name: 'supplierPhone',
          value: '供应商电话',
          click: 'normal',
          type:'digit',
          required:false,
          readonly:false
        },
        {
          name: 'paymentDate',
          value: '付款日期',
          click: 'date',
          type:'',
          required:true,
          readonly:true
        },
      ]
    },
    formData: {
      userName:wx.getStorageSync('applyUserName'),
      supplierId:'',
      supplierName:'',
      supplierContacts:'',
      supplierPhone:'',
      paymentDate:'',
    },
     //费用报销列表
   getRecord:function(params) {
    return request.get(`/api-ep-project/costReimburse/getPage`, params)
    .then((res) => {
      let data = []
      data  = res.data.data.list.map((item,index) => {
        return {
          id: item.id,
          index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
          userName:"申请人:"+item.userName,
          month:"所属期:"+item.month,
          totalPrice:"总金额:"+item.totalPrice,
          color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
        };
      });
      return data
    })
  },
   //获取付款表单详情
   getData: function (params) {
    return request.get(`/api-ep-project/costReimburse/get`, params)
  },
  //付款申请---新增中(新增)
  saveOrStart:function(params){
    if(params['isPay']==0){
      if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
        return request.post(`/api-ep-project/costReimburse/addReimburse`,params)
       }else{
         return  new Promise((resolve, reject) => {
          let data={
            data:{code:-1}
          }
            resolve(data);
        });
       }
    }else{
      if(textFilter.call(params,this.mustKeyEn1.split(','),this.mustKeyCn1.split(','))){
        return request.post(`/api-ep-project/costReimburse/addReimburse`,params)
       }else{
         return  new Promise((resolve, reject) => {
          let data={
            data:{code:-1}
          }
            resolve(data);
        });
       }
    }
  },
   //付款申请---详情中(修改)
  editOrStart:function(params){
    if(params['isPay']==0){
      if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
        return request.post(`/api-ep-project/costReimburse/editReimburse`,params)  
       }else{
         return  new Promise((resolve, reject) => {
          let data={
            data:{code:-1}
          }
            resolve(data);
        });
       }
    }else{
      if(textFilter.call(params,this.mustKeyEn1.split(','),this.mustKeyCn1.split(','))){
        return request.post(`/api-ep-project/costReimburse/editReimburse`,params)  
       }else{
         return  new Promise((resolve, reject) => {
          let data={
            data:{code:-1}
          }
            resolve(data);
        });
       }
    }      
  },
   //--(删除)
   delFlow:function(params){
    return request.post(`/api-ep-project/costReimburse/deleteReimburse`,params)
  },
}

//结算单
const settle= {
  mustKeyCn:'收款日期,费用所属期,结算单明细',
  mustKeyEn:'collectionDate,month,costStatementDetailList',
  //状态选择数组
  radioList:[{text:'已经'},{text:'还未'},{text:'测试2'}],
   // 搜索词
   searchValues:'申请人',
   typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
  //历史里类型判断关键词
  keyword:'approveStatus',
   //有日志
   hasHistory:false,
   //是否是审批
   isApprove:false,
  vanFormData: {
    formData: [
  
      {
        name: 'name',
        value: '名称',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
    
  
    ]
  },
  formData: {
     name:''
  },
   //结算单列表
 getRecord:function(params) {
  return request.get(`/api-ep-project/costStatement/getPage`, params)
  .then((res) => {
    let data = []
    data  = res.data.data.list.map((item,index) => {
      return {
        id: item.id,
        index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
        userName:"申请人:"+item.userName,
        month:"所属期:"+item.month,
        color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
      };
    });
    return data
  })
},
 //获取表单详情
 getData: function (params) {
  return request.get(`/api-ep-project/costStatement/getInfo`, params)
},
//结算单---新增中(新增)
saveOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/costStatement/add`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //结算单---详情中(修改)
editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/costStatement/edit`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //--(删除)
 delFlow:function(params){
  return request.post(`/api-ep-project/ccostStatement/delete`,params)
},
}

//请示单
const askfor= {
  mustKeyCn:'申请日期',
  mustKeyEn:'applyDate',
  //状态选择数组
  radioList:[{text:'已经'},{text:'还未'},{text:'测试2'}],
   // 搜索词
   searchValues:'申请人',
   typeList:[{value:'',text:'全部'},{value:-1,text:'草稿'},{value:0,text:'审批中'},{value:1,text:'已结束'},{value:2,text:'已驳回'}],
  //历史里类型判断关键词
  keyword:'approveStatus',
   //有日志
   hasHistory:false,
   //是否是审批
   isApprove:false,
  vanFormData: {
    formData: [
  
      {
        name: 'name',
        value: '名称',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
    
  
    ]
  },
  formData: {
     name:''
  },
   //请示单列表
 getRecord:function(params) {
  return request.get(`/api-ep-project/apply/getPage`, params)
  .then((res) => {
    let data = []
    data  = res.data.data.list.map((item,index) => {
      return {
        id: item.id,
        index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
        userName:"申请人:"+item.userName,
        reason:"事由:"+item.reason,
        applyDate:"申请日期:"+item.applyDate,
        color:item.approveStatus==-1||item.approveStatus==2?'#87CEFA':(item.approveStatus==0?'#808080':(item.approveStatus==1?'#000000':''))
      };
    });
    return data
  })
},
 //获取表单详情
 getData: function (params) {
  return request.get(`/api-ep-project/apply/get`, params)
},
//请示单---新增中(新增)
saveOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/apply/add`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //请示单---详情中(修改)
editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/apply/edit`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //--(删除)
 delFlow:function(params){
  return request.post(`/api-ep-project/apply/delete`,params)
},
}
//项目资料
const factory= {
 mustKeyCn:'资料名称,备注,附件',
 mustKeyEn:'materialName,remark,batchId',
 mustKeyCn1:'资料名称,备注',
 mustKeyEn1:'materialName,remark',
  //状态选择数组
  radioList:[{text:'已经'},{text:'还未'},{text:'测试2'}],
   // 搜索词
   searchValues:'资料名称',
  typeList:[],
  //历史里类型判断关键词
  keyword:'approveStatus',
   //有日志
   hasHistory:false,
   //是否是审批
   isApprove:false,
  vanFormData: {
    formData: [
  
      {
        name: 'name',
        value: '名称',
        click: 'normal',
        type:'',
        required:true,
        readonly:false
      },
    
  
    ]
  },
  formData: {
     name:''
  },
   //项目资料列表
 getRecord:function(params) {
  return request.get(`/api-ep-project/factoryMaterial/getPage`, params)
  .then((res) => {
    let data = []
    data  = res.data.data.list.map((item,index) => {
      return {
        id: item.id,
        index:"序号:"+(index+1+(res.data.data.pageNum-1>=0?res.data.data.pageNum-1:0)*15),
        materialName:"资料名称:"+item.materialName,
        createTime:"创建时间:"+item.createTime
      };
    });
    return data
  })
},
 //获取表单详情
 getData: function (params) {
  return request.get(`/api-ep-project/factoryMaterial/get`, params)
},
//项目资料---新增中(新增)
saveOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn.split(','),this.mustKeyCn.split(','))){
    return request.post(`/api-ep-project/factoryMaterial/add`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //项目资料---详情中(修改)
editOrStart:function(params){
  if(textFilter.call(params,this.mustKeyEn1.split(','),this.mustKeyCn1.split(','))){
    return request.post(`/api-ep-project/factoryMaterial/edit`,params)
   }else{
     return  new Promise((resolve, reject) => {
      let data={
        data:{code:-1}
      }
        resolve(data);
    });
   }
},
 //--(删除)
 delFlow:function(params){
  return request.post(`/api-ep-project/factoryMaterial/delete`,params)
},
}

export default {
  applyCash,
  //员工管理
  staff,
  //供应商管理
  provider,
  //设备信息
  deviceInfo,
  //采购订单
  PO,
  //入库单
  inStorage,
  //巡检
  polling,
  //故障报修
  breakdown,
  //故障维修
  maintain,
  //设备保养
  upkeep,
  //付款申请
  payment,
  //采购订单变更
  changeOrder,
  //出库单
  outStorage,
  //借调结算18
  second,
  //请示单16
  askfor,
  //结算单17
  settle,
  //付费用报销15
  cost,
  //项目资料20
  factory,
  formattingTime,
  dataFilter,
  dataFilter2,
  //上传附件
  upLoadFile,
  //生成uuid
  get_uuid,
  //日志
  getHistory,
  //数组去重
  sliceList,
  //获取当前时间
  getNowTime,
  //获取当前日期
  getNowDay,
  //参数校验
  textFilter
}
