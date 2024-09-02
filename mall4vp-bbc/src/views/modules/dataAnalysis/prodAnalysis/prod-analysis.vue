<template>
  <div class="mod-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 数据 -->

    <!-- 实时概况板块 -->
    <div class="realtime-situation">
      <!-- 栏目标题行 -->
      <div class="new-page-title">
        <!-- 左边 -->
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{ $t("dataAnalysis.goodsDet") }}</span>
        </div>
        <!-- 右边 -->
        <div class="new-page-title-right">
          <div class="title-right">
            <el-select
              v-model="dateValue"
              @change="setDateRange(dateValue)"
              style="auto"
              size="mini"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="title-time" v-if="dateValue === 1">{{
              this.nowDate
            }}</span>
            <button
              v-if="dateValue === 1"
              data-v-3baf97fc
              class="el-button el-button--text el-button--small"
              @click="flushDateTime"
              type="button"
            >
              {{ $t("dataAnalysis.refresh") }}
            </button>
            <span class="title-time" v-if="dateValue === 2 || dateValue === 3"
              >{{ this.dateRange[0] }} {{ $t('date.tip') }} {{ this.dateRange[1] }}</span
            >
          </div>
          <div class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              v-if="dateValue === 4"
              v-model="dateRange[0]"
              @change="handleRangeFour()"
              type="date"
              :placeholder="$t('dataAnalysis.selectDate')"
              :picker-options="PickerOptions"
            ></el-date-picker>
          </div>
          <div class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              v-if="dateValue === 5"
              v-model="preMonth"
              @change="handleMonth()"
              type="month"
              :placeholder="$t('dataAnalysis.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>

          <el-button type="primary" v-if="isAuth('flow:prod:survey')" size="small" @click="exportFrom(1)">{{$t('order.export')}}</el-button>
        </div>
      </div>
      <!-- /栏目标题行 -->
      <!-- 商品概况列表 -->
      <div class="item-list">
        <prod-survey-table :prodData="prodData"></prod-survey-table>
      </div>
      <!-- /商品概况列表 -->
    </div>
    <!-- /实时概况板块 -->
    <!-- 说明文字板块 -->
    <div>
      <div class="title-text-info">
        <span>{{ $t("dataAnalysis.decText") }}</span>
      </div>
      <!-- <div class="title-line"> -->
        <!-- <span class="title-txt">2.若有其他疑问，可查看数据常见问题。</span> -->
      <!-- </div> -->
    </div>
    <!-- /说明文字板块 -->
    <!-- 整体看板 -->
    <div class="whole-plate">
      <!-- 栏目标题行 -->
      <div class="new-page-title">
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{
            $t("dataAnalysis.commodityTrendAnalysis")
          }}</span>
        </div>
        <div class="title-right">
          <el-select
            v-model="dateValue3"
            @change="setDateRange3(dateValue3)"
            style="auto"
            size="mini"
          >
            <el-option
              v-for="item in dateOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="title-time" style="margin:0 0 0 12px;" v-if="dateValue3 === 2 || dateValue3 === 3"
            >{{ dateRange3[0] }} {{ $t('date.tip') }} {{ dateRange3[1] }}</span
          >
          <div class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              v-if="dateValue3 === 5"
              @change="handleMonth3()"
              v-model="preMonth3"
              type="month"
              :placeholder="$t('dataAnalysis.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
          <div>
            <el-popover placement="right" width="500" trigger="click">
              <el-form :model="customIndexForm" class="form-inline">
                <el-form-item :label="$t('dataAnalysis.productsOverview')">
                  <el-checkbox-group v-model="customIndexForm.prodSurvey">
                    <el-checkbox
                      :label="$t('dataAnalysis.numberOfNewProducts')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="$t('dataAnalysis.goodsVisited')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="$t('dataAnalysis.goodsSold')"
                      name="prodSurvey"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('dataAnalysis.commodityFlow')">
                  <el-checkbox-group v-model="customIndexForm.prodFlow">
                    <el-checkbox :checked="true" :label="$t('dataAnalysis.shareVisits')" name="prodSurvey"></el-checkbox>
                    <el-checkbox :checked="true" :label="$t('dataAnalysis.productViews')" name="prodSurvey"></el-checkbox>
                    <el-checkbox :checked="true" :label="$t('dataAnalysis.productVisitors')" name="prodSurvey"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('dataAnalysis.commodityConversion')">
                  <el-checkbox-group v-model="customIndexForm.prodTransForm">
                    <el-checkbox
                      :label="$t('dataAnalysis.carNumbers')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="$t('dataAnalysis.orderCounts')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="$t('dataAnalysis.payCounts')"
                      name="prodSurvey"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <span id="maxSelectSpan"
                  >{{ $t("dataAnalysis.upTo") }} {{ maxSelectNum }}
                  {{ $t("dataAnalysis.items") }}</span
                >
                <span
                  >{{ $t("dataAnalysis.selected") }} {{ selectNum }}
                  {{ $t("dataAnalysis.items") }}</span
                >
              </el-form>
              <el-button size="mini" slot="reference">{{
                $t("dataAnalysis.selectIndicators")
              }}</el-button>
            </el-popover>
          </div>
        </div>
      </div>
      <!-- /栏目标题行 -->
      <!-- 图表 -->
      <div class="charts-title">
        <div class="charts-title-item" v-for="(item,index) in sumData" :key="item">
          <div :style="{background: lineStyle[index].normal.lineStyle.color}" class="line"></div>
          <span>{{ item }}</span>
          </div>
      </div>
      <div
        class="realtime-chart-box"
        id="time-survey"
        style="width: 100%; height: 300px"
      ></div>

      <!-- /图表 -->
    </div>
    <!-- /整体看板 -->

    <!-- 商品排行整体看板 -->
    <div class="refund-plate">
      <!-- 栏目标题行 -->
      <div class="new-page-title">
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{
            $t("dataAnalysis.commodityRanking")
          }}</span>
        </div>
        <!-- <el-form :inline="true" :model="dateChoose" class="form-inline"> -->

        <!-- <el-form-item>
            <p class="blue-vertical"></p>
            <span class="title-txt">商品排行榜</span>
        </el-form-item>-->
        <!-- <el-form-item> -->
        <div class="title-right">
          <el-select
            v-model="dateValue2"
            @change="setDateRange2(dateValue2)"
            style="auto"
            size="mini"
          >
            <el-option
              v-for="item in dateOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="title-time" v-if="dateValue2 === 2 || dateValue2 === 3"
            >{{ dateRange2[0] }} {{ $t('date.tip') }} {{ dateRange2[1] }}</span
          >
          <div class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              v-if="dateValue2 === 5"
              @change="handleMonth2()"
              v-model="preMonth2"
              type="month"
              :placeholder="$t('dataAnalysis.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
          
          <el-button type="primary" v-if="isAuth('flow:pay:visit:top')" size="small" @click="exportFrom(2)">{{$t('order.export')}}</el-button>
        </div>
        <!-- </el-form-item> -->
        <!-- </el-form> -->
      </div>
      <!-- /栏目标题行 -->

      <!-- 下 -->
      <div class="ranking-box">
        <div class="ranking-left-analysis">
          <div class="ranking-title">
            {{ $t("dataAnalysis.amountPaidTOP") }}
          </div>
          <el-table
            :data="payAmountTopData"
            style="width: 100%"
            :header-cell-style="analysisTableHeaderClass"
            :cell-style="analysisTableCellClass">
            <el-table-column
              :label="$t('home.rank')"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column
              :label="$t('product.prodName')"
              type="index"
              width="500">
              <template slot-scope="scope">
                <div class="table-cell-con cursor-p" @click="handleShowProdDetailPop(scope.row.prodId)">
                  <div class="table-cell-image">
                    <img :src="scope.row.pic" :alt="scope.row.prodName">
                  </div>
                  <span class="table-cell-text">{{ scope.row.prodName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('home.payAmount')"
              align="center"
              prop="payAmount">
            </el-table-column>
          </el-table>
        </div>
        <div class="ranking-right">
          <div class="ranking-title">
            {{ $t("dataAnalysis.visitorsTop") }}
          </div>
          <el-table
            :header-cell-style="analysisTableHeaderClass"
            :cell-style="analysisTableCellClass"
            :data="visitorTopData"
            style="width: 100%">
            <el-table-column
              :label="$t('home.rank')"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column
              :label="$t('product.prodName')"
              width="410">
              <template slot-scope="scope">
                <div class="table-cell-con cursor-p" @click="handleShowProdDetailPop(scope.row.prodId)">
                  <div class="table-cell-image">
                    <img :src="scope.row.pic" :alt="scope.row.prodName">
                  </div>
                  <span class="table-cell-text">{{ scope.row.prodName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('dataAnalysis.numberOfVisitors')"
              prop="visitorNum"
              align="center">
            </el-table-column>
            <el-table-column
              :label="$t('dataAnalysis.vToP')"
              align="right"
              prop="visitorToPayRate">
              <template slot-scope="scope">
                <span>{{ parseFloat(scope.row.visitorToPayRate * 100).toFixed(2) + '%' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- /商品排行整体看板 -->

    <!-- 商品详情弹窗 -->
    <prod-detail v-if="prodDetailVisiable" ref="prodDetail" @handleHidePop="handleHidePop"> </prod-detail>
  </div>
</template>

<script>
import ProdSurveyTable from './prod-survey-table'
import ProdDetail from './prod-detail-dialog'

import moment from 'moment'

export default {
  data () {
    return {
      myChartTimeSurvey: null,
      value: [0, 1],
      sumPayActualTotal: 0.00,
      dataForm: {},
      dateChoose: {}, // 时间选择
      prodData: {
        dateValue: 2, // 商品整体概况,时间选择状态
        data: {
          newProd: 0, // 新增商品数
          visitedProd: 0, // 被访问商品数
          dynamicSale: 0, // 动销商品数
          expose: 0, // 商品曝光数
          shareVisit: 0, // 分享访问数
          browse: 0, // 商品浏览量
          visitor: 0, // 商品访客数
          addCart: 0, // 加购件数
          orderNum: 0, // 下单件数
          payNum: 0 // 支付件数
        }, // 商品整体概况数据
        lastData: {},
        rate: {}
      }, // 商品 概况列表
      nowActualTotal: [],
      payYesterdayActualTotal: [],
      dataArray: [],
      timeArray: [],
      nowDate: null,
      dataInfo: {},
      rate: [],
      refundRateInfo: [],
      refundRankForActualTotal: [],
      refundRankForCause: [],
      dateValue: 1,
      dateValue2: 2,
      dateValue3: 2,
      PickerOptions: {
        disabledDate (time) {
          var date = moment().add(-1, 'days').startOf('days')
          return (
            time.getTime() > date.valueOf()
          )
        }
      },
      monthPickerOptions: {
        disabledDate (time) {
          let month1 = moment().startOf('month')
          return (
            time.getTime() > month1.valueOf()
          )
        }
      },
      dateOptions: [
        {
          label: this.$i18n.t('dataAnalysis.todayRealTime'),
          value: 1
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly7'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly30'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnalysis.naturalDay'),
          value: 4
        },
        {
          label: this.$i18n.t('dataAnalysis.naturalMonth'),
          value: 5
        }
      ],
      dateOptions2: [
        {
          label: this.$i18n.t('dataAnalysis.nearly7'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly30'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnalysis.naturalMonth'),
          value: 5
        }
      ],
      dateRange: [],
      dateRange2: [], // 展示的时间参数
      dateRange2Param: [], // 要传递的时间参数
      dateRange3: [], // 展示的时间参数
      dateRange4Param: [], // 要传递的时间参数
      preMonth: '', // 前一个月
      preMonth2: '', // 前一个月
      preMonth3: '', // 前一个月
      dateRange1: [], // 商品整体概况的时间选择范围
      payAmountTopData: [], // 支付金额TOP
      visitorTopData: [], // 访问top
      customIndexForm: {
        prodSurvey: [], // '新增商品数', '被访问商品数', '动销商品数'
        prodFlow: [],
        prodTransForm: []
      },
      selectNum: 0,
      maxSelectNum: 3, // 最多选择几项
      sumData: [],
      dateArr: [], // 趋势图时间数组
      seriesDataArr: [], // 所有数据
      seriesControlDataArr: [], // 控制显示的数据
      lineStyle: [
        {
          normal: {
            color: '#29CB97',
            lineStyle: {
              color: '#29CB97'
            }
          }
        },
        {
          normal: {
            color: '#0058FF',
            lineStyle: {
              color: '#0058FF'
            }
          }
        },
        {
          normal: {
            color: '#F56C6C',
            lineStyle: {
              color: '#F56C6C'
            }
          }
        }
      ],
      areaStyle: [
        {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(41, 203, 151, 0.41)'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(24,144,255,0.6)'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#F56C6C'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        }
      ],
      prodDetailVisiable: false
    }
  },
  mounted () {
    this.dateValue = 2
    // this.flushDateTime()
    // this.getProdSurvey()
    this.setDateRange(2)
    this.setDateRange2(2)
    this.setDateRange3(2)

    const that = this
    this.$nextTick(() => {
      setTimeout(function () {
        that.myChartTimeSurvey.resize()
      }, 500)
    })
  },
  updated () {
    // this.getpayInfo()
  },
  components: {
    ProdSurveyTable,
    ProdDetail
  },
  computed: {
    /**
     * 数据表格头部样式
     */
    analysisTableHeaderClass () {
      return {
        height: '64px',
        background: '#FFF',
        color: '#666666',
        'font-weight': '500',
        border: 'none',
        'word-break': 'break-word',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden'
      }
    },
    /**
     * 数据表格单元格样式
     */
    analysisTableCellClass () {
      return {
        height: '64px', padding: '8px 0', color: '#000'
      }
    }
  },
  watch: {
    'customIndexForm.prodSurvey' () {
      this.selectNum = this.customIndexForm.prodSurvey.length + this.customIndexForm.prodFlow.length + this.customIndexForm.prodTransForm.length
      // console.log(this.customIndexForm.prodSurvey)
      this.sumData = []
      this.sumData = this.sumData.concat(this.customIndexForm.prodSurvey).concat(this.customIndexForm.prodFlow).concat(this.customIndexForm.prodTransForm)
      // console.log(this.sumData)
      var checks = document.getElementsByName('prodSurvey')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= this.maxSelectNum) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < this.maxSelectNum) {
        this.textShare(span, 'black')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'customIndexForm.prodFlow' () {
      this.selectNum = this.customIndexForm.prodSurvey.length + this.customIndexForm.prodFlow.length + this.customIndexForm.prodTransForm.length
      this.sumData = []
      this.sumData = this.sumData.concat(this.customIndexForm.prodSurvey).concat(this.customIndexForm.prodFlow).concat(this.customIndexForm.prodTransForm)
      // console.log(this.sumData)
      var checks = document.getElementsByName('prodSurvey')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= this.maxSelectNum) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < this.maxSelectNum) {
        this.textShare(span, 'black')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'customIndexForm.prodTransForm' () {
      this.selectNum = this.customIndexForm.prodSurvey.length + this.customIndexForm.prodFlow.length + this.customIndexForm.prodTransForm.length
      this.sumData = []
      this.sumData = this.sumData.concat(this.customIndexForm.prodSurvey).concat(this.customIndexForm.prodFlow).concat(this.customIndexForm.prodTransForm)
      // console.log(this.sumData)
      var checks = document.getElementsByName('prodSurvey')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= this.maxSelectNum) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < this.maxSelectNum) {
        this.textShare(span, 'black')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'sumData' () {
      this.controlTrendDataShow()
      // this.getRealTimechartData()
    }
    // 'seriesControlDataArr' () {
    //   this.getRealTimechartData()
    // }
  },
  methods: {
    /**
     * 展示商品详情
     * @param {Number} prodId 商品id
     */
    handleShowProdDetailPop (prodId) {
      this.prodDetailVisiable = true
      this.$nextTick(() => {
        this.$refs.prodDetail.init(prodId)
      })
    },
    /**
     * handleHidePop
     */
    handleHidePop () {
      this.prodDetailVisiable = false
    },
    /**
     * 刷新时间
     */
    flushDateTime () {
      const date = new Date()
      this.nowDate = moment(date).format('LL')
      this.dateRange1 = [moment(date).format('L') + ' 00:00:00', this.nowDate]
      this.getProdSurvey()
    },
    /**
     * 1:今天 2: 近七天 3:近30天 4:自然日 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      this.prodData.dateValue = val
      if (val === 1) {
        startDay = 0
        endDay = 0
        this.dateRange1 = [moment().format('L') + ' 00:00:00', this.nowDate]
        this.getProdSurvey()
        return
      } else if (val === 2) {
        startDay = -7
        endDay = -1
      } else if (val === 3) {
        startDay = -30
        endDay = -1
      } else if (val === 4) {
        startDay = -1
        endDay = 0
      } else if (val === 5) {
        this.preMonth = this.getPreMonth()
        this.getProdSurvey()
        return
      } else {
        return
      }
      // 开始时间
      var startTime = moment().add(startDay, 'days').startOf('days')
      // 结束时间
      var endTime = moment().add(endDay, 'days').endOf('days')
      this.dateRange = [startTime.format('L'), endTime.format('L')]
      this.dateRange1 = [startTime.format('LL'), endTime.format('LL')]
      this.getProdSurvey()
    },
    /**
     * 2: 近七天 3:近30天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange2 (val) {
      var startDay = null
      var endDay = null
      if (val === 2) {
        startDay = -7
        endDay = -1
      } else if (val === 3) {
        startDay = -30
        endDay = -1
      } else if (val === 5) {
        this.preMonth2 = this.getPreMonth()
        this.getPayAmountTop()
        return
      } else {
        return
      }
      // 开始时间
      var startTime = moment().add(startDay, 'days').startOf('days')
      // 结束时间
      var endTime = moment().add(endDay, 'days').endOf('days')
      this.dateRange2 = [startTime.format('L'), endTime.format('L')]
      this.dateRange2Param = [startTime.format('LL'), endTime.format('LL')]
      this.getPayAmountTop()
    },
    /**
     * 2: 近七天 3:近30天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange3 (val) {
      var startDay = null
      var endDay = null
      if (val === 2) {
        startDay = -7
        endDay = -1
      } else if (val === 3) {
        startDay = -30
        endDay = -1
      } else if (val === 5) {
        this.preMonth3 = this.getPreMonth()
        this.getProdTrendAnalysis()
        return
      } else {
        return
      }
      // 开始时间
      var startTime = moment().add(startDay, 'days').startOf('days')
      // 结束时间
      var endTime = moment().add(endDay, 'days').endOf('days')
      this.dateRange3 = [startTime.format('L'), endTime.format('L')]
      this.dateRange3Param = [startTime.format('LL'), endTime.format('LL')]
      this.getProdTrendAnalysis()
      // console.log(this.dateRange3)
    },
    getPreMonth () {
      var date = moment().add(-1, 'month').startOf('month')
      // 上一个月的开始时间
      var timeStar = moment(date).startOf('month').format('LL')
      // 上一个月的结束时间
      var timeEnd = moment(date).endOf('month').format('LL')
      this.dateRange1 = [timeStar, timeEnd]
      this.dateRange2Param = [timeStar, timeEnd]
      this.dateRange3Param = [timeStar, timeEnd]
      return moment(date).format('L')
    },
    getMonthToStr (date) {
      let start = moment(date).startOf('month').format('LL')
      let end = moment(date).endOf('month').format('LL')
      return [start, end]
    },
    /**
     * 当dateRange == 4 监听dateRange[0]的变化
     */
    handleRangeFour () {
      var date = this.dateRange[0]
      if (date) {
        var start = moment(date).startOf('days').format('LL')
        var end = moment(date).endOf('days').format('LL')
        this.dateRange1 = [start, end]
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      // this.page.current = 1
      this.getProdSurvey()
    },
    /**
     * 当dateRange == 5 监听dateRange[0]的变化
     */
    handleMonth () {
      if (this.preMonth) {
        this.dateRange1 = this.getMonthToStr(this.preMonth)
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      this.getProdSurvey()
    },
    handleMonth2 () {
      if (this.preMonth2) {
        this.dateRange2Param = this.getMonthToStr(this.preMonth2)
      } else {
        this.dateRange2Param = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      this.getPayAmountTop()
    },
    handleMonth3 () {
      if (this.preMonth3) {
        this.dateRange3Param = this.getMonthToStr(this.preMonth3)
      } else {
        this.dateRange3Param = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      this.getProdTrendAnalysis()
    },
    /**
     * 获取商品概况数据
     */
    getProdSurvey () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getProdSurvey'),
        method: 'get',
        params: this.$http.adornParams(
          {
            shopId: null,
            dateType: this.dateValue,
            startTime: this.dateRange1[0],
            endTime: this.dateRange1[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.prodData.data = data.data
          this.prodData.lastData = data.lastData
          this.prodData.rate = data.rate
          this.dataListLoading = false
        }
      })
    },
    /**
     * 商品趋势分析数据
     */
    getProdTrendAnalysis () {
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getProdTrendAnalysis'),
        method: 'get',
        params: this.$http.adornParams(
          {
            dateType: this.dateValue3,
            startTime: this.dateRange3Param[0],
            endTime: this.dateRange3Param[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.dateArr = []
          this.seriesDataArr = []
          let obj1 = this.initObj(this.$i18n.t('dataAnalysis.numberOfNewProducts'))
          let obj2 = this.initObj(this.$i18n.t('dataAnalysis.goodsVisited'))
          let obj3 = this.initObj(this.$i18n.t('dataAnalysis.goodsSold'))
          let obj4 = this.initObj(this.$i18n.t('dataAnalysis.shareVisits'))
          let obj5 = this.initObj(this.$i18n.t('dataAnalysis.productViews'))
          let obj6 = this.initObj(this.$i18n.t('dataAnalysis.productVisitors'))
          let obj7 = this.initObj(this.$i18n.t('dataAnalysis.carNumbers'))
          let obj8 = this.initObj(this.$i18n.t('dataAnalysis.orderCounts'))
          let obj9 = this.initObj(this.$i18n.t('dataAnalysis.payCounts'))
          data.forEach(i => {
            this.dateArr.push(i.currentDay)
            obj1.data.push(i.newProd)
            obj2.data.push(i.visitedProd)
            obj3.data.push(i.dynamicSale)
            obj4.data.push(i.shareVisit)
            obj5.data.push(i.browse)
            obj6.data.push(i.visitor)
            obj7.data.push(i.addCart)
            obj8.data.push(i.orderNum)
            obj9.data.push(i.payNum)
          })
          this.seriesDataArr.push(obj1)
          this.seriesDataArr.push(obj2)
          this.seriesDataArr.push(obj3)
          this.seriesDataArr.push(obj4)
          this.seriesDataArr.push(obj5)
          this.seriesDataArr.push(obj6)
          this.seriesDataArr.push(obj7)
          this.seriesDataArr.push(obj8)
          this.seriesDataArr.push(obj9)
        }
        // console.log(this.sumData)
        // console.log(this.seriesDataArr)
        // this.customIndexForm.prodSurvey = ['新增商品数', '被访问商品数', '动销商品数'] // '新增商品数', '被访问商品数', '动销商品数'
        this.controlTrendDataShow()
        this.getRealTimechartData()
      })
    },
    /**
     * 控制趋势图的数据显示
     */
    controlTrendDataShow () {
      //
      this.seriesControlDataArr = []
      var length = 0
      this.sumData.forEach(i => {
        length = length + 1
        this.seriesDataArr.forEach(element => {
          if (i === element.name) {
            element.smooth = true
            element.itemStyle = this.lineStyle[length - 1]
            element.areaStyle = this.areaStyle[length - 1]
            this.seriesControlDataArr.push(element)
          }
        })
      })
      if (this.sumData.length < 1) {
        this.seriesControlDataArr = []
      }
      if (length === this.sumData.length) {
        this.getRealTimechartData()
      }
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      obj.data = []
      return obj
    },
    /**
     * 商品趋势分析表
     */
    getRealTimechartData () {
      this.myChartTimeSurvey = this.$echarts.init(document.getElementById('time-survey'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 8,
          textStyle: { // 提示框浮层的文本样式。
            fontSize: '12px',
            fontWeight: 400,
            color: '#33333',
            opacity: 1,
            lineHeight: '20px'
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        // x轴的颜色和宽度

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateArr,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false }
        },
        series: this.seriesControlDataArr
      }
      this.myChartTimeSurvey.setOption(option, true)
      const that = this
      window.addEventListener('resize', function () {
        that.myChartTimeSurvey.resize()
      })
    },
    /**
     * 获取支付金额TOP
     */
    getPayAmountTop () {
      this.payAmountTopData = []
      this.visitorTopData = []
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getPayAmountTop'),
        method: 'get',
        params: this.$http.adornParams(
          {
            current: 1,
            size: 6,
            dateType: this.dateValue2,
            startTime: this.dateRange2Param[0],
            endTime: this.dateRange2Param[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.payAmountTopData = data.payAmounts
          this.visitorTopData = data.visitors
        }
      })
    },
    /**
     * 文字效果
     */
    textShare (div, color) {
      // 文字跳动
      // var timer = null
      // var i = 0
      // clearInterval(timer)
      // timer = setInterval(function () {
      //   div.style.display = i++ % 2 ? 'none' : 'block'
      //   i > 6 && (clearInterval(timer))
      // }, 80)
      div.style.color = color
    },  
    // 导出
    exportFrom (type) {
      let params1 = {
            shopId: null,
            dateType: this.dateValue,
            startTime: this.dateRange1[0],
            endTime: this.dateRange1[1]
          }
      let params2 = {
              current: 1,
              size: 6,
              dateType: this.dateValue2,
              startTime: this.dateRange2Param[0],
              endTime: this.dateRange2Param[1]
            }
        const loading = this.$loading({
          lock: true,
          target: (type === 1 ? '.realtime-situation' : '.refund-plate'),
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })  
        this.$http({
          url: this.$http.adornUrl(type === 1 ? '/platform/prodAnalysis/prodSurveyExport' : '/platform/prodAnalysis/payAmountTopExport'),
          method: 'get',
          params: this.$http.adornParams(
            type === 1 ? params1 : params2
          ),
          responseType: 'blob'
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = (type === 1 ? this.$i18n.t('dataAnalysis.goodsDet') : this.$i18n.t('dataAnalysis.commodityRanking')) +'.xlsx'

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
    },
  }
}
</script>

<style lang="scss" scoped>
.cursor-p {
  cursor: pointer; 
}
.mod-home {
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

  // 栏目标题行
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    font-size: 12px;
    line-height: 1em;
    display: flex;
  }
  .title-text-info {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 35px;
    display: flex;
    align-items: center;
    border: 1px solid #94B4EB;
    background: #edf4ff;
    box-shadow: 0px 2px 6px rgba(51, 51, 51, 0.04);
  }
  .title-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .new-page-title  {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .new-page-title-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .title-right {
    display: flex;
    align-items: center;
    .title-time {
      padding-right: 0;
    }
  }
  .title-picker {
    margin-left: 10px;
    margin-right: 10px;
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
    font-weight: normal;
    margin-right: 1em;
    vertical-align: middle;
  }
  .title-time {
    color: #999999;
    vertical-align: middle;
    margin: 0 6px;
  }

  .realtime {
    display: flex;
    margin-top: 40px;
    margin-left: 20px;
    padding: 0;
  }

  /**
  整体看板
   */
  .whole-plate {
    margin: 20px 0 30px;
  }

  /**
  退款看板
   */
  .refund-plate {
    //  上
    .refund-chart-box {
      display: flex;
      width: 100%;
      margin-top: 15px;
    }
    // 下
    .ranking-box {
      padding: 0;
      margin-top: 10px;
      display: flex;
      flex-direction: unset;
      justify-content: space-between;
      width: 100%;
      .prod-name {
        width: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .ranking-left-analysis,
      .ranking-right {
        width: calc(50% - 10px);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border: 1px solid #EAF0F4;
        border-bottom: none;
        .el-table td {
          border: none;
        }
      }
      .ranking-title {
        font-size: 16px;
        font-weight: 400;
        line-height: 50px;
        height: 50px;
        color: #463333;
        padding-left: 20px;
        margin-bottom: 10px;
        background: #F7F8FA;
      }
    }
  }
  // 图片 + 文本
  .table-cell-con {
    display: flex;
    align-items: center;
    .table-cell-image {
      width: 42px;
      height: 42px;
      margin-right: 10px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .table-cell-text {
      flex: 1;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 20px;
    }
  }
}
.charts-title {
  width: 100%;
  display: flex;
  justify-content: center;
}
.charts-title .charts-title-item .line {
  width: 18px;
  height: 8px;
  opacity: 1;
  border-radius: 8px;
  margin-right: 10px;
}
.charts-title .charts-title-item {
  margin-right: 40px;
  color: #999999;
  font-size: 12px;
  display: flex;
  align-items: center;
  height: 20px;
}
  ::v-deep .export-load {
    // top: -50% !important;
  }
</style>

