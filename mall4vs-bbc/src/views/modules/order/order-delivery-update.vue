<template>
  <el-dialog
    :title="this.$i18n.t('order.orderShipping')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1045px"
  >
    <div class="mod-order-orderInfo">
      <!-- <el-alert title="*请仔细填写物流公司及快递单号，发货后72小时内仅支持做一次更正，逾期不可修改" type="warning" show-icon></el-alert> -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        @selection-change="handleSelectionChange"
      >
        <!-- <span>{{scope.row.status === 0?status=true:status=false}}<span> -->
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column align="left" label-class-name="text-left" :label="this.$i18n.t('order.product')" fit>
          <template slot-scope="scope">
            <div class="prod-name-con">
              <span class="prod-name">
                <span v-if="scope.row.giveawayOrderItemId" class="gift-icon">{{ $t("order.giveawayPord") }}</span>
                {{ scope.row.prodName }}
                <span v-if="scope.row.skuName" class="prod-sku">{{ scope.row.skuName }}</span>
              </span>
              
              <!-- <div

              > -->
               <span
                class="order-status"
                v-if="
                  scope.row.returnMoneySts !== null &&
                  scope.row.returnMoneySts > 0 &&
                  scope.row.returnMoneySts < 6
                " > {{ $t("order.reimburse") }}</span>
              <!-- </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="prodCount"
          :label="this.$i18n.t('order.canShipQuantity')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="status"
          :label="this.$i18n.t('product.status')"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <!-- <template slot-scope="scope">{{ scope.row.status }}</template> -->
            <span
              class="tag-text"
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
              }}</span
            >
            <span
              class="tag-text"
              v-else-if="scope.row.status !== 0 && scope.row.status !== -1"
              >{{ $t("order.partialDelivery") }}</span
            >
            <span class="tag-text" v-else-if="scope.row.status === 0">{{
              $t("order.shipmentCompleted")
            }}</span>
            <span
              class="tag-text"
              v-else-if="scope.row.status === -1"
              >{{ $t("order.toBeShipped") }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="changeNum"
          :label="this.$i18n.t('order.numberOfShipments')"
          fit
        >
          <template slot-scope="scope">
            <el-input-number
              :disabled="scope.row.prodCount <= 0"
              size="small"
              v-model="scope.row.changeNum"
              :precision="0"
              :min="0"
              :max="scope.row.prodCount"
              style="width:150px"
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
      :inline="true"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width">
              <div class="text-width-item">
                <div class="title">{{ $t("order.delType") }}：</div>
                <div class="text">{{
                  [this.$i18n.t("order.expressDelivery"),
                  this.$i18n.t("order.selfMention"),
                  this.$i18n.t("order.noNeedRequired"),
                  this.$i18n.t("order.sameCityDelivery")
                ][initDeliveryType - 1]}}</div>
              </div>
              <div class="text-width-item">
                <div class="title">{{ $t("publics.addressee") }}：</div>
                <div class="text">{{ dataForm.userAddrOrder.receiver }}</div>
              </div>
              <div class="text-width-item">
                <div class="title">{{ $t("distribution.phoneNum") }}：</div>
                <div class="text">{{ dataForm.userAddrOrder.mobile }}</div>
              </div>
              <div class="text-width-item addr-info">
                <div class="title">{{ $t("publics.deliveryAddr") }}：</div>
                <div class="text" :class="{'zh-text': $t('language') !== 'English'}">{{
                  dataForm.userAddrOrder.province
                }}{{ dataForm.userAddrOrder.city
                }}{{ dataForm.userAddrOrder.area
                }}{{ dataForm.userAddrOrder.addr }}</div>
              </div>
          </div>
        </div>
      </div>
      <el-form-item :label="this.$i18n.t('order.deliveryMethod') + ':'">
        <el-radio-group v-model="dataForm.deliveryType" @change="clear()">
          <el-radio :label="1" :disabled="dataForm.deliveryType === 4">{{
            $t("order.selfConOrd")
          }}</el-radio>
          <el-radio :label="3" :disabled="dataForm.deliveryType === 4">{{
            $t("order.noNeedRequired")
          }}</el-radio>
          <el-radio :label="4" :disabled="dataForm.deliveryType !== 4">{{
            $t("order.sameCityDelivery")
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="dataForm.deliveryType === 1" style="margin-left: 10px">
        <el-form-item :label="this.$i18n.t('order.courierCompany') + '：'">
          <!-- <span>快递公司：</span> -->
          <el-select
            v-model="dataForm.dvyId"
            style="width: 300px"
            size="small"
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
            style="width: 300px"
            maxlength="90"
            size="small"
            show-word-limit
            :placeholder="this.$i18n.t('order.trackingNumber')"
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
  name: 'delivery',
  data () {
    return {
      visible: false,
      dataForm: {
        dvyId: '',
        userAddrOrder: {},
        dvyFlowId: null,
        dvyNames: [],
        orderNumber: 0,
        deliveryType: 1
      },
      initDeliveryType: 1,
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
        url: this.$http.adornUrl(`/order/delivery/getOrderItemUnDelivery/${order.orderNumber}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        // console.log('data', data)
        // console.log('orderItems', data.orderItems)
        this.dataForm.userAddrOrder = data.userAddrOrder
        this.dataList = data.orderItems
        this.dataForm.deliveryType = parseInt(data.dvyType)
        this.initDeliveryType = this.dataForm.deliveryType
        this.dataList.forEach(element => {
          element.changeNum = element.prodCount
        })
      })
      this.getDeliveryList()
    },
    getDeliveryList () {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
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
      this.dataForm.dvyFlowId = null
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
        url: this.$http.adornUrl(`/order/delivery/orderItemsDelivery`),
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

<style scoped>
div >>> .el-input__inner {
  border: 1px solid #dcdfe6 !important;
}
/* div >>> .el-input-number__decrease,
div >>> .el-input-number__increase {
  border-top: 1px solid #dddee1 !important;
  border-bottom: 1px solid #dddee1 !important;
  height: 32px;
  line-height: 32px;
} */
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
.prod-name-con {
  display: flex;
  max-width: 100%;
  align-items: center;
}
/* 赠品标签 */
.prod-name-con .gift-icon {
  display: inline-block;
  font-size: 12px;
  line-height: 1em;
  color: #fff;
  background: #e43130;
  padding: 3px;
  border-radius: 3px;
  box-sizing: border-box;
  margin-right: 5px;
}
.prod-name-con .prod-name {
  flex: 1;
  max-width: 80%;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.prod-name-con .prod-sku {
  color: #999;
  margin-left: 2%;
}
.prod-name-con .order-status {
  margin-top: 0;
}
.detail01 {
  min-height: 80px;
  width: 100%;
  background: #F7F8FA;
  margin-top: 15px;
  padding: 20px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.addr-info {
  line-height: 17px;
}
.text-width {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.text-width .text-width-item {
  display: flex;
  margin-right: 60px;
}
.text-width .text-width-item .title {
  color: #999999;
  display: flex;
  align-items: center;
}
.text-width .text-width-item .text {
  color: #333333;
  max-width: 95px;
  /* text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden; */
  word-break: break-word;
}
.addr-info .zh-text {
  max-width: 260px !important;
}


</style>
