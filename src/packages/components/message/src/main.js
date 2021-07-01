import Vue from 'vue'
import Main from './main.vue'
import { isVNode } from '@/utils/vdom'
const MessageConstructor = Vue.extend(Main)

let instance
const instances = []
let seed = 1

const Message = function (options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  const userOnClose = options.onClose
  const id = 'message_' + seed++

  options.onClose = function () {
    Message.close(id, userOnClose)
  }

  instance = new MessageConstructor({
    data: options
  })
  instance.id = id

  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }

  instance.$mount()
  document.body.appendChild(instance.$el)

  // 元素没有渲染完整前 transition 无效
  // 触发异步更新
  instance.visible = true

  instances.push(instance)
  return instance
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

Message.close = function (id, userOnClose) {
  const len = instances.length
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
}

export default Message

// Vue.extend = function (extendOptions: Object): Function {
//   extendOptions = extendOptions || {}

//   const Sub = function VueComponent (options) {
//     this._init(options)
//   }

//   Sub.options = mergeOptions(
//     Vue.options,
//     extendOptions
//   )
//   // 继承 Vue 上 global api

//   return Sub
// }

// 挂载时，挂载关闭定时器
// // 动态创建的组件，没有在代码视图上展示，也就无法触发 destroyed 去做相应的操作
// // 这种做法可以让 dom 元素 执行完动画以后,删除
// 关闭时，通过 v-show="visible" 隐藏 dom元素， 触发 transition 上的 after-leave钩子
// 在 after-leave钩子上 做 清除副作用、删除dom 操作
