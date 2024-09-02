<template>
  <el-dialog
            :title="$t('sysManagement.modify')"
            :close-on-click-modal="false"
            :visible.sync="visible"
            width="550px">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="auto">
      <!-- <el-form-item :label="$t('distribUserWallet.waitTosettled')" prop="unsettledAmount">
        <el-input type="number" v-model="dataForm.unsettledAmount" size="small" oninput="if(value.length>13)value=value.slice(0,13)"></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('distribUserWallet.withdrawalAmount')" prop="settledAmount">
        <el-input type="number" v-model="dataForm.settledAmount" size="small" oninput="if(value.length>13)value=value.slice(0,13)"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('distribUserWallet.invalidAmount')" prop="invalidAmount">
        <el-input type="number" v-model="dataForm.invalidAmount" size="small" oninput="if(value.length>13)value=value.slice(0,13)"></el-input>
      </el-form-item> -->
      <!-- <el-form-item :label="$t('distribution.accumulateIncome')" prop="addupAmount">
        <el-input type="number" v-model="dataForm.addupAmount" size="small" oninput="if(value.length>13)value=value.slice(0,13)"></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import Big from 'big.js'
export default {
  data () {
    var validateNumber = (rule, value, callback) => {
      if (!/^[0-9]\d*$|^[0-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$i18n.t('distribUserWallet.amountTips')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isSubmit: true,
      rawAmount: null,
      dataForm: {
        walletId: null,
        distributionUserId: null,
        // unsettledAmount: null,
        settledAmount: null,
        // invalidAmount: null,
        addupAmount: null,
        version: null
      },
      dataRule: {
        // unsettledAmount: [ { validator: validateNumber, trigger: 'blur' } ],
        settledAmount: [ { validator: validateNumber, trigger: 'blur' } ],
        // invalidAmount: [ { validator: validateNumber, trigger: 'blur' } ],
        addupAmount: [ { validator: validateNumber, trigger: 'blur' } ]
      }
    }
  },
  methods: {
    init (walletData) {
      this.dataForm = Object.assign({}, walletData)
      this.rawAmount = walletData.settledAmount
      this.visible = true
      this.isSubmit = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && this.isSubmit) {
          this.isSubmit = false
          this.dataForm['changeAmount'] = parseFloat(Big(this.dataForm.settledAmount).minus(this.rawAmount))
          this.$http({
            url: this.$http.adornUrl('/distribution/distributionUserWallet'),
            method: 'put',
            data: this.$http.adornData(this.dataForm)
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
        }
      })
    }
  }
}
</script>
