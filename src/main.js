import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

/* Array.prototype.findIndexOfElement = function(elem) {
  var index = this.findIndex((val) => {
    if (elem == val) return true;
    return false;
  });
  console.log(index)
  return index
} */

new Vue({
  render: h => h(App),
}).$mount('#app')
