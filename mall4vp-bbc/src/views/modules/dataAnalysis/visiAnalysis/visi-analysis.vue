<template>
  <div class="mod-home">
    <!-- 访客分析主页面 -->

    <!-- 头部时间选框 -->
    <div class="header">
      <el-form :inline="true" class="form-inline">
        <el-form-item :label="$t('dataAnalysis.statisticalTime') + ':'" style="margin-bottom: 0;">
          <div class="title-right">
            <el-select
              v-model="dateValue"
              @change="setDateRange(dateValue)"
              style="width: auto;"
              size="mini"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="title-time" v-if="dateValue === 1 || dateValue === 2"
              >{{ startTime }} {{$t('date.tip')}} {{ endTime }}</span
            >
            <span class="title-time title-time-span" v-if="dateValue === 3">
              <el-date-picker
                class="title-time-Range"
                v-model="timeRange"
                type="daterange"
                size="mini"
                align="right"
                unlink-panels
                range-separator="-"
                @change="updateDateTime"
                :start-placeholder="$t('date.start')"
                :end-placeholder="$t('date.end')"
                :picker-options="pickerOptions"
                value-format="timestamp"
                >></el-date-picker
              >
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 访问深度 -->
    <div class="depth">
      <div class="title">
        <!-- {{ $t("dataAnalysis.depthOfVisit") }} -->
        <!-- <el-tooltip
          class="item"
          popper-class="atooltip"
          effect="light"
          :content="$t('dataAnalysis.visiContent')"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip> -->
       <div class="has-tooltip">
          <span>{{ $t("dataAnalysis.depthOfVisit") }}</span>
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="$t('dataAnalysis.visiContent')"
          >
            <el-button slot="reference" class="tit-mod-btn"><div class="que-mark">?</div></el-button>
          </el-popover>
        </div>

      </div>
      <div class="chart">
        <div class="chart-left">
          <div id="depth-echart-left" style="width: 100%; height: 400px"></div>
        </div>
        <div class="chart-right">
          <div id="depth-echart-right" style="width: 100%; height: 400px"></div>
        </div>
      </div>
    </div>

    <!-- 访问地域分布 -->
    <div class="region depth">
      <div class="title">
        <!-- {{ $t("dataAnalysis.visitsGeo") }}
        <el-tooltip
          class="item"
          effect="light"
          :content="$t('dataAnalysis.geoContent')"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip> -->
        <div class="has-tooltip">
          <span>{{ $t("dataAnalysis.visitsGeo") }}</span>
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="$t('dataAnalysis.userRegion')"
          >
            <el-button slot="reference" class="tit-mod-btn"><div class="que-mark">?</div></el-button>
          </el-popover>
        </div>
        <div class="export-btn">
          <div
            v-if="isAuth('user:analysis:data:export')"
            class="default-btn primary-btn"
            @click="exportCategory()"
          >{{$t("order.export")}}</div>
        </div>
      </div>
      <div class="chart">
        <div class="chart-left">
          <div id="region-echart-left" style="width: 100%; height: 400px"></div>
        </div>
        <div class="chart-right">
          <div id="region-echart-right" style="width: 100%; height: 410px;"></div>
        </div>
      </div>
      <div class="table">
        <div>
          <template>
            <!-- 设置表头与表格样式 :row-class-name="tableRowClassName" :header-cell-style="getRowClass"-->
            <el-table
              :data="tableData2"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              :header-cell-style="getRowClass"
            >
              <el-table-column
                prop="amount1"
                :label="$t('brand.serialNumber')"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="amount2"
                :label="$t('dataAnalysis.area')"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="amount3"
                sortable
                :label="$t('dataAnalysis.pageviews')"
              ></el-table-column>
              <el-table-column
                prop="amount4"
                :label="$t('dataAnalysis.numberOfVisitors')"
              ></el-table-column>
              <el-table-column
                prop="amount5"
                :label="$t('dataAnalysis.productViews')"
              ></el-table-column>
              <el-table-column
                prop="amount6"
                :label="$t('dataAnalysis.geoContent')"
              ></el-table-column>
            </el-table>
          </template>
        </div>
        <!-- 表格底部分页页码 -->
        <!-- <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableNums"
          ></el-pagination>
        </div> -->
      </div>
    </div>

    <!-- 系统设备 -->
    <div class="equipment depth">
      <div class="title">
        <!-- {{ $t("dataAnalysis.sysEqui") }}
        <el-tooltip
          class="item"
          effect="light"
          style="white-space: pre-wrap"
          placement="top"
        >
          <div slot="content" style="line-height: 20px">
            {{ $t("dataAnalysis.iosTips") }}
            <br />{{ $t("dataAnalysis.androidTips") }}
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip> -->
        <div class="has-tooltip">
          <span>{{ $t("dataAnalysis.sysEqui") }}</span>
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :content="equipment"
          >
            <el-button slot="reference" class="tit-mod-btn"><div class="que-mark">?</div></el-button>
          </el-popover>
        </div>
      </div>
      <div class="chart equi">
        <div class="chart-left">
          <!-- <div
            id="equi-echart-left"
            style="width: 100%; height: 400px; margin: auto"
          ></div> -->
          <div class="chart-item">
            <div
              id="android"
              style="width: 100%; height: 305px; margin: auto; display:inline-block"  
            >
            </div>
            <div class="chart-text">
              <p>{{$t("home.Percentage")}}:{{((valueArray[0] / sumArray)*100).toFixed(2) + '%'}}</p>
              <p>{{$t("dataAnalysis.peopleNum")}}:{{valueArray[0]}}</p>
            </div>
          </div>

          <div class="chart-item">
            <div
              id="wxChat"
              style="width: 100%; height: 305px; margin: auto; display:inline-block"
            ></div>
            <div class="chart-text">
              <p>{{$t("home.Percentage")}}:{{((valueArray[1] / sumArray)*100).toFixed(2) + '%'}}</p>
              <p>{{$t("dataAnalysis.peopleNum")}}:{{valueArray[1]}}</p>
            </div>
          </div>

          <div class="chart-item">
              <div
                id="h5"
                style="width: 100%; height: 305px; margin: auto; display:inline-block"
              ></div>
            <div class="chart-text">
              <p>{{$t("home.Percentage")}}:{{((valueArray[2] / sumArray)*100).toFixed(2) + '%'}}</p>
              <p>{{$t("dataAnalysis.peopleNum")}}:{{valueArray[2]}}</p>
            </div>
          </div>

          <div class="chart-item">
            <div
              id="ios"
              style="width: 100%; height: 305px; margin: auto; display:inline-block"
            ></div>
            <div class="chart-text">
              <p>{{$t("home.Percentage")}}:{{((valueArray[3] / sumArray)*100).toFixed(2) + '%'}}</p>
              <p>{{$t("dataAnalysis.peopleNum")}}:{{valueArray[3]}}</p>
            </div>
          </div>

          <div class="chart-item">
          <div
            id="pc"
            style="width: 100%; height: 305px; margin: auto; display:inline-block"
          ></div>
            <div class="chart-text">
              <p>{{$t("home.Percentage")}}:{{((valueArray[4] / sumArray)*100).toFixed(2) + '%'}}</p>
              <p>{{$t("dataAnalysis.peopleNum")}}:{{valueArray[4]}}</p>
            </div>
          </div>
          
        </div>
        <!-- <div class="chart-right">
          <div id="equi-echart-right" style="width:100%;height:300px;"></div>
        </div>-->
      </div>
    </div>
  </div>
</template>


<script>
import i18n from '@/i18n/i18n'
import { Debounce } from '@/utils/debounce'
import moment from 'moment'
import './map.china.js' // 引入中国地图数据
export default {
  data () {
    return {
      dateValue: 1,
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: i18n.t('dataAnalysis.latestWeek'),
          onClick (picker) {
            let date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').valueOf()
            const start = moment(moment(date).add(-7, 'days')).startOf('days').valueOf()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: i18n.t('dataAnalysis.latestMonth'),
          onClick (picker) {
            let date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').valueOf()
            const start = moment(moment(date).add(-1, 'month')).startOf('days').valueOf()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: i18n.t('dataAnalysis.latestThreeMonths'),
          onClick (picker) {
            let date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').valueOf()
            const start = moment(moment(date).add(-3, 'month')).startOf('days').valueOf()
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          let date = moment().add(0, 'days').startOf('days')
          return (
            time.getTime() >= date.valueOf()
          )
        }
      },
      dateOptions: [
        {
          label: i18n.t('dataAnalysis.nearly7'),
          value: 1
        },
        {
          label: i18n.t('dataAnalysis.nearly30'),
          value: 2
        },
        {
          label: i18n.t('dataAnalysis.custom'),
          value: 3
        }
      ],
      visitPageList: [],  //  访问深度
      visitUserList: [],  //  访问地域
      dateRange: [], // 展示的时间参数
      dateRangeParam: [],
      timeRange: '',
      startTime: '',
      endTime: '',
      echartData: {
        depthData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        },
        regionData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        },
        equiData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        }
      },
      seriesDataArr: [], // 所有数据
      dateArr: [], // 趋势图x数值
      tableData: [],
      tableData2: [],
      tableNums: 0,
      currentPage: 1,
      equipment: i18n.t('dataAnalysis.iosTips') + i18n.t('dataAnalysis.androidTips'),
      sumArray: null, // 系统用户合计
      valueArray: [0, 0, 0, 0, 0],
      screenWidth: document.body.clientWidth
    }
  },

  mounted () {
    let that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    this.init()
  },
  watch: {
        /* 监听 */
    screenWidth (val) {
      this.screenWidth = val
      if (this.screenWidth < 1660) {
        this.getRegionEchartRight()
      } else {
        this.getRegionEchartRight()
      }
    }
  },

  methods: {
    // 获取分类数据
    init () {
      // 获取产品数据
      this.$http({
        url: this.$http.adornUrl(`/platform/flowUserAnalysis/getUserAnalysisData`),
        method: 'get',
        params: this.$http.adornParams({
          type: this.dateValue,
          start: this.timeRange ? this.timeRange[0] : null,
          end: this.timeRange ? this.timeRange[1] : null
        })
      }).then(({ data }) => {
        if (data) {
          this.tableData = data
          this.startTime = moment(data.start).format('L')
          this.endTime = moment(data.end).format('L')
          const visitPageList = data.visitPageList
          // 获取访问地域分布数据
          const visitUserList = data.visitUserList
          // 获取访问深度数据
          // ES6 遍历所需数组，获取内部对象，放到声明的数组对象中
          var visit = ''
          visitPageList.forEach(item => {
            // 1:1 2:2 3:3 4:4 5:5 6:6-10 7:11-20 8:20+
            if (item.visitId <= 5) {
              visit = item.visitId
            } else if (item.visitId === 6) {
              visit = '6-10'
            } else if (item.visitId === 7) {
              visit = '11-20'
            } else if (item.visitId === 8) {
              visit = '20+'
            }
            this.echartData.depthData.xData.push(visit + this.$i18n.t('dataAnalysis.page'))
            this.echartData.depthData.seriesData.push(item.userNums)

            // 成功了，实现将数据放到数组对象里面了
            this.echartData.depthData.seriesData2.push({ value: item.userNums, name: visit + this.$i18n.t('dataAnalysis.page') })
          })
          if (visitPageList.length === 0) {
            for (let i = 1; i < 9; i++) {
              if (i <= 5) {
                visit = i + ''
              } else if (i === 6) {
                visit = '6-10'
              } else if (i === 7) {
                visit = '11-20'
              } else if (i === 8) {
                visit = '20+'
              }
              visit = visit + this.$i18n.t('dataAnalysis.page')
              this.echartData.depthData.xData.push(visit)
              this.echartData.depthData.seriesData.push(0)
              this.echartData.depthData.seriesData2.push({ value: 0, name: visit })
            }
          }
          // 访问地域与表格数据
          let i = 1
          visitUserList.forEach(item => {
            this.echartData.regionData.xData.push(item.provinceName)
            this.echartData.regionData.seriesData2.push({ value: item.visitNums, name: item.provinceName })
            // this.echartData.regionData.seriesData.push(item.userNums)
            var stopTime = item.stopTime + this.$t('dataAnalysis.second')
            if (item.stopTime > 60) {
              stopTime = parseFloat(item.stopTime / 60).toFixed(0) + this.$t('dataAnalysis.minute') + item.stopTime % 60 + this.$t('dataAnalysis.second')
            }
            this.tableData2.push({ amount1: i++, amount2: item.provinceName, amount3: item.visitNums, amount4: item.visitUser, amount5: item.prodVisitNums, amount6: stopTime })
          })
          if (visitUserList.length === 0) {
            this.echartData.regionData.xData.push(this.$i18n.t('dataAnalysis.null'))
            this.echartData.regionData.seriesData2.push({ value: 0, name: this.$i18n.t('dataAnalysis.null') })
            this.tableData2.push({ amount1: 0, amount2: this.$i18n.t('dataAnalysis.null'), amount3: 0, amount4: 0, amount5: 0, amount6: 0 })
          }
          // console.log('11111')
          // console.log(item.provinceName)
          // console.log('this.tableData', this.tableData2)
          this.tableNums = i - 1

          // 系统设备数据
          this.echartData.equiData.xData.push('android', this.$i18n.t('sysManagement.miniProgramSmall'), 'h5', 'ios', 'pc')

          this.echartData.equiData.seriesData.push({ value: data.android, name: 'android' }, { value: data.applets, name: this.$i18n.t('sysManagement.miniProgramSmall') }, { value: data.h5, name: 'h5' }, { value: data.ios, name: 'ios' }, { value: data.pc, name: 'pc' })

          var array = [data.android, data.applets, data.h5, data.ios, data.pc]
          this.valueArray = array
          this.sumArray = array.reduce(function (a, b) {
            return parseInt(a) + parseInt(b)
          }, 0)
          console.log(this.sumArray)
          this.getDepthEchartLeft()
          this.getDepthEchartRight()
          // this.getRegionEchartLeft()
          this.getRegionEchartRight()
          this.getEquiEchartLeft('android', 0)
          this.getEquiEchartLeft('wxChat', 1)
          this.getEquiEchartLeft('h5', 2)
          this.getEquiEchartLeft('ios', 3)
          this.getEquiEchartLeft('pc', 4)
          this.getRegionEchartLeft()
        }
      })
    },
    updateDateTime () {
      this.visitPageList = []
      this.visitUserList = []
      this.dateRange = []
      this.seriesDataArr = []
      this.dateArr = []
      this.tableData = []
      this.tableData2 = []
      this.echartData = {
        depthData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        },
        regionData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        },
        equiData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        }
      }
      this.$forceUpdate()
      this.init()
    },
    // type === 3 时执行的时间绑定请求

    // p为不够10添加0的函数
    p (s) {
      return s < 10 ? '0' + s : s
    },

    // 头部时间选择款
    /**
     * 1: 近七天 2:近30天 3:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      Object.assign(this.$data, this.$options.data())
      this.dateValue = val
      var date = new Date()
      if (val === 1) {
        this.endTime = moment(date).add(-1, 'days').format('L')
        this.startTime = moment(date).add(-7, 'days').format('L')
      } else if (val === 2) {
        this.endTime = moment(date).add(-1, 'days').format('L')
        this.startTime = moment(date).add(-30, 'days').format('L')
      } else if (val === 3) {
        let startTime = moment(date).add(-2, 'days').startOf('days').valueOf()
        let endTime = moment(date).add(-1, 'days').endOf('days').valueOf()
        this.timeRange = [startTime, endTime]
      } else {
        return
      }
      this.$forceUpdate()
      this.init()
    },
    // 导出
    exportCategory: Debounce(function () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
      const loading = this.$loading({
        lock: true,
        target: '.region',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/platform/flowUserAnalysis/userAnalysisDataExport'),
        method: 'get',
        params: this.$http.adornParams({
          type: this.dateValue,
          start: this.timeRange ? this.timeRange[0] : null,
          end: this.timeRange ? this.timeRange[1] : null
        }),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$t('dataAnalysis.visitsGeo') + '.xlsx'
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
    // 获取访问深度左边的柱状数据图
    getDepthEchartLeft () {
      const myChart = this.$echarts.init(document.getElementById('depth-echart-left'))
      const option = {
        color: ['#0595d4'],
        tooltip: {
          trigger: 'axis'
          // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        legend: {
          data: [`${this.$i18n.t('dataAnalysis.numberOfVisitors')}`]
        },
        grid: {
          left: 30,
          right: 40,
          top: 55,
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.echartData.depthData.xData,
          // data: ['1页', '2页', '3页', '4页', '5页', '6-10页', '11-20页', '20+页'],
          // xAxis的属性，设置x轴文本不隐藏，同理yAxis也有
          axisLabel: {
            interval: 0,      // 坐标轴刻度标签的显示间隔
            rotate: 40        // 标签倾斜的角度
          }
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
        series: [{
          name: this.$i18n.t('dataAnalysis.numberOfVisitors'),
          data: this.echartData.depthData.seriesData,
          type: 'bar',
          barWidth: '45%',
          itemStyle: {
            normal: {
              color: '#02a1e9',
              barBorderRadius: [4, 4, 0, 0]
            }
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 获取访问深度右边的饼状数据图
    getDepthEchartRight () {
      const myChart = this.$echarts.init(document.getElementById('depth-echart-right'), 'walden')
      const option = {
        title: {
          text: this.$i18n.t('dataAnalysis.numberOfVisitors'),
          left: 'center',
          textStyle: {
            color: '#666',
            fontWeight: '500',
            fontSize: 12
          }
        },
        color: ['#349EFF', '#FFCC39', '#3DD86B', '#C859F2', '#FF8620', '#3BCAFF', '#FF6850', '#8185FF'],
        tooltip: {
          trigger: 'item',
          formatter: `{b} <br/>{a}: {c} <br/>${this.$i18n.t('home.Percentage')}{d}%`    // a:series.data.name\b:series.name\c:series.data.value\d:自动计算百分比
          // formatter: '{a}: {c} <br/>占比{d}%'
        },
        // graphic: {       //图形中间文字,固定展示
        //   type: "text",
        //   left: "center",
        //   top: "center",
        //   style: {
        //     text: "66",
        //     textAlign: "center",
        //     fill: "#fff",
        //     fontSize: 20
        //   }
        // },
        series: [
          {
            name: this.$i18n.t('dataAnalysis.numberOfVisitors'),
            type: 'pie',
            radius: ['72%', '28%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {  // 相应数据展示，饼图内部样式的设置
                show: true,
                fontSize: '14',
                color: '#888'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.echartData.depthData.seriesData2
          }
        ],
        legend: {
          orient: 'vertical',
          top: 20,
          right: 'left',
          data: this.echartData.depthData.xData
        }
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      setTimeout(() => {
        myChart.resize()
      }, 300)
    },

    // 获取访问地域分布左边边的数据图
    getRegionEchartLeft () {
      var oldDataList = [
        { name: '南海诸岛', label: this.$i18n.t('dataAnalysis.southIslands'), value: 0 },
        { name: '北京市', label: this.$i18n.t('dataAnalysis.bj'), value: randomValue() },
        { name: '天津市', label: this.$i18n.t('dataAnalysis.tj'), value: randomValue() },
        { name: '上海市', label: this.$i18n.t('dataAnalysis.sh'), value: randomValue() },
        { name: '重庆市', label: this.$i18n.t('dataAnalysis.cq'), value: randomValue() },
        { name: '河北省', label: this.$i18n.t('dataAnalysis.hb'), value: randomValue() },
        { name: '河南省', label: this.$i18n.t('dataAnalysis.hn'), value: randomValue() },
        { name: '云南省', label: this.$i18n.t('dataAnalysis.yn'), value: randomValue() },
        { name: '辽宁省', label: this.$i18n.t('dataAnalysis.ln'), value: randomValue() },
        { name: '黑龙江省', label: this.$i18n.t('dataAnalysis.hlj'), value: randomValue() },
        { name: '湖南省', label: this.$i18n.t('dataAnalysis.hunan'), value: randomValue() },
        { name: '安徽省', label: this.$i18n.t('dataAnalysis.ah'), value: randomValue() },
        { name: '山东省', label: this.$i18n.t('dataAnalysis.sd'), value: randomValue() },
        { name: '新疆维吾尔自治区', label: this.$i18n.t('dataAnalysis.xj'), value: randomValue() },
        { name: '江苏省', label: this.$i18n.t('dataAnalysis.js'), value: randomValue() },
        { name: '浙江省', label: this.$i18n.t('dataAnalysis.zj'), value: randomValue() },
        { name: '江西省', label: this.$i18n.t('dataAnalysis.jx'), value: randomValue() },
        { name: '湖北省', label: this.$i18n.t('dataAnalysis.hubei'), value: randomValue() },
        { name: '广西', label: this.$i18n.t('dataAnalysis.gx'), value: randomValue() },
        { name: '甘肃省', label: this.$i18n.t('dataAnalysis.gs'), value: randomValue() },
        { name: '山西省', label: this.$i18n.t('dataAnalysis.sx'), value: randomValue() },
        { name: '内蒙古自治区', label: this.$i18n.t('dataAnalysis.nm'), value: randomValue() },
        { name: '陕西省', label: this.$i18n.t('dataAnalysis.shanxi'), value: randomValue() },
        { name: '吉林省', label: this.$i18n.t('dataAnalysis.jl'), value: randomValue() },
        { name: '福建省', label: this.$i18n.t('dataAnalysis.fj'), value: randomValue() },
        { name: '贵州省', label: this.$i18n.t('dataAnalysis.gz'), value: randomValue() },
        { name: '广东省', label: this.$i18n.t('dataAnalysis.gd'), value: randomValue() },
        { name: '青海省', label: this.$i18n.t('dataAnalysis.qh'), value: randomValue() },
        { name: '西藏自治区', label: this.$i18n.t('dataAnalysis.xz'), value: randomValue() },
        { name: '四川省', label: this.$i18n.t('dataAnalysis.sc'), value: randomValue() },
        { name: '宁夏回族自治区', label: this.$i18n.t('dataAnalysis.nx'), value: randomValue() },
        { name: '海南省', label: this.$i18n.t('dataAnalysis.hainan'), value: randomValue() },
        { name: '台湾省', label: this.$i18n.t('dataAnalysis.tw'), value: randomValue() },
        { name: '香港', label: this.$i18n.t('dataAnalysis.hk'), value: randomValue() },
        { name: '澳门', label: this.$i18n.t('dataAnalysis.macau'), value: randomValue() }
      ]

      function randomValue () {
        return Math.round(Math.random() * 0)
      }
      var newDataList = this.echartData.regionData.seriesData2
      // 循环赋值，有数据的更新
      for (var i = 0; i < newDataList.length; i++) {
        for (var j = 0; j < oldDataList.length; j++) {
          if (newDataList[i].name === oldDataList[j].name) {
            oldDataList[j].value = newDataList[i].value
          }
        }
      }
      const myChart = this.$echarts.init(document.getElementById('region-echart-left'), 'walden')
      // var params = this.echartData.regionData.seriesData2
      const option = {
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.seriesName + '<br />' + params.name + '：' + params.value
          } // 数据格式化
        },
        visualMap: {
          min: 0,
          left: 'left',
          top: 'bottom',
          text: [this.$i18n.t('dataAnalysis.height'), this.$i18n.t('dataAnalysis.low')], // 取值范围的文字
          inRange: {
            color: ['#e2e2e2', '#0595d4'] // 取值范围的颜色
          },
          show: true // 图注
        },
        geo: {
          map: 'china',
          roam: false, // 不开启缩放和平移
          zoom: 1.23, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: '10',
              color: 'rgba(0,0,0,0.7)'
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: '#d48265', // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            name: this.$i18n.t('dataAnalysis.pageviews'),
            type: 'map',
            map: 'china',
            geoIndex: 0,
            // data: this.echartData.regionData.seriesData2
            data: oldDataList
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 获取访问地域分布右边的数据图
    getRegionEchartRight () {
      const randomColor = []
      for (var i = 1; i <= 34; i++) {
        var z = 0
        var str = '#'
        var random = 0
        var aryNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        for (z = 0; z < 6; z++) {
          random = parseInt(Math.random() * 16)

          str += aryNum[random]
        }
        randomColor.push(str)
      }
      const myChart = this.$echarts.init(document.getElementById('region-echart-right'), 'walden')
      const option = {
        title: {
          text: this.$i18n.t('dataAnalysis.pageviews'),
          left: 'center',
          textStyle: {
            color: '#666',
            fontWeight: '500',
            fontSize: 12
          }
        },
        color: randomColor,
        tooltip: {
          trigger: 'item',
          formatter: `{b} <br/>{a}: {c} <br/>${this.$i18n.t('home.Percentage')}:{d}%`
        },
        legend: {
          orient: 'vertical',
          top: 20,
          right: 'left',
          data: this.echartData.regionData.xData
          // data: ['广东', '湖北', '其它']
        },
        series: [
          {
            name: this.$i18n.t('dataAnalysis.pageviews'),
            type: 'pie',
            radius: ['70%', '30%'],
            avoidLabelOverlap: false,
            center: this.screenWidth > 1660 ? ['50%', '50%'] : ['30%', '50%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                color: '#888'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.echartData.regionData.seriesData2
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      setTimeout(() => {
        myChart.resize()
      }, 300)
    },

    // 访问地域分布表格
    // 为表格行添加样式
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'double' //  基数行对应的类
      } else {
        return 'single' //  偶数行对应的类
      }
    },
    // 为表格头行添加样式
    getRowClass ({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:#f7f8fa; font-weight: 600; color: #000'
      } else {
        return ''
      }
    },

    // 表格底部分页页码跳转
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    },

    // 获取系统设备左边的数据图
    getEquiEchartLeft (type, index) {
      const other = this.sumArray - this.echartData.equiData.seriesData[index].value
      console.log(other, 'other')
      const myChart = this.$echarts.init(document.getElementById(type), 'walden')
      console.log(this.echartData.equiData.seriesData, 'this.echartData.equiData.seriesData')
      const option = {
        // title: {
        //   text: this.$i18n.t('dataAnalysis.peopleNum'),
        //   left: 'center',
        //   textStyle: {
        //     color: '#666',
        //     fontWeight: '500',
        //     fontSize: 12
        //   }
        // },
        tooltip: {
          trigger: 'item',
          show: true,
          formatter: `{b} <br/>{a}: {c} <br/>${this.$i18n.t('home.Percentage')}:{d}%`,
          position: [0, '70%']
        },
        // legend: {
        //   orient: 'vertical',
        //   top: 20,
        //   left: 'left',
        //   data: this.echartData.equiData.xData
        //   // data: ['IOS', 'Android', '其它']
        // },
        graphic: {
          type: 'circle',
          left: 'center',
          top: 'center',
          style: {
            text: ['Android', this.$i18n.t('sysManagement.miniProgramSmall'), 'H5', 'IOS', 'PC'][index],
            textAlign: 'center',
            fill: 'rgb(51,51,51)',
            width: 30,
            height: 30,
            font: '14px blod Microsoft YaHei'
            // shadowBlur: 10,
            // shadowOffsetX: 0,
            // shadowOffsetY: 2,
            // shadowColor: 'rgba(22, 62, 101, 0.1)'
            // boxShadow: '0px 2px 10px'
          }
        },
        series: [
          {
            name: this.$i18n.t('dataAnalysis.peopleNum'),
            type: 'pie',
            // silent: true,
            hoverAnimation: false,
            radius: ['70%', '30%'],
            center: ['50%', '50%'],
            color: [['#1890FF', '#FE5500', '#5FCFFF', '#574EFF', '#F6C023'][index], '#F1F5F9'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            itemStyle: {
              normal: {
                    // 设置扇形的阴影
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
                shadowColor: 'rgba(22, 62, 101, 0.1)'

              }
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '14',
                color: '#888'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [this.echartData.equiData.seriesData[index], {value: other, name: this.$i18n.t('prodList.other')}]
          }

        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }

  }
}
</script>

<style lang="scss">
.mod-home {
  // 头部时间选择框
  .header {
    width: 100%;
    background: #f7f8fa;
    padding: 15px 20px;
  }
  .depth .title {
    line-height: 18px;
    font-size: 18px !important;
    color: #333;
    font-weight: bold;
    padding: 18px 12px;
  }
  .export-btn {
    position: absolute;
    right: 0;
    top: 18px;
  }
  .title-time {
    color: #999;
    padding-left: 8px;
  }
  .title-time-span {
    .el-date-editor .el-range__icon {
      line-height: 22px;
    }
    .el-date-editor .el-range-separator {
      width: 6%;
      line-height: 24px;
    }
    .el-date-editor .el-range__close-icon {
      line-height: 24px;
    }
  }
  .title-time-Range {
    height: 30px;
  }

  // 访问深度
  .depth {
    // background: #f8f8f8;
    // width: 100%;
  }
  .depth .title {
    font-size: 22px;
    line-height: 22px;
    margin: 0.5em 0 1em 0;
    padding: 18px 12px;
  }
  .depth .title .item {
    font-size: 18px;
    font-weight: 400;
  }
  .depth .chart {
    display: flex;
  }
  .depth .chart .chart-left {
    width: 35%;
    display: flex;
  }
  // .depth .chart .chart-left div{
  //   margin-right: 11% !important;
  // }
  .depth .chart .chart-right {
    width: 65%;
    padding: 0 0 20px;
  }

  /*更改表格颜色*/
  .double {
    height: 50px;
    background: #f7f8fa !important;
  }
  .single {
    height: 50px;
    background: #ffffff !important;
  }

  // 设置分页页码样式
  .block {
    height: 50px;
    padding-top: 10px;
  }

  // 设备系统
  .equi .chart-left {
    width: 100% !important;
  }

  .region > .title {
    position: relative;
  }
  
  // 文字提示框盒子
  .has-tooltip {
    display: flex;
    align-items: center;
    // justify-content: center;
    span {
      line-height: 18px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-right: 5px;
    }
    .tit-mod-btn.el-button {
      width: auto;
      height: auto;
      padding: 0;
      border: none;
    }
    .tit-mod-btn.el-button:hover, .tit-mod-btn.el-button:focus {
      color: #333;
      background-color: transparent;
    }
    // 文字提示框的问号icon
    .que-mark {
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #C8C9CC;
      border-radius: 50%;
      margin-left: 5px;
      cursor: default;
    }
  }
  .chart-item {
    width: 18%;
    margin-right: 2%;
    .chart-text{
      text-align: center;
      margin-bottom: 57px;
      p {
        margin-bottom: 5px;
      }
    }
  }
  ::v-deep .export-load {
    top: -50% !important;
  }
}
</style>
<style>
.atooltip {
  background: #C8C9CC !important;
}
</style>
