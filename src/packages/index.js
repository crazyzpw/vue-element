import Loading from './components/loading/index.js'
import Message from './components/message/index.js'
import Switch from './components/switch/index.js'
import Input from './components/input/index.js'
import InputNumber from './components/input-number/index.js'
import Rate from './components/rate/index.js'
import Upload from './components/upload/index.js'

import Popover from './components/popover/index.js'

import CollapseTransition from './transitions/collapse-transition.js'

const components = [
  Switch,
  Input,
  InputNumber,
  Rate,
  Upload,

  Popover,

  CollapseTransition
]

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
  InputNumber,
  Rate,
  Upload,

  Popover,

  CollapseTransition
}
