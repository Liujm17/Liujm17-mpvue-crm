import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    formId: 1
  },
  mutations: {
    changeForm(state,value) {
      state.formId=value
    }
  }
})