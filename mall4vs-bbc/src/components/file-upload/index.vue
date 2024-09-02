<template>
  <div>
    <el-upload :action="$http.adornUrl('/admin/file/upload/element')"
               :headers="{Authorization: $cookie.get('Authorization_vs'),locale:lang}"
               :on-remove="handleRemove"
               :on-success="handleUploadSuccess"
               :before-remove="beforeRemove"
               :file-list="fileList"
               multiple>
      <el-button size="small"
                 type="primary">{{$t("components.confirmUpload")}}</el-button>
    </el-upload>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      lang: localStorage.getItem('lang') || 'zh_CN'
    }
  },
  props: {
    value: {
      default: '',
      type: String
    }
  },
  computed: {
    fileList () {
      let res = []
      if (this.value) {
        let fileArray = this.value.split(',')
        for (let i = 0; i < fileArray.length; i++) {
          res.push({ name: fileArray[i], url: this.resourcesUrl + fileArray[i], response: fileArray[i] })
        }
      }
      this.$emit('input', this.value)
      return res
    }
  },
  methods: {
    // 图片上传
    handleUploadSuccess (response, file, fileList) {
      let files = fileList.map(file => {
        return file.response
      }).join(',')
      this.$emit('change', files)
    },
    // 限制图片上传大小
    async beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        try {
          const resultBlob = await imageCompression(file, {
            maxSizeMB: 2 // 压缩大小
          })
          const fs = new File([resultBlob], file.name, {
            type: file.type
          })
          return fs
        } catch (error) {
          return Promise().reject()
        }
        // this.$message.error(this.$i18n.t('components.avaExc2MB'))
      }
      return true
    },
    handleRemove (file, fileList) {
      let files = fileList.map(file => {
        return file.response
      }).join(',')
      this.$emit('change', files)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`${this.$i18n.t('text.isRemove')} ${file.name}？`)
    }
  }
}
</script>

<style lang="scss">
</style>
