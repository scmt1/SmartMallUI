<template>
  <!-- 实物盘点商品导入 -->
  <el-dialog
    :modal="false"
    :title="this.$i18n.t('product.uploadTips')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="38%"
  >
    <div class="tips">
      <p>{{$t('shop.exportProdTip1')}}</p>
      <p>{{$t('takeStock.exportTip1')}}</p>
      <p>{{$t('takeStock.exportTip')}}</p>
    </div>
    <div style="display: inline-block">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="$http.adornUrl('/stock/takeStockProd/importExcel')"
        :headers="{ Authorization: $cookie.get('Authorization_vs'),locale:lang }"
        :limit="1"
        name="excelFile"
        :data="{takeStockId: this.takeStockId}"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error="uploadFalse"
        :on-success="uploadSuccess"
        :file-list="files"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload">
        <div slot="tip" class="el-upload__tip"></div>
        <template slot="trigger">
          <div class="default-btn primary-btn">{{$t("product.selectFile") }}</div>
        </template>
        <div v-if="isAuth('multishop:takeStockProd:import')" class="default-btn download-btn" @click="submitUpload">
          {{ $t("product.import") }}</div>
        <div v-if="isAuth('multishop:takeStockProd:download')" class="default-btn download-btn" @click="downloadModel">
          {{ $t("product.downloadTemplate") }}</div>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      visible: false,
      upload: false,
      takeStockId: null,
      files: [],
      dataForm: {
      },
      dataRule: {
      }
    }
  },
  methods: {
    uploadSuccess (response) {
      alert(response.data)
      this.files = []
      this.visible = false
      this.$emit('refreshDataList')
    },
    uploadFalse (response) {
      alert(response.data || this.$i18n.t('product.fileUploadFail'))
    },
    init (id) {
      this.visible = true
      this.takeStockId = id
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
      })
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
      this.$http({
        url: this.$http.adornUrl('/stock/takeStockProd/downLoadModel'),
        method: 'get',
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('takeStock.exportProdFileName')
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
      })
    }
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
