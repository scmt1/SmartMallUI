<template>
  <div class="mod-coupon">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 数据 -->

    <!-- 第一部分 -->
    <div class="one">
      <!-- 栏目标题行 -->
      <div class="title-line">
        <!-- 左边 -->
        <div class="title-left">
          <p class="blue-vertical"></p>
          <span class="title-txt">{{$t('dataAnalysis.keyCoupon')}}</span>
        </div>
      </div>

      <!-- 第一部分指标表 -->
      <div class="one-table">
        <el-row>
          <el-col :span="12">
            <div class="grid-content dotted">
              <div class="number">{{yesterdayGetTimes}}</div>
              <div>{{$t('dataAnalysis.receiveTimes')}}</div>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="grid-content dotted">
              <div class="number">{{}}</div>
              <div>验证次数</div>
            </div>
          </el-col>-->
          <el-col :span="12">
            <div class="grid-content dotted">
              <div class="number">{{yesterdayUseTimes}}</div>
              <div>{{$t('dataAnalysis.miniMallUsedTimes')}}</div>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="grid-content">
              <div class="number">{{}}</div>
              <div>分享次数</div>
            </div>
          </el-col>-->
        </el-row>
      </div>
    </div>

    <!-- 第二部分 -->
    <div class="one">
      <!-- 栏目标题行 -->
      <div class="title-line">
        <!-- 左边 -->
        <div class="title-left">
          <p class="blue-vertical"></p>
          <span class="title-txt">{{$t('dataAnalysis.couponTrendChart')}}</span>
        </div>
      </div>

      <!-- 指标表 -->
      <div class="two-table" id="div-conpon-chart">
        <!-- 图表 -->
        <div class="integral-plate" id="coupon-chart" style="width:800px; height:300px;"></div>
        <!-- /图表 -->
      </div>
    </div>

    <!-- 第三部分 -->
    <div class="one">
      <!-- 栏目标题行 -->
      <div class="title-line">
        <!-- 左边 -->
        <div class="title-left">
          <p class="blue-vertical"></p>
          <span class="title-txt">{{$t("dataAnalysis.detailedData")}}</span>
        </div>
      </div>
      <div>
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <span>{{$t('dataAnalysis.pickUpTime')}}</span>
              <el-date-picker
                size="small"
                v-model="dateRange"
                type="daterange"
                range-separator="—"
                @change="changeDateRange"
                value-format="yyyy-MM-dd hh:MM:ss"
                :start-placeholder="this.$i18n.t('date.start')"
                :end-placeholder="this.$i18n.t('date.end')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button :type="btnType === 1 ? 'primary' :''" size="small" @click="setDateRange(1)">{{
                  $t("date.t")
                }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :type="btnType === 2  ? 'primary' :''" size="small" @click="setDateRange(2)">{{
                  $t("date.y")
                }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :type="btnType === 3  ? 'primary' :''" size="small" @click="setDateRange(3)">{{
                  $t("date.n")
                }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :type="btnType === 4  ? 'primary' :''" size="small" @click="setDateRange(4)">{{
                  $t("dataAnalysis.nearly30")
                }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 指标表 -->
      <div class="three-table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="couponName" :label="this.$i18n.t('marketing.couponName')"></el-table-column>
          <el-table-column prop="couponType" :label="this.$i18n.t('coupon.couponType')">
            <template slot-scope="{row}">
              <el-tag v-if="row.couponType === 1" type="success">{{$t("coupon.cashCoupon")}}</el-tag>
              <el-tag v-else-if="row.couponType === 2" type="warning">{{$t("coupon.discountVoucher")}}</el-tag>
              <el-tag v-else-if="row.couponType === 3" type="danger">{{$t("coupon.coinCertificate")}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="takeNum" :label="this.$i18n.t('dataAnalysis.receiveTimes')"></el-table-column>
          <!-- <el-table-column prop="verifyNum" label="验证次数"></el-table-column> -->
          <el-table-column prop="useNum" :label="this.$i18n.t('dataAnalysis.miniMallUsedTimes')"></el-table-column>
          <!-- <el-table-column prop="shareNum" label="分享次数"></el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      formInline: {
        user: '',
        region: ''
      },
      value: [0, 1],
      yesterdayGetTimes: 0,
      yesterdayUseTimes: 0,
      dateRange: [],
      dateRangeParam: [],
      dateArr: [], // 趋势图时间数组
      seriesDataArr: [], // 所有数据
      // 第三部分
      tableData: [],
      btnType: 3
    }
  },
  mounted () {
    this.setDateRange(3)
    // this.setGraphicWidth()
    // this.getCouponAnalysis()
  },
  methods: {
    changeDateRange () {
      this.dateRangeParam = this.dateRange
      this.btnType = 5
      this.getCouponAnalysis()
      this.getCouponParam(this.page)
    },
    getCouponAnalysis () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getCouponAnalysis'),
        method: 'get',
        params: this.$http.adornParams(
          {
            dateType: 2,
            startTime: this.dateRangeParam[0],
            endTime: this.dateRangeParam[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          var da = data[data.length - 1]
          this.dateArr = []
          this.seriesDataArr = []
          let obj1 = this.initObj(this.$i18n.t('dataAnalysis.receiveTimes'))
          let obj2 = this.initObj(this.$i18n.t('dataAnalysis.miniMallUsedTimes'))
          data.forEach(i => {
            this.dateArr.push(i.currentDay)
            obj1.data.push(i.takeNum)
            obj2.data.push(i.useNum)
          })
          obj1.lineStyle = {
            color: '#F512DS'
          }
          this.seriesDataArr.push(obj2)
          this.seriesDataArr.push(obj1)
          this.yesterdayGetTimes = da.takeNum
          this.yesterdayUseTimes = da.useNum
          this.getCouponChart()
        }
      })
    },
    getCouponParam (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getCouponAnalysisParamByDate'),
        method: 'get',
        params: this.$http.adornParams(
          {
            'current': page.currentPage,
            'size': page.pageSize,
            dateType: 2,
            startTime: this.dateRangeParam[0],
            endTime: this.dateRangeParam[1]
          }
        )
      }).then(({ data }) => {
        this.tableData = data.records
        this.page.total = data.total
      })
    },
    /**
     * 获取父级的宽度
     */
    setGraphicWidth () {
      // var div = document.getElementById('div-conpon-chart')
      // console.log(div)
      // console.log(div.style.width)
      // var couponChart = document.getElementById('coupon-chart')
      // console.log(couponChart)
      // couponChart.style.width = div.offsetWidth
    },
    getCouponChart () {
      const myChart = this.$echarts.init(document.getElementById('coupon-chart'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.$i18n.t('dataAnalysis.receiveTimes'), this.$i18n.t('dataAnalysis.receiveTimes')]
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateArr,
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
        series: this.seriesDataArr
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 2: 近七天 3:近30天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      this.btnType = val
      var startDay = null
      var endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
        this.y = true
      } else if (val === 3) {
        startDay = -6
        endDay = 0
        this.n = true
      } else if (val === 4) {
        startDay = -29
        endDay = 0
        this.m = true
      } else {
        return
      }
      // 开始时间
      let startTime = moment().add(startDay, 'days').startOf('days')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days')
      this.dateRange = [startTime.format('L'), endTime.format('L')]
      this.dateRangeParam = [startTime.format('LL'), endTime.format('LL')]
      this.getCouponAnalysis()
      this.getCouponParam(this.page)
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      obj.stack = this.$i18n.t('home.totals')
      obj.smooth = true
      obj.data = []
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-coupon {
  // 栏目标题行
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    // font-size: 14px;
    // line-height: 1em;
    display: flex;
    margin: 20px 0;
  }
  .mod-home .blue-vertical {
    height: 1.5em;
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
  .one .one-table {
    height: 100px;
    width: 98%;
    margin: auto;
    border: 1px solid #e0dfdf;
    margin: 0 10px;
  }
  //第一部分表格
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 20px;
    text-align: center;
  }
  .grid-content div {
    padding: 8px;
    font-size: 14px;
    // border-right: #8f8e8e dotted 1px;
  }
  .dotted div {
    border-right: #8f8e8e dotted 1px;
  }
  .grid-content .number {
    font-weight: bold;
  }

  // 第二部分
  .two-table {
    padding-top: 20px;
    margin-bottom: 40px;
    width: 100%;
  }
  .integral-plate {
    margin-top: 15px;
  }

  // 第三部分
  .three-table {
    margin: 20px 0;
  }
}
</style>

