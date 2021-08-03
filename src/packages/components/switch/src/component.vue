<template>
  <div
    class="el-switch"
    :class="{ 'is-checked': checked }"
    @click.prevent="switchValue"
  >
    <span
      class="el-switch__core"
      ref="core"
      :style="{ width: coreWidth + 'px' }"
    >
    </span>
  </div>
</template>

<script>
export default {
  name: 'ElSwitch',
  props: {
    value: {
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
    }
  },
  data () {
    return {
      coreWidth: this.width
    }
  },
  computed: {
    checked () {
      return this.value
    }
  },
  watch: {
    checked () {
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
    }
  },
  methods: {
    handleChange () {
      const val = !this.checked
      this.$emit('input', val)
    },
    setBackgroundColor () {
      const newColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    },
    switchValue () {
      this.handleChange()
    }
  },
  mounted () {
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
  }
}
</script>
