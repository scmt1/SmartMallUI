<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      header-cell-class-name="table-header"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="prodInfo" :label="$t('group.prodInfo')" fixed="left" width="300">
        <template slot-scope="scope">
          <div class="prod-info" @click="handleShowProdDetailPop(scope.row.prodId)">
            <div class="prod-img">
              <img :src="resourcesUrl + scope.row.prodUrl" width="60" height="60" />
            </div>
            <!-- <div class="prod-name-txt">{{scope.row.prodName}}</div>
            <div class="order-status">{{'￥ ' + scope.row.price}}</div>-->
            <div class="prod-info-text">
              <span class="name">
                {{scope.row.prodName}}
              </span>
              <span class="prod-price">{{'￥ ' + scope.row.price}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="expose" :label="$t('dataAnalysis.exposureTimes')" v-if="isVisible1" align="left" ></el-table-column>
      <el-table-column prop="exposePersonNum" :label="$t('dataAnalysis.exposurePeoples')" v-if="isVisible2" align="left" ></el-table-column>
      <el-table-column prop="addCartPerson" :label="$t('dataAnalysis.addCartNumbers')" v-if="isVisible3" align="left" ></el-table-column>
      <el-table-column prop="addCart" :label="$t('dataAnalysis.carNumbers')" v-if="isVisible4" align="left" ></el-table-column>
      <el-table-column prop="placeOrderPerson" :label="$t('dataAnalysis.placeOrderPerson')" v-if="isVisible5" align="left" ></el-table-column>
      <el-table-column prop="payPerson" :label="$t('dataAnalysis.paidNumbers')" v-if="isVisible6" align="left" ></el-table-column>
      <el-table-column prop="placeOrderNum" :label="$t('dataAnalysis.placeOrderNum')" v-if="isVisible7" align="left" ></el-table-column>
      <el-table-column prop="payNum" :label="$t('dataAnalysis.goodsPaid')" v-if="isVisible8" align="left" ></el-table-column>
      <el-table-column prop="placeOrderAmount" :label="$t('dataAnalysis.placeOrderAmount')" v-if="isVisible9" align="left" ></el-table-column>
      <el-table-column prop="payAmount" :label="$t('dataAnalysis.goodsPaidAmount')" v-if="isVisible10" align="left" ></el-table-column>
      <el-table-column prop="singleProdRate" :label="$t('dataAnalysis.unitConversionRate')" v-if="isVisible11" align="left" >
        <template slot-scope="scope">
          <span>{{scope.row.singleProdRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="refundNum" :label="$t('dataAnalysis.refundOrdersCounts')" v-if="isVisible12" align="left" ></el-table-column>
      <el-table-column prop="refundPerson" :label="$t('dataAnalysis.applyingForRefund')" v-if="isVisible13" align="left" ></el-table-column>
      <el-table-column prop="refundSuccessNum" :label="$t('dataAnalysis.refundedCounts')" v-if="isVisible14" align="left" ></el-table-column>
      <el-table-column prop="refundSuccessPerson" :label="$t('dataAnalysis.refundedSuccessCounts')" v-if="isVisible15" align="left" ></el-table-column>
      <el-table-column prop="refundSuccessAmount" :label="$t('dataAnalysis.successfulRefundAmount')" v-if="isVisible16" align="left" ></el-table-column>
      <el-table-column prop="refundSuccessRate" :label="$t('dataAnalysis.refundRate')" v-if="isVisible17" align="left" >
        <template slot-scope="scope">
          <span>{{scope.row.refundSuccessRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('remindPop.operation')">
        <template slot-scope="scope">
          <div class="default-btn text-btn" @click="handleClick(scope.row)"size="small">{{$t('dataAnalysis.trendChartAnalysis')}}</div>
          <!-- <el-button type="text" size="small">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="$t('dataAnalysis.naturalDiurnalTrendChart')" :visible.sync="trendVisible" width="40%">
      <!-- <el-divider></el-divider> -->
      <el-main v-loading="showLoading">
        <!-- 图表 -->
        <div class="realtime-chart-box" id="prod-survey" style="width:100%;height:300px"></div>
        <!-- /图表 -->
      </el-main>
    </el-dialog>

    <!-- 商品详情弹窗 -->
    <prod-detail v-if="prodDetailVisiable" ref="prodDetail" @handleHidePop="handleHidePop"> </prod-detail>
  </div>
</template>

<script>
import ProdDetail from './prod-detail-dialog'

export default {
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
  components: {
    ProdDetail
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      prodInfo: {},
      skuList: [],
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
      isVisible12: false,
      isVisible11: false,
      isVisible13: false,
      isVisible14: false,
      isVisible15: false,
      isVisible16: false,
      isVisible17: false,
      showLoading: false,
      prodDetailVisiable: false
    }
  },
  methods: {
    handleClick (row) {
      this.trendVisible = true
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
      this.isVisible1 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.exposureTimes'))
      this.isVisible2 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.exposurePeoples'))
      this.isVisible3 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.addCartNumbers'))
      this.isVisible4 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.carNumbers'))
      this.isVisible5 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.placeOrderPerson'))
      this.isVisible6 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paidNumbers'))
      this.isVisible7 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.placeOrderNum'))
      this.isVisible8 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.goodsPaid'))
      this.isVisible9 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.placeOrderAmount'))
      this.isVisible10 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.goodsPaidAmount'))
      this.isVisible11 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.unitConversionRate'))
      this.isVisible12 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.refundOrdersCounts'))
      this.isVisible13 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.applyingForRefund'))
      this.isVisible14 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.refundedCounts'))
      this.isVisible15 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.refundedSuccessCounts'))
      this.isVisible16 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.successfulRefundAmount'))
      this.isVisible17 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.refundRate'))
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
          data: [this.$i18n.t('dataAnalysis.pageviews'), this.$i18n.t('dataAnalysis.numberOfVisitors'), this.$i18n.t('dataAnalysis.paidNumbers'), this.$i18n.t('dataAnalysis.paidGoodsCounts')]
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
      this.dateArr = []
      this.seriesDataArr = []
      if (this.prodData.dateValue === 1 || this.prodData.dateValue === 4 || !this.prodData.dateValue) {
        let obj1 = this.initObj(this.$i18n.t('dataAnalysis.pageviews'))
        let obj2 = this.initObj(this.$i18n.t('dataAnalysis.numberOfVisitors'))
        let obj3 = this.initObj(this.$i18n.t('dataAnalysis.paidNumbers'))
        let obj4 = this.initObj(this.$i18n.t('dataAnalysis.paidGoodsCounts'))
        const curProd = this.prodData.data.find(el => el.prodId === prodId)
        const date = new Date()
        this.dateArr = ['' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()]
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
          url: this.$http.adornUrl('/platform/prodAnalysis/getSingleProdTrend'),
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
            let obj1 = this.initObj(this.$i18n.t('dataAnalysis.pageviews'))
            let obj2 = this.initObj(this.$i18n.t('dataAnalysis.numberOfVisitors'))
            let obj3 = this.initObj(this.$i18n.t('dataAnalysis.paidNumbers'))
            let obj4 = this.initObj(this.$i18n.t('dataAnalysis.paidGoodsCounts'))
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
      // obj.stack = '总量'
      obj.smooth = true
      obj.data = []
      return obj
    },
    /**
     * 展示商品详情
     * @param {Number} prodId 商品id
     */
    handleShowProdDetailPop (prodId) {
      this.prodDetailVisiable = true
      this.$nextTick(() => {
        this.$refs.prodDetail.init(prodId)
      })
    },
    /**
     * handleHidePop
     */
    handleHidePop () {
      this.prodDetailVisiable = false
    },
  }
}
</script>
<style scoped>
.prod-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.prod-info .prod-info-text {
  flex: 1;
  margin-left: auto;
  display: flex;
  flex-direction: column;
}

.prod-info .prod-info-text .name {
  margin-left: 10px;
  line-height: 20px;
  color: #606266;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.prod-info .prod-info-text .prod-price {
  margin-left: 10px;
  color: red;
  align-self: flex-start;
}
</style>
