import Vue from 'vue'
import LoadingVue from './loading.vue'
import merge from '@/utils/merge'
import afterLeave from '@/utils/after-leave'
import { addClass, removeClass, getStyle } from '@/utils/dom'

const LoadingConstructor = Vue.extend(LoadingVue)

const defaults = {
  text: null,
  body: false,
  lock: false
}
LoadingConstructor.prototype.originalPosition = ''
LoadingConstructor.prototype.close = function () {
  afterLeave(
    this,
    _ => {
      const target = this.body ? document.body : this.target
      removeClass(target, 'el-loading-parent--relative')
      removeClass(target, 'el-loading-parent--hidden')
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
      this.$destroy()
    },
    300
  )
  this.visible = false
}

const addStyle = (options, parent, instance) => {
  instance.originalPosition = getStyle(parent, 'position')
}

const Loading = options => {
  options = merge({}, defaults, options)

  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target)
  }
  options.target = options.target || document.body

  if (options.target === document.body) {
    options.body = true
  }

  const parent = options.body ? document.body : options.target

  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  })

  addStyle(options, parent, instance)
  if (
    instance.originalPosition !== 'absolute' &&
    instance.originalPosition !== 'fixed'
  ) {
    addClass(parent, 'el-loading-parent--relative')
  }
  // TODO
  if (options.lock) {
    addClass(parent, 'el-loading-parent--hidden')
  }

  parent.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })

  return instance
}

export default Loading
