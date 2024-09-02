<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="dataForm.shopBankCardId ? this.$i18n.t('admin.modifyAcc') : this.$i18n.t('shopProcess.addSettlementAccount')"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="auto" size="small">
      <el-form-item prop="bankName" :label="this.$i18n.t('shopProcess.bankName')">
        <el-input
          v-model="dataForm.bankName"
          :placeholder="$t('shopProcess.brandNameInputTips')"
          maxlength="20"
          @blur="
            dataForm.bankName =
            dataForm.bankName ?
            removeHeadAndTailSpaces(dataForm.bankName) :
            dataForm.bankName
          "
        />
      </el-form-item>
      <el-form-item prop="openingBank" :label="this.$i18n.t('shopProcess.openingBank')">
        <el-input
          v-model="dataForm.openingBank"
          :placeholder="$t('shopProcess.openingBankErrorTips')"
          maxlength="20"
          @blur="
            dataForm.openingBank =
            dataForm.openingBank ?
            removeHeadAndTailSpaces(dataForm.openingBank) :
            dataForm.openingBank
          "
        />
      </el-form-item>
      <el-form-item prop="recipientName" :label="this.$i18n.t('shopProcess.recipientName')">
        <el-input
          v-model="dataForm.recipientName"
          :placeholder="$t('shopProcess.recipientNameInputTips')"
          maxlength="20"
          @blur="
            dataForm.recipientName =
            dataForm.recipientName ?
            removeHeadAndTailSpaces(dataForm.recipientName) :
            dataForm.recipientName
          "
        />
      </el-form-item>
      <el-form-item prop="cardNo" :label="this.$i18n.t('shopProcess.account')">
        <el-input v-model="dataForm.cardNo" maxlength="19" :placeholder="$t('shopProcess.cardNoInputTips')" oninput="value=value.replace(/[^\d]/g,'')" />
      </el-form-item>
      <!--      <el-form-item prop="isDefault" label="主账号">-->
      <!--        <el-radio-group v-model="dataForm.isDefault">-->
      <!--          <el-radio :label="0">否</el-radio>-->
      <!--          <el-radio :label="1">是</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="btn-row">
      <div class="default-btn" @click="dialogVisible = false">{{ $t('shopProcess.cancel') }}</div>
      <div class="default-btn primary-btn" @click="submitForm">{{ $t('shopProcess.confirm') }}</div>
    </div>
  </el-dialog>
</template>

<script>
// import * as api from '@/api/multishop/shop-process'
import { removeHeadAndTailSpaces } from '@/utils/validate'
export default {
  data () {
    const validEmptyTab = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    var validateCardNo = (rule, value, callback) => {
      if (!(/^([0-9]{1})(\d{12,18})$/).test(value)) {
        callback(new Error(this.$i18n.t('shopProcess.accountErrorTips')))
      } else {
        callback()
      }
    }
    return {
      removeHeadAndTailSpaces: removeHeadAndTailSpaces,
      dialogVisible: false,
      dataForm: {
        bankName: '',
        recipientName: '',
        cardNo: '',
        openingBank: '',
        isDefault: 0,
        shopBankCardId: null
      },
      rules: {
        bankName: [
          { required: true, message: this.$i18n.t('shopProcess.brandNameNotEmpty'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.brandNameErrorTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        recipientName: [
          { required: true, message: this.$i18n.t('shopProcess.recipientNameNotEmpty'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.recipientNameInputTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: this.$i18n.t('shopProcess.accountNotEmpty'), trigger: 'blur' },
          { validator: validateCardNo, trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        openingBank: [
          { required: true, message: this.$i18n.t('shopProcess.openingBankNotEmpty'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('shopProcess.openingBankErrorTips'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init (shopBankCardId) {
      console.log('shopBankCardId：', shopBankCardId)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.shopBankCardId = shopBankCardId || null
        if (!shopBankCardId) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/shop/shopBankCard'),
          method: 'get',
          params: this.$http.adornParams({
            shopBankCardId: this.dataForm.shopBankCardId
          })
        }).then(({ data }) => {
          this.dataForm = data
        })
      })
    },

    /**
     * 创建或修改账号
     */
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/shop/shopBankCard'),
          method: this.dataForm.shopBankCardId ? 'put' : 'post',
          data: this.$http.adornData(this.dataForm)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('shopProcess.saveSuccessfully'),
            type: 'success',
            duration: 1000
          })
          this.dialogVisible = false
          this.$emit('refreshDataList')
          this.$refs['dataForm'].resetFields()
        })
      })
    }
  }
}
</script>

