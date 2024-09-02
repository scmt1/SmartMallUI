<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">{{ $t("user.memberBenefitsPageDisplaySet") }}</div>
    <el-form
      ref="dataForm"
      label-width="100px"
      size="mini"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item :label="$t('user.displayContent')" prop="paramValue">
        <tiny-mce
          v-model="dataForm.paramValue"
          style="width: 900px"
          :key="tinymceFlag"
        ></tiny-mce>
      </el-form-item>
    </el-form>
    <div class="default-btn" @click="dataFormSubmit()">{{
      $t("sysManagement.save")
    }}</div>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'

export default {
  components: {
    TinyMce
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreExplainConfig/info/' + 'LEVEL_SHOW'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data !== null) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/scoreExplainConfig/`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'paramKey': 'LEVEL_SHOW',
              'paramValue': this.dataForm.paramValue,
              'remark': this.$i18n.t('user.levelPageConfiguration')
            })
          }).then(({ data }) => {
            // this.getData()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  },
  data () {
    return {
      addOrUpdateVisible: false,
      tinymceFlag: new Date() + 1,
      dataForm: {
        paramValue: ''
      },
      dataRule: {
        paramValue: [
          { required: true, message: this.$i18n.t('product.content'), trigger: 'brue' }
        ]
      }
    }
  },
  // keep-alive缓存的缘故 需调用钩子函数 设置key值不然编辑器无法使用
  activated () {
    this.tinymceFlag = new Date() + 1
  }
}
</script>
<style lang="scss">
.distribution-withdraw-cash-set {
  .input-tips {
    font-size: 12px;
  }
}
</style>
