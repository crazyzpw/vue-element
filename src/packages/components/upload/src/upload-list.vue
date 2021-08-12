<template>
  <transition-group
    tag="ul"
    :class="['el-upload-list', 'el-upload-list--' + listType]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="[
        'el-upload-list__item',
        'is-' + file.status,
        focusing ? 'focusing' : '',
      ]"
      :key="file.uid"
      tabindex="0"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{ file.name }}--{{ parsePercentage(file.percentage) }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i
            :class="{
              'el-icon-upload-success': true,
              'el-icon-circle-check': listType === 'text',
              'el-icon-check':
                ['picture-card', 'picture'].indexOf(listType) > -1,
            }"
          ></i>
        </label>
        <i class="el-icon-close" @click="$emit('remove', file)"></i>
      </slot>
    </li>
  </transition-group>
</template>

<script>
export default {
  name: 'ElUploadList',

  props: {
    files: {
      type: Array,
      default () {
        return []
      }
    },
    handlePreview: Function,
    listType: String
  },

  data () {
    return {
      focusing: false
    }
  },

  methods: {
    parsePercentage (val) {
      return parseInt(val, 10)
    },
    handleClick (file) {
      this.handlePreview && this.handlePreview(file)
    }
  }
}
</script>
