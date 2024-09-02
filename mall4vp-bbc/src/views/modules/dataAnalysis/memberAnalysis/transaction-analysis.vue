<template>
  <!-- 新老会员成交分析 -->
  <div class="member-analysis transaction-analysis">
    <div class="board-title">{{$t('dataAnalysis.transactionAnalysisOfNewAndOldMembers')}}</div>

    <!-- 数据指标 -->
    <div class="data-indicators">
      <span>{{$t('dataAnalysis.dataIndicators')}}</span>
      <el-radio v-model="dataIndicators" disabled :label="0">{{$t('dataAnalysis.customers')}}</el-radio>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <el-table
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column prop="type" :label="$t('dataAnalysis.customerType')" />
        <el-table-column prop="payMemberNum" :label="$t('dataAnalysis.newTMNumbers')" />
        <el-table-column prop="payMemberNumRate" :label="$t('dataAnalysis.tradedMembersRatio')" />
        <el-table-column prop="payOrderNum" :label="$t('dataAnalysis.payOrderQuantity')" />
        <el-table-column prop="pricePerMember" :label="$t('dataAnalysis.customerUnitPrice')" />
        <el-table-column prop="payAmount" :label="$t('dataAnalysis.paymentAmount')" />
        <el-table-column prop="payAmountRate" :label="$t('dataAnalysis.proportionOfPaymentAmount')" />
      </el-table>
    </div>

    <!-- 趋势指标 -->
    <div class="trend-indicators">
      <span>{{$t('dataAnalysis.trendIndicators')}}：</span>
      <el-radio-group v-model="trendIndicators">
        <el-radio :label="0">{{$t('dataAnalysis.numberOfTradedMembers')}}</el-radio>
        <el-radio :label="1">{{$t('dataAnalysis.payOrderQuantity')}}</el-radio>
        <el-radio :label="2">{{$t('dataAnalysis.customerUnitPrice')}}</el-radio>
        <el-radio :label="3">{{$t('dataAnalysis.paymentAmount')}}</el-radio>
      </el-radio-group>
    </div>

    <!-- 图表 -->
    <div class="chart-content">
      <div id="membership-transaction-analysis-chart" style="width: 100%; height: 230px;" />
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      dataIndicators: 0, // 数据指标
      dateRange: [],
      trendDateArray: [], // 新老会员成交分析 时间数据
      trendNewArray: [], //  新老会员成交分析 新成交会员数据
      trendOldArray: [], //  新老会员成交分析 老成交会员数据
      radio6BNewTitil: 0, // Echart新成交会员的标题名
      // radio6BNewTitilArray: [this.$i18n.t('dataAnalysis.newTM'), this.$i18n.t('dataAnalysis.newTMNumbers'), this.$i18n.t('dataAnalysis.newTMPP'), this.$i18n.t('dataAnalysis.newTMPaidAmount')], // 第六部分 Echart新成交会员的标题名列表
      // radio6BOldTitilArray: [this.$i18n.t('dataAnalysis.oldTM'), this.$i18n.t('dataAnalysis.oldTMNumbers'), this.$i18n.t('dataAnalysis.oldTMPP'), this.$i18n.t('dataAnalysis.newTMPaidAmount')], // 第六部分 Echart老成交会员的标题名列表
      radio6BNewTitilArray: [this.$t('dataAnalysis.newTMNumbers'), this.$t('dataAnalysis.newTMPN'), this.$t('dataAnalysis.newTMPP'), this.$t('dataAnalysis.newTMPaidAmount')], // 第六部分 Echart新成交会员的标题名列表
      radio6BOldTitilArray: [this.$t('dataAnalysis.oldTMNumbers'), this.$t('dataAnalysis.oldTMPN'), this.$t('dataAnalysis.oldTMPP'), this.$t('dataAnalysis.oldTMPaidAmount') ], // 第六部分 Echart老成交会员的标题名列表
      radio6AllTitilArray: [],
      radio6BOldTitil: 0, // Echart老成交会员的标题名
      trendIndicators: 0, // 趋势指标
      dateType: 1,
      dataList: [{
        type: this.$t('dataAnalysis.allTradedMember'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }, {
        type: this.$t('dataAnalysis.newTM'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }, {
        type: this.$t('dataAnalysis.oldTM'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }],
      tableInfo: [{
        customerType: this.$t('dataAnalysis.allTradedMember'), // 客户类型
        membersSoldNumber: 859, // 成交会员数
        membersSoldPercentage: '26%', // 成交会员占比
        paidOrderNum: 15, // 支付订单数
        customerUnitPrice: 59.4, // 客单价
        paidAmount: 399.52, // 支付金额
        paidAmountPercentage: '100%' // 支付金额占比

      },
      {
        customerType: this.$t('dataAnalysis.newTM'), // 客户类型
        membersSoldNumber: 456, // 成交会员数
        membersSoldPercentage: '28%', // 成交会员占比
        paidOrderNum: 25, // 支付订单数
        customerUnitPrice: 14.23, // 客单价
        paidAmount: 458.21, // 支付金额
        paidAmountPercentage: '58.9%' // 支付金额占比
      },
      {
        customerType: this.$t('dataAnalysis.oldTM'), // 客户类型
        membersSoldNumber: 587, // 成交会员数
        membersSoldPercentage: '98%', // 成交会员占比
        paidOrderNum: 14, // 支付订单数
        customerUnitPrice: 124.2, // 客单价
        paidAmount: 147.52, // 支付金额
        paidAmountPercentage: '68.65%' // 支付金额占比
      }],

      prodTrendDataXAxis: ['2021-04-20', '2021-04-21', '2021-04-22', '2021-04-23', '2021-04-23', '2021-04-25', '2021-04-26'] // x轴数据
    }
  },
  watch: {
    dateRange () {
      this.dateType = this.$parent.timeType
      // 会员概览后台数据
      this.getMemberOverviewData()
    },
    // 监听第六部分
    trendIndicators (val) {
      this.switchSixEchart(val)
    }
  },

  mounted () {
    this.dateType = this.$parent.timeType
    // 会员概览后台数据
    // this.getMemberOverviewData()
  },

  methods: {
    getMemberOverviewData () {
      if (this.$parent.dateRange && this.$parent.dateRange.length > 0) {
        this.startTime = this.$parent.dateRange[0]
        this.endTime = this.$parent.dateRange[1]
      } else {
        this.startTime = this.$parent.startTime
        this.endTime = this.$parent.endTime
      }
      let param = {
        dateType: this.dateType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/getMemberDeal'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(data => {
        data = data.data
        if (data) {
          // 新老会员数据填充
          data.allMember.type = this.dataList[0].type
          data.newMember.type = this.dataList[1].type
          data.oldMember.type = this.dataList[2].type
          this.dataList = []
          this.dataList.push(data.allMember)
          this.dataList.push(data.newMember)
          this.dataList.push(data.oldMember)

          this.dataList.forEach(i => {
            i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
            i.payAmountRate = (i.payAmountRate * 100).toFixed(2) + '%'
          })

          for (let i = 0; i < data.trendParam.length; i++) {
            data.trendParam[i].currentDay = this.formatDate(data.trendParam[i].currentDay)
          }
          this.tempSixData = data.trendParam
          this.switchSixEchart(this.trendIndicators)
        }
      })
    },
    /**
     * 格式化时间
     */
    formatDate: function (date) {
      var tempDate = date + ''
      return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
    },
    // 第六部分Echart图切换选项
    switchSixEchart (trendType) {
      var myData = this.tempSixData
      this.trendDateArray = []
      this.trendNewArray = []
      this.trendOldArray = []
      this.radio6BNewTitil = this.radio6BNewTitilArray[trendType]
      this.radio6BOldTitil = this.radio6BOldTitilArray[trendType]
      switch (trendType) {
        case 0:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayMemberNum
            this.trendOldArray[i] = myData[i].oldPayMemberNum
          }
          break
        case 1:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayOrderNum
            this.trendOldArray[i] = myData[i].oldPayOrderNum
          }
          break
        case 2:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPricePerMember
            this.trendOldArray[i] = myData[i].oldPricePerMember
          }
          break
        case 3:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayAmount
            this.trendOldArray[i] = myData[i].oldPayAmount
          }
          break

        default:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayMemberNum
            this.trendOldArray[i] = myData[i].oldPayMemberNum
          }
          break
      }
      this.getChartData()
    },
    // 柱状图数据
    getChartData () {
      this.radio6AllTitilArray = this.radio6BNewTitilArray.concat(this.radio6BOldTitilArray)
      const myChart = this.$echarts.init(document.getElementById('membership-transaction-analysis-chart'))
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.radio6AllTitilArray
        },
        grid: {
          left: 30,
          right: 40,
          top: 55,
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          data: this.trendDateArray
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: this.radio6BNewTitil,
          type: 'bar',
          data: this.trendNewArray,
          itemStyle: {
            normal: {
              // 定制显示
              color: '#02A1E9'
            }
          }
        },
        {
          name: this.radio6BOldTitil,
          type: 'bar',
          data: this.trendOldArray,
          itemStyle: {
            normal: {
              // 定制显示
              color: '#3DD86B'
            }
          }
        }]
      }
      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss">
.member-analysis.transaction-analysis {
  // 数据指标
  .data-indicators {
    font-size: 14px;
    color: #333;
    padding-top: 10px;
  }

  // 趋势指标
  .trend-indicators {
    margin-bottom: 30px;
    font-size: 14px;
    color: #333;
    background: #f7f8fa;
    padding: 20px;
    .el-radio__input.is-checked + .el-radio__label {
      color: #333;
    }
    .el-radio__input.is-checked .el-radio__inner {
      // border-color: #02A1E9;
      // background: #02A1E9;
    }
  }

  // 表格
  .table-box {
    margin: 20px 0;
    .table-header {
      height: 60px;
    }
    .table-row {
      height: 56px;
    }
  }

  // 图表
  .chart-content {
    margin-bottom: 20px;
  }
}
</style>
