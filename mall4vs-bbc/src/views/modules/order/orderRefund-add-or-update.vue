<template>
  <el-dialog
    :title="!dataForm.refundId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
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
      <el-form-item :label="this.$i18n.t('order.recordId')" prop="refundId">
        <el-input v-model="dataForm.refundId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.shopId')" prop="shopId">
        <el-input v-model="dataForm.shopId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.orderId')" prop="orderId">
        <el-input v-model="dataForm.orderId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.orderSerialNumber')" prop="orderNumber">
        <el-input v-model="dataForm.orderNumber"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.totalOrderAmount')" prop="orderAmount">
        <el-input v-model="dataForm.orderAmount"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.refundAll')" prop="orderItemId">
        <el-input v-model="dataForm.orderItemId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.refundId')" prop="refundSn">
        <el-input v-model="dataForm.refundSn"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.orderPayment')" prop="flowTradeNo">
        <el-input v-model="dataForm.flowTradeNo"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.thirdParty')" prop="outRefundNo">
        <el-input v-model="dataForm.outRefundNo"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.orderPaymentMethod')" prop="payType">
        <el-input v-model="dataForm.payType"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.orderPaymentName')" prop="payTypeName">
        <el-input v-model="dataForm.payTypeName"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.buyerId')" prop="userId">
        <el-input v-model="dataForm.userId"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.returnQuantity')" prop="goodsNum">
        <el-input v-model="dataForm.goodsNum"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.returnAmount')" prop="refundAmount">
        <el-input v-model="dataForm.refundAmount"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.applicationMethod')" prop="applyType">
        <el-input v-model="dataForm.applyType"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.processingStatus')" prop="refundSts">
        <el-input v-model="dataForm.refundSts"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.processingRefundStatus')" prop="returnMoneySts">
        <el-input v-model="dataForm.returnMoneySts"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('live.applyTime')" prop="applyTime">
        <el-input v-model="dataForm.applyTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.sellerProcessingTime')" prop="handelTime">
        <el-input v-model="dataForm.handelTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.refundTime')" prop="refundTime">
        <el-input v-model="dataForm.refundTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.fileCredentialjson')" prop="photoFiles">
        <el-input v-model="dataForm.photoFiles"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.reasonForApplication')" prop="buyerMsg">
        <el-input v-model="dataForm.buyerMsg"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.sellerNote')" prop="sellerMsg">
        <el-input v-model="dataForm.sellerMsg"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.logisticsCompanyName')" prop="expressName">
        <el-input v-model="dataForm.expressName"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.logisticsNumber')" prop="expressNo">
        <el-input v-model="dataForm.expressNo"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.deliveryTime')" prop="shipTime">
        <el-input v-model="dataForm.shipTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.timeOfReceipt')" prop="receiveTime">
        <el-input v-model="dataForm.receiveTime"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('order.commentsAfterReceipt')" prop="receiveMessage">
        <el-input v-model="dataForm.receiveMessage" maxlength="250" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn primary-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      roleList: [],
      dataForm: {
        refundId: null,
        shopId: null,
        orderId: null,
        orderNumber: null,
        orderAmount: null,
        orderItemId: null,
        refundSn: null,
        flowTradeNo: null,
        outRefundNo: null,
        payType: null,
        payTypeName: null,
        userId: null,
        goodsNum: null,
        refundAmount: null,
        applyType: null,
        refundSts: null,
        returnMoneySts: null,
        applyTime: null,
        handelTime: null,
        refundTime: null,
        photoFiles: null,
        buyerMsg: null,
        sellerMsg: null,
        expressName: null,
        expressNo: null,
        shipTime: null,
        receiveTime: null,
        receiveMessage: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (refundId) {
      this.dataForm.refundId = refundId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.refundId) {
          this.$http({
            url: this.$http.adornUrl('/admin/orderRefund/info/' + this.dataForm.refundId),
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
            url: this.$http.adornUrl('/admin/orderRefund'),
            method: this.dataForm.refundId ? 'put' : 'post',
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
