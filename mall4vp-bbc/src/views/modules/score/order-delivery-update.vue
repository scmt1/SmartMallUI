<template>
  <el-dialog
    :title="this.$i18n.t('order.orderShipping')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
  >
    <div class="mod-order-orderInfo">
      <!-- <el-alert title="*请仔细填写物流公司及快递单号，发货后72小时内仅支持做一次更正，逾期不可修改" type="warning" show-icon></el-alert> -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        @selection-change="handleSelectionChange"
      >
        <!-- <span>{{scope.row.status === 0?status=true:status=false}}<span> -->
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column :label="this.$i18n.t('product.prodName')">
          <template slot-scope="scope">
            {{ scope.row.prodName }}
            <div
              class="order-status"
              v-if="
                scope.row.returnMoneySts !== null &&
                scope.row.returnMoneySts > 0 &&
                scope.row.returnMoneySts < 6
              "
            >
              {{ $t("order.reimburse") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="prodCount"
          :label="this.$i18n.t('order.canShipQuantity')"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          :label="this.$i18n.t('product.status')"
          show-overflow-tooltip
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <template slot-scope="scope">{{ scope.row.status }}</template> -->
            <div
              class="default-btn text-btn"
              v-if="
                scope.row.returnMoneySts !== null &&
                scope.row.returnMoneySts < 6 &&
                scope.row.returnMoneySts > 0
              "
              >{{
                [
                  "",
                  $t("order.buyerApplication"),
                  $t("order.sellerAccepts"),
                  $t("order.selShipment"),
                  $t("order.sellerReceipt"),
                  $t("order.refundsuccessfully"),
                ][scope.row.returnMoneySts]
              }}</div
            >
            <div
              v-else-if="scope.row.status !== 0 && scope.row.status !== -1"
              >{{ $t("order.partialDelivery") }}</div
            >
            <div v-else-if="scope.row.status === 0">{{
              $t("order.shipmentCompleted")
            }}</div>
            <div
              v-else-if="scope.row.status === -1"
              >{{ $t("order.toBeShipped") }}</div
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="changeNum"
          :label="this.$i18n.t('order.numberOfShipments')"
          fit
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <el-input-number
              :disabled="scope.row.prodCount <= 0"
              size="small"
              v-model="scope.row.changeNum"
              :precision="0"
              :min="0"
              :max="scope.row.prodCount"
            ></el-input-number
            >​
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- :rules="dataRule" -->
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
      size="small"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width">
            <el-form-item :label="this.$i18n.t('order.waitForDelivery')">
              <span
                >{{ $t("order.delType") }}:{{
                  $t("order.expressDelivery")
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("publics.addressee") }}：{{
                  dataForm.userAddrOrder.receiver
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("order.phoneNum") }}：{{
                  dataForm.userAddrOrder.mobile
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("publics.deliveryAddr") }}：{{
                  dataForm.userAddrOrder.province
                }}{{ dataForm.userAddrOrder.city
                }}{{ dataForm.userAddrOrder.area
                }}{{ dataForm.userAddrOrder.addr }}</span
              >
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item :label="this.$i18n.t('order.deliveryMethod') + ':'">
        <el-radio-group v-model="dataForm.deliveryType" @change="clear()">
          <el-radio :label="1" :disabled="dataForm.deliveryType === 4">{{
            $t("order.shouldExpressDelivery")
          }}</el-radio>
          <el-radio :label="3" :disabled="dataForm.deliveryType === 4">{{
            $t("order.noNeedRequired")
          }}</el-radio>
          <!-- <el-radio :label="4" :disabled="dataForm.deliveryType !== 4">{{
            $t("order.sameCityDelivery")
          }}</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div v-if="dataForm.deliveryType === 1">
        <el-form-item :label="this.$i18n.t('order.courierCompany') + '：'">
          <!-- <span>快递公司：</span> -->
          <el-select
            v-model="dataForm.dvyId"
            :placeholder="this.$i18n.t('tip.select')"
          >
            <el-option
              v-for="item in dataForm.dvyNames"
              :key="item.dvyId"
              :label="item.dvyName"
              :value="item.dvyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('order.trackingNumber') + '：'"
          prop="dvyFlowId"
        >
          <el-input
            v-model="dataForm.dvyFlowId"
            width="80"
            maxlength="90"
            show-word-limit
            label="this.$i18n.t('order.trackingNumber')"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{
        $t("crud.filter.submitBtn")
      }}</div>
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
        userAddrOrder: {},
        dvyFlowId: 0,
        dvyNames: [],
        orderNumber: 0,
        deliveryType: 1
      },
      dataList: [],
      selectOrderItems: [],
      isSubmit: false,
      checkAll: false,
      orderItems: [],
      isTrue: false,
      errorInfo: '',
      orderId: 0,
      order: null,
      isIndeterminate: true,
      orderNumber: 0,
      freightAmount: 0,
      lossAmount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {},
  mounted () { },
  methods: {
    processingStr (str) {
      // str = str.replace(/\u200B/g,'');
      // return str
    },

    /**
     * 获取数据列表
     */
    init (order) {
      this.isSubmit = false
      this.dataForm.userAddrOrder = {}
      this.visible = true
      this.orderNumber = order.orderNumber
      this.clear()
      // 修改
      this.$http({
        url: this.$http.adornUrl(`/platform/orderDelivery/getOrderItemUnDelivery/${order.orderNumber}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        // console.log('data', data)
        // console.log('orderItems', data.orderItems)
        this.dataForm.userAddrOrder = data.userAddrOrder
        this.dataList = data.orderItems
        this.dataForm.deliveryType = parseInt(data.dvyType)
        this.dataList.forEach(element => {
          element.changeNum = element.prodCount
        })
      })
      this.getDeliveryList()
    },
    getDeliveryList () {
      this.$http({
        url: this.$http.adornUrl('/platform/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm.dvyNames = data
      })
    },
    /**
     * 修改状态
     */
    handleSelectionChange (val) {
      this.selectOrderItems = val
    },
    /**
     * 禁用多选按钮
     */
    checkSelectable (row) {
      return row.status !== 0 && (!row.returnMoneySts || row.returnMoneySts < 0 || row.returnMoneySts > 5)
    },
    clear () {
      this.dataForm.dvyFlowId = 0
      this.dataForm.dvyId = ''
    },
    /**
      * 校验数量
      */
    check () {
      this.isTrue = false
      if (this.selectOrderItems.length <= 0) {
        this.isTrue = true
        this.errorInfo = this.$i18n.t('order.seleOrd')
        return true
      }
      this.selectOrderItems.forEach(element => {
        if (element.prodCount <= 0 || element.prodCount < element.changeNum || element.changeNum <= 0) {
          this.isTrue = true
          this.errorInfo = element.prodName + this.$i18n.t('order.numNotZero') + '！'
          return true
        }
        if (element.changeNum <= 0) {
          this.isTrue = true
          this.errorInfo = element.prodName + this.$i18n.t('order.numNotZero') + '！'
          return true
        }
        if (element.changeNum == null) {
          this.isTrue = true
          this.errorInfo = element.prodName + this.$i18n.t('order.fhNumNotZero') + '！'
          return true
        }
      })
      if (this.dataForm.dvyId === '' && this.dataForm.deliveryType === 1) {
        this.isTrue = true
        this.errorInfo = this.$i18n.t('order.seleCouCom')
        return true
      }
      if ((this.dataForm.dvyFlowId === 0 || !this.dataForm.dvyFlowId) && this.dataForm.deliveryType === 1) {
        this.isTrue = true
        this.errorInfo = this.$i18n.t('order.entCouNum')
        return true
      }
      var reg = /^[a-zA-Z0-9]{4,30}$/
      if (!reg.test(this.dataForm.dvyFlowId) && this.dataForm.deliveryType === 1) {
        this.isTrue = true
        this.errorInfo = this.$i18n.t('order.checkDvyId')
        return true
      }
    },
    /**
     * 确定事件
     */
    submitProds () {
      if (!this.dataForm.deliveryType) {
        this.$message.error(this.$i18n.t('order.pledSeleMet'))
        return
      }
      this.check()
      if (this.isTrue) {
        this.errorMsg(this.errorInfo)
        return
      }
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/platform/orderDelivery/orderItemsDelivery`),
        method: 'put',
        data: this.$http.adornData({
          orderNumber: this.orderNumber,
          dvyId: this.dataForm.dvyId,
          dvyFlowId: this.dataForm.dvyFlowId,
          freightAmount: this.freightAmount,
          selectOrderItems: this.selectOrderItems,
          deliveryType: this.dataForm.deliveryType
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshOrderDeliveryUpdate')
          }
        })
      }).catch(({ e }) => {
        this.isSubmit = false
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

<style>
.el-input__inner {
  border: 1px solid #dcdfe6 !important;
}
</style>
<style scoped>
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;
}
.element.style {
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.mod-order-order .contprod-:last-child {
  border-bottom: 0;
  border-left: 0;
}
.mod-order-order .prod-cont.prod-bottom,
.mod-order-order .prod-cont {
  border-bottom: 1px solid #dddee1;
  border-left: 1px solid #dddee1;
}
</style>
