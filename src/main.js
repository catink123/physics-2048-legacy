import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

document.title = "Физический 2048"

new Vue({
  render: h => h(App),
}).$mount('#app')
