<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :title="this.$i18n.t('product.basicInformation')"
  >
    <el-form :model="dataForm" label-width="140px">
      <el-form-item :label="this.$i18n.t('withdrawal.appliedAmount') + '：'">
        <span>{{dataForm.amount}}</span> {{$t('live.yuan')}}
      </el-form-item>
      <el-form-item :label="this.$i18n.t('withdrawal.toTheBank') + '：'">
        <span>{{dataForm.shopBankCard.bankName}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('withdrawal.merchantNotes') + '：'">
        <div class="remarks-txt">{{dataForm.shopRemarks}}</div>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('withdrawal.reviewStatus') + '：'">
        <el-tag v-if="dataForm.status === -1" type="danger" size="small">
          {{$t('shop.notThrough') }}
        </el-tag>
        <el-tag v-if="dataForm.status === 1" type="success" size="small">{{
            $t('shop.withPass')
          }}</el-tag>
        <el-tag v-else-if="dataForm.status === 0" size="small">{{
            $t('shop.notAudit')
          }}</el-tag>
        <el-tag v-else-if="dataForm.status === 2" size="small" type="success">{{
            $t('shop.succIss')
          }}</el-tag>
        <el-tag
          v-else
          type="error"
          size="small"
        >{{ $t('shop.failIss') }}</el-tag
        >
      </el-form-item>
      <el-form-item v-if="dataForm.status !== 0 && dataForm.payingAccount!==null" :label="this.$i18n.t('withdrawal.payingAccount') + '：'">
        <span>{{dataForm.payingAccount}}</span>
      </el-form-item>
      <el-form-item v-if="dataForm.status !== 0 && dataForm.payingCardNo!==null" :label="this.$i18n.t('withdrawal.payingCardNo') + '：'">
        <span>{{dataForm.payingCardNo}}</span>
      </el-form-item>
      <el-form-item v-if="dataForm.status !== 0 && dataForm.payingTime!==null" :label="this.$i18n.t('withdrawal.payingTime') + '：'">
        <span>{{dataForm.payingTime}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('withdrawal.platformNote') + '：'">
        <span style="word-break: break-word;">{{dataForm.remarks}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        status: 0,
        payingAccount: '', // 付款户名
        payingCardNo: '', // 付款账号
        payingTime: '' // 付款日期
      }
    }
  },
  methods: {
    init (rowData) {
      this.dataForm = Object.assign({}, rowData)
      if (this.dataForm.payingTime) {
        this.dataForm.payingTime = this.dataForm.payingTime.substr(0, 10)
      }
      console.log(rowData)
      this.visible = true
    }
  }
}
</script>
<style scoped>
.remarks-txt {
  word-break: break-word;
}
</style>