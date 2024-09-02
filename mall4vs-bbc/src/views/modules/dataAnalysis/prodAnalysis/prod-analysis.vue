<template>
  <div class="mod-prod-analysis-home">
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
          <span class="text">{{ $t("dataAnaly.ovelProduvervi") }}</span>
        </div>
        <!-- 右边 -->
        <div class="new-page-title-right">
          <div class="title-right">
            <el-select
              v-model="dateValue"
              @change="setDateRange(dateValue)"
              style="width: 100px"
              size="mini"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="title-time" v-if="dateValue === 2 || dateValue === 3"
              >{{ this.dateRange[0] }}{{ $t("time.tip")
              }}{{ this.dateRange[1] }}</span
            >
          </div>
          <div v-if="dateValue === 4" style="margin-bottom: 8px" class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px; margin-top: 7px"
              v-model="dateRange[0]"
              @change="handleRangeFour()"
              type="date"
              :placeholder="this.$i18n.t('admin.seleData')"
              :picker-options="PickerOptions"
            ></el-date-picker>
          </div>
          <div v-if="dateValue === 5" class="title-picker"  style="margin-bottom: 8px">
            <el-date-picker
              size="mini"
              style="width: 150px; margin-top: 7px"
              v-model="preMonth"
              @change="handleMonth()"
              type="month"
              :placeholder="this.$i18n.t('dataAnaly.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <!-- /栏目标题行 -->
      <!-- 商品概况列表 -->
      <div v-loading="dataListLoading" class="item-list">
        <prod-survey-table :prodData="prodData"></prod-survey-table>
      </div>
      <!-- /商品概况列表 -->
    </div>
    <!-- /实时概况板块 -->
    <!-- 说明文字板块 -->
    <div>
      <div class="title-text-info">
        <span>{{ $t("dataAnaly.orderTip1") }}{{ $t("dataAnaly.orderTip2") }}</span>
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
            $t("dataAnaly.commodityTrendAnalysis")
          }}</span>
        </div>
        <div class="title-right">
          <el-select
            v-model="dateValue3"
            @change="setDateRange3(dateValue3)"
            style="width: 100px"
            size="mini"
          >
            <el-option
              v-for="item in dateOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="title-time" v-if="dateValue3 === 2 || dateValue3 === 3"
            >{{ dateRange3[0] }} - {{ dateRange3[1] }}</span
          >
          <div v-if="dateValue3 === 5" class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              @change="handleMonth3()"
              v-model="preMonth3"
              type="month"
              :placeholder="this.$i18n.t('time.tip')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
          <div style="margin-left: 10px">
            <el-popover placement="right" width="500" trigger="click">
              <el-form :model="customIndexForm" class="form-inline">
                <el-form-item
                  :label="this.$i18n.t('dataAnaly.commodityOverview') + ':'"
                >
                  <el-checkbox-group v-model="customIndexForm.prodSurvey">
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.numberOfNewProducts')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.numberOfProductsVisited')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.numberOfProductsForSale')"
                      name="prodSurvey"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  :label="this.$i18n.t('dataAnaly.commodityFlow') + ':'"
                >
                  <el-checkbox-group v-model="customIndexForm.prodFlow">
                    <el-checkbox
                      :checked="true"
                      :label="this.$i18n.t('dataAnaly.shareVisits')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :checked="true"
                      :label="this.$i18n.t('dataAnaly.productViews')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :checked="true"
                      :label="this.$i18n.t('dataAnaly.commodityVisitors')"
                      name="prodSurvey"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  :label="this.$i18n.t('dataAnaly.shareVisits') + ':'"
                >
                  <el-checkbox-group v-model="customIndexForm.prodTransForm">
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.numberOfCases')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.orderNumber')"
                      name="prodSurvey"
                    ></el-checkbox>
                    <el-checkbox
                      :label="this.$i18n.t('dataAnaly.numberOfPayment')"
                      name="prodSurvey"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <span id="maxSelectSpan"
                  >{{ $t("dataAnaly.mostChoices") }}{{ maxSelectNum
                  }}{{ $t("dataAnaly.item") }}</span
                >
                <span
                  >{{ $t("dataAnaly.chosen") }} {{ selectNum }}
                  {{ $t("dataAnaly.item") }}</span
                >
              </el-form>
              <div class="default-btn" slot="reference">{{
                $t("dataAnaly.selectTheIndicatorToDisplay")
              }}</div>
            </el-popover>
          </div>
        </div>
      </div>
      <!-- /栏目标题行 -->
      <!-- 图表 -->
      <div class="charts-box">
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
      </div>

      <!-- /图表 -->
    </div>
    <!-- /整体看板 -->

    <!-- 商品排行整体看板 -->
    <div class="refund-plate">
      <!-- 栏目标题行 -->
      <div class="new-page-title">
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{ $t("dataAnaly.commodityRanking") }}</span>
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
            style="width: 100px"
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
            >{{ dateRange2[0] }}{{ $t("time.tip") }}{{ dateRange2[1] }}</span
          >
          <div v-if="dateValue2 === 5" class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px"
              @change="handleMonth2()"
              v-model="preMonth2"
              type="month"
              :placeholder="this.$i18n.t('dataAnaly.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <!-- </el-form-item> -->
        <!-- </el-form> -->
      </div>
      <!-- /栏目标题行 -->

      <!-- 下 -->
      <div class="ranking-box">
        <div class="ranking-left">
          <div class="ranking-title">
            {{ $t("dataAnaly.paymentAmountTOP") }}
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
              :label="$t('product.prodInfo')"
              type="index"
              width="500">
              <template slot-scope="scope">
                <div class="table-cell-con" @click="toProdDetail(scope.row)">
                  <div class="table-cell-image">
                    <!-- <img :src="scope.row.pic" :alt="scope.row.prodName"> -->
                    <prod-pic
                      :pic="scope.row.pic"
                    ></prod-pic>
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
            {{ $t("dataAnaly.numberOfVisitorsTOP") }}
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
              :label="$t('product.prodInfo')"
              width="430">
              <template slot-scope="scope">
                <div class="table-cell-con" @click="toProdDetail(scope.row)">
                  <div class="table-cell-image">
                    <!-- <img :src="scope.row.pic" :alt="scope.row.prodName"> -->
                    <prod-pic
                      :pic="scope.row.pic"
                    ></prod-pic>
                  </div>
                  <span class="table-cell-text">{{ scope.row.prodName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('dataAnaly.numberOfVisitors')"
              prop="visitorNum"
              align="center">
            </el-table-column>
            <el-table-column
              :label="$t('dataAnaly.visitToPayConversionRate')"
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
  </div>
</template>

<script>
import ProdSurveyTable from './prod-survey-table'
import moment from 'moment'
import ProdPic from '@/components/prod-pic'

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
      dateValue: 2,
      dateValue2: 2,
      dateValue3: 2,
      PickerOptions: {
        disabledDate (time) {
          var date = moment().startOf('days')
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
          label: this.$i18n.t('dataAnaly.nearly7Days'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnaly.nearly30Days'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnaly.natureDay'),
          value: 4
        },
        {
          label: this.$i18n.t('dataAnaly.naturalMoon'),
          value: 5
        }
      ],
      dateOptions2: [
        {
          label: this.$i18n.t('dataAnaly.nearly7Days'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnaly.nearly30Days'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnaly.naturalMoon'),
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
      dataListLoading: false
    }
  },
  mounted () {
    this.dateValue = 2
    this.setDateRange(2)
    // this.getProdSurvey()
    // this.setDateRange(2)
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
    ProdPic
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
     * 到商品详情
     */
    toProdDetail (row) {
      this.$router.push({
        name: 'prod-prodList',
        query: {
          prodId: row.prodId,
          prodName: row.prodName
        }
      })
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
     * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月(前一个月如当前月为7月，自然月为6月)
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
        startDay = 0
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
    /**
     /**
     * 获取前一个月的时间
     */
    getPreMonth () {
      var date = moment().add(-1, 'month').startOf('month')
      // 上一个月的开始时间
      var timeStar = moment(date).startOf('month').format('LL')
      // 上一个月的结束时间
      var timeEnd = moment(date).endOf('month').format('LL')
      console.log('a', [timeStar, timeEnd])
      this.dateRange1 = [timeStar, timeEnd]
      this.dateRange2Param = [timeStar, timeEnd]
      this.dateRange3Param = [timeStar, timeEnd]
      console.log('a', this.dateRange1)
      console.log('ab', this.dateRange2Param)
      console.log('abc', this.dateRange3Param)
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
        url: this.$http.adornUrl('/multishop/prodAnalysis/getProdSurvey'),
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
        url: this.$http.adornUrl('/multishop/prodAnalysis/getProdTrendAnalysis'),
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
          let obj1 = this.initObj(this.$i18n.t('dataAnaly.numberOfNewProducts'))
          let obj2 = this.initObj(this.$i18n.t('dataAnaly.numberOfProductsVisited'))
          let obj3 = this.initObj(this.$i18n.t('dataAnaly.numberOfProductsForSale'))
          let obj4 = this.initObj(this.$i18n.t('dataAnaly.shareVisits'))
          let obj5 = this.initObj(this.$i18n.t('dataAnaly.productViews'))
          let obj6 = this.initObj(this.$i18n.t('dataAnaly.commodityVisitors'))
          let obj7 = this.initObj(this.$i18n.t('dataAnaly.numberOfCases'))
          let obj8 = this.initObj(this.$i18n.t('dataAnaly.orderNumber'))
          let obj9 = this.initObj(this.$i18n.t('dataAnaly.numberOfPayment'))
          data.forEach(i => {
            console.log('i.browse', i.browse)
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
          console.log(this.seriesDataArr)
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
      // console.log(this.seriesControlDataArr)
      if (length === this.sumData.length) {
        this.getRealTimechartData()
      }
      // console.log(this.seriesControlDataArr)
      // this.getRealTimechartData()
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
      // console.log(this.seriesControlDataArr)
      this.myChartTimeSurvey = this.$echarts.init(document.getElementById('time-survey'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis'
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
        url: this.$http.adornUrl('/multishop/prodAnalysis/getPayAmountTop'),
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
          // this.payAmountTopData = data.payAmounts
          // this.visitorTopData = data.visitors
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

    /**
     * 数据表格头部样式
     */
    analysisTableHeaderClass () {
      return {
        height: '42px', background: '#FFF', color: '#666666', 'font-weight': '500', border: 'none'
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
  }
}
</script>

<style lang="scss">
.mod-prod-analysis-home {

  // 栏目标题行
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    font-size: 12px;
    line-height: 1em;
    display: flex;
    justify-content: space-between;
  }
  .title-text-info {
    padding: 20px;
    height: 60px;
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
    display: inline-block;
    padding: 0 10px;
  }

  .realtime {
    display: flex;
    margin-top: 40px;
    margin-left: 20px;
    padding: 0;
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
  /**
    实时概况
     */
  // .realtime-situation {
  //   // margin-bottom: 40px;
  // }

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
      margin-top: 10px;
      display: flex;
      width: 100%;
      .prod-name {
        width: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .ranking-left,
      .ranking-right {
        width: calc(50% - 9px);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border: 1px solid #EAF0F4;
        border-bottom: none;
        .el-table td {
          border: none;
        }
      }

      .ranking-left {
        margin-right: 20px;
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
    cursor: pointer;
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
.charts-box {
  border: 1px solid #EAF0F4;
  padding: 28px 10px;
  width: 100%;
}
</style>

<style scoped>
  .ranking-left >>> .el-table__header-wrapper {
    padding: 10px 0 !important;
  }
</style>

