<template>
  <div class="mod-refund-order order-refund">
    <div class="screening-conditions">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList(this.page)"
        label-width="auto"
        size="small"
      >
        <div>
          <!-- &nbsp;&nbsp;&nbsp; -->
          <el-form-item :label="this.$i18n.t('order.refundId') + ':'">
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

          <el-form-item :label="this.$i18n.t('order.typeOfRefund') + ':'">
            <template>
              <el-select
                v-model="searchForm.refundType"
                clearable
                :placeholder="this.$i18n.t('order.typeOfRefund')"
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

          <el-form-item :label="this.$i18n.t('order.afterSalesStatus') + ':'">
            <template>
              <el-select
                v-model="returnMoneySts"
                clearable
                :placeholder="this.$i18n.t('order.pleSelAfterSalesSta')"
                size="small"
                @change="handleReturnMoneyStsChange"
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
          <el-form-item :label="this.$i18n.t('order.number') + ':'">
            <el-input
              v-model="searchForm.orderNumber"
              :placeholder="this.$i18n.t('order.number')"
              clearable
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item :label="this.$i18n.t('order.orderType') + ':'">
            <template>
              <el-select
                v-model="searchForm.orderType"
                clearable
                :placeholder="this.$i18n.t('order.pleaseSelectOrderType')"
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

          <el-form-item :label="this.$i18n.t('order.applicationType') + ':'">
            <template>
              <el-select
                v-model="searchForm.applyType"
                clearable
                :placeholder="this.$i18n.t('order.pleaseChooseHowToApply')"
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
          <el-form-item :label="this.$i18n.t('order.createTime') + ':'">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('time.start')"
              :end-placeholder="this.$i18n.t('time.end')"
            ></el-date-picker>
            <div class="select-time-btn" :class="{ 'is-active': timeActive === 1 }" @click="setDateRange(1)">{{
              $t("time.t")
            }}</div>
            <div class="select-time-btn" :class="{ 'is-active': timeActive === 2 }" @click="setDateRange(2)">{{
              $t("time.y")
            }}</div>
            <div class="select-time-btn" :class="{ 'is-active': timeActive === 3 }" @click="setDateRange(3)">{{
              $t("time.n")
            }}</div>
            <div class="select-time-btn" :class="{ 'is-active': timeActive === 4 }" @click="setDateRange(4)">{{
              $t("temp.m")
            }}</div>
          </el-form-item>
          <el-form-item>
            <div
              class="default-btn primary-btn"
              @click="searchChange(true)"
              >{{ $t("order.query") }}</div>
            <div
              class="default-btn"
              @click="clear()"
              >{{ $t("shop.resetMap") }}</div>
          </el-form-item>
        </div>
      </el-form>
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
              {{ $t('order.buyerApplication') }}
            </li>
            <li
              :class="['nav-item', activeName == 2 ? 'selected' : '']"
              data-sts="2"
              @click="selectNav($event)"
            >
              {{ $t('order.sellerAccepts') }}
            </li>
            <li
              :class="['nav-item', activeName == 3 ? 'selected' : '']"
              data-sts="3"
              @click="selectNav($event)"
            >
              {{ $t("order.buyShipment") }}
            </li>
            <li
              :class="['nav-item', activeName == 4 ? 'selected' : '']"
              data-sts="4"
              @click="selectNav($event)"
            >
              {{ $t("order.sellerReceipt") }}
            </li>
            <li
              :class="['nav-item', activeName == 5 ? 'selected' : '']"
              data-sts="5"
              @click="selectNav($event)"
            >
              {{ $t("order.refundsuccessfully") }}
            </li>
            <li
              :class="['nav-item', activeName == 6 ? 'selected' : '']"
              data-sts="6"
              @click="selectNav($event)"
            >
              {{ $t("order.refundClosed") }}
            </li>
          </ul>
          <ul class="nav-right"></ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit']">
          <el-row style="width: 100%">
            <el-col :span="6" id="prod-info-title">
              <span class="item product">{{ $t("home.product") }}</span>
            </el-col>
            <el-col :span="3" id="price-title" class="transaction-price">
              <span class="item">{{
                $t("order.commodityUnitPriceYuanQuantity")
              }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item"
                >{{ $t("order.returnAmount") }}({{ $t("admin.dollar") }})</span
              >
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.commodityCondition") }}</span>
            </el-col>
            <el-col :span="this.$t('time.tip') === 'to' ? 2: 3" class="column-title">
              <span class="item">{{ $t("order.typeOfRefund") }}</span>
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
              <span class="item product">{{ $t("home.product") }}</span>
            </el-col>
            <el-col :span="3" id="price-title" class="transaction-price">
              <span class="item">{{
                $t("order.commodityUnitPriceYuanQuantity")
              }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item"
                >{{ $t("order.returnAmount") }}({{ $t("admin.dollar") }})</span
              >
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.commodityCondition") }}</span>
            </el-col>
            <el-col :span="this.$t('time.tip') === 'to' ? 2: 3" class="column-title">
              <span class="item">{{ $t("order.typeOfRefund") }}</span>
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
          v-for="orderRefund in dataList"
          :key="orderRefund.refundId"
          style="margin-bottom: 15px"
        >
          <div class="prod-tit">
            <div>
              <span>{{ $t("order.refundId") }}：{{ orderRefund.refundSn }}</span>
              <span>{{ $t("order.number") }}:{{ orderRefund.orderNumber }}</span>
              <span>{{ $t("live.applyTime") }}：{{ orderRefund.applyTime }}</span>
            </div>
            <div>
              <!-- <span
                >{{ $t("formData.shop") }}{{ $t("publics.name") }}：{{
                  orderRefund.shopName
                }}</span
              > -->
            </div>
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="$t('language') == 'English' ?9 : 10" style="height: 100%">
                <div class="prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in orderRefund.orderItems"
                    :key="orderItem.orderItemId"
                  >
                    <div class="order-prod-item-info">
                      <div class="info">
                        <div class="prod-image">
                          <prod-pic
                            :pic="orderItem.pic"
                          ></prod-pic>
                        </div>
                        <div class="prod-name">
                          <dir class="prod-con">
                            <div class="prod-name-txt">
                              {{ orderItem.prodName }}
                            </div>
                            <div v-if="orderItem.skuName" class="prod-name-sku">
                              {{ orderItem.skuName }}
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
                                  ? $t("order.spikeOrder"):""
                              }}
                            </div>
                            <div
                              class="order-status"
                              v-if="orderRefund.orderMold === 1"
                            >
                              {{ $t("order.virtualOrder") }}
                            </div>
                            <div
                              class="order-status"
                              v-if="orderItem.giveawayOrderItemId !== null"
                            >
                              {{ $t("order.giveawayPord") }}
                            </div>
                            <!-- <div
                              class="order-status"
                              v-if="orderRefund.refundStatus"
                            >
                              {{
                                [
                                  "",
                                  $t("order.requestARefund"),
                                  $t("order.refundsuccessfully"),
                                  $t("order.refundsuccessfully"),
                                  $t("order.refundFailed"),
                                ][orderRefund.refundStatus]
                              }}
                            </div> -->
                          </dir>
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
                    <span class="totalprice">{{
                      orderRefund.refundAmount.toFixed(2) +
                      " + " +
                      orderRefund.refundScore +
                      $t("order.integral")
                    }}</span>
                    <div>
                      <span
                        >{{ orderRefund.goodsNum
                        }}{{ $t("marketing.item") }}</span
                      >
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div class="buyer-info">
                    <div style="margin-bottom: 4px">{{
                      orderRefund.applyType === 1
                        ? $t("order.onlyRefund")
                        : $t("order.refunds")
                    }}</div>
                    <div class="totalprice" style="color: #333333;margin-bottom: 4px">{{
                      orderRefund.isReceiver
                        ? $t("order.goodsReceived")
                        : $t("order.goodsNotReceived")
                    }}</div>
                    <div class="totalprice"  style="color: #333333;margin-bottom: 4px">{{
                      orderRefund.buyerReason
                    }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <div>
                    <span v-if="orderRefund.refundType === 1">{{
                      $t("order.wholeGoodsRefund")
                    }}</span>
                    <span v-if="orderRefund.refundType === 2">{{
                      $t("order.singleItemRefund")
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
                    >{{ $t("order.buyerApplication") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 2"
                    size="small"
                    type="danger"
                    >{{ $t("order.sellerAccepts") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 3"
                    size="small"
                    type="danger"
                    >{{ $t("order.buyShipment") }}</span
                  >
                  <span
                    v-else-if="orderRefund.returnMoneySts === 4"
                    size="small"
                    type="danger"
                    >{{ $t("order.sellerReceipt") }}</span
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
<!--                    >{{ $t("order.refusedRefund") }}</span-->
<!--                  >-->
                  <span v-else size="small" type="danger">{{
                    $t("order.refundClosed")
                  }}</span>
                </div>
              </el-col>
              <el-col :span="$t('language') == 'English' ?3 : 2" style="height: 100%">
                <div class="item">
                  <div class="operate">
                    <div
                      class="default-btn text-btn operate-btn"
                      @click="viewOrderHandle(orderRefund.orderNumber)"
                      >{{ $t("order.viewOrder") }}</div
                    >
                    <div
                      class="default-btn text-btn operate-btn"
                      @click="toImbox(orderRefund)"
                      >{{ $t("order.contactBuyer") }}</div
                    >
                    <div
                      :class="['default-btn','text-btn','operate-btn', $t('language') == 'English' ?'btn-height':'']"
                      v-if="isAuth('admin:orderRefund:update') && orderRefund.returnMoneySts !== 5 && orderRefund.returnMoneySts !== -1"
                      @click="
                        refundHandle(orderRefund.refundId, orderRefund.shopId)
                      "
                      >{{ $t("order.processingRefunds") }}</div
                    >
                    <div
                      class="default-btn text-btn operate-btn"
                      v-if="orderRefund.returnMoneySts === 5 || orderRefund.returnMoneySts === -1"
                      @click="
                        refundHandle(orderRefund.refundId, orderRefund.shopId)
                      "
                      >{{ $t("order.lookRefunds") }}</div
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
  </div>
</template>

<script>
import moment from 'moment'
import ProdPic from '@/components/prod-pic'
export default {
  name: 'order-orderRefund',
  components: {
    ProdPic
  },
  data () {
    return {
      showHeadScroll: false,
      sts: 0,
      dataForm: {},
      dateRange: [],
      searchForm: [],
      options: [{
        value: 1,
        label: this.$i18n.t('order.buyerApplication')
      },
      {
        value: 2,
        label: this.$i18n.t('order.sellerAccepts')
      },
      {
        value: 3,
        label: this.$i18n.t('order.buyShipment')
      },
      {
        value: 4,
        label: this.$i18n.t('order.sellerReceipt')
      },
      {
        value: 5,
        label: this.$i18n.t('order.refundsuccessfully')
      },
      // {
      //   value: 7,
      //   label: this.$i18n.t('admin.merRefuseRefund')
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
        label: this.$i18n.t('order.wholeOrderRefund')
      }, {
        value: 2,
        label: this.$i18n.t('order.singleItemRefund')
      }],
      applyType: [{
        value: 1,
        label: this.$i18n.t('order.onlyRefund')
      }, {
        value: 2,
        label: this.$i18n.t('order.refunds')
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
      activeName: '0',
      timeActive: null,
      priceWidth: '109px',
      infoWidth: '400px'
    }
  },
  computed: {
    // 二级菜单折叠状态
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    }
  },
  created () {
    // 携带参数查询
    this.searchForm = this.$route.query
    if (this.$route.query.returnMoneySts) {
      this.returnMoneySts = Number(this.$route.query.returnMoneySts)
    }
    // this.getDataList(this.page)
  },
  activated () {
    this.getDataList(this.page)
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
    setTimeout(() => {
      this.getEleWidth()
    })
    window.onresize = () => {
      return (() => {
        setTimeout(() => {
          this.getEleWidth()
        })
      })()
    }
  },
  methods: {
    /**
     * 订单状态修改
     */
    handleReturnMoneyStsChange (val) {
      this.activeName = (val > 0 ? val : 6) + ''
      this.searchForm.returnMoneySts = val === 6 ? -1 : val
      this.getDataList(this.page)
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
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > 400
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
        url: this.$http.adornUrl('/order/refund/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        this.sts = this.returnMoneySts ? this.returnMoneySts : 0
        this.activeName = (this.sts === -1 ? 6 : this.sts) + ''
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
    /**
     * 导航选择状态
     */
    selectNav (e) {
      var sts = e.currentTarget.dataset.sts
      this.sts = parseInt(sts)
      this.returnMoneySts = this.sts === 0 ? null : this.sts === 6 ? -1 : parseInt(sts)
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    /**
     * 查看订单
     */
    viewOrderHandle (id) {
      this.$router.push({
        path: '/order-orderInfo',
        query: {
          orderNumber: id
        }
      })
    },
    // 前往消息盒子
    toImbox (order) {
      window.open(location.href.split('#')[0] + '#/imBox?userId=' + order.userId + '&orderNumber=' + order.orderNumber, 'view_window')
    },
    /**
     * 处理退款
     */
    refundHandle (id, shopId) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
      this.$router.push({
        path: '/order-refundOrderInfo',
        query: {
          refundId: id
        }
      })
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
    showConsignmentInfo () {
      this.consignmentInfoVisible = true
      this.$nextTick(() => {
        this.$refs.consignmentInfo.init()
      })
    },
    // 清空按钮
    clear () {
      this.searchForm = {}
      this.dateRange = []
      this.returnMoneySts = null
      this.timeActive = null
    },
    // 刷新回调用
    refreshChange () {
      this.page.current = 1
      this.getDataList(this.page)
    },
    // 搜索查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
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
  padding: 25px 25px 0 25px !important;
  background: #f7f8fa;
  margin-bottom: 20px;
}
.operation-box {
  display: inline-block;
}
.mod-refund-order.order-refund {
  .el-form-item {
    margin-top: 0;
    margin-bottom: 25px;
  }
  .screening-conditions {
    padding-bottom: 0;
  }
}
.mod-refund-order {
  .main {
    .order-status-nav {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      height: 40px;
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
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-list-ul {
        position: absolute;
        left: 0;
        top: 0;
        width: 90%;
      }
      .nav-list-ul li {
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .nav-list-ul li:hover {
        width:auto;
      }
      .nav-list-ul-en {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .nav-list-ul-en li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nav-list-ul-en li:hover {
        width: 170px;
      }
      .nav-list-ul-zh {
        position: absolute;
        left: 0;
        top: 0;
        width: 60%;
      }
      .nav-list-ul-zh li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .nav-list-ul-zh li:hover {
        width: 100px;
      }
      .nav-right {
        width: 61.5%;
        height: 40px;
        margin-left: 38.5%;
        border-bottom: 1px solid #ddd;
      }
      .nav-item-li {
        float: left;
        width: 10%;
        font-size: 14px;
        max-width: 120px;
        height: 40px;
        line-height: 40px;
        background: #f7f8fa;
        border-top: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-align: center;
        cursor: pointer;
      }
      .nav-item-li:first-child {
        border-left: 1px solid #ddd;
      }
      .selected {
        background: #fff;
        border-bottom: none;
      }
    }
    .tit {
      margin-bottom: 15px;
      background: #f7f8fa;
      z-index: 11;
      height: 57px;
      font-weight: bold;
    }
    .fixed-top {
      position: fixed;
      width: calc(83.5% + var(--tit-width-incremental));
      top: 90px;
      // left: 267px;
    }
    .column-title {
      text-align: center;
    }
    .transaction-price {
      text-align: center;
    }
  }
  // .prod {
  //   margin-bottom: 15px;
  // }
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
    background: #F7F8FA;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: 1px solid #EBEDF0;
    border-top: 1px solid #EBEDF0;
    border-right: 1px solid #EBEDF0;
    box-sizing: border-box;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border: 1px solid #EBEDF0;
    color: #495060;
    box-sizing: border-box;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    // justify-content: center;
    padding: 10px;
    // width: 10%;
    text-align: left;
    height: 100%;
    border-right: 1px solid #eee;
  }
  .prod-con .prod-name-txt {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  button.revise-btn {
    margin-top: 10px;
  }
  .el-button--text {
    padding-top: 0;
    padding-bottom: 0;
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
    border-right: 1px solid #eee;
  }
  .prod-name {
    width: 55%;
    text-align: left;
  }
  .prod-con {
    display: block;
    padding: 0 !important;
  }
  .prod-price {
    width: 28%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    right: 0 !important;
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
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
  }
  .prod-cont .items .info{
    display: flex;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    // height: 100px;
    border-bottom: 1px solid #dddee1;
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
        width: 100% !important;
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
      padding: 10px 50px 0 0;
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
        width: auto;
      }
    }
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
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
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .operate .default-btn + .default-btn {
    display: block;
    margin-top: 10px;
    margin-left: 0;
  }
  .item .totalprice {
    color: #ff4141;
    margin-bottom: 4px;
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
  .empty {
    display: block;
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #aaa;
  }
  .buyer-info {
    display: block;
    width: 100%;
  }
  .text-btn {
    margin-left: 0;
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
</style>
<style scoped>
.screening-conditions ::v-deep .el-form-item--small .el-form-item__content .el-select,
.screening-conditions ::v-deep .el-form-item--small .el-form-item__content .el-input {
  width: 200px;
}
.screening-conditions ::v-deep .el-range-editor--small .el-range-separator {
  line-height: 32px;
}
div ::v-deep .el-tabs__active-bar {
  width: 0 !important;
}
div ::v-deep .el-tabs__item {
  padding: 0 20px !important;
  min-width: 68px;
  width: auto;
  text-align: center;
}

.select-time-btn {
  margin-right: 20px;
  display: inline-block;
  color: #AAAAAA;
  font-size: 14px;
  cursor:pointer;
}
.select-time-btn:last-child {
  margin-right: 0;
}
.select-time-btn.is-active {
  color: #155BD4;
}
.operate-btn {
  margin: 0 !important;
}
.el-form--inline .el-form-item {
  margin-right: 20px;
}
div ::v-deep .el-tabs__nav-wrap::after{
  height: 1px;
}

@media (max-width:1660px) {
  .btn-height {
    line-height: 25px;
  }
}
</style>
