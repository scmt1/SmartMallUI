<template>
  <div class="mod-order-order">
    <el-tabs v-model="tabActive" @tab-click="tabHandleClick">
      <el-tab-pane v-if="shopId !== carShop && shopId !== memberShop" label="线上订单" name="first">
        <div class="search-bar">
          <el-form
                  :inline="true"
                  :model="dataForm"
                  @keyup.enter.native="getDataList(this.page)"
                  size="small"
          >
            <div class="input-row">
              <!-- &nbsp;&nbsp;&nbsp; -->
              <el-form-item :label="this.$i18n.t('order.number') + ':'" :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-input
                        v-model="dataForm.orderNumber"
                        :placeholder="this.$i18n.t('order.number')"
                        clearable
                        size="small"
                ></el-input>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('order.orderType') + ':'" :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-select
                        v-model="dataForm.orderType"
                        clearable
                        :placeholder="this.$i18n.t('order.orderType')"
                        size="small"
                >
                  <el-option
                          v-for="item in orderType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="this.$i18n.t('order.orderMold') + ':'" :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-select
                        v-model="dataForm.orderMold"
                        clearable
                        :placeholder="this.$i18n.t('order.orderMold')"
                        size="small"
                >
                  <el-option
                          v-for="item in orderMold"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="this.$i18n.t('group.orderStatus') + ':'"  :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-select
                        v-model="status"
                        clearable
                        :placeholder="this.$i18n.t('order.statusMsg')"
                        size="small"
                        @change="orderStatus"
                >
                  <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('order.theRecipientSName') + ':'"  :label-width=" lang === 'en' ? '145px' : '100px'">
                <el-input
                        v-model="dataForm.receiver"
                        :placeholder="this.$i18n.t('order.pleaseEnRecipName')"
                        clearable
                        size="small"
                ></el-input>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('shop.contactTel') + ':'"  :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-input
                        v-model="dataForm.mobile"
                        :placeholder="this.$i18n.t('order.pleaseEnterNumber')"
                        clearable
                        size="small"
                ></el-input>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('order.paymentMethod') + ':'"  :label-width=" lang === 'en' ? '145px' : '85px'">
                <template>
                  <el-select
                          v-model="dataForm.payType"
                          size="small"
                          clearable
                          :placeholder="this.$i18n.t('order.paymentMethod')"
                  >
                    <el-option
                            v-for="item in payType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <!-- &nbsp;&nbsp;&nbsp; -->
              <el-form-item :label="this.$i18n.t('order.afterSalesStatus') + ':'"  :label-width=" lang === 'en' ? '145px' : '85px'">
                <template>
                  <el-select
                          v-model="dataForm.refundStatus"
                          clearable
                          :placeholder="this.$i18n.t('order.afterSalesStatus')"
                          size="small"
                  >
                    <el-option
                            v-for="item in refund"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('order.logisticsType') + ':'"  :label-width=" lang === 'en' ? '145px' : '85px'">
                <template>
                  <el-select
                          v-model="dataForm.dvyType"
                          clearable
                          :placeholder="this.$i18n.t('order.logisticsType')"
                          size="small"
                  >
                    <el-option
                            v-for="item in dvyType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('station.stationNames') + ':'"  :label-width=" lang === 'en' ? '145px' : '100px'">
                <el-input
                        v-model="dataForm.stationName"
                        :placeholder="this.$i18n.t('station.stationNames')"
                        clearable
                        size="small"
                ></el-input>
              </el-form-item>
              <!-- &nbsp;&nbsp;&nbsp; -->
              <el-form-item :label="this.$i18n.t('order.createTime') + ':' "   :label-width=" lang === 'en' ? '145px' : '85px'">
                <el-date-picker
                        size="small"
                        v-model="dateRange"
                        type="datetimerange"
                        :range-separator="this.$i18n.t('time.tip')"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :start-placeholder="this.$i18n.t('time.start')"
                        :end-placeholder="this.$i18n.t('time.end')"
                ></el-date-picker
                >
                <div class="default-btn" style="margin-left: 20px;" :class="{ 'is-active': timeActive === 1 }" @click="setDateRange(1)">{{
                  $t("time.t")
                  }}</div>
                <div class="default-btn" :class="{ 'is-active': timeActive === 2 }" @click="setDateRange(2)">{{
                  $t("time.y")
                  }}</div>
                <div class="default-btn" :class="{ 'is-active': timeActive === 3 }" @click="setDateRange(3)">{{
                  $t("time.n")
                  }}</div>
                <div class="default-btn" :class="{ 'is-active': timeActive === 4 }" @click="setDateRange(4)">{{
                  $t("temp.m")
                  }}</div>
              </el-form-item>
              <el-form-item>
                <div
                        class="default-btn primary-btn"
                        @click="searchChange(true)"
                >{{ $t("order.query") }}</div
                >
                <div
                        class="default-btn"
                        @click="getSoldExcel()"
                >{{ $t("formData.export") }}</div
                >
                <div
                        class="default-btn"
                        @click="clear()"
                >{{ $t("shop.resetMap") }}</div
                >
                <div
                        v-if="isAuth('order:order:exportunorder')"
                        class="default-btn"
                        @click="uploadSpu"
                >{{ $t("order.BulkShipping") }}</div
                >
                <div
                        class="default-btn primary-btn"
                        @click.stop="orderStatisticClick()">
                  {{orderStatisticName}}
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-if="orderStatisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);margin-bottom: 20px;">
          <div class="statistics-list">
            <div class="item">
              <div class="title">实际收款金额</div>
              <div class="amount"  style="color: rgb(26, 102, 255);"><span
                      class="amount-num">{{orderStatistic.payAmount ? orderStatistic.payAmount : 0}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{orderStatistic.payCount ? orderStatistic.payCount : 0}}笔</span>
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">今日订单</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{orderStatistic.todayAmount ? orderStatistic.todayAmount : 0}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{orderStatistic.todayCount ? orderStatistic.todayCount : 0}}笔</span>
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">昨日订单</div>
              <div class="amount"  style="color: #ffc405;">
                <span class="amount-num">{{orderStatistic.yesterdayAmount ? orderStatistic.yesterdayAmount : 0}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{orderStatistic.yesterdayCount ? orderStatistic.yesterdayCount : 0}}笔</span>
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">退款订单</div>
              <div class="amount"  style="color: red;">
                <span class="amount-num">{{orderStatistic.refundAmount ? orderStatistic.refundAmount : 0}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{orderStatistic.refundCount ? orderStatistic.refundCount : 0}}笔</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="content">
            <!-- 导航 -->
            <div class="order-status-nav clearfix">
              <ul class="nav-list clearfix">
                <li
                        :class="['nav-item', activeName == 0 ? 'selected' : '']"
                        data-sts="0"
                        @click="selectNav($event)"
                >
                  {{ $t('time.a') }}
                </li>
                <li
                        :class="['nav-item', activeName == 1 ? 'selected' : '']"
                        data-sts="1"
                        @click="selectNav($event)"
                >
                  {{ $t('order.pendingPayment') }}
                </li>
                <li
                        :class="['nav-item', activeName == 2 ? 'selected' : '']"
                        data-sts="2"
                        @click="selectNav($event)"
                >
                  {{ $t('order.toBeShipped') }}
                </li>
                <li
                        :class="['nav-item', activeName == 3 ? 'selected' : '']"
                        data-sts="3"
                        @click="selectNav($event)"
                >
                  {{ $t("order.pendingReceipt") }}
                </li>
                <li
                        :class="['nav-item', activeName == 5 ? 'selected' : '']"
                        data-sts="5"
                        @click="selectNav($event)"
                >
                  {{ $t("order.successfulTransaction") }}
                </li>
                <li
                        :class="['nav-item', activeName == 6 ? 'selected' : '']"
                        data-sts="6"
                        @click="selectNav($event)"
                >
                  {{ $t("order.transactionFailed") }}
                </li>
                <li
                        :class="['nav-item', activeName == 7 ? 'selected' : '']"
                        data-sts="7"
                        @click="selectNav($event)"
                >
                  {{ $t("group.waitGroup") }}
                </li>
              </ul>
              <ul class="nav-right"></ul>
            </div>

            <!-- 列标题 -->
            <div :class="['tit']">
              <el-row style="width: 100%">
                <el-col :span="6" id="prod-info-title">
                  <span class="item product">{{ $t("temp.prodInfo") }}</span>
                </el-col>
                <el-col :span="4" id="price-title" class="transaction-price">
                  <span class="item">{{ $t("order.transaQuantity") }}</span>
                </el-col>
                <el-col :span="3" class="column-title">
                  <span class="item">{{ $t("order.actualPaymentAmount") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("order.paymentMethod") }}</span>
                </el-col>
                <el-col :span="3" class="column-title">
                  <span class="item">{{ $t("order.buyerConsignee") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("group.orderStatus") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("order.afterSalesStatus") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("publics.operating") }}</span>
                </el-col>
              </el-row>
            </div>
            <div :class="['tit', 'fixed-top']" v-show="showHeadScroll">
              <el-row style="width: 100%">
                <el-col :span="6" id="prod-info-title">
                  <span class="item product">{{ $t("temp.prodInfo") }}</span>
                </el-col>
                <el-col :span="4" id="price-title" class="transaction-price">
                  <span class="item">{{ $t("order.transaQuantity") }}</span>
                </el-col>
                <el-col :span="3" class="column-title">
                  <span class="item">{{ $t("order.actualPaymentAmount") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("order.paymentMethod") }}</span>
                </el-col>
                <el-col :span="3" class="column-title">
                  <span class="item">{{ $t("order.buyerConsignee") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("group.orderStatus") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("order.afterSalesStatus") }}</span>
                </el-col>
                <el-col :span="2" class="column-title">
                  <span class="item">{{ $t("publics.operating") }}</span>
                </el-col>
              </el-row>
            </div>

            <div
                    class="prod"
                    v-for="order in dataList"
                    :key="order.orderId"
            >
              <div class="prod-tit">
                <span class="order-number">{{ $t("order.number") }}:{{ order.orderNumber }}</span>
                <span class="order-time">{{ $t("order.createTime") }}:{{ order.createTime }}</span>
                <!-- <span>店铺名称：{{order.shopName}}</span> -->
                <!-- <span>买家：19999999999</span>
                <span >联系电话：19999999999</span>-->
              </div>
              <div class="prod-cont">
                <el-row style="width: 100%">
                  <el-col :span="10" style="height: 100%">
                    <div class="item prod-item">
                      <div
                              class="items name"
                              v-for="orderItem in order.orderItems"
                              :key="orderItem.orderItemId"
                      >
                        <!-- 商品信息 -->
                        <div class="order-prod-item-info">
                          <div class="info">
                            <div class="prod-image">
                              <prod-pic
                                      height="60"
                                      width="60"
                                      :pic="orderItem.pic"
                              ></prod-pic>
                            </div>
                            <div class="prod-name">
                              <div class="prod-con">
                                <div class="prod-name-txt">
                                  {{ orderItem.prodName }}
                                </div>
                                <div v-if="orderItem.skuName" class="prod-name-sku">
                                  {{ orderItem.skuName }}
                                </div>
                                <div
                                        class="order-status"
                                        v-if="order.orderType === 1 || order.orderType === 2"
                                >
                                  {{
                                  order.orderType === 1
                                  ? $t("order.groupPurchaseOrder")
                                  : order.orderType === 2
                                  ? $t("order.spikeOrder")
                                  : ""
                                  }}
                                </div>
                                <div
                                        class="order-status"
                                        v-if="order.orderMold === 1"
                                >
                                  {{ $t("order.virtualOrder") }}
                                </div>
                                <div
                                        class="order-status"
                                        v-if="
                                !orderItem.returnMoneySts ||
                                orderItem.returnMoneySts < 0 ||
                                orderItem.returnMoneySts > 5
                              "
                                >
                                  {{
                                  orderItem.status === 0 && order.status === 2
                                  ? $t("order.pendingReceipt")
                                  : [
                                  "",
                                  $t("order.pendingPayment"),
                                  $t("order.toBeShipped"),
                                  $t("order.pendingReceipt"),
                                  "",
                                  $t("order.successfulTransaction"),
                                  $t("order.transactionFailed"),
                                  $t("group.waitGroup"),
                                  ][order.status]
                                  }}
                                </div>
                                <div class="order-status" v-else>
                                  {{
                                  [
                                  "",
                                  $t("order.buyerApplication"),
                                  $t("order.sellerAccepts"),
                                  $t("order.selShipment"),
                                  $t("order.sellerReceipt"),
                                  $t("order.refundSuccessfully"),
                                  ][orderItem.returnMoneySts]
                                  }}
                                </div>
                                <div
                                        class="order-status"
                                        v-if="order.dvyType === 2 || order.dvyType === 4"
                                >
                                  {{
                                  order.dvyType === 2
                                  ? $t("order.selfMention")
                                  : order.dvyType === 4
                                  ? $t("order.sameCityDelivery")
                                  : ""
                                  }}
                                </div>
                                <!-- <span class="prod-info">{{orderItem.skuName}}</span> -->
                                <div
                                        class="order-status"
                                        v-if="orderItem.preSaleTime !== null"
                                >
                                  {{ $t('order.EstimatedDeliveryTime') }}{{ orderItem.preSaleTime }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- 赠品信息 -->
                          <div v-if="orderItem.giveawayList" class="order-prod-item-give-con">
                            <div class="giveaway-item" v-for="(giveawayItem, giveIndex) in orderItem.giveawayList" :key="giveIndex">
                              <div class="giveaway-item-name"> 【{{$i18n.t('order.giveawayPord')}}】 {{giveawayItem.prodName}}</div>
                              <div class="giveaway-item-sku-count">{{giveawayItem.skuName || ''}} x{{giveawayItem.prodCount}}</div>
                            </div>
                          </div>
                        </div>
                        <div class="prod-price">
                          <span>{{ orderItem.price.toFixed(2) }}</span>
                          <span
                          >{{ orderItem.prodCount
                        }}{{ $t("marketing.item") }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="3" style="height: 100%">
                    <div class="item">
                      <div>
                    <span class="totalprice"
                    >{{ order.actualTotal.toFixed(2)}}
                      </span
                      >
                        <span
                                class="totalprice"
                                v-if="order.score && order.score > 0"
                        >+ {{ order.score }}{{ $t("order.integral") }}</span
                        >
                        <span class="totalprice" v-if="order.freightAmount && order.freightAmount - order.platformFreeFreightAmount > 0"
                        >（{{ $t("order.includingFreight") }}：{{
                        (order.freightAmount - order.platformFreeFreightAmount).toFixed(2)
                      }}）</span
                        >
                        <br />
                        <span
                        >{{ $t("order.total") }}{{ order.productNums
                      }}{{ $t("marketing.item") }}</span
                        >
                        <br />
                        <div
                                class="default-btn text-btn"
                                @click="editAmount(order)"
                                v-if="order.status === 1"
                        >{{ $t("order.modifyTheAmount") }}</div
                        >
                      </div>
                    </div>
                  </el-col>
                  <!-- 支付方式 -->
                  <el-col :span="2" style="height: 100%">
                    <div class="item">
                      <div>
                    <span v-if="(!order.payType && order.payType != 0) || order.status === 1">{{
                      $t("order.unpaid")
                    }}</span>
                        <span v-else>
                      {{
                        [
                          $t("order.pointsPayment"),
                          $t("order.wecProPay"),
                          $t("order.alipayPCPayment"),
                          $t("order.wechatScanCodePayment"),
                          $t("order.wechatH5Payment"),
                          $t("order.weclAccountPay"),
                          $t("order.alipayH5Payment"),
                          $t("order.alipayAPPPayment"),
                          $t("order.wechatAPPPayment"),
                          $t("order.balancePayment"),
                          $t("order.payPalPayment"),
                          '计全支付',
                          '现金支付',
                          '计全微信小程序支付',
                          '红云余额支付',
                          '提货卡支付',
                          '组合支付',
                        ][order.payType]
                      }}
                    </span>
                      </div>
                    </div>
                  </el-col>
                  <!-- 买家信息 -->
                  <el-col :span="3" style="height: 100%">
                    <div class="item">
                      <div class="buyer-info">
                        <div class="buyer-name">{{ order.receiverName }}</div>
                        <div class="buyer-phone">{{ order.receiverMobile }}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="2" style="height: 100%">
                    <div class="item">
                      <!-- <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span> -->
                      <span>
                    <span
                            v-if="order.status === 1"
                            size="small"
                            type="danger"
                    >{{ $t("order.pendingPayment") }}</span
                    >
                    <span
                            v-else-if="order.status === 2"
                            size="small"
                            type="danger"
                    >{{ $t("order.toBeShipped") }}</span
                    >
                    <span
                            v-else-if="order.status === 3"
                            size="small"
                            type="danger"
                    >{{ $t("order.pendingReceipt") }}</span
                    >
                    <span
                            v-else-if="order.status === 7"
                            size="small"
                            type="danger"
                    >{{ $t("group.waitGroup") }}</span
                    >
                    <span
                            v-else-if="order.status === 5"
                            size="small"
                            type="danger"
                    >{{ $t("order.successfulTransaction") }}</span
                    >
                    <span v-else-if="order.status === 6" size="small">{{
                      $t("order.transactionFailed")
                    }}</span>
                  </span>
                    </div>
                  </el-col>
                  <el-col :span="2" style="height: 100%">
                    <div class="item">
                      <span v-if="order.refundStatus === 1">{{ $t("order.refundApplication") }}</span>
                      <span v-else-if="order.refundStatus === 2">{{ $t("order.refundsuccessfully") }}</span>
                      <span v-else-if="order.refundStatus === 3">{{ $t("order.partialRefundSucc") }}</span>
                      <span v-else-if="order.refundStatus === 4">{{ $t("order.refundFailed") }}</span>
                      <span v-else>{{$t("order.noAfterSales")}}</span>
                    </div>
                  </el-col>
                  <el-col :span="2" style="height: 100%">
                    <div class="item">
                      <div class="operate">
                        <!-- <button onclick="">打印订单</button><br> -->
                        <div
                                v-if="isAuth('order:get:info')"
                                class="default-btn text-btn operate-btn"
                                @click="addOrUpdateHandle(order.orderNumber)"
                        >{{ $t("order.seeDetails") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                @click="toImbox(order)"
                        >{{ $t("order.contactBuyer") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                v-if="
                        isAuth('order:delivery:orderItemsDelivery') &&
                        order.status == 3 &&
                        (!order.refundStatus || order.refundStatus > 2) &&
                        order.dvyType === 1
                      "
                                @click="reviseLogistics(order.orderNumber)"
                        >{{ $t("order.modifyLogistics") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                v-if="isAuth('order:delivery:orderItemsDelivery') && order.status === 2 && order.dvyType !== 2 && order.orderMold !== 1"
                                @click="changeOrder(order)"
                        >{{ $t("order.delivery") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                v-if="isAuth('admin:station:orderItemsDelivery') && order.status === 2 && order.dvyType === 2"
                                @click="stationOrder(order)"
                        >{{ $t("order.pickUp") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                v-if="isAuth('order:virtual:update') && (!order.refundStatus || order.refundStatus > 2)
                      && order.orderMold === 1 && order.writeOffNum !== 0 && (order.status === 3 ||order.status === 5)
                      && order.writeOffCodes &&  order.writeOffCodes.length > 0 "
                                @click="stationOrder(order)"
                        >{{ $t("order.Writeoffs") }}</div
                        >
                        <div
                                class="default-btn text-btn operate-btn"
                                @click="refundRoute(order.orderNumber)"
                                v-if="isAuth('admin:orderRefund:update') && order.refundStatus"
                        >{{ $t("order.refundInformation") }}</div
                        >
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <!-- <div class="remark">
                <div class="buyer-remark">
                  <span>备注:{{order.remarks}}</span>
                </div>
              </div>-->
            </div>
            <div class="empty" v-if="!dataList.length">
              {{ $t("order.noData") }}
            </div>
          </div>
        </div>
        <el-pagination
                v-if="dataList.length"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                :total="page.total"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane v-if="shopId !== carShop && shopId !== memberShop" label="线下订单" name="second">
        <div class="search-bar">
          <el-form
                  :inline="true"
                  :model="offlineDataForm"
                  @keyup.enter.native="getOfflinePaymentOrder(this.offlinePage)"
                  size="small"
          >
            <el-form-item label="支付时间">
              <el-date-picker
                      size="small"
                      v-model="offlineDateRange"
                      type="daterange"
                      :range-separator="this.$i18n.t('time.tip')"
                      value-format="yyyy-MM-dd"
                      :start-placeholder="this.$i18n.t('time.start')"
                      :end-placeholder="this.$i18n.t('time.end')"
              ></el-date-picker
              >
            </el-form-item>
            <el-form-item label="订单状态">
              <template>
                <el-select
                        v-model="offlineDataForm.state"
                        clearable
                        placeholder="订单状态"
                        size="small"
                >
                  <el-option v-for="item in stateList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="支付方式">
              <template>
                <el-select
                        v-model="offlineDataForm.wayCode"
                        clearable
                        placeholder="支付方式"
                        size="small"
                >
                  <el-option
                          v-for="item in payWayList"
                          :key="item.wayCode"
                          :label="item.wayName"
                          :value="item.wayCode"
                  ></el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item>
              <div
                      class="default-btn primary-btn"
                      @click="searchOfflineChange(true)"
              >{{ $t("order.query") }}</div
              >
              <div
                      class="default-btn"
                      @click="offlineClear()"
              >{{ $t("shop.resetMap") }}</div
              >
              <div
                      class="default-btn primary-btn"
                      @click.stop="offlineStatisticClick()">
                {{offlineStatisticName}}
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="offlineStatisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
          <div class="statistics-list">
            <div class="item">
              <div class="title">实际收款金额</div>
              <div class="amount"  style="color: rgb(26, 102, 255);"><span
                      class="amount-num">{{offlineStatistic.actualAmount}}</span>元
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">成交订单</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{offlineStatistic.payAmount}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{offlineStatistic.payCount}}笔</span>
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">手续费金额</div>
              <div class="amount">
                <span class="amount-num">{{offlineStatistic.mchFeeAmount}}</span>元
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">退款订单</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{offlineStatistic.refundAmount}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{offlineStatistic.refundCount}}笔</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <el-table
                  v-loading="offlineOrderLoading"
                  ref="offlineOrderListTable"
                  :data="offlineOrderList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  style="width: 100%">
            <el-table-column
                    fixed
                    prop="payOrderId"
                    width="250"
                    label="订单号">
              <template slot-scope="scope">
                <p style="margin: 5px 0;">
                  <span>{{scope.row.payOrderId}}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="amount"
                    label="支付金额"
            >
              <template slot-scope="scope">
                <span>￥{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="mchName"
                    label="商户名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="wayCode"
                    label="支付方式">
              <template slot-scope="scope">
                <span v-if="scope.row.wayCode === 'AUTO_BAR'">条码聚合支付</span>
                <span v-if="scope.row.wayCode === 'ALI_BAR'">支付宝条码支付</span>
                <span v-if="scope.row.wayCode === 'ALI_JSAPI'">支付宝生活号</span>
                <span v-if="scope.row.wayCode === 'ALI_LITE'">支付宝小程序支付</span>
                <span v-if="scope.row.wayCode === 'ALI_APP'">支付宝app支付</span>
                <span v-if="scope.row.wayCode === 'ALI_PC'">支付宝电脑网站支付</span>
                <span v-if="scope.row.wayCode === 'ALI_WAP'">支付宝wap支付</span>
                <span v-if="scope.row.wayCode === 'ALI_QR'">支付宝二维码付款</span>
                <span v-if="scope.row.wayCode === 'YSF_BAR'">云闪付条码支付</span>
                <span v-if="scope.row.wayCode === 'YSF_JSAPI'">云闪付服务窗支付</span>
                <span v-if="scope.row.wayCode === 'WX_JSAPI'">微信公众号</span>
                <span v-if="scope.row.wayCode === 'WX_LITE'">微信小程序支付</span>
                <span v-if="scope.row.wayCode === 'WX_BAR'">微信条码支付</span>
                <span v-if="scope.row.wayCode === 'WX_H5'">微信H5支付</span>
                <span v-if="scope.row.wayCode === 'WX_NATIVE'">微信扫码支付</span>
                <span v-if="scope.row.wayCode === 'UP_APP'">银联App支付</span>
                <span v-if="scope.row.wayCode === 'UP_WAP'">银联手机网站支付</span>
                <span v-if="scope.row.wayCode === 'UP_QR'">银联二维码(主扫)</span>
                <span v-if="scope.row.wayCode === 'UP_BAR'">银联二维码(被扫)</span>
                <span v-if="scope.row.wayCode === 'UP_B2B'">银联企业网银支付</span>
                <span v-if="scope.row.wayCode === 'UP_PC'">银联网关支付</span>
                <span v-if="scope.row.wayCode === 'UP_JSAPI'">银联JS支付</span>
                <span v-if="scope.row.wayCode === 'PP_PC'">Paypal支付</span>
                <span v-if="scope.row.wayCode === 'SAND_H5'">杉德H5收银台</span>
                <span v-if="scope.row.wayCode === 'PRE_ORDER'">汇付斗拱预下单</span>
                <span v-if="scope.row.wayCode === 'HY_PAY'">红云余额支付</span>
                <span v-if="scope.row.wayCode === 'QR_CASHIER'">QR_CASHIER</span>
              </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="center"
                    prop="state"
                    width="120"
                    label="支付状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state === 0">订单生成</el-tag>
                <el-tag v-if="scope.row.state === 1" type="danger">支付中</el-tag>
                <el-tag v-if="scope.row.state === 2" type="success">支付成功</el-tag>
                <el-tag v-if="scope.row.state === 3" type="warning">支付失败</el-tag>
                <el-tag v-if="scope.row.state === 4" type="danger">已撤销</el-tag>
                <el-tag v-if="scope.row.state === 5" type="warning">已退款</el-tag>
                <el-tag v-if="scope.row.state === 6" type="info">订单关闭</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="center"
                    prop="createdAt"
                    width="180"
                    label="创建日期">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
                style="margin-top: 10px;"
                v-if="offlineOrderList.length"
                @size-change="offlineOrderSizeChangeHandle"
                @current-change="offlineOrderCurrentChangeHandle"
                :current-page="offlinePage.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="offlinePage.pageSize"
                :total="offlinePage.total"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane v-if="shopId !== carShop && shopId !== memberShop" label="红云订单" name="hyOrder">
        <div class="search-bar">
          <el-form
                  :inline="true"
                  @keyup.enter.native="getHyOrder(this.hyOrderPage)"
                  size="small"
          >
            <el-form-item label="支付时间">
              <el-date-picker
                      size="small"
                      v-model="hyDateRange"
                      type="daterange"
                      :range-separator="this.$i18n.t('time.tip')"
                      value-format="yyyy-MM-dd"
                      :start-placeholder="this.$i18n.t('time.start')"
                      :end-placeholder="this.$i18n.t('time.end')"
              ></el-date-picker
              >
            </el-form-item>
            <el-form-item label="结算状态:">
              <el-select v-model="settlementStatus" clearable filterable placeholder="请选择">
                <el-option
                        label="未结算"
                        value="0">
                </el-option>
                <el-option
                        label="已结算"
                        value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div
                      class="default-btn primary-btn"
                      @click="searchHyChange(true)"
              >{{ $t("order.query") }}</div
              >
              <div
                      class="default-btn"
                      @click="hyClear()"
              >{{ $t("shop.resetMap") }}</div
              >
              <div
                      class="default-btn"
                      @click="downloadHyRecord()"
              >导出</div>
              <div
                      class="default-btn primary-btn"
                      @click.stop="hyStatisticClick()">
                {{hyStatisticName}}
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="hyStatisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
          <div class="statistics-list">
            <div class="item">
              <div class="title">实际收款金额</div>
              <div class="amount"  style="color: rgb(26, 102, 255);"><span
                      class="amount-num">{{hyStatistic.actualAmount}}</span>元
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">成交订单</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{hyStatistic.payAmount}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{hyStatistic.payCount}}笔</span>
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">手续费金额</div>
              <div class="amount">
                <span class="amount-num">{{hyStatistic.mchFeeAmount}}</span>元
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">退款订单</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{hyStatistic.refundAmount}}</span>元
              </div>
              <div class="detail">
                <span style="margin-right: 10px;">{{hyStatistic.refundCount}}笔</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <el-table
                  v-loading="hyOrderLoading"
                  ref="offlineOrderListTable"
                  :data="hyOrderList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  style="width: 100%">
            <el-table-column
                    fixed
                    prop="payOrderId"
                    width="250"
                    label="订单号">
              <template slot-scope="scope">
                <p style="margin: 5px 0;">
                  <span>{{scope.row.payOrderId}}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="amount"
                    label="支付金额"
            >
              <template slot-scope="scope">
                <span>￥{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="mchName"
                    label="商户名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="wayCode"
                    label="支付方式">
              <template slot-scope="scope">
                <span v-if="scope.row.wayCode === 'AUTO_BAR'">条码聚合支付</span>
                <span v-if="scope.row.wayCode === 'ALI_BAR'">支付宝条码支付</span>
                <span v-if="scope.row.wayCode === 'ALI_JSAPI'">支付宝生活号</span>
                <span v-if="scope.row.wayCode === 'ALI_LITE'">支付宝小程序支付</span>
                <span v-if="scope.row.wayCode === 'ALI_APP'">支付宝app支付</span>
                <span v-if="scope.row.wayCode === 'ALI_PC'">支付宝电脑网站支付</span>
                <span v-if="scope.row.wayCode === 'ALI_WAP'">支付宝wap支付</span>
                <span v-if="scope.row.wayCode === 'ALI_QR'">支付宝二维码付款</span>
                <span v-if="scope.row.wayCode === 'YSF_BAR'">云闪付条码支付</span>
                <span v-if="scope.row.wayCode === 'YSF_JSAPI'">云闪付服务窗支付</span>
                <span v-if="scope.row.wayCode === 'WX_JSAPI'">微信公众号</span>
                <span v-if="scope.row.wayCode === 'WX_LITE'">微信小程序支付</span>
                <span v-if="scope.row.wayCode === 'WX_BAR'">微信条码支付</span>
                <span v-if="scope.row.wayCode === 'WX_H5'">微信H5支付</span>
                <span v-if="scope.row.wayCode === 'WX_NATIVE'">微信扫码支付</span>
                <span v-if="scope.row.wayCode === 'UP_APP'">银联App支付</span>
                <span v-if="scope.row.wayCode === 'UP_WAP'">银联手机网站支付</span>
                <span v-if="scope.row.wayCode === 'UP_QR'">银联二维码(主扫)</span>
                <span v-if="scope.row.wayCode === 'UP_BAR'">银联二维码(被扫)</span>
                <span v-if="scope.row.wayCode === 'UP_B2B'">银联企业网银支付</span>
                <span v-if="scope.row.wayCode === 'UP_PC'">银联网关支付</span>
                <span v-if="scope.row.wayCode === 'UP_JSAPI'">银联JS支付</span>
                <span v-if="scope.row.wayCode === 'PP_PC'">Paypal支付</span>
                <span v-if="scope.row.wayCode === 'SAND_H5'">杉德H5收银台</span>
                <span v-if="scope.row.wayCode === 'PRE_ORDER'">汇付斗拱预下单</span>
                <span v-if="scope.row.wayCode === 'HY_PAY'">红云余额支付</span>
                <span v-if="scope.row.wayCode === 'QR_CASHIER'">QR_CASHIER</span>
              </template>
            </el-table-column>
            <el-table-column prop="settlementStatus" width="100" label="结算状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.settlementStatus === 0">未结算</el-tag>
                <el-tag v-if="scope.row.settlementStatus === 1" type="success">已结算</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="center"
                    prop="state"
                    width="120"
                    label="支付状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state === 0">订单生成</el-tag>
                <el-tag v-if="scope.row.state === 1" type="danger">支付中</el-tag>
                <el-tag v-if="scope.row.state === 2" type="success">支付成功</el-tag>
                <el-tag v-if="scope.row.state === 3" type="warning">支付失败</el-tag>
                <el-tag v-if="scope.row.state === 4" type="danger">已撤销</el-tag>
                <el-tag v-if="scope.row.state === 5" type="warning">已退款</el-tag>
                <el-tag v-if="scope.row.state === 6" type="info">订单关闭</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    align="center"
                    prop="createdAt"
                    width="180"
                    label="创建日期">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
                style="margin-top: 10px;"
                v-if="hyOrderList.length"
                @size-change="hyOrderSizeChangeHandle"
                @current-change="hyOrderCurrentChangeHandle"
                :current-page="hyOrderPage.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="hyOrderPage.pageSize"
                :total="hyOrderPage.total"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane v-if="shopId === carShop" label="停车订单" name="carOrder">
        <car-record ref="carRecord"></car-record>
      </el-tab-pane>
      <el-tab-pane v-if="shopId !== carShop && shopId !== memberShop" label="提货记录" name="cardRecord">
        <card-record ref="cardRecord"></card-record>
      </el-tab-pane>
      <el-tab-pane v-if="shopId !== carShop && shopId !== memberShop" label="会员卡记录" name="memberRecord">
        <member-record ref="memberRecord"></member-record>
      </el-tab-pane>
      <el-tab-pane v-if="shopId === memberShop" label="会员充值记录" name="memberOrderRecord">
        <member-order-record ref="memberOrderRecord"></member-order-record>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <order-station
      v-if="orderStationVisible"
      ref="orderStation"
      @refreshOrderStationDataList="getDataList"
    ></order-station>
    <consignment-info
      v-if="consignmentInfoVisible"
      ref="consignmentInfo"
      @inputCallback="getWaitingConsignmentExcel"
    ></consignment-info>
    <orderAmount-update
      v-if="orderAmountUpdateVisible"
      ref="orderAmountUpdate"
      @refreshOrderAmountUpdate="getDataList"
    ></orderAmount-update>
    <order-delivery-update
      v-if="devyVisible"
      ref="orderDeliveryUpdate"
      @refreshOrderDeliveryUpdate="getDataList"
    ></order-delivery-update>
    <!-- 修改物流弹窗 -->
    <!-- <el-dialog :title="修改物流" width="70%"></el-dialog> -->
    <el-dialog
      :title="this.$i18n.t('order.modifyLogistics')"
      :close-on-click-modal="false"
      :visible.sync="logVisible"
      @closed="handleClose"
      width="50%"
    >
      <!-- 修改 -->
      <div class="revise-log" v-if="isReviseLog">
        <div class="change-logistics">
          <div class="warning">{{ $t("order.ifModifyTheLog") }}</div>
          <div class="log-list">
            <div
              class="item"
              v-for="(logItem, index) in logisticsInfo"
              :key="index"
            >
              <div class="i-tit">
                <div class="big">{{ $t("order.package") }}{{ index + 1 }}</div>
                <div class="text">
                  {{ $t("order.total") }} {{ logItem.productNums }}
                  {{ $t("marketing.item") }}{{ $t("home.product") }}
                </div>
              </div>
              <!-- <div class="i-con">
                   <div class="label">发货方式：</div>
                   <div class="con">
                     <div class="con-radio">
                       <input type="radio" name="checkit" value="" checked="true"/><span>需要物流</span>
                     </div>
                   </div>
                 </div>
                 <div class="i-con">
                   <div class="label">物流公司：</div>
                   <div class="con">
                     <div class="con-select">申通快递</div>
                     <div class="con-text">
                       <div class="text">运单号编：</div>
                       <input type="text" />
                     </div>
                   </div>
              </div>-->

              <el-form
                :model="logDataForm"
                ref="logDataForm"
                @keyup.enter.native="logDataFormSubmit()"
                :label-width=" lang === 'en' ? '205px' : '95px'"
              >
                <div class="item-goods">
                  <div class="goods-box" ref="carouser">
                    <div
                      class="item"
                      v-for="(
                            orderItem, index
                          ) in logItem.orderItems"
                      :key="index"
                    >
                      <div class="img">
                        <prod-pic
                          height="60"
                          width="60"
                          :pic="orderItem.pic"
                        ></prod-pic>
                        <div class="number">×{{ orderItem.prodCount }}</div>
                      </div>
                      <div class="name">{{ orderItem.prodName }}</div>
                    </div>
                  </div>
                </div>
                <el-form-item
                  :label="$t('order.delType') + ':'"
                  style="margin-left:15px;"
                >
                  <el-radio-group v-model="logItem.deliveryType">
                    <el-radio :label="1" v-model="radio" disabled>{{
                        $t("order.distribution")
                      }}</el-radio>
                    <el-radio :label="3" v-model="radio" disabled>{{
                        $t("order.noNeedRequired")
                      }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="logItem.deliveryType === 1" class="info-int">
                  <el-form-item
                    :label="$t('order.courierCompany') + ':'"
                    class="form-item"
                    style="margin-left:15px;"
                  >
                    <div class="con">
                      <el-select v-model="logItem.dvyId" size="small">
                        <!-- :placeholder="this.$i18n.t('tip.select')" -->
                        <el-option
                          v-for="item in logDataForm.dvyNames"
                          :key="item.dvyId"
                          :label="item.dvyName"
                          :value="item.dvyId"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item
                    :label="$t('order.trackingNumber') + ':'"
                    class="form-item"
                  >
                    <el-input
                      v-model="logItem.dvyFlowId"
                      controls-position="right"
                      :min="0"
                       size="small"
                    ></el-input>
                    <!-- :label="this.$i18n.t('order.trackingNumber')" -->
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 确认 -->
      <div class="change-logistics" v-if="!isReviseLog">
        <div class="warning">{{ $t("order.ifModifyTheLog") }}</div>
        <el-table class="log-info-table" :data="confirmList">
          <!-- <div v-for="(item,index) in confirmList" :key="index"> -->
          <el-table-column
            property="dvyIdName"
            :label="this.$i18n.t('order.packageName')"
            width="220"
            style="text-align: left"
          ></el-table-column>
          <el-table-column
            property="productNums"
            :label="this.$i18n.t('order.amountOfGoods')"
            width="140"
          ></el-table-column>
          <el-table-column
            property="delMethod"
            :label="this.$i18n.t('order.deliveryMethod')"
            width="140"
          ></el-table-column>
          <el-table-column
            property="dvyName"
            :label="this.$i18n.t('order.logisticsCompany')"
            width="170"
          ></el-table-column>
          <el-table-column
            property="dvyFlowId"
            :label="this.$i18n.t('order.trackingNumber')"
          ></el-table-column>
          <!-- </div> -->
        </el-table>
      </div>

      <div slot="footer" v-if="isReviseLog" class="dialog-footer">
        <div class="default-btn" @click="logVisible = false">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div class="default-btn primary-btn" @click="logDataFormSubmit()">{{
          $t("order.save")
        }}</div>
      </div>

      <div slot="footer" v-if="!isReviseLog" class="dialog-footer">
        <div class="default-btn" @click="backToRevise()">{{
          $t("order.backToModify")
        }}</div>
        <div class="default-btn primary-btn" @click="confirmRevise()">{{
          $t("order.confirmTheChanges")
        }}</div>
      </div>
    </el-dialog>
    <!-- /修改物流弹窗 -->
    <order-upload v-if="uploadVisible" ref="spuUpload" :param="dataForm" @refreshDataList1="getWaitingConsignmentExcel" />
  </div>
</template>

<script>
import OrderStation from './order-station'
import ConsignmentInfo from './consignment-info'
import OrderAmountUpdate from './orderAmount-update'
import OrderDeliveryUpdate from './order-delivery-update'
import OrderUpload from './order-upload'
import moment from 'moment'
import ProdPic from '@/components/prod-pic'
import CardRecord from './card-record'
import MemberRecord from './member-record'
import CarRecord from './car-record'
import MemberOrderRecord from './member-order-record'

export default {
  name: 'order-order',
  data () {
    return {
      shopId:this.$store.state.user.shopId,
      tabActive:'first',
      showHeadScroll: false, // 修改物流相关
      resizeProportion: 1,
      logVisible: false,
      radio: '1',
      logisticsInfo: [],  // 包裹列表
      logDataForm: {
        dvyId: '', // 当前物流公司id
        dvyFlowId: '',  // 物流单号
        dvyNames: []  // 物流公司列表
      },
      uploadVisible: false,
      lang: localStorage.getItem('lang'),
      // logDataRule: {
      //   dvyFlowId: [
      //     { required: true, message: this.$i18n.t('publics.noNull'), trigger: 'blur' }
      //   ]
      // },
      errorNum: 0,
      // 确认修改弹窗
      isReviseLog: true,  // 是否正在修改物流信息
      confirmList: [],  // 确认修改信息
      dataForm: {},
      sts: 0,
      dateRange: [],
      status: null,
      options: [{
        value: 1,
        label: this.$i18n.t('order.pendingPayment')
      },
      {
        value: 2,
        label: this.$i18n.t('order.toBeShipped')
      },
      {
        value: 3,
        label: this.$i18n.t('order.pendingReceipt')
      },
      {
        value: 5,
        label: this.$i18n.t('order.successfulTransaction')
      },
      {
        value: 6,
        label: this.$i18n.t('order.transactionFailed')
      },
      {
        value: 7,
        label: this.$i18n.t('group.waitGroup')
      }],
      refund: [{
        value: 0,
        label: this.$i18n.t('order.noAfterSales')
      },
      {
        value: 1,
        label: this.$i18n.t('order.requestARefund')
      },
      {
        value: 2,
        label: this.$i18n.t('order.refundsuccessfully')
      },
      {
        value: 3,
        label: this.$i18n.t('order.partialRefundSucc')
      },
      {
        value: 4,
        label: this.$i18n.t('order.refundFailed')
      }],
      orderType: [{
        value: 0,
        label: this.$i18n.t('order.normalOrder')
      }, {
        value: 1,
        label: this.$i18n.t('order.groupPurchaseOrder')
      }, {
        value: 2,
        label: this.$i18n.t('order.spikeOrder')
      }, {
        value: 5,
        label: "收银订单"
      }],
      orderMold: [{
        value: 0,
        label: this.$i18n.t('order.physicalOrder')
      }, {
        value: 1,
        label: this.$i18n.t('order.virtualOrder')
      }],
      dvyType: [{
        value: 1,
        label: this.$i18n.t('order.expressDelivery')
      },
      {
        value: 2,
        label: this.$i18n.t('order.selfMention')
      },
      {
        value: 3,
        label: this.$i18n.t('order.noNeedRequired')
      },
      {
        value: 4,
        label: this.$i18n.t('order.sameCityDelivery')
      }],
      payType: [{
        value: 0,
        label: this.$i18n.t('order.pointsPayment')
      }, {
        value: 1,
        label: this.$i18n.t('admin.weChatPay')
      }, {
        value: 2,
        label: this.$i18n.t('admin.aliPay')
      }, {
        value: 3,
        label: this.$i18n.t('admin.balancePay')
      }, {
        value: 4,
        label: this.$i18n.t('order.payPalPayment')
      },{
        value: 15,
        label: "提货卡支付"
      }],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      offlinePage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      dataListSelections: [],
      devyVisible: false,
      orderStationVisible: false,
      consignmentInfoVisible: false,
      orderAmountUpdateVisible: false,
      activeName: '0',
      timeActive: null,
      priceWidth: '109px',
      infoWidth: '400px',
      offlineOrderList:[],//线下订单列表
      offlineOrderLoading:false,
      carOrderList:[],//停车订单
      carOrderLoading:false,
      statisticName: '数据统计',
      offlineStatisticName:'数据统计',
      hyOrderList:[],//红云订单
      hyOrderLoading:false,
      hyDateRange:[],
      hyStatisticName: '数据统计',
      hyStatistic:{
        actualAmount:0,
        mchFeeAmount:0,
        payAmount:0,
        payCount:0,
        refundAmount:0,
        refundCount:0
      },
      hyOrderPage:{
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      offlineDataForm:{
        state:'',
        wayCode:''
      },
      offlineStatistic:{
        actualAmount:0,
        mchFeeAmount:0,
        payAmount:0,
        payCount:0,
        refundAmount:0,
        refundCount:0
      },
      offlineDateRange:[],//支付时间
      stateList:[
        {
          label:'订单生成',
          value:0
        },
        {
          label:'支付中',
          value:1
        },
        {
          label:'支付成功',
          value:2
        },
        {
          label:'支付失败',
          value:3
        },
        {
          label:'已撤销',
          value:4
        },
        {
          label:'已退款',
          value:5
        },
        {
          label:'订单关闭',
          value:6
        }
      ],
      payWayList:[
        {
          "wayName": "支付宝APP",
          "wayType": "ALIPAY",
          "wayCode": "ALI_APP"
        },
        {
          "wayName": "支付宝条码",
          "wayType": "ALIPAY",
          "wayCode": "ALI_BAR"
        },
        {
          "wayName": "支付宝生活号",
          "wayType": "ALIPAY",
          "wayCode": "ALI_JSAPI"
        },
        {
          "wayName": "支付宝小程序",
          "wayType": "ALIPAY",
          "wayCode": "ALI_LITE"
        },
        {
          "wayName": "支付宝PC网站",
          "wayType": "ALIPAY",
          "wayCode": "ALI_PC"
        },
        {
          "wayName": "支付宝二维码",
          "wayType": "ALIPAY",
          "wayCode": "ALI_QR"
        },
        {
          "wayName": "支付宝WAP",
          "wayType": "ALIPAY",
          "wayCode": "ALI_WAP"
        },
        {
          "wayName": "红云余额支付",
          "wayType": "OTHER",
          "wayCode": "HY_PAY"
        },
        {
          "wayName": "汇付斗拱预支付",
          "wayType": "OTHER",
          "wayCode": "PRE_ORDER"
        },
        {
          "wayName": "银联App支付",
          "wayType": "UNIONPAY",
          "wayCode": "UP_APP"
        },
        {
          "wayName": "银联企业网银支付",
          "wayType": "UNIONPAY",
          "wayCode": "UP_B2B"
        },
        {
          "wayName": "银联二维码(被扫)",
          "wayType": "UNIONPAY",
          "wayCode": "UP_BAR"
        },
        {
          "wayName": "银联Js支付",
          "wayType": "UNIONPAY",
          "wayCode": "UP_JSAPI"
        },
        {
          "wayName": "银联网关支付",
          "wayType": "UNIONPAY",
          "wayCode": "UP_PC"
        },
        {
          "wayName": "银联二维码(主扫)",
          "wayType": "UNIONPAY",
          "wayCode": "UP_QR"
        },
        {
          "wayName": "银联手机网站支付",
          "wayType": "UNIONPAY",
          "wayCode": "UP_WAP"
        },
        {
          "wayName": "微信APP",
          "wayType": "WECHAT",
          "wayCode": "WX_APP"
        },
        {
          "wayName": "微信条码",
          "wayType": "WECHAT",
          "wayCode": "WX_BAR"
        },
        {
          "wayName": "微信H5",
          "wayType": "WECHAT",
          "wayCode": "WX_H5"
        },
        {
          "wayName": "微信公众号",
          "wayType": "WECHAT",
          "wayCode": "WX_JSAPI"
        },
        {
          "wayName": "微信小程序",
          "wayType": "WECHAT",
          "wayCode": "WX_LITE"
        },
        {
          "wayName": "微信扫码",
          "wayType": "WECHAT",
          "wayCode": "WX_NATIVE"
        },
        {
          "wayName": "云闪付条码",
          "wayType": "YSFPAY",
          "wayCode": "YSF_BAR"
        },
        {
          "wayName": "云闪付jsapi",
          "wayType": "YSFPAY",
          "wayCode": "YSF_JSAPI"
        }
      ],
      settlementStatus:'',
      orderStatisticName:"数据统计",
      orderStatistic:{
        mchFeeAmount:0,
        payAmount:0,
        payCount:0,
        todayAmount:0,
        todayCount:0,
        yesterdayAmount:0,
        yesterdayCount:0,
        refundAmount:0,
        refundCount:0
      },
      carShop:'',
      memberShop:''
    }
  },
  components: {
    OrderStation,
    OrderAmountUpdate,
    OrderDeliveryUpdate,
    ConsignmentInfo,
    OrderUpload,
    ProdPic,
    CardRecord,
    MemberRecord,
    CarRecord,
    MemberOrderRecord
  },
  computed: {
    // 二级菜单折叠状态
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    }
  },
  created () {
    // 首页跳转状态参数
    this.activeName = this.$route.query.status ? String(this.$route.query.status) : '0'
    this.sts = this.$route.query.status || 0
    this.status = this.sts === 0 ? null : Number(this.sts)

    // 携带参数查询
    this.getDataList(this.page, this.$route.query)
    this.statisticOrder()
    this.refundOrderStatistic()

    // 请求物流公司
    this.getLogisticsList()
  },
  activated () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.getDataList(this.page, query)
    }
  },
  mounted () {
    this.getCarShop()
    this.getMemberShop()
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)

    this.resizeProportion = window.outerHeight / window.innerHeight
    window.addEventListener('resize', function () {
      this.resizeProportion = window.outerHeight / window.innerHeight
    })
    // setTimeout(() => {
    //   this.getEleWidth()
    // })
    // window.onresize = () => {
    //   return (() => {
    //     setTimeout(() => {
    //       this.getEleWidth()
    //     })
    //   })()
    // }
  },
  watch: {

  },
  methods: {
    //查询停车店铺id
    getCarShop(){
      this.$http({
        url: this.$http.adornUrl('/sys/config/info/configQuery'),
        method: 'get',
        params: this.$http.adornParams({
          configName:"CAR_SHOP"
        })
      }).then(({ data }) => {
        if(data){
          this.carShop = Number(data)
          if(this.shopId === this.carShop){
            this.tabActive = "carOrder"
            this.$nextTick(() => {
              this.$refs.carRecord.carClear()
              this.$refs.carRecord.init()
            })
          }
        }
      })
    },
    //查询会员充值店铺id
    getMemberShop(){
      this.$http({
        url: this.$http.adornUrl('/sys/config/info/configQuery'),
        method: 'get',
        params: this.$http.adornParams({
          configName:"BALANCE_SHOP"
        })
      }).then(({ data }) => {
        if(data){
          this.memberShop = Number(data)
          if(this.shopId === this.memberShop){
            this.tabActive = "memberOrderRecord"
            this.$nextTick(() => {
              this.$refs.memberOrderRecord.resetForm("searchForm")
              this.$refs.memberOrderRecord.init()
            })
          }
        }
      })
    },
    //线上订单统计
    orderStatisticClick(){
      if (this.orderStatisticName === '数据统计') {
        this.orderStatisticName = '关闭统计'
      } else {
        this.orderStatisticName = '数据统计'
      }
    },
    //订单统计
    statisticOrder(){
      let statisticData = {
        'payType': this.dataForm.payType,
        'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
        'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
      }

      this.$http({
        url: this.$http.adornUrl('/order/order/statistic'),
        method: 'get',
        params: this.$http.adornParams(statisticData)
      }).then(({data}) => {
        if(data){
          this.orderStatistic.payAmount = data.payAmount
          this.orderStatistic.payCount = data.payCount
          this.orderStatistic.todayAmount = data.todayAmount
          this.orderStatistic.todayCount = data.todayCount
          this.orderStatistic.yesterdayAmount = data.yesterdayAmount
          this.orderStatistic.yesterdayCount = data.yesterdayCount
        }
      })
    },
    //退款订单统计
    refundOrderStatistic(){
      let statisticData = {
        'payType': this.dataForm.payType,
        'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
        'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
      }

      this.$http({
        url: this.$http.adornUrl('/order/order/refundOrderStatistic'),
        method: 'get',
        params: this.$http.adornParams(statisticData)
      }).then(({data}) => {
        if(data){
          this.orderStatistic.refundAmount = data.refundAmount
          this.orderStatistic.refundCount = data.refundCount
        }
      })
    },
    //线下订单统计
    offlineStatisticClick(){
      if (this.offlineStatisticName === '数据统计') {
        this.offlineStatisticName = '关闭统计'
      } else {
        this.offlineStatisticName = '数据统计'
      }
    },
    //红云订单统计
    hyStatisticClick(){
      if (this.hyStatisticName === '数据统计') {
        this.hyStatisticName = '关闭统计'
      } else {
        this.hyStatisticName = '数据统计'
      }
    },
    //数据统计点击
    statisticClick () {
      if (this.statisticName === '数据统计') {
        this.statisticName = '关闭统计'
      } else {
        this.statisticName = '数据统计'
      }
    },
    //tab切换
    tabHandleClick(){
      this.settlementStatus = ""
      if(this.tabActive === "first"){
        this.dataForm = {}
        this.dateRange = []
        this.status = null
        this.timeActive = null
        this.theData = null
        this.getDataList(this.page, null, false)
        this.statisticOrder()
        this.refundOrderStatistic()
      }else if(this.tabActive === "second"){
        this.offlinePage = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.offlineDateRange = []
        this.offlineDataForm = {}
        this.getOfflinePaymentOrder(this.offlinePage)
      }else if(this.tabActive === "hyOrder"){
        this.hyOrderPage = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.hyDateRange = []
        this.getHyOrder(this.hyOrderPage)
      }else if(this.tabActive === "carOrder"){
        this.$refs.carRecord.carClear()
        this.$refs.carRecord.init()
      }else if(this.tabActive === "cardRecord"){
        this.$refs.cardRecord.resetForm('searchForm')
        this.$refs.cardRecord.init()
      }else if(this.tabActive === "memberRecord"){
        this.$refs.memberRecord.resetForm('searchForm')
        this.$refs.memberRecord.init()
      }else if(this.tabActive === "memberOrderRecord"){
        this.$refs.memberOrderRecord.resetForm('searchForm')
        this.$refs.memberOrderRecord.init()
      }
    },
    //查询线下订单
    getOfflinePaymentOrder(page){
      this.offlineOrderLoading = true
      this.$http({
        url: this.$http.adornUrl('/order/order/queryOfflinePaymentOrders'),
        method: 'GET',
        params: this.$http.adornParams({
          current: page == null ? this.offlinePage.currentPage : page.currentPage,
          size: page == null ? this.offlinePage.pageSize : page.pageSize,
          'wayCode': this.offlineDataForm.wayCode,
          'state': this.offlineDataForm.state,
          'queryDateRange': this.offlineDateRange !== null && this.offlineDateRange[0] && this.offlineDateRange[1] ? "customDateTime_" + this.offlineDateRange[0] + " 00:00:00_" + this.offlineDateRange[1] + " 23:59:59" : "" , // 开始时间
        })
      }).then(({ data }) => {
        for (let i = 0; i < data.records.length; i++) {
          data.records[i].amount = this.regFenToYuan(data.records[i].amount)
          data.records[i].refundAmount = this.regFenToYuan(data.records[i].refundAmount)
          data.records[i].mchFeeAmount = this.regFenToYuan(data.records[i].mchFeeAmount)
        }
        if(data.totalData){
          this.offlineStatistic.actualAmount = ((data.totalData.payAmount - data.totalData.mchFeeAmount) / 100).toFixed(2)
          this.offlineStatistic.payAmount = (data.totalData.payAmount / 100).toFixed(2)
          this.offlineStatistic.mchFeeAmount = (data.totalData.mchFeeAmount / 100).toFixed(2)
          this.offlineStatistic.payCount = data.totalData.payCount
          this.offlineStatistic.refundAmount = (data.totalData.refundAmount / 100).toFixed(2)
          this.offlineStatistic.refundCount = data.totalData.refundCount
        }
        this.offlineOrderList = data.records
        this.offlinePage.total = data.total
      }).finally(()=>{
        this.offlineOrderLoading = false
      })
    },
    regFenToYuan(fen){
      let num = fen;
      num=fen*0.01;
      num+='';
      let reg = num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
      num=num.replace(reg,'$1');
      num = this.toDecimal2(num)
      return num
    },
    toDecimal2(x){
      var f = parseFloat(x);
      if (isNaN(f)) {
        return false;
      }
      var f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + 2) {
        s += '0';
      }
      return s;
    },
    getEleWidth () {
      let div = document.getElementById('price-title') // prod-info-title
      let div1 = document.getElementById('prod-info-title')
      if (!div && !div1) {
        return
      }
      let w = div.offsetWidth    // 返回元素的总宽度
      let w1 = div1.offsetWidth
      this.priceWidth = w + 'px'
      this.infoWidth = w1 + 'px'
    },
    /**
     * 关闭 修改物流弹窗
     */
    handleClose () {
      this.isReviseLog = true
    },
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > (400 * this.resizeProportion)
    },

    /**
     * 获取包裹物流信息
     */
    reviseLogistics (orderNumber) {
      // console.log(orderNumber)
      this.logVisible = !this.logVisible
      this.$http({
        url: this.$http.adornUrl('/order/delivery/getOrderDeliveries/' + orderNumber),
        method: 'put'
      }).then(({ data }) => {
        this.logisticsInfo = data
        this.logisticsInfo.forEach((el, index) => {
          el.newDvyFlowId = el.dvyFlowId
          el.newDvyId = el.dvyId
          el.dvyIdName = this.$i18n.t('order.package') + Number(index + 1)
          // 修改弹窗
          this.confirmList = []  // 清空确认列表
        })
      })
      this.errorNum = 0
    },

    /**
     * 请求物流公司列表
     */
    getLogisticsList () {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.logDataForm.dvyNames = data
      })
    },

    /**
     * 点击保存
     */
    logDataFormSubmit () {
      //  let reviseLogList = []
      let flag = true
      let logisticsInfo = this.logisticsInfo
      logisticsInfo.map((el, index) => {
        if (el.deliveryType === 3) {
          return
        }
        if (!flag) {
          return false
        }
        // console.log('logisticsInfo', el.logisticsInfo)
        // console.log('el.dvyFlowId', el.dvyFlowId)
        var reg = /^[a-zA-Z0-9]{4,30}$/
        if (el.dvyFlowId.length === 0) {
          this.$message({
            message: this.$i18n.t('order.logEmpty'),
            type: 'warning'
          })
          flag = false
          this.errorNum = 1
          // throw ('物流单号不能为空')
          // return false
        } else if (!reg.test(el.dvyFlowId)) {
          this.$message({
            message: this.$i18n.t('order.checkDvyId'),
            type: 'warning'
          })
          flag = false
          this.errorNum = 1
        } else {
          this.errorNum = 0
          // console.log(el.newDvyFlowId)
          let confirmList = this.confirmList
          if ((el.newDvyFlowId.length !== 0 && el.newDvyFlowId !== el.dvyFlowId) || (el.newDvyId !== el.dvyId)) {
            confirmList.push(el)
            confirmList.forEach((el, index) => {
              el.delMethod = this.$i18n.t('order.logistics')
              // el.packageName = "包裹" + Number(index+1)
              this.logDataForm.dvyNames.forEach((dvyName, index) => {
                if (el.dvyId === dvyName.dvyId) {
                  el.dvyName = dvyName.dvyName
                }
              })
            })
            this.confirmList = confirmList
          }
        }
        // console.log('确认列表:', this.confirmList)
        // this.confirmList.forEach((el, index) => {

        // })
      })
      // console.log(this.errorNum)
      if (this.errorNum === 1) {
        return
      } else if (this.confirmList.length === 0) {
        this.$message({
          message: this.$i18n.t('order.noLogIsChanged'),
          type: 'warning'
        })
        flag = false
      }
      if (flag) {
        this.isReviseLog = false // 修改弹窗
      }
    },
    /**
     * 确认修改物流信息
     */
    confirmRevise () {
      // let dvyOrderParam = {
      //   deliveryOrders: this.confirmList
      // }
      this.$http({
        url: this.$http.adornUrl('/order/delivery/updateOrderDeliveries'),
        method: 'put',
        data: this.$http.adornData({
          deliveryOrders: this.confirmList
        }),
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success'
        })
        this.isReviseLog = true
        this.logVisible = false
      })
    },
    /**
     * 返回修改（物流信息）
     */
    backToRevise () {
      this.isReviseLog = true
      // 修改弹窗
      this.confirmList = []  // 清空确认列表
    },

    /**
     * 获取数据列表
     */
    getDataList (page, params, newData = false) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'orderNumber': this.dataForm.orderNumber,
              // 'prodName': this.dataForm.prodName,
          'orderType': this.dataForm.orderType,
          'orderMold': this.dataForm.orderMold,
          'payType': this.dataForm.payType,
          'receiver': this.dataForm.receiver,
          'mobile': this.dataForm.mobile,
          'status': this.status,
          'dvyType': this.dataForm.dvyType,
          'stationName': this.dataForm.stationName,
          'refundStatus': this.dataForm.refundStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
        this.theData.status = this.status
      }
      this.$http({
        url: this.$http.adornUrl('/order/order/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(this.theData, params
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.sts = !this.status ? 0 : this.status
        this.dataListLoading = false
        this.activeName = !this.status ? '0' : this.status + ''
      })
    },
    /**
     * 获取红云订单列表
     */
    getHyOrder (page) {
      this.hyOrderLoading = true
      this.$http({
        url: this.$http.adornUrl('/order/order/queryOfflinePaymentOrders'),
        method: 'GET',
        params: this.$http.adornParams({
          current: page == null ? this.hyOrderPage.currentPage : page.currentPage,
          size: page == null ? this.hyOrderPage.pageSize : page.pageSize,
          'settlementStatus': this.settlementStatus,
          'wayCode': "HY_PAY",
          'state': 2,
          'queryDateRange': this.hyDateRange !== null && this.hyDateRange[0] && this.hyDateRange[1] ? "customDateTime_" + this.hyDateRange[0] + " 00:00:00_" + this.hyDateRange[1] + " 23:59:59" : "" , // 开始时间
        })
      }).then(({ data }) => {
        for (let i = 0; i < data.records.length; i++) {
          data.records[i].amount = this.regFenToYuan(data.records[i].amount)
          data.records[i].refundAmount = this.regFenToYuan(data.records[i].refundAmount)
          data.records[i].mchFeeAmount = this.regFenToYuan(data.records[i].mchFeeAmount)
        }
        if(data.totalData){
          this.hyStatistic.actualAmount = ((data.totalData.payAmount - data.totalData.mchFeeAmount) / 100).toFixed(2)
          this.hyStatistic.payAmount = (data.totalData.payAmount / 100).toFixed(2)
          this.hyStatistic.mchFeeAmount = (data.totalData.mchFeeAmount / 100).toFixed(2)
          this.hyStatistic.payCount = data.totalData.payCount
          this.hyStatistic.refundAmount = (data.totalData.refundAmount / 100).toFixed(2)
          this.hyStatistic.refundCount = data.totalData.refundCount
        }
        this.hyOrderList = data.records
        this.hyOrderPage.total = data.total
      }).finally(()=>{
        this.hyOrderLoading = false
      })
    },
    //导出红云订单
    downloadHyRecord(){
      const loading = this.$loading({
        lock: true,
        target: '.mod-order-order',
        customClass: 'export-load',
        background: 'transparent',
        text: '数据导出中......'
      })
      this.$http({
        url: this.$http.adornUrl('/order/order/downloadHyRecord'),
        method: 'GET',
        params: this.$http.adornParams({
          'settlementStatus': this.settlementStatus,
          'wayCode': "HY_PAY",
          'state': 2,
          'queryDateRange': this.hyDateRange !== null && this.hyDateRange[0] && this.hyDateRange[1] ? "customDateTime_" + this.hyDateRange[0] + " 00:00:00_" + this.hyDateRange[1] + " 23:59:59" : "" , // 开始时间
        }),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let fileName = '红云订单记录数据.xlsx'
        let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: '导出成功',
          type: 'success',
          duration: 1500,
          onClose: () => {

          }
        })
      }).catch((e) => {
        loading.close()
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },

    // 红云每页数
    hyOrderSizeChangeHandle (val) {
      this.hyOrderPage.pageSize = val
      this.hyOrderPage.currentPage = 1
      this.getHyOrder(this.hyOrderPage)
    },
    // 红云当前页
    hyOrderCurrentChangeHandle (val) {
      this.hyOrderPage.currentPage = val
      this.getHyOrder(this.hyOrderPage)
    },

    // 每页数
    offlineOrderSizeChangeHandle (val) {
      this.offlinePage.pageSize = val
      this.offlinePage.currentPage = 1
      this.getOfflinePaymentOrder(this.offlinePage)
    },
    // 当前页
    offlineOrderCurrentChangeHandle (val) {
      this.offlinePage.currentPage = val
      this.getOfflinePaymentOrder(this.offlinePage)
    },

    /**
     * 导航选择状态
     */
    selectNav (e) {
      var sts = e.currentTarget.dataset.sts
      this.activeName = parseInt(sts)
      this.status = this.activeName === 0 ? null : parseInt(sts)
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    orderStatus (val) {
      this.status = val
      this.activeName = val + ''
      this.getDataList(this.page)
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
      this.timeActive = val
      var startDay = null
      var endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
      } else if (val === 3) {
        startDay = -7
        endDay = -1
      } else if (val === 4) {
        startDay = -30
        endDay = -1
      } else {
        return
      }
      // 开始时间
      let startTime = moment().add(startDay, 'days').startOf('days').format('LL')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.dateRange = [startTime, endTime]
    },
    // 查看订单
    addOrUpdateHandle (val) {
      this.$router.push({
        path: '/order-orderInfo',
        query: {
          orderNumber: val
        }
      })
    },
    // 前往消息盒子
    toImbox (order) {
      window.open(location.href.split('#')[0] + '#/imBox?userId=' + order.userId + '&orderNumber=' + order.orderNumber, 'view_window')
    },
    // 退款路由跳转
    refundRoute (val) {
      this.$store.commit('router/updateIncludePageList', 'order-orderRefund')
      this.$store.commit('router/pushHisPageList', 'order-orderRefund')
      this.$router.push({
        path: '/order-orderRefund',
        query: { orderNumber: val }
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.orderId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/spec/${ids}`),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
    showConsignmentInfo () {
      this.consignmentInfoVisible = true
      this.$nextTick(() => {
        this.$refs.consignmentInfo.init()
      })
    },
    getWaitingConsignmentExcel () {
      this.getDataList(this.page)
    },
    uploadSpu () {
      this.dataForm.startTime = this.dateRange === null ? null : this.dateRange[0]
      this.dataForm.endTime = this.dateRange === null ? null : this.dateRange[1]
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.spuUpload.init()
      })
    },
    // 清空按钮
    clear () {
      this.dataForm = {}
      this.dateRange = []
      this.status = null
      this.timeActive = null
    },
    //红云清空搜索
    hyClear(){
      this.hyDateRange = []
      this.settlementStatus = ""
    },
    //停车清空搜索
    carClear(){
      this.carDataForm = {}
      this.payDateRange = []
    },
    //线下订单清空搜索
    offlineClear(){
      this.offlineDataForm = {}
      this.offlineDateRange = []
    },
    // 搜索查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, null, newData)
      this.statisticOrder()
      this.refundOrderStatistic()
    },
    // 搜索查询
    searchHyChange () {
      this.hyOrderPage.currentPage = 1
      this.getHyOrder(this.hyOrderPage)
    },

    //线上订单
    searchOfflineChange(newData = false){
      this.offlinePage.currentPage = 1
      this.getOfflinePaymentOrder(this.offlinePage, null, newData)
    },
    /**
     * 更改订单金额
     */
    editAmount (order) {
      this.orderAmountUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.orderAmountUpdate.init(order)
      })
    },
    /**
       * 发货
       */
    changeOrder (order) {
      this.devyVisible = true
      this.$nextTick(() => {
        this.$refs.orderDeliveryUpdate.init(order)
      })
    },
    /**
     * 提货
     */
    stationOrder (order) {
      this.orderStationVisible = true
      this.$nextTick(() => {
        this.$refs.orderStation.init(order)
      })
    },
    getSoldExcel () {
      if (!this.dateRange || this.dateRange.length < 2) {
        this.$message.error(this.$i18n.t('order.pleExpOrderFirst'))
        return
      }
      this.$confirm(`${this.$i18n.t('order.exportReport')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          target: '.mod-order-order',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('formData.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/order/order/soldExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'orderNumber': this.dataForm.orderNumber,
            // 'prodName': this.dataForm.prodName,
            'orderType': this.dataForm.orderType,
            'payType': this.dataForm.payType,
            'lang': this.lang === 'en' ? 1 : 0,
            'receiver': this.dataForm.receiver,
            'mobile': this.dataForm.mobile,
            'status': this.status,
            'dvyType': this.dataForm.dvyType,
            'stationName': this.dataForm.stationName,
            'refundStatus': this.dataForm.refundStatus,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('order.orderInfCollationXls')
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }).catch((e) => {
          loading.close()
        })
      })
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
.mod-order-order {
  .search-bar {
    .input-row {
      .select-time-btn {
        margin-right: 20px;
        display: inline-block;
        color: #AAAAAA;
        font-size: 14px;
        cursor:pointer;
        &:last-child {
          margin-right: 0;
        }
      }
      .select-time-btn.is-active {
        color: #155BD4;
      }

    }
  }
  .main {
    .order-status-nav {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      // height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        float: left;
        height: 40px;
        line-height: 40px;
        background: #f7f8fa;
        border: 1px solid #ddd;
        padding: 0 20px;
        margin: 0 -1px -1px 0;
        cursor: pointer;
      }

      .selected {
        background: #fff;
        border-bottom: 1px solid #fff;
      }
    }
    .status-nav {
      ::v-deep .el-tabs__item {
        padding: 0 20px ;
        min-width: 68px;
        width: auto;
        text-align: center;
      }
      ::v-deep .el-tabs__nav-wrap::after{
        height: 1px;
      }
    }
    .tit {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      background: #F7F8FA;
      z-index: 11;
      height: 57px;
      font-weight: bold;
      .column-title {
        text-align: center;
      }
      .item {
        padding: 0 10px;
        width: 10%;
        text-align: center;
      }
      .product {
        width: 25%;
        margin-bottom: 15px;
        text-align: left !important;
      }
    }
    .fixed-top {
      position: fixed;
      width: calc(83.5% + var(--tit-width-incremental));
      top: 90px;
    }
    .prod {
      margin-bottom: 15px;
      .prod-tit {
        padding: 10px;
        background: #F7F8FA;
        height: 49px;
        display: flex;
        align-items: center;
        border-left: 1px solid #EBEDF0;
        border-top: 1px solid #EBEDF0;
        border-right: 1px solid #EBEDF0;
        .order-number{
          color: #333333;
          font-size: 14px
        }
        .order-time{
          color: #999999;
          font-size: 14px
        }
        span {
          margin-right: 15px;
        }
      }
      .prod-cont {
        display: flex;
        border: 1px solid #EBEDF0;
        color: #495060;
        .item {
          display: flex;
          display: -webkit-flex;
          align-items: center;
          padding: 10px;
          text-align: center;
          justify-content: center !important;
          height: 100%;
          border-right: 1px solid #eee;
          .totalprice {
            color: #ff4141;
            margin-bottom: 10px;
          }
          .operate {
            color: #2d8cf0;
            .operate-btn {
              margin: 0 !important;
              height: auto;
            }
            .default-btn + .default-btn {
              display: block;
              margin-top: 10px;
              margin-left: 0;
            }
          }
          .buyer-info {
            .buyer-name {
              margin-bottom: 4px;
            }
          }
          span {
            display: block;
          }
        }
        .prod-item {
          padding: 0;
          display: flex;
          flex-direction: column !important;
          height: 100%;
          border-right: 1px solid #eee;
          .items.name {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #EBEDF0;
            padding: 10px !important;
            text-align: left;
            &:last-child {
              border-bottom: none;
            }
            .order-prod-item-info {
              width: 72%;
              display: flex;
              flex-direction: column;
              .info {
                display: flex;
                align-items: center;
                .prod-image {
                  min-height: 80px;
                  width: 80px;
                  height: auto;
                  margin-right: 20px;
                  padding: 0;
                  line-height: 80px;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
                }
                .prod-name {
                  width: 100% !important;
                  .prod-con {
                    width: 85% !important;
                    display: block;
                    padding: 0 !important;
                    overflow: hidden;
                    .prod-name-txt {
                      padding-right: 10px;
                      box-sizing: border-box;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                    }
                    .prod-name-sku {
                      color: #999;
                    }
                    .order-status {
                      display: inline-block;
                      margin-top: 15px;
                      margin-right: 10px;
                      padding: 2px 4px;
                      border: 1px solid #e43130;
                      border-radius: 2px;
                      color: #e43130;
                      font-size: 14px;
                    }
                  }
                }
              }
              // 赠品盒子
              .order-prod-item-give-con {
                width: 100%;
                padding: 10px 50px 0 10px;
                box-sizing: border-box;
                .giveaway-item {
                  display: flex;
                  margin-bottom: 10px;
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
                .giveaway-item-name {
                  box-sizing: border-box;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                }
                .giveaway-item-sku-count {
                  margin-left: 10px;
                  color: #999;
                  // width: 20px;
                }
              }
            }
            .prod-price {
              width: 28%;
              display: flex;
              justify-content: flex-start;
              flex-direction: column;
              overflow: hidden;
              position: relative;
              right: 0 !important;
              span {
                display: block;
                text-align: left;
                word-break: keep-all;
                &:first-child {
                  margin-bottom: 10px;
                }
              }
            }
          }
        }
      }
    }
    .empty {
      display: block;
      height: 200px;
      line-height: 200px;
      text-align: center;
      color: #aaa;
    }
    .transaction-price {
      text-align: left;
    }
  }
  // 修改物流弹窗
  .change-logistics {
    color: #333;
    padding: 0 20px;
    .warning {
      padding: 10px;
      border: 1px solid #f1924e;
      background: #fff5ed;
    }
    .log-list {
      max-height: 600px;
      margin-top: 30px;
      overflow-y: auto;
      .item {
        padding-bottom: 20px;
        .i-tit {
          display: flex;
          align-items: center;
          .big {
            font-weight: 600;
            margin-right: 15px;
          }
        }
         .item-goods {
          position: relative;
          width: 100%;
          height: 110px;
          overflow-x: auto;
          .goods-box {
            position: absolute;
            left: 0;
            display: flex;
            margin-top: 0;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
            .item {
              margin-right: 10px;
              font-size: 12px;
              cursor: pointer;
              .img {
                width: 60px;
                height: 60px;
                font-size: 0;
                margin-bottom: 4px;
                margin-top: 4px;
                position: relative;
                img {
                  width: 100%;
                  height: 100%;
                }
                .number {
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  background: rgba(0, 0, 0, 0.3);
                  color: #fff;
                  border-radius: 6px 0 6px 0;
                  font-size: 12px;
                  height: 16px;
                  line-height: 16px;
                  padding: 0 5px;
                }
              }
              .name {
                width: 60px;
                height: 16px;
                line-height: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #999;
              }
            }
            .item:last-child {
              margin: 0;
            }

          }
        }
        .info-int {
          &.el-form-item__content,
          &.el-form-item__label,
          .el-input__suffix-inner,
          .el-input__icon {
            height: 32px;
            line-height: 32px;
          }
          display: flex;
          .form-item {
            margin-right: 15px;
          }
        }
      }
    }
    .log-info-table {
      margin-top: 20px;
      max-height: 600px;
      overflow-y: auto;
    }
  }
  @media (max-width:1660px) {
    .fixed-top {
      width: calc(79.5% + var(--tit-width-incremental)) !important;
    }
  }
  @media (max-width:1360px) {
    .fixed-top {
      width: calc(75.5% + var(--tit-width-incremental)) !important;
    }
  }
}
div ::v-deep .el-form-item--small .el-form-item__content {
  display: flex;
  flex-wrap: wrap;
}
.data-statistics {
  margin: 15px 0 0;
  padding: 28px 0 32px;
  border-radius: 3px;
  border: 1px solid #EBEBEB;
  .statistics-list {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .item {
      .title {
        color: gray;
        margin-bottom: 10px;
      }
      .amount {
        margin-bottom: 10px;
        display: flex;
        align-items: baseline;
        .amount-num {
          padding-right: 3px;
          font-weight: 600;
          font-size: 20px;
        }
      }
      .detail {
        display: flex;
      }
      .detail-text {
        color: #1965ff;
        cursor: pointer;
      }
    }
  }
}
</style>
