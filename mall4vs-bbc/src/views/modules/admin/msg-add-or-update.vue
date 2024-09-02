<template>
  <el-dialog
    :title="!dataForm.templateId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="dialogWidth"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="labelWidth"
    >
      <el-form-item :label="this.$i18n.t('admin.msgType')+'：'" prop="sendType">
        <el-select
          v-model="dataForm.sendType"
          :placeholder="this.$i18n.t('tip.select')"
          :disabled="true"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.notifyConten')+'：'" prop="message">
        <span style=" font-size: 15px;">{{dataForm.message}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.notifyType')+'：'" prop="message">
        <el-checkbox-group v-model="shopTemplateTypeList">
          <el-checkbox v-if="dataForm.sms && dataForm.sendType !== 2" :label="1">{{$t("admin.msgNotify")}}</el-checkbox>
          <el-checkbox v-if="dataForm.sms && dataForm.sendType === 2" :label="1">{{$t("admin.msgFreeNotify")}}</el-checkbox>
          <el-checkbox v-if="dataForm.sub" :label="2">{{$t("admin.publicNotify")}}</el-checkbox>
          <el-checkbox v-if="dataForm.app" :label="3">{{$t("admin.appletMessage")}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('crud.filter.cancelBtn')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        templateId: null,
        sendType: null,
        shopTemplateTypeList: [],
        message: null,
        templateCode: null,
        createTime: null
      },
      shopTemplateTypeList: [],
      dataRule: {
        sendType: [
          { required: true, message: this.$i18n.t('admin.seleMsgType'), trigger: 'blur' }
        ],
        message: [
          { required: true, message: this.$i18n.t('admin.notifyContenNoNull'), trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: this.$i18n.t('admin.notifyTempNoNull'), trigger: 'blur' }
        ]
      },
      options: [{
        value: 1,
        label: this.$i18n.t('admin.orderPay')
      }, {
        value: 2,
        label: this.$i18n.t('admin.paySuccNotify')
      }, {
        value: 3,
        label: this.$i18n.t('admin.merAgreeReturn')
      }, {
        value: 4,
        label: this.$i18n.t('admin.merRefuseRefund')
      }, {
        value: 5,
        label: this.$i18n.t('admin.wriOffRem')
      }, {
        value: 6,
        label: this.$i18n.t('admin.shipRem')
      }, {
        value: 7,
        label: this.$i18n.t('admin.groupFailRem')
      }, {
        value: 8,
        label: this.$i18n.t('admin.groupSuccRem')
      }, {
        value: 9,
        label: this.$i18n.t('admin.startGroupRem')
      }, {
        value: 10,
        label: this.$i18n.t('admin.memUpRem')
      }, {
        value: 11,
        label: this.$i18n.t('admin.timeoutRem')
      }, {
        value: 102,
        label: this.$i18n.t('admin.confirmReceRem')
      }, {
        value: 103,
        label: this.$i18n.t('admin.buyerRefundRem')
      }, {
        value: 104,
        label: this.$i18n.t('admin.buyerReturnRem')
      }],
      dialogWidth: '',
      defWidth: localStorage.getItem('lang') === 'en' ? 700 : 700,
      labelWidth: localStorage.getItem('lang') === 'en' ? '160px' : '130px'
    }
  },
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    init (templateId) {
      this.shopTemplateTypeList = []
      this.dataForm.templateId = templateId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.templateId) {
          this.$http({
            url: this.$http.adornUrl('/multishop/notifyTemplate/info/' + this.dataForm.templateId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            if (this.dataForm.shopTemplateTypeList) {
              this.shopTemplateTypeList = this.dataForm.shopTemplateTypeList
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.dataForm.shopTemplateTypeList = this.shopTemplateTypeList
      for (var i = 1; i < 4; i++) {
        if (this.shopTemplateTypeList.indexOf(i) !== -1) {
          switch (i) {
            case 1:
              this.dataForm.shopSms = true
              break
            case 2:
              this.dataForm.shopSub = true
              break
            case 3:
              this.dataForm.shopApp = true
              break
          }
        } else {
          switch (i) {
            case 1:
              this.dataForm.shopSms = false
              break
            case 2:
              this.dataForm.shopSub = false
              break
            case 3:
              this.dataForm.shopApp = false
              break
          }
        }
      }
      if (this.dataForm.shopTemplateTypeList.length === 0) {
        this.$message({
          message: this.$i18n.t('publics.selectOne'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/multishop/notifyTemplateShop'),
            method: this.dataForm.templateId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
