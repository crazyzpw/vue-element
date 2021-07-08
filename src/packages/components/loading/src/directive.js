import Vue from 'vue'
import Loading from './loading.vue'
import { addClass, removeClass, getStyle } from '@/utils/dom'
import afterLeave from '@/utils/after-leave'

const Mask = Vue.extend(Loading)

const loadingDirective = {}
loadingDirective.install = Vue => {
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(() => {
        if (binding.modifiers.body) {
          el.originalPosition = getStyle(document.body, 'position')
          insertDom(document.body, el, binding)
        } else {
          el.originalPosition = getStyle(el, 'position')
          insertDom(el, el, binding)
        }
      })
    } else {
      afterLeave(
        el.instance,
        _ => {
          if (!el.instance.hiding) return

          el.domVisible = false

          const target = binding.modifiers.body ? document.body : el
          removeClass(target, 'el-loading-parent--relative')
          removeClass(target, 'el-loading-parent--hidden')

          el.instance.hiding = false
        },
        300,
        true
      )
      el.instance.visible = false
      el.instance.hiding = true
    }
  }

  const insertDom = (parent, el, binding) => {
    if (
      !el.domVisible &&
      getStyle(el, 'display') !== 'none' &&
      getStyle(el, 'visibility') !== 'hidden'
    ) {
      if (
        el.originalPosition !== 'absolute' &&
        el.originalPosition !== 'fixed' &&
        el.originalPosition !== 'relative'
      ) {
        addClass(parent, 'el-loading-parent--relative')
      }

      if (binding.modifiers.lock) {
        addClass(parent, 'el-loading-parent--hidden')
      }

      // flag1
      el.domVisible = true

      parent.appendChild(el.mask)

      Vue.nextTick(() => {
        el.instance.visible = true
      })

      // flag2
      el.domInserted = true
    }
  }

  Vue.directive('loading', {
    bind (el, binding, vnode) {
      const textExr = el.getAttribute('element-loading-text')
      const spinnerExr = el.getAttribute('element-loading-spinner')
      const backgroundExr = el.getAttribute('element-loading-background')

      const vm = vnode.context
      // instance
      const mask = new Mask({
        // el选项: 自动 $mount()
        el: document.createElement('div'),
        data: {
          text: (vm && vm[textExr]) || textExr,
          spinner: (vm && vm[spinnerExr]) || spinnerExr,
          background: (vm && vm[backgroundExr]) || backgroundExr
        }
      })

      el.instance = mask
      el.mask = mask.$el

      binding.value && toggleLoading(el, binding)
    },
    update (el, binding) {
      el.instance.setText(el.getAttribute('element-loading-text'))

      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },
    unbind (el, binding) {
      if (el.domInserted) {
        el.mask &&
          el.mask.parentNode &&
          el.mask.parentNode.removeChild(el.mask)
      }
      el.instance && el.instance.$destroy()
    }
  })
}

export default loadingDirective

// element-loading-text 加载文案
// element-loading-spinner 加载图标
// element-loading-background 遮罩层背景颜色

// 指令修饰符
//    body 插入到 body 元素，默认插入到 挂载元素
//    lock 父元素 overflow: hidden
