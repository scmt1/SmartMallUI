<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    :modal="false"
    :title="$t('retailProd.upLoadRetailProd')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="38%"
  >
<!--    <p>{{$t('retailProd.uploadRetailProdTip')}}</p>-->
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="$http.adornUrl('/shop/retailProd/importExcel')"
      :headers="{Authorization: $cookie.get('Authorization_vs'),locale:lang}"
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
      <div slot="trigger" class="default-btn primary-btn" style="margin-right: 10px;">{{$t("retailProd.chooseFile")}}</div>
      <div
        class="default-btn"
        @click="submitUpload"
      >{{$t("retailProd.confirmImport")}}</div>
      <div
        class="default-btn"
        @click="downloadModel"
      >{{$t("retailProd.DownloadTemplate")}}</div>
    </el-upload>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        lang: localStorage.getItem('lang') || 'zh_CN',
        couponId: 3,
        files: [],
        dataForm: {
        },
        dataRule: {
        }
      }
    },
    methods: {
      uploadSuccess (response) {
        // if (response) {
        //   alert(response)
        //   this.files = []
        //   this.visible = false
        //   this.$emit('refreshUpload')
        // } else {
        //   alert(this.isEn() ? 'File import failed' : '文件导入失败')
        // }
        alert(response.data)
        this.files = []
        this.visible = false
        this.$emit('refreshDataList')
      },
      uploadFalse (response) {
        // alert(this.isEn() ? 'File upload failed!' : '文件上传失败！')
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
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          alert(this.isEn() ? 'Upload template can only be in xls, xlsx format!' : '上传模板只能是 xls、xlsx格式!')
        }
        if (!isLt2M) {
          alert(this.isEn() ? 'Upload template size cannot exceed 10MB' : '上传模板大小不能超过 10MB!')
        }
        return extension || (extension2 && isLt2M)
      },
      submitUpload () {
        // if (this.businessType != null) {
        // 触发组件的action
        if (this.$refs.upload.uploadFiles && !this.$refs.upload.uploadFiles.length) {
          return this.$message.error('请选择文件！')
        }
        this.$refs.upload.submit()
        // }
        // if (this.businessType == null) {
        //   this.businessType = 'businessType不能为空'
        // }
      },
      handleRemove (file) {
        // console.log(file)
      },
      handlePreview (file) {
        if (file.response.status) {
          alert(this.isEn() ? 'This file import success' : '此文件导入成功')
        } else {
          alert(this.isEn() ? 'This file import failed' : '此文件导入失败')
        }
      },
      // 下载模板
      downloadModel () {
        this.$http({
          url: this.$http.adornUrl('/shop/retailProd/importRetailProdModel'),
          method: 'get',
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.isEn() ? 'SingleProductImportTemplate.xlsx' : '单品导入模板.xlsx'
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
      },
      isEn () {
        if (this.$i18n.t('language') === 'English') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
