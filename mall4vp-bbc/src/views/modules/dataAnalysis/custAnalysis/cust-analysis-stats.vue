<template>
  <div class="customer-stats">
    <!-- 标题 -->
    <cust-analysis-title :title="title" :tips="tips"></cust-analysis-title>
    <!-- 总览 -->
    <cust-analysis-overview :overviewData="overviewData"></cust-analysis-overview>
    <!-- 图表 -->
    <div class="chart">
      <div class="charts-title">
        <div class="charts-title-item" v-for="(item,index) in sumData" :key="item">
          <div :style="{background: lineStyle[index].normal.lineStyle.color}" class="line"></div>
          <span>{{ item }}</span>
          </div>
      </div>
      <div id="statas-chart" style="width:100%;height:300px"></div>
    </div>
  </div>
</template>

<script>
import custAnalysisTitle from './cust-analysis-title'
import custAnalysisOverview from './cust-analysis-overview'

export default {
  components: {
    custAnalysisTitle,
    custAnalysisOverview
  },
  props: {
    timeData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      title: '',     // 标题
      tips: '',      // 提示
      // 总览信息
      overviewData: {
        title: [],
        num: [],
        type: 1,
        rate: []
      },
      sumData: [],
      dateArr: [],         // 趋势图时间数组
      seriesDataArr: [],   // 所有数据
      dateValue: '',
      dateRange: [],
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
      ]
    }
  },
  mounted () {
    this.initOverviewData()
    // this.getCouponChart()
  },
  watch: {
    timeData: {
      handler (newValue, oldValue) {
        this.dateValue = this.timeData.dateValue
        this.dateRange = this.timeData.dateRange
        this.getCustSurvey()
      },
      deep: true
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initOverviewData: function () {
      this.title = this.$i18n.t('dataAnalysis.customerProfile')
      this.tips = this.$i18n.t('dataAnalysis.customerTips')

      this.overviewData = {
        title: [this.$i18n.t('dataAnalysis.numberOfVisitors'), this.$i18n.t('dataAnalysis.cumulativePaid'), this.$i18n.t('dataAnalysis.cumulativeNumberOfMembers'), this.$i18n.t('dataAnalysis.customersTraded')],
        num: ['0', '0', '0', '0'],
        type: 1,
        rate: ['0', '0', '0', '0']
      }
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      // obj.stack = '总量'
      obj.smooth = true
      obj.data = []
      return obj
    },
    /**
     * 获取商品概况数据
     */
    getCustSurvey () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getCustomerAnalysis'),
        method: 'get',
        params: this.$http.adornParams(
          {
            dateType: this.dateValue,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          // 概况信息赋值
          this.overviewData.type = this.dateValue
          this.overviewData.num = [data.visitor, data.fashNum, data.member, data.payNum]
          this.overviewData.rate = [data.visitorRate, data.fashNumRate, data.memberRate, data.payNumRate]

          // 图表信息赋值
          this.dateArr = []
          this.seriesDataArr = []
          let obj1 = this.initObj(this.$i18n.t('dataAnalysis.numberOfVisitors'))
          let obj2 = this.initObj(this.$i18n.t('dataAnalysis.newPaidMember'))
          // let obj3 = this.initObj(this.$i18n.t('dataAnalysis.numberOfNewMembers'))
          let obj4 = this.initObj(this.$i18n.t('dataAnalysis.customersTraded'))

          data.customerTrend.forEach(i => {
            this.dateArr.push(i.currentDay)
            obj1.data.push(i.visitor)
            obj2.data.push(i.fashNum)
            // obj3.data.push(i.member)
            obj4.data.push(i.payNum)
          })

          this.seriesDataArr.push(obj1)
          this.seriesDataArr.push(obj2)
          // this.seriesDataArr.push(obj3)
          this.seriesDataArr.push(obj4)
          let i = 0
          this.seriesDataArr.forEach(item => {
            item.itemStyle = this.lineStyle[i]
            item.areaStyle = this.areaStyle[i]
            i++
          })
          this.getCouponChart()
        }
      })
    },
    /**
     * 生成图表
     */
    getCouponChart () {
      this.sumData = []
      this.seriesDataArr.forEach(item => {
        this.sumData.push(item.name)
      })
      const myChart = this.$echarts.init(document.getElementById('statas-chart'), 'walden')
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
        grid: {
          top: '50px',
          left: '50px',
          right: '15px',
          bottom: '50px'
        },
        legend: [],
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
        series: this.seriesDataArr
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-stats {
  .chart {
    margin-top: 20px;
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
</style>

