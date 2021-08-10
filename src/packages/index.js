import Loading from './components/loading/index.js'
import Message from './components/message/index.js'
import Switch from './components/switch/index.js'
import Input from './components/input/index.js'
import InputNumber from './components/input-number/index.js'

const components = [Switch, Input, InputNumber]

const install = function (Vue) {
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
  Message,
  Switch,
  Input,
  InputNumber
}
