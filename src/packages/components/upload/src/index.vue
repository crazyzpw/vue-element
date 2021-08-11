<script>
import Upload from './upload.vue'

function noop () {}

export default {
  name: 'ElUpload',

  props: {
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },

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
    }
  },

  data () {
    return {
      uploadFiles: [],
      tempIndex: 1
    }
  },
  components: {
    Upload
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
    }
  },

  render (h) {
    const uploadData = {
      props: {
        'with-credentials': this.withCredentials,
        headers: this.headers,
        action: this.action,
        name: this.name,
        data: this.data,

        autoUpload: this.autoUpload,
        //
        'on-start': this.handleStart,
        'before-upload': this.beforeUpload,

        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-error': this.handleError,

        'http-request': this.httpRequest
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
      </div>
    )
  }
}
</script>
