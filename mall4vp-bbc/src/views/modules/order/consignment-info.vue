<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    :modal="false"
    :title="this.$i18n.t('consignmentInfo.enterShipmentInf')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="38%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      size="small"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item :label="this.$i18n.t('consignmentInfo.senderName')" prop="consignmentName">
        <el-input
          v-model="dataForm.consignmentName"
          controls-position="right"
          :label="this.$i18n.t('consignmentInfo.senderName')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('consignmentInfo.shiPhoNum')" prop="consignmentMobile">
        <el-input
          v-model="dataForm.consignmentMobile"
          controls-position="right"
          :label="this.$i18n.t('consignmentInfo.shiPhoNum')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('consignmentInfo.deliveryAddress')" prop="consignmentAddr">
        <el-input
          v-model="dataForm.consignmentAddr"
          controls-position="right"
          :label="this.$i18n.t('consignmentInfo.deliveryAddress')"
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
        consignmentName: '',
        consignmentMobile: '',
        consignmentAddr: ''
      },
      dataRule: {
        consignmentName: [
          { required: true, message: this.$i18n.t('order.cannotEmpty'), trigger: 'blur' }
        ],
        consignmentMobile: [
          { required: true, message: this.$i18n.t('order.cannotEmpty'), trigger: 'blur' }
        ],
        consignmentAddr: [
          { required: true, message: this.$i18n.t('order.cannotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (orderNumber, dvyId, dvyFlowId) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.visible = false
          this.$emit('inputCallback', this.dataForm)
        }
      })
    }
  }
}
</script>
