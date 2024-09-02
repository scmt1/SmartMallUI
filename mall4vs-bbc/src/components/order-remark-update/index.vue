<template>
  <el-dialog
    :title="this.$i18n.t('components.modifyUseAddress')"
    :modal="false"
    top="200px"
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
      <el-form-item :label="this.$i18n.t('components.userComments')" prop="remarks">
        <el-input
          v-model="dataForm.remarks"
          disabled
          :placeholder="this.$i18n.t('components.pleaseEnterRemarks')"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          maxlength="250"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.sellerNote')" prop="shopRemarks">
        <el-input
          v-model="dataForm.shopRemarks"
          :placeholder="this.$i18n.t('components.pleaseEnterRemarks')"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          maxlength="250"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</el-button>
      <el-button type="primary" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      dataForm: {
        orderId: '',
        remarks: '',
        shopRemarks: '',
        orderNumber: ''
      },
      dataRule: {
      },
      isTrue: false,
      errorInfo: '',
      dataListLoading: false
    }
  },
  methods: {
    // 获取数据列表
    init (order) {
      let orderInfo = Object.assign({}, order)
      this.visible = true
      this.dataListLoading = true
      this.dataForm.orderId = orderInfo.orderId
      this.dataForm.orderNumber = orderInfo.orderNumber
      this.dataForm.remarks = orderInfo.remarks
      this.dataForm.shopRemarks = orderInfo.shopRemarks
      this.dataListLoading = false
    },
    // 确定事件
    submitProds () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/order/order/changeOrderRamark`),
            method: 'put',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshUserRemarkOrder')
              }
            })
          })
        }
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
