<template>
  <div class="member-stats">
    <div class="page-cover" v-if="isCover==true"></div>
    <cust-analysis-title :title="title" :tips="tips"></cust-analysis-title>
    <cust-analysis-overview :hover="hover" :overviewData="overviewData1" @index="recIndex"></cust-analysis-overview>
    <div class="fans-chart">
      <div class="fans-chart__title">
        <h4>{{$t('dataAnalysis.fansAct')}}</h4>
        <div class="fans-chart__title-trigger">
          <!--          <i class="el-icon-data-analysis icon" :class="{'item-active':formActive==1}"></i>-->
          <!--          <span class="chart-trigger__item chart-trigger__item1" :class="{'item-active':formActive==1}"-->
          <!--                @click="selForm(1)">分布</span>-->
          <!--          <i class="el-icon-data-line icon" :class="{'item-active':formActive==2}"> </i>-->
          <!--          <span class="chart-trigger__item chart-trigger__item2" :class="{'item-active':formActive==2}"-->
          <!--                @click="selForm(2)">趋势</span>-->
        </div>
      </div>
      <cust-analysis-overview :overviewData="overviewData2"></cust-analysis-overview>

      <!-- 图表 -->
      <div class="member-distribution-chart" v-show="formActive==1">
        <div class="chart-left">
          <div id="depth-echart-left" style="width:60%;height:300px;"></div>
        </div>
        <div class="chart-right">
          <div id="depth-echart-right" style="width:100%;height:300px;"></div>
        </div>
      </div>

      <div class="member-trend-chart" v-show="formActive==2">
        <div class="charts-title">
          <div class="charts-title-item" v-for="(item,index) in sumData" :key="item">
            <div :style="{background: lineStyle[index].normal.lineStyle.color}" class="line"></div>
            <span>{{ item }}</span>
            </div>
        </div>
        <div id="member-trend-chart" style="width:100%;height:350px"></div>
      </div>
      <!-- /图表 -->
    </div>

    <!-- 单独类型的表 -->
    <div v-show="index!=0" class="sin-chart" id="sin-chart">
      <div class="header">
        <div>{{[`${$t('dataAnalysis.totalMembership')}`,`${$t('dataAnalysis.numberOfNewMembers')}`,`${$t('dataAnalysis.upgradedMember')}`,`${$t('dataAnalysis.storedValueMember')}`][index-1]}}</div>
        <div class="close-window" @click="closeWin">X</div>
      </div>
      <div class="sin-trend-chart">
        <div id="sin-trend-chart" style="width:100%;height:300px"></div>
      </div>
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
      title: '',
      tips: '',
      hover: '',
      // 总览信息
      overviewData1: {
        title: [],
        num: [],
        type: 1,
        rate: []
      },
      // 总览信息
      overviewData2: {
        title: [],
        num: [],
        type: 1,
        rate: []
      },
      formActive: 2,
      dateValue: 1,
      dateRange: [],
      sinTrendDateArr: [],
      trendDateArr: [],
      accMemberSeriesDataArr: [],
      newAddMemberSeriesDataArr: [],
      growMenberSeriesDataArr: [],
      storedMemberSeriesDataArr: [],
      seriesTrendDataArr: [],
      singSeriesArr: [],
      index: 0,
      isCover: false,
      sumData: [],
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
        },
        {
          normal: {
            color: '#9CA3E1',
            lineStyle: {
              color: '#9CA3E1'
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
        },
        {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#9CA3E1'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        }
      ]
    }
  },
  mounted () {
    this.initOverview()
    // this.getSinTypeChart()
    // this.getCouponChart()
    // this.getDepthEchartLeft()
    // this.getDepthEchartRight()
  },
  watch: {
    timeData: {
      handler (newValue, oldValue) {
        this.dateValue = this.timeData.dateValue
        this.dateRange = this.timeData.dateRange
        this.getMemberInf()
      },
      deep: true
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initOverview: function () {
      this.title = this.$i18n.t('dataAnalysis.membershipStatistics')
      this.tips = this.$i18n.t('dataAnalysis.statisticsTips')
      this.hover = true
      this.overviewData1 = {
        title: [this.$i18n.t('dataAnalysis.totalMembership'), this.$i18n.t('dataAnalysis.numberOfNewMembers'), this.$i18n.t('dataAnalysis.upgradedMember'), this.$i18n.t('dataAnalysis.storedValueMember')],
        num: ['0', '0', '0', '0'],
        type: 1,
        rate: [0, 0, 0, 0]
      }
      this.overviewData2 = {
        title: [this.$i18n.t('dataAnalysis.visitMembers'), this.$i18n.t('dataAnalysis.numberOfCouponMembers'), this.$i18n.t('dataAnalysis.addCartMembers'), this.$i18n.t('dataAnalysis.numberOfTradedMembers')],
        num: ['0', '0', '0', '0'],
        type: 0,
        rate: [0, 0, 0, 0]
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
     * 获取会员信息
     */
    getMemberInf () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getMemberCount'),
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
          this.overviewData1.type = this.dateValue
          this.overviewData1.num = [data.memberCount.accumulate, data.memberCount.newAddMember, data.memberCount.growthMember, data.memberCount.storedValue]
          this.overviewData1.rate = [data.memberCount.accumulateRate, data.memberCount.newAddMemberRate, data.memberCount.growthMemberRate, data.memberCount.storedValueRate]
          this.overviewData2.num = [data.memberLively.memberV, data.memberLively.memberGetCoupon, data.memberLively.memberAddCat, data.memberLively.memberPay]
          this.overviewData2.rate = [data.memberLively.memberVRate, data.memberLively.memberGetCouponRate, data.memberLively.memberAddCatRate, data.memberLively.memberPayRate]
          // 会员趋势图表
          this.trendDateArr = []
          this.seriesTrendDataArr = []
          let obj1 = this.initObj(this.$i18n.t('dataAnalysis.visitMembers'))
          let obj2 = this.initObj(this.$i18n.t('dataAnalysis.numberOfCouponMembers'))
          let obj3 = this.initObj(this.$i18n.t('dataAnalysis.addCartMembers'))
          let obj4 = this.initObj(this.$i18n.t('dataAnalysis.numberOfTradedMembers'))
          data.memberLively.memberLivelyTrend.forEach(i => {
            this.trendDateArr.push(this.formatDate(i.currentDay))
            obj1.data.push(i.memberV)
            obj2.data.push(i.memberGetCoupon)
            obj3.data.push(i.memberAddCat)
            obj4.data.push(i.memberPay)
          })
          this.seriesTrendDataArr.push(obj1)
          this.seriesTrendDataArr.push(obj2)
          this.seriesTrendDataArr.push(obj3)
          this.seriesTrendDataArr.push(obj4)
          let i = 0
          this.seriesTrendDataArr.forEach(item => {
            item.itemStyle = this.lineStyle[i]
            item.areaStyle = this.areaStyle[i]
            i++
          })
          // 单个类型表
          this.sinTrendDateArr = []
          this.accMemberSeriesDataArr = []
          this.newAddMemberSeriesDataArr = []
          this.growMenberSeriesDataArr = []
          this.storedMemberSeriesDataArr = []
          let accObj = this.initObj(this.$i18n.t('dataAnalysis.totalMembership'))
          let newAddObj = this.initObj(this.$i18n.t('dataAnalysis.numberOfNewMembers'))
          let growObj = this.initObj(this.$i18n.t('dataAnalysis.upgradedMember'))
          let storedObj = this.initObj(this.$i18n.t('dataAnalysis.storedValueMember'))
          data.memberCount.list.forEach(i => {
            this.sinTrendDateArr.push(i.currentDay)
            accObj.data.push(i.accumulate)
            newAddObj.data.push(i.newAddMember)
            growObj.data.push(i.growthMember)
            storedObj.data.push(i.storedValue)
          })
          this.accMemberSeriesDataArr.push(accObj)
          this.newAddMemberSeriesDataArr.push(newAddObj)
          this.growMenberSeriesDataArr.push(growObj)
          this.storedMemberSeriesDataArr.push(storedObj)
          this.showSingChart()
          this.getMemberTrendChart()
        }
      })
    },
    /**
     * 接收索引，并展示相应的表
     */
    recIndex (data) {
      this.isCover = true
      this.index = data
      this.showSingChart()
    },
    /**
     * 关闭单独类型值表的窗口
     */
    closeWin () {
      this.isCover = false
      this.index = 0
    },
    /**
     * 选择不同类型图表展示
     */
    selForm (formActive) {
      this.formActive = formActive
    },
    /**
     * 生成会员趋势表
     */
    getMemberTrendChart () {
      this.sumData = []
      this.seriesTrendDataArr.forEach(item => {
        this.sumData.push(item.name)
      })
      const myChart = this.$echarts.init(document.getElementById('member-trend-chart'), 'walden')
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
          data: this.trendDateArr,
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
        series: this.seriesTrendDataArr
      }
      myChart.setOption(option, true)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 获取访问深度左边的数据图
    getDepthEchartLeft () {
      const myChart = this.$echarts.init(document.getElementById('depth-echart-left'), 'walden')
      const option = {
        title: {
          text: '',
          bottom: 'center',
          textStyle: {
            color: '#666',
            fontWeight: '500',
            fontSize: 12
          },
          extraCssText: 'box-shadow:0px 1px 11px rgba(213, 220, 226, 0.73);'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{a}: {c} <br/>占比{d}%'    // a:series.data.name\b:series.name\c:series.data.value\d:自动计算百分比
        },
        legend: {
          orient: 'vertical',
          bottom: 10,
          left: 'center',
          data: [this.$i18n.t('dataAnalysis.visitMembers')]
        },
        series: [
          {
            name: this.$i18n.t('dataAnalysis.numberOfVisitors'),
            type: 'pie',
            radius: ['70%', '30%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 310, name: this.$i18n.t('dataAnalysis.visitMembers') },
              { value: 310, name: this.$i18n.t('dataAnalysis.noVisitMembers') }
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 获取访问深度右边的数据图
    getDepthEchartRight () {
      const myChart = this.$echarts.init(document.getElementById('depth-echart-right'), 'walden')
      const option = {
        color: ['#61a0a8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
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
        xAxis: {
          type: 'category',
          data: [this.$i18n.t('dataAnalysis.numberOfCouponMembers'), this.$i18n.t('dataAnalysis.addCartMembers'), this.$i18n.t('dataAnalysis.numberOfTradedMembers')],
          // xAxis的属性，设置x轴文本不隐藏，同理yAxis也有
          axisLabel: {
            interval: 0,      // 坐标轴刻度标签的显示间隔
            rotate: 40        // 标签倾斜的角度
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: this.$i18n.t('dataAnalysis.numberOfVisitors'),
          data: [0.7, 0.2, 0.8, 0.3, 0.4, 1, 0.5, 0.5],
          type: 'bar',
          barWidth: '80%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'       // 剩余部分背景图
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 选择显示的表
     */
    showSingChart () {
      if (this.index === 1) {
        this.singSeriesArr = this.accMemberSeriesDataArr
      } else if (this.index === 2) {
        this.singSeriesArr = this.newAddMemberSeriesDataArr
      } else if (this.index === 3) {
        this.singSeriesArr = this.growMenberSeriesDataArr
      } else if (this.index === 4) {
        this.singSeriesArr = this.storedMemberSeriesDataArr
      }
      this.getSinTypeChart()
    },
    /**
     * 获取单个类型值的表
     */
    getSinTypeChart () {
      document.getElementById('sin-trend-chart').style.width = '800px'
      const myChart = this.$echarts.init(document.getElementById('sin-trend-chart'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.sinTrendDateArr,
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
        series: this.singSeriesArr
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 格式化时间
     */
    formatDate (date) {
      // var tempDate = date + ''
      // return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
      return date
    }
  }
}
</script>

<style lang="scss">
.member-stats {
  .page-cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.5;
    overflow-y: hidden;
    z-index: 1983;
  }

  /* 会员分布图表 */
  .member-distribution-chart {
    display: flex;
  }

  .member-distribution-chart .chart-left,
  .member-distribution-chart .chart-right {
    width: 50%;
    padding: 8px;
  }

  .member-distribution-chart .chart-left {
    display: flex;
    justify-content: center;
    width: 30%;
  }

  .member-distribution-chart .chart-right {
    width: 70%;
  }

  .member-trend-chart {
    margin-top: 20px;
  }

  /* /会员分布图表 */

  /* 粉丝活跃 */
  .fans-chart__title {
    margin-top: 20px;
    margin-bottom: 15px;
    position: relative;
  }

  .fans-chart__title h4 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 16px;
    color: #333333;
    opacity: 1;
  }

  .fans-chart__title-trigger {
    position: absolute;
    right: 0;
    top: 10px;
  }

  .fans-chart__title-trigger .icon {
    font-size: 16px;
  }

  .chart-trigger__item {
    display: inline-block;
    // padding-left: 24px;
    color: #b7b7b7;
    position: relative;
    // margin-left: 18px;
  }

  // .chart-trigger__item1:before {
  //   background-image: url(https://b.yzcdn.cn/fix-base64/bd65fc5bf2416c809d601baa6885f777d888f339c02e0c93d8fa17a8a719fde2.png);
  // }
  .fans-chart__title-trigger .item-active {
    color: #38f;
  }

  .chart-trigger__item1 {
    margin-right: 10px;
  }

  .chart-trigger__item:before {
    content: "";
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
  }

  // .chart-trigger__item2:before {
  //   background-image: url(https://b.yzcdn.cn/fix-base64/c80c95a8e604fde31d4ab34ad8d50bd4c045ab1ee20417b8f49ca4ca7a3978fb.png);
  // }
  /* /粉丝活跃 */

  /* 单独的表 */
  .sin-chart {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 800px;
    height: 400px;
    padding: 16px 0;
    background: #fff;
    border-radius: 5px;
    margin: auto;
    z-index: 1984;
  }

  .sin-chart .header {
    display: flex;
    font-size: 15px;
    padding: 0 16px 14px;
    border-bottom: 1px solid #dcdee0;
  }

  .sin-chart .header .close-window {
    margin-left: auto;
  }

  .sin-chart .sin-trend-chart {
    width: 100%;
    padding: 10px;
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

