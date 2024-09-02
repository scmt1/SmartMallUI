<template>
  <el-dialog
    :title=" $t('text.editBtn')"
    :visible.sync="visible"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-position="left"
      size="small"
      label-width="auto"
    >
      <!-- 订单id -->
      <el-form-item :label="$t('order.number')+'：'" prop="orderNumber">
        <div>{{ dataForm.orderNumber || '' }}</div>
      </el-form-item>
      <!-- 发票类型 1.电子普通发票 -->
      <el-form-item :label="$t('order.invoiceType')+'：'" prop="invoiceType">
        <div v-if="dataForm.invoiceType === 1">{{ $t('order.normalInvoiceType') }}</div>
      </el-form-item>
      <!-- 抬头类型 1.单位 2.个人 -->
      <el-form-item :label="$t('order.headerType')+'：'" prop="headerType">
        <div>{{ ['',$t('order.unit'),$t('order.personal')][dataForm.headerType] }}</div>
      </el-form-item>
      <!-- 抬头名称 -->
      <el-form-item v-if="dataForm.headerName" :label="$t('order.headerName')+'：'" prop="headerName">
        <div>{{ dataForm.headerName || '' }}</div>
      </el-form-item>
      <!-- 发票税号 -->
      <el-form-item v-if="dataForm.invoiceTaxNumber && dataForm.headerType === 1" :label="$t('order.invoiceTaxNumber')+'：'" prop="invoiceTaxNumber">
        <div>{{ dataForm.invoiceTaxNumber || '' }}</div>
      </el-form-item>
      <!-- 订单状态 -->
      <el-form-item :label="$t('group.orderStatus')+'：'" prop="orderStatus">
        <span v-if="dataForm.orderStatus === 1">{{$t('order.pendingPayment')}}</span>
        <span v-if="dataForm.orderStatus === 2">{{$t('order.toBeShipped')}}</span>
        <span v-if="dataForm.orderStatus === 3">{{$t('order.pendingReceipt')}}</span>
        <span v-if="dataForm.orderStatus === 4">{{$t('order.toBeEvaluated')}}</span>
        <span v-if="dataForm.orderStatus === 5">{{$t('order.success')}}</span>
        <span v-if="dataForm.orderStatus === 6">{{$t('order.fail')}}</span>
        <span v-if="dataForm.orderStatus === 7">{{$t('group.waitGroup')}}</span>
      </el-form-item>
      <!-- 发票状态 1.申请中 2.已开票 -->
      <el-form-item :label="$t('order.invoiceStatus')+'：'" prop="invoiceState">
        <div>{{ ['',$t('order.applicationInProgress'),$t('order.invoiceIssued'),$t('order.fail')][dataForm.invoiceState] }}</div>
      </el-form-item>
      <!-- 发票上传： -->
      <el-form-item v-if="isAuth('order:orderInvoice:upload')" :label="$t('order.invoiceUpload')+'：'">
        <div>
          <el-link v-if="fileInfo.filePath" target="_blank" rel="noopener noreferrer"  :href="resourcesUrl+fileInfo.filePath">{{ fileInfo.fileName + '.' + fileInfo.fileType }}</el-link>
          <el-upload
            ref="upload"
            accept=".pdf"
            :action="$http.adornUrl('/admin/file/save_pdf_file')"
            :headers="{Authorization: $cookie.get('Authorization_vs'),locale:lang}"
            :multiple="false"
            :auto-upload="false"
            :limit="1"
            :before-upload="beforeUpload"
            :on-change="onUploadChange"
            :on-progress="onUploadProgress"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :on-exceed="onUploadExceedTip"
          >
            <el-button slot="trigger" size="small" type="primary">{{ $t('order.SelectFile') }}</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="onUploadConfirm">{{ $t('pictureManager.confirmUpload')}}
              <el-tooltip :content="$t('pictureManager.uploadPDF')" placement="top" effect="light">
                <i class="el-icon-question el-icon--right" />
              </el-tooltip>
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
      <!-- 申请时间 -->
      <el-form-item :label="$t('order.applicationTime')+'：'" prop="applicationTime">
        <div>{{ dataForm.applicationTime }}</div>
      </el-form-item>
      <!-- 上传时间 -->
      <el-form-item v-if="dataForm.uploadTime" :label="$t('order.uploadTime')+'：'" prop="uploadTime">
        <div>{{ dataForm.uploadTime }}</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div v-if="isAuth('order:orderInvoice:commit')" class="default-btn primary-btn" @click="beforeSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      lang: localStorage.getItem('lang') || 'zh_CN',
      dataForm: {
        orderInvoiceId: 0,
        orderNumber: null,
        shopId: null,
        invoiceType: null,
        headerType: null,
        headerName: null,
        invoiceTaxNumber: null,
        invoiceState: null,
        fileId: null,
        applicationTime: null,
        uploadTime: null,
        ossList: null,
        attachFile: null
      },
      attachFile: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      upLoadForm: {},
      rules: {
      },
      fileInfo: {}
    }
  },
  methods: {
    init (orderInvoiceId) {
      this.visible = true
      this.$nextTick(() => {
        // this.$refs.dataForm.resetFields()
        this.resetDataFrom()
        if (!orderInvoiceId) {
          return
        }
        this.dataForm.orderInvoiceId = orderInvoiceId || 0
        this.$http({
          url: this.$http.adornUrl(`/m/orderInvoice/info/${orderInvoiceId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          // 请求文件
          if (this.dataForm.fileId) {
            this.$http({
              url: this.$http.adornUrl(`/admin/file/get_file_by_id`),
              method: 'get',
              params: this.$http.adornParams({
                fileId: this.dataForm.fileId
              })
            }).then(({ data }) => {
              this.fileInfo = data
            })
          }
        })
      })
    },
    // 清空数据
    resetDataFrom () {
      this.dataForm = {
        orderInvoiceId: 0,
        orderNumber: null,
        shopId: null,
        invoiceType: null,
        headerType: null,
        headerName: null,
        invoiceTaxNumber: null,
        invoiceState: null,
        fileId: null,
        applicationTime: null,
        uploadTime: null,
        ossList: null,
        attachFile: null
      }
      this.fileInfo = {}
    },
    // 查看是否已经更改过申请信息
    beforeSubmit () {
      this.$http({
        url: this.$http.adornUrl(`/m/orderInvoice/is_change`),
        method: 'get',
        params: this.$http.adornParams({
          orderInvoiceId: this.dataForm.orderInvoiceId,
          applicationTime: this.dataForm.applicationTime
        })
      }).then(({ data }) => {
        if (data === true) {
          this.$confirm(this.$i18n.t('order.uploadInvoiceTip2'), this.$i18n.t('text.tips'), {
            confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
            cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
            type: 'warning'
          }).then(() => {
            this.dataFormSubmit()
          })
        } else {
          this.dataFormSubmit()
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs.dataForm.validate(valid => {
        if (!valid) {
          return
        }
        if (!this.fileInfo.fileId) {
          this.$message({
            message: this.$t('order.uploadInvoiceTip4'),
            type: 'info',
            duration: 1000
          })
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/m/orderInvoice`),
          method: 'put',
          data: this.dataForm
        }).then(({ data }) => {
          this.$message({
            message: this.$t('publics.operation'),
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
              // this.$refs['dataForm'].resetFields()
            }
          })
        })
      })
    },

    onUploadProgress (event, file, fileList) {
    },
    onUploadChange (file, fileList) {
      console.log(file)
      if (file.size > 10 * 1024 * 1024) {
        this.$refs.upload.uploadFiles = []
        return this.$message.error('文件大小不得超过10M！')
      }
    },
    /**
     * 上传图片
     */
    onUploadConfirm () {
      if (this.$refs.upload.uploadFiles.length < 1) {
        return this.$message.error(this.$t('order.uploadInvoiceTip'))
      }
      if (this.dataForm.orderStatus < 4) {
        this.$confirm(this.$t('order.uploadInvoiceTip1'), this.$t('chat.tips'), {
          confirmButtonText: this.$t('chat.confirm'),
          cancelButtonText: this.$t('chat.cancel'),
          type: 'warning'
        }).then(() => {
          this.$refs.upload.submit()
        }).catch(() => {
        })
      } else {
        this.$refs.upload.submit()
      }
    },

    // 预上传
    handleAvatarChange (file, fileList) {
    },
    /**
     * 上传错误处理
     * @param err
     * @param file
     * @param fileList
     */
    onUploadError (err, file, fileList) {
      this.message(this.$t('biz.imgbox.requestError'), true)
      throw err
    },

    /**
     * 上传成功处理，并提交文件数据
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess (response, file, fileList) {
      this.fileInfo = response.data
      this.dataForm.fileId = response.data.fileId
      this.$refs.upload.uploadFiles = []
    },
    onUploadExceedTip () {
    },
    /**
     * 上传前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUpload (file) {
      console.log(file)
      // const typeArray = file.type.split('/')
      const isImage = file.type === 'application/pdf'
      if (!isImage) {
        this.$message.error('请上传PDF文件！')
        return false
      }
      return true
    },
    handleRemove () {
    }
  }
}
</script>
