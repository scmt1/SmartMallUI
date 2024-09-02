<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :title="this.$i18n.t('shopWithdrawCash.withdrawalApplication')"
    width="720px"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="auto" size="small">
      <el-form-item :label="this.$i18n.t('shopWithdrawCash.shopName') + '：'" prop="shopName">
        <span class="shop-name">{{dataForm.shopName}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shopWithdrawCash.accountName') + '：'" prop="accountName">
        <span class="account-name">{{$t('shop.storeBalance')}}</span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shopWithdrawCash.withdrawalAmount') + '：'"
        prop="rechargeAmount"
      >
        <span class="recharge-amount">
          <span class="bold">{{dataForm.amount}}</span>
          {{$t('coupon.yuan')}}
        </span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shopWithdrawCash.payeeInfo') + '：'"
        prop="payeeInformation"
      >
        <div class="payee-Info">
          <p class="tips">
            {{$t('shopWithdrawCash.sendMoney')}}
            <span class="bold">{{dataForm.amount}}</span>
            {{$t('coupon.yuan') + $t('shopWithdrawCash.toAccount') + $t('shopWithdrawCash.tips')}}
          </p>
          <div class="payee-con">
            <div class="payee-con-item">
              <p class="tit">{{$t('shopWithdrawCash.PayeeAccountName')}}：</p>
              <p class="txt">{{shopBankCard.recipientName}}</p>
            </div>
            <div class="payee-con-item">
              <p class="tit">{{$t('shopWithdrawCash.bankName')}}：</p>
              <p class="txt">{{shopBankCard.bankName}}</p>
            </div>
            <div class="payee-con-item">
              <p class="tit">{{$t('shopWithdrawCash.beneficiaryBank')}}：</p>
              <p class="txt">{{shopBankCard.openingBank}}</p>
            </div>
            <div class="payee-con-item">
              <p class="tit">{{$t('shopWithdrawCash.beneficiaryAccount')}}：</p>
              <p class="txt">
                <span ref="copyVal">{{shopBankCard.cardNo}}</span>&nbsp;&nbsp;
                <textarea class="copy-content" ref="input" maxlength="100"></textarea>
                <span
                  class="copy-txt"
                  data-clipboard-text
                  @click="copyAccountNum"
                >{{$t('shopWithdrawCash.copy')}}</span>
              </p>
            </div>
            <div class="payee-con-item">
              <p class="tit">{{$t('publics.remark')}}：</p>
              <p class="txt">{{dataForm.shopRemarks}}</p>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('distributionMsg.auditStatus') + '：'"
        prop="status"
      >
        <el-radio-group
          v-if="dataForm.status <2"
          v-model="dataForm.status"
          :disabled="oldStatus !== 0"
        >
          <el-radio :label="0" :disabled="true">{{$t('liveRoom.underReview')}}</el-radio>
          <el-radio :label="1">{{$t('shopWithdrawCash.succeeded')}}</el-radio>
          <el-radio :label="-1">{{$t('shopWithdrawCash.failed')}}</el-radio>
        </el-radio-group>
        <div v-if="dataForm.status >1">
          <el-tag v-if="dataForm.status == 2" type="success">{{$t('shop.succIss')}}</el-tag>
          <el-tag v-if="dataForm.status == 3" type="danger">{{$t('shop.failIss')}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('shopWithdrawCash.rayerInfo') + '：'"
        prop="payerInformation"
        v-if="dataForm.status > 0"
      >
        <div class="payer-info">
          <el-form-item
            :label="this.$i18n.t('shopWithdrawCash.paymentAccountName') + '：'"
            prop="payingAccount"
            class="payer-item"
          >
            <el-input
              type="text"
              v-model="dataForm.payingAccount"
              maxlength="20"
              :placeholder="this.$i18n.t('shopWithdrawCash.enterPaymentAccountName')"
              :disabled="oldStatus !== 0"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="this.$i18n.t('shopWithdrawCash.paymentAccountNum') + '：'"
            prop="payingCardNo"
            class="payer-item"
          >
            <el-input
              type="text"
              v-model="dataForm.payingCardNo"
              maxlength="28"
              :placeholder="this.$i18n.t('shopWithdrawCash.enterPaymentAccountNum')"
              :disabled="oldStatus !== 0"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="this.$i18n.t('shopWithdrawCash.paymentDate') + '：'"
            prop="payingTime"
          >
            <el-date-picker
              v-model="dataForm.payingTime"
              type="date"
              :placeholder="this.$i18n.t('dataAnalysis.selectDate')"
              value-format="yyyy-MM-dd"
              :disabled="oldStatus !== 0"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.remark') + '：'" prop="remarks" class="remarks-textarea">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4}"
          v-model="dataForm.remarks"
          maxlength="100" show-word-limit
          :placeholder="this.$i18n.t('components.pleaseEnterRemarks')"
          :disabled="oldStatus !== 0"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div
        class="default-btn primary-btn"
        v-if="oldStatus === 0"
        @click="dataFormSubmit()"
      >{{$t('groups.submit')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import {validNoEmptySpace} from '@/utils/validate'
export default {
  data () {
    const validatePayingAccount = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopWithdrawCash.enterPayerAccountName')))
      } else {
        callback()
      }
    }
    const vaildPayingCardNo = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopWithdrawCash.enterPayerAccount')))
      } else {
        callback()
      }
    }
    const vaildRemarks = (rule, value, callback) => {
      if (value === null || value === '') {
        this.$refs.dataForm.clearValidate('remarks')
        callback()
      } else if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    // const validateNotEmptyRep = (role, value, callback) => {
    //   this.companyInfoForm.representative = this.companyInfoForm.representative.trim()
    //   if (this.companyInfoForm.representative === '' || this.companyInfoForm.representative.indexOf(' ') !== -1) {
    //     callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      dataForm: {
        status: 1,
        payingAccount: '', // 付款户名
        payingCardNo: '',  // 付款账号
        payingTime: '' // 付款日期
      },
      shopBankCard: {
        bankName: '',
        cardNo: '',
        openingBank: '',
        recipientName: ''
      },
      oldStatus: 0,
      dataRule: {
        payingAccount: [
          { required: true, message: this.$i18n.t('shopWithdrawCash.enterPayerAccountName'), trigger: 'blur' },
          { validator: validatePayingAccount, trigger: 'blur' }
        ],
        payingCardNo: [
          { required: true, message: this.$i18n.t('shopWithdrawCash.enterPayerAccount'), trigger: 'blur' },
          { validator: vaildPayingCardNo, trigger: 'blur' }
        ],
        payingTime: [
          { required: true, message: this.$i18n.t('shopWithdrawCash.selectPaymentDate'), trigger: 'blur' }
        ],
        remarks: [{validator: vaildRemarks, trigger: 'blur'}]
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  methods: {
    init (rowData) {
      let dataForm = Object.assign({}, rowData)
      this.shopBankCard = Object.assign({}, rowData.shopBankCard)
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm = dataForm
        this.dataForm.shopBankCard = null
        this.oldStatus = dataForm.status
        this.dataForm.status = this.dataForm.status || 1
      })
    },
    /**
     * 复制
     */
    copyAccountNum () {
      this.$refs.input.value = this.$refs.copyVal.innerText  // 替换文本框内容
      this.$refs.input.select() // 选中文本
      document.execCommand('copy') // 执行浏览器复制命令
      this.$message({
        message: this.$t('shopWithdrawCash.copySucceeded'),
        type: 'success',
        duration: 1000
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.status === 0) {
        this.$message({
          message: this.$t('user.pleaseSelect') + this.$t('shopProcess.auditStatus'),
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopWithdrawCash/audit'),
            method: 'put',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$t('shopWithdrawCash.succeeded'),
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

<style scoped>
.el-form-item {
  margin-bottom: 8px !important;
}
.bold {
  font-weight: bold;
  font-size: 16px;
  padding: 0 2px;
}
/* 收款方信息 */
.payee-Info {
  border: 1px solid #eee;
  border-radius: 3px;
  padding: 15px;
  margin-bottom: 15px;
  width: 98%;
}
.payee-con-item {
  padding: 10px;
  line-height: 1em;
  word-break: break-word;
  display: flex;
}
.tips {
  line-height: 1.5em;
  padding-bottom: 10px;
}
.tit {
  display: inline-block;
  min-width: 100px;
  width: auto;
  text-align: left;
  margin-right: 10px;
}
.txt {
  display: inline-block;
  text-align: left;
  position: relative;
}
.copy-txt {
  color: #1c60d4;
  cursor: pointer;
}
.copy-content {
  width: 1em;
  height: 1em;
  border: 0;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: -11;
}
/* 付款人信息 */
.payer-info {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 3px;
  width: 98%;
  margin-bottom: 10px;
}
.el-input {
  width: 90%;
}
.payer-item {
  margin-bottom: 20px !important;
}
.remarks-textarea >>> .el-textarea__inner {
  min-height: 60px !important;
  padding-right: 60px;
}
</style>
