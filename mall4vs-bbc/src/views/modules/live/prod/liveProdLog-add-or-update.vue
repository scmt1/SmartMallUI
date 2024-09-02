<template>
  <el-dialog
    :title="type"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item :label="this.$i18n.t('admin.proLogId')" prop="liveProdLogId">
        <el-input v-model="dataForm.liveProdLogId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.proLibId')" prop="liveProdStoreId">
        <el-input v-model="dataForm.liveProdStoreId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('admin.updateTime')" prop="updateTime">
        <el-input v-model="dataForm.updateTime"></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('admin.status')"
        prop="status"
      >
        <el-input v-model="dataForm.status"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        liveProdLogId: null,
        liveProdStoreId: null,
        updateTime: null,
        status: null
      },
      type: null,
      dataRule: {
      }
    }
  },
  methods: {
    init (liveProdLogId, type) {
      this.dataForm.liveProdLogId = liveProdLogId || 0
      switch (type) {
        case 1:
          this.type = this.$i18n.t('crud.addTitle')
          break
        case 2:
          this.type = this.$i18n.t('temp.modify')
          break
        case 3:
          this.type = this.$i18n.t('live.view')
          break
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.liveProdLogId) {
          this.$http({
            url: this.$http.adornUrl('/live/liveProdLog/info/' + this.dataForm.liveProdLogId),
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
            url: this.$http.adornUrl('/live/liveProdLog'),
            method: this.dataForm.liveProdLogId ? 'put' : 'post',
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
