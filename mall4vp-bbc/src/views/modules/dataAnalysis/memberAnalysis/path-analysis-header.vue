<template>
  <div class="mod-header">
    <div class="base-section">
      <el-form :inline="true" :model="dataForm" class="form-inline">
        <!-- 头部统计时间栏start -->
        <el-form-item>
          <div class="header-title">{{$t('dataAnalysis.statisticalTime')}}：</div>
          <div class="title-right">
            <el-select
              v-model="timeType"
              style="width:100px;height: 15px;"
              size="mini"
              @change="setDateRange()"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- 自然日 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 1 "
              v-model="preDay"
              size="mini"
              type="date"
              style="width: 150px"
              :placeholder="$t('dataAnalysis.selectDate')"
              :picker-options="dayPickerOptions"
              @change="changeDate"
            />
          </div>
          <!-- 自然周 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 2 "
              v-model="preWeek"
              size="mini"
              style="width: 230px;"
              type="week"
              :picker-options="weekPickerOptions"
              :format="weekRangeFormat"
              :placeholder="$t('dataAnalysis.naturalWeek')"
              @change="changeDate"
            />
          </div>
          <!-- 自然月 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 3 "
              v-model="preMonth"
              size="mini"
              style="width: 150px;"
              type="month"
              :placeholder="$t('dataAnalysis.naturalMonth')"
              :picker-options="monthPickerOptions"
              @change="changeDate"
            />
          </div>
          <!-- 自定义 -->
          <div v-if="timeType === 7" class="title-picker">
            <el-date-picker
              v-model="timeRange"
              class="title-time-Range"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              unlink-panels
              range-separator="-"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              size="small"
              :picker-options="pickerOptions"
              :clearable="false"
              @change="updateDateTime"
            >></el-date-picker>
          </div>

          <div class="date-display">
            <!-- 今日实时 -->
            <span v-if="timeType === 4" class="title-time">{{ nowDate }}</span>
            <!-- 刷新 -->
            <button
              v-if="timeType === 4"
              class="el-button el-button--text el-button--small"
              type="button"
              @click="flushDateTime"
            >{{$t('dataAnalysis.refresh')}}</button>
            <!-- 近7天/近30天 -->
            <span
              v-if="timeType === 5 || timeType === 6"
              class="title-time"
            >{{ dateRange[0] }} {{$t('date.tip')}} {{ dateRange[1] }}</span>
          </div>
          <!-- <span v-if="timeType !== 7" class="title-time">{{ dateRange[0] }} 至 {{ dateRange[1] }}</span> -->
        </el-form-item>
      </el-form>
      <!-- 头部统计时间栏end -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    dateOptions: {
      type: Array,
      default () {
        return [
          {
            label: this.$t('date.n'),
            value: 5
          },
          {
            label: this.$t('date.m'),
            value: 6
          },
          {
            label: this.$t('dataAnalysis.custom'),
            value: 7
          }
        ]
      }
    }
  },
  data () {
    return {
      timeType: 5, // 时间下拉选择框的几种范围
      startTime: '',
      endTime: '',
      type: 1,
      dataForm: {
        group: 0,
        status: 0
      },

      // 自然日
      dayPickerOptions: {
        disabledDate (time) {
          const date = moment().add(0, 'days').startOf('days')
          return (
            time.getTime() >= date.valueOf()
          )
        }
      },
      // 自然周
      weekPickerOptions: {
        disabledDate (time) {
          const month = moment().add(-1, 'week').endOf('week')
          return (
            time.getTime() > month.valueOf()
          )
        }
      },
      // 自然月
      monthPickerOptions: {
        disabledDate (time) {
          const month = moment().startOf('month')
          return (
            time.getTime() >= month.valueOf()
          )
        }
      },
      // 自然日
      preDay: '',
      // 自然周
      preWeek: '',
      // 前一个月
      preMonth: '',
      // 时间选择范围
      dateRange: [],
      // 今日实时时间
      nowDate: null,
      // 自然周默认格式
      weekRangeFormat: '',

      // 自定义
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
            const start = moment(moment(date).add(-7, 'days')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
            const start = moment(moment(date).add(-1, 'month')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const date = new Date()
            const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
            const start = moment(moment(date).add(-3, 'month')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          const date = moment().add(0, 'days').startOf('days')
          return (
            time.getTime() >= date.valueOf()
          )
        }
      },
      timeRange: '' // 自定义
    }
  },
  watch: {
    dateRange () {
      this.$parent.timeType = this.timeType
      this.$parent.dateRange = this.dateRange
    },
    preWeek (newVal) {
      var d = moment(newVal).startOf('week').format('YYYY-MM-DD HH:mm:ss')
      this.weekRangeFormat = 'yyyy-MM-dd - ' + moment(d).endOf('week').format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.setDateRange()
  },

  methods: {
    /**
     * 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天 7:自定义
     */
    setDateRange () {
      const timeType = this.timeType
      let startDay = null
      let endDay = null
      let startTime = null
      let endTime = null
      if (timeType === 1) {
        startTime = moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.preDay = startTime
        this.dateRange = [startTime, endTime]
        return
      } else if (timeType === 2) {
        this.preWeek = moment(moment().add(-1, 'week')).startOf('week')
        this.changeDate(this.preWeek)
        return
      } else if (timeType === 3) {
        this.preMonth = this.getPreMonth()
        this.changeDate(this.preMonth)
        return
      } else if (timeType === 4) {
        startDay = 1
        endDay = 1
        this.flushDateTime()
        return
      } else if (timeType === 5) {
        startDay = -7
        endDay = -1
      } else if (timeType === 6) {
        startDay = -31
        endDay = -1
      } else if (timeType === 7) {
        startTime = moment().add(-2, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.timeRange = [startTime, endTime]
        this.dateRange = this.timeRange
        return
      } else {
        return
      }
      startTime = moment().add(startDay, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      endTime = moment().add(endDay, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.dateRange = [startTime, endTime]
    },

    /**
     * 改变日期选择
     */
    changeDate (val) {
      const timeType = this.timeType
      let endTime = null
      let startTime = null
      if (timeType === 2) {
        // 自然周
        startTime = moment(val).startOf('week').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(val).endOf('week').format('YYYY-MM-DD HH:mm:ss')
      } else if (timeType === 3) {
        // 自然月
        startTime = moment(val).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(val).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      } else if (timeType === 4) {
        // 今日实时
        startTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        // 自然日/近7天/近30天
        startTime = moment(val).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment(val).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.preDay = startTime
      }
      this.dateRange = [startTime, endTime]
    },

    /**
     * 刷新时间
     */
    flushDateTime () {
      var date = new Date()
      this.nowDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
      this.changeDate(this.nowDate)
    },

    /**
     * 获取前一个月的时间
     */
    getPreMonth () {
      var obj = moment(moment().add(-1, 'month')).startOf('month')
      return obj
    },

    /**
     * 自定义
     */
    updateDateTime (val) {
      const end = moment(val[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.dateRange = [val[0], end]
    }
  }
}
</script>

<style lang="scss">
.mod-header {
  .base-section {
    padding: 10px;
    background-color: #f7f8fa;
    margin-bottom: 16px;
  }
  // 栏目标题行
  .header-title {
    display: inline-block;
  }
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    font-size: 12px;
    display: flex;
  }
  .item-list {
    background: #f8f8f8;
    margin: 20px 0 30px;
  }
  .form-inline {
    margin-left: 0;
    margin-bottom: 0;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-pagination {
    padding: 10px 5px 10px;
    background: #fff;
  }
  .form-inline-title {
    display: inline-block;
    float: left;
    padding-top: 14px;
    height: 60px;
    width: 80px;
  }
  .title-text-info {
    background: #f8f8f8;
  }
  .title-left {
    text-align: left;
    display: inline;
    margin-top: 0.5em;
    width: 80%;
  }
  .title-right {
    text-align: right;
    display: inline;
    width: 20%;
    margin-right: 5px;
  }
  .title-picker {
    display: inline;
  }
  .blue-vertical {
    display: inline-block;
    width: 3px;
    height: 1em;
    background: #155bd4;
    margin-right: 0.5em;
    vertical-align: middle;
  }
  .title-time {
    color: #999999;
    vertical-align: middle;
    vertical-align: middle;
    margin-left: 5px;
    font-size: 12px;
  }
  .date-display {
    display: inline-block;
    .title-time {
      margin-right: 6px;
    }
  }
}
</style>

