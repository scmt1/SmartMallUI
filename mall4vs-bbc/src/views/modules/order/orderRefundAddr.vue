<template>
  <el-dialog :modal="false"
             :title="this.$i18n.t('order.pleaseSelectTheDeliveryAddress')"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="this.$i18n.t('publics.deliveryAddr')">
        <el-select v-model="dataForm.refundAddrId"
                   :placeholder="this.$i18n.t('tip.select')">
          <el-option v-for="item in addrList"
                     :key="item.refundAddrId"
                     :label="item.province+item.city+item.area+item.addr"
                     :value="item.refundAddrId">
          </el-option>
        </el-select>
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
        refundAddrId: null
      },
      addrList: [],
      dataRule: {
        refundAddrId: [
          { required: true, message: this.$i18n.t('order.deliveryAddressCannotBeEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.$http({
        url: this.$http.adornUrl('/shop/refundAddr/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.addrList = data
      })
    },
    // 表单提交
    dataFormSubmit () {

    }
  }
}
</script>
