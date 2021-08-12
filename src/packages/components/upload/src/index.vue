<script>
import Upload from './upload.vue'
import UploadList from './upload-list.vue'

function noop () {}

export default {
  name: 'ElUpload',

  props: {
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },

    multiple: Boolean,
    accept: String,

    withCredentials: Boolean,
    headers: {
      type: Object,
      default () {
        return {}
      }
    },
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,

    beforeUpload: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    beforeRemove: Function,
    onChange: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },

    httpRequest: Function,

    autoUpload: {
      type: Boolean,
      default: true
    },

    fileList: {
      type: Array,
      default () {
        return []
      }
    },

    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    },

    showFileList: {
      type: Boolean,
      default: true
    },
    onPreview: {
      type: Function
    }
  },

  data () {
    return {
      uploadFiles: [],
      tempIndex: 1
    }
  },
  components: {
    Upload,
    UploadList
  },

  methods: {
    getFile (rawFile) {
      const fileList = this.uploadFiles
      let target
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    },

    handleStart (rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }
      // if (this.listType === 'picture-card' || this.listType === 'picture') {
      //   try {
      //     file.url = URL.createObjectURL(rawFile)
      //   } catch (err) {
      //     console.error('[Element Error][Upload]', err)
      //   }
      // }
      this.uploadFiles.push(file)
      this.onChange(file, this.uploadFiles)
    },
    handleProgress (ev, rawFile) {
      const file = this.getFile(rawFile)
      this.onProgress(ev, file, this.uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    },
    handleSuccess (res, rawFile) {
      const file = this.getFile(rawFile)
      if (file) {
        file.status = 'success'
        file.response = res
        this.onSuccess(res, file, this.uploadFiles)
        this.onChange(file, this.uploadFiles)
      }
    },
    handleError (err, rawFile) {
      const file = this.getFile(rawFile)
      const fileList = this.uploadFiles
      file.status = 'fail'
      fileList.splice(fileList.indexOf(file), 1)
      this.onError(err, file, this.uploadFiles)
      this.onChange(file, this.uploadFiles)
    },
    handleRemove (file, raw) {
      if (raw) {
        file = this.getFile(raw)
      }
      const doRemove = () => {
        this.abort(file)
        const fileList = this.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      }
      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    },
    abort (file) {
      this.$refs['upload-inner'].abort(file)
    },
    submit () {
      this.uploadFiles
        .filter((file) => file.status === 'ready')
        .forEach((file) => {
          this.$refs['upload-inner'].upload(file.raw)
        })
    }
  },

  render (h) {
    let uploadList

    if (this.showFileList) {
      uploadList = (
        <UploadList
          listType={this.listType}
          files={this.uploadFiles}
          on-remove={this.handleRemove}
          handlePreview={this.onPreview}
        >
          {(props) => {
            if (this.$scopedSlots.file) {
              return this.$scopedSlots.file({
                file: props.file
              })
            }
          }}
        </UploadList>
      )
    }

    const uploadData = {
      props: {
        listType: this.listType,
        autoUpload: this.autoUpload,

        multiple: this.multiple,
        accept: this.accept,

        'with-credentials': this.withCredentials,
        headers: this.headers,
        action: this.action,
        name: this.name,
        data: this.data,

        'on-start': this.handleStart,
        'before-upload': this.beforeUpload,
        'on-remove': this.handleRemove,

        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-error': this.handleError,

        'http-request': this.httpRequest,

        fileList: this.uploadFiles,

        limit: this.limit,
        'on-exceed': this.onExceed,

        'on-preview': this.onPreview
      },
      ref: 'upload-inner'
    }

    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = <upload {...uploadData}>{trigger}</upload>

    return (
      <div>
        {this.$slots.trigger
          ? [uploadComponent, this.$slots.default]
          : uploadComponent}
        {this.$slots.tip}
        {this.listType !== 'picture-card' ? uploadList : ''}
      </div>
    )
  }
}
</script>
