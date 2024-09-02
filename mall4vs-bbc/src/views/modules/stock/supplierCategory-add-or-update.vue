<template>
  <el-dialog
    :title="!dataForm.supplierCategoryId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
    :append-to-body="visible"
    :visible.sync="visible"  :width="dialogWidth">
    <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" :label-width="labelWidth" size="small">
      <el-form-item :label="this.$i18n.t('shop.supplierCategoryName')+':'" prop="name">
        <el-input v-model="dataForm.name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.remark')+':'" prop="remark">
        <el-input type="textarea" :rows="3" v-model="dataForm.remark" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
  import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
  import { validNoEmptySpace } from '@/utils/validate'
  export default {
    data () {
      const validEmptyTab = (rule, value, callback) => {
        if (validNoEmptySpace(value)) {
          callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          supplierCategoryId: null,
          name: null,
          remark: null,
          status: 1
        },
        dataRule: {
          name: [
            { required: true, message: this.$i18n.t('shop.supplierCategoryName') + this.$i18n.t('publics.noNull'), trigger: 'blur' },
            { validator: validEmptyTab, trigger: 'blur' }
          ]
        },
        dialogWidth: '',
        defWidth: 815,
        labelWidth: localStorage.getItem('lang') === 'en' ? '130px' : '100px'
      }
    },
    created () {
      this.dialogWidth = setDialogWidth(this.defWidth)
    },
    mounted () {
      widthChange(this, this.defWidth)
    },
    methods: {
      init (supplierCategoryId) {
        this.dataForm.supplierCategoryId = supplierCategoryId || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.supplierCategoryId) {
          this.$http({
            url: this.$http.adornUrl('/supplier/supplierCategory/info/' + this.dataForm.supplierCategoryId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = data
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/supplier/supplierCategory'),
              method: this.dataForm.supplierCategoryId ? 'put' : 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
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
<style scoped>
.input-item {
  width: 240px;
}
.addr-input {
  width: 600px;
}
</style>
