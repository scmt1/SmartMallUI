<template>
  <div class="shortmsg-系统支付开关配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.paySwitchConfig')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item :label="$t('platform.aliPay')" style="width:640px" prop="aliPaySwitch">
        <el-switch v-model="dataForm.aliPaySwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('platform.weChatPay')" style="width:640px" prop="wxPaySwitch">
        <el-switch v-model="dataForm.wxPaySwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('publics.balancePay')" style="width:640px" prop="balancePaySwitch">
        <el-switch v-model="dataForm.balancePaySwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('publics.payPal')" style="width:640px" prop="payPalSwitch">
        <el-switch v-model="dataForm.payPalSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('publics.cardPay')" style="width:640px" prop="cardPaySwitch">
        <el-switch v-model="dataForm.cardPaySwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        aliPaySwitch: true,
        wxPaySwitch: true,
        balancePaySwitch: true,
        payPalSwitch: true,
        cardPaySwitch: true
      },
      searchForm: {},
      dataRule: {
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'PAY_SWITCH_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.dataForm = JSON.parse(data)
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.aliPaySwitch && !this.dataForm.wxPaySwitch && !this.dataForm.payPalSwitch) {
            this.$message({
              message: this.$i18n.t('publics.payTypeTis'),
              type: 'warning',
              duration: 1500
            })
            return
          }
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'PAY_SWITCH_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.paySwitchConfig')
            })
          }).then(({ data }) => {
            if (data) {
              this.init()
            }
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
