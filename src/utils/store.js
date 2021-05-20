import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    formId: 1,
    active:0,
    permissions:[],
    allData:[{formId:1,data:'applyCash',page:'applyDetail'}]
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