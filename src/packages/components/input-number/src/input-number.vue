<template>
  <div
    :class="[
      'el-input-number',
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight },
    ]"
  >
    <span
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      :class="{ 'is-disabled': minDisabled }"
      v-repeat-click="decrease"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      :class="{ 'is-disabled': maxDisabled }"
      v-repeat-click="increase"
    >
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <el-input
      ref="input"
      :value="displayValue"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      :placeholder="placeholder"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    >
    </el-input>
  </div>
</template>

<script>
import ElInput from '@/packages/components/input/index.js'
import RepeatClick from '@/directives/repeat-click.js'

export default {
  name: 'ElInputNumber',

  components: {
    ElInput
  },

  directives: {
    repeatClick: RepeatClick
  },

  props: {
    value: {},
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },

    step: {
      type: Number,
      default: 1
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    },

    name: String,
    label: String,
    placeholder: String
  },
  data () {
    return {
      currentValue: 0,
      userInput: null
    }
  },
  computed: {
    displayValue () {
      // 用户正在输入
      if (this.userInput !== null) {
        return this.userInput
      }

      const currentValue = this.currentValue
      if (typeof currentValue === 'number') {
        //
      }
      return currentValue
    },

    minDisabled () {
      return this._decrease(this.value, this.step) < this.min
    },
    maxDisabled () {
      return this._increase(this.value, this.step) > this.max
    },
    controlsAtRight () {
      return this.controls && this.controlsPosition === 'right'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (value) {
        let newVal = value === undefined ? value : Number(value)
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return
          }
        }
        if (newVal >= this.max) newVal = this.max
        if (newVal <= this.min) newVal = this.min
        this.currentValue = newVal
        this.userInput = null
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    handleBlur (event) {
      this.$emit('blur', event)
    },
    handleFocus (event) {
      this.$emit('focus', event)
    },

    handleInput (value) {
      this.userInput = value
    },
    handleInputChange (value) {
      const newVal = value === '' ? undefined : Number(value)
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal)
      }
      this.userInput = null
    },

    setCurrentValue (newVal) {
      const oldVal = this.currentValue
      if (newVal >= this.max) newVal = this.max
      if (newVal <= this.min) newVal = this.min
      if (oldVal === newVal) return
      this.userInput = null
      this.$emit('input', newVal)
      this.$emit('change', newVal, oldVal)
      this.currentValue = newVal
    },

    _decrease (val, step) {
      if (typeof val !== 'number' && val !== undefined) {
        return this.currentValue
      }

      return val
    },
    _increase (val, step) {
      if (typeof val !== 'number' && val !== undefined) {
        return this.currentValue
      }

      return val
    },

    decrease () {
      if (this.minDisabled) return
      const value = this.value || 0
      // const newVal = this._decrease(value, this.step);
      const newVal = value - this.step

      this.setCurrentValue(newVal)
    },
    increase () {
      if (this.maxDisabled) return
      const value = this.value || 0
      // const newVal = this._increase(value, this.step);
      const newVal = value + this.step

      this.setCurrentValue(newVal)
    }
  }
}

// displayValue 依赖 currentValue、userInput
//   userInput
//     只有在用户输入(input)，不为null，
//     其他情况、change，都未null
//   displayValue = currentValue

// 传入的value
//   undefined -> currentValue = undefined
//   null、数字 -> min < currentValue < max
//   字符串 -> currentValue默认值

//   第一次
//     undefined、数字、默认值0

// handleInputChange
//   空串 -> undefined
//   字符串 -> 空操作
//   字符串数字 -> 数字

// todo
// max、min disabled这个功能没完成
</script>
