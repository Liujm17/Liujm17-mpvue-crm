import Vue from 'vue'
import App from './App'
import MpvueRouterPatch from 'mpvue-router-patch'
import store from './utils/store'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
