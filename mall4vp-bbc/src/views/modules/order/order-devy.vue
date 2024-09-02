<template>
  <el-dialog
    :modal="false"
    :title="this.$i18n.t('order.selShippingAddr')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
      size="small"
    >
      <el-form-item :label="this.$i18n.t('order.courierCompany')">
        <el-select v-model="dataForm.dvyId" :placeholder="this.$i18n.t('tip.select')">
          <el-option
            v-for="item in dataForm.dvyNames"
            :key="item.dvyId"
            :label="item.dvyName"
            :value="item.dvyId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.trackingNumber')" prop="dvyFlowId">
        <el-input
          v-model="dataForm.dvyFlowId"
          controls-position="right"
          :min="0"
          maxlength="90"
          show-word-limit
          :label="this.$i18n.t('order.trackingNumber')"
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
        dvyId: '',
        dvyFlowId: 0,
        dvyNames: [],
        orderNumber: 0
      },
      dataRule: {
        dvyFlowId: [
          { required: true, message: this.$i18n.t('order.cannotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (orderNumber, dvyId, dvyFlowId) {
      this.visible = true
      this.dataForm.orderNumber = orderNumber || ''
      this.dataForm.dvyId = dvyId || ''
      this.dataForm.dvyFlowId = dvyFlowId || ''
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm.dvyNames = data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/order/order/delivery`),
            method: 'put',
            data: this.$http.adornData({
              'orderNumber': this.dataForm.orderNumber
            })
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
          })
        }
      })
    }
  }
}
</script>
