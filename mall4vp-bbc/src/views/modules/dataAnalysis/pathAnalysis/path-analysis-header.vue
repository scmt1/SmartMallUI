<template>
  <div class="mod-header">
    <div class="base-section">
      <el-form :inline="true" :model="dataForm">
        <!-- 头部统计时间栏start -->
        <!-- 已修改 -->
        <el-form-item :label="$t('dataAnalysis.statisticalTime') + ':'" style="margin-bottom: 0;">
          <div class="title-right">
            <el-select
              v-model="timeType"
              @change="setDateRange()"
              style="auto"
              size="mini"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-if="timeType === 1" class="title-picker">
              <el-date-picker
                size="mini"
                style="width: auto"
                v-model="preDay"
                type="date"
                :placeholder="$t('dataAnalysis.selectDate')"
                value-format="timestamp"
                @change="changeDay"
                :picker-options="PickerOptions"
              ></el-date-picker>
            </div>
            <div v-if="timeType === 2" class="title-picker">
              <!-- :picker-options="weekPickerOptions" -->
              <el-date-picker
                size="mini"
                style="width: auto"
                v-model="preWeek"
                type="week"
                :picker-options="weekPickerOptions"
                :format="`yyyy ${$t('dataAnalysis.the')} WW ${$t('dataAnalysis.week')}`"
                :placeholder="$t('dataAnalysis.selectWeek')"
                @change="changeWeek"
              ></el-date-picker>
            </div>
            <div v-if="timeType === 3" class="title-picker">
              <el-date-picker
                size="mini"
                style="width: auto;"
                v-model="preMonth"
                type="month"
                :picker-options="monthPickerOptions"
                :placeholder="$t('dataAnalysis.selectMonth')"
                @change="changeMonth"
                value-format="timestamp"
              ></el-date-picker>
            </div>
            <span
              class="title-time"
              v-if="(timeType === 5 || timeType === 6 || timeType === 2) && startTime && endTime"
            >{{startTime}} - {{endTime}}</span>
          </div>
        </el-form-item>
      </el-form>
      <!-- 头部统计时间栏end -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      timeType: 1, // 时间下拉选择框的几种范围
      start: '',
      end: '',
      nowDate: null,
      startTime: '',
      endTime: '',
      type: 1,
      dataForm: {
        group: 0,
        status: 0
      },
      // 对可选日进行判断
      PickerOptions: {
        disabledDate (time) {
          let date = moment().add(-1, 'days')
          return (
            time.getTime() > date.valueOf()   //  之后不可选
          )
        }
      },
      weekPickerOptions: {
        disabledDate (time) {
          return (
            time > moment().add(-1, 'week').endOf('week')
          )
        }
      },
      // 对可选月数进行判断
      monthPickerOptions: {
        disabledDate (time) {
          var month1 = moment().startOf('month').valueOf()
          return (
            time.getTime() > month1   //  time.getTime返回无法选中的区间，但大于当前时间时month1
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
          label: this.$i18n.t('dataAnalysis.nearly7'),
          value: 5
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly30'),
          value: 6
        }
      ],
      prodData: {
        dateRange1: null // 时间区间
      },
      dateRange: [],
      preDay: '',
      preWeek: '',
      preMonth: '', // 前一个月
      dateRange1: []  // 时间选择范围
    }
  },
  mounted () {
    this.timeType = 5
    this.startTime = moment().add(-7, 'days').startOf('day').format('L')
    this.endTime = moment().add(-1, 'days').endOf('day').format('L')
    this.$parent.timeType = this.timeType
    this.$parent.start = 5
    this.$forceUpdate()
  },
  methods: {
    /**
     * 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
     */
    setDateRange () {
      var start = 0
      var date = new Date()
      if (this.timeType === 1) {
        start = moment(date).add(-1, 'days').startOf('days').valueOf()
        this.preDay = start
      } else if (this.timeType === 2) {
        start = moment(date).add(-1, 'week').startOf('week').valueOf()
        this.preWeek = start
        this.startTime = moment(start).startOf('week').format('L')
        this.endTime = moment(start).endOf('week').format('L')
      } else if (this.timeType === 3) {
        start = moment(date).add(-1, 'month').startOf('month').valueOf()
        this.preMonth = start
      } else if (this.timeType === 5) {
        start = this.timeType
        this.startTime = moment().add(-7, 'days').startOf('day').format('L')
        this.endTime = moment().add(-1, 'days').endOf('day').format('L')
      } else if (this.timeType === 6) {
        start = this.timeType
        this.startTime = moment().add(-30, 'days').startOf('day').format('L')
        this.endTime = moment().add(-1, 'days').endOf('day').format('L')
      }
      this.$forceUpdate()
      this.$parent.timeType = this.timeType
      this.$parent.start = start
    },
    changeDay () {
      this.$parent.timeType = this.timeType
      this.$parent.start = this.preDay
    },
    changeWeek () {
      this.$parent.timeType = this.timeType
      this.$parent.start = this.preWeek ? this.preWeek.getTime() : null
      this.startTime = this.preWeek ? moment(this.preWeek).startOf('week').format('L') : null
      this.endTime = this.preWeek ? moment(this.preWeek).endOf('week').format('L') : null
    },
    changeMonth () {
      this.$parent.timeType = this.timeType
      this.$parent.start = this.preMonth
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-header {
  .base-section {
    padding: 15px 20px;
    background-color: #f7f8fa;
    margin-bottom: 16px;
  }
  .el-pagination {
    padding: 10px 5px 10px;
    background: #fff;
  }
  .title-right {
    text-align: right;
    display: inline;
    width: 20%;
  }
  .title-picker {
    display: inline;
  }

  .title-time {
    padding-left: 8px;
    color: #999999;
  }
}
</style>

