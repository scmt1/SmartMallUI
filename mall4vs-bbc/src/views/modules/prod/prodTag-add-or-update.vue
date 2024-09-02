<template>
  <el-dialog :title="!dataForm.id ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="this.$i18n.t('publics.label')"
                    prop="title">
        <el-input v-model="dataForm.title"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')"
                    prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{$t("publics.normal")}}</el-radio>
          <el-radio :label="0">{{$t("publics.disable")}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.list')"
                    prop="style">
        <el-radio-group v-model="dataForm.style">
          <el-radio :label="0">{{$t("product.oneInARow")}}</el-radio>
          <el-radio :label="1">{{$t("product.twoInARow")}}</el-radio>
          <el-radio :label="2">{{$t("product.threeInARow")}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="this.$i18n.t('publics.seq')"
                    prop="seq">
        <el-input v-model="dataForm.seq"
                  type="number"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn"
                 @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: null,
        title: null,
        shopId: null,
        status: 1,
        isDefault: null,
        prodCount: null,
        seq: null,
        style: 0
      },
      dataRule: {
        title: [
          { required: true, message: this.$i18n.t('product.pleaseEnterALabelName'), trigger: 'blur' }
        ],
        seq: [
          { required: true, message: this.$i18n.t('product.serialNoEnter'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/prod/prodTag/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/prod/prodTag'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
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
