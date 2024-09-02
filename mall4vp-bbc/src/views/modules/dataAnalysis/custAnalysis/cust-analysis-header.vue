<template>
  <div class="time-header base-section">
    <el-form :inline="true" class="form-inline">
      <el-form-item :label="$t('dataAnalysis.statisticalTime') +':'" style="margin-bottom: 0">
        <div class="title-right">
          <el-select
            v-model="dateValue"
            @change="setDateRange(dateValue)"
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
          <span class="title-time" v-if="dateValue === 1">{{this.nowDate}}</span>
          <button
            v-if="dateValue === 1"
            data-v-3baf97fc
            class="el-button el-button--text el-button--small"
            @click="flushDateTime"
            type="button"
          >{{$t('dataAnalysis.refresh')}}</button>
          <span
            class="title-time"
            v-if="dateValue === 2 || dateValue === 3"
          >{{this.dateRange[0]}}{{$t('date.tip')}}{{this.dateRange[1]}}</span>
          <div v-if="dateValue === 4" class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px;"
              v-model="dateRange[0]"
              @change="handleRangeFour()"
              type="date"
              :placeholder="$t('dataAnalysis.selectDate')"
              :picker-options="PickerOptions"
            ></el-date-picker>
          </div>
          <div v-if="dateValue === 5" class="title-picker">
            <el-date-picker
              size="mini"
              style="width: 150px;"
              v-model="preMonth"
              @change="handleMonth()"
              type="month"
              :placeholder="$t('dataAnalysis.selectMonth')"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
          </div>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      timeData: {},             // 传给父级，请求接口所需的时间参数
      dateValue: 1,             // 商品整体概况,时间选择状态
      data: {
        newProd: 0,              // 新增商品数
        visitedProd: 0,         // 被访问商品数
        dynamicSale: 0,         // 动销商品数
        expose: 0,              // 商品曝光数
        browse: 0,              // 商品浏览量
        visitor: 0,             // 商品访客数
        addCart: 0,             // 加购件数
        orderNum: 0,            // 下单件数
        payNum: 0               // 支付件数
      },
      dateRange: [],
      nowDate: null,
      preMonth: null,
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
          let date = moment().add(-1, 'days').startOf('days')
          return (
            time.getTime() > date.valueOf()
          )
        }
      },
      dateOptions: [
        {
          label: this.$i18n.t('dataAnalysis.todayRealTime'),
          value: 1
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly7'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnalysis.nearly30'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnalysis.naturalDay'),
          value: 4
        },
        {
          label: this.$i18n.t('dataAnalysis.naturalMonth'),
          value: 5
        }
      ]
    }
  },
  mounted () {
    this.flushDateTime()
    // this.setDateRange(this.dateValue)
    // this.getProdSurvey()
    this.setDateRange(2)
    // this.setDateRange3(2)
  },
  methods: {
    /**
     * 每次改变时间范围，把时间范围的值传给父组件
     */
    emitSuperior () {
      this.$emit('timeData', this.timeData)
    },
    /**
     * 刷新时间
     */
    flushDateTime () {
      var date = moment()
      this.nowDate = date.format('LL')
      this.dateRange1 = [moment(date).startOf('days').format('LL'), this.nowDate]
      this.timeData.dateValue = this.dateValue
      this.timeData.dateRange = this.dateRange1
      this.emitSuperior()
    },

    /**
     * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      this.dateValue = val
      if (val === 1) {
        startDay = 0
        endDay = 0
        this.dateRange1 = [moment().startOf('days').format('LL'), this.nowDate]
        this.timeData.dateValue = this.dateValue
        this.timeData.dateRange = this.dateRange1
        this.emitSuperior()
        return
      } else if (val === 2) {
        startDay = -7
        endDay = -1
      } else if (val === 3) {
        startDay = -30
        endDay = -1
      } else if (val === 4) {
        startDay = -1
        endDay = -1
      } else if (val === 5) {
        this.preMonth = this.getPreMonth(moment().add(-1, 'days'))
        return
      } else {
        return
      }
      // 开始时间
      const startTime = moment().add(startDay, 'days').startOf('days')
      // 结束时间
      const endTime = moment().add(endDay, 'days').endOf('days')
      this.dateRange = [startTime.format('L'), endTime.format('L')]
      this.dateRange1 = [startTime.format('LL'), endTime.format('LL')]
      // 把时间参数传到父组件
      this.timeData.dateValue = this.dateValue
      this.timeData.dateRange = this.dateRange1
      this.emitSuperior()
    },
    /**
     * 当dateRange == 4 监听dateRange[0]的变化
     */
    handleRangeFour () {
      if (this.dateRange[0]) {
        var start = moment(this.dateRange[0]).startOf('days')
        this.dateRange1 = [start.format('LL'), moment(start).endOf('days').format('LL')]
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      // 把时间参数传到父组件
      this.timeData.dateValue = this.dateValue
      this.timeData.dateRange = this.dateRange1
      this.emitSuperior()
    },
    /**
     * 当dateRange == 5 监听dateRange[0]的变化
     */
    handleMonth () {
      console.log('his.preMonth', this.preMonth)
      if (this.preMonth) {
        this.getPreMonth(this.preMonth)
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
        // 把时间参数传到父组件
        this.timeData.dateValue = this.dateValue
        this.timeData.dateRange = this.dateRange1
        this.emitSuperior()
      }
      this.getProdSurvey()
    },
    /**
     * 获取前一个月的时间
     */
    getPreMonth (date) {
      if (!date) {
        date = new Date()
      }
      // 月的开始时间
      const timeStar = moment(date).startOf('month').format('LL')
      // 月的结束时间
      const timeEnd = moment(date).endOf('month').format('LL')
      this.dateRange1 = [timeStar, timeEnd]
      // 把时间参数传到父组件
      this.timeData.dateValue = this.dateValue
      this.timeData.dateRange = this.dateRange1
      this.emitSuperior()
      return moment(date).format('L')
    },
    /**
     * 获取商品概况数据
     */
    getProdSurvey () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getProdSurvey'),
        method: 'get',
        params: this.$http.adornParams(
          {
            shopId: null,
            dateType: this.dateValue,
            startTime: this.dateRange1[0],
            endTime: this.dateRange1[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          // this.prodData.data = data.data
          // this.prodData.lastData = data.lastData
          // this.prodData.rate = data.rate
          this.dataListLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.base-section {
  padding: 15px 20px;
}
.time-header {
  .header-title {
    display: inline-block;
    margin-right: 10px;
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

