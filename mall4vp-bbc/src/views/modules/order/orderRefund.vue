<template>
  <div class="mod-order-order">
    <div class="screening-conditions search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList(this.page)"
        size="small"
      >
        <div class="input-row">
          <!-- &nbsp;&nbsp;&nbsp; -->
          <el-form-item :label="this.$i18n.t('order.refundId') + '：'">
            <el-input
              v-model="searchForm.refundSn"
              :placeholder="this.$i18n.t('order.refundId')"
              clearable
              size="small"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item label="商品名称：">
            <el-input v-model="dataForm.prodName" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>-->
          <el-form-item :label="this.$i18n.t('prodList.shopName') + '：'">
            <el-input
              v-model="searchForm.shopName"
              :placeholder="this.$i18n.t('prodList.inputShopName')"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <!-- </div>

          <div>-->
          <el-form-item :label="this.$i18n.t('order.afterSalesStatus') + '：'">
            <template>
              <el-select
                v-model="returnMoneySts"
                clearable
                :placeholder="this.$i18n.t('order.pleSelAfterSalesSta')"
                size="small"
                @change="orderRefundStatus"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <!-- &nbsp;&nbsp;&nbsp; -->
          <el-form-item :label="this.$i18n.t('order.number') + '：'">
            <el-input
              v-model="searchForm.orderNumber"
              :placeholder="this.$i18n.t('order.number')"
              clearable
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item :label="this.$i18n.t('order.orderType') + '：'">
            <template>
              <el-select
                v-model="searchForm.orderType"
                clearable
                :placeholder="this.$i18n.t('order.selOrderType')"
                size="small"
              >
                <el-option
                  v-for="item in orderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item
            :label="this.$i18n.t('refundOrderDetail.refundType') + '：'"
          >
            <template>
              <el-select
                v-model="searchForm.refundType"
                clearable
                :placeholder="
                  this.$i18n.t('refundOrderDetail.selRefundType')
                "
                size="small"
              >
                <el-option
                  v-for="item in refundType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item
            :label="this.$i18n.t('refundOrderDetail.applyWay') + '：'"
          >
            <template>
              <el-select
                v-model="searchForm.applyType"
                clearable
                :placeholder="this.$i18n.t('refundOrderDetail.selApplyWay')"
                size="small"
              >
                <el-option
                  v-for="item in applyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <!-- &nbsp;&nbsp;&nbsp; -->
          <el-form-item :label="this.$i18n.t('order.createTime') + '：'">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              range-separator="—"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('date.start')"
              :end-placeholder="this.$i18n.t('date.end')"
            ></el-date-picker>
            <div style="margin-left: 20px;" class="default-btn" @click="setDateRange(1)">{{
              $t("date.t")
            }}</div>
            <div class="default-btn" @click="setDateRange(2)">{{
              $t("date.y")
            }}</div>
            <div class="default-btn" @click="setDateRange(3)">{{
              $t("date.n")
            }}</div>
            <div class="default-btn" @click="setDateRange(4)">{{
              $t("th")
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
              @click="clear()"
              >{{ $t("product.reset") }}</div
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container main">
      <div class="content">
        <!-- 导航 -->
        <!-- <div :class="['status-nav','clearfix',showHeadScroll?'status-nav-bottom':'']">
          <ul :class="['clearfix', $t('language') == 'English' ? 'nav-list-ul-en' : 'nav-list-ul-zh']"> -->
          <!--<ul class="nav-list-ul clearfix">-->
        <div :class="['order-status-nav','clearfix',showHeadScroll?'status-nav-bottom':'']">
          <ul class="nav-list clearfix">
            <li
              :class="['nav-item-li', sts == 0 ? 'selected' : '']"
              data-sts="0"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("date.a") }}</p>
            </li>
            <li
              :class="['nav-item-li', sts == 1 ? 'selected' : '']"
              data-sts="1"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("refundOrderDetail.buyerApply") }}</p>
            </li>
            <li
              :class="['nav-item-li', sts == 2 ? 'selected' : '']"
              data-sts="2"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("refundOrderDetail.sellerAccepts") }}</p>
            </li>
            <li
              :class="['nav-item-li', sts == 3 ? 'selected' : '']"
              data-sts="3"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("refundOrderDetail.buyerDelivery") }}</p>
            </li>
            <li
              :class="['nav-item-li', sts == 4 ? 'selected' : '']"
              data-sts="4"
              @click="selectNav($event)"
            >
              <p class="li-txt">
                {{ $t("refundOrderDetail.sellerReceivesGoods") }}
              </p>
            </li>
            <li
              :class="['nav-item-li', sts == 5 ? 'selected' : '']"
              data-sts="5"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.refundsuccessfully") }}</p>
            </li>
            <!-- <li
              :class="['nav-item-li', sts == 6 ? 'selected' : '']"
              data-sts="6"
              @click="selectNav($event)"
            >
              <p class="li-txt">
                {{ $t("refundOrderDetail.WithdrawalApply") }}
              </p>
            </li> -->
<!--            <li-->
<!--              :class="['nav-item-li', sts == 7 ? 'selected' : '']"-->
<!--              data-sts="7"-->
<!--              @click="selectNav($event)"-->
<!--            >-->
<!--              <p class="li-txt">-->
<!--                {{ $t("refundOrderDetail.BusinessRefused") }}-->
<!--              </p>-->
<!--            </li>-->
            <li
              :class="['nav-item-li', sts == -1 ? 'selected' : '']"
              data-sts="-1"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.refundClosed") }}</p>
            </li>
          </ul>
          <ul class="nav-right"></ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit', showHeadScroll ? 'fixed-top' : '']">
          <el-row style="width: 100%">
            <el-col :span="7">
              <span class="item product">{{ $t("order.product") }}</span>
            </el-col>
            <el-col :span="3" class="transaction-price">
              <span class="item"
                >{{ $t("prodList.goodsPrice") }}/{{
                  $t("order.quantity")
                }}</span
              >
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{
                $t("refundOrderDetail.refundAmount")
              }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("refundOrderDetail.comStatus") }}</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">{{ $t("refundOrderDetail.refundType") }}</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">{{ $t("group.orderStatus") }}</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">{{ $t("order.afterSalesStatus") }}</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">{{ $t("remindPop.operation") }}</span>
            </el-col>
          </el-row>
        </div>

        <div
          class="prod"
          v-for="orderRefund in dataList"
          :key="orderRefund.refundId"
        >
          <div class="prod-tit">
            <span>{{ $t("order.refundId") }}：{{ orderRefund.refundSn }}</span>
            <span>{{ $t("order.number") }}：{{ orderRefund.orderNumber }}</span>
            <span
              >{{ $t("order.applicationTime") }}：{{
                orderRefund.applyTime
              }}</span
            >
            <span
              >{{ $t("prodList.shopName") }}：{{ orderRefund.shopName }}</span
            >
            <!-- <span>买家：19999999999</span>
            <span >联系电话：19999999999</span>-->
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="10" style="height: 100%">
                <div class="item prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in orderRefund.orderItems"
                    :key="orderItem.orderItemId"
                  >
                    <div class="order-prod-item-info">
                      <!-- 商品信息 -->
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
                              v-if="orderRefund.orderMold === 1"
                              >
                              {{ $t("order.virtualOrder") }}
                            </div>
                            <div
                              class="order-status"
                              v-if="
                                orderRefund.orderType === 1 ||
                                orderRefund.orderType === 2
                              "
                            >
                              {{
                                orderRefund.orderType === 1
                                  ? $t("order.groupPurchaseOrder")
                                  : orderRefund.orderType === 2
                                  ? $t("order.spikeOrder")
                                  : ""
                              }}
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
                      <span>{{ orderItem.prodCount + $t("order.piece") }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div>
                    <span class="totalprice">{{
                      orderRefund.refundAmount.toFixed(2) +
                      " + " +
                      orderRefund.refundScore +
                      " " +
                      $t("order.score")
                    }}</span>
                    <span
                      >{{ $t("order.total") }}
                      {{ orderRefund.goodsNum }}
                      {{ $t("order.piece") }}</span
                    >
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div class="buyer-info">
                    <span>{{
                      orderRefund.applyType === 1
                        ? $t("order.onlyRefund")
                        : $t("order.refundAndMoney")
                    }}</span>
                    <span class="totalprice">{{
                      orderRefund.isReceiver
                        ? $t("refundOrderDetail.goodsReceived")
                        : $t("refundOrderDetail.notRecevied")
                    }}</span>
                    <span class="totalprice">{{
                      orderRefund.buyerReason
                    }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <div>
                    <span v-if="orderRefund.refundType === 1">{{
                      $t("refundOrderDetail.fullRefund")
                    }}</span>
                    <span v-if="orderRefund.refundType === 2">{{
                      $t("refundOrderDetail.sigGoosRefund")
                    }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <!-- <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span> -->
                  <span
                    v-if="orderRefund.status === 1"
                    size="small"
                    type="danger"
                    >{{ $t("order.pendingPayment") }}</span
                  >
                  <span
                    v-else-if="orderRefund.status === 2"
                    size="small"
                    type="danger"
                    >{{ $t("order.toBeShipped") }}</span
                  >
                  <span
                    v-else-if="orderRefund.status === 3"
                    size="small"
                    type="danger"
                    >{{ $t("order.pendingReceipt") }}</span
                  >
                  <span
                    v-else-if="orderRefund.status === 7"
                    size="small"
                    type="danger"
                    >{{ $t("group.waitGroup") }}</span
                  >
                  <span
                    v-else-if="orderRefund.status === 5"
                    size="small"
                    type="danger"
                    >{{ $t("order.successfulTransaction") }}</span
                  >
                  <span v-else-if="orderRefund.status === 6" size="small">{{
                    $t("order.transactionFailed")
                  }}</span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <span
                    v-if="orderRefund.returnMoneySts === 1"
                    size="small"
                    type="danger"
                    >{{ $t("refundOrderDetail.buyerApply") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 2"
                    size="small"
                    type="danger"
                    >{{ $t("refundOrderDetail.sellerAccepts") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 3"
                    size="small"
                    type="danger"
                    >{{ $t("refundOrderDetail.buyerDelivery") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 4"
                    size="small"
                    type="danger"
                    >{{ $t("refundOrderDetail.sellerReceivesGoods") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 5"
                    size="small"
                    type="danger"
                    >{{ $t("order.refundsuccessfully") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 6"
                    size="small"
                    type="danger"
                    >{{ $t("order.withdrawsApplication") }}</span
                  >
<!--                  <span-->
<!--                    v-else-if="orderRefund.returnMoneySts === 7"-->
<!--                    size="small"-->
<!--                    type="danger"-->
<!--                    >{{ $t("refundOrderDetail.BusinessRefused") }}</span-->
<!--                  >-->
                  <span v-else size="small" type="danger">{{
                    $t("order.refundClosed")
                  }}</span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <div class="operate">
                    <div
                      class="default-btn text-btn"
                      @click="viewOrderHandle(orderRefund.orderNumber)"
                      >{{ $t("order.viewOrder") }}</div
                    >
                    <div
                      class="default-btn text-btn"
                      @click="toImbox(orderRefund)"
                      >{{ $t("order.contactBuyer") }}</div
                    >
                    <div
                      class="default-btn text-btn"
                      @click="
                        refundHandle(orderRefund.refundId, orderRefund.shopId)
                      "
                      >{{ $t("order.processingRefunds") }}</div
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
    <!-- 弹窗  -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <order-info
      v-if="orderInfoVisible"
      ref="OrderInfo"
      @refreshDataList="refreshChange"
    ></order-info>
  </div>
</template>

<script>
import AddOrUpdate from './refundOrderInfo'
import OrderInfo from './orderInfo'
import moment from 'moment'
import ProdPic from '@/components/prod-pic'
// import ConsignmentInfo from './consignment-info'
export default {
  name: 'order-orderRefund',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      showHeadScroll: false,
      resizeProportion: 1,
      sts: 0,
      dataForm: {},
      dateRange: [],
      searchForm: {},
      options: [{
        value: 1,
        label: this.$i18n.t('refundOrderDetail.buyerApply')
      },
      {
        value: 2,
        label: this.$i18n.t('refundOrderDetail.sellerAccepts')
      },
      {
        value: 3,
        label: this.$i18n.t('refundOrderDetail.buyerDelivery')
      },
      {
        value: 4,
        label: this.$i18n.t('refundOrderDetail.sellerReceivesGoods')
      },
      {
        value: 5,
        label: this.$i18n.t('order.refundsuccessfully')
      },
      // {
      //   value: 6,
      //   label: this.$i18n.t('refundOrderDetail.WithdrawalApply')
      // },
      // {
      //   value: 7,
      //   label: this.$i18n.t('refundOrderDetail.BusinessRefused')
      // },
      {
        value: -1,
        label: this.$i18n.t('order.refundClosed')
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
      }],
      refundType: [{
        value: 1,
        label: this.$i18n.t('refundOrderDetail.fullRefund')
      }, {
        value: 2,
        label: this.$i18n.t('refundOrderDetail.sigGoosRefund')
      }],
      applyType: [{
        value: 1,
        label: this.$i18n.t('order.onlyRefund')
      }, {
        value: 2,
        label: this.$i18n.t('order.refundAndMoney')
      }],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      returnMoneySts: null,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      orderInfoVisible: false
    }
  },
  computed: {
    // 二级菜单折叠状态
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    }
  },
  components: {
    OrderInfo,
    AddOrUpdate,
    ProdPic
    // ConsignmentInfo
  },
  created () {
    // 携带参数查询
    this.searchForm = this.$route.query
  },
  activated () {
    // 携带参数查询
    // var query = this.$route.query
    // if (Object.keys(query).length > 0) {
    //   this.searchForm = this.$route.query
    //   this.sys = 0
    //   this.returnMoneySts = null
    //   this.getDataList(this.page)
    // }
    this.getDataList(this.page)
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)

    this.resizeProportion = window.outerHeight / window.innerHeight
    window.addEventListener('resize', function () {
      this.resizeProportion = window.outerHeight / window.innerHeight
    })
  },
  methods: {
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > (400 * this.resizeProportion)
    },

    /**
     * 获取数据列表
     */
    getDataList (page, newData = false) {
      let params = this.searchForm
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = {
          'current': page.currentPage,
          'size': page.pageSize,
          'orderNumber': params ? (params.orderNumber ? params.orderNumber : null) : null,
          'shopName': params ? (params.shopName ? params.shopName : null) : null,
          'returnMoneySts': this.returnMoneySts ? this.returnMoneySts : null,
          'refundSn': params ? (params.refundSn ? params.refundSn : null) : null,
          'orderType': params ? ((params.orderType || params.orderType === 0) ? params.orderType : null) : null,
          'applyType': params ? (params.applyType ? params.applyType : null) : null,
          'refundType': params ? (params.refundType ? params.refundType : null) : null,
          'startTime': this.dateRange ? (this.dateRange[0] ? this.dateRange[0] : null) : null, // 开始时间
          'endTime': this.dateRange ? (this.dateRange[1] ? this.dateRange[1] : null) : null // 结束时间
        }
      } else {
        this.theData.current = page.currentPage
        this.theData.size = page.pageSize
        this.theData.returnMoneySts = this.returnMoneySts ? this.returnMoneySts : null
      }
      this.$http({
        url: this.$http.adornUrl('/platform/orderRefund/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData))
      }).then(({ data }) => {
        data.records.forEach(order => {
          if (order.refundType === 1 && order.orderItems.length > 1) {
            let goodsNum = 0
            for (let i = 0; i < order.orderItems.length; i++) {
              const element = order.orderItems[i]
              // console.log(element)
              goodsNum += element.prodCount
            }
            order.goodsNum = goodsNum
          }
        })
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        this.sts = this.returnMoneySts ? this.returnMoneySts : 0
      })
    },
    orderRefundStatus (val) {
      this.returnMoneySts = val
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

    // 前往消息盒子
    toImbox (order) {
      window.open(location.href.split('#')[0] + '#/imBox?userId=' + order.userId + '&orderNumber=' + order.orderNumber, 'view_window')
    },

    /**
     * 导航选择状态
     */
    selectNav (e) {
      var sts = e.currentTarget.dataset.sts
      this.sts = parseInt(sts)
      this.returnMoneySts = this.sts === 0 ? null : parseInt(sts)
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    /**
     * 查看订单
     */
    viewOrderHandle (id) {
      // this.orderInfoVisible = true
      // this.$nextTick(() => {
      //   this.$refs.OrderInfo.init(id)
      // })
      this.$router.push({
        path: '/order-orderInfo',
        query: {
          orderNumber: id
        }
      })
    },
    /**
     * 处理退款
     */
    refundHandle (id, shopId) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id, shopId)
      // })
      this.$router.push({
        path: '/order-refundOrderInfo',
        query: {
          refundId: id,
          shopId
        }
      })
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
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
      var startTime = moment().add(startDay, 'days').startOf('days').format('LL')
      // 结束时间
      var endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.dateRange = [startTime, endTime]
    },
    // 清空按钮
    clear () {
      this.searchForm = {}
      this.dateRange = []
      this.returnMoneySts = null
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.el-button + .el-button {
  margin-left: 0 !important;
  display: block;
}
.operation-box {
  display: inline-block;
  margin-left: 30px;
}
</style>
<style lang="scss">
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.screening-conditions {
  display: block;
  padding: 20px;
  background: #f7f8fa;
  margin-bottom: 20px;
}
.screening-conditions.search-bar {
  padding-bottom: 0px;
}
.mod-order-order {
  .main {
    // .status-nav {
    //   position: relative;
    //   display: block;
    //   width: 100%;
    //   margin-bottom: 15px;
    //   // height: 40px;
    //   line-height: 40px;
    //   ul,
    //   li {
    //     list-style: none;
    //     padding: 0;
    //     margin: 0;
    //   }
    //   .nav-list-ul {
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     width: 70%;
    //   }
    //   .nav-list-ul li {
    //     overflow:hidden;
    //     white-space:nowrap;
    //     text-overflow:ellipsis;
    //   }
    //   .nav-list-ul li:hover {
    //     width:auto;
    //   }
    //   .nav-list-ul-en {
    //     background-color: red;
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     width: 100%;
    //   }
    //   .nav-list-ul-en li {
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //   }
    //   // .nav-list-ul-en li:hover {
    //   //   width: 170px;
    //   // }
    //   .nav-list-ul-zh {
    //     background-color: #2d8cf0;
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     width: 100%;
    //   }
    //   .nav-list-ul-zh li {
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //   }
    //   .nav-right {
    //     width: 68.5%;
    //     height: 45px;
    //     margin-left: 31.5%;
    //     border-bottom: 1px solid #ddd;
    //   }
    //   .nav-item-li {
    //     // display: flex;
    //     // align-items: center;
    //     // justify-content: center;
    //     // float: left;
    //     // // width: 10%;
    //     // // max-width: 85px;
    //     // padding: 0 20px;
    //     // height: 45px;
    //     // line-height: 1.5em;
    //     // background: #f7f8fa;
    //     // border-top: 1px solid #ddd;
    //     // border-right: 1px solid #ddd;
    //     // border-bottom: 1px solid #ddd;
    //     // text-align: center;
    //     // cursor: pointer;
    //     float: left;
    //     height: 40px;
    //     line-height: 40px;
    //     background: #f8f8f9;
    //     border: 1px solid #ddd;
    //     padding: 0 20px;
    //     margin: 0 -1px -1px 0;
    //     cursor: pointer;
    //   }
    //   .li-txt {
    //     text-overflow: -o-ellipsis-lastline;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     display: -webkit-box;
    //     -webkit-line-clamp: 2;
    //     -webkit-box-orient: vertical;
    //   }
    //   .nav-item-li:first-child {
    //     border-left: 1px solid #ddd;
    //   }
    //   .selected {
    //     background: #fff;
    //     border-bottom: none;
    //   }
    // }

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
      .nav-item-li {
        float: left;
        height: 40px;
        line-height: 40px;
        background: #f8f8f9;
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
    .status-nav-bottom{
      margin-bottom: 72px;
    }
    .tit {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      background: #F7F8FA;
      z-index: 11;
      height: 57px;
      font-weight: bold;
    }
    .fixed-top {
      position: fixed;
      width: calc(83.5% + var(--tit-width-incremental));
      top: 90px;
    }
    .column-title {
      text-align: center;
    }
    .transaction-price {
      text-align: right;
    }
  }
  .prod {
    margin-bottom: 15px;
  }
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit .product {
    width: 25%;
  }
  .prod-tit {
    padding: 10px;
    background: #f7f8fa;
    border-left: 1px solid #dddee1;
    border-top: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    box-sizing: border-box;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border-top: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    box-sizing: border-box;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    // width: 10%;
    border-right: 1px solid #dddee1;
    text-align: center;
    height: 100%;
  }
  .prod-cont .item span {
    display: block;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    align-items: inherit;
    flex-direction: column;
    height: 100%;
    border-right: 1px solid #dddee1;
  }
  .prod-name {
    // display: flex;
    // align-items: center;
    width: 55%;
    text-align: left;
    vertical-align: middle;
  }
  .prod-con {
    display: block;
    padding: 0 !important;
  }
  .prod-price {
    position: absolute;
    right: 10px;
    text-align: center;
  }
  .prod-price span {
    display: block;
  }
  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-name .prod-info {
    display: block;
    color: #80848f;
    margin-top: 30px;
  }
  .buyer-info {
    display: block;
    width: 100%;
  }
  .buyer-name {
    margin-bottom: 10px;
  }
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #dddee1;
  }
  .prod-cont .items.name:last-child {
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
        width: 80px;
        height: 80px;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .prod-name {
        flex: 1;
        margin-left: auto;
        width: 78% !important;
        .prod-con {
          text-align: left;
          width: 85% !important;
          display: block;
          padding: 0 !important;
          .prod-name-txt {
            padding-right: 10px;
            box-sizing: border-box;
            display: -webkit-box;
            word-break: break-word;
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
          }
        }
      }
    }
    // 赠品盒子
    .order-prod-item-give-con {
      width: 100%;
      padding: 10px 0 0 0;
      box-sizing: border-box;
      .giveaway-item {
        display: flex;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .giveaway-item-name {
        text-align: left;
        box-sizing: border-box;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        flex: 1;
        margin-right: auto;
      }
      .giveaway-item-sku-count {
        margin-left: 10px;
        color: #999;
        word-break: keep-all;
        max-width: 50%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
  .prod-image {
    margin-right: 20px;
    width: 80px;
    height: 80px;
  }
  .prod-image img {
    width: 100%;
    height: 100%;
  }
  .item span {
    display: block;
    margin-bottom: 10px;
  }
  .totalprice {
    margin-bottom: 10px;
  }
  .item .operate {
    color: #2d8cf0;
    height: auto;
    .default-btn + .default-btn {
      display: block;
      height: auto;
      margin-left: 0;
    }
  }
  .item .totalprice {
    color: #c00;
  }
  .prod .remark {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #e8f7f6;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    margin-bottom: 20px;
  }
  .buyer-remark {
    padding: 0 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
.empty {
  display: block;
  height: 200px;
  line-height: 200px;
  text-align: center;
  color: #aaa;
}
.marLeftNo {
  margin-left: 0 !important;
}
</style>
<style scoped lang="scss">
div ::v-deep .el-form-item--small .el-form-item__content {
  display: flex;
  flex-wrap: wrap;
}
</style>
