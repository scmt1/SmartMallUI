<template>
  <el-dialog
    :title="
      !dataForm.smsPackageId ? $t('brand.add') : $t('sysManagement.modify')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '160px' : '120px'"
      size="small"
    >
      <el-form-item :label="$t('platform.smsPackageName')" prop="packageName">
        <el-input v-model="dataForm.packageName" @change="packageNameChange" maxlength="250" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('brandPopups.description')" prop="smsDesc">
        <el-input v-model="dataForm.smsDesc" maxlength="250" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.packagePrice')" prop="amount">
        <el-input-number
          v-model="dataForm.amount"
          :precision="2"
          :min="0.01"
          :max="100000000"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('platform.smsNum')" prop="smsNum">
        <el-input-number
          v-model="dataForm.smsNum"
          :precision="0"
          :min="1"
          :max="100000000"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('platform.feature1')" prop="propertyOne">
        <el-input v-model="dataForm.propertyOne" @change="propertyOneChange" maxlength="250" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.feature2')" prop="propertyTwo">
        <el-input v-model="dataForm.propertyTwo" @change="propertyTwoChange" maxlength="250" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import { Debounce } from '@/utils/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        smsPackageId: null,
        packageName: null,
        smsDesc: null,
        amount: 0.01,
        smsNum: 1,
        isDelete: null,
        createTime: null,
        propertyOne: null,
        propertyTwo: null
      },
      dataRule: {
        amount: [
          { required: true, message: this.$i18n.t('platform.errorTip7'), trigger: 'blur' }
        ],
        smsNum: [
          { required: true, message: this.$i18n.t('platform.errorTip8'), trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: this.$i18n.t('platform.errorTip9'), trigger: 'blur' }
        ],
        propertyOne: [
          { required: true, message: this.$i18n.t('platform.errorTip10'), trigger: 'blur' }
        ],
        propertyTwo: [
          { required: true, message: this.$i18n.t('platform.errorTip11'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (smsPackageId) {
      this.dataForm.smsPackageId = smsPackageId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.smsPackageId) {
          this.$http({
            url: this.$http.adornUrl('/platform/smsPackage/info/' + this.dataForm.smsPackageId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    packageNameChange () {
      this.dataForm.packageName = this.dataForm.packageName.trim()
    },
    propertyOneChange () {
      this.dataForm.propertyOne = this.dataForm.propertyOne.trim()
    },
    propertyTwoChange () {
      this.dataForm.propertyTwo = this.dataForm.propertyTwo.trim()
    },
    // 表单提交: 有防抖函数
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/platform/smsPackage'),
            method: this.dataForm.smsPackageId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.visible = false
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }, 1000)
  }
}
</script>

<style lang="scss">
.is-error .el-input-number__decrease,
.is-error .el-input-number__increase,
.is-success .el-input-number__decrease,
.is-success .el-input-number__increase {
  right: 0 !important;
}

.el-input-number__decrease,
.el-input-number__increase {
  border-left: 1px solid #edf3ff !important;
}
// .el-form-item__content {
//   min-width: 1400px;
// }
</style>
