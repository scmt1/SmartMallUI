<template>
  <el-dialog
    :title="this.$i18n.t('shop.addBankCard')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="onClose"
    :append-to-body="true"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="160px"
      size="small"
    >
      <!-- 银行名称 -->
      <el-form-item
        :label="this.$i18n.t('shopProcess.bankName') + '：'"
        prop="bankName"
      >
        <!-- onkeyup="value=value.replace(/[0-9]+/g,'')" -->
        <el-input
          v-model="dataForm.bankName"
          :placeholder="this.$i18n.t('shopProcess.brandNameInputTips')"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <!-- 银行开户行 -->
      <el-form-item
        :label="this.$i18n.t('shopProcess.openingBank') + '：'"
        prop="openingBank"
      >
        <el-input
          v-model="dataForm.openingBank"
          :placeholder="this.$i18n.t('shop.plnterThntBh')"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <!-- 账户名 -->
      <el-form-item
        :label="this.$i18n.t('shopProcess.recipientName') + '：'"
        prop="recipientName"
      >
        <!-- onkeyup="value=value.replace(/[0-9]+/g,'')" -->
        <el-input
          v-model="dataForm.recipientName"
          :placeholder="this.$i18n.t('shop.pleaEnTheN')"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <!-- 账号 -->
      <el-form-item
        :label="this.$i18n.t('shopProcess.cardNo') + '：'"
        prop="cardNo"
      >
        <el-input
          v-model="dataForm.cardNo"
          :placeholder="this.$i18n.t('shop.pleaseEarNuber')"
          oninput="value=value.replace(/[^\d]/g,'')"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("crud.filter.submitBtn")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    const validEmptyTab = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    // const validateBankName = (rule, value, callback) => {
    //   if (!value.replace(/[0-9]+/g, '').trim()) {
    //     callback(new Error(this.$i18n.t('shop.pleEntTheBankName')))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateCardNo = (rule, value, callback) => {
    //   if (!(/^([0-9]{1})(\d{12,18})$/).test(value)) {
    //     callback(new Error(this.$i18n.t('shopProcess.cardNoErrorTips')))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateRecipientName = (rule, value, callback) => {
    //   if (!value.replace(/[0-9]+/g, '').trim()) {
    //     callback(new Error(this.$i18n.t('shop.pleaEnTheN')))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateOpeningBank = (rule, value, callback) => {
    //   if (value == null || value === '') {
    //     this.$refs.dataForm.clearValidate('openingBank')
    //     callback()
    //   } else if (!value.trim()) {
    //     callback(new Error(this.$i18n.t('shopProcess.branchNameNotEmpty')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      dataForm: {
        openingBank: '',  // 银行开户支行
        cardNo: '',  // 银行卡账号
        bankName: '',
        recipientName: '',  // 账号持有人
        ahPhoneNum: '' // 账号持有人手机号
      },
      dataRule: {
        bankName: [
          { required: true, message: this.$i18n.t('shop.pleEntTheBankName'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.recipientNameInputTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: this.$i18n.t('shop.pleaseEarNuber'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
          // { validator: validateCardNo, trigger: 'blur' }
        ],
        openingBank: [
          { required: true, message: this.$i18n.t('shop.plnterThntBh'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.openingBankErrorTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        recipientName: [
          { required: true, message: this.$i18n.t('shop.pleaEnTheN'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.recipientNameInputTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    onClose () {
      this.visible = false
      this.dataForm.openingBank = ''
      this.dataForm.cardNo = ''
      this.dataForm.bankName = ''
      this.dataForm.recipientName = ''
      this.dataForm.ahPhoneNum = ''
      this.$emit('refreshCardList')
    },
    /**
     * 提交表单
     */
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopBankCard'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.onClose()
              }
            })
          })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
div ::v-deep .el-dialog .el-input {
  width: 80% !important;
}
</style>