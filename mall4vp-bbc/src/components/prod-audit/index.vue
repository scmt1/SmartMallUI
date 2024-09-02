<template>
  <el-dialog
    :title="$t('sysManagement.prodAudit')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="35%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '130px' : '80px'"
    >
      <el-form-item
        :label="$t('components.processingStatus')"
        prop="status">
        <!-- 1平台进行下线[此处不通过就是下线] 3.审核通过-->
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="3">{{$t('productComm.pass')}}</el-radio>
          <el-radio :label="1">{{$t('productComm.noPass')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status === 1"
        :label="$t('components.denialReason')"
        prop="refuseReason"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          maxlength="200"
          size="small"
          v-model="offlineReason"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div :class="['default-btn primary-btn']" @click="dataFormSubmit()">{{$t('group.confirmReview')}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        handleType: 1,
        handleId: null,
        status: 3
      },
      offlineReason: '',
      prodId: 0,
      dataRule: {
      }
    }
  },
  props: {
    updateUrl: {
      default: '',
      type: String
    }
  },
  methods: {
    init (id) {
      this.prodId = id
      this.visible = true
      this.dataForm.status = 3
      this.dataForm.offlineReason = null
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.status === 1) {
        let reg = /^\s+$/g
        if (reg.test(this.offlineReason)) {
          this.$message.warning(this.$i18n.t('shopProcess.inputAllSpace'))
          return
        }
      }
      this.$confirm(this.$i18n.t('components.tipOfflineAuditTip2'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel')
      }).then(() => {
        this.visible = false
        this.$http({
          url: this.$http.adornUrl(this.updateUrl),
          method: 'post',
          data: this.$http.adornData({
            eventId: this.dataForm.eventId,
            handleId: this.prodId,
            status: this.dataForm.status,
            offlineReason: this.offlineReason || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        })
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
.content-color {
  color: #155bd4;
  word-break: break-word;
}
</style>
