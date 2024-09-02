<template>
  <!-- 会员概览 -->
  <div class="member-analysis membership-overview">
    <div class="board-title">{{ title }}</div>
    <div
      v-if="boardType === 'numTrends' && isAuth('member:analysis:export')"
      class="default-btn primary-btn export-btn"
      @click="exportCategory()"
    >{{$t("order.export")}}</div>

    <!-- 选项 -->
    <div class="membership-options">
      <el-radio-group v-if="boardType === 'overview'" v-model="membershipRadio" size="small" @change="getMemberOverviewData">
        <el-radio-button :label="0">{{ $t('dataAnalysis.allMembers')}}</el-radio-button>
        <el-radio-button :label="1">{{ $t('dataAnalysis.freeMembers')}}</el-radio-button>
        <el-radio-button :label="2">{{ $t('dataAnalysis.payingMembers')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-if="boardType === 'numTrends' || boardType === 'percentageTrend'" v-model="membershipRadio" size="small" @change="getMemberNumTrendsData">
        <el-radio-button :label="1">{{ $t('dataAnalysis.freeMembers')}}</el-radio-button>
        <el-radio-button :label="2">{{ $t('dataAnalysis.payingMembers')}}</el-radio-button>
      </el-radio-group>
      <!-- <el-radio-group v-if="boardType === 'numTrends' || boardType === 'percentageTrend'" v-model="membershipRadio" size="small" @change="getMemberNumTrendsData">
        <el-radio-button :label="1">免费等级会员</el-radio-button>
        <el-radio-button :label="2">付费等级会员</el-radio-button>
      </el-radio-group> -->
    </div>

    <!-- 卡片栏 -->
    <membership-overview-card v-if="boardType === 'overview'" ref="overviewCard" />

    <!-- 图表 -->
    <div class="chart-content">
      <!-- 会员概览 -->
      <div v-if="boardType === 'overview'" id="membership-overview-chart" style="width: 100%; height: 230px;" />
      <!-- 会员人数趋势 -->
      <div v-if="boardType === 'numTrends'" id="membership-num-trends-chart" style="width: 100%; height: 230px;" />
      <!-- 会员占比趋势 -->
      <div v-if="boardType === 'percentageTrend'" id="membership-percentage-trend-chart" style="width: 100%; height: 230px;" />
    </div>

    <!-- 数据分析思路 -->
    <div v-if="boardType === 'numTrends'" class="data-analysis-ideas">
      <!-- <img src="@/assets/icon/data-nalysis-ideas@2x.png" class="left-icon"> -->
      <div class="txt">
        <p>{{ $t('dataAnalysis.dataAnalysisIdeas')}}</p>
        <p>{{ $t('dataAnalysis.memberText4')}}</p>
      </div>
    </div>

  </div>
</template>

<script>
import membershipOverviewCard from './membership-overview-card'
export default {
  components: { membershipOverviewCard },
  props: {
    boardType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '',
      membershipRadio: 0,
      startTime: '',
      endTime: '',
      dateType: 0,
      totalMember: 0, // 累积会员数
      newMember: 0, // 新增会员数
      payMember: 0, // 支付会员数
      couponMember: 0, // 领券会员数
      memberPayAmount: 0, // 会员支付金额
      memberPayOrder: 0, // 会员支付订单数
      memberSingleAmount: 0, // 会员客单价
      oneEchartAllName: [], // 会员概览数据图下的所有名称
      oneEchartCurrentName: '', // 会员概览数据图下的所选中的名称
      dataList: [],
      dateRange: [],
      dataArray: [],
      timeArray: [],
      rateArray: [],
      realTimeDataXAxis: ['2021-05-01', '2021-05-02', '2021-05-03', '2021-05-04', '2021-05-05', '2021-05-06', '2021-05-07'], // 实时数据的x轴数据
      realTimeDataTodayData: [310, 450, 620, 780, 400, 280, 980] // 实时数据表的今日数据
    }
  },

  watch: {
    dateRange () {
      // // 会员概览图表
      // this.getOverviewDataChart()
      if (this.boardType === 'overview') {
      // 会员概览后台数据
        this.getMemberOverviewData()
      }
      if (this.boardType === 'numTrends' || this.boardType === 'percentageTrend') {
      // // 会员人数趋势图表
      // this.getNumTrendsDataChart()
      // // 会员占比趋势图表
      // this.getPercentageTrendDataChart()
      // 会员人数趋势后台数据
        this.getMemberNumTrendsData()
      }
    }
  },
  mounted () {
    this.dateType = this.$parent.timeType
    this.compareCurrDate(this.dateType)
    // 标题
    this.getBoardTitle()
  },
  methods: {
    // 标题
    getBoardTitle () {
      switch (this.boardType) {
        case 'overview':
          this.title = this.$t('dataAnalysis.memberPcrofile')
          break
        case 'numTrends':
          this.title = this.$t('dataAnalysis.membershipTrends')
          break
        case 'percentageTrend':
          this.title = this.$t('dataAnalysis.membershipRatioTrend')
          break
        default:
          this.title = ''
      }
    },
    compareCurrDate (type) {
      switch (type) {
        // case 1:
        //   this.compareDate = this.$i18n.t('dataAnalysis.compareWithYesterday')
        //   break
        // case 2:
        //   this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePrevious7Days')
        //   break
        // case 3:
        //   this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePrevious30Days')
        //   break
        // case 4:
        //   this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePreviousOneDay')
        //   break
        // case 5:
        //   this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePreviousAMonth')
        //   break
        // default:
        //   this.compareDate = '-'
        case 1:
          this.compareDate = this.$t('dataAnalysis.compareWithThePrevious7Days')
          break
        case 2:
          this.compareDate = this.$t('dataAnalysis.compareWithThePrevious7Days')
          break
        case 3:
          this.compareDate = this.$t('dataAnalysis.compareWithThePrevious7Days')
          break
        case 4:
          this.compareDate = this.$t('dataAnalysis.compareWithThePreviousOneDay')
          break
        case 5:
          this.compareDate = this.$t('dataAnalysis.compareWithThePreviousOneDay')
          break
        default:
          this.compareDate = '-'
          break
      }
    },
    // 会员概览图表
    getOverviewDataChart () {
      const myChart = this.$echarts.init(document.getElementById('membership-overview-chart'))
      const option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.oneEchartAllName
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
          boundaryGap: false,
          data: this.timeArray
        },
        yAxis: {
          type: 'value'
          // name: '交易金额'
        },
        series: [
          {
            name: this.oneEchartCurrentName,
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#02A1E9'
                },
                // 点的颜色
                color: '#02a1e9'
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(2,161,233,0.3)'
              }, {
                offset: 1,
                color: '#ffffff'
              }])
            },
            data: this.dataArray
          }
        ]
      }
      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getMemberOverviewData () {
      let param = {
        memberType: this.membershipRadio,
        dateType: this.dateType,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getMemberSurvey'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(data => {
        data = data.data
        if (data) {
          // console.log(data)
          // 会员概览信息填充，少一个储值会员
          this.totalMember = data.memberOverviewModel.totalMember
          this.newMember = data.memberOverviewModel.newMember
          this.payMember = data.memberOverviewModel.payMember
          this.couponMember = data.memberOverviewModel.couponMember
          this.memberPayAmount = data.memberOverviewModel.memberPayAmount
          this.memberPayOrder = data.memberOverviewModel.memberPayOrder
          this.memberSingleAmount = data.memberOverviewModel.memberSingleAmount
          this.$refs.overviewCard.rateRatio = data.memberOverviewModel
          // console.log(1111)
          // console.log(this.$refs.overviewTwo.rateRatio)
          const index = this.$refs.overviewCard.indexSwitch
          this.oneEchartCurrentName = this.oneEchartAllName[index]
          this.updateOneEchart(data.memberOverviewModelList, index)
        }
      })
    },
    getMemberNumTrendsData () {
      if (this.$parent.dateRange && this.$parent.dateRange.length > 0) {
        this.startTime = this.$parent.dateRange[0]
        this.endTime = this.$parent.dateRange[1]
      } else {
        this.startTime = this.$parent.startTime
        this.endTime = this.$parent.endTime
      }
      let param = {
        memberType: this.membershipRadio,
        dateType: this.dateType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/getMemberTrend'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(data => {
        data = data.data
        if (data) {
          this.dataArray = []
          this.rateArray = []
          this.timeArray = []
          for (let i = 0; i < data.length; i++) {
            data[i].currentDay = this.formatDate(data[i].currentDay)
            this.timeArray.push(data[i].currentDay)
            this.dataArray.push(data[i].memberNum)
            this.rateArray.push(data[i].memberNumRate)
          }
          if (this.boardType === 'numTrends') {
            // 会员人数趋势图表
            this.getNumTrendsDataChart()
          } else {
            // 会员占比趋势图表
            this.getPercentageTrendDataChart()
          }
        }
      })
    },
    // 更新会员概览Echart数据图的数据
    updateOneEchart (data, echartType) {
      this.dataList = data
      this.timeArray = []
      this.dataArray = []
      // 通过判断传入的类型来填充不同数据
      switch (echartType) {
        case 0:
          for (var j = 0, len = this.dataList.length; j < len; j++) {
            this.timeArray.push(this.dataList[j].currentDay)
            this.dataArray.push(this.dataList[j].totalMember)
          }
          break
        case 1:
          for (var j2 = 0, len2 = this.dataList.length; j2 < len2; j2++) {
            this.timeArray.push(this.dataList[j2].currentDay)
            this.dataArray.push(this.dataList[j2].newMember)
          }
          break
        case 2:
          for (var j3 = 0, len3 = this.dataList.length; j3 < len3; j3++) {
            this.timeArray.push(this.dataList[j3].currentDay)
            this.dataArray.push(this.dataList[j3].payMember)
          }
          break
        case 3:
          for (var j4 = 0, len4 = this.dataList.length; j4 < len4; j4++) {
            this.timeArray.push(this.dataList[j4].currentDay)
            this.dataArray.push(this.dataList[j4].couponMember)
          }
          break
        case 4:
          for (var j5 = 0, len5 = this.dataList.length; j5 < len5; j5++) {
            this.timeArray.push(this.dataList[j5].currentDay)
            this.dataArray.push(this.dataList[j5].memberPayAmount)
          }
          break
        case 5:
          for (var j6 = 0, len6 = this.dataList.length; j6 < len6; j6++) {
            this.timeArray.push(this.dataList[j6].currentDay)
            this.dataArray.push(this.dataList[j6].memberPayOrder)
          }
          break
        case 6:
          for (var j7 = 0, len7 = this.dataList.length; j7 < len7; j7++) {
            this.timeArray.push(this.dataList[j7].currentDay)
            this.dataArray.push(this.dataList[j7].memberSingleAmount)
          }
          break

        default:
          for (var j0 = 0, len0 = this.dataList.length; j0 < len0; j0++) {
            this.timeArray.push(this.dataList[j0].currentDay)
            this.dataArray.push(this.dataList[j0].totalMember)
          }
          break
      }
      for (let i = 0; i < this.timeArray.length; i++) {
        this.timeArray[i] = this.formatDate(this.timeArray[i])
      }
      // 会员概览图表
      this.getOverviewDataChart()
    },
    // 会员人数趋势图表
    getNumTrendsDataChart () {
      const myChart = this.$echarts.init(document.getElementById('membership-num-trends-chart'))
      const option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.oneEchartAllName
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
          boundaryGap: false,
          data: this.timeArray
        },
        yAxis: {
          type: 'value'
          // name: '交易金额'
        },
        series: [
          {
            name: this.$t('dataAnalysis.usernum'),
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#02A1E9'
                },
                // 点的颜色
                color: '#02a1e9'
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(2,161,233,0.3)'
              }, {
                offset: 1,
                color: '#ffffff'
              }])
            },
            data: this.dataArray
          }
        ]
      }
      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 格式化时间
     */
    formatDate: function (date) {
      var tempDate = date + ''
      return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
    },
    // 会员占比趋势图表
    getPercentageTrendDataChart () {
      const myChart = this.$echarts.init(document.getElementById('membership-percentage-trend-chart'))
      const option = {
        color: ['red'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [this.$t('dataAnalysis.usernum')]
        },
        grid: {
          left: 20,
          right: 20,
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            showMaxLabel: true
          },
          data: this.timeArray
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        series: [
          {
            name: this.$t('dataAnalysis.usernum'),
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#d8effb',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#00b0ff'
              }
            },
            barWidth: 25,
            data: this.dataArray
          }
        ]
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 导出
    exportCategory () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
      const loading = this.$loading({
        lock: true,
        target: '#membership-num-trends-chart',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/memberTrendExport'),
        method: 'get',
        params: this.$http.adornParams({
          // memberType: this.membershipRadio,
          dateType: this.dateType,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        }),
        responseType: 'blob'
      }).then(({data}) => {
        // console.log(data)
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$t('dataAnalysis.membershipTrends') + '.xlsx'
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('shop.exportSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch((e) => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss">
.member-analysis.membership-overview {
  position: relative;
  .export-btn {
    position: absolute;
    right: 0;
  }
  // radio-button选项
  .membership-options {
    margin-top: 15px;
    margin-bottom: 20px;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #155bd4;
      background-color: transparent;
      border-color: #155bd4;
    }
    .el-radio-button__inner:hover {
      color: #155bd4;
    }
  }

  // 图表
  .chart-content {
    margin-bottom: 20px;
  }

  // 数据分析思路
  .data-analysis-ideas {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f7f8fa;
    padding: 20px;
    .left-icon {
      display: block;
      width: 52px;
      height: 52px;
      margin-right: 20px;
    }
    .txt {
      font-size: 14px;
      color: #333;
      line-height: 1.5em;
      p {
        margin: 0;
      }
      p:first-child {
        font-size: 16px;
        margin-bottom: 8px;
      }
      p:last-child {
        color: #666;
      }
    }
  }
  ::v-deep .export-load {
    top: -50% !important;
  }
}
</style>
