<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'el-message',
        type && !iconClass ? `el-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
      ]"
      v-show="visible"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p class="el-message__content">{{ message }}</p>
      </slot>
      <i
        v-if="showClose"
        class="el-message__closeBtn el-icon-close"
        @click="close"
      ></i>
    </div>
  </transition>
</template>

<script>
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export default {
  data () {
    return {
      visible: false,
      duration: 3000,
      timer: null,
      closed: false,
      type: 'info',
      message: '',
      iconClass: '',
      center: false,
      showClose: false,
      onClose: null
    }
  },
  computed: {
    typeClass () {
      const type = this.type
      return type && !this.iconClass
        ? `el-message__icon el-icon-${typeMap[type]}`
        : ''
    }
  },
  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
      }
    }
  },
  methods: {
    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    close () {
      this.closed = true
      const onClose = this.onClose
      if (typeof onClose === 'function') {
        onClose(this)
      }
    },
    handleAfterLeave () {
      // 清除副作用
      // v-show 触发不了 destroy 生命周期

      // 销毁实例
      this.$destroy()
      // 移除dom
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  mounted () {
    this.startTimer()
  }
}
</script>
