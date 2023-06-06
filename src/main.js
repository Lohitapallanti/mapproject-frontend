import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
Vue.config.productionTip = false

Vue.filter('json', x => JSON.stringify(x))
Vue.use(Vuetify, {
  iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
})

// global variable
Vue.prototype.$timetime = 6
Vue.prototype.$timetotal = 7
Vue.prototype.$dwelltime = 8
Vue.prototype.$timeline_timeline = 9
Vue.prototype.$timeline_overview = 10

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
