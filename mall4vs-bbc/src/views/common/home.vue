<template>
  <div class="mod-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
      擅自窃用，必将追究法律责任！！！</p> -->

    <div v-if="shopStatusInfo.shopStatus !== null && shopStatusInfo.shopStatus !== 1" class="shop-inf-imperfect-tips">
      <div v-if="shopStatusInfo.shopStatus === 2">
        <div>
          <i class="el-icon-warning" />
          {{$t("shopProcess.yourStoreIsOfflineBecauseOf")}}
          <span>{{ shopStatusInfo.offlineReason }}</span>
          ，{{$t("shopProcess.onlineShopTips")}}
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 0">
        <div>
          <i class="el-icon-error" />
          {{$t("shopProcess.shopStopReason")}}
          <span>{{ shopStatusInfo.closedReason }}</span>
          ，{{$t("shopProcess.shopStopTips")}}
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 5 || shopStatusInfo.shopStatus === 3">
        <div>
          <i class="el-icon-warning" />
          {{$t("shopProcess.applyingOnline")}}，
          <span>{{$t("shopProcess.shopIsUnderReview")}}</span>
        </div>
      </div>
    </div>

    <!-- 数据 -->

    <!-- 订单商品栏 -->
    <div class="order-all-num">
      <el-row type="flex" class="row-bg">
        <el-col :span="15" class="col-box">
          <div class="num-item-box">
            <div class="wait-payment-num order-num-item" @click="toOrderPage(1)">
              <div class="item-box">
                <div class="words">{{ $t("home.pendingOrders") }}</div>
                <div class="number">{{isTrueData(orderStateCount.unPay)}}</div>
                <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
              </div>
              <div class="item-img">
                <img src="~@/assets/img/home/pendingPayment.png" >
              </div>
            </div>
          </div>
          <div class="num-item-box">
            <div class="wait-delivery-num order-num-item" @click="toOrderPage(2)">
              <div class="item-box">
                <div class="words">{{ $t("chat.pendingDelivery") }}</div>
                <div class="number">{{isTrueData(orderStateCount.payed)}}</div>
                <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
              </div>
              <div class="item-img">
                <img src="~@/assets/img/home/pendingDelivery.png" >
              </div>
            </div>
          </div>
          <div class="num-item-box">
            <div class="wait-receiving-goods-num order-num-item" @click="toOrderPage(3)">
              <div class="item-box">
                <div class="words">{{$t("chat.pendingReceipt")}}</div>
                <div class="number">{{isTrueData(orderStateCount.consignment)}}</div>
                <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
              </div>
              <div class="item-img">
                <img src="~@/assets/img/home/afterSale.png" >
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="9" class="col-box">
          <div class="num-item-box">
            <div class="wait-evaluate-num order-num-item" @click="toOrderPage(5)">
              <div class="item-box">
                <div class="words">{{$t("chat.completed")}}</div>
                <div class="number">{{isTrueData(orderStateCount.success)}}</div>
                <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
              </div>
              <div class="item-img">
                <img src="~@/assets/img/home/pendingReview.png" >
              </div>
            </div>
          </div>
          <div class="num-item-box">
            <div class="wait-after-sales-num order-num-item" @click="toRefundOrderPage(1)">
              <div class="item-box">
                <div class="words">{{$t("order.reimburse")}}/{{$t("order.afterSale")}}</div>
                <div class="number">{{isTrueData(orderStateCount.refund)}}</div>
                <!-- <div :class="['seq',nowDate?'up':'down']">
                  <span class="value">1.3%</span>
                  <span :class="nowDate?'up-icon':'down-icon'"></span>
                  <span class="compare grap">同比昨日上升{{$t("home.payCustomers")}}</span>
                </div> -->
              </div>
              <div class="item-img">
                <img src="~@/assets/img/home/totalOrderAmount.png" >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 实时概况板块 -->
    <div class="realtime-situation">
      <!-- 实时概况 -->
      <div class="realtime">
        <el-row type="flex" class="row-bg">
          <el-col :span="15" class="col-item">
            <div class="realtime-left">
              <div class="title">
                <div class="t-title">{{$t("home.realTimeData")}}</div>
                  <span class="title-time"
                  >{{ $t("home.updateTime") }}：{{ this.nowDate }} <span style="marginLeft:5px">{{this.nowTime}}</span></span>
                <div class="t-explain-item t-explain-first-item t-small-text t-today-data">{{$t("home.dataTodayActualTotal")}}</div>
                <div class="t-explain-item t-explain-second-item t-small-text t-yesterday-data">{{$t("home.dataYesterdayActualTotal")}}</div>
              </div>
              <!-- 图表 -->
              <div class="realtime-chart-box">
                <div
                  id="real-time-data-chart"
                  style="width: 100%; height: 250px"
                ></div>
              </div>
              <!-- /图表 -->
            </div>
          </el-col>
          <el-col :span="9">
            <!-- 数据统计 -->
            <div class="realtime-right">
              <div class="realtime-right-title">
                {{$t("home.statistics")}}
              </div>

              <!-- 内容 -->
              <div class="realtime-right-box">
                <div class="realtime-right-box-left">
                  <div class="payCustomers order-num-item">
                    <div class="item-img">
                      <img src="~@/assets/img/home/payCustomers.png" >
                    </div>
                    <div class="item-box">
                      <div class="words">{{$t("home.payCustomers")}}</div>
                      <div class="number">{{ isTrueData(this.dataInfo.payUserCount) }}</div>
                      <div class="seq">
                        <span class="value">{{this.dataInfo.yesterdayPayUserRate>=0?'+':''}}{{ isTrueData(this.dataInfo.yesterdayPayUserRate) | dataFormat }}%</span>
                        <span class="compare grap">{{$t("home.sameAsYesterday")}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="payCount order-num-item">
                    <div class="item-img">
                      <img src="~@/assets/img/home/payCount.png" >
                    </div>
                    <div class="item-box">
                      <div class="words">{{$t("home.payCount")}}</div>
                      <div class="number">{{ isTrueData(this.dataInfo.payOrderCount) }}</div>
                      <div class="seq">
                        <span class="value">{{this.dataInfo.yesterdayPayOrderRate>=0?'+':''}}{{ isTrueData(this.dataInfo.yesterdayPayOrderRate) | dataFormat }}%</span>
                        <span class="compare grap">{{$t("home.sameAsYesterday")}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="realtime-right-box-right">
                  <div class="refundAmount order-num-item">
                    <div class="item-img">
                      <img src="~@/assets/img/home/refundAmount.png" >
                    </div>
                    <div class="item-box">
                      <div class="words">{{$t("order.refundAmount")}}{{$t("live.yuan")}}</div>
                      <div class="number">{{ isTrueData(this.dataInfo.refund) }}</div>
                      <div class="seq">
                        <span class="value">{{this.dataInfo.yesterdayRefundRate>=0?'+':''}}{{ isTrueData(this.dataInfo.yesterdayRefundRate) | dataFormat }}%</span>
                        <span class="compare grap">{{$t("home.sameAsYesterday")}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="pendingReview order-num-item">
                    <div class="item-img">
                      <img src="~@/assets/img/home/customerPrice.png" >
                    </div>
                    <div class="item-box">
                      <div class="words">{{$t("home.customerPrice")}}{{$t("live.yuan")}}</div>
                      <div class="number">{{ isTrueData(this.dataInfo.onePrice) }}</div>
                      <div class="seq">
                        <span class="value">{{this.dataInfo.yesterdayOnePriceRate>=0?'+':''}}{{ isTrueData(this.dataInfo.yesterdayOnePriceRate) | dataFormat }}%</span>
                        <span class="compare grap">{{$t("home.sameAsYesterday")}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /数据统计 -->
          </el-col>
        </el-row>


      </div>
    </div>
    <!-- /实时概况板块 End -->

    <!-- 整体看板 -->
    <div class="whole-plate">
      <div class="related-income">
          <div class="title">
            <div class="t-title">{{ $t("home.displays") }}</div>
              <span class="title-time">
                {{ $t("home.updateTime") }}：{{ this.nowDate }} 
                <span style="marginLeft:5px">{{this.nowTime}}</span>
              </span>
            <div class="t-explain-item t-explain-first-item t-small-text t-today-data">{{$t("home.businessPay")}}</div>
          </div>
          <div class="money">
              <!-- 当天支付金额 -->
            <div class="related-income-item">
              <p class="item-tit">{{ $t("home.dayAmount") }}</p>
              <p class="item-num">
                <span class="item-num-price">{{
                  this.dataInfo.payActualTotal
                }}</span>
              </p>
            </div>
              <!-- 本月完成金额 -->
            <div class="related-income-item">
              <p class="item-tit">{{ $t("home.monthAmount") }}</p>
              <p class="item-num">
                <span class="item-num-price">{{ this.sumPayActualTotal }}</span>
              </p>
            </div>
          </div>
      </div>
      <!-- 图表 -->
      <div
        class="integral-plate"
        ref="entirety"
        id="entirety-data-chart"
        style="width: 100%; height: 300px;"
      ></div>

      <!-- /图表 -->
    </div>
    <!-- /整体看板 End -->

    <!-- 退款看板 -->
    <div class="refund-plate">
      <div class="ranking-box">
        <div class="ranking-left">
          <div class="ranking-title">{{ $t("home.refundReasonRank") }}</div>
          <div v-if="refundRankForCause.length">
            <table class="table" cellpadding="0" cellspacing="0">
              <tr class="table-tit gray">
                <td class="table-tit-item ranks padLeft">{{ $t("home.rank") }}</td>
                <td class="table-tit-item prods">{{ $t("home.reason") }}</td>
                <td class="table-tit-item refs">{{ $t("home.refundAmount") }}</td>
                <td class="table-tit-item prop">{{ $t("home.moneyRatio") }}</td>
              </tr>
              <tr
                v-for="(item, index) in refundRankForCause"
                :key="index"
                class="table-tit"
              >
               <td class="padLeft">{{ item[0] }}</td>
               <td>{{ item[1] }}</td>
               <td>{{ item[3] }}</td>
               <td>{{ item[4] }}%</td>
             </tr>
            </table>
          </div>
          <div v-else style="height:90%">
             <table class="table" cellpadding="0" cellspacing="0">
              <tr class="table-tit gray">
                <td class="table-tit-item ranks padLeft">{{ $t("home.rank") }}</td>
                <td class="table-tit-item prods">{{ $t("home.reason") }}</td>
                <td class="table-tit-item refs">{{ $t("home.refundAmount") }}</td>
                <td class="table-tit-item prop">{{ $t("home.moneyRatio") }}</td>
              </tr>
             </table>
             <div class="sign-noData">暂无数据</div>
          </div>
        </div>
        <!-- 退款率 -->
        <div class="refund-rate-box">
          <div class="refund-chart-msg">
            <div class="msg-tit-txt">
              <p class="msg-tit">{{ $t("home.refundRateToday") }}</p>
            </div>
            <!--
            <div class="msg-txt-p">
              <p class="compare">
                <span class="compare-left">较前一日</span>
                <span class="compare-right">0.00%-</span>
              </p>
              <p class="compare">
                <span class="compare-left">较上周同期
                </span>
                <span class="compare-right">0.00%-</span>
              </p>
            </div>
            -->
          </div>
          <!-- 图表 -->
          <div
            class="refund-chart"
            id="refPer-chart"
            style="width: 100%; height: 450px"
          ></div>
          <!--/ 图表 -->
        </div>
      </div>

      <!-- 下 -->
      <div class="refund-chart-box">
        <div class="ranking-right">
          <div class="ranking-title">{{ $t("home.refundProRank") }}</div>
          <div v-if="refundRankForActualTotal.length">
            <table class="table table-con">
              <tr class="table-tit gray">
                <td class="table-tit-item rank padLeft">{{ $t("home.rank") }}</td>
                <td class="table-tit-item prod">{{ $t("home.product") }}</td>
                <td class="table-tit-item ref" style="textAlign:right">{{ $t("home.successfulRefundNum") }}</td>
              </tr>
              <tr v-for="(item, index) in refundRankForActualTotal" :key="index">
                <td class="padLeft">{{ item[0] }}</td>
                <td class="line-clamp-one" style="word-break: break-word;">{{ item[1] }}</td>
                <td style="textAlign:right">{{ item[2] }}</td>
              </tr>
            </table>
          </div>
          <div v-else style="height:90%">
            <table class="table table-con">
              <tr class="table-tit gray">
                <td class="table-tit-item rank padLeft">{{ $t("home.rank") }}</td>
                <td class="table-tit-item prod">{{ $t("home.product") }}</td>
                <td class="table-tit-item ref" style="textAlign:right">{{ $t("home.successfulRefundNum") }}</td>
              </tr>
            </table>
            <div class="sign-noData">暂无数据</div>
          </div>
          </div>
        <!-- 成功退款金额（元） -->
        <div class="successed-refund">
          <div class="refund-chart-msg">
            <div class="msg-tit-txt">
              <p class="msg-tit">{{ $t("home.successfulRefundAmountToday") }}</p>
            </div>
            <!--
            <div class="msg-txt-p">
              <p class="compare">
                <span class="compare-left">较前一日</span>
                <span class="compare-right">0.00%-</span>
              </p>
              <p class="compare">
                <span class="compare-left">较上周同期
                </span>
                <span class="compare-right">0.00%-</span>
              </p>
            </div>
            -->
          </div>
          <!-- 图表 -->
          <div
            class="refund-chart"
            id="ref-chart"
            style="width: 100%; height: 450px"
          ></div>
          <!--/ 图表 -->
        </div>
      </div>

    </div>
    <!-- /退款看板 -->
  </div>
</template>

<script>
import Big from 'big.js'
let elementResizeDetectorMaker = require('element-resize-detector')
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
      nowDate: null,
      nowTime: null,
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

      // 店铺状态信息
      shopStatusInfo: {
        accountStatus: 0, // 账号状态， 1:启用 0:禁用 -1:删除
        shopStatus: null, // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中
        offlineStatus: 0, // 下线状态 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过
        offlineReason: '', // 下线原因
        contractStartTime: '', // 签约起始时间
        contractEndTime: '', // 签约终止时间
        closedReason: '' // 停业原因
      }
    }
  },
  mounted () {
    this.getpayActualTotalByDay()
    this.getpayActualTotalByHour()
    this.getOrderRefundDayByTime()
    this.getOrderCount()
    this.getRefundInfo()
    this.getRefundRankingByProd()
    this.getRefundRankingByReason()
    this.getpayInfo()
    this.getRefSumEchartData()
    this.getRefPerEchartData()
    this.getAuditingInfo()
    this.getEntiretyDataChart()
    let erd = elementResizeDetectorMaker()
    erd.listenTo(document.getElementById('entirety-data-chart'), this.resizeFunc)
  },
  updated () {
    // this.getpayInfo()
  },
  methods: {

    resizeFunc () {
      this.$nextTick(() => {
          // 使echarts尺寸重置
        this.entiretyChat.resize()
        this.refChart.resize()
        this.refPerChart.resize()
      })
    },
    /**
     * 获取店铺状态信息
     */
    getAuditingInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopDetail/getStatusInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        // 店铺状态shopStatus：-1:已删除 0: 停业中 1:营业中 2:平台下线 3:上线待审核 4:店铺申请中 5:开店待审核
        this.shopStatusInfo = data
        if (data.shopStatus === 0) {
          const now = new Date()
          const contractStartTime = new Date(Date.parse(data.contractStartTime))
          this.shopStatusInfo.closedReason = now < contractStartTime ? this.$i18n.t('shopProcess.theContractIsNotValid') : this.$i18n.t('shopProcess.validityPeriodOfTheContractHasExpired')
        }
      })
    },

    // 查看单个平台公告
    viewNoticeDetail (id) {
      this.noticeData.id = id || 0
      this.viewDialog = true
      this.$nextTick(() => {
        if (this.noticeData.id) {
          this.$http({
            url: this.$http.adornUrl('/shop/notice/info/' + this.noticeData.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.noticeData = data
          })
        }
      })
    },

    //  同比昨日
    isTrueData (data) {
      if (data) {
        return data
      }
      return 0
    },

    // 查询店铺订单各状态数量
    getOrderCount () {
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/orderCount'),
        method: 'get'
      }).then(({ data }) => {
        this.orderStateCount = data
      })
    },
    // 获取平台公告列表
    // getDataList () {
    //   this.$http({
    //     url: this.$http.adornUrl('/shop/notice/listPage'),
    //     method: 'get',
    //     params: this.$http.adornParams(Object.assign({
    //       current: 1,
    //       size: 6
    //     }, this.searchForm))
    //   }).then(({ data }) => {
    //     this.dataList = data.records
    //     if (data.records.length === 0) {
    //       document.getElementById('notice').style.display = 'none'
    //     }
    //   })
    // },
    // 获取实时数据报表图
    getRealTimeDataChart () {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var hours = date.getHours()    // 获取当前小时数(0-23)
      var minutes = date.getMinutes()   // 获取当前分钟数(0-59)
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()  // 获取当前秒数(0-59)
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.nowDate = year + seperator1 + month + seperator1 + strDate
      this.nowTime = hours + ':' + minutes + ':' + seconds

      const myChart = this.$echarts.init(document.getElementById('real-time-data-chart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 8,
          textStyle: { // 提示框浮层的文本样式。
            fontSize: '12px',
            fontWeight: 400,
            color: '#33333',
            opacity: 1
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);',
          formatter: function (params) {
            // return arg.name +
            // // return '反弹率:' + arg[0].data + '%'

            // params数组可以了解一下，一条线和多条线都是数组
            var html = ''
            for (var i in params) {
              var param = params[i]
               // echarts日期格式化api
              var date = param.name
              html += `<span style="color: #999999">${param.seriesIndex === 0 ? date : ''}</span><br /><div style="margin-top:${param.seriesIndex === 0 ? '12px' : '0'};display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: ${param.seriesIndex === 0 ? '#0058FF' : '#21D59B'};margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.value}</span></div>`
            }
            return html
          }
        },
        grid: {
          left: 20,
          right: 20,
          top: 55,
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
          symbol: 'none',
          data: this.realTimeDataXAxis,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#E0E6F1'],
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: this.$i18n.t('home.dataTodayActualTotal'),
            symbol: 'none',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#1890FF'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                 0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(0, 88, 255, 0.2)'},
                    {offset: 1, color: 'rgba(255, 255, 255, 0)'}
                  ]
                )
              }
            },
            data: this.dataForm.nowActualTotal
          },
          {
            name: this.$i18n.t('home.dataYesterdayActualTotal'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#21D59B'
                }
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(41, 203, 151, 0.2)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }])
            },
            data: this.dataForm.payYesterdayActualTotal
          }
        ]
      }
      option && myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    // 获取整体看板柱状图
    getEntiretyDataChart () {
      this.entiretyChat = this.$echarts.init(document.getElementById('entirety-data-chart'))
      const option = {
        color: ['red'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 8,
          textStyle: { // 提示框浮层的文本样式。
            fontSize: '12px',
            fontWeight: 400,
            color: '#33333',
            opacity: 1
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);width:180px;height:62px',
          formatter: function (params) {
            // return arg.name +
            // // return '反弹率:' + arg[0].data + '%'

            // params数组可以了解一下，一条线和多条线都是数组
            var html = ''
            for (var i in params) {
              var param = params[i]
               // echarts日期格式化api
              var date = param.name
              html += `<span style="color: #999999">${date}</span><br /><div style="margin-top: 12px;display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: #0058FF;margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.data}</span></div>`
            }
            return html
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 20,
          right: 20,
          width: '95%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            showMaxLabel: true
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: this.timeArray
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
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#e8f0ff',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#1890FF'
              }
            },
            barWidth: 20,
            data: this.dataArray
          }
        ]
      }

      option && this.entiretyChat.setOption(option)
      window.addEventListener('resize', () => {
        this.entiretyChat.resize()
      })
    },

    getpayActualTotalByHour () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getActualTotalByHour'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.dataForm = data
          this.getRealTimeDataChart()
          this.dataListLoading = false
        }
      })
    },
    getpayActualTotalByDay () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getActualTotalByDay'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.dataArray = data
          this.dataListLoading = false
          this.dataForm = data
          this.timeArray = []
          this.dataArray = []
          for (var j = 0, len = this.dataForm.length; j < len; j++) {
            this.timeArray.push(this.dataForm[j].dates)
            this.dataArray.push(this.dataForm[j].payActualTotal)
            if (j === len - 1) {
              this.sumPayActualTotal = this.dataForm[j].onePrice
            }
          }
          this.getEntiretyDataChart()
          this.dataListLoading = false
        }
      })
    },
    getOrderRefundDayByTime () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getOrderRefundDayByTime'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.dataForm = data
          this.timeArray = []
          this.dataArray = []
          for (var j = 0, len = this.dataForm.length; j < len; j++) {
            this.timeArray.push(this.dataForm[j].refundDateToString)
            this.dataArray.push(this.dataForm[j].payActualTotal)
            this.rate.push(this.dataForm[j].refundRate)
          }
          this.getRefSumEchartData()
          this.getRefPerEchartData()
          this.dataListLoading = false
        }
      })
    },
    getpayInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/orderPayByShopId'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.dataInfo = data
          this.dataListLoading = false
        }
      })
    },
    getRefundInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getOrderRefundByTime'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.refundRateInfo = data
          this.dataListLoading = false
        }
      })
    },
    getRefundRankingByProd () {
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getRefundRankingByProd'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign({
            size: 5
          })
        )
      }).then(({ data }) => {
        if (data) {
          this.dataForm = data
          for (var j = 0, len = this.dataForm.length; j < len; j++) {
            var refund = []
            refund.push(j + 1)
            refund.push(this.dataForm[j].refundPordName)
            refund.push(this.dataForm[j].refundCount)
            this.refundRankForActualTotal.push(refund)
          }

          this.dataListLoading = false
        }
      })
    },
    getRefundRankingByReason () {
      this.$http({
        url: this.$http.adornUrl('/shop/statisticsOrder/getRefundRankingByReason'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.dataForm = data
          for (var j = 0, len = this.dataForm.length; j < len; j++) {
            var refund = []
            refund.push(j + 1)
            refund.push(this.dataForm[j].buyerReason)
            refund.push(this.dataForm[j].refundCount)
            refund.push(this.dataForm[j].payActualTotal)
            refund.push(this.dataForm[j].refundRate)
            this.refundRankForCause.push(refund)
          }

          this.dataListLoading = false
        }
      })
    },
    getRefSumEchartData () {
      this.refChart = this.$echarts.init(document.getElementById('ref-chart'))
      // const option = {
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   // legend: {
      //   //   data: ['成功退款金额（元）']
      //   // },
      //   xAxis: {
      //     type: 'category',
      //     boundaryGap: false,
      //     data: this.timeArray
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       name: this.$i18n.t('home.refundAmount'),
      //       type: 'line',
      //       // stack: this.$i18n.t('home.amount'),
      //       data: this.dataArray
      //     }
      //   ]
      // }
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 8,
          textStyle: { // 提示框浮层的文本样式。
            fontSize: '12px',
            fontWeight: 400,
            color: '#33333',
            opacity: 1
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);width:180px;height:62px',
          formatter: function (params) {
            // return arg.name +
            // // return '反弹率:' + arg[0].data + '%'

            // params数组可以了解一下，一条线和多条线都是数组
            var html = ''
            for (var i in params) {
              var param = params[i]
               // echarts日期格式化api
              var date = param.name
              html += `<span style="color: #999999">${date}</span><br /><div style="margin-top: 12px;display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: #0058FF;margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.data}</span></div>`
            }
            return html
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          top: 55,
          width: '91%',
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
          data: this.timeArray,
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
            name: this.$i18n.t('order.refundAmount'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#29CB97'
                }
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(41, 203, 151, 0.2)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0.11)'
              }])
            },
            data: this.dataArray
          }
        ]
      }
      option && this.refChart.setOption(option)
      window.addEventListener('resize', () => {
        this.refChart.resize()
      })
    },
    getRefPerEchartData () {
      this.refPerChart = this.$echarts.init(document.getElementById('refPer-chart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 8,
          textStyle: { // 提示框浮层的文本样式。
            fontSize: '12px',
            fontWeight: 400,
            color: '#33333',
            opacity: 1
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);width:180px;height:62px',
          formatter: function (params) {
            // return arg.name +
            // // return '反弹率:' + arg[0].data + '%'

            // params数组可以了解一下，一条线和多条线都是数组
            var html = ''
            for (var i in params) {
              var param = params[i]
               // echarts日期格式化api
              var date = param.name
              html += `<span style="color: #999999">${date}</span><br /><div style="margin-top: 12px;display: flex;align-items: center;"><i style="display: inline-block;width: 6px;height: 6px;background-color: #0058FF;margin-right: 9px;border-radius: 50%;"></i><span style=" display:inline-block;">${param.seriesName}：${param.data}%</span></div>`
            }
            return html
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          top: 55,
          width: '91%',
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
          data: this.timeArray,
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
            name: this.$i18n.t('home.refundRate'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#1890FF'
                }
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 88, 255, 0.1)'
              }, {
                offset: 1,
                color: '#ffffff'
              }])
            },
            data: this.rate
          }
        ]
      }
      option && this.refPerChart.setOption(option)
      window.addEventListener('resize', () => {
        this.refPerChart.resize()
      })
    },

    /**
     * 跳转订单页
     */
    toOrderPage (sts) {
      if (!this.isAuth('order:get:info')) {
        this.$message.info(this.$i18n.t('homes.noPermissionAccessPage'))
        return
      }
      this.$router.push({
        path: '/order-order',
        query: { status: sts }
      })
    },
    /**
     * 跳转退款订单页
     */
    toRefundOrderPage (sts) {
      if (!this.isAuth('admin:orderRefund:update')) {
        this.$message.info(this.$i18n.t('homes.noPermissionAccessPage'))
        return
      }
      this.$router.push({
        path: '/order-orderRefund',
        query: { returnMoneySts: sts }
      })
    }
  },
  beforeDestroy () {
    let erd = elementResizeDetectorMaker()
    erd.uninstall(this.$refs.entirety) // 这里用ref是因为vue离开页面后获取不到dom
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
    min-width: 56px;
  }

  // 订单栏项
  .order-all-num {
    // display: flex;
    // justify-content: space-between;
    .row-bg {
      .col-box {
        display: flex;
        justify-content: space-between;
        .num-item-box {
          position: relative;
          flex: 1;
          box-sizing: border-box;
        }
      }
      .col-box:first-child {
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
    .order-num-item {
      // width: calc((100% - 73px) * 0.2);
      display: flex;
      padding: 25px;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      cursor: pointer;
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
          margin-top: 10px;
        }
        .seq {
          display: flex
        }
        .up { color: #3DD598; }
        .up-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 12px 0 4px;
          background:url('~@/assets/img/home/ic-arrow-narrow-up.png')
        }
        .down {color: #F0142F;}
        .down-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 12px 0 4px;
          background:url('~@/assets/img/home/ic-arrow-narrow-down.png')
        }
        .compare {
          font-size: 14px;
        }
      }
    }
    // 图标过渡效果
    .order-num-item {
      position: relative;
      transition: 0.35s ease;
      &:hover {
        .item-img {
          top: 15%;
        }
      }
      .item-img {
        position: absolute;
        right: 25px;
        top: 25%;
        display: block;
        width: 60px;
        height: 60px;
        transition: 0.35s ease;
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
  .realtime-situation {
    //左边
    .realtime-left {
      height: 100%;
      // padding-right: 5px;
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
        .realtime-right-box-left, .realtime-right-box-right{width: 100%;display: flex;justify-content: space-between;}
        .realtime-right-box-right { margin-top: -30px;}
        .order-num-item{
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
      .related-income-item {text-align: center;}
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
    .sign-noData {
      display:flex;
      align-items: center;
      justify-content: center;
      color:#999999;
      width: 100%;
      height: 100%;
    }
    // 上
    .ranking-box {
      display: flex;
      flex-wrap: wrap;
      height: auto;
      align-content: flex-start;
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
        height: calc((100% - 20px) * 0.5);
        border-radius: 4px;
      }
      .ranking-left {
        height: calc((100% - 20px) * 0.43);
      }

      .ranking-title {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
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
          min-width: 60px;
          // text-align: center;
        }
      }

      .refund-rate-box {
        margin-top: 20px;
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
        word-wrap:break-word;
        word-break:break-all;
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
      height: auto;
      align-content: flex-start;
      width: 50%;
      .successed-refund,
      .ranking-right {
        display: flex;
        width:100%;
        flex-direction: column;
        background: #fbfbfb;
        padding: 20px;
        box-sizing: border-box;
        height: calc((100% - 20px) * 0.43);
        border-radius: 4px;
      }

      .successed-refund {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #fbfbfb;
        padding: 20px;
        box-sizing: border-box;
        height: calc((100% - 20px) * 0.5);
      }

      .ranking-title {
        font-weight: bold;
        color: #333;
        font-size: 18px;
        margin-bottom: 10px;
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
      left:-5px !important;
    }
  }
}

@media screen and ( max-width: 1680px ){
  .mod-home {
    // 订单栏项
    .order-all-num {
      .order-num-item {
        // width: calc((100% - 73px) * 0.2);
        display: flex;
        padding: 25px 10px;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        cursor: pointer;
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
            margin-top: 10px;
          }
          .seq {
            display: flex
          }
          .up { color: #3DD598; }
          .up-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin: 0 12px 0 4px;
            background:url('~@/assets/img/home/ic-arrow-narrow-up.png')
          }
          .down {color: #F0142F;}
          .down-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin: 0 12px 0 4px;
            background:url('~@/assets/img/home/ic-arrow-narrow-down.png')
          }
          .compare {
            font-size: 14px;
          }
        }
      }
    // 图标过渡效果
      .order-num-item {
        position: relative;
        transition: 0.35s ease;
        &:hover {
          .item-img {
            top: 15%;
          }
        }
        .item-img {
          position: absolute;
          right: 8px;
          top: 25%;
          display: block;
          width: 60px;
          height: 60px;
          transition: 0.35s ease;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
