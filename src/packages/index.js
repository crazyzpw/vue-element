import Loading from './components/loading/index.js'
import Message from './components/message/index.js'

const components = []

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.use(Loading.directive)

  Vue.prototype.$message = Message
  Vue.prototype.$loading = Loading.service
}

export default {
  install,
  Loading,
  Message
}
