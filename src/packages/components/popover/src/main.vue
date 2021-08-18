<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        class="el-popover el-popper"
        :class="[popperClass, content && 'el-popover--plain']"
        ref="popper"
        v-show="showPopper"
        :style="{ width: width + 'px' }"
        role="popover"
      >
        <div class="el-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <span class="el-popover__reference-wrapper" ref="wrapper">
      <slot name="reference"></slot>
    </span>
  </span>
</template>

<script>
import Popper from '@/utils/vue-popper'
import { on, off, addClass, removeClass } from '@/utils/dom'

export default {
  name: 'ElPopover',

  mixins: [Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: (value) =>
        ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },

    reference: {},

    popperClass: String,
    width: {},

    title: String,
    // 后备内容
    content: String,

    visibleArrow: Boolean,
    transition: {
      type: String,
      default: 'fade-in-linear'
    }
  },

  watch: {
    showPopper (val) {
      val ? this.$emit('show') : this.$emit('hide')
    }
  },

  methods: {
    doToggle () {
      this.showPopper = !this.showPopper
    },
    handleClick () {
      removeClass(this.referenceElm, 'focusing')
    },
    handleDocumentClick (e) {
      let reference = this.reference || this.$refs.reference
      const popper = this.popper || this.$refs.popper
      if (!reference && this.$refs.wrapper.children) {
        reference = this.referenceElm = this.$refs.wrapper.children[0]
      }
      if (
        !this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)
      ) {
        return
      }
      this.showPopper = false
    },

    handleAfterEnter () {
      this.$emit('after-enter')
    },
    handleAfterLeave () {
      this.$emit('after-leave')
      this.doDestroy()
    },
    cleanup () {}
  },

  mounted () {
    let reference = (this.referenceElm =
      this.reference || this.$refs.reference)
    // const popper = this.popper || this.$refs.popper;
    if (!reference && this.$refs.wrapper.children) {
      reference = this.referenceElm = this.$refs.wrapper.children[0]
    }

    if (reference) {
      addClass(reference, 'el-popover__reference')

      on(reference, 'click', this.handleClick)
    }
    if (this.trigger === 'click') {
      on(reference, 'click', this.doToggle)
      on(document, 'click', this.handleDocumentClick)
    }
  },

  beforeDestroy () {
    this.cleanup()
  },

  deactivated () {
    this.cleanup()
  },

  destroyed () {
    const reference = this.reference
    off(reference, 'click', this.doToggle)
    off(document, 'click', this.handleDocumentClick)
  }
}

// 指令方式 和 组件方式 基本一样
//   区别在于 referenceDom 绑定上方式不一样
//     组件: 方式很直接
//     指令:
//       <el-popover
//         ref="popover"
//         ...
//       ></el-popover>
//     <button v-popover:popover></button>

//     const popper = vnode.context.$refs[_ref]
//     popper.$refs.reference = el

// 实现将 DOM节点 插入到document.body下
// Node.appendChild
//   将一个节点附加到指定父节点的子节点列表的末尾处。

//   如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）。
</script>
