<template>
  <div class="orderRefund">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t('order.refundProcessing') }}
      </div>
    </div>
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto">
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
                  <div class="title">{{ $t('order.returnType') }}：</div>
                  <div class="text">
                    <div v-if="dataForm.refundType === 1">{{ $t("order.wholeOrderRefund") }}</div>
                    <div v-if="dataForm.refundType === 2">{{ $t("order.singleItemRefund") }}</div>
                  </div>
                </div>
                <div class="item">
                  <div class="title">{{ $t('order.returnMethod') }}：</div>
                  <div class="text">
                    <div v-if="dataForm.applyType === 1">{{ $t("order.onlyRefund") }}</div>
                    <div v-if="dataForm.applyType === 2">{{ $t("order.refundAndMoney") }}</div>
                  </div>
                </div>
                <div v-if="isAuth('admin:orderRefund:update') && dataForm.decisionTime && !dataForm.refundTime" class="item">
                  <div class="default-btn primary-btn" @click="refundRequest(dataForm.refundSn)">{{ $t("order.issueARefund") }}</div>
                </div>
              </div>
              <div class="refund-progress">
                <div class="item" v-if="dataForm.applyType === 1">
                  <el-steps :active="onlyRefundStepsStatus" align-center :process-status="onlyRefundProcessStatus">
                    <el-step :title="$t('order.buyer') + ' ' + $t('order.requestARefund')"/>
                    <el-step :title="$t('admin.merAgreeRefund')"/>
                    <el-step :title="$t('order.refundsuccessfully')"/>
                  </el-steps>
                </div>
                <div class="item" v-else>
                  <el-steps :active="stepsStatus" align-center :process-status="dataForm.returnMoneySts === -1 ? 'error' : 'wait'">
                    <el-step :title="$t('order.buyer') + ' ' + $t('order.requestARefundT')"></el-step>
                    <el-step :title="$t('admin.merAgreeRefund')"></el-step>
                    <el-step :title="$t('order.shippedByBuyer')"></el-step>
                    <el-step :title="$t('order.merchant') + ' ' + $t('order.successfulProcessing')"></el-step>
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
                    <span class="prompt">{{ $t("order.returnDetails") }}</span>
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
                          <span class="title">{{ $t('order.orderActuallyPaid') }}：</span>
                          <span class="text">{{ dataForm.orderAmount }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.refundAmount') }}：</span>
                          <span class="text">{{dataForm.refundAmount + $t("admin.dollar") + "+ " + dataForm.refundScore + $t("order.integral") }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.applicationTime') }}：</span>
                          <span class="text">{{ dataForm.applyTime }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.reasonForReturn') }}：</span>
                          <span class="text">{{ dataForm.buyerReason }}</span>
                        </div>
                        <div class="text-width-item">
                          <span class="title">{{ $t('order.refundInstructions') }}：</span>
                          <span class="text">{{ dataForm.buyerDesc }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 退款凭证 -->
                <div class="buyers">
                  <div class="detail-title">{{ $t('order.returnCertificate') }}</div>
                  <div class="buyers-info">
                    <div class="img-up">
                      <imgs-upload v-model="dataForm.photoFiles" :disabled="true" :modal="true" :prompt="false"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-info" v-if="this.dataForm.refundDelivery && (this.dataForm.refundDelivery.deyNu || this.dataForm.refundDelivery.imgs)">
                <div class="order-details">
                  <template>
                    <div class="detail-title">
                      <span class="prompt">{{$t("order.logisticsDetails")}}</span>
                    </div>
                    <div class="detail-cont">
                      <div class="detail01">
                        <div class="text-width">
                          <div class="text-width-item" v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.deyName">
                            <span class="title">{{ $t('order.logisticsName')  }}：</span>
                            <span class="text">{{this.dataForm.refundDelivery.deyName }}</span>
                          </div>
                          <div
                            v-if="this.dataForm.refundDelivery && this.dataForm.refundDelivery.deyNu" class="text-width-item">
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
                      <span>{{ $t('order.logisticsCertificate') }}</span>
                    </div>
                    <div class="buyers-info">
                      <div class="detail02">
                        <imgs-upload v-model="refundDeliveryPhotos" :disabled="true" :modal="true" :prompt="false"/>
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
                <el-table
                  :data="prodList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row"
                  :row-style="{ height:'82px'}">
                  <el-table-column prop :label="this.$i18n.t('order.refundGoods')" width="280">
                    <template slot-scope="scope">
                      <div class="prod-info">
                        <!-- <img :src="resourcesUrl + scope.row.pic" class="prod-img" /> -->
                        <prod-pic
                          height="60"
                          width="60"
                          :pic="scope.row.pic"
                        ></prod-pic>
                        <div class="con">
                          <span class="gift-icon" v-if="scope.row.giveawayOrderItemId">{{ $t("order.giveawayPord") }}</span>
                          <span>{{ scope.row.prodName }}</span>
                          <span class="sku">{{ scope.row.skuName }}</span>
                        </div>
                      </div>
                      <!-- 赠品 -->
                      <div v-if="dataForm.orderItems.length > 1" class="gift-prod">
                        <div v-for="item in scope.row.giveawayList" class="item">
                          <span class="name">{{'【' + $t("order.giveawayPord") + '】'}}{{item.prodName}}</span>
                          <span class="num">×{{item.prodCount}}</span>
                        </div>
                      </div>
                      <!-- / 赠品 -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    :label="this.$i18n.t('order.unitPrice')">
                    <template slot-scope="scope">
                      <span>￥{{ scope.row.price | price }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    :label="this.$i18n.t('order.quantity')">
                    <template slot-scope="scope">
                      <span>{{scope.row.prodCount }}</span>
                      <!-- <span v-if="dataForm.refundType === 1">{{scope.row.prodCount }}</span>
                      <span v-if="dataForm.refundType === 2">{{dataForm.goodsNum }}</span> -->
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="productTotalAmount"
                    :label="this.$i18n.t('order.prodTotalPrice')">
                    <template slot-scope="scope">
                      <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">￥{{scope.row.productTotalAmount | price }}</span>
                      <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">￥{{
                        bigProductTotalAmount(
                          scope.row.price,
                          dataForm.goodsNum
                        ) | price }}</span>
                      <span v-if="scope.row.giveawayOrderItemId">￥{{scope.row.giveawayAmount | price }}</span></template>
                  </el-table-column>

                  <el-table-column
                    prop="actualTotal"
                    :label="this.$i18n.t('order.actualAmount')">
                    <template slot-scope="scope">
                      <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">￥{{scope.row.actualTotal | price }}</span>
                      <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">￥{{
                        bigActualTotal(
                          scope.row.actualTotal,
                          scope.row.prodCount
                        ) | price
                      }}</span>
                      <span v-if="scope.row.giveawayOrderItemId">-</span>
                      <el-tag
                        v-if="scope.row.shareReduce > 0 && !scope.row.giveawayOrderItemId"
                        type="danger" size="mini" effect="dark">{{ $t("order.discount") }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="dataForm.refundType === 2"
                    prop="productTotalAmount"
                    :label="this.$i18n.t('order.returnAmount')">
                    <template slot-scope="scope">
                      <!-- <span>{{dataForm.refundAmount}}</span> -->
                      <span v-if="!scope.row.giveawayOrderItemId">{{
                        dataForm.refundAmount +
                        $t("admin.dollar") +
                        " + " +
                        dataForm.refundScore +
                        $t("order.integral") }}</span>
                      <span v-if="scope.row.giveawayOrderItemId">-</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div v-if="dataForm.returnMoneySts === 1" class="sellerRemark">
                <div class="remark-title">{{ $t("order.applyForApproval") }}：</div>
                <div class="remark-content">
                  <el-radio-group v-model="isAgreeRefund">
                    <!-- <el-radio :label="1">待审核</el-radio> -->
                    <el-radio :label="2">{{dataForm.applyType === 1 ? $t("order.agreeToRefundA") : $t("order.agree") }}</el-radio>
                    <el-radio :label="3">{{$t("order.disagree") }}</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <div class="sellerRemark" v-if="dataForm.applyType === 2 && isAgreeRefund === 2 && dataForm.returnMoneySts !== -1">
                <div class="remark-title" v-if="dataForm.refundDelivery">{{ $t("publics.deliveryAddr") }}：</div>
                <div v-if="dataForm.returnMoneySts === 1" class="remark-content">
                  <el-select
                    v-model="dataForm.refundAddrId"
                    size="small"
                    style="width: 350px"
                    :placeholder="this.$i18n.t('tip.select')"
                    @change="$forceUpdate()">
                    <el-option
                      v-for="item in addrList"
                      :key="item.refundAddrId"
                      :label="item.receiverName+'，'+item.receiverMobile+'，'+item.province + item.city + item.area + item.addr"
                      :value="item.refundAddrId"></el-option>
                  </el-select>
                  <!--            新建/刷新-->
                  <div class="default-btn text-btn"
                              @click="refreshChange">{{$t('admin.refresh')}}</div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="default-btn text-btn"
                              @click.stop="addOrUpdateHandle()">{{$t('admin.newConstruction')}}</div>
                </div>
                <div v-if="dataForm.refundDelivery.receiverAddr" class="remark-content">
                  {{ dataForm.refundDelivery.receiverName +'，'+dataForm.refundDelivery.receiverMobile+'，'+dataForm.refundDelivery.receiverAddr}}
                </div>
              </div>

              <div
                v-if="dataForm.shipTime &&!dataForm.cancelTime &&!dataForm.rejectTime" class="sellerRemark">
                <div class="remark-title">{{ $t("order.returnStatus") }}：</div>
                <div class="remark-content">
                  <el-radio-group v-model="isReceiver" :disabled="dataForm.returnMoneySts !== 3">
                    <!-- <el-radio :label="1">待审核</el-radio> -->
                    <el-radio :label="1">{{$t("order.received") }}</el-radio>
                    <el-radio :label="0">{{$t("order.unreceived") }}</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <div
                v-if="dataForm.shipTime &&!dataForm.cancelTime &&!dataForm.rejectTime" class="sellerRemark">
                <div class="remark-title">{{ $t("order.returnRequest") }}：</div>
                <div class="remark-content">
                  <el-radio-group v-model="isAgreeRefund" :disabled="dataForm.returnMoneySts !== 3">
                    <!-- <el-radio :label="1">待审核</el-radio> -->
                    <el-radio :label="2">{{$t("order.agreeToRefundA") }}</el-radio>
                    <el-radio :label="3">{{$t("order.refusalToRefund") }}</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <div class="sellerRemark" v-if="isAgreeRefund === 3">
                <div class="input-bar">
                  <div class="remark-title denial" >{{ $t('order.denialReason') }}：</div>
                  <el-input
                    type="textarea"
                    style="width: 100%;outline-style: none;"
                    v-model="dataForm.rejectMessage"
                    maxlength="250"
                    show-word-limit
                  ></el-input>
                </div>
              </div>
              <div class="sellerRemark">
                <div v-if="dataForm.returnMoneySts !== 1" style="display: flex;align-items: baseline;">
                  <div class="remark-title" v-if="dataForm.sellerMsg">{{ $t('order.merchantNotes') }}：</div>
                  <div class="remark-content" v-if="dataForm.sellerMsg">{{ dataForm.sellerMsg }}</div>
                </div>
                <div class="input-bar" v-else>
                  <div class="remark-title">{{ $t('order.merchantNotes') }}：</div>
                  <el-input
                    type="textarea"
                    style="width: 100%;outline-style: none;"
                    v-model="dataForm.sellerMsg"
                    :disabled="dataForm.returnMoneySts !== 1"
                    maxlength="250"
                    show-word-limit
                  >
                  </el-input>
                </div>
              </div>

              <div class="btn-bar">
                <!-- 仅退款的时候进行的处理操作 -->
                  <div
                    v-if="isAuth('admin:orderRefund:update') && dataForm.returnMoneySts === 1"
                    class="default-btn primary-btn"
                    @click="checkHandel()"
                    >{{ $t("order.confirmTreatment") }}</div
                  >
                  <!-- 退货退款的时候进行的处理操作 -->
                  <div
                    v-if="isAuth('admin:orderRefund:update') && dataForm.returnMoneySts === 3"
                    class="default-btn primary-btn"
                    @click="returnMoneyHandle()"
                    >{{ $t("order.confirmTreatment") }}</div
                  >
              </div>
            </div>
          </div>

          <div class="order-log">
            <div class="log-title">
              <span>{{ $t("order.refundLog") }}</span>
            </div>
            <div class="log-cont">
              <div v-if="dataForm.applyTime">
                <span
                  >{{ dataForm.applyTime }}
                  {{ $t("order.submitARefundRequestWa") }}</span
                >
              </div>
              <div
                v-if="dataForm.applyType === 2 && dataForm.handelTime  && !dataForm.rejectTime"
              >
                <span
                  >{{ dataForm.handelTime }}
                  {{ $t("order.merchantHasProcessedWaBuy") }}</span
                >
              </div>

              <div
                v-if="dataForm.applyType === 1 && dataForm.handelTime  && !dataForm.rejectTime"
              >
                <span
                  >{{ dataForm.handelTime }}
                  {{ $t("order.merchantHasProcessedWaSh") }}</span
                >
              </div>
              <div v-if="dataForm.shipTime">
                <span
                  >{{ dataForm.shipTime }}
                  {{ $t("order.buyerShipmentWaPro") }}</span
                >
              </div>
              <div v-if="dataForm.receiveTime" >
                <span
                  >{{ dataForm.receiveTime }}
                  {{ $t("order.merchantHasReceivedWaShGr") }}</span
                >
              </div>
              <div v-if="dataForm.decisionTime">
                <span
                  >{{ dataForm.decisionTime }}
                  {{ $t("order.agreeToRefund") }}</span
                >
              </div>
              <div v-if="dataForm.refundTime">
                <span
                  >{{ dataForm.refundTime }}
                  {{ $t("order.refundsuccessfully") }}</span
                >
              </div>

              <div
                v-if="dataForm.handelTime && dataForm.returnMoneySts === -1  && !dataForm.rejectTime"
              >
                <span
                  >{{ dataForm.updateTime }}
                  {{ $t("order.refundClosed") }}</span
                >
              </div>
              <div
                v-if="dataForm.returnMoneySts === -1 && dataForm.cancelTime"
              >
                <span
                  >{{ dataForm.cancelTime }} {{ $t("order.refundClosed") }}
                  {{ $t("order.buyerHasWithdrawn") }}</span
                >
              </div>
              <div
                v-if="dataForm.returnMoneySts === -1 && dataForm.rejectTime"
              >
                <span
                  >{{ dataForm.rejectTime }} {{ $t("order.refundFailed") }}
                  {{ $t("order.merchantRejected") }}</span
                >
              </div>
              <div
                v-if="dataForm.returnMoneySts === -1 && dataForm.rejectTime && dataForm.rejectMessage"
                class="reject-info"
              >
                <div class="reason">{{$t('order.denialReason')}}：</div>
                <div class="content"
                  >{{ dataForm.rejectMessage }} </div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <!-- 弹窗, 新增 / 修改 -->
    <or-add-or-update
      v-if="orAddOrUpdateVisible"
      ref="orAddOrUpdate"
      @refreshDataList="orRefreshChange"
    ></or-add-or-update>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getRefundAddrList"></add-or-update>
  </div>
</template>

<script>
import ImgsUpload from '@/components/imgs-upload'
import OrAddOrUpdate from './order-addr'
import AddOrUpdate from '../shop/refundAddr-add-or-update'
import Big from 'big.js'
import ProdPic from '@/components/prod-pic'

export default {
  filters: {
    price (value) {
      if (!value) {
        return 0.00
      }
      return Number(value).toFixed(2)
    }
  },
  data () {
    return {
      visible: false,
      addrList: [],
      dataForm: {
        // refundId: '',
        // shopId: '',
        // orderId: '',
        // orderNumber: '',
        // orderAmount: '',
        // orderItemId: '',
        // refundSn: '',
        // flowTradeNo: '',
        // outRefundNo: '',
        // payType: '',
        // payTypeName: '',
        // userId: '',
        // goodsNum: '',
        // refundAmount: '',
        // applyType: '',
        // refundSts: '',
        // returnMoneySts: '',
        // applyTime: '',
        // handelTime: '',
        // refundTime: '',
        // photoFiles: '',
        // buyerMsg: '',
        // sellerMsg: '',
        // shipTime: '',
        // receiveTime: '',
        // receiveMessage: '',
        // rejectMessage: '',
        // refundAddrId: null,
        // refundApplySts: null,
        // refundDelivery: {
        //   receiverAddr: '',
        //   receiverName: '',
        //   receiverMobile: '',
        //   receiverTelephone: ''
        // }
      },
      refundDeliveryPhotos: [],
      deliveryDto: null,
      receiveMessage: '',
      isAgreeReceiver: '',
      isAgreeRefund: 2,
      isReceiver: 0,
      isPop: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      orAddOrUpdateVisible: false,
      addOrUpdateVisible: false,
      devyVisible: false,
      refundAddr: '',
      deyNu: '',
      deyName: '',
      senderMobile: '',
      senderRemarks: '',
      isProcessing: false, // 是否正在处理订单
      isUploadInvoice: false,

      // 商品列表
      prodList: []
    }
  },
  components: {
    OrAddOrUpdate,
    AddOrUpdate,
    ImgsUpload,
    ProdPic
  },
  watch: {
    visible: function () {
      if (!this.visible) {
        this.devyVisible = false
        this.orAddOrUpdateVisible = false
      }
    }
  },
  computed: {
    onlyRefundStepsStatus: function () {
      let index = 0
      if (this.dataForm.handelTime) {
        index++
      }
      if (this.dataForm.cancelTime || this.dataForm.refundTime) {
        index += 2
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
      if ((this.dataForm.shipTime && this.dataForm.rejectTime) || this.dataForm.receiveTime || this.dataForm.returnMoneySts === 5) {
        index++
      }
      // if (this.dataForm.cancelTime || this.dataForm.refundTime || this.dataForm.rejectTime) {
      //   index++
      // }
      // 退款成功的情况下进度条也要加2
      if (this.dataForm.returnMoneySts === 5) {
        index += 2
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
    this.init(refundId)
  },
  methods: {
    init (id) {
      this.dataForm.refundId = id || 0
      // this.isReceiver = 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.refundDeliveryPhotos = []
      this.dataForm.photoFiles = []
      this.isPop = false
      this.receiveMessage = ''
      this.isAgreeRefund = 2
      if (this.dataForm.refundId) {
        this.$http({
          url: this.$http.adornUrl(`/order/refund/info/${this.dataForm.refundId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.deliveryDto = this.dataForm.deliveryDto
          if (this.dataForm.isReceiver) {
            this.isReceiver = 1
          } else {
            this.isReceiver = 0
          }
          if (this.dataForm.refundDelivery && this.dataForm.refundDelivery.imgs && this.dataForm.refundDelivery.imgs != null) {
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

          this.getRefundAddrList()
          this.getIsInvoiceUpload(data.orderNumber)
        })
      }
    },
    getIsInvoiceUpload (orderNumber) {
      this.$http({
        url: this.$http.adornUrl(`/m/orderInvoice/is_upload`),
        method: 'get',
        params: {
          orderNumber
        }
      }).then(({ data }) => {
        this.isUploadInvoice = data
      })
    },
    // 新增
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 刷新页面
    refreshChange () {
      this.getRefundAddrList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/order/refund/info/${this.dataForm.refundId}`),
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
      this.orAddOrUpdateVisible = true
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
        url: this.$http.adornUrl('/shop/refundAddr/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.addrList = data
        this.addrList.forEach((item) => {
          if (item.defaultAddr) {
            this.$set(this.dataForm, 'refundAddrId', item.refundAddrId)
          }
        })
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
     * 仅退款的时候，进行的退款处理操作
     * 提交处理
     */
    checkHandel () {
      if (this.isAgreeRefund === 2) {
        if (this.isUploadInvoice) {
          this.$confirm(this.$i18n.t('order.refundTip'), this.$i18n.t('resource.tips'), {
            confirmButtonText: this.$i18n.t('resource.confirm'),
            cancelButtonText: this.$i18n.t('resource.cancel'),
            type: 'warning'
          }).then(() => {
            if (this.dataForm.refundType === 2 && this.dataForm.applyType === 1 && this.dataForm.status === 2) {
              this.checkIsLastOrderItem(this.handelReturnMoney)
              return
            }
            this.handelReturnMoney()
          }).catch(() => {
          })
          return
        } else {
          if (this.dataForm.refundType === 2 && this.dataForm.applyType === 1 && this.dataForm.status === 2) {
            this.checkIsLastOrderItem(this.handelReturnMoney)
            return
          }
          this.handelReturnMoney()
        }
        return
      }
      this.handelReturnMoney()
    },
    handelReturnMoney () {
      let tempRefundAddrId = this.isAgreeRefund === 2 ? this.dataForm.refundAddrId : undefined
      if (this.isProcessing) {
        return
      }
      if (this.isAgreeRefund === 3 && (!this.dataForm.rejectMessage || !this.dataForm.rejectMessage.trim())) {
        return this.$message.error(this.$t('order.denialReason') + this.$t('publics.noNull'))
      }
      this.isProcessing = true
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
        // this.$emit('refreshDataList')
        this.init(this.dataForm.refundId)
        this.visible = false
        this.isProcessing = false
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
          }
        })
      }).catch(() => {
        this.isProcessing = false
      })
    },

    /**
     * 是否为最后一个退款项
     */
    checkIsLastOrderItem (fn) {
      this.$http({
        url: this.$http.adornUrl(`/order/refund/isLastRefund/`),
        method: 'get',
        params: this.$http.adornParams({
          refundSn: this.dataForm.refundSn
        })
      }).then(({ data }) => {
        if (data) {
          this.$confirm(this.$i18n.t('order.lastProdRefundTip').replace('[d]', this.dataForm.freightAmount.toFixed(2) + ' '), this.$i18n.t('resource.tips'), {
            confirmButtonText: this.$i18n.t('resource.confirm'),
            cancelButtonText: this.$i18n.t('resource.cancel'),
            type: 'warning'
          }).then(() => {
            fn()
          }).catch(() => {
          })
        } else {
          fn()
        }
      })
    },

    /**
     * 确定退款
     */
    returnMoneyHandle () {
      if (this.isProcessing) {
        return
      }
      if (this.isAgreeRefund === 3 && (!this.dataForm.rejectMessage || !this.dataForm.rejectMessage.trim() || this.dataForm.rejectMessage.trim() === '')) {
        return this.$message.error(this.$t('order.denialReason') + this.$t('publics.noNull'))
      }
      this.isProcessing = true
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
        this.isProcessing = false
        // this.$emit('refreshDataList')
        this.init(this.dataForm.refundId)
        this.visible = false
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
          }
        })
      }).catch(() => {
        this.isProcessing = false
      })
    },
    /**
     * 退款请求（发放退款）
     */
    refundRequest (refundSn) {
      this.$http({
        url: this.$http.adornUrl(`/order/refund/refundRequest`),
        method: 'put',
        data: { 'refundSn': refundSn }
      }).then(res => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            // this.$emit('refreshDataList')
            this.init(this.dataForm.refundId)
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
      return new Big(a).div(b).times(this.dataForm.goodsNum).toFixed(2)
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

  .order-info .detail-title {
    line-height: 19px;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333333;
  }
  .order-info .logistics-box {
    height: 220px;
    overflow-y: auto;
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

  .order-info .logistics-box .left-line {
    border-left: none;
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

  .order-info .detail-title img {
    height: 18px !important;
    width: 18px !important;
  }

  .order-info .order-details {
    width: 620px;
    // height: 240px;
    padding-left: 45px;
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
    display: flex;
  }
  .text-width .text-width-item .text {
    display: inline-block;
    max-width: 250px;
    line-height: 27px;
    word-break: break-word;
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
    > div {
      margin-bottom: 10px;
    }
    > div:last-child {
      margin-bottom: 0;
    }
    .reject-info {
      margin-left: 134px;
      display: flex;
      .content {
        flex: 1;
        word-break: break-word;
        display: flex;
        align-items: center;
      }
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
      // display: flex;
      // justify-content: center;
      // align-items: center;
      box-sizing: border-box;
      padding: 20px 45px;
      border: 1px solid #E8E9EC;
      border-right: none;
      .item {
        display: flex;
        margin-bottom: 15px;
        &:last-child {
          margin-bottom: 0;
        }
        .text {
          color: #155BD4;
        }
      }
    }
  }
  .refund-progress {
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
  }
  .remark-title {
    display: inline-block;
    min-width: 70px;
    display: flex;
    align-items: center;
  }
  .denial::before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
  .remark-content{
    display: inline-block;
    word-break: break-word;
  }

  .input-bar {
    display: inline-block;
    width: 100%;
    .remark-title {
      margin-bottom: 10px;
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

.remark-content ::v-deep .el-input__inner{
  padding-right: 20px !important;
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
    .con {
      flex: 1;
      margin-left: 3%;
    }
    .gift-icon {
      display: inline-block;
      padding: 4px;
      border-radius: 4px;
      background: #e43130;
      color: #fff;
      font-size: 13px;
      margin-right: 5px;
      line-height: 1em;
    }
    .con .sku {
      margin-left: 3%;
      color: #999;
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

</style>



