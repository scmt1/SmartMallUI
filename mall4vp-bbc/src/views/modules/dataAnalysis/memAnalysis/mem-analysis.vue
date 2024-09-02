<template>
  <!-- 会员分析 -->
  <div class="mem-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 数据 -->
    <!-- 头部统计时间 -->
    <div class="header">
      <dataTime ref="dataTime" />
    </div>

    <!-- 会员概览 -->
    <div class="analysis-item member-overview">
      <!-- 标题 -->
      <div class="analysis-item-title">
        {{$t('dataAnalysis.memberPcrofile')}}
      </div>
      <div class="plat">
        <el-radio-group v-model="radio1" size="small" @change="selectMemberSurvey">
          <el-radio-button :label="0" class="plat-item">{{$t('dataAnalysis.allMembers')}}</el-radio-button>
          <el-radio-button :label="1" class="plat-item">{{$t('dataAnalysis.freeMembers')}}</el-radio-button>
          <el-radio-button :label="2" class="plat-item">{{$t('dataAnalysis.payingMembers')}}</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 轮播图 -->
      <mem-analysis-overviewTwo @updateData="updateoneEchartIndex" :swiperLoading="swiperLoading" :data="overviewData" :compare-date="compareDate"></mem-analysis-overviewTwo>

      <!-- 会员概览数据 -->
      <div class="one-chart">
        <div class="charts-title">
          <div class="charts-title-item">
            <div class="line"></div>
            <span>{{ oneEchartCurrentName }}</span>
          </div>
        </div>
        <div id="one-echart" style="width:100%;height:300px;"></div>
      </div>
    </div>

    <!-- 会员人数趋势 -->
    <div class="analysis-item">
      <!-- 标题 -->
      <div class="analysis-item-title">
        {{$t('dataAnalysis.membershipTrends')}}
      </div>
      <!-- //第三部分选择按钮 -->
      <div class="plat">
        <el-radio-group v-model="radio3" size="small">
          <el-radio-button :label="1" class="plat-item">{{$t('dataAnalysis.freeMembers')}}</el-radio-button>
          <el-radio-button :label="2" class="plat-item">{{$t('dataAnalysis.payingMembers')}}</el-radio-button>
        </el-radio-group>
      </div>
      <!-- //第三部分数据图 -->
      <div class="three-chart">
        <div class="charts-title">
          <div class="charts-title-item">
            <div class="line"></div>
            <span>{{ $t('dataAnalysis.registerMember') }}</span>
          </div>
        </div>
        <div id="three-echart" style="width:100%;height:300px;"></div>
      </div>
      <div class="data-tips-con">
        <img src="~@/assets/img/data-tips.png">
        <div class="tips-con">
          <p class="tips-title">{{$t('dataAnalysis.dataAnalysisIdeas')}}</p>
          <p class="tips-content">{{$t('dataAnalysis.dataAnalysisContent')}}</p>
        </div>
      </div>
    </div>
    <!-- 会员占比趋势 -->
    <div class="analysis-item">
      <!-- 标题 -->
      <div class="analysis-item-title">
        {{$t('dataAnalysis.membershipRatioTrend')}}
      </div>
      <!-- //第四部分选择按钮 -->
      <div class="plat">
        <el-radio-group v-model="radio3" size="small">
          <el-radio-button :label="1" class="plat-item">{{$t('dataAnalysis.freeMembers')}}</el-radio-button>
          <el-radio-button :label="2" class="plat-item">{{$t('dataAnalysis.payingMembers')}}</el-radio-button>
        </el-radio-group>
      </div>
      <!-- //第四部分数据图 -->
      <div class="three-chart">
        <div class="charts-title">
          <div class="charts-title-item">
            <div class="line"></div>
            <span>{{ $t('dataAnalysis.registerMember') }}</span>
          </div>
        </div>
        <div id="four-echart" style="width:100%;height:300px;"></div>
      </div>
    </div>
    <!-- 会员贡献价值分析 -->
    <div class="analysis-item member-contributions">
      <!-- 标题 -->
      <div class="analysis-item-title">
        {{$t('dataAnalysis.valueAnalysisOfMemberContributions')}}
      </div>
      <!-- //第五部分多选标签栏 -->
      <div class="contributions-form">
        <el-form :model="form">
          <!-- :style="selectNum >= 8 || selectNum <=1 ? 'pointer-events: none;' : ''"
          实现了但最后一个时与超过8哥时不能再进行选择，但不能退选与继续进行多选
          在还没8个跟一个时则能继续反复选择-->
          <el-form-item :label="`${$t('dataAnalysis.basicIndicators')}:`">
            <el-checkbox-group v-model="form.saleIndex">
              <el-checkbox :label="$t('dataAnalysis.totalMembership')" name="saleIndex" checked></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.totalMembershipRatio')" name="saleIndex" checked></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="`${$t('dataAnalysis.clinchADealtheIndicators')}:`">
            <!-- :style="selectNum >= 8 ? 'pointer-events: none;' : ''" 设置不能点击，但已经选择的不能退选了？ -->
            <el-checkbox-group v-model="form.serviceIndex">
              <el-checkbox :label="`${$t('dataAnalysis.numberOfTradedMembers')}`" name="saleIndex" checked></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.tradedMembersRatio')}`" name="saleIndex" checked></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.payOrderQuantity')}`" name="saleIndex" checked></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.customerUnitPrice')}`" name="saleIndex"></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.paymentAmount')}`" name="saleIndex"></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.proportionOfPaymentAmount')}`" name="saleIndex"></el-checkbox>
              <el-checkbox :label="`${$t('dataAnalysis.perCapitaConsumptionFrequency')}`" name="saleIndex"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="`${$t('dataAnalysis.clinchADealtheIndicators')}:`" class="hide-label">
            <span id="maxSelectSpan">{{$t('dataAnalysis.upTo8')}}</span>
            <span class="form-inline-select">{{$t('dataAnalysis.selected')}} {{selectNum}}/{{$t('dataAnalysis.eightItems')}}</span>
          </el-form-item>
        </el-form>
      </div>
      <!-- //第五部分数据表 -->
      <!-- 如何实现响应展示 -->
      <div class="table-con border-table-con">
        <el-table :data="tableData5" style="width: 100%"
          header-cell-class-name="table-header"
          row-class-name="table-row-low">
          <el-table-column
            highlight-current-row="true"
            fixed
            prop="custType"
            :label="$t('dataAnalysis.customerType')"
            width="160"
          ></el-table-column>
          <el-table-column v-if="isVisible1" prop="totalMember" :label="$t('dataAnalysis.totalMembership')"></el-table-column>
          <el-table-column v-if="isVisible2" prop="totalMemberRate" :label="$t('dataAnalysis.totalMembershipRatio')"></el-table-column>
          <el-table-column v-if="isVisible3" prop="payMemberNum" :label="$t('dataAnalysis.numberOfTradedMembers')"></el-table-column>
          <el-table-column v-if="isVisible4" prop="payMemberNumRate" :label="$t('dataAnalysis.tradedMembersRatio')"></el-table-column>
          <el-table-column v-if="isVisible5" prop="payOrderNum" :label="$t('dataAnalysis.payOrderQuantity')"></el-table-column>
          <el-table-column v-if="isVisible6" prop="pricePerMember" :label="$t('dataAnalysis.customerUnitPrice')"></el-table-column>
          <el-table-column v-if="isVisible7" prop="payAmount" :label="$t('dataAnalysis.paymentAmount')"></el-table-column>
          <el-table-column v-if="isVisible8" prop="payAmountRate" :label="$t('dataAnalysis.proportionOfPaymentAmount')"></el-table-column>
          <el-table-column
            v-if="isVisible9"
            prop="frequencyOfConsume"
            :label="$t('dataAnalysis.perCapitaConsumptionFrequency')"
            width="120"
          ></el-table-column>
        </el-table>
      </div>
      <div class="data-tips-con five-text">
        <img src="~@/assets/img/data-tips.png">
        <div class="tips-con">
          <p class="tips-title">{{$t('dataAnalysis.dataAnalysisIdeas')}}</p>
          <p class="tips-content">
            {{$t('dataAnalysis.memberLevelDateText1')}}
            <a>
              <router-link to="/marketing-coupon/coupon">{{$t('dataAnalysis.coupon')}}</router-link>
            </a>
            {{$t('dataAnalysis.orConfig')}}
            <a>
              <router-link to="/user-score-growth-config">{{$t('dataAnalysis.memberTransactionsTask')}}</router-link>
            </a> {{$t('dataAnalysis.memberLevelDateText2')}}
          </p>
        </div>
      </div>
    </div>
    <!-- 新老会员成交分析 -->
    <div class="analysis-item">
      <!-- 标题 -->
      <div class="analysis-item-title">
        {{$t('dataAnalysis.transactionAnalysisOfNewAndOldMembers')}}
      </div>
      <!-- //第六部分选择标签栏 -->
      <!-- 一个默认选择按钮+一个多选按钮 -->
      <div class="six-checkbox">
        <span style="margin-right: 20px">{{$t('dataAnalysis.dataIndicators')}}</span>
        <el-checkbox v-model="checked1" disabled>{{$t('dataAnalysis.numerialNumber')}}</el-checkbox>
        <!--          <el-checkbox v-model="checked2">对比同期</el-checkbox>-->
      </div>
      <!-- //第六部分数据表 -->
      <div class="border-table-con">
        <el-table :data="tableData6" style="width: 100%;"
          header-cell-class-name="table-header"
          row-class-name="table-row-low">
          <el-table-column prop="type" :label="$t('dataAnalysis.memberType')" width="180"></el-table-column>
          <el-table-column prop="payMemberNum" :label="$t('dataAnalysis.numberOfTradedMembers')" width="180"></el-table-column>
          <el-table-column prop="payMemberNumRate" :label="$t('dataAnalysis.tradedMembersRatio')"></el-table-column>
          <el-table-column prop="payOrderNum" :label="$t('dataAnalysis.payOrderQuantity')"></el-table-column>
          <el-table-column prop="pricePerMember" :label="$t('dataAnalysis.customerUnitPrice')"></el-table-column>
          <el-table-column prop="payAmount" :label="$t('dataAnalysis.paymentAmount')"></el-table-column>
          <el-table-column prop="payAmountRate" :label="$t('dataAnalysis.proportionOfPaymentAmount')"></el-table-column>
        </el-table>
      </div>
      <!-- 第六部分单选按钮 -->
      <div class="six-radio">
        <span>{{$t('dataAnalysis.trendIndicators') + ':'}}</span>
        <el-radio-group v-model="radio6B" style="margin-left: 15px;">
          <el-radio :label="0" class="plat-item">{{$t('dataAnalysis.numberOfTradedMembers')}}</el-radio>
          <el-radio :label="1" class="plat-item">{{$t('dataAnalysis.payOrderQuantity')}}</el-radio>
          <el-radio :label="2" class="plat-item">{{$t('dataAnalysis.customerUnitPrice')}}</el-radio>
          <el-radio :label="3" class="plat-item">{{$t('dataAnalysis.paymentAmount')}}</el-radio>
        </el-radio-group>
      </div>
      <!-- 第六部分相应上面单选按钮的Echart数据图 -->
      <div class="six-echart">
        <!-- 第六部分柱形数据图引入 -->
        <div class="charts-title">
          <div class="charts-title-item">
            <div class="line"></div>
            <span>{{ radio6BNewTitil }}</span>
          </div>
          <div class="charts-title-item">
            <div class="line" style="background: #7fdec1"></div>
            <span>{{ radio6BOldTitil }}</span>
          </div>
        </div>
        <div id="six-echart" style="width:100%;height:300px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import dataTime from '../dataTime'
// import memAnalysisOverview from './mem-analysis-overview'
import memAnalysisOverviewTwo from './mem-analysis-overviewTwo'

export default {
  data () {
    return {
      overviewData: {
        title: [this.$i18n.t('dataAnalysis.cumulativeNumberOfMembers'), this.$i18n.t('dataAnalysis.numberOfNewMembers'), this.$i18n.t('dataAnalysis.numberOfPaidMembers'), this.$i18n.t('dataAnalysis.numberOfCouponMembers'), this.$i18n.t('dataAnalysis.memberPaidAmount'), this.$i18n.t('dataAnalysis.numberOfMemberPaidOrders'), this.$i18n.t('dataAnalysis.memberCustomerUnitPrice')],
        num: [],
        rate: []
      },
      radio1: '0',
      radio2: 0,
      radio3: '1',
      radio6A: '[]',
      checked1: true,
      checked2: '',
      radio6B: 0,
      dataForm: {},
      dateType: 1,
      dateRange: null,
      nowActualTotal: [],
      dataArray: [],
      timeArray: [],
      nowDate: null,
      dataInfo: {},
      tableData5: [
        {
          custType: this.$i18n.t('dataAnalysis.allFreeGradeMembers')
        },
        {
          custType: this.$i18n.t('dataAnalysis.allPaidMembers')
        }],
      tableData6: [{
        type: this.$i18n.t('dataAnalysis.allTradedMember'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }, {
        type: this.$i18n.t('dataAnalysis.newTM'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }, {
        type: this.$i18n.t('dataAnalysis.oldTM'),
        payMemberNum: '0',
        payAmountRate: '100.00%',
        payAmount: '0.00',
        pricePerMember: '-',
        payMemberNumRate: '100.00%',
        payOrderNum: '0'
      }],
      form: {
        saleIndex: [], // 基础指标
        serviceIndex: [] // 成交指标
      },
      selectNum: 0, // 选择指标的数量
      sumData: [], // 所有指标
      prodName: null,
      oneEchartAllName: [], // 会员概览数据图下的所有名称
      oneEchartCurrentName: '', // 会员概览数据图下的所选中的名称
      radio3DataArray: [], // 第三部分会员人数趋势人数数据
      radio3RateDataArray: [], // 第三部分会员占比趋势人数数据
      radio3TimeArray: [], // 第三部分会员人数趋势时间数据
      trendDateArray: [], // 第六部分 新老会员成交分析 时间数据
      trendNewArray: [], // 第六部分 新老会员成交分析 新成交会员数据
      trendOldArray: [], // 第六部分 新老会员成交分析 老成交会员数据
      radio6BNewTitilArray: [this.$i18n.t('dataAnalysis.newTM'), this.$i18n.t('dataAnalysis.newTMNumbers'), this.$i18n.t('dataAnalysis.newTMPP'), this.$i18n.t('dataAnalysis.newTMPaidAmount')], // 第六部分 Echart新成交会员的标题名列表
      radio6BOldTitilArray: [this.$i18n.t('dataAnalysis.oldTM'), this.$i18n.t('dataAnalysis.oldTMNumbers'), this.$i18n.t('dataAnalysis.oldTMPP'), this.$i18n.t('dataAnalysis.newTMPaidAmount')], // 第六部分 Echart老成交会员的标题名列表
      radio6AllTitilArray: [],
      radio6BNewTitil: 0, // 第六部分 Echart新成交会员的标题名
      radio6BOldTitil: 0, // 第六部分 Echart老成交会员的标题名
      isVisible1: true,
      isVisible2: true,
      isVisible3: true,
      isVisible4: true,
      isVisible5: true,
      isVisible6: false,
      isVisible7: false,
      isVisible8: false,
      isVisible9: false,
      compareDate: this.$i18n.t('dataAnalysis.compareWithYesterday'),
      tempSixData: [],
      swiperLoading: false,
      oneEchartIndex: 0
    }
  },
  mounted () {
    this.init()
    // this.selectMemberSurvey()
    // this.getTwoData()
    this.updateThreeAndFourEchart()
    this.getFiveData()
    this.getSixData()
    this.getSixEchart()
  },
  components: {
    dataTime,
    // memAnalysisOverview
    memAnalysisOverviewTwo

  },
  watch: {
    dateRange (val) {
      this.compareCurrDate(this.dateType)
      this.selectMemberSurvey()
      this.updateThreeAndFourEchart()
      this.getFiveData()
      this.getSixData()
    },
    // 监听第二部分(先不统计会员的降级人数)
    // radio2 (val) {
    //   if (val === 1) {
    //     // 升级人数
    //   } else {
    //     // 降级人数 val===0
    //   }
    // },
    // 监听第六部分
    radio6B (val) {
      this.switchSixEchart(val)
    },
    // 第三部分切换会员监听
    radio3 (val) {
      this.updateThreeAndFourEchart()
    },
    // 第五部分的多选框监听
    // 统计与判断多选框的选择数量
    // 但这里没能实现默认与最少得有一个选择，以及判断选择的上限
    // 'form.saleIndex' () {
    //   this.selectNum = this.form.serviceIndex.length + this.form.saleIndex.length
    //   this.prodData.form = this.form
    //   this.getProdEffect(this.page)
    // },
    // 'form.serviceIndex' () {
    //   this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
    //   this.prodData.form = this.form
    //   this.getProdEffect(this.page)
    // }

    // 第五部分的最多项多选款监听
    'form.saleIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      // console.log(this.customIndexForm.prodSurvey)
      // sumData是用来存放点击选中的文本框信息
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      // console.log(this.sumData)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 8) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 8) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      // console.log(this.sumData)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 8) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 8) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },

    // 将存放的选择框数据调用函数来执行数据响应展示操作
    'sumData' () {
      this.changVisibles()
      // this.getRealTimechartData()
    }
  },

  methods: {
    compareCurrDate (type) {
      switch (type) {
        case 1:
          this.compareDate = this.$i18n.t('dataAnalysis.compareWithYesterday')
          break
        case 2:
          this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePrevious7Days')
          break
        case 3:
          this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePrevious30Days')
          break
        case 4:
          this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePreviousOneDay')
          break
        case 5:
          this.compareDate = this.$i18n.t('dataAnalysis.compareWithThePreviousAMonth')
          break
        default:
          this.compareDate = '-'
          break
      }
    },
    judgeStrArrIncludeOtherString (str) {
      var strArr = this.sumData
      return strArr.includes(str)
    },
    /**
     * 控制表格列显隐
     */
    changVisibles () {
      this.isVisible1 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.totalMembership'))
      this.isVisible2 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.totalMembershipRatio'))
      this.isVisible3 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.numberOfTradedMembers'))
      this.isVisible4 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.tradedMembersRatio'))
      this.isVisible5 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.payOrderQuantity'))
      this.isVisible6 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.customerUnitPrice'))
      this.isVisible7 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paymentAmount'))
      this.isVisible8 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.proportionOfPaymentAmount'))
      this.isVisible9 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.perCapitaConsumptionFrequency'))
    },
    // 初始化时先获取时间
    init () {
      this.dateType = this.$refs.dataTime.dateValue
      this.dateRange = this.$refs.dataTime.dateRange1
      this.changVisibles()
    },
    // 修改地步时间后刷新所有数据
    // updateAllDataByTime () {
    //   this.selectMemberSurvey()
    //   this.updateThreeAndFourEchart()
    //   this.getFiveData()
    //   this.getSixData()
    //   this.getSixEchart()
    // },
    // 第一部分会员概览切换
    selectMemberSurvey () {
      this.swiperLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getMemberSurvey'),
        method: 'get',
        params: this.$http.adornParams(
          {
            memberType: this.radio1,
            dateType: this.dateType,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          // 会员概览信息填充，少一个储值会员
          this.swiperLoading = false
          this.updateOneEchart(data.memberOverviewModelList, this.oneEchartIndex)
          this.overviewData.rate = [data.memberOverviewModel.totalMemberRate, data.memberOverviewModel.newMemberRate, data.memberOverviewModel.payMemberRate, data.memberOverviewModel.couponMemberRate, data.memberOverviewModel.memberPayAmountRate, data.memberOverviewModel.memberPayOrderRate, data.memberOverviewModel.memberSingleAmountRate]
          this.overviewData.num = [data.memberOverviewModel.totalMember, data.memberOverviewModel.newMember, data.memberOverviewModel.payMember, data.memberOverviewModel.couponMember, data.memberOverviewModel.memberPayAmount, data.memberOverviewModel.memberPayOrder, data.memberOverviewModel.memberSingleAmount]
        }
      })
    },
    // 获取第一部分Echart数据图
    getOneEchart () {
      const myChart = this.$echarts.init(document.getElementById('one-echart'), 'walden')
      const option = {
        color: ['#155bd4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
          // data: this.oneEchartAllName
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.timeArray,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '', // 会员数（人）
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E0E6F1'],
                width: 1,
                type: 'solid'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: this.oneEchartCurrentName,
            type: 'line',
            data: this.dataArray,
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#155bd4'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                 0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(0, 88, 255, 0.2)'},
                    {offset: 1, color: 'rgba(255, 255, 255, 0)'}
                  ]
                )
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    updateoneEchartIndex (index) {
      this.oneEchartIndex = index
      this.updateOneEchart(this.dataForm, index)
    },
    // 更新第一部分Echart数据图的数据
    updateOneEchart (data, echartType) {
      this.dataForm = data
      this.timeArray = []
      this.dataArray = []
      // 通过判断传入的类型来填充不同数据
      switch (echartType) {
        case 0:
          for (var j = 0, len = this.dataForm.length; j < len; j++) {
            this.timeArray.push(this.dataForm[j].currentDay)
            this.dataArray.push(this.dataForm[j].totalMember)
          }
          break
        case 1:
          for (var j2 = 0, len2 = this.dataForm.length; j2 < len2; j2++) {
            this.timeArray.push(this.dataForm[j2].currentDay)
            this.dataArray.push(this.dataForm[j2].newMember)
          }
          break
        case 2:
          for (var j3 = 0, len3 = this.dataForm.length; j3 < len3; j3++) {
            this.timeArray.push(this.dataForm[j3].currentDay)
            this.dataArray.push(this.dataForm[j3].payMember)
          }
          break
        case 3:
          for (var j4 = 0, len4 = this.dataForm.length; j4 < len4; j4++) {
            this.timeArray.push(this.dataForm[j4].currentDay)
            this.dataArray.push(this.dataForm[j4].couponMember)
          }
          break
        case 4:
          for (var j5 = 0, len5 = this.dataForm.length; j5 < len5; j5++) {
            this.timeArray.push(this.dataForm[j5].currentDay)
            this.dataArray.push(this.dataForm[j5].memberPayAmount)
          }
          break
        case 5:
          for (var j6 = 0, len6 = this.dataForm.length; j6 < len6; j6++) {
            this.timeArray.push(this.dataForm[j6].currentDay)
            this.dataArray.push(this.dataForm[j6].memberPayOrder)
          }
          break
        case 6:
          for (var j7 = 0, len7 = this.dataForm.length; j7 < len7; j7++) {
            this.timeArray.push(this.dataForm[j7].currentDay)
            this.dataArray.push(this.dataForm[j7].memberSingleAmount)
          }
          break

        default:
          for (var j0 = 0, len0 = this.dataForm.length; j0 < len0; j0++) {
            this.timeArray.push(this.dataForm[j0].currentDay)
            this.dataArray.push(this.dataForm[j0].totalMember)
          }
          break
      }
      for (let i = 0; i < this.timeArray.length; i++) {
        this.timeArray[i] = this.formatDate(this.timeArray[i])
      }
      this.getOneEchart()
    },
    // 获取第二部分的数据(先不统计会员的降级人数)
    /** getTwoData () {
    this.$http({
      url: this.$http.adornUrl('/platform/customerAnalysis/getGrowthMember'),
      method: 'get',
      params: this.$http.adornParams({
        growthType: this.radio2,
        dateType: this.dateType,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      })
    }).then(({ data }) => {
    })
  }, */
    // 获取第三部分Echart数据图
    getThreeEchart () {
      const myChart = this.$echarts.init(document.getElementById('three-echart'), 'walden')
      const option = {
        color: ['#155bd4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.radio3TimeArray,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$i18n.t('dataAnalysis.memberNum')
          }
        ],
        series: [
          {
            name: this.$i18n.t('dataAnalysis.registerMember'),
            type: 'bar',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#155bd4',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#155bd4'
              }
            },
            barWidth: 20,
            data: this.radio3DataArray
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 获取第四部分Echart数据图
    getFourEchart () {
      const myChart = this.$echarts.init(document.getElementById('four-echart'), 'walden')
      const option = {
        color: ['#155bd4'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            return `<div class="tooltip-con">
                      <div>${params[0].axisValue}</div>
                      <span class="dot"></span>
                      <span class="name">${params[0].seriesName}<span>
                      <span class="value">${params[0].data}%</span>
                      <div style="clear:both"></div>
                    </div>`
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.radio3TimeArray,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#E0E6F1'],
                width: 1,
                type: 'solid'
              }
            },
            name: this.$i18n.t('dataAnalysis.memberNumPercentage')
          }
        ],
        series: [
          {
            name: this.$i18n.t('dataAnalysis.registerMember'),
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#155bd4',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#155bd4'
              }
            },
            barWidth: 20,
            data: this.radio3RateDataArray
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 更新第三、第四部分Echart数据图
    updateThreeAndFourEchart () {
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/getMemberTrend'),
        method: 'get',
        params: this.$http.adornParams({
          memberType: this.radio3,
          dateType: this.dateType,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        })
      }).then(({ data }) => {
        if (data) {
          this.radio3DataArray = []
          this.radio3RateDataArray = []
          this.radio3TimeArray = []
          for (let i = 0; i < data.length; i++) {
            data[i].currentDay = this.formatDate(data[i].currentDay)
            this.radio3TimeArray.push(data[i].currentDay)
            this.radio3DataArray.push(data[i].memberNum)
            this.radio3RateDataArray.push((data[i].memberNumRate * 100).toFixed(2))
          }
          this.getThreeEchart()
          this.getFourEchart()
        }
      })
    },

    // 获取第五部分的表格数据
    getFiveData () {
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getMemberContributeValue'),
        method: 'get',
        params: this.$http.adornParams({
          dateType: this.dateType,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        })
      }).then(({ data }) => {
        if (data) {
          data.publicMember.custType = this.tableData5[0].custType
          data.paidMember.custType = this.tableData5[1].custType
          this.tableData5 = []
          this.tableData5.push(data.publicMember)
          this.tableData5.push(data.paidMember)

          this.tableData5.forEach(i => {
            i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
            i.totalMemberRate = (i.totalMemberRate * 100).toFixed(2) + '%'
          })
        }
      })
    },
    // 获取第六部分的数据图
    getSixEchart () {
      this.radio6AllTitilArray = this.radio6BNewTitilArray.concat(this.radio6BOldTitilArray)
      const myChart = this.$echarts.init(document.getElementById('six-echart'), 'walden')
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.trendDateArray,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: ''
          }
        ],
        series: [
          {
            name: this.radio6BNewTitil,
            type: 'bar',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#155bd4',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#155bd4'
              }
            },
            barWidth: 20,
            data: this.trendNewArray
          },
          {
            name: this.radio6BOldTitil,
            type: 'bar',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#7fdec1',
                barBorderRadius: [15, 15, 0, 0]
              },
              emphasis: {
                color: '#7fdec1'
              }
            },
            barWidth: 20,
            data: this.trendOldArray
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 获取第六部分的数据
    getSixData () {
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getMemberDeal'),
        method: 'get',
        params: this.$http.adornParams({
          dateType: this.dateType,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        })
      }).then(({ data }) => {
        if (data) {
          // 第六部分表格数据填充
          data.allMember.type = this.tableData6[0].type
          data.newMember.type = this.tableData6[1].type
          data.oldMember.type = this.tableData6[2].type
          this.tableData6 = []
          this.tableData6.push(data.allMember)
          this.tableData6.push(data.newMember)
          this.tableData6.push(data.oldMember)

          this.tableData6.forEach(i => {
            i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
            i.payAmountRate = (i.payAmountRate * 100).toFixed(2) + '%'
          })

          for (let i = 0; i < data.trendParam.length; i++) {
            data.trendParam[i].currentDay = this.formatDate(data.trendParam[i].currentDay)
          }
          this.tempSixData = data.trendParam
          this.switchSixEchart(this.radio6B)
        }
      })
    },
    // 第六部分Echart图切换选项
    switchSixEchart (trendType) {
      var myData = this.tempSixData
      this.trendDateArray = []
      this.trendNewArray = []
      this.trendOldArray = []
      this.radio6BNewTitil = this.radio6BNewTitilArray[trendType]
      this.radio6BOldTitil = this.radio6BOldTitilArray[trendType]
      switch (trendType) {
        case 0:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayMemberNum
            this.trendOldArray[i] = myData[i].oldPayMemberNum
          }
          break
        case 1:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayOrderNum
            this.trendOldArray[i] = myData[i].oldPayOrderNum
          }
          break
        case 2:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPricePerMember
            this.trendOldArray[i] = myData[i].oldPricePerMember
          }
          break
        case 3:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayAmount
            this.trendOldArray[i] = myData[i].oldPayAmount
          }
          break

        default:
          for (let i = 0; i < myData.length; i++) {
            this.trendDateArray[i] = myData[i].currentDay
            this.trendNewArray[i] = myData[i].newPayMemberNum
            this.trendOldArray[i] = myData[i].oldPayMemberNum
          }
          break
      }

      this.getSixEchart()
    },
    /**
     * 格式化时间
     */
    formatDate: function (date) {
      var tempDate = date + ''
      return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
    },
    /**
     * 文字效果
     */
    textShare (div, color) {
      // 文字跳动
      // var timer = null
      // var i = 0
      // clearInterval(timer)
      // timer = setInterval(function () {
      //   div.style.display = i++ % 2 ? 'none' : 'block'
      //   i > 6 && (clearInterval(timer))
      // }, 80)
      div.style.color = color
    }
  }
}
</script>

<style lang="scss">
.mem-home {
  // 公共样式
  .analysis-item {
    margin: 80px 0 20px 0;
    .analysis-item-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      position: relative;
      &::before {
        content: '';
        display: block;
        height: 20px;
        width: calc(100% + 40px);
        position: absolute;
        background: #F1F4F5;
        top: -50px;
        left: -20px;
        z-index: 9;
      }
    }
    .plat {
      .plat-item.el-radio-button {
        .el-radio-button__inner {
          border-radius: 0;
          background: #FFF;
        }
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #155bd4;
      }
      .plat-item.is-active {
        .el-radio-button__inner {
          color: #155bd4;
          background-color: rgba(21,91,212, .1);
        }
      }
    }
  }



  .table-con {
    margin: 20px 0;
  }

  .border-table-con {
    border: 1px solid #eee;
    border-bottom: none;
  }

  .charts-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .charts-title-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999;
      .line {
        width: 18px;
        height: 8px;
        opacity: 1;
        border-radius: 8px;
        margin-right: 10px;
        background: #155bd4;
      }
      span {
        margin-right: 20px;
      }
    }
  }

  .data-tips-con {
    display: flex;
    align-items: center;
    background: #f7f8fa;
    padding: 24px 20px;
    img {
      height: 52px;
      width: 52px;
      margin-right: 20px;
    }
    .tips-con {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 52px;
      .tips-title {
        font-size: 16px;
      }
      .tips-content {
        font-size: 14px;
        color: #666;
      }
    }
  }

 

  // 会员概览
  .member-overview {
    margin-top: 30px;
    .analysis-item-title::before {
      display: none;
    }
  }

  // 会员贡献价值分析
  .member-contributions {
    .contributions-form {
      background-color: #f7f8fa;
      padding: 30px 20px;
      .el-form-item {
        margin-bottom: 0;
      }
      .hide-label {
        .el-form-item__label {
          color: transparent;
        }
      }
    }
  }

  .header {
    padding: 15px 20px;
    margin-bottom: 20px;
    background: #f7f8fa;
  }


  //第三部分
  .three-chart {
    width: 100%;
    height: 360px;
    margin: auto;
    padding: 4px;
    padding-top: 20px;
  }

  
  .six-checkbox {
    margin-bottom: 20px;
  }
  .six-radio {
    margin: 20px 0;
  }

  // 自定义图表的图示框样式
  .tooltip-con {
    // display: flex;
    // justify-content: space-between;
    .dot {
      display: inline-block;
      margin-right: 4px;
      border-radius: 10px;
      width: 10px;
      height: 10px;
      background-color: #155bd4;
    }
    .name {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin-left: 2px;
    }
    .value {
      float: right;
      margin-left: 20px;
      font-size: 14px;
      color: #666;
      font-weight: 900;
    }
  }
}
</style>

