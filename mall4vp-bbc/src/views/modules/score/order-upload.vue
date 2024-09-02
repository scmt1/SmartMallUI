<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    :modal="false"
    :title="$t('order.uploadTips1')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :class="['box',this.$i18n.t('language') === 'English'?'box-en':'']"
  >
    <div class="tips">
      <p>
        {{$t('order.uploadTips0')}}
      </p>
      <p style="margin-top:10px">{{ $t('order.attention') }}:</p>
      <p style="margin-top:10px">
        {{$t('order.uploadTips2')}}
      </p>
      <p style="margin-top:10px">
         {{$t('order.uploadTips3')}}
      </p>
    </div>
    <el-upload
      ref="upload"
      v-loading="loading"
      :auto-upload="false"
      :v-loading="loading"
      :before-upload="beforeAvatarUpload"
      :file-list="files"
      :limit="1"
      :on-error="uploadFalse"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :action="this.$http.adornUrl('/score/order/exportOrderExcel')"
      :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"
      class="upload-demo"
      name="orderExcelFile"
    >
      <!-- :file-list="fileList" -->
      <!-- multiple -->

      <div slot="tip" class="el-upload__tip" />
      <div
        class="default-btn"
        @click="submitUpload"
      >{{ $t("order.ImportingFiles") }}</div>
      <div
        class="default-btn"
        @click="exportOrder"
      >{{ $t("order.exportOrder") }}</div>
      <div slot="trigger" class="default-btn primary-btn select">{{
        $t("order.SelectFile")
      }}</div>

    </el-upload>
  </el-dialog>
</template>
<script>
// import * as api from '@/api/product/list'
// import { getToken } from '@/utils/auth'
// import * as orderApi from '@/api/order/order'
export default {
  props: {
    param: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      visible: false,
      lang: localStorage.getItem('lang') || 'zh_CN',
      loading: false,
      upload: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      couponId: 3,
      files: [],
      getToken: null,
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
  methods: {
    exportOrder () {
      if (!this.param.startTime || !this.param.endTime) {
        this.$message.error(this.$i18n.t('order.pleExpOrderFirst'))
        return
      }
      this.$confirm(this.$t('order.sureToExport'), this.$t('text.tips'), {
        confirmButtonText: this.$t('order.confirm'),
        cancelButtonText: this.$t('order.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/score/order/unDeliveryOrderExcel'),
          methods: 'get',
          params: this.$http.adornParams({
            'startTime': this.param.startTime, // 开始时间
            'endTime': this.param.endTime // 结束时间
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = '待发货订单信息.xlsx'
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
        }).catch((e) => {
          this.$message.error(e)
        })
      })
    },
    uploadSuccess (response) {
      // console.log(response)
      // const data = response
      // if (!data) {
      //   alert(this.$i18n.t('order.fileSuccess'))
      // } else {
      //   alert(data)
      // }

      alert(response.data || this.$i18n.t('order.fileSuccess'))
      this.loading = false
      this.files = []
      this.visible = false
      this.$emit('refreshDataList1')
    },
    uploadFalse (response) {
      this.loading = false
      alert(this.$i18n.t('order.fileUploadFail'))
    },
    init (id) {
      this.visible = true
      this.loading = false
      this.files = []
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
        alert(this.$i18n.t('order.downloadTemplateTips1'))
        return false
      }
      if (!isLt2M) {
        alert(this.$i18n.t('order.downloadTemplateTips2'))
        return false
      }
      this.loading = true
      return extension || (extension2 && isLt2M)
    },
    submitUpload () {
      this.upload = false
      this.$refs.upload.submit()
      if (!this.upload) {
        this.$message.error('请选择要上传的文件')
      }
    },
    handleRemove (file) {
    },
    handlePreview (file) {
      if (file.response.status) {
        alert(this.$i18n.t('order.fileSuccess'))
      } else {
        alert(this.$i18n.t('order.fileFail'))
      }
      this.visible = false
      this.$emit('refreshDataList1')
    }
  }
}
</script>
<style scoped>
 div >>> .el-dialog__body {
   padding: 20px;
 }
 .tips {
   margin-bottom: 30px;
 }
 .select {
   margin-right: 10px;
 }
 .box >>> .el-dialog {
   width: 40%;
 }
 
 @media (max-width:1660px) {
  .box-en >>> .el-dialog {
    width: 69% !important;
  }
 }
 
</style>
