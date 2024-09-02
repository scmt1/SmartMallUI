<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="prodInfo" :label="this.$i18n.t('temp.prodInfo')" fixed="left" min-width="350">
        <template slot-scope="scope">
          <div class="prod-image">
                <prod-pic
                height="60"
                width="60"
                :pic="scope.row.prodUrl"
              ></prod-pic>
              
            <span class="name">
              <span class="prod-name">{{scope.row.prodName}}</span>
              <span class="prod-price">{{'￥ ' + scope.row.price}}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="expose" :label="this.$i18n.t('dataAnaly.impressions')" v-if="isVisible1" sortable></el-table-column>
      <el-table-column prop="exposePersonNum" :label="this.$i18n.t('dataAnaly.exposure')" v-if="isVisible2" sortable></el-table-column>
      <el-table-column prop="addCartPerson" :label="this.$i18n.t('dataAnaly.numberOfAdditionalPurchases')" v-if="isVisible3" ></el-table-column>
      <el-table-column prop="addCart" :label="this.$i18n.t('dataAnaly.numberOfCases')" v-if="isVisible4" ></el-table-column>
      <el-table-column prop="placeOrderPerson" :label="this.$i18n.t('dataAnaly.placeOrderPerson')" v-if="isVisible5" ></el-table-column>
      <el-table-column prop="payPerson" :label="this.$i18n.t('dataAnaly.payers')" v-if="isVisible6" ></el-table-column>
      <el-table-column prop="placeOrderNum" :label="this.$i18n.t('dataAnaly.placeOrderNum')" v-if="isVisible7" ></el-table-column>
      <el-table-column prop="payNum" :label="this.$i18n.t('dataAnaly.numberOfGoodsPaid')" v-if="isVisible8" ></el-table-column>
      <el-table-column prop="placeOrderAmount" :label="this.$i18n.t('dataAnaly.placeOrderAmount')" v-if="isVisible9" ></el-table-column>
      <el-table-column prop="payAmount" :label="this.$i18n.t('dataAnaly.commodityPaymentAmount')" v-if="isVisible10" ></el-table-column>
      <el-table-column prop="singleProdRate" :label="this.$i18n.t('dataAnaly.singleProductConversionRate')" v-if="isVisible11" >
        <template slot-scope="scope">
          <span>{{scope.row.singleProdRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="refundNum" :label="this.$i18n.t('dataAnaly.numberOfOrdersRequestedForRefund')" v-if="isVisible12" sortable min-width="160"></el-table-column>
      <el-table-column prop="refundPerson" :label="this.$i18n.t('dataAnaly.numberOfPeopleApplyingForRefund')" v-if="isVisible13" ></el-table-column>
      <el-table-column prop="refundSuccessNum" :label="this.$i18n.t('dataAnaly.numberOfSuccessfullyRefundedOrders')" v-if="isVisible14" ></el-table-column>
      <el-table-column prop="refundSuccessPerson" :label="this.$i18n.t('dataAnaly.numberOfSuccessfulRefunds')" v-if="isVisible15" ></el-table-column>
      <el-table-column prop="refundSuccessAmount" :label="this.$i18n.t('dataAnaly.successfulRefundAmount')" v-if="isVisible16" ></el-table-column>
      <el-table-column prop="refundSuccessRate" :label="this.$i18n.t('dataAnaly.refundRate')" v-if="isVisible17" >
        <template slot-scope="scope">
          <span>{{scope.row.refundSuccessRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" min-width="120" :label="this.$i18n.t('text.menu')" align="center">
        <template slot-scope="scope">
          <div @click="handleClick(scope.row)" class="default-btn text-btn">{{$t("dataAnaly.trendAnalysis")}}</div>
          <!-- <el-button type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="this.$i18n.t('dataAnaly.naturalDailyTrendChart')" :visible.sync="trendVisible" width="40%">
      <!-- <el-divider></el-divider> -->
      <el-main v-loading="showLoading">
        <!-- 图表 -->
        <div class="realtime-chart-box" id="prod-survey" style="width:100%;height:300px"></div>
        <!-- /图表 -->
      </el-main>
    </el-dialog>
  </div>
</template>

<script>
import ProdPic from '@/components/prod-pic'
export default {
  components: {
    ProdPic
  },
  props: {
    prodData: {
      type: Object,
      default: null
    }
  },
  watch: {
    prodData: {
      handler (newValue, oldValue) {
        // console.log(newValue)
        this.tableData = newValue.data
        this.sumData = newValue.sumData
        this.changVisibles()
      },
      deep: true
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      trendVisible: false, // 单个商品趋势弹窗
      tableData: this.prodData.data,
      sumData: this.prodData.sumData,
      params: this.prodData.params,
      dateArr: [564, 324, 234, 123], // 趋势图时间数组
      seriesDataArr: [], // 趋势图数据
      isVisible1: false,
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      isVisible5: false,
      isVisible6: false,
      isVisible7: false,
      isVisible8: false,
      isVisible9: false,
      isVisible10: false,
      isVisible11: false,
      isVisible12: false,
      isVisible13: false,
      isVisible14: false,
      isVisible15: false,
      isVisible16: false,
      isVisible17: false,
      showLoading: false
    }
  },
  methods: {
    handleClick (row) {
      this.trendVisible = true
      // console.log(row)
      this.showLoading = true
      this.singleProdTrendData(row.prodId)
    },
    judgeStrArrIncludeOtherString (str) {
      var strArr = this.sumData
      return strArr.includes(str)
    },
    /**
     * 控制表格列显隐
     */
    changVisibles () {
      this.isVisible1 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.impressions'))
      this.isVisible2 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.exposure'))
      this.isVisible3 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfAdditionalPurchases'))
      this.isVisible4 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfCases'))
      this.isVisible5 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.placeOrderPerson'))
      this.isVisible6 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.payers'))
      this.isVisible7 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.placeOrderNum'))
      this.isVisible8 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfGoodsPaid'))
      this.isVisible9 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.placeOrderAmount'))
      this.isVisible10 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.commodityPaymentAmount'))
      this.isVisible11 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.singleProductConversionRate'))
      this.isVisible12 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfOrdersRequestedForRefund'))
      this.isVisible13 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfPeopleApplyingForRefund'))
      this.isVisible14 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfSuccessfullyRefundedOrders'))
      this.isVisible15 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.numberOfSuccessfulRefunds'))
      this.isVisible16 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnaly.successfulRefundAmount'))
      this.isVisible17 = this.judgeStrArrIncludeOtherString(this.$i18n.t('home.refundRate'))
    },
    /**
     * 单个商品的趋势图
     */
    getRealTimechartData () {
      const myChart = this.$echarts.init(document.getElementById('prod-survey'), 'walden')
      myChart.clear()
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.$i18n.t('dataAnaly.pageviews'), this.$i18n.t('dataAnaly.numberOfVisitors'), this.$i18n.t('dataAnaly.numberOfPayments'), this.$i18n.t('dataAnaly.numberOfPaymentProducts')]
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
      myChart.setOption(option, true)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      this.$nextTick(() => {
        this.showLoading = false
      })
    },
    /**
     * 获取单个商品的趋势图数据
     */
    singleProdTrendData (prodId) {
      this.showLoading = true
      if (this.prodData.dateValue === 1 || this.prodData.dateValue === 4 || !this.prodData.dateValue) {
        const curProd = this.prodData.data.find(el => el.prodId === prodId)
        const date = new Date()
        this.dateArr = ['' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()]
        this.seriesDataArr = []
        let obj1 = this.initObj(this.$i18n.t('dataAnaly.pageviews'))
        let obj2 = this.initObj(this.$i18n.t('dataAnaly.numberOfVisitors'))
        let obj3 = this.initObj(this.$i18n.t('dataAnaly.numberOfPayments'))
        let obj4 = this.initObj(this.$i18n.t('dataAnaly.numberOfPaymentProducts'))
        obj1.data.push(curProd.expose)
        obj2.data.push(curProd.exposePersonNum)
        obj3.data.push(curProd.payPerson)
        obj4.data.push(curProd.payNum)
        this.seriesDataArr.push(obj1)
        this.seriesDataArr.push(obj2)
        this.seriesDataArr.push(obj3)
        this.seriesDataArr.push(obj4)
        this.$nextTick(() => {
          this.getRealTimechartData()
        })
      } else {
        this.$http({
          url: this.$http.adornUrl('/multishop/prodAnalysis/getSingleProdTrend'),
          method: 'get',
          params: this.$http.adornParams(
            {
              prodId: prodId,
              shopId: null,
              dateType: this.prodData.params.dateValue,
              group: this.prodData.params.group,
              status: this.prodData.params.status,
              prodName: this.prodData.params.prodName,
              startTime: this.prodData.params.startTime,
              endTime: this.prodData.params.endTime
            }
        )
        }).then(({ data }) => {
          if (data) {
            this.dateArr = []
            this.seriesDataArr = []
            let obj1 = this.initObj(this.$i18n.t('dataAnaly.pageviews'))
            let obj2 = this.initObj(this.$i18n.t('dataAnaly.numberOfVisitors'))
            let obj3 = this.initObj(this.$i18n.t('dataAnaly.numberOfPayments'))
            let obj4 = this.initObj(this.$i18n.t('dataAnaly.numberOfPaymentProducts'))
            data.forEach(i => {
              this.dateArr.push(i.currentDay)
              obj1.data.push(i.browse)
              obj2.data.push(i.visitor)
              obj3.data.push(i.payPerson)
              obj4.data.push(i.payNum)
            })
            this.seriesDataArr.push(obj1)
            this.seriesDataArr.push(obj2)
            this.seriesDataArr.push(obj3)
            this.seriesDataArr.push(obj4)
            this.getRealTimechartData()
          }
        })
      }
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      // obj.stack = this.$i18n.t('home.totals')
      obj.smooth = true
      obj.data = []
      return obj
    }
  }
}
</script>
<style scoped>
.prod-pic{
  width: 60px;
  height: 60px;
}
.prod-image {
  width: 320px;
  display: flex;
  align-items: center;
}
.prod-image .name {
  width: 260px;
  margin-left: 10px;
  line-height: 20px;
  color: #606266;
}
.prod-image .name .prod-name{
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 20px;
}
.prod-price {
  color: red;
}
</style>
