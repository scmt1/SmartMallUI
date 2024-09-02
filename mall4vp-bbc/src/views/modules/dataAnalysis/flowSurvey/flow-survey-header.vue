<template>
  <div class="header">
    <div class="flow-title">
      <div class="flow-title-left">
        <div class="line" />
        <div class="text">
          {{$t('dataAnalysis.pVOverview')}}
        </div>
      </div>
      <div class="flow-title-right">
        <!-- 时间选择框 left -->
        <span>{{$t('dataAnalysis.statisticalTime')}}：</span>
        <div class="flow-title-time-select">
          <el-select
            v-model="dateValue"
            @change="setDateRange(dateValue)"
            style="width:auto; margin-right: 20px"
            size="mini"
          >
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- /时间选择框 left -->

        <!-- 时间选择框 right -->
        <div v-if="dateValue >= 4">
          <span style="margin-right: 20px" v-if="dateValue === 4">{{this.nowDate}}</span>
          <div
            v-if="dateValue === 4"
            @click="flushDateTime"
            class="default-btn"
          >{{$t('dataAnalysis.refresh')}}
          </div>
          <span
            v-if="dateValue === 5 || dateValue === 6"
          >{{this.dateRange[0]}} {{$t('date.tip')}} {{this.dateRange[1]}}</span>
          <span class="title-time title-time-span" v-if="dateValue === 7">
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
                value-format="timestamp"
                >></el-date-picker
              >
            </span>
        </div>
        <div v-if="dateValue === 1">
          <el-date-picker
            size="mini"
            style="width: 150px;"
            v-model="dateRange[0]"
            type="date"
            :placeholder="$t('dataAnalysis.selectDate')"
            :picker-options="PickerOptions"
          ></el-date-picker>
        </div>
        <div v-if="dateValue === 3">
          <el-date-picker
            size="mini"
            style="width: 150px;"
            v-model="preMonth"
            type="month"
            :placeholder="$t('dataAnalysis.selectMonth')"
            :picker-options="monthPickerOptions"
          ></el-date-picker>
        </div>
        <div v-if="dateValue === 2">
          <el-date-picker
            size="mini"
            style="width: 230px;"
            v-model="weekRange"
            type="week"
            :picker-options="weekPickerOptions"
            :format="this.weekRangeFormat"
            :placeholder="$t('dataAnalysis.selectWeek')">
          </el-date-picker>
        </div>
        <!-- /时间选择框 right -->
        <div
          v-if="isAuth('flow:data:export')"
          class="default-btn primary-btn export-btn"
          @click="exportCategory()"
        >{{$t("order.export")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Debounce } from '@/utils/debounce'
  import moment from 'moment'
  export default {
    data () {
      return {
        dateValue: 7,             // 时间选择状态
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
        },
        dateRange: [],
        timeRange: '',
        nowDate: null,
        preMonth: '',
        monthPickerOptions: {
          disabledDate (time) {
            let month1 = moment().startOf('month')
            return (
              time.getTime() > month1.valueOf()
            )
          }
        },
        PickerOptions: {
          disabledDate (time) {
            let date = moment().add(0, 'days').startOf('days')
            return (
              time.getTime() >= date.valueOf()
            )
          }
        },
        weekPickerOptions: {
          disabledDate (time) {
            let month1 = moment().add(-1, 'week').endOf('week')
            return (
              time.getTime() > month1.valueOf()
            )
          }
        },
        dateOptions: [
          {
            label: this.$i18n.t('dataAnalysis.naturalDay'),
            value: 1
          },
          {
            label: this.$i18n.t('dataAnalysis.naturalWeek'),
            value: 2
          },
          {
            label: this.$i18n.t('dataAnalysis.naturalMonth'),
            value: 3
          },
          {
            label: this.$i18n.t('dataAnalysis.todayRealTime'),
            value: 4
          },
          {
            label: this.$i18n.t('dataAnalysis.nearly7'),
            value: 5
          },
          {
            label: this.$i18n.t('dataAnalysis.nearly30'),
            value: 6
          },
          {
            label: this.$i18n.t('dataAnalysis.custom'),
            value: 7
          }
        ],
        weekRange: '',
        weekRangeFormat: ''
      }
    },
    watch: {
      dateRange: {
        handler (newValue, oldValue) {
          this.$parent.timeType = this.dateValue
          // 转成时间戳格式
          this.$parent.startTime = moment(this.dateRange[0]).unix() * 1000
          this.$parent.endTime = moment(this.dateRange[1]).unix() * 1000
        },
        deep: true,
        immediate: true
      },
      weekRange (newVal) {
        var d = moment(newVal).startOf('week')
        this.dateRange = []
        this.dateRange.push(newVal)
        this.weekRangeFormat = 'yyyy-MM-dd - ' + moment(d).endOf('week').format('L')
      },
      preMonth (newVal) {
        var d = moment(newVal).startOf('month')
        this.dateRange = []
        this.dateRange.push(d)
      }
    },
    mounted() {
      this.setDateRange(5)
    },
    methods: {
      /**
       * 刷新时间
       */
      flushDateTime () {
        var date = new Date()
        this.nowDate = moment(date).format('LL')
        this.dateRange = []
        this.dateRange.push(date)
      },
      updateDateTime () {
        this.dateRange = [this.timeRange[0], this.timeRange[1]]
        this.$forceUpdate()
      },
      /**
       * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月(前一个月如当前月为7月，自然月为6月)
       * 改：// 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天 7:自定义
       */
      setDateRange (val) {
        var startDay = null
        var endDay = null
        let date1 = new Date()
        this.dateValue = val
        if (val === 4) {
          startDay = 1
          endDay = 1
          this.flushDateTime()
          return
        } else if (val === 5) {
          startDay = -7
          endDay = -1
        } else if (val === 6) {
          startDay = -31
          endDay = -1
        } else if (val === 1) {
          startDay = -1
          endDay = -1
        } else if (val === 3) {
          this.preMonth = this.getPreMonth()
          return
        } else if (val === 2) {
          this.weekRange = moment(moment().add(-1, 'week')).startOf('week')
          return
        } else if (val === 7) {
          this.timeRange = [moment(date1).add(-2, 'days').startOf('days'), moment(date1).add(-1, 'days').endOf('days')]
        } else {
          return
        }
        // 开始时间
        var startTime = moment().add(startDay, 'days').format('L')
        // 结束时间
        var endTime = moment().add(endDay, 'days').format('L')
        if (val === 7) {
          startTime = moment(date1).add(-2, 'days').startOf('days')
          endTime = moment(date1).add(-1, 'days').endOf('days')
        }
        this.dateRange = [startTime, endTime]
      },
      /**
       * 获取前一个月的时间
       */
      getPreMonth () {
        var obj = moment(moment().add(-1, 'month')).startOf('month')
        this.dateRange = []
        this.dateRange.push(obj)
        return obj
      },
      mounted () {
      // 初始化自然日
        this.setDateRange(5)
      },

      // 导出
      exportCategory: Debounce(function () {
        // let params = {}
        // params = JSON.parse(JSON.stringify(this.searchForm))
        const loading = this.$loading({
          lock: true,
          target: '.overview',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/platform/flowAnalysis/analysisDataExport'),
          method: 'get',
          params: this.$http.adornParams({
            timeType: this.$parent.timeType,
            start: this.$parent.startTime,
            end: this.$parent.endTime,
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$t('dataAnalysis.pVOverview') + '.xlsx'
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

<style lang="scss" scoped>
.header {
  .flow-title {
    margin-top: 0;
  }
  .flow-title-time-select {
    .default-btn {
      margin-left: 20px;
    }
  }
  .export-btn {
    margin-left: 20px;
  }
  ::v-deep .export-load {
    top: -50% !important;
  }
}
</style>

