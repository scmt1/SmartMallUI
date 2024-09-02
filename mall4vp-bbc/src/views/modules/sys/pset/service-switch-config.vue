<template>
  <div class="shortmsg-系统服务条例开关配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.serviceSwitchConfig')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm">
      <el-form-item :label="$t('sysManagement.serviceTerms')" style="width:640px" prop="aliPaySwitch">
        <el-switch v-model="dataForm.serviceTermsSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.privacyPolicy')" style="width:640px" prop="wxPaySwitch">
        <el-switch v-model="dataForm.privacyPolicySwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.merchantRegisterProtocolConfig')" style="width:640px" prop="balancePaySwitch">
        <el-switch v-model="dataForm.merchantRegisterProtocolSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.shopProtocolConfig')" style="width:640px" prop="payPalSwitch">
        <el-switch v-model="dataForm.shopProtocolSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
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
        serviceTermsSwitch: true,
        privacyPolicySwitch: true,
        merchantRegisterProtocolSwitch: true,
        shopProtocolSwitch: true
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'SERVICE_SWITCH_CONFIG'),
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
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'SERVICE_SWITCH_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.serviceSwitchConfig')
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
