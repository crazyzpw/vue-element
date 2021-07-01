import Vue from 'vue'
import Element from './packages'
import './scss/index.scss'
import App from './App.vue'

Vue.use(Element)

new Vue({
  render: h => h(App)
}).$mount('#app')
