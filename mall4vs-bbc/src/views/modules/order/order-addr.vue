<template>
  <el-dialog :title="this.$i18n.t('temp.modify')"
             :modal="false"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item v-if="dataForm.type !== 2"
                    :label="this.$i18n.t('hotSearch.seq')"
                    prop="seq">
        <el-input-number v-model="dataForm.seq"
                         controls-position="right"
                         :min="0"
                         :label="this.$i18n.t('hotSearch.seq')"></el-input-number>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')"
                    size="mini"
                    prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t("live.offline")}}</el-radio>
          <el-radio :label="1">{{$t("publics.normal")}}</el-radio>
        </el-radio-group>
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
        addrOrderId: 0,
        receiver: '',
        province: '',
        mobile: ''
      }
    }
  },
  methods: {
    init (addrOrderId) {
      this.dataForm.addrOrderId = addrOrderId
      this.$http({
        url: this.$http.adornUrl(`/prod/category/listCategory/${this.dataForm.addrOrderId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/prod/category`),
            method: this.dataForm.currentId ? 'put' : 'post',
            data: this.$http.adornData({
              'categoryId': this.dataForm.currentId || undefined
            })
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
