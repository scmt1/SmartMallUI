<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog :modal="false"
             :title="this.$i18n.t('order.pleEntShipInfo')"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="38%">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
              label-width="120px">
      <el-form-item  :label="this.$i18n.t('order.senderName')"
                    prop="consignmentName">
        <el-input v-model="dataForm.consignmentName"
                  controls-position="right"
                   :label="this.$i18n.t('order.senderName')"></el-input>
      </el-form-item>
      <el-form-item  :label="this.$i18n.t('order.shiPhoNum')"
                    prop="consignmentMobile">
        <el-input v-model="dataForm.consignmentMobile"
                  controls-position="right"
                   :label="this.$i18n.t('order.shiPhoNum')"></el-input>
      </el-form-item>
      <el-form-item  :label="this.$i18n.t('order.deliveryAddress')"
                    prop="consignmentAddr">
        <el-input v-model="dataForm.consignmentAddr"
                  controls-position="right"
                   :label="this.$i18n.t('order.deliveryAddress')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <div class="default-btn"
                 @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
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
        consignmentName: '',
        consignmentMobile: '',
        consignmentAddr: ''
      },
      dataRule: {
        consignmentName: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
        ],
        consignmentMobile: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
        ],
        consignmentAddr: [
          { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
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
