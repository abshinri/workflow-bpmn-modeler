import Vue from 'vue'
import App from './app.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
var EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function() {
      return EventBus
    }
  }
})
Vue.config.productionTip = false

Vue.use(ElementUI)

const _vue = new Vue({
  render: (h) => h(App)
}).$mount('#app')
export default _vue
