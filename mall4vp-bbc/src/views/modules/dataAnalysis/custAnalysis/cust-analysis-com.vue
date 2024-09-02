<template>
  <div class="cust-com">
    <!-- 标题 -->
    <custAnalysisTitle :title="title" :tips="tips"></custAnalysisTitle>
    <!-- /标题 -->

    <!-- 表格 -->
    <div class="com-table">
      <el-table :data="tableData"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%"
      >
        <el-table-column prop="type" :label="$t('dataAnalysis.customerType')" width="180"></el-table-column>
        <el-table-column prop="customerNum" :label="$t('dataAnalysis.customers')"></el-table-column>
        <el-table-column prop="customerRate" :label="$t('dataAnalysis.customerNumberProportion')"></el-table-column>
        <el-table-column prop="customerSinglePrice" :label="$t('home.customerPrice')"></el-table-column>
        <el-table-column prop="payAmount" :label="$t('dataAnalysis.payAmount')"></el-table-column>
        <!-- <el-table-column prop="transRate" label="访问-付款转化率"></el-table-column> -->
      </el-table>
    </div>
    <!-- /表格 -->

    <!-- 单选按钮 -->
    <div class="six-radio">
      <span>{{$t('dataAnalysis.trendIndicatorSelection')}}：</span>
      <el-radio-group v-model="radio">
        <el-radio :label="0">{{$t('dataAnalysis.customers')}}</el-radio>
        <el-radio :label="1">{{$t('home.customerPrice')}}</el-radio>
        <el-radio :label="2">{{$t('dataAnalysis.payAmount')}}</el-radio>
        <!-- <el-radio :label="3">访问-付款转化率</el-radio> -->
      </el-radio-group>
    </div>
    <!-- /单选按钮 -->

    <!-- 数据图 -->
    <div class="deal-cust-chart">

      <div id="deal-cust-chart" style="width:100%;height:300px;"></div>
    </div>
    <!-- /数据图 -->
  </div>
</template>

<script>
import custAnalysisTitle from './cust-analysis-title'

export default {
  components: {
    custAnalysisTitle
  },
  props: {
    timeData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      title: '',
      tips: '',
      radio: 0,
      tableData: [],
      dateArr: [],
      // 接口返回的数据
      newCustNum: [],
      oldCustNum: [],
      newCustSingPrice: [],
      oldCustSingPrice: [],
      newPayAmount: [],
      oldPayAmount: [],
      newTransRate: [],
      oldTransRate: [],
      // 图表的标题和展示的数据
      newCustTitle: [],
      oldCustTitle: [],
      newCustArr: [],
      oldCustArr: [],
      // 第四个图
      seriesDataArr: []
    }
  },
  watch: {
    timeData: {
      handler (newValue, oldValue) {
        this.dateValue = this.timeData.dateValue
        this.dateRange = this.timeData.dateRange
        this.getPayCust()
      },
      deep: true
    },
    radio (val) {
      this.switchChart(val)
    }
  },
  mounted () {
    this.initData()
    // this.getSixEchart()
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
      this.title = this.$i18n.t('dataAnalysis.transactionCustomerAnalysis')
      this.tips = this.$i18n.t('dataAnalysis.transactionTips')
      this.tableData = [{
        type: this.$i18n.t('dataAnalysis.allTradedMember'),
        customerNum: '0',
        customerRate: '0.00%',
        customerSinglePrice: '0',
        payAmount: '0',
        transRate: '0.00%'
      }, {
        type: this.$i18n.t('dataAnalysis.newTM'),
        customerNum: '0',
        customerRate: '0.00%',
        customerSinglePrice: '0',
        payAmount: '0',
        transRate: '0.00%'
      }, {
        type: this.$i18n.t('dataAnalysis.oldTM'),
        customerNum: '0',
        customerRate: '0.00%',
        customerSinglePrice: '0',
        payAmount: '0',
        transRate: '0.00%'
      }]
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      obj.stack = this.$i18n.t('home.totals')
      obj.smooth = true
      obj.data = []
      return obj
    },
    /**
     * 获取成交客户数据
     */
    getPayCust () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getCustomerDeal'),
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
          // 表格赋值 全部数据
          this.tableData[0].customerNum = data.allDeal.customerNum
          this.tableData[0].customerRate = (data.allDeal.customerRate * 100).toFixed(2) + '%'
          this.tableData[0].customerSinglePrice = data.allDeal.customerSinglePrice
          this.tableData[0].payAmount = data.allDeal.payAmount
          this.tableData[0].transRate = (data.allDeal.transRate * 100).toFixed(2) + '%'
          // 新成交客户
          this.tableData[1].customerNum = data.newDeal.customerNum
          this.tableData[1].customerRate = (data.newDeal.customerRate * 100).toFixed(2) + '%'
          this.tableData[1].customerSinglePrice = data.newDeal.customerSinglePrice
          this.tableData[1].payAmount = data.newDeal.payAmount
          this.tableData[1].transRate = (data.newDeal.transRate * 100).toFixed(2) + '%'
          // 老成交客户
          this.tableData[2].customerNum = data.oldDeal.customerNum
          this.tableData[2].customerRate = (data.oldDeal.customerRate * 100).toFixed(2) + '%'
          this.tableData[2].customerSinglePrice = data.oldDeal.customerSinglePrice
          this.tableData[2].payAmount = data.oldDeal.payAmount
          this.tableData[2].transRate = (data.oldDeal.transRate * 100).toFixed(2) + '%'
          // 图表的赋值
          this.dateArr = []
          this.seriesDataArr = []
          this.newCustNum = []
          this.oldCustNum = []
          this.newCustSingPrice = []
          this.oldCustSingPrice = []
          this.newPayAmount = []
          this.oldPayAmount = []
          let obj1 = this.initObj(this.$i18n.t('dataAnalysis.newCustomerVisitPaymentConversionRate'))
          let obj2 = this.initObj(this.$i18n.t('dataAnalysis.newCustomerVisitPaymentConversionRate'))
          data.listDeal.forEach(i => {
            this.dateArr.push(i.currentDay)
            this.newCustNum.push(i.newCustomerNum)
            this.oldCustNum.push(i.oldCustomerNum)
            this.newCustSingPrice.push(i.newCustomerSinglePrice)
            this.oldCustSingPrice.push(i.oldCustomerSinglePrice)
            this.newPayAmount.push(i.newPayAmount)
            this.oldPayAmount.push(i.oldPayAmount)
            // 第四个图的数据
            obj1.data.push(i.newTransRate)
            obj2.data.push(i.oldTransRate)
          })
          this.seriesDataArr.push(obj1)
          this.seriesDataArr.push(obj2)
          this.switchChart(this.radio)
        }
      })
    },
    // 获取数据图
    getChart () {
      // this.radio6AllTitilArray = this.radio6BNewTitilArray.concat(this.radio6BOldTitilArray)
      const myChart = this.$echarts.init(document.getElementById('deal-cust-chart'), 'walden')
      const option = {
        color: ['#155bd4', '#3DD86B'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // data: ['1', '2']
          tooltip: {
            show: true
          }
        },
        grid: {
          top: '50px',
          left: '50px',
          right: '15px',
          bottom: '50px'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.dateArr,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: ''
          }
        ],
        series: [
          {
            name: this.newCustTitle[0],
            type: 'bar',
            data: this.newCustArr,
            barWidth: 48
          },
          {
            name: this.oldCustTitle[0],
            type: 'bar',
            data: this.oldCustArr,
            barWidth: 48
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 生成第四个图表
     */
    getTrendChart () {
      const myChart = this.$echarts.init(document.getElementById('deal-cust-chart'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis'
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
    },
    // 图切换选项
    switchChart (val) {
      switch (val) {
        case 0:
          this.newCustTitle = [this.$i18n.t('dataAnalysis.numberOfNewCustomersTraded')]
          this.oldCustTitle = [this.$i18n.t('dataAnalysis.numberOfOldCustomersTraded')]
          this.newCustArr = this.newCustNum
          this.oldCustArr = this.oldCustNum
          break
        case 1:
          this.newCustTitle = [this.$i18n.t('dataAnalysis.numberOfNewCustomersTradedUnitPrice')]
          this.oldCustTitle = [this.$i18n.t('dataAnalysis.numberOfOldCustomersTradedUnitPrice')]
          this.newCustArr = this.newCustSingPrice
          this.oldCustArr = this.oldCustSingPrice
          break
        case 2:
          this.newCustTitle = [this.$i18n.t('dataAnalysis.numberOfNewCustomersTradedPayAmount')]
          this.oldCustTitle = [this.$i18n.t('dataAnalysis.numberOfOldCustomersTradedPayAmount')]
          this.newCustArr = this.newPayAmount
          this.oldCustArr = this.oldPayAmount
          break
        case 3:
          this.getTrendChart()
          return
        default:
          this.newCustTitle = [this.$i18n.t('dataAnalysis.numberOfNewCustomersTraded')]
          this.oldCustTitle = [this.$i18n.t('dataAnalysis.numberOfOldCustomersTraded')]
          this.newCustArr = this.newCustNum
          this.oldCustArr = this.oldCustNum
      }
      this.getChart()
    }
  }
}
</script>

<style lang="scss">
.cust-com {
  .com-table {
    margin-top: 20px;
  }
  .six-radio {
    display: flex;
    align-items: center;
    height: 65px;
    background: #F7F8FA;
    padding-left: 20px;
    margin-top: 20px;
    border-bottom: 1px soled #f7f8fb;
  }
  .deal-cust-chart {
    margin-top: 20px;
  }
}
</style>
