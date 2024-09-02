<template>
  <el-dialog :title="this.$i18n.t('order.modifyOrderAmount')" :close-on-click-modal="false" :visible.sync="visible" width="80%">
    <div class="mod-order-orderInfo">
      <el-alert :title="this.$i18n.t('order.modificatioAmount')" type="warning" show-icon></el-alert>
      <div class="main">
        <div class="content">
          <div class="prod-tit prod-tit-item">
            <el-row style="width:100%">
              <el-col :span="21">
                <el-col :span="5" header-align="center" align="center">
                  <span class="item">{{$t("order.product")}}</span>
                </el-col>
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.unitPrice")}}</span>
                </el-col>
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.quantity")}}</span>
                </el-col>
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.totalPrice")}}</span>
                </el-col>
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.totalDiscount")}}</span>
                </el-col>
                <el-col :span="3" header-align="center" align="center">
                  <span class="item">{{$t("order.userPayunt")}}</span>
                </el-col>
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.platforlowance")}}</span>
                </el-col><el-col :span="2" header-align="center" align="center">
                  <span class="item">{{$t("order.estimancome")}}</span>
                </el-col>
                <el-col :span="4" header-align="center" align="center">
                  <span class="item">{{$t("order.reducedAnt")}}</span>
                </el-col>
              </el-col>
              <el-col :span="3">
                <el-col header-align="center" align="center">
                  <span class="item product">{{$t("order.shippingAmunt")}}</span>
                </el-col>
              </el-col>
            </el-row>
          </div>
          <div class="prod">
            <div class="prod-cont prod-bottom">
              <el-row style="width:100%">
                <el-col :span="21">
                  <el-col class="prod" v-for="(orderItem,index) in dataList" :key="index">
                    <el-col class="prod-cont-item">
                      <el-row style="width:100%">
                        <el-col :span="5" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.prodName}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.price}}</span>
                          </div>
                        </el-col>  <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.prodCount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.productTotalAmount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.shareReduceAmount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="3" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.actualTotalAmount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.platformShareReduceAmount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="2" style="height: 100%;">
                          <div class="item line">
                            <span>{{orderItem.amount}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4" style="height: 100%;">
                          <div class="item line">
                            <el-input-number
                              size="small"
                              v-model="orderItem.chageAmount"
                              :precision="2"
                              :min="0"
                              :disabled="orderItem.scoreOrder"
                              @change="setChageAmount(index)"
                            ></el-input-number>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-col>
                  </el-col>
                <el-col class="prod-cont-ca" :span="3" style="height: 100%;">
                  <div class="item line">
                    <el-input-number :disabled="orderMold === 1 || freightDisabled || dvyType === 2 || freeTransfee > 0" v-model="freightAmount" size="small" :precision="2" :min="0" @blur="freightAmountInput"></el-input-number>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span v-if="lossAmount !== 0">{{$t("order.decreaslowance")}} :{{lossAmount}}{{$t("admin.dollar")}}</span>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import Big from 'big.js'
export default {
  data () {
    return {
      visible: false,
      dataForm: {},
      dataList: [],
      orderItems: [],
      isTrue: false,
      errorInfo: '',
      orderId: 0,
      orderNumber: 0,
      freightAmount: 0,
      freightDisabled: false,
      lossAmount: 0,
      dvyType: 1,
      orderMold: 0,
      freeTransfee: 0,
      dataListLoading: false,
      dataListSelections: [],
      isOnce: true
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
      let orderInfo = Object.assign({}, order)
      this.visible = true
      this.dataListLoading = true
      this.dataList = orderInfo.orderItems
      this.orderId = orderInfo.orderId
      this.orderNumber = orderInfo.orderNumber
      this.freightAmount = orderInfo.freightAmount - orderInfo.platformFreeFreightAmount
      this.freightDisabled = orderInfo.freightAmount && orderInfo.freightAmount - orderInfo.platformFreeFreightAmount === 0
      this.orderMold = orderInfo.orderMold
      this.freeTransfee = orderInfo.freeTransfee
      this.dvyType = orderInfo.dvyType
      this.lossAmount = 0
      this.dataList.forEach(element => {
        element.chageAmount = 0.00
        element.lossAmount = 0.00
        let shareReduceAmount = element.shareReduce
        let actualTotalAmount = element.actualTotal
        let platformShareReduceAmount = element.platformShareReduce
        element.shareReduceAmount = shareReduceAmount
        element.actualTotalAmount = actualTotalAmount
        element.platformShareReduceAmount = platformShareReduceAmount
        let actual = new Big(element.actualTotal)
        element.amount = actual.plus(element.platformShareReduce).round(2)
        element.scoreOrder = element.actualTotalAmount < 0.01 && element.useScore > 0
      })
      this.dataListLoading = false
    },
    /**
     * 减少金额变化时，改变订单金额
     */
    setChageAmount (index) {
      let item = this.dataList[index]
      if (!item.chageAmount) {
        item.chageAmount = 0
      }
      let chageAmount = new Big(item.chageAmount)
      let actualTotal = new Big(item.actualTotal)
      let platformShareReduceAmount = new Big(item.platformShareReduce)
      // 金额减少比例 = 减少金额  % 总金额
      let proportion = chageAmount.div(item.productTotalAmount).round(6)
      // 平台优惠金额减少金额 = 减少比例 * 原平台优惠金额
      let platformAmount = proportion.times(platformShareReduceAmount).round(2)
      // 平台优惠金额 = 原平台优惠金额 - 对应比例的金额
      item.platformShareReduceAmount = platformShareReduceAmount.minus(platformAmount)
      // 总优惠金额 = 变化金额 + 原总优惠金额
      item.shareReduceAmount = chageAmount.plus(item.shareReduce)
      // 实际金额 = 原实际金额 - 变化金额
      item.actualTotalAmount = actualTotal.minus(item.chageAmount)
      // 店铺预计收入金额 = 实际金额 + 平台优惠金额
      item.amount = item.actualTotalAmount.plus(item.platformShareReduceAmount).round(2)
      // 店铺损失金额 = 平台优惠金额减少金额
      item.lossAmount = platformAmount
      // 计算店铺亏损总金额
      let lossAmount = new Big(0)
      this.dataList.forEach(item => {
        lossAmount = lossAmount.plus(item.lossAmount)
      })
      this.lossAmount = lossAmount
    },
    /**
     * 校验金额
     */
    check () {
      this.isTrue = false
      this.dataList.forEach(element => {
        // 如果金额小于0.01 支付积分大于0则为纯积分支付 此时不进行金额判断
        if (element.actualTotal < 0.01 && element.useScore > 0) {
          return false
        }
        if (element.actualTotal <= 0) {
          this.isTrue = true
          this.errorInfo = this.$i18n.t('order.theOraterThan0')
          return true
        }
      })
    },
    /**
     * 确定事件
     */
    submitProds () {
      if (!this.isOnce) {
        return
      }
      this.isOnce = false
      this.check()
      if (this.isTrue) {
        this.errorMsg(this.errorInfo)
        return
      }
      // let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/order/order/changeAmount`),
        method: 'put',
        data: this.$http.adornData({
          orderId: this.orderId,
          orderItems: this.dataList,
          orderNumber: this.orderNumber,
          freightAmount: this.freightAmount
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('order.modifyAmountSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$emit('refreshOrderAmountUpdate')
            this.visible = false
            setTimeout(() => {
              this.isOnce = true
            }, 200)
          }
        })
      }).catch(() => {
        this.isOnce = true
      })
    },
    /**
     * 金额输入事件
     */
    freightAmountInput () {
      if (this.freightAmount === '' || this.freightAmount === undefined) {
        this.freightAmount = 0
      }
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
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;
}
.mod-order-orderInfo .prod-tit-item span{
  margin-right: 0;
}
.mod-order-order .prod-cont.prod-bottom {
  border: 1px solid #ebedf0;
}
.mod-order-order .prod {
  width: 100%;
  border-bottom: 1px solid #ebedf0;
}
.mod-order-order .prod:last-child {
  border-bottom: none;
}
.mod-order-order .prod-cont-item {
  display: flex;
  border-right: 1px solid #ebedf0;
}
.mod-order-order .prod-cont-item .item {
  border-right: 1px solid #ebedf0;
  text-align: center;
  justify-content: center;
}
.mod-order-order .prod-cont-item .line {
  line-height: 3;
}
.mod-order-order .prod-cont-ca {
  text-align: center;
  line-height: 3;
}
div >>> .el-input-number__decrease {
  bottom: 2px
}
.mod-order-order .prod-cont.prod-bottom,
.mod-order-order .prod-cont {
  border-bottom: 1px solid #dddee1;
  border-left: 1px solid #dddee1;
}
.mod-order-order .prod-cont-item .item:last-child {
  border-right: none;
}
.mod-order-order .item >>> .el-input-number.el-input-number--small {
  width: 160px;
}

</style>
