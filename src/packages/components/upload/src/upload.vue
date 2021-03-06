<script>
import ajax from './ajax'

export default {
  props: {
    disabled: Boolean,
    autoUpload: Boolean,
    listType: String,

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
    onRemove: {
      type: Function,
      default: function () {}
    },
    onProgress: Function,
    onSuccess: Function,
    onError: Function,

    httpRequest: {
      type: Function,
      default: ajax
    },

    fileList: Array,

    limit: Number,
    onExceed: Function
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
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList)
        return
      }
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
      const before = this.beforeUpload(rawFile)
      if (before && before.then) {
        before.then(
          (processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            // do something
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type
                })
              }
              for (const p in rawFile) {
                // eslint-disable-next-line no-prototype-builtins
                if (rawFile.hasOwnProperty(p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              this.post(processedFile)
            } else {
              this.post(rawFile)
            }
          },
          () => {
            this.onRemove(null, rawFile)
          }
        )
      } else if (before !== false) {
        this.post(rawFile)
      } else {
        this.onRemove(null, rawFile)
      }
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
    },
    abort (file) {
      const { reqs } = this
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    }
  },

  render (h) {
    const { name, multiple, accept, handleClick, handleChange, listType } =
      this

    const data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick
      }
    }
    data.class[`el-upload--${listType}`] = true
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

// submit 手动上传文件列表
//   auto-upload要为false

// on-remove
//   用户需要定义 handleRemove 函数， 因为 upload 组件只会从 uploadFiles的 list 中删除， 并不会从服务器中删除

// before-upload
// http-request
//   可以 dosomething

// multiple
//   自动限制用户选择文件个数

// accept
//   文件选择器只允许你选择 accept 值指定的文件类型（实际特性会按不同的浏览器和操作系统有所不同）

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
//       post方法 调用接口 上传
//         onerror:
//           1. 从 uploadFiles 移除当前这个 file
//           2. 调用 用户定义的 on-error 方法
//         onSuccess:
//           给 rawFile 添加 response 字段，value为 请求返回结果
//         on-progress:
//           文件上传时，用户自定义的回调
//     有
//       验证通过, 上传
//       验证不通过, 从 uploadFiles 移除当前这个 file

// https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
// FormData
// https://developer.mozilla.org/zh-CN/docs/Web/API/File
// File
// https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file
// <input type="file">

// File>在web应用程序中使用文件 大全
// https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications#example.3a_using_object_urls_to_display_images
</script>
