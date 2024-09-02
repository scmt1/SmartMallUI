<template>
  <div class="time-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 头部统计时间数据栏 -->
    <!-- 用作组件引入需要的标题头 -->

    <!-- 提取可用 -->
    <!-- 但选择判断的数据有点问题，对判断的范围有问题 -->

    <div class="item-list">
      <el-form :inline="true" :model="dataForm" class="form-inline">
        <el-form-item :label="$t('dataAnalysis.statisticalTime') + ':'" style="margin-bottom: 0;">
          <div class="title-right">
            <el-select
              v-model="dateValue"
              @change="setDateRange(dateValue)"
              style="width:100px;"
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
            >{{this.dateRange[0]}} - {{this.dateRange[1]}}</span>
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
                type="month"
                :placeholder="$t('dataAnalysis.selectMonth')"
                @change="changeMonth()"
                :picker-options="monthPickerOptions"
              ></el-date-picker>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- /商品概况列表 -->
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      selectNum: 0, // 选择指标的数量
      prodName: null,
      dataForm: null,
      prodData: {
        prodName: null, // 商品名称
        dateValue: null, // 时间的选择
        dateRange1: null, // 时间区间
        dataForm: {
          group: null,
          status: null
        }, // 筛选信息
        form: {
          saleIndex: [''], // 销售指标
          serviceIndex: [''] // 服务指标
        }, // 指标选择信息
        data: [] // 数据
      }, // 商品 概况列表
      nowActualTotal: [],
      payYesterdayActualTotal: [],
      dataArray: [],
      timeArray: [],
      nowDate: null,
      dataInfo: {},
      rate: [],
      refundRateInfo: [],
      refundRankForActualTotal: [],
      refundRankForCause: [],
      dateValue: 1,
      PickerOptions: {
        disabledDate (time) {
          let date = moment().add(-1, 'days').startOf('days')
          return (
            time.getTime() > date.valueOf()
          )
        }
      },
      monthPickerOptions: {
        disabledDate (time) {
          let month1 = moment().startOf('month')
          return (
            time.getTime() > month1.valueOf()
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
      ],
      dateRange: [],
      preMonth: '', // 前一个月
      dateRange1: [] // 商品整体概况的时间选择范围
    }
  },
  mounted () {
    this.flushDateTime()
    // this.getProdEffect()
  },
  updated () {
    // this.getpayInfo()
  },
  components: {
  },
  watch: {
    dateRange1 (val) {
      this.$parent.dateType = this.dateValue
      this.$parent.dateRange = this.dateRange1
    },
    'form.saleIndex' () {
      this.selectNum = this.form.serviceIndex.length + this.form.saleIndex.length
      this.prodData.form = this.form
      // this.getProdEffect(this.page)
      // console.log(this.form.saleIndex)
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.prodData.form = this.form
      // this.getProdEffect(this.page)
    }
  },
  methods: {
    /**
     * 刷新时间
     */
    flushDateTime () {
      var date = new Date()
      this.nowDate = moment(date).format('LL')
      this.dateRange1 = [moment(date).startOf('days').format('LL'), this.nowDate]
      this.prodData.dateRange1 = this.dateRange1
      // this.getProdEffect(this.page)
    },
    /**
     * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      const date = new Date()
      var startDay = null
      var endDay = null
      this.prodData.dateValue = val
      if (val === 1) {
        startDay = 0
        endDay = 0
        this.dateRange1 = [moment().startOf('days').format('LL'), this.nowDate]
        this.prodData.dateRange1 = this.dateRange1
        // this.getProdEffect(this.page)
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
        this.preMonth = this.getPreMonth(moment().add(-1, 'month'))
        return
      } else {
        return
      }
      // 开始时间
      const startTime = moment(date).add(startDay, 'days').startOf('days')
      // 结束时间
      const endTime = moment(date).add(endDay, 'days').endOf('days')
      this.dateRange = [startTime.format('L'), endTime.format('L')]
      this.dateRange1 = [startTime.format('LL'), endTime.format('LL')]
      this.prodData.dateRange1 = this.dateRange1
      // this.getProdEffect(this.page)
    },
    changeMonth () {
      // 月的开始结束时间
      if (this.preMonth) {
        let date = moment(this.preMonth)
        let timeStar = moment(date).startOf('month').format('LL')
        let timeEnd = moment(date).endOf('month').format('LL')
        this.dateRange1 = [timeStar, timeEnd]
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      this.prodData.dateRange1 = this.dateRange1
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
      this.prodData.dateRange1 = this.dateRange1
      // this.getProdEffect(this.page)
      // console.log(this.dateRange1)
      return moment(date).format('L')
    },
    /**
     * 当dateRange == 4 监听dateRange[0]的变化
     */
    handleRangeFour () {
      if (this.dateRange[0]) {
        var start = moment(this.dateRange[0]).startOf('days')
        var end = moment(start).endOf('days')
        this.dateRange1 = [start.format('LL'), end.format('LL')]
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
      }
      this.prodData.dateRange1 = this.dateRange1
      // this.getProdEffect(this.page)
    },
    /**
     * 选择框改变
     */
    changeDataForm () {
      this.prodData.dataForm = this.dataForm
      // this.getProdEffect(this.page)
    }
  }
}
</script>

<style lang="scss">
.time-home {
  .title-right {
    text-align: right;
    display: inline;
    width: 20%;
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
  .title-txt {
    color: #000;
    font-weight: normal;
    margin-right: 1em;
    vertical-align: middle;
  }
  .title-time {
    padding-left: 8px;
    color: #999999;
  }
}
</style>

