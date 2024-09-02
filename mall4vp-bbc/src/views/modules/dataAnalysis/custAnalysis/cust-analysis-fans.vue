<template>
  <div class="customer-stats">
    <cust-analysis-title :title="title"></cust-analysis-title>
    <cust-analysis-overview :overviewData="overviewData1"></cust-analysis-overview>


    <div class="fans-chart">
      <div class="fans-chart__title clearfix">
        <h4>{{$t('dataAnalysis.fansAct')}}</h4>
        <div class="chart-trigger fans-chart__title-trigger">
          <span class="chart-trigger__item chart-trigger__item1 chart-trigger__item1--active">{{$t('dataAnalysis.distribution')}}</span>
          <span class="chart-trigger__item chart-trigger__item2">{{$t('dataAnalysis.trend')}}</span>
        </div>
      </div>

      <cust-analysis-overview :overviewData="overviewData2"></cust-analysis-overview>  

      <!-- <div class="zent-loading zent-loading--block zent-loading--has-children">
        <div class="fans-chart__pie"></div>
        <div class="echarts-for-react fans-chart__bar"></div>
      </div> -->
    </div>
    <div id="statas-chart" style="width:100%;height:300px"></div>
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
  data () {
    return {
      title: this.$i18n.t('dataAnalysis.wechatFansSpantatistics')
    }
  },
  methods: {
    /**
     * 初始化总览信息
     */
    initOverviewData: function () {
      this.overviewData1 = {
        title: [this.$i18n.t('dataAnalysis.cumulativeFans'), this.$i18n.t('dataAnalysis.newFans'), this.$i18n.t('dataAnalysis.lostFans'), this.$i18n.t('dataAnalysis.netIncreaseOfFans')],
        num: ['0', '0', '0', '0'],
        type: ['1', '1', '1', '1']
      }
      this.overviewData2 = {
        title: [this.$i18n.t('dataAnalysis.visitFans'), this.$i18n.t('dataAnalysis.couponFans'), this.$i18n.t('dataAnalysis.addCartFans'), this.$i18n.t('dataAnalysis.paidFans')],
        num: ['0', '0', '0', '0'],
        type: ['0', '0', '0', '0']
      }
    },
    /**
     * 生成图表
     */
    getChart: function () {
      const myChart = this.$echarts.init(document.getElementById('statas-chart'), 'walden')
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }

      myChart.setOption(option)
    }
  },
  mounted () {
    this.initOverviewData()
    this.getChart()
  }
}
</script>

<style lang="scss">
</style>

