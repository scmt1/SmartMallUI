<template>
  <el-dialog
    :title="!dataForm.dvyId ? $t('brand.add') : $t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="610px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto"
    >
      <el-form-item :label="$t('platform.logisticsCompany')" prop="dvyName">
        <el-input
          size="small"
          v-model="dataForm.dvyName"
          maxlength="50"
          show-word-limit
          @blur="dataForm.dvyName = handleInputSpaces(dataForm.dvyName)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.companyHomepage')" prop="companyHomeUrl">
        <el-input
          size="small"
          v-model="dataForm.companyHomeUrl"
          maxlength="255"
          @blur="dataForm.companyHomeUrl = handleInputSpaces(dataForm.companyHomeUrl)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.companyNumber') + '(' + $t('sysManagement.expressBird') + ')'" prop="dvyNo">
        <el-input
          size="small"
          v-model="dataForm.dvyNo"
          maxlength="20"
          @blur="dataForm.dvyNo = handleInputSpaces(dataForm.dvyNo)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.companyNumber') + '(' + $t('sysManagement.quick100') + ')'" prop="dvyNoHd">
        <el-input
          size="small"
          v-model="dataForm.dvyNoHd"
          maxlength="20"
          @blur="dataForm.dvyNoHd = handleInputSpaces(dataForm.dvyNoHd)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.companyNumber') + '(' + $t('sysManagement.ali') + ')'" prop="aliNo">
        <el-input
          size="small"
          v-model="dataForm.aliNo"
          maxlength="20"
          @blur="dataForm.aliNo = handleInputSpaces(dataForm.aliNo)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.logisticsQueryInterface')" prop="queryUrl">
        <el-input
          size="small"
          v-model="dataForm.queryUrl"
          maxlength="100"
          @blur="dataForm.queryUrl = handleInputSpaces(dataForm.queryUrl)"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        dvyId: null,
        dvyName: null,
        companyHomeUrl: null,
        recTime: null,
        modifyTime: null,
        dvyNo: null,
        dvyNoHd: null,
        aliNo: null,
        queryUrl: null
      },
      isSubmit: false,
      dataRule: {
        dvyName: [
          { required: true, message: this.$i18n.t('platform.errorTip4'), trigger: 'blur' }
        ],
        dvyNo: [
          { required: true, message: this.$i18n.t('platform.errorTip6'), trigger: 'blur' }
        ],
        dvyNoHd: [
          { required: true, message: this.$i18n.t('platform.errorTip6'), trigger: 'blur' }
        ],
        aliNo: [
          { required: true, message: this.$i18n.t('platform.errorTip6'), trigger: 'blur' }
        ]
        // queryUrl: [
        //   { required: true, message: this.$i18n.t('platform.errorTip5'), trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    init (dvyId) {
      this.dataForm.dvyId = dvyId || 0
      this.dataForm.queryUrl = ''
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.dvyId) {
          this.$http({
            url: this.$http.adornUrl('/platform/delivery/info/' + this.dataForm.dvyId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },

    /**
     * 输入框纯空格处理
     */
    handleInputSpaces (value) {
      if (!value) { return }
      if (!value.trim()) {
        return value.trim()
      } else {
        return value
      }
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/platform/delivery'),
            method: this.dataForm.dvyId ? 'put' : 'post',
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
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
