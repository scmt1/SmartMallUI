<template>
  <div class="mod-reve-profile">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item :label="$t('finaManage.statisticalTime')+':'">
          <el-select
            v-model="dateValue"
            @change="setDateRange(dateValue)"
          >
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="time-text" v-if="dateValue === 1 || dateValue === 2">{{ day }}</span>
          <span class="time-text"
                v-if="dateValue === 3 || dateValue === 4 || dateValue === 5 || dateValue === 6">{{
              startTime
            }} {{ $t('date.tip') }} {{ endTime }}</span>
          <span class="time-text" v-if="dateValue === 7">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              @change="changeDateTime"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              value-format="timestamp"
            >></el-date-picker>
          </span>
          <span>
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                {{ $t('finaManage.theDataShows') }}：
                <br/>{{ $t('finaManage.tip1') }}
                <br/>{{ $t('finaManage.tip2') }}
                <br/>{{ $t('finaManage.tip3') }}
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div class="data-explan">
          <p>{{ $t('finaManage.tip4') }}：</p>
          <p class="p">{{ $t('finaManage.tip5') }}</p>
          <p class="p">{{ $t('finaManage.tip6') }}</p>
        </div>
      </div>
      <div class="profile-item">
        <div class="item-title">
          <div class="line"></div>
          <div class="text">{{ $t('finaManage.incProfile') }}</div>
        </div>
        <div class="item-content income">
          <div v-for="index in 3" :key="index" class="imcome-item">
            <div class="title-text">{{ overviewData.title[index - 1] }}
              <span><el-tooltip placement="top" effect="light">
                <div slot="content">
                  {{ $t('finaManage.theDataShows') }}：
                  <br/>{{ $t('finaManage.tip'+index) }}
                </div>
               <i class="el-icon-question"></i>
              </el-tooltip></span>
            </div>

            <div class="money-amount">{{ overviewData.amount[index - 1] }}{{ $t('dataAnalysis.yuan') }}</div>
            <div class="compare">
              <span v-if="!overviewData.ratio[index-1]">{{ $t('order.notYet') }}</span>
              <span else>
              <span style="color: #777">{{ $t('finaManage.chainRatio') }}</span>
              <span :style="{color: overviewData.ratio[index-1] > 0 ? '#3CC480' : '#FF4141'}">
                {{ overviewData.ratio[index - 1] + '%' }}
                <i :class="[overviewData.ratio[index-1] > 0 ? 'el-icon-top': 'el-icon-bottom']"
                   style="font-weight: 900"/>
              </span>
             </span>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-item">
        <div class="item-title">
          <div class="line"></div>
          <div class="text">{{ $t('finaManage.reveTrend') }}</div>
        </div>
        <div class="item-content trend">
          <div class="charts-title">
            <div class="charts-title-item" v-for="(item,index) in sumData" :key="item">
              <div :style="{background: lineStyle[index].normal.lineStyle.color}" class="line"></div>
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="trend-echart">
            <div id="trend-echart" style="width:100%;height:400px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      dateValue: 1, //  时间栏默认选中
      dateRange: [], // 展示的时间参数
      timeRange: '',
      startTime: '',
      endTime: '',
      day: '',  //  今天，昨天选中展示

      dateOptions: [
        {
          label: this.$i18n.t('user.today'),
          value: 1
        },
        {
          label: this.$i18n.t('user.yesterday'),
          value: 2
        },
        {
          label: this.$i18n.t('user.lastSevenDay'),
          value: 3
        },
        {
          label: this.$i18n.t('user.lastThirtyDay'),
          value: 4
        },
        {
          label: this.$i18n.t('user.thisMonth'),
          value: 5
        },
        {
          label: this.$i18n.t('user.lastMonth'),
          value: 6
        },
        {
          label: this.$i18n.t('user.customRange'),
          value: 7
        }
      ],

      storeValue: -1, //  门店下拉的选项
      dropDowmOptions: [
        {
          label: this.$i18n.t('date.a'),
          value: -1
        }
      ],
      trendDataList: {
        currentDate: [],
        incomeAmount: [],
        payoutAmount: [],
        actualIncome: []
      },
      overviewData: {
        title: [this.$i18n.t('finaManage.actIncome'), this.$i18n.t('finaManage.incAmount'), this.$i18n.t('finaManage.amountPayout')],
        amount: [],
        ratio: []
      },
      sumData: [
        this.$i18n.t('finaManage.actIncome'),
        this.$i18n.t('finaManage.incAmount'),
        this.$i18n.t('finaManage.amountPayout')
      ],
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
      ]
    }
  },
  mounted () {
    // this.getShopList()
    this.setDateRange(3)
  },
  watch: {
    storeValue (val) {
      this.updateDateTime()
      this.getRevenueData()
    }
  },
  methods: {
    getRevenueData () {
      // 获取营收概况页面数据
      this.$http({
        url: this.$http.adornUrl(`/platform/financialManagement/getIncomeProfile`),
        method: 'get',
        params: this.$http.adornParams({
          typeType: this.dateValue,
          start: this.dateRange ? this.dateRange[0] : null,
          end: this.dateRange ? this.dateRange[1] : null,
          stationId: this.storeValue
        })
      }).then(({data}) => {
        if (data) {
          this.tableData = data
          this.$set(this.overviewData, 'amount', [data.actualIncome, data.incomeAmount, data.payoutAmount])
          this.$set(this.overviewData, 'ratio', [data.actualIncomeRatio, data.incomeAmountRatio, data.payoutAmountRatio])
          const trendDataList = data.trendDataList
          trendDataList.forEach(item => {
            this.trendDataList.currentDate.push(item.currentDate)
            this.trendDataList.incomeAmount.push(item.incomeAmount)
            this.trendDataList.payoutAmount.push(item.payoutAmount)
            this.trendDataList.actualIncome.push(item.actualIncome)
          })
          if (trendDataList.length === 0) {
          }
          this.getTrendEchart()
        }
      })
    },
    updateDateTime () {
      this.trendDataList = {
        currentDate: [],
        incomeAmount: [],
        payoutAmount: [],
        actualIncome: []
      }
    },
    // 1-7:今日、昨日、最近7天、最近30天、这个月、上个月以及自定义时间,都是2020-8-20模式
    setDateRange (val) {
      this.dateValue = val
      var date = new Date()
      if (val === 1) {
        // 今天
        this.day = moment(date).format('L')
        this.startTime = this.day
        this.endTime = this.day
      } else if (val === 2) {
        // 昨天
        this.day = moment(date).add(-1, 'days').format('L')
        this.startTime = this.day
        this.endTime = this.day
      } else if (val === 3) {
        // 近7天
        this.endTime = moment(date).add(-1, 'days').format('L')
        this.startTime = moment(date).add(-7, 'days').format('L')
      } else if (val === 4) {
        // 近30天
        this.endTime = moment(date).add(-1, 'days').format('L')
        this.startTime = moment(date).add(-30, 'days').format('L')
      } else if (val === 5) {
        // 这个月
        this.endTime = moment(date).format('L')
        this.startTime = moment(date).startOf('month').format('L')
      } else if (val === 6) {
        // 上个月
        let month = moment(date).add(-1, 'month').startOf('month')
        this.endTime = moment(month).endOf('month').format('L')
        this.startTime = month.format('L')
      } else if (val === 7) {
        return
      } else {
        return
      }
      var startTimeStamp = moment(this.startTime).unix() * 1000
      var endTimeStamp = moment(this.endTime).unix() * 1000
      this.dateRange = [startTimeStamp, endTimeStamp]
      this.updateDateTime()
      this.getRevenueData()
    },
    // 自定义时间栏，改变时调用
    changeDateTime (timeRange) {
      var startTimeStamp = timeRange[0]
      var endTimeStamp = timeRange[1]
      this.dateRange = [startTimeStamp, endTimeStamp]
      this.updateDateTime()
      this.getRevenueData()
    },
    // 趋势图
    getTrendEchart () {
      var dom = document.getElementById('trend-echart')
      var w3 = window.getComputedStyle(dom).width
      document.getElementById('trend-echart').style.width = w3
      const myChart = this.$echarts.init(document.getElementById('trend-echart'), 'walden')
      const option = {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: [this.$i18n.t('finaManage.actIncome'), this.$i18n.t('finaManage.incAmount'), this.$i18n.t('finaManage.amountPayout')]
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
          boundaryGap: false,
          data: this.trendDataList.currentDate
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
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: this.$i18n.t('finaManage.actIncome'),
            type: 'line',
            smooth: true,
            data: this.trendDataList.actualIncome,
            itemStyle: this.lineStyle[0],
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(41, 203, 151, 0.41)'},
                    {offset: 1, color: 'rgba(255, 255, 255, 0)'}
                  ]
                )
              }
            }
          },
          {
            name: this.$i18n.t('finaManage.incAmount'),
            type: 'line',
            data: this.trendDataList.incomeAmount,
            smooth: true,
            itemStyle: this.lineStyle[1],
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(24,144,255,0.6)'},
                    {offset: 1, color: 'rgba(255, 255, 255, 0)'}
                  ]
                )
              }
            }
          },
          {
            name: this.$i18n.t('finaManage.amountPayout'),
            type: 'line',
            data: this.trendDataList.payoutAmount,
            smooth: true,
            itemStyle: this.lineStyle[2],
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#F56C6C'},
                    {offset: 1, color: 'rgba(255, 255, 255, 0)'}
                  ]
                )
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getShopList () {
      // 获取营收概况页面数据
      this.$http({
        url: this.$http.adornUrl(`/platform/financialManagement/getStation`),
        method: 'get',
        params: this.$http.adornParams({
          shopId: 1
        })
      }).then(({data}) => {
        if (data) {
          for (let i = 0; i < data.length; i++) {
            this.dropDowmOptions.push({
              label: data[i].stationName,
              value: data[i].stationId
            })
          }
          this.dropDowmOptions.push({
            label: this.$i18n.t('prodList.other'),
            value: -2
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-reve-profile {
  .time-text {
    padding: 0 10px;
    color: #999;
  }

  .data-explan {
    padding: 20px;
    background: #edf4ff;
    border: 1px solid #155bd4;

    p {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .profile-item {
    margin-top: 30px;

    .item-title {
      width: 100%;
      background: #F7F8FA;
      box-sizing: border-box;
      padding: 19px 20px;
      display: flex;
      margin: 20px 0 10px 0;

      .line {
        width: 4px;
        height: 19px;
        background: #155bd4;
        opacity: 1;
        border-radius: 2px;
        margin-right: 10px;
      }

      .text {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        opacity: 1;
      }
    }

    .item-content.income {
      display: flex;
      width: 100%;
      justify-content: center;
      padding: 25px;

      .imcome-item {
        flex: 1;
        text-align: center;

        .title-text {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .money-amount {
          font-size: 20px;
          font-weight: 900;
          margin-bottom: 15px;
        }

        .compare {
          font-size: 12px;
        }
      }
    }

    .item-content.trend {
      .charts-title {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;
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
    }
  }
}
</style>
