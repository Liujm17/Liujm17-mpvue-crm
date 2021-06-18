import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    formId: 1,
    active:0,
    permissions:[],
    //判断页面数据，表单id，详情进哪个页面，按钮权限，显示模块(流程，基本信息，附件等)
    //data detailpage addlpage add为判断在history里 add为判断新增按钮权限 components在新增编辑里  popUp在弹窗里
    //components:[基础，流程]   popUp:[岗位弹窗，供应商]
    allData:[
              //备用金
             {formId:1,data:'applyCash',detailpage:'/pages/detail/main',addpage:'/pages/add/main',add:'Imprest:Add',components:[true,true],popUp:[false,false]},
             //员工管理
             {formId:2,data:'staff',detailpage:'/pages/detail/main',addpage:'/pages/add/main',add:'Imprest:Add',components:[true,false],popUp:[true,false]},
             //供应商管理
             {formId:3,data:'provider',detailpage:'/pages/detail/main',addpage:'/pages/add/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
             //设备信息
             {formId:4,data:'deviceInfo',detailpage:'/pages/extraPages/deviceDetail/main',addpage:'/pages/extraPages/deviceAdd/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
              //采购订单
              {formId:5,data:'PO',detailpage:'/pages/extraPages/PODetail/main',addpage:'/pages/extraPages/POAdd/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
               //入库单
               {formId:6,data:'inStorage',detailpage:'/pages/extraPages/inStorageDetail/main',addpage:'/pages/extraPages/inStorageAdd/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
               //巡检记录
               {formId:7,data:'polling',detailpage:'/pages/extraPages/pollingDetail/main',addpage:'/pages/extraPages/pollingHis/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
                //故障报修
                {formId:8,data:'breakdown',detailpage:'/pages/extraPages/breakdownDetail/main',addpage:'/pages/extraPages/breakdownAdd/main',add:'Imprest:Add',components:[true,false],popUp:[false,true]},
            ]
  },
  mutations: {
    changeForm(state,value) {
      state.formId=value
    },
    changeActive(state,value) {
      state.active=value
    },
    setPermissions(state,value){
      state.permissions=value
    }
  }
})