<template>
  <el-dialog
    :title="this.$i18n.t('brand.revise')"
    :modal="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
      size="small"
    >
      <el-form-item v-if="dataForm.type !== 2" :label="this.$i18n.t('hotSearch.seq')" prop="seq">
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          :label="this.$i18n.t('hotSearch.seq')"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('brand.offline')}}</el-radio>
          <el-radio :label="1">{{$t('brand.normal')}}</el-radio>
        </el-radio-group>
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
              message: this.$i18n.t('remindPop.succeeded'),
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
