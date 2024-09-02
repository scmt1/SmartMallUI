<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    :modal="false"
    :title="this.$i18n.t('product.uploadTips')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="38%"
  >
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="$http.adornUrl(`/shop/stockBillLogItem/importExcel`)"
      :headers="{ Authorization: $cookie.get('Authorization_vs'),locale:lang }"
      :data="params"
      :limit="1"
      name="excelFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="uploadFalse"
      :on-success="uploadSuccess"
      :file-list="files"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
    >
      <!-- :file-list="fileList" -->
      <!-- multiple -->
      <div slot="tip" class="el-upload__tip"></div>
      <template slot="trigger">
        <div class="default-btn primary-btn">{{
            $t("product.selectFile")
          }}</div>
      </template>
      <div
        class="default-btn download-btn"
        @click="submitUpload"
      >{{ $t("product.import") }}</div
      >
      <div
        class="default-btn download-btn"
        @click="downloadModel"
      >{{ $t("product.downloadTemplate") }}</div
      >
    </el-upload>
  </el-dialog>
</template>
<script>
export default {
  props: {
    type: {
      default: 0,
      type: Number // 1 出库 2 入库
    }
  },
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      isSubmit: false,
      visible: false,
      upload: false,
      couponId: 3,
      files: [],
      params: {
        type: 0
      },
      dataForm: {
        consignmentName: '',
        consignmentMobile: '',
        consignmentAddr: ''
      },
      dataRule: {
        consignmentName: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
        ],
        consignmentMobile: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
        ],
        consignmentAddr: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.params.type = this.type
  },
  methods: {
    uploadSuccess (response) {
      // if (response) {
      //   alert(response.tips)
      //   this.files = []
      //   this.visible = false
      //   this.$emit('refreshDataList', response)
      // } else {
      //   alert(this.$i18n.t('product.fileFail'))
      //   this.$emit('refreshDataList', response)
      // }
      alert(response.data.tips)
      this.files = []
      this.visible = false
      this.$emit('refreshDataList', response.data)
    },
    uploadFalse (response) {
      alert(this.$i18n.t('product.fileUploadFail'))
    },
    init (id) {
      this.visible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
      })
      this.couponId = id
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      this.upload = true
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        alert(this.$i18n.t('product.downloadTemplateTips1'))
      }
      if (!isLt2M) {
        alert(this.$i18n.t('product.downloadTemplateTips2'))
      }
      return extension || (extension2 && isLt2M)
    },
    submitUpload () {
      this.upload = false
      this.$refs.upload.submit()
      if (!this.upload) {
        this.$message.error(this.$i18n.t('shop.fileNullTip'))
      }
    },
    handleRemove (file) {
      // console.log(file)
    },
    handlePreview (file) {
      if (file.response.status) {
        alert(this.$i18n.t('product.fileSuccess'))
        this.$emit('refreshDataList')
      } else {
        alert(this.$i18n.t('product.fileFail'))
      }
    },
    // 下载模板
    downloadModel () {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLogItem/downloadModel'),
        method: 'get',
        params: this.$http.adornParams({type: this.type}),
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.type === 1 ? this.$i18n.t('stock.outProdFileName') : this.$i18n.t('stock.inProdFileName')
        const elink = document.createElement('a')
        if ('download' in elink) { // 非IE下载
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('stock.downloadSuccessful'),
          type: 'success',
          duration: 1500
        })
        this.isSubmit = false
      }).catch(() => {
        this.isSubmit = false
      })
    }
    // init () {
    //   this.visible = true
    //   this.$nextTick(() => {
    //     // this.$refs['dataForm'].resetFields()
    //   })
    // }
    // // 表单提交
    // dataFormSubmit () {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.visible = false
    //       this.$emit('inputCallback', this.dataForm)
    //     }
    //   })
    // }
  }
}
</script>
<style scoped>
.download-btn {
  margin-left: 12px;
}
div >>> .el-dialog__body {
  padding-top: 10px;
}
</style>
