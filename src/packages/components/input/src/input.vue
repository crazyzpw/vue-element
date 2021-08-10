<template>
  <div :class="[type === 'textarea' ? 'el-textarea' : 'el-input']">
    <template v-if="type !== 'textarea'">
      <input
        class="el-input__inner"
        ref="input"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        v-bind="$attrs"
        :value="value"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <!-- 后置内容 -->
      <span class="el-input__suffix" v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <i
            v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
      </span>
    </template>
    <textarea
      v-else
      class="el-textarea__inner"
      :style="textareaStyle"
      ref="textarea"
      v-bind="$attrs"
      :value="value"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    ></textarea>
    <span
      v-if="isWordLimitVisible && type === 'textarea'"
      class="el-input__count"
    >{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>

<script>
import calcTextareaHeight from './calcTextareaHeight'
import emitter from '@/mixins/emitter.js'

export function isKorean (text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi
  return reg.test(text)
}

export default {
  name: 'ElInput',
  componentName: 'ElInput',
  inheritAttrs: false,
  mixins: [emitter],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    },
    // 密码框
    showPassword: Boolean,
    // textarea
    resize: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    //
    showWordLimit: Boolean
  },
  data () {
    return {
      focused: false,
      isComposing: false,

      passwordVisible: false,

      textareaCalcStyle: {}
    }
  },
  computed: {
    showPwdVisible () {
      return this.showPassword
    },

    textareaStyle () {
      return Object.assign({}, this.textareaCalcStyle, { resize: this.resize })
    },

    isWordLimitVisible () {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.showPassword
      )
    },
    upperLimit () {
      return this.$attrs.maxlength
    },
    textLength () {
      if (typeof this.value === 'number') {
        return String(this.value).length
      }
      return (this.value || '').length
    }
  },
  watch: {
    value (val) {
      this.$nextTick(this.resizeTextarea)
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    type () {
      this.$nextTick(() => {
        this.resizeTextarea()
      })
    }
  },
  methods: {
    getInput () {
      return this.$refs.input || this.$refs.textarea
    },

    focus () {
      this.getInput().focus()
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      // TODO 失焦做校验
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      }
    },

    handleCompositionStart () {
      this.isComposing = true
    },
    handleCompositionUpdate (event) {
      const text = event.target.value
      const lastCharacter = text[text.length - 1] || ''
      this.isComposing = !isKorean(lastCharacter)
    },
    handleCompositionEnd (event) {
      if (this.isComposing) {
        this.isComposing = false
        this.handleInput(event)
      }
    },

    handleInput (event) {
      // should not emit input during composition
      if (this.isComposing) return
      this.$emit('input', event.target.value)
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },

    handlePasswordVisible () {
      this.passwordVisible = !this.passwordVisible
      this.$nextTick(() => {
        this.focus()
      })
    },

    resizeTextarea () {
      const { autosize, type } = this
      if (type !== 'textarea') return
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows
      this.textareaCalcStyle = calcTextareaHeight(
        this.$refs.textarea,
        minRows,
        maxRows
      )
    },

    getSuffixVisible () {
      return this.showPassword || this.isWordLimitVisible
    }
  },

  mounted () {
    this.resizeTextarea()
  }
}

// InputEvent.isComposing: 表示正在输入状态

// 因为任何输入都会触发input，input事件没办法知道我们在使用中文输入法，输入中文的时候才触发compositionstart、compositionupdate、compositionend
// isComposing: this is flag
// compositionstart
// compositionupdate
// compositionend

// type="password"
// passwordVisible ? 'text' : 'password'

// textarea
// resize 属性: 调节文本框
// autosize:
//   思路:
//     1. 创建一个 隐形 的 copy hiddenTextarea
//     2. 获取 targetElement 的 paddingSize、borderSize、boxSizing、contextStyle(一些设置的属性)
//     3. 把 2 contextStyle 赋值给 hiddenTextarea
//     4. 把 hiddenTextarea.value = targetElement.value
//     5. 根据一些规则 计算 minHeight、height
//     6. 删除 hiddenTextarea
//     7. 返回 minHeight、height
</script>
