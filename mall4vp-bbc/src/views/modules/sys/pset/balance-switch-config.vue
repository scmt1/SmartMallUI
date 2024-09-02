<template>
  <div class="shortmsg-余额充值配置-set gray-box top-redius border-bottom-gray">
    <div class="title">余额充值配置</div>
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
      <el-form-item label="余额充值" style="width:640px" prop="balanceAudit">
        <el-switch v-model="dataForm.balanceAudit" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
        balanceAudit: false
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
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'BALANCE_SWITCH_CONFIG'),
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
              'paramKey': 'BALANCE_SWITCH_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': "余额充值配置"
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
