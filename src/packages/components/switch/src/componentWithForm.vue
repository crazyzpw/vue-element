<template>
  <div
    class="el-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    @click.prevent="switchValue"
  >
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <span
      class="el-switch__core"
      ref="core"
      :style="{ width: coreWidth + 'px' }"
    >
    </span>
  </div>
</template>

<script>
import emitter from '@/mixins/emitter.js'

export default {
  name: 'ElSwitch',
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    id: String
  },
  data () {
    return {
      coreWidth: this.width
    }
  },
  computed: {
    checked () {
      return this.value === this.activeValue
    },
    switchDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  watch: {
    checked () {
      this.$refs.input.checked = this.checked
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value])
      }
    }
  },
  methods: {
    handleChange (event) {
      const val = this.checked ? this.inactiveValue : this.activeValue
      this.$emit('input', val)
      this.$emit('change', val)
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked
      })
    },
    setBackgroundColor () {
      const newColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    },
    switchValue () {
      !this.switchDisabled && this.handleChange()
    }
  },
  created () {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue)
    }
  },
  mounted () {
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    this.$refs.input.checked = this.checked
  }
}
</script>
