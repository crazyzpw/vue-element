<script>
import ajax from './ajax'

export default {
  props: {
    disabled: Boolean,
    autoUpload: Boolean,

    multiple: Boolean,
    accept: String,

    withCredentials: Boolean,
    headers: Object,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,

    onStart: Function,
    beforeUpload: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,

    httpRequest: {
      type: Function,
      default: ajax
    }
  },

  data () {
    return {
      reqs: {}
    }
  },

  methods: {
    handleClick () {
      if (!this.disabled) {
        this.$refs.input.value = null
        this.$refs.input.click()
      }
    },
    handleChange (ev) {
      const files = ev.target.files
      if (!files) return
      this.uploadFiles(files)
    },
    uploadFiles (files) {
      //   if (this.limit && this.fileList.length + files.length > this.limit) {
      //     this.onExceed && this.onExceed(files, this.fileList)
      //     return
      //   }
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      if (postFiles.length === 0) {
      }
      postFiles.forEach((rawFile) => {
        this.onStart(rawFile)
        if (this.autoUpload) this.upload(rawFile)
      })
    },
    upload (rawFile) {
      this.$refs.input.value = null
      if (!this.beforeUpload) {
        return this.post(rawFile)
      }
      //   const before = this.beforeUpload(rawFile)
      //   if (before && before.then) {
      //     before.then(
      //       (processedFile) => {
      //         const fileType = Object.prototype.toString.call(processedFile)
      //         if (fileType === '[object File]' || fileType === '[object Blob]') {
      //           if (fileType === '[object Blob]') {
      //             processedFile = new File([processedFile], rawFile.name, {
      //               type: rawFile.type
      //             })
      //           }
      //           for (const p in rawFile) {
      //             if (rawFile.hasOwnProperty(p)) {
      //               processedFile[p] = rawFile[p]
      //             }
      //           }
      //           this.post(processedFile)
      //         } else {
      //           this.post(rawFile)
      //         }
      //       },
      //       () => {
      //         this.onRemove(null, rawFile)
      //       }
      //     )
      //   } else if (before !== false) {
      //     this.post(rawFile)
      //   } else {
      //     this.onRemove(null, rawFile)
      //   }
    },
    post (rawFile) {
      const { uid } = rawFile
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.onProgress(e, rawFile)
        },
        onSuccess: (res) => {
          this.onSuccess(res, rawFile)
          delete this.reqs[uid]
        },
        onError: (err) => {
          this.onError(err, rawFile)
          delete this.reqs[uid]
        }
      }
      const req = this.httpRequest(options)
      this.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    }
  },

  render (h) {
    const { name, multiple, accept, handleClick, handleChange } = this

    const data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick
      }
    }
    return (
      <div {...data} tabindex="0">
        {this.$slots.default}
        <input
          class="el-upload__input"
          type="file"
          ref="input"
          name={name}
          on-change={handleChange}
          multiple={multiple}
          accept={accept}
        ></input>
      </div>
    )
  }
}

// multiple
//   自动限制用户选择文件个数

// http-request
//   文件上传到服务器方法， 接收 options 参数

// on-error
//   用户定义的错误回调
// on-success
//   用户定义的成功回调

// formData中字段
//   name: file
//   data: { ...data }

// 1. 手动间接触发 input:file click
// 2. 选择上传的 文件file，触发onChange事件
//     a. handleStart方法 处理 rawFile，把 rawFile push到uploadFiles
// 3. upload
//     有无beforeUpload
//     无
//         post方法 调用接口 上传
//             onerror:
//                 1. 从 uploadFiles 移除当前这个 file
//                 2. 调用 用户定义的 on-error 方法
//             onSuccess:
//                 给 rawFile 添加 response 字段，value为 请求返回结果
//             on-progress:
//                 文件上传时，用户自定义的回调
</script>
