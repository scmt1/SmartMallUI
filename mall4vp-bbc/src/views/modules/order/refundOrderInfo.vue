<template>
  <div class="orderRefund">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t('refundOrderDetail.returnDetails') }}
      </div>
    </div>
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="auto">
      <div class="mod-order-refundOrderInfo">
        <div class="refundId">
          <span class="title">{{ $t('order.refundId') }}</span>
          <span class="text">{{ dataForm.refundSn }}</span>
        </div>
        <div class="content">
          <div class="order-number">
            <div class="num-cont">
              <div class="state-title">
                <div class="item">
                  <div class="title">{{ $t('refundOrderDetail.returnType') }}：</div>
                  <div class="text">
                    <div v-if="dataForm.refundType === 1">{{ $t("refundOrderDetail.fullRefund") }}</div>
                    <div v-if="dataForm.refundType === 2">{{ $t("refundOrderDetail.sigGoosRefund") }}</div>
                  </div>
                </div>
                <p></p>
                <div class="item">
                  <div class="title">{{ $t('refundOrderDetail.returnMethod') }}：</div>
                  <div class="text">
                    <div v-if="dataForm.applyType === 1">{{ $t("order.onlyRefund") }}</div>
                    <div v-if="dataForm.applyType === 2">{{ $t("order.refundAndMoney") }}</div>
                  </div>
                </div>
              </div>
              <div class="refund-progress">
                <div class="item" v-if="dataForm.applyType === 1">
                  <el-steps :active="onlyRefundStepsStatus" align-center :process-status="onlyRefundProcessStatus">
                    <el-step :title="$t('refundOrderDetail.buyerApplyRefund')"/>
                    <el-step :title="$t('refundOrderDetail.MerchantAgreesRefund')"/>
                    <el-step :title="$t('order.refundsuccessfully')"/>
                  </el-steps>
                </div>
                <div class="item" v-else>
                  <el-steps :active="stepsStatus" align-center :process-status="dataForm.returnMoneySts === -1 ? 'error' : 'wait'">
                    <el-step :title="$t('refundOrderDetail.BuyerApplyRetPur')"></el-step>
                    <el-step :title="$t('refundOrderDetail.MerchantAgreesRetPur')"></el-step>
                    <el-step :title="$t('refundOrderDetail.buyerDel')"></el-step>
                    <el-step :title="$t('refundOrderDetail.MerchantSuccessfulProcessing')"></el-step>
                    <el-step :title="$t('order.refundsuccessfully')"></el-step>
                  </el-steps>
                </div>
              </div>
            </div>
          </div>
          <div class="order-state">
            <div class="state-cont">
              <div class="order-info">
                <div class="order-details">
                  <div class="detail-title">
                    <span class="prompt">{{ $t("refundOrderDetail.returnDetails") }}</span>
                  </div>
                  <div class="detail-cont">
                    <div class="detail01">
                      <div class="text-width">
                        <!-- <span class="revise-addr"
                              @click="changeAddr(dataForm.addrOrderId)">
                          <img src="~@/assets/img/revise.png"
                               alt="" />{{$t("temp.modify")}}地址
                        </span>-->
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.number') }}：</span>
                          <span class="text">{{ dataForm.orderNumber }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.actualAmount') }}：</span>
                          <span class="text">{{ dataForm.orderAmount }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.refundAmount') }}：</span>
                          <span class="text">{{dataForm.refundAmount + $t("transport.yuan") + "+ " + dataForm.refundScore + $t("order.score") }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.applicationTime') }}：</span>
                          <span class="text">{{ dataForm.applyTime }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('refundOrderDetail.refundReason') }}：</span>
                          <span class="text">{{ dataForm.buyerReason }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('refundOrderDetail.refundInstructions') }}：</span>
                          <span class="text">{{ dataForm.buyerDesc }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 退款凭证 -->
                <div class="buyers">
                  <div class="detail-title">
                    {{ $t('refundOrderDetail.returnVoucher') }}
                  </div>
                  <div class="buyers-info">
                    <div class="img-up">
                      <imgs-upload v-model="dataForm.photoFiles" :disabled="true" :modal="false" :prompt="false"/>
                    </div>
                  </div>
                </div>
                <!-- / 退款凭证 -->
              </div>
              <div class="order-info" v-if="this.dataForm.refundDelivery && (this.dataForm.refundDelivery.deyNu || this.dataForm.refundDelivery.imgs)">
                <div class="order-details">
                  <template>
                    <div class="detail-title">
                      <span class="prompt">{{$t("refundOrderDetail.logisticsDetails") }}</span>
                    </div>
                    <div class="detail-cont">
                      <div class="detail01">
                        <div class="text-width">
                          <div class="text-width-item" v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.deyName">
                            <span class="title">{{ $t('refundOrderDetail.logisticsName')  }}：</span>
                            <span class="text">{{this.dataForm.refundDelivery.deyName }}</span>
                          </div>
                          <div v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.deyNu" class="text-width-item">
                            <span class="title">{{ $t('order.trackingNumber') }}：</span>
                            <span class="text">{{this.dataForm.refundDelivery.deyNu }}</span>
                          </div>
                          <div class="text-width-item" v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.senderRemarks">
                            <span class="title">{{ $t('order.compradorMsg') }}：</span>
                            <span class="text">{{this.dataForm.refundDelivery.senderRemarks }}</span>
                          </div>
                          <div v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.senderMobile" class="text-width-item">
                            <span class="title">{{ $t('order.buyerPhone')  }}：</span>
                            <span>{{this.dataForm.refundDelivery.senderMobile }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="detail-title">
                      <!-- 物流凭证 -->
                      <span>{{ $t('refundOrderDetail.Logisticsvoucher') }}</span>
                    </div>
                    <div class="buyers-info">
                      <div class="detail02">
                        <imgs-upload v-model="refundDeliveryPhotos" :disabled="true" :modal="false" :prompt="false"/>
                        <!-- <div class="refundImg" v-for="(item, index) in refundDeliveryPhotos" :key="index">
                            <el-popover placement="right" title trigger="click">
                              <img slot="reference" :src="resourcesUrl + item"
                                style="max-height: 79px !important;max-width: 79px !important;" class="showLicense"/>
                              <img :src="resourcesUrl + item" style="max-height: 720px; max-width: 720px"/>
                            </el-popover>
                          </div> -->
                      </div>
                    </div>
                  </template>
                </div>
                <div class="buyers">
                  <template>
                    <div class="detail-title" v-if="deliveryDto">
                      <!-- 退款物流信息 -->
                      <span>{{ $t('order.logisticsStatus') }}：</span>
                      <span class="l-state" v-if="deliveryDto.state === 0">{{ $t("order.noRecord") }}</span>
                      <span class="l-state" v-if="deliveryDto.state === 1">{{ $t("order.collected") }}</span>
                      <span class="l-state" v-if="deliveryDto.state === 2">{{ $t("order.delivering") }}</span>
                      <span class="l-state" v-if="deliveryDto.state === 3">{{ $t("order.haveBeenReceived") }}</span>
                      <span class="l-state" v-if="deliveryDto.state === 4">{{ $t("order.problemPiece") }}</span>
                      <span class="l-state" v-if="deliveryDto.state === 201">{{ $t("order.reachTheDestinationCity") }}</span>
                    </div>
                    <div class="logistics-box" v-if="deliveryDto">
                      <!-- 退款时间 -->
                      <div class="item" v-if="dataForm.returnMoneySts === 5 && dataForm.refundTime !== null">
                        <div class="time">{{ dataForm.refundTime }}</div>
                        <div class="text">
                          {{ $t("refund.refundMoney") }}
                        </div>
                      </div>
                      <!-- 收货时间 -->
                      <div class="item" v-if="dataForm.returnMoneySts === 5 && dataForm.receiveTime !== null">
                        <div class="time">{{ dataForm.receiveTime }}</div>
                        <div class="text">
                          {{ $t("refund.receivedGoods") }}
                        </div>
                      </div>
                      <div class="item" v-for="(trace, index) in deliveryDto.traces" :key="index">
                        <div class="time">{{ trace.acceptTime }}</div>
                        <div class="text">{{ trace.acceptStation }}</div>
                      </div>
                      <div class="item" v-if="deliveryDto.traces &&deliveryDto.traces.length < 1">
                        {{ $t("order.noLogisticsInformation") }}
                      </div>
                      <!-- 发货时间 -->
                      <div class="item" v-if="dataForm.returnMoneySts >= 3 && dataForm.shipTime !== null">
                        <div class="time">{{ dataForm.shipTime }}</div>
                        <div class="text">
                          {{ $t("refund.buyerHasShipped") }}
                        </div>
                      </div>
                      <!-- 同意退款时间 -->
                      <div class="item" v-if="dataForm.returnMoneySts >= 2 && dataForm.decisionTime !== null">
                        <div class="time">{{ dataForm.decisionTime }}</div>
                        <div class="text">{{ $t("refund.merchantHasAgree") }}</div>
                      </div>
                      <!-- 申请时间 -->
                      <div :class="['item', dataForm.returnMoneySts >= 1?'left-line':'']" v-if="dataForm.returnMoneySts >= 1">
                        <div class="time">{{ dataForm.applyTime }}</div>
                        <div class="text">
                          {{ $t("refund.buyerApply") }}
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="item-list">
                <el-table :data="prodList" header-cell-class-name="table-header" row-class-name="table-row-row" :row-style="{ height:'82px'}">
                  <el-table-column prop :label="this.$i18n.t('refundOrderDetail.refundItems')" width="400">
                    <template slot-scope="scope">
                      <div class="prod-info">
                        <!-- <img :src="resourcesUrl + scope.row.pic" class="prod-img"/> -->
                        <prod-pic
                          height="60px"
                          width="60px"
                          :pic="scope.row.pic"
                        ></prod-pic>
                        <div class="con">
                          <span class="gift-icon" v-if="scope.row.giveawayOrderItemId">{{ $t("order.giveawayPord") }}</span>
                          <div class="prod-info-text" :class="{'gift-prod-text': scope.row.giveawayOrderItemId}">{{ scope.row.prodName }}</div>
                          <div class="prod-info-sku" v-if="scope.row.skuName">{{ scope.row.skuName }}</div>
                        </div>
                      </div>
                      <!-- 赠品 -->
                      <div v-if="dataForm.orderItems.length > 1" class="gift-prod table-cell-text">
                        <div v-for="item in scope.row.giveawayList" class="item">
                          <div class="name prod-info-text">{{'【' + $t("order.giveawayPord") + '】'}}{{item.prodName}}</div>
                          <span class="num">×{{item.prodCount}}</span>
                        </div>
                      </div>
                      <!-- / 赠品 -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" :label="this.$i18n.t('order.unitPrice')">
                    <template slot-scope="scope">
                      <span>￥{{ scope.row.price | price }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="count" :label="this.$i18n.t('order.quantity')">
                    <template slot-scope="scope">
                      <!-- <span v-if="dataForm.refundType === 1">{{scope.row.prodCount }}</span>
                      <span v-if="dataForm.refundType === 2">{{dataForm.goodsNum }}</span> -->
                      <span>{{scope.row.prodCount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productTotalAmount" :label="this.$i18n.t('order.prodTotalPrice')">
                    <template slot-scope="scope">
                      <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">￥{{scope.row.productTotalAmount | price }}</span>
                      <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">￥{{bigProductTotalAmount(scope.row.price, dataForm.goodsNum) | price }}</span>
                      <span v-if="scope.row.giveawayOrderItemId">￥{{scope.row.giveawayAmount | price }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="actualTotal" :label="this.$i18n.t('order.actualAmount')">
                    <template slot-scope="scope">
                      <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">￥{{scope.row.actualTotal | price }}</span>
                      <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">￥{{bigActualTotal(scope.row.actualTotal, scope.row.prodCount) | price }}</span>
                      <span v-if="scope.row.giveawayOrderItemId">-</span>
                      <el-tag v-if="scope.row.shareReduce > 0" type="danger" size="mini" effect="dark">{{ $t("marketing.discount") }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="dataForm.refundType === 2" prop="productTotalAmount" :label="this.$i18n.t('order.returnAmount')" width="180">
                    <template slot-scope="scope">
                      <!-- <span>{{dataForm.refundAmount}}</span> -->
                      <span v-if="!scope.row.giveawayOrderItemId">{{dataForm.refundAmount + $t("transport.yuan") + " + " + dataForm.refundScore + $t("order.score") }}</span>
                      <span v-if="scope.row.giveawayOrderItemId" class="">-</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

          <div class="order-log">
            <div class="log-title">
              <span>{{ $t("refundOrderDetail.refundLog") }}</span>
            </div>
            <div class="log-cont">
              <div v-if="dataForm.applyTime">
                <span>{{ dataForm.applyTime }}{{ $t("refundOrderDetail.waitProcess") }}</span>
              </div>
              <div v-if="dataForm.applyType === 2 && dataForm.handelTime  && !dataForm.rejectTime">
                <span>{{ dataForm.handelTime }}{{ $t("refundOrderDetail.waitingBuyer") }}</span>
              </div>

              <div v-if="dataForm.applyType === 1 && dataForm.handelTime  && !dataForm.rejectTime">
                <span>{{ dataForm.handelTime }}{{ $t("refundOrderDetail.waitRefund") }}</span>
              </div>
              <div v-if="dataForm.shipTime">
                <span>{{ dataForm.shipTime }}{{ $t("refundOrderDetail.waitsBuyerRec") }}</span>
              </div>
              <div v-if="dataForm.receiveTime" >
                <span>{{ dataForm.receiveTime }}{{ $t("refundOrderDetail.waitMerchantAgree") }}</span>
              </div>
              <div v-if="dataForm.decisionTime">
                <span>{{ dataForm.decisionTime }}{{ $t("refundOrderDetail.agreeAndWaitRefund") }}</span>
              </div>
              <div v-if="dataForm.refundTime">
                <span>{{ dataForm.refundTime }}{{ $t("order.refundsuccessfully") }}</span>
              </div>

              <div v-if="dataForm.handelTime && dataForm.returnMoneySts === -1  && !dataForm.rejectTime">
                <span>{{ dataForm.updateTime }}{{ $t("refundOrderDetail.refundClosed") }}</span>
              </div>
              <div v-if="dataForm.returnMoneySts === -1 && dataForm.cancelTime">
                <span>{{ dataForm.cancelTime }} {{ $t("order.refundClosed") }}{{ $t("order.buyerHasWithdrawn") }}</span>
              </div>
              <div v-if="dataForm.returnMoneySts === -1 && dataForm.rejectTime">
                <span>{{ dataForm.rejectTime }}{{ $t("refundOrderDetail.merchantRejectedAndFailed") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import ImgsUpload from '@/components/imgs-upload'
import AddOrUpdate from './order-addr'
import Big from 'big.js'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    return {
      visible: false,
      addrList: [],
      dataForm: {},
      refundDeliveryPhotos: [],
      receiveMessage: '',
      isAgreeReceiver: '',
      isAgreeRefund: 2,
      isReceiver: 0,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      addOrUpdateVisible: false,
      devyVisible: false,
      deliveryDto: null,
      refundAddr: '',
      deyNu: '',
      deyName: '',
      senderMobile: '',
      senderRemarks: '',
      refundScore: 0,

      // 商品列表
      prodList: []
    }
  },
  components: {
    AddOrUpdate,
    ImgsUpload,
    ProdPic
  },
  filters: {
    price (value) {
      if (!value) {
        return 0.00
      }
      return Number(value).toFixed(2)
    }
  },
  watch: {
    visible: function () {
      if (!this.visible) {
        this.devyVisible = false
        this.addOrUpdateVisible = false
      }
    }
  },
  computed: {
    onlyRefundStepsStatus: function () {
      let index = 0
      if (this.dataForm.handelTime) {
        index++
      }
      if (this.dataForm.cancelTime || this.dataForm.refundTime || this.dataForm.rejectTime || this.dataForm.refundTime || this.dataForm.rejectTime) {
        index++
      }
      return index
    },
    onlyRefundProcessStatus: function () {
      switch (this.dataForm.returnMoneySts) {
        case 1:
        case 2:
          return 'finish'
        case 5:
          return 'success'
        default:
          return 'error'
      }
    },

    stepsStatus: function () {
      let index = 1
      if (this.dataForm.handelTime) {
        index++
      }
      if (this.dataForm.shipTime) {
        index++
      }
      if (this.dataForm.receiveTime) {
        index++
      }
      if (!this.dataForm.receiveTime && this.dataForm.returnMoneySts === 5) {
        index++
      }
      if (this.dataForm.cancelTime || this.dataForm.refundTime || this.dataForm.rejectTime || this.dataForm.refundTime || this.dataForm.rejectTime) {
        index++
      }
      return index
    },
    processStatus: function () {
      switch (this.dataForm.returnMoneySts) {
        case 1:
        case 2:
        case 3:
        case 4:
          return 'finish'
        case 5:
          return 'success'
        default:
          return 'error'
      }
    }

  },
  mounted () {
    const refundId = this.$route.query.refundId
    const shopId = this.$route.query.shopId
    this.init(refundId, shopId)
  },
  methods: {
    init (id, shopId) {
      this.dataForm.refundId = id || 0
      this.dataForm.shopId = shopId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.refundDeliveryPhotos = []
      this.receiveMessage = ''
      this.isAgreeRefund = 2
      if (this.dataForm.refundId) {
        this.$http({
          url: this.$http.adornUrl(`/platform/orderRefund/info`),
          method: 'get',
          params: this.$http.adornParams({
            'refundId': this.dataForm.refundId,
            'shopId': this.dataForm.shopId
          })
        }).then(({ data }) => {
          this.dataForm = data
          this.deliveryDto = this.dataForm.deliveryDto
          if (this.dataForm.refundDelivery && this.dataForm.refundDelivery.imgs) {
            // this.refundDeliveryPhotos = this.dataForm.refundDelivery.imgs.split(',')
            this.refundDeliveryPhotos = this.dataForm.refundDelivery.imgs
          }
          // 处理商品列表
          const prods = data.orderItems
          this.prodList = prods
          if (prods && prods.length === 1 && prods[0].giveawayList && prods[0].giveawayList.length) {
            // 单个商品且有赠品时，将主商品和赠品放在同一级列表中展示
            this.prodList = [...data.orderItems, ...prods[0].giveawayList]
          }
        })
      }
    },

    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/platform/orderRefund/info/${this.dataForm.refundId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      })
    },
    // 表单提交
    dataFormSubmit () {
    },
    // 修改地址
    changeAddr (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },

    // 确认收货
    confirmHandel () {
    },

    /**
     * 加载收货地址模板
     */
    getRefundAddrList () {
      this.$http({
        url: this.$http.adornUrl('/platform/refundAddr/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.addrList = data
        if (this.dataForm.refundAddrId) {
          let index = this.addrList.findIndex(item => item.refundAddrId === this.dataForm.refundAddrId)
          if (index || index === 0) {
            let refAddr = this.addrList[index]
            this.refundAddr = refAddr.province + refAddr.city + refAddr.area + refAddr.addr
          }
        }
      })
    },

    /**
     * 提交处理
     */
    checkHandel () {
      let tempRefundAddrId = this.isAgreeRefund === 2 ? this.dataForm.refundAddrId : undefined
      this.$http({
        url: this.$http.adornUrl(`/order/refund/process`),
        method: 'put',
        data: this.$http.adornData({
          refundId: this.dataForm.refundId,
          refundSts: this.isAgreeRefund,
          refundSn: this.dataForm.refundSn,
          rejectMessage: this.dataForm.rejectMessage,
          sellerMsg: this.dataForm.sellerMsg,
          refundAddrId: tempRefundAddrId
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
    },

    /**
     * 确定退款
     */
    returnMoneyHandle () {
      this.$http({
        url: this.$http.adornUrl(`/order/refund/returnMoney`),
        method: 'put',
        data: this.$http.adornData({
          refundId: this.dataForm.refundId,
          refundSts: this.isAgreeRefund,
          refundSn: this.dataForm.refundSn,
          rejectMessage: this.dataForm.rejectMessage,
          sellerMsg: this.dataForm.sellerMsg,
          isReceiver: this.isReceiver
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
    },
    /**
     * 退款请求（发放退款）
     */
    refundRequest (refundSn) {
      this.$http({
        url: this.$http.adornUrl(`/order/refund/refundRequest`),
        method: 'put',
        data: refundSn
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
    },
    // /**
    //  * 撤回上一步（返回同意退款前）
    //  */
    // refundRevocation (refundSn) {
    //   this.$http({
    //     url: this.$http.adornUrl(`/order/refund/refundRevocation`),
    //     method: 'put',
    //     data: refundSn
    //   }).then(({ data }) => {
    //     this.$message({
    //       message: '操作成功',
    //       type: 'success',
    //       duration: 1500,
    //       onClose: () => {
    //         this.visible = false
    //         this.$emit('refreshDataList')
    //       }
    //     })
    //   })
    // },

    // 精度运算-乘法
    bigProductTotalAmount: function (a, b) {
      return new Big(a).times(b)
    },
    // 精度运算-除法
    bigActualTotal: function (a, b) {
      if (a == null) {
        return ''
      }
      return new Big(a).div(b).times(this.dataForm.goodsNum)
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-order-refundOrderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;

  .content .steps {
    margin-top: 50px;
  }

  .order-number .number-text {
    font-weight: bold;
  }

  .order-number .text {
    font-size: 14px;
    color: #8a8a8a;
  }

  .order-state .state-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-left span {
    font-weight: bold;
  }

  .title-left .text {
    color: red;
  }

  .state-title .title-mid {
    display: flex;
    align-items: center;
  }
  .title-mid img {
    width: 18px;
    height: 18px;
  }

  .title-mid .mid-text {
    color: red;
  }

  .title-mid .text {
    color: #8a8a8a;
  }

  .content .order-state {
    position: relative;
    margin-top: 15px;
    /* border-bottom: 1px solid #e9eaec; */
  }

  .order-state .order-info {
    width: 100%;
    /* border-top: 1px solid #e9eaec; */
    border: 1px solid #E8E9EC;
    margin: 15px 0;
    display: flex;
  }

  .order-info img {
    width: 18px;
    height: 18px;
    margin-right: 15px;
  }
  .order-info .logistics-box {
    height: 220px;
    overflow-y: scroll;
    position: relative;
    margin-top: 15px;
  }

  .order-info .logistics-box::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 10px;
    height: 10px;
    content: " ";
    font-size: 0;
    background: #fff;
    z-index: 1;
  }

  .order-info .logistics-box::after {
    position: absolute;
    left: 6px;
    top: 0;
    display: block;
    // width: 1px;
    height: 100%;
    content: " ";
    font-size: 0;
    background: #eee;
    z-index: 0;
  }

  .order-info .logistics-box .item {
    padding: 0px 0 40px 25px;
    position: relative;
    margin-left: 6px;
    border-left: 1px solid #eee;
  }

  .order-info .logistics-box .item::before {
    position: absolute;
    left: -10px;
    top: 0px;
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    content: " ";
    font-size: 0;
    background: #ccc;
    border: 5px solid #fff;
    z-index: 2;
  }

  .order-info .logistics-box .item:first-child::before {
    background: #c00;
  }

  .order-info .logistics-box .item .time {
    color: #999;
  }

  .order-info .logistics-box .item .text {
    margin-top: 5px;
    width: 600px;
  }

  .order-info .detail-title {
    line-height: 19px;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333333;
  }

  .order-info .detail-title img {
    height: 18px !important;
    width: 18px !important;
  }

  .order-info .order-details {
    width: 620px;
    // height: 240px;
    padding-left: 30px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-right: 1px solid #e9eaec;
  }

  .order-info .detail-cont {
    position: relative;
  }

  // .detail-cont .detail01 {
  //   display: flex;
  //   height: 100%;
  //   line-height: 25px;
  //   margin-top: 15px;
  // }

  .sellerRemark {
    /* display: flex;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e9eaec; */
    margin-top: 20px;
    display: flex;
  }

  .sellerRemark .sellerRemark-title {
    height: 120px;
    line-height: 120px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    width: 5%;
  }

  .sellerRemark .content {
    height: 120px;
    line-height: 120px;
    float: right;
    margin-bottom: 30px;
    width: 95%;
  }

  .detail01  {
    display: flex;
    align-items: center;
  }
  .text-width {
    margin-bottom: 10px;
  }
  .detail02 .text-width {
    width: 100%;
  }
  .text-width .text-width-item {
    line-height: 27px;
    .text {
      word-break: break-word;
    }
  }

  .detail-cont .revise-addr {
    color: #4395ff;
    position: absolute;
    top: 15px;
    right: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .order-info .detail-cont {
    // border-top: 1px dashed #e9eaec;
    margin: 15px 20px 0 0;
  }

  .order-info .buyers {
    width: 1030px;
    padding-left: 45px;
    padding-top: 20px;
    // margin-left: 20px;
  }

  .buyers .buyers-info {
    margin-top: 15px;
    position: relative;
  }

  .buyers .buyers-info .img-up {
    margin-top: 15px;
  }

  .buyers .detail02 {
    display: flex;
    height: 100%;
    line-height: 25px;
    margin-top: 15px;
  }

  .buyers img {
    width: 100px;
  }

  .buyers .buyers-info .detail02 .refundImg {
    display: flex;
    flex-wrap: wrap;
  }

  .buyers .buyers-info .detail02 .refundImg img {
    width: 150px;
    height: 150px;
  }

  .buyers .revise-remarks {
    color: #4395ff;
    position: absolute;
    top: 15px;
    right: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .order-state .item-info {
    padding-left: 70%;
    margin: 15px 0;
  }

  .item-info span {
    margin-bottom: 15px;
    line-height: 30px;
  }

  .item-info .text {
    position: absolute;
    right: 0;
  }

  .item-info .amount {
    font-size: 18px;
    color: red;
  }

  .order-log .log-title {
    margin-top: 20px;
    width: 100%;
    line-height: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
  }

  .order-log .log-cont {
    margin-top: 15px;
    color: #666666;
    div {
      margin-bottom: 10px;
    }
  }
  .refundId {
    // height: 15px;
    margin-bottom: 15px;
    margin-left: 20px;
  }
  .num-cont {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    .state-title {
      width: 500px;
      height: 115px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      box-sizing: border-box;
      padding: 30px;
      border: 1px solid #E8E9EC;
      border-right: none;
      .item {
        display: flex;
        .text {
          color: #155BD4;
        }
      }
    }
  }
  .refund-progress {
    height: 115px;
    width: 100%;
    border: 1px solid #E8E9EC;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      width: 100%;
    }
  }
  .btn-bar {
    margin-top: 15px;
    text-align: right;
  }
  .remark-title {
    display: inline-block;
    min-width: 70px;
    display: flex;
    align-items: center;
  }
  .remark-content{
    display: inline-block;
    word-break: break-word;
  }
  .input-bar {
    display: inline-block;
    width: 100%;
  }
  // 赠品
  .gift-prod .item {
    margin-top: 5px;
    line-height: 1em;
    .name {
      display: inline-block;
      margin-right: 15px;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
div ::v-deep .el-step.is-center .el-step__head {
  display: flex;
  justify-content: center;
  align-items: center;
}
div ::v-deep .el-textarea__inner {
  border-radius: 0 !important;
  padding: 12px 10px;
}

.label {
  // font-size: 19px;
  // font-weight: 400;
  // color: #dee0e4;
  // line-height: 45px;
  position: absolute;
  margin-left: 7px;
  z-index: 1;
  margin-top: 13px;
  margin-left: 10px;
  line-height: 20px;
}
// 设置input光标起始位置，根据实际情况自行调整
.text-in1 {
  ::v-deep .el-textarea__inner {
    text-indent: 67px;
  }
}
.text-in2 {
  ::v-deep .el-textarea__inner {
    text-indent: 130px;
  }
}
// 商品信息
.item-list {
  .prod-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .prod-img {
      display: block;
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }
    .gift-icon {
      display: inline-block;
      padding: 4px;
      border-radius: 4px;
      background: #e43130;
      color: #fff;
      margin-left: 10px;
      font-size: 13px;
      margin-right: 5px;
      line-height: 1em;
    }
  }
  // 赠品
  .gift-prod .item {
    margin-top: 5px;
    line-height: 1em;
    .name {
      display: inline-block;
      margin-right: 15px;
      line-height: 20px;
      // max-width: 400px;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
  }
}
.con .prod-info-text {
  margin-left: 10px;
}
.con .prod-info-sku {
  margin-left: 10px;
  color: #999;
}
.gift-prod-text {
  margin-left: 0px !important;
  display: inline !important;
}
.prod-info-text {
  width: 300px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>



