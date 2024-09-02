<template>
  <div class="mod-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
      擅自窃用，必将追究法律责任！！！</p> -->

    <div v-if="shopStatusInfo.shopStatus !== null && shopStatusInfo.shopStatus !== 1" class="shop-inf-imperfect-tips">
      <div v-if="shopStatusInfo.shopStatus === 2">
        <div>
          <i class="el-icon-warning"/>
          {{ $t('shopProcess.yourStoreIsOfflineBecauseOf') }}
          <span>{{ shopStatusInfo.offlineReason }}</span>
          ，{{ $t('shopProcess.onlineShopTips') }}
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 0">
        <div>
          <i class="el-icon-error"/>
          {{ $t('shopProcess.shopStopReason') }}
          <span>{{ shopStatusInfo.closedReason }}</span>
          ，{{ $t('shopProcess.shopStopTips') }}
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 5 || shopStatusInfo.shopStatus === 3">
        <div>
          <i class="el-icon-warning"/>
          {{ $t('shopProcess.applyingOnline') }}，
          <span>{{ $t('shopProcess.shopIsUnderReview') }}</span>
        </div>
      </div>
    </div>

    <!-- 数据 -->
    <!-- 基本信息 -->
    <div class="order-all-num white-basic">
      <div class="title-basic">{{ $t('shopProcess.basicInfo') }}</div>
      <div class="row-bg">
        <!-- <el-col :span="15" class="col-box" style="height:100%;"> -->
        <div class="num-item-box">
          <div class="wait-payment-num order-num-item">
            <div class="item-box">
              <div class="words">{{ $t('home.basicInfoA') }}</div>
              <div class="number"><span class="text">{{ basicInfo.prodNum }}</span></div>
              <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">较上月{{$t("home.payCustomers")}}</span>
                </div> -->
            </div>
            <div class="item-img">
              <img src="~@/assets/img/home/wait-payment-num.png">
            </div>
          </div>
        </div>
        <div class="num-item-box">
          <div class="wait-delivery-num order-num-item">
            <div class="item-box">
              <div class="words">{{ $t('home.basicInfoB') }}</div>
              <div class="number"><span class="text">{{ basicInfo.userNum }}</span></div>
              <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
            </div>
            <div class="item-img">
              <img src="~@/assets/img/home/wait-delivery-num.png">
            </div>
          </div>
        </div>
        <div class="num-item-box">
          <div class="wait-receiving-goods-num order-num-item">
            <div class="item-box">
              <div class="words">{{ $t('home.basicInfoC') }}</div>
              <div class="number"><span class="text">{{ basicInfo.orderNum }}</span></div>
              <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
            </div>
            <div class="item-img">
              <img src="~@/assets/img/home/wait-receiving-goods-num.png">
            </div>
          </div>
        </div>
        <!-- </el-col> -->
        <!-- <el-col :span="9" class="col-box" style="height:100%;"> -->
        <div class="num-item-box">
          <div class="wait-evaluate-num order-num-item">
            <div class="item-box">
              <div class="words">{{ $t('home.basicInfoD') }}</div>
              <div class="number"><span class="text">{{ basicInfo.shopNum }}</span></div>
              <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
            </div>
            <div class="item-img">
              <img src="~@/assets/img/home/wait-evaluate-num.png">
            </div>
          </div>
        </div>
        <div class="num-item-box">
          <div class="wait-after-sales-num order-num-item">
            <div class="item-box">
              <div class="words">{{ $t('home.basicInfoE') }}</div>
              <div class="number"><span class="text">{{ basicInfo.refundNum }}</span></div>
              <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
            </div>
            <div class="item-img">
              <img src="~@/assets/img/home/wait-after-sales-num.png">
            </div>
          </div>
        </div>
        <!-- </el-col> -->
      </div>
    </div>
    <!-- 基本信息end -->

    <!-- 今日待办 -->
    <div class="white-basic">
      <div class="title-basic">{{ $t('home.pendingToday') }}</div>
      <div class="abeyance-box">
        <div class="audit-violations order-num-item">
          <div class="item-img">
            <img src="~@/assets/img/home/audit-violations.png">
          </div>
          <div class="item-box">
            <div class="words">{{ $t('home.pendingTodayA') }}</div>
            <div class="number">{{ pendingToday.prodAuditNum }}</div>
          </div>
        </div>

        <div class="stores-to-audited order-num-item">
          <div class="item-img">
            <img src="~@/assets/img/home/stores-to-audited.png">
          </div>
          <div class="item-box">
            <div class="words">{{ $t('home.pendingTodayB') }}</div>
            <div class="number">{{ pendingToday.shopAuditNum }}</div>
          </div>
        </div>

        <div class="distribution-withdrawals order-num-item">
          <div class="item-img">
            <img src="~@/assets/img/home/distribution-withdrawals.png">
          </div>
          <div class="item-box">
            <div class="words">{{ $t('home.pendingTodayC') }}</div>
            <div class="number">{{ pendingToday.distributionAuditNum }}</div>
          </div>
        </div>

        <div class="withdraw-cash order-num-item">
          <div class="item-img">
            <img src="~@/assets/img/home/withdraw-cash.png">
          </div>
          <div class="item-box">
            <div class="words">{{ $t('home.pendingTodayD') }}</div>
            <div class="number">{{ pendingToday.withdrawalAuditNum }}</div>
          </div>
        </div>

      </div>
    </div>
    <!-- 今日待办end -->

    <!-- 实时概况 -->
    <div class="realtime-situation-box white-basic">
      <div class="title-basic">{{ $t('home.nowDate') }}
        <div class="select-date">
          <el-date-picker
            v-model="dateRangeParam"
            size="sime"
            type="date"
            value-format="yyyy-MM-dd"
            @change="getPlatformRealTimeOverview()"
            :placeholder="$t('tip.select') + $t('date.start')">
          </el-date-picker>
        </div>
      </div>
      <div class="real-time-content">
        <div class="item">
          <div class="word">{{ $t('home.ordersToday') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.ordersTodayTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentOrderNum }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.newMembersToday') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.newMembersTodayTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentUserNum }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.newStores') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.newStoresTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentShopNum }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.todayVisitors') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.todayVisitorsTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.todayVisitors }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.visitorsInTheLastSevenDays') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.visitorsInTheLastSevenDaysTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.firstSevenDayVisitors }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.realtimeSituationA') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.realtimeSituationATip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentPayAmount }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.realtimeSituationB') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.realtimeSituationBTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentProdNum }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.realtimeSituationC') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.realtimeSituationCTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.currentProdCommNum }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.realtimeSituationD') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.realtimeSituationDTip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.yesterdayVisitors }}</div>
        </div>
        <div class="item">
          <div class="word">{{ $t('home.realtimeSituationE') }}
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="max-width:500px">{{$t("home.realtimeSituationETip")}}</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="number">{{ nowDateForm.firstThirtyDayVisitors }}</div>
        </div>
        <div class="item">
          <div class="word">服饰类立减剩余数量</div>
          <div class="number">{{ clothingNum ? clothingNum : 0 }}</div>
        </div>
        <div class="item">
          <div class="word">餐饮类团购立减剩余数量</div>
          <div class="number">{{ restaurantNum ? restaurantNum : 0  }}</div>
        </div>
      </div>
    </div>

    <!-- 底部流量走势图 -->
    <div class="refund-plate">
      <div class="ranking-box">
        <!-- 流量走势 -->
        <div class="refund-rate-box">
          <div class="refund-chart-msg">
            <div class="msg-tit-txt">
              <p class="msg-tit">{{ $t('home.Traffictrend') }}</p>

              <div>
                <el-date-picker size="small" v-model="trendDataRange1" type="daterange"
                                :range-separator="$t('date.tip')" value-format="yyyy-MM-dd"
                                :start-placeholder=this.trendDataRange1[0]
                                :end-placeholder=this.trendDataRange1[1] @change="trendRangeChange(1)">
                </el-date-picker>
              </div>

              <div class="refund-tip">
                <div><i class="traffictrendB"></i>{{ $t('home.TraffictrendB') }}</div>
                <div><i class="traffictrendA"></i>{{ $t('home.TraffictrendA') }}</div>
              </div>
            </div>
          </div>
          <div style="height: 100%">
            <!-- 图表 -->
            <div class="refund-chart" id="refPer-chart" style="width: 100%; height: 300px"></div>
            <div class="empty" v-if="!sellerMotorList.userNum.length">{{ $t('order.noData') }}</div>
            <!--/ 图表 -->
          </div>
        </div>
        <!-- 流量走势end -->

        <!-- 热卖店铺TOP10 -->
        <div class="ranking-left">


          <div class="ranking-title">{{
              $t('home.TraffictrendE')
            }}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <span>
              <el-date-picker size="small" v-model="shopDateRange" type="datetimerange"
                              :range-separator="$t('date.tip')" value-format="yyyy-MM-dd HH:mm:ss"
                              :start-placeholder=this.shopDateRange[0]
                              :end-placeholder=this.shopDateRange[1] @change="shopListTimeChange">
              </el-date-picker>
            </span>
          </div>


          <table class="table" cellpadding="0" cellspacing="0">
            <tr class="table-tit gray">
              <td class="table-tit-item ranks padLeft">{{ $t('home.rank') }}</td>
              <td class="table-tit-item prods">{{ $t('prodList.shopName') }}</td>
              <td class="table-tit-item refs money-padleft">{{ $t('home.turnover') }}</td>
              <td class="table-tit-item prop">{{ $t('home.sales') }}</td>
            </tr>
            <tr v-for="(item, index) in hotShopList" :key="index" class="table-tit">
              <td class="padLeft">{{ index + 1 }}</td>
              <td>{{ item.shopName }}</td>
              <td class="money-padleft">￥{{ item.amount }}</td>
              <td>{{ item.sales }}</td>
            </tr>
          </table>
          <div class="empty" v-if="!hotShopList.length">{{ $t('order.noData') }}</div>
        </div>
        <!--/ 热卖店铺TOP10 end -->
      </div>


      <!-- 交易趋势 -->
      <div class="refund-chart-box">
        <div class="successed-refund">
          <div class="refund-chart-msg">
            <div class="msg-tit-txt">
              <p class="msg-tit">{{ $t('home.TraffictrendC') }}</p>
              <div>
                <el-date-picker size="small" v-model="trendDataRange2" type="daterange"
                                :range-separator="$t('date.tip')" value-format="yyyy-MM-dd"
                                :start-placeholder=this.trendDataRange2[0]
                                :end-placeholder=this.trendDataRange2[1] @change="trendRangeChange(2)">
                </el-date-picker>
              </div>
              <div class="refund-tip">
                <div><i class="traffictrendA"></i>{{ $t('home.TraffictrendD') }}</div>
              </div>
            </div>
          </div>
          <div style="height: 100%">
            <!-- 图表 -->
            <div class="refund-chart" id="ref-chart" style="width: 100%; height: 300px"></div>
            <!--/ 图表 -->
            <div class="empty" v-if="!tradeTendencyList.length">{{ $t('order.noData') }}</div>
          </div>
        </div>

        <!-- 热卖商品TOP10-->
        <div class="ranking-right" style="height: auto">
          <div class="ranking-title">{{
              $t('home.TraffictrendF')
            }}&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <span>
              <el-date-picker size="small" v-model="prodDateRange" type="datetimerange"
                              :range-separator="$t('date.tip')" value-format="yyyy-MM-dd HH:mm:ss"
                              :start-placeholder=this.prodDateRange[0]
                              :end-placeholder=this.prodDateRange[1] @change="prodListTimeChange">
              </el-date-picker>
            </span>
          </div>


          <table class="table table-con">
            <tr class="table-tit gray">
              <td class="table-tit-item rank padLeft">{{ $t('home.rank') }}</td>
              <td class="table-tit-item prod">{{ $t('product.prodName') }}</td>
              <td class="table-tit-item ref money-padleft">{{ $t('home.paidAmount') }}</td>
              <td class="table-tit-item ref">{{ $t('home.sales') }}</td>
            </tr>
            <tr v-for="(item, index) in hotProdList" :key="index">
              <td class="padLeft">{{ index + 1 }}</td>
              <td class="line-clamp-one" style="word-break: break-word">{{ item.prodName }}</td>
              <td class="money-padleft">￥{{ item.amount }}</td>
              <td>{{ item.sales }}</td>
            </tr>
          </table>
          <div class="empty" v-if="!hotProdList.length">{{ $t('order.noData') }}</div>
        </div>
        <!--/ 热卖商品TOP10end-->
      </div>

    </div>
    <!-- /底部流量走势图 -->
  </div>
</template>

<script>
import Big from 'big.js'
import moment from 'moment'
import {formatDate} from '@/utils/date-util.js'

// let elementResizeDetectorMaker = require('element-resize-detector')
export default {
  filters: {
    dataFormat (value) {
      return (value * 100).toFixed(2).valueOf()
    },
    conversionActual (val) {
      // 精度运算-除法
      if (val == null) {
        return ''
      }
      return new Big(val).div(100).toFixed(2).valueOf()
    }
  },

  data () {
    return {
      value: [0, 1],
      sumPayActualTotal: 0.00,
      dataForm: {},
      realTimeDataXAxis: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'], // 实时数据的x轴数据
      payYesterdayActualTotal: [],
      dataArray: [],
      timeArray: [],
      dataInfo: {},
      rate: [],
      dateOfMonthAgo: '',
      today: '',
      nowDate: '',
      nowTime: '',
      refundRateInfo: [],
      refundRankForActualTotal: [],
      refundRankForCause: [],
      dataList: [],
      noticeData: {},
      orderStateCount: {},
      viewDialog: false,
      // echartsWidth: null,
      observer: null,
      firedNum: 0,
      recordOldValue: { // 记录下旧的宽高数据，避免重复触发回调函数
        width: '0',
        height: '0'
      },
      entiretyChat: null, // 整体看版
      refChart: null, // 成功退款金额
      refPerChart: null, // 退款率

      basicInfo: {}, // 基本信息
      pendingToday: {}, // 今日待办
      nowDateForm: {}, // 实时概况
      hotProdList: [], // 热卖商品
      hotShopList: [], // 热卖店铺
      sellerMotorList: {
        userNum: [],
        visitNum: []
      }, // 流量趋势
      tradeTendencyList: [], // 交易趋势
      axisTimelist1: [], // 折线图时间
      axisTimelist2: [], // 折线图时间

      // 店铺状态信息
      shopStatusInfo: {
        accountStatus: 0, // 账号状态， 1:启用 0:禁用 -1:删除
        shopStatus: null, // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中
        offlineStatus: 0, // 下线状态 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过
        offlineReason: '', // 下线原因
        contractStartTime: '', // 签约起始时间
        contractEndTime: '', // 签约终止时间
        closedReason: '' // 停业原因
      },
      // 时间范围
      trendDataRange1: [],
      trendDataRange2: [],
      shopDateRange: [],
      prodDateRange: [],

      dateRangeParam: moment().startOf('day').format('YYYY-MM-DD'),
      clothingNum: 0,
      restaurantNum: 0
    }
  },
  mounted: function () {
    this.getPlatformStatistics() // 获取首页的基本信息 今日待办 实时概况
    // let erd = elementResizeDetectorMaker()
    // erd.listenTo(document.getElementById('entirety-data-chart'), this.resizeFunc)

    this.timeFormat()
    this.shopListTimeChange()
    this.prodListTimeChange()
    this.getReductionResidueNum()

    // formatTime
  },
  updated () {
    // this.getpayInfo()
  },
  methods: {

    // 获取服饰类、餐饮类立减剩余数量
    getReductionResidueNum() {
      if(!this.dateRangeParam) return
      this.$http({
        url: this.$http.adornUrl('/platform/statistics/getReductionResidueNum'),
        params: {},
        method: 'GET'
      }).then(({data}) => {
        this.clothingNum = data.clothingNum
        this.restaurantNum = data.restaurantNum
      })
    },

    resizeFunc () {
      this.$nextTick(() => {
        // 使echarts尺寸重置
        this.entiretyChat.resize()
        this.refChart.resize()
        this.refPerChart.resize()
      })
    },

    // 查询指定日期间隔内的数据
    dateInterval () {
      this.$http({
        url: this.$http.adornUrl('/platform/notice/info/' + this.noticeData.id),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.noticeData = data
      })
    },

    // 日期查询首页实时概况
    getPlatformRealTimeOverview() {
      if(!this.dateRangeParam) return
      this.$http({
        url: this.$http.adornUrl('/platform/statistics/platformRealTimeOverview'),
        params: {
          startTime: this.dateRangeParam
        },
        method: 'GET'
      }).then(({data}) => {
        this.nowDateForm = {
          currentOrderNum: data.currentOrderNum, // 今日订单数
          currentUserNum: data.currentUserNum, // 今日新增会员数
          currentShopNum: data.currentShopNum, // 今日新增店铺数
          todayVisitors: data.todayVisitors, // 今日访客数
          firstSevenDayVisitors: data.firstSevenDayVisitors, // 前七天访客数
          currentPayAmount: data.currentPayAmount, // 今日交易额
          currentProdNum: data.currentProdNum, // 今日新增商品数
          currentProdCommNum: data.currentProdCommNum, // 今日新增评论数
          yesterdayVisitors: data.yesterdayVisitors, // 昨日访客数
          firstThirtyDayVisitors: data.firstThirtyDayVisitors // 前30天访客数
        }
      })
    },

    // 获取首页的基本信息 今日待办 实时概况
    getPlatformStatistics () {
      this.$http({
        url: this.$http.adornUrl('/platform/statistics/getPlatformStatistics'),
        method: 'GET'
      }).then(({data}) => {
        // basicInfo: {}, // 基本信息
        // pendingToday: {}, // 今日待办
        // nowDateForm: {}, // 实时概况
        // 基本信息
        this.basicInfo = {
          orderNum: data.orderNum, // 订单数量
          orderNumRatio: data.orderNumRatio, // 提升比例
          prodNum: data.prodNum,
          prodNumRatio: data.prodNumRatio,
          refundNum: data.refundNum,
          refundNumRatio: data.refundNumRatio,
          shopNum: data.shopNum,
          shopNumRatio: data.shopNumRatio,
          userNum: data.userNum,
          userNumRatio: data.userNumRatio
        }
        this.pendingToday = {
          prodAuditNum: data.prodAuditNum, // 商品违规审核数量
          shopAuditNum: data.shopAuditNum, // 待审核店铺数量
          distributionAuditNum: data.distributionAuditNum, // 待审核分销提现
          withdrawalAuditNum: data.withdrawalAuditNum // 待审核提现
        }
        this.nowDateForm = {
          currentOrderNum: data.currentOrderNum, // 今日订单数
          currentUserNum: data.currentUserNum, // 今日新增会员数
          currentShopNum: data.currentShopNum, // 今日新增店铺数
          todayVisitors: data.todayVisitors, // 今日访客数
          firstSevenDayVisitors: data.firstSevenDayVisitors, // 前七天访客数
          currentPayAmount: data.currentPayAmount, // 今日交易额
          currentProdNum: data.currentProdNum, // 今日新增商品数
          currentProdCommNum: data.currentProdCommNum, // 今日新增评论数
          yesterdayVisitors: data.yesterdayVisitors, // 昨日访客数
          firstThirtyDayVisitors: data.firstThirtyDayVisitors // 前30天访客数
        }
        // this.hotProdList = data.hotProdList
        // this.hotShopList = data.hotShopList

        // 趋势视图
        this.trendStatisticsList = data.trendStatisticsList

        // 流量趋势
        // 交易趋势
        data.trendStatisticsList.forEach(element => {
          this.axisTimelist1.push(element.date)
          this.axisTimelist2.push(element.date)
          this.sellerMotorList.userNum.push(element.userNum)
          this.sellerMotorList.visitNum.push(element.visitNum)
          this.tradeTendencyList.push(element.amount)
        })
        this.getRefPerEchartData() // 流量趋势图
        this.getRefSumEchartData() // 交易趋势图
      })
    },

    // 查看单个平台公告
    viewNoticeDetail (id) {
      this.noticeData.id = id || 0
      this.viewDialog = true
      this.$nextTick(() => {
        if (this.noticeData.id) {
          this.$http({
            url: this.$http.adornUrl('/platform/notice/info/' + this.noticeData.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.noticeData = data
          })
        }
      })
    },

    // 交易趋势折线图
    getRefSumEchartData () {
      this.refChart = this.$echarts.init(document.getElementById('ref-chart'))
      const option = {
        tooltip: {
          trigger: 'axis'
          // backgroundColor: '#fff',
          // padding: 8,
          // textStyle: { // 提示框浮层的文本样式。
          //   fontSize: '12px',
          //   fontWeight: 400,
          //   color: '#33333',
          //   opacity: 1
          // },
          // extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);width:180px;height:62px',
          // formatter: function (params) {
          //   // return arg.name +
          //   // // return '反弹率:' + arg[0].data + '%'

          //   // params数组可以了解一下，一条线和多条线都是数组
          //   var html = ''
          //   for (var i in params) {
          //     var param = params[i]
          //      // echarts日期格式化api
          //     var date = param.name
          //     html += `<span style="color: #999999">${date}</span><br /><div style="margin-top: 12px;display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: #0058FF;margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.data}</span></div>`
          //   }
          //   return html
          // }
        },
        grid: {
          left: 20,
          right: 20,
          top: 55,
          width: '93%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.axisTimelist2, // x轴时间
          nameTextStyle: {
            color: 'red'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#E0E6F1'],
              width: 1,
              type: 'solid'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: this.$i18n.t('home.transactionAmount'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#29CB97',
                lineStyle: {
                  color: '#29CB97'
                }
              }
            },
            data: this.tradeTendencyList // 具体数值
          }
        ]
      }
      option && this.refChart.setOption(option)
      window.addEventListener('resize', () => {
        this.refChart.resize()
      })
    },
    // 流量趋势折线图
    getRefPerEchartData () {
      this.refPerChart = this.$echarts.init(document.getElementById('refPer-chart'))
      const option = {
        tooltip: {
          trigger: 'axis'
          // backgroundColor: '#fff',
          // padding: 8,
          // textStyle: { // 提示框浮层的文本样式。
          //   fontSize: '12px',
          //   fontWeight: 400,
          //   color: '#33333',
          //   opacity: 1
          // },
          // extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);width:180px;height:182px',
          // formatter: function (params) {
          //   // return arg.name +
          //   // // return '反弹率:' + arg[0].data + '%'

          //   // params数组可以了解一下，一条线和多条线都是数组
          //   var html = ''
          //   for (var i in params) {
          //     console.log(i, '2222')
          //     var param = params[i]
          //      // echarts日期格式化api
          //     var date = param.name
          //     html += `<span style="color: #999999">${date}</span><br /><div style="margin-top: 12px;display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: #0058FF;margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.data}</span></div>`
          //   }
          //   return html
          // }
        },
        grid: {
          left: 20,
          right: 20,
          top: 55,
          width: '93%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.axisTimelist1,
          lineStyle: {
            color: 'red'
          },
          nameTextStyle: {
            color: 'red'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#E0E6F1'],
              width: 1,
              type: 'solid'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: this.$i18n.t('home.TraffictrendB'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#0058FF',
                lineStyle: {
                  color: '#0058FF'
                }
              }
            },
            data: this.sellerMotorList.userNum
          },
          {
            name: this.$i18n.t('home.TraffictrendA'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#29CB97',
                lineStyle: {
                  color: '#29CB97'
                }
              }
            },
            data: this.sellerMotorList.visitNum
          }
        ]
      }
      option && this.refPerChart.setOption(option)
      window.addEventListener('resize', () => {
        this.refPerChart.resize()
      })
    },

    timeFormat () {
      let now = new Date()
      this.nowTime = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') + ' 00:00:00'
      this.nowDate = formatDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') + ' 23:59:59'
      this.dateOfMonthAgo = formatDate(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      this.today = formatDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

      this.trendDataRange1[0] = this.dateOfMonthAgo
      this.trendDataRange1[1] = this.today
      this.trendDataRange2[0] = this.dateOfMonthAgo
      this.trendDataRange2[1] = this.today

      this.shopDateRange[0] = this.nowTime
      this.shopDateRange[1] = this.nowDate
      this.prodDateRange[0] = this.nowTime
      this.prodDateRange[1] = this.nowDate
    },

    trendRangeChange (type) {
      this.$http({
        url: this.$http.adornUrl('/platform/statistics/trendData'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              startTime: type === 1 ? this.trendDataRange1[0] : this.trendDataRange2[0],
              endTime: type === 1 ? this.trendDataRange1[1] : this.trendDataRange2[1]
            }
          )
        )
      }).then(({data}) => {
        this.trendStatisticsList = data

        this.axisTimelist1 = []
        this.axisTimelist2 = []
        this.sellerMotorList.userNum = []
        this.sellerMotorList.visitNum = []
        this.tradeTendencyList = []

        this.trendStatisticsList.forEach(element => {
          if(type === 1) this.axisTimelist1.push(element.date)
          if(type === 2) this.axisTimelist2.push(element.date)
          if(type === 1) this.sellerMotorList.userNum.push(element.userNum)
          if(type === 2) this.sellerMotorList.visitNum.push(element.visitNum)
          this.tradeTendencyList.push(element.amount)
        })
        if(type === 1) this.getRefPerEchartData() // 流量趋势图
        if(type === 2) this.getRefSumEchartData() // 交易趋势图
      })
    },
    shopListTimeChange () {
      if (!this.shopDateRange || this.shopDateRange.length === 0) {

      } else {
        this.$http({
          url: this.$http.adornUrl('/platform/statistics/shop'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                startTime: this.shopDateRange[0],
                endTime: this.shopDateRange[1]
              }
            )
          )
        }).then(({data}) => {
          this.hotShopList = data
        })
      }
    },

    // 筛选某段时间内的商品销售数据
    prodListTimeChange () {

      this.$http({
        url: this.$http.adornUrl('/platform/statistics/prod'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              startTime: this.prodDateRange[0],
              endTime: this.prodDateRange[1]
            }
          )
        )
      }).then(({data}) => {
        this.hotProdList = data
        // console.log(this.hotProdList)
      })
    }
  },

  /**
   * 跳转订单页
   */
  toOrderPage (sts) {
    this.$router.push({
      path: '/order-order',
      query: {status: sts}
    })
  },
  /**
   * 跳转退款订单页
   */
  toRefundOrderPage () {
    this.$router.push({
      path: '/order-orderRefund'
    })
  },
  beforeDestroy () {
    // let erd = elementResizeDetectorMaker()
    // erd.uninstall(this.$refs.entirety) // 这里用ref是因为vue离开页面后获取不到dom
  }
}
</script>

<style lang="scss">
// e-chart
#real-time-data-chart canvas {
  width: 100%;
  height: 100%;
  padding: 0 20px !important
}

.mod-home {

  // 店铺状态异常提示
  .shop-inf-imperfect-tips {
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #333;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 10px;
    margin-bottom: 10px;

    .el-icon-warning {
      font-size: 16px;
      color: #FFA900;
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  // font-size: 1em;
  // line-height: 2em;
  // .strong {
  //   margin: 0;
  //   font-size: 17px;
  //   font-weight: bold;
  //   text-align: center;
  //   margin-bottom: 0.5em;
  // }
  // .content {
  //   font-size: 16px;
  //   padding: 0 30px;
  // }
  // background-color: #F5F6F9;
  .grap {
    color: #999999;
  }

  // 白色背景 标题样式
  .white-basic {
    background: #fff;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 20px;

    .title-basic {
      font-size: 18px;
      margin-bottom: 20px;
      font-weight: bold;
      line-height: 24px;
      color: #333333;
      opacity: 1;
    }
  }

  // 今日待办
  .abeyance-box {
    display: flex;
    justify-content: space-between;

    .order-num-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 7px;
      margin-bottom: 14px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;

      // cursor: pointer;
      .item-box {
        left: 30px;

        .words {
          font-size: 16px;
          font-weight: 400;
          color: #666;
        }

        .number {
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333;
          margin-top: 10px;
        }

        .compare {
          font-size: 14px;
        }
      }

      .item-img {
        position: relative;
        margin-right: 25px;
        display: block;
        width: 60px;
        height: 60px;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }

    .order-num-item:first-child {
      margin-left: 30px;
    }

    .order-num-item:last-child {
      margin-right: 100px;
    }
  }

  // 订单栏项
  .order-all-num {

    // display: flex;
    // justify-content: space-between;
    .row-bg {
      display: flex;

      .col-box {
        display: flex;
        justify-content: space-between;
        height: 120px;

      }

      .num-item-box {
        position: relative;
        width: calc(20% - 20px);
        flex: 1;
        padding-right: 20px;
        box-sizing: border-box;
      }

      .num-item-box:last-child {
        padding-right: 0;
      }

      .col-box:first-child {

        // margin-right: 20px;
        .num-item-box {
          padding-right: 20px;
          box-sizing: border-box;
        }
      }

      .col-box:last-child {
        .num-item-box:not(:last-child) {
          padding-right: 20px;
          box-sizing: border-box;
        }
      }
    }

    // 基本信息样式
    .order-num-item {
      // width: calc((100% - 73px) * 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;

      // &:hover {
      //   .item-img {
      //     img {
      //       position: absolute;
      //       top: -10px;
      //     }
      //   }
      // }
      .item-box {
        position: absolute;
        z-index: 1;
        left: 30px;

        .words {
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }

        .number {
          width: 160px;
          word-break: break-all;
          font-size: 26px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #fff;
          margin-top: 10px;

          .text {
            padding-right: 20px;
          }

          // .ratio{
          //   font-size: 12px;
          //   font-weight: 400;
          //   color: #FFFFFF;
          //   opacity: 0.7;
          // }
        }

        // .ratio{
        //   font-size: 12px;
        //   font-weight: 400;
        //   color: #FFFFFF;
        //   opacity: 0.7;
        // }
        .seq {
          display: flex
        }

        .up {
          color: #3DD598;
        }

        .up-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 12px 0 4px;
          background: url('~@/assets/img/home/ic-arrow-narrow-up.png')
        }

        .down {
          color: #F0142F;
        }

        .down-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 12px 0 4px;
          background: url('~@/assets/img/home/ic-arrow-narrow-down.png')
        }

        .compare {
          font-size: 14px;
        }
      }

      .item-img {
        position: relative;
        display: block;
        width: 100%;

        // transition: .35s;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  // 添加公告
  .introduce {
    margin-bottom: 10px;
  }

  .router-link-active {
    //点击时去掉下划线
    text-decoration: none;
  }

  a {
    text-decoration: none;
  }

  .title {
    font-size: 22px;
    color: #111111;
    font-weight: bold;
    padding: 20px;
  }

  .btn-more {
    float: right;
    margin: 10px;
    margin-top: 0px;
  }

  .introduce-container {
    padding: 10px;
    display: flex;
    background-color: #b4dff8;
    margin: 20px 0 10px 0;
  }

  .introduce-container .text {
    width: 50%;
    line-height: 30px;
    font-size: 22px;
  }

  // 栏目标题行
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    font-size: 14px;
    line-height: 1em;
  }

  .blue-vertical {
    display: inline-block;
    width: 3px;
    height: 1em;
    background: #155bd4;
    margin-right: 0.5em;
    vertical-align: middle;
  }

  .title-txt {
    color: #000;
    font-weight: bold;
    margin-right: 1em;
    vertical-align: middle;
  }

  .title-time {
    color: #999999;
    font-size: 12px;
    margin-left: 12px;
    vertical-align: middle;
  }

  .realtime {
    // display: flex;
    margin-top: 20px;
    padding: 0;
  }

  /**
    实时概况
     */
  .realtime-situation-box {
    .real-time-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      margin-bottom: -12px;

      .item {
        width: 20%;
        padding-left: 30px;
        margin-bottom: 40px;

        .word {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 400;
          color: #999999;
        }

        .number {
          font-size: 24px;
          font-weight: bold;
          line-height: 31px;
          color: #333333;
        }
      }
    }
  }

  .realtime-situation {

    //左边
    .realtime-left {
      height: 100%;
      // width: calc((100% - 20px) * 0.8);
      // margin-right: 20px;
      // .chart-content {
      //   width: 100%;
      //   height: 360px;
      // }
      background: #fff;
      border-radius: 4px;
    }

    .col-item {
      padding-right: 20px;
      box-sizing: border-box;
    }

    // 标题
    .title {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .t-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }

      .update-time {
        font-size: 12px;
        color: #999999;
        margin-left: 10px;
      }

      .t-small-text {
        font-size: 12px;
        color: #999;
      }

      .t-update-time {
        margin-left: 12px;
      }

      .t-explain-item::before {
        display: inline-block;
        content: '';
        width: 18px;
        height: 8px;
        background: #FF4141;
        border-radius: 8px;
        margin-right: 10px;
      }

      .t-explain-first-item {
        margin-left: 50px;
      }

      .t-explain-second-item {
        margin-left: 40px;
      }

      .t-red::before {
        background: #FF4141;
      }

      .t-dark-green::before {
        background: #42B983;
      }

      .t-today-data::before {
        background: #1890FF;
      }

      .t-yesterday-data::before {
        background: #21D59B;
      }

      .t-pay-amount {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;

        .t-pay-item {
          color: #333;
          text-align: left;
          margin-right: 30px;

          .tt-title {
            font-size: 14px;
          }

          .tt-num {
            font-size: 20px;
            font-weight: bold;
            margin-top: 13px;
          }
        }

        .t-today {
          margin-right: 150px;
        }
      }
    }

    .pay-amount-text {
      font-weight: bold;
    }

    .pay-amount-num {
      font-size: 24px;
      min-height: 24px;
      font-weight: 700;
      margin: 10px 0;
      line-height: 24px;
    }

    .pay-amount-tips {
      color: #9b9b9b;
    }

    // 图表
    .realtime-chart-box {
      left: -10px !important;
      // margin-top: 10px;
    }

    .wrapper__summary:nth-child(2) {
      margin-top: 120px;
    }

    // 右边
    .realtime-right {
      min-width: calc((100% - 20px) * 0.2);
      min-height: 426px;
      height: 100%;
      padding: 20px 0px 0 20px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;

      .realtime-right-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 45px;
      }

      .realtime-right-box {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;

        .realtime-right-box-left,
        .realtime-right-box-right {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .realtime-right-box-right {
          margin-top: -30px;
        }

        .order-num-item {
          width: 100%;
          display: flex;

          .item-img {
            margin-right: 30px;

            .words {
              font-size: 16px;
              font-weight: 400;
              color: #666;
            }

            .number {
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333;
              margin: 14px 0;
            }

            .compare {
              font-size: 14px;
            }
          }

          .item-box {
            .words {
              font-size: 16px;
              font-weight: 400;
              color: #666;
            }

            .number {
              font-size: 26px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333;
              margin: 14px 0;
            }

            .seq {
              display: flex;

              .value {
                color: #333333;
                font-weight: bold;
                margin-right: 8px;
              }
            }
          }
        }

        // .order-num-item:nth-child(even){
        //     margin-left: 86px;
        // }
      }
    }

    .realtime .wrapper__summary {
      display: flex;
    }

    .realtime .wrapper__summary .summary__box {
      display: inline-flex;
      flex: 1;
      margin-left: 20px;
    }

    .realtime .wrapper__summary .summary__item {
      position: relative;
      width: 100%;
    }

    //客户数信息
    .customer-number-info {
      margin-left: 60px;
    }

    .text-tit {
      font-weight: 600;
    }

    .text-num {
      font-size: 24px;
      min-height: 24px;
      font-weight: 700;
      margin: 15px 0;
      line-height: 24px;
    }

    .text-tips {
      color: #9b9b9b;
    }

    // 客户数icon
    svg {
      fill: currentColor;
      vertical-align: middle;
    }

    .realtime .wrapper__summary .summary__svg {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  /**
    整体看板
     */
  .whole-plate {
    margin: 20px 0 20px;
    min-height: 460px;
    background-color: #fff;
    border-radius: 4px;

    // 标题
    .title {
      width: 80%;
      position: relative;
      display: flex;
      align-items: center;

      .t-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }

      .update-time {
        font-size: 12px;
        color: #999999;
        margin-left: 10px;
      }

      .t-small-text {
        font-size: 12px;
        color: #999;
      }

      .t-update-time {
        margin-left: 12px;
      }

      .t-explain-item::before {
        display: inline-block;
        content: '';
        width: 18px;
        height: 8px;
        background: #FF4141;
        border-radius: 8px;
        margin-right: 10px;
      }

      .t-explain-first-item {
        margin-left: 50px;
      }

      .t-explain-second-item {
        margin-left: 40px;
      }

      .t-red::before {
        background: #FF4141;
      }

      .t-dark-green::before {
        background: #42B983;
      }

      .t-today-data::before {
        background: #1890FF;
      }

      .t-yesterday-data::before {
        background: #21D59B;
      }

      .t-pay-amount {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;

        .t-pay-item {
          color: #333;
          text-align: left;
          margin-right: 30px;

          .tt-title {
            font-size: 14px;
          }

          .tt-num {
            font-size: 20px;
            font-weight: bold;
            margin-top: 13px;
          }
        }

        .t-today {
          margin-right: 150px;
        }
      }
    }

    .money {
      width: 20%;
      display: flex;
      justify-content: space-between;

      .related-income-item {
        text-align: center;
      }
    }

    .related-income {
      margin: 20px 0 0 0px;
      padding-right: 50px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .item-tit {
      margin-top: 23px;
      margin-bottom: 15px;
    }

    .item-num {
      height: 24px;
      line-height: 24px;
    }

    .item-num-price {
      font-size: 18px;
      font-weight: 700;
    }

    .item-num a {
      color: #155bd4;
      text-decoration: none;
    }

    .integral-plate {
      margin-top: 15px;
    }
  }

  /**
    退款看板
     */
  .refund-plate {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    // 上
    .ranking-box {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      width: 50%;
      padding-right: 20px;

      .ranking-left,
      .refund-rate-box {
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #fbfbfb;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .refund-rate-box {
        height: 396px;
      }

      .ranking-left {
        margin-top: 20px;
        flex: auto
      }

      .ranking-title {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 20px;
      }

      .table {
        width: 100%;
        border: none;
        background: #fbfbfb;
        // border-spacing: 10px 20px;
        text-align: left;

        tr {
          border: none;
          height: 3em;
          line-height: 1.5em;
        }

        td {
          border: none;
          word-break: break-wrod;
        }

        .gray {
          background: #F7F8FA;
        }

        .table-tit-item {
          color: #999;
          text-align: left;
        }

        .rank {
          width: 20%;
        }

        .prod {
          width: 50%;
        }

        .ref {
          width: 20%;
        }

        .ranks {
          width: 10%;
        }

        .prods {
          width: 50%;
        }

        .refs {
          width: 30%;
        }

        .prop {
          width: 10%;
          // text-align: center;
        }
      }

      .no-data {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        color: #999;
      }

      .line-clamp-one {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        /* autoprefixepxr: off */
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        word-break: break-all;
      }

      .padLeft {
        padding-left: 20px;
      }

      .msg-tit {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 15px;
      }
    }

    //  下
    .refund-chart-box {
      display: flex;
      flex-wrap: wrap;
      width: 50%;

      .successed-refund,
      .ranking-right {
        display: flex;
        width: 100%;
        flex-direction: column;
        background: #fbfbfb;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .successed-refund {
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #fbfbfb;
        height: 396px;
        padding: 20px;
        box-sizing: border-box;
      }

      .ranking-right {
        margin-top: 20px;
      }

      .ranking-title {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 20px;
      }

      .table {
        width: 100%;
        border: none;
        background: #fbfbfb;
        // border-spacing: 10px 20px;
        text-align: left;

        tr {
          border: none;
          height: 3em;
          line-height: 1.5em;
        }

        td {
          border: none;
          word-break: break-wrod;
        }

        .gray {
          background: #F7F8FA;
        }

        .table-tit-item {
          color: #999;
          text-align: left;
        }

        .rank {
          width: 10%;
        }

        .prod {
          width: 50%;
        }

        .ref {
          width: 30%;
        }

        .ranks {
          width: 20%;
        }

        .prods {
          width: 40%;
        }

        .refs {
          width: 30%;
        }

        .prop {
          width: 10%;
          // text-align: center;
        }
      }

      .msg-tit {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 15px;
      }

      .padLeft {
        padding-left: 20px;
      }

      .msg-price {
        margin: 6px 0;
        line-height: 26px;
        padding: 0;
        font-size: 24px;
        font-weight: bold;
        line-height: 1em;
      }

      .msg-txt-p {
        width: 146px;
      }

      .compare {
        color: #9b9b9b;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 5px;
      }

      .compare-left {
        margin-right: 10px;
        white-space: nowrap;
      }
    }

    .integral-plate canvas {
      left: -5px !important;
    }

    .money-padleft {
      padding-left: 10px;
    }

    .refund-tip {
      // display: flex;
      font-size: 14px;
      font-weight: 400;
      color: #5A607F;
    }
    .refund-tip div {
      float: right;
    }

    .msg-tit-txt {
      display: flex;
      justify-content: space-between;
    }

    .traffictrendA,
    .traffictrendB {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 6px;
      margin-right: 4px;
    }

    .traffictrendA {
      background: #21D59B;
    }

    .traffictrendB {
      margin-left: 40px;
      background: #0058FF;
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

.select-date {
  display: inline-block;
  margin-left: 2%;
}
</style>
