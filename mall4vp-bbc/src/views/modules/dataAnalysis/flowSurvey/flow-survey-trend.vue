<template>
  <div class="trend">
    <div class="flow-title">
      <div class="flow-title-left">
        <div class="line" />
        <div class="text">
          {{$t('dataAnalysis.flowTrend')}}
        </div>
      </div>
      <div class="flow-title-right">
        <div
          v-if="isAuth('flow:trend:export')"
          class="default-btn primary-btn export-btn"
          @click="exportCategory()"
        >{{$t("order.export")}}</div>
      </div>
    </div>
    <!-- 单项选择 -->
    <div class="radio-box flow-form">
      <el-form>
        <el-form-item :label="$t('dataAnalysis.pageBrowsing') + ':'">
          <el-radio-group v-model="typeValue">
            <el-radio class="radio-item" :label="1">{{$t('dataAnalysis.numberOfVisitors')}}</el-radio>
            <el-radio v-if="timeType != 4" class="radio-item" :label="2">{{$t('dataAnalysis.newVisitor')}}</el-radio>
            <el-radio class="radio-item" :label="3">{{$t('dataAnalysis.pageviews')}}</el-radio>
            <el-radio v-if="timeType != 4" class="radio-item" :label="4">{{$t('dataAnalysis.stayTime')}}</el-radio>
            <el-radio class="radio-item" :label="5">{{$t('dataAnalysis.perVisits')}}</el-radio>
            <el-radio v-if="timeType != 4" class="radio-item" :label="6">{{$t('dataAnalysis.lossRate')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('dataAnalysis.transactionConversion')">
          <el-radio-group v-model="typeValue">
            <el-radio class="radio-item" :label="7">{{$t('dataAnalysis.paidNumbers')}}</el-radio>
            <el-radio class="radio-item" :label="8">{{$t('dataAnalysis.vToP')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 单项选择 -->

    <div class="content-container">
      <!-- 选择显示不同端的数据 -->
      <div class="plat">
        <el-radio-group v-model="systemType" size="small" @change="systemTypeChange">
          <el-radio-button :label="0" v-model="radioCheck">{{$t('date.a')}}</el-radio-button>
          <el-radio-button :label="1" v-model="radioCheck">PC</el-radio-button>
          <el-radio-button :label="2" v-model="radioCheck">H5</el-radio-button>
          <el-radio-button :label="3" v-model="radioCheck">{{$t('sysManagement.miniProgramSmall')}}</el-radio-button>
          <el-radio-button :label="4" v-model="radioCheck">{{$t('dataAnalysis.android')}}</el-radio-button>
          <el-radio-button :label="5" v-model="radioCheck">IOS</el-radio-button>
        </el-radio-group>
        <div class="t-explain-item">
          {{ ['',$t('dataAnalysis.numberOfVisitors')
          ,$t('dataAnalysis.newVisitor'),$t('dataAnalysis.pageviews'),$t('dataAnalysis.stayTime'),$t('dataAnalysis.perVisits')
          ,$t('dataAnalysis.lossRate'),$t('dataAnalysis.paidNumbers'),$t('dataAnalysis.vToP')][typeValue] }}</div>
      </div>
      <!-- /选择显示不同端的数据 -->

      <!-- 图表 -->
      <div class="chart">
        <div id="i-chart" style="width:100%;height:300px;"></div>
      </div>
    </div>
    <!-- /图表 -->
  </div>
</template>

<script>
import { Debounce } from '@/utils/debounce'
import Big from 'big.js'
export default {
  data () {
    return {
      typeValue: 1, // 默认单项选择为第一项
      platValue: 0, // 选择不同端的数据
      flowTrendData: [], // 流量趋势数据
      dataArray: [], // Echart显示具体数据
      timeArray: [], // Echart X轴下方显示的具体时间
      // formatter: '{b}<br />{a}: {c0}', // Echart每个点显示的格式
      eChartTitleArray: [], // Echart图列表
      currEchartTitle: '',  // 当前Echart的名字
      timeType: this.$parent.timeType,
      startTime: this.$parent.startTime,
      endTime: this.$parent.endTime,
      systemType: 0,
      radioCheck: 0
    }
  },
  watch: {
    startTime (val) {
      this.getFlowTrendData()
    },
    endTime (val) {
      this.getFlowTrendData()
    },
    platValue (val) {

    },
    typeValue (flowType) {
      this.switchEchart(flowType)
    },
    systemType (val) {
      this.systemType = val
      this.getFlowTrendData()
    }
  },
  mounted () {
    this.getFlowTrendData()
  },
  methods: {
    // 切换趋势图实时改变
    switchEchart (flowType) {
      this.dataArray = []
      this.currEchartTitle = this.eChartTitleArray[flowType - 1]
      switch (flowType) {
        case 1:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].userNums)
          }
          break
        case 2:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].newUser)
          }
          break
        case 3:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].visitNums)
          }
          break
        case 4:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].averageStopTime)
          }
          break
        case 5:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].averageVisitNums)
          }
          break
        case 6:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].lossUserRate)
          }
          break
        case 7:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].payUser)
          }
          break
        case 8:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(new Big(this.flowTrendData[i].payRate).times(100).toFixed(2))
          }
          break
        default:
          for (let i = 0; i < this.flowTrendData.length; i++) {
            this.dataArray.push(this.flowTrendData[i].userNums)
          }
          break
      }
      this.getOneEchart()
    },
    // 获取趋势图相关数据
    getFlowTrendData () {
      // 遍历Echart标题名
      var ele = document.getElementsByClassName('radio-item')
      for (var j = 0, len = ele.length; j < len; j++) {
        this.eChartTitleArray.push(ele[j].innerText)
      }
      // 默认第一个(访客数)
      this.currEchartTitle = this.eChartTitleArray[0]
      // 请求接口
      // console.log('第二部分发送请求')
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/flowTrend'),
        method: 'get',
        params: this.$http.adornParams({
          timeType: this.timeType,
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime,
          systemType: this.systemType
        })
      }).then(({ data }) => {
        if (data) {
          this.flowTrendData = []
          this.timeArray = []
          this.dataArray = []
          for (let i = 0; i < data.length; i++) {
            this.flowTrendData.push(data[i])
            this.timeArray.push(data[i].dateTime)
          }
          this.switchEchart(this.typeValue)
        }
      })
    },
    systemTypeChange () {
      this.$parent.systemType = this.systemType
      this.getFlowTrendData()
      this.switchEchart(this.typeValue)
    },
    // 获取第一部分Echart数据图
    getOneEchart () {
      const myChart = this.$echarts.init(document.getElementById('i-chart'))
      const option = {
        color: ['#155bd4'],
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
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
            name: this.currEchartTitle,
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#155bd4'
                },
                // 点的颜色
                color: '#155bd4'
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(21, 91, 212, 0.5)'
              }, {
                offset: 1,
                color: '#ffffff'
              }])
            },
            data: this.dataArray
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 导出
    exportCategory: Debounce(function () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
        const loading = this.$loading({
          lock: true,
          target: '.trend',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/flowTrendExport'),
        method: 'get',
        params: this.$http.adornParams({
          timeType: this.timeType,
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime,
        }),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$t('dataAnalysis.flowTrend') + '.xlsx'
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
    }),
  }
}
</script>

<style lang="scss">
.trend {
  .flow-title {
    margin-top: 50px;
  }
  .content-container {
    padding: 20px;
    border: 1px solid #eee;
    // 选择显示不同端的数据
    .plat {
      margin-bottom: 20px;
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        border-color: #155bd4;
        background: #f5f9ff;
        color: #155bd4;
      }
      .el-radio-button__inner:hover {
        color: #155bd4;
      }
      .cur-item {
        display: inline-block;
        margin-left: 100px;
        font-size: 12px;
        line-height: 1em;
        color: #999;
        padding-left: 50px;
      }
      .cur-item::before {
        display: inline-block;
        content: "";
        width: 18px;
        height: 8px;
        // background: #155bd4;
        background: #155bd4;
        border-radius: 8px;
        margin-right: 10px;
      }
    }
    .chart {
      padding: 10px;
    }
  }

}
</style>
<style scoped>
  .t-explain-item {
    display: inline-block;
    margin-left: 100px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
  }
  .t-explain-item::before {
    display: inline-block;
    content: '';
    width: 18px;
    height: 8px;
    background: #155bd4;
    border-radius: 8px;
    margin-right: 10px;
  }
  div >>> .el-radio {
      width: auto;
    }
  div >>> .el-radio__input.is-checked .el-radio__inner {
      border-color: #155bd4;
      background: #155bd4;
    }
  div >>> .el-radio__input.is-checked + .el-radio__label {
      color: #155bd4;
    }
  >>> .export-load {
    top: -50% !important;
  }
</style>
