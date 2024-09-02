<template>
  <el-dialog
    :title="isBatchRecharge ? $t('user.balanceRecharge') : $t('user.balanceUpdate')"
    v-if="visible"
    :visible.sync="visible"
    width="30%"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="isBatchRecharge ? batchDataRule : dataRule"
      :label-width="this.$i18n.t('language') === 'language' ? '210px' : '120px'"
    >
      <el-form-item :label="$t('user.changeQuantity')" prop="balanceValue">
        <el-input v-model="dataForm.balanceValue" :controls = "false" @change="inputNumber"></el-input>
        <br/>
        <!-- 批量更改余额 - 批量给用户充值余额，只能批量给用户增加余额，请输入大于零的数 -->
        <span v-if="isBatchRecharge === 1">{{ $t("user.balanceTip4") }}
          <el-tooltip class="item" effect="dark" :content="$t('user.balanceTip8')" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
        <!-- 修改指定会员余额 - 正数代表增加，负数代表减少，只能输入数字，最多两位小数 -->
        <span v-if="isBatchRecharge !== 1">{{ $t("user.balanceTip1") }}</span>
        <!-- 修改指定会员余额 - 用户当前余额为X -->
        <div v-if="isBatchRecharge !== 1">
          {{ $t("user.balanceTip6") + dataForm.balance }}
          <el-tooltip class="item" effect="dark" :content="$t('user.balanceTip7')" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>

      <el-form-item>
        <div @click="visible = false" class="default-btn">{{ $t("remindPop.cancel") }}</div>
        <div class="default-btn primary-btn" @click="confirm">{{ $t("remindPop.confirm") }}</div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script>
import { Debounce } from '@/utils/debounce'
import Big from 'big.js'
export default {

  data () {
    var validate = (rule, value, callback) => {
      var flag = this.dataForm.balanceValue === 0 || this.dataForm.balanceValue === '0.0' || this.dataForm.balanceValue === '0.00'
      if (!/^(-)?[1-9]\d*$|^(-)?[1-9]\d*\.\d\d?$|^(-)?0\.\d\d?$/.test(value) || flag) {
        callback(new Error(this.$i18n.t('user.balanceTip3')))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      var flag = this.dataForm.balanceValue === 0 || this.dataForm.balanceValue === '0.0' || this.dataForm.balanceValue === '0.00'
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value) || flag) {
        callback(new Error(this.$i18n.t('user.balanceTip5')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      confirmLoad: false,
      // 如果是批量充值，就展示批量充值部分内容 1是 0否
      isBatchRecharge: 0,
      dataForm: {
        balanceValue: null,
        userIds: [],
        remark: null
      },
      dataRule: {
        balanceValue: [
          { required: true, message: this.$i18n.t('user.balanceTip2'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      },
      batchDataRule: {
        balanceValue: [
          { required: true, message: this.$i18n.t('user.balanceTip5'), trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (ids, type, balance) {
      this.visible = true
      this.dataForm.userIds = ids
      this.dataForm.balanceValue = null
      if (!balance || balance < 0) {
        balance = 0
      }
      this.dataForm.balance = balance
      this.isBatchRecharge = type === 1 ? 1 : 0
    },
    inputNumber () {
      let maxBalance = new Big(999999999.99).minus(this.dataForm.balance)
      let balanceValue = parseFloat(this.dataForm.balanceValue)
      if (balanceValue > maxBalance) {
        this.dataForm.balanceValue = maxBalance
      } else if (balanceValue <= -this.dataForm.balance) {
        this.dataForm.balanceValue = -this.dataForm.balance
      }
    },
    confirm: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataForm.userIds) {
          return
        }
        this.confirmLoad = true
        let param = this.dataForm
        console.log(param)
        this.$http({
          url: this.$http.adornUrl(`/user/userBalance/updateUserBalance`),
          method: 'put',
          data: this.$http.adornData(param)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.confirmLoad = false
              this.$emit('refreshDataList', this.page)
              this.dataForm.balanceValue = null
            }
          })
        }).catch((e) => {
          this.confirmLoad = false
        })
      })
    }, 1000)
  }
}
</script>
