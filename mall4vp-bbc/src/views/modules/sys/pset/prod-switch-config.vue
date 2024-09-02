<template>
  <div class="shortmsg-商品配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.prodConfig')}}</div>
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
      <el-form-item :label="$t('sysManagement.prodAudit')" style="width:640px" prop="prodAudit">
        <el-switch v-model="dataForm.prodAudit" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        <el-tooltip class="item" effect="dark" :content="$t('sysManagement.prodAuditTip')" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
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
        prodAudit: false
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'PROD_SWITCH_CONFIG'),
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
              'paramKey': 'PROD_SWITCH_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.prodConfig')
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
