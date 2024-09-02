<template>
  <!-- 页面分析 -->
  <!-- 头部时间 -->
  <div class="mod-page-effect">
    <!-- 商品概况列表 -->
    <div class="item-list">
      <el-form :inline="true" :model="dataForm">
        <!-- 头部统计时间栏start -->
        <el-form-item :label="$t('dataAnalysis.statisticalTime') + ':'">
          <div class="title-right">
            <el-select
              v-model="dateValue"
              @change="setDateRange(dateValue)"
              style="width:auto;"
              size="mini"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="title-time" v-if="dateValue === 4">{{this.nowDate}}</span>
            <button
              v-if="dateValue === 4"
              class="el-button el-button--text el-button--small"
              @click="flushDateTime"
            >{{$t('dataAnalysis.refresh')}}</button>

            <div v-if="dateValue === 1" class="title-picker">
              <el-date-picker
                size="mini"
                style="width: 150px;"
                v-model="preDay"
                @change="changeDay"
                type="date"
                :placeholder="$t('dataAnalysis.selectDate')"
                :picker-options="PickerOptions"
              ></el-date-picker>
            </div>
            <div v-if="dateValue === 2" class="title-picker">
              <el-date-picker
                size="mini"
                style="width: 230px;"
                v-model="preWeek"
                type="week"
                :format="`yyyy ${$t('dataAnalysis.the')} WW ${$t('dataAnalysis.week')}`"
                :placeholder="$t('dataAnalysis.selectWeek')"
                :picker-options="weekPickerOptions"
                @change="changeWeek"
              ></el-date-picker>
            </div>

            <div v-if="dateValue === 3" class="title-picker">
              <el-date-picker
                size="mini"
                style="width: 150px;"
                v-model="preMonth"
                type="month"
                :placeholder="$t('dataAnalysis.selectMonth')"
                :picker-options="monthPickerOptions"
                value-format="timestamp"
                @change="changeMonth"
              ></el-date-picker>
            </div>
            <span
              class="title-time"
              v-if="(dateValue === 5 || dateValue === 6 || dateValue === 2) && startTime && endTime"
            >{{startTime}} - {{endTime}}</span>
          </div>
        </el-form-item>
      </el-form>
      <!-- 头部统计时间栏end -->
    </div>

    <!-- 导航栏切换start -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="nav-box">
      <el-tab-pane :label="$t('dataAnalysis.microPageAnalysis')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('dataAnalysis.businessPageAnalysis')" name="2"></el-tab-pane>
    </el-tabs>
    <!-- end -->

    <!-- 页面详情列表 -->
    <div class="flow-form">
      <el-form :model="form">
        <el-form-item :label="$t('dataAnalysis.pageBrowsing') + ':'">
          <el-checkbox-group v-model="form.saleIndex">
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.pageviews')" checked>
              <span>{{$t('dataAnalysis.pageviews')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.pageviewsTips')"
              >
                <i class="question-icon" slot="reference">?</i>
                <!-- <i class="el-icon-question" slot="reference"></i> -->
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.numberOfVisitors')" checked>
              <span>{{$t('dataAnalysis.numberOfVisitors')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.visitorsTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.clicks')">
              <span>{{$t('dataAnalysis.clicks')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.clicksTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
              </el-tooltip>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.clicksVisitors')">
              <span>{{$t('dataAnalysis.clicksVisitors')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.clicksVisitorsTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.clicksRatio')">
              <span>{{$t('dataAnalysis.clicksRatio')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.clicksRatioTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.stayTime')">
              <span>{{$t('dataAnalysis.stayTime')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.stayTimeTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.shareTimes')">
              <span>{{$t('dataAnalysis.shareTimes')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.shareTimesTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.sharePeopleTimes')">
              <span>{{$t('dataAnalysis.sharePeopleTimes')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.sharePeopleTimesTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('dataAnalysis.guidingTransformation') + ':'">
          <el-checkbox-group v-model="form.serviceIndex">
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.gTOrderAmount')">
              <span>{{$t('dataAnalysis.gTOrderAmount')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.gTTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.gTNumber')">
              <span>{{$t('dataAnalysis.gTNumber')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.gTOrderTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.bAOC')">
              <span>{{$t('dataAnalysis.bAOC')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.bAOCTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.gtPA')">
              <span>{{$t('dataAnalysis.gtPA')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.gtPATips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.gPayNumber')">
              <span>{{$t('dataAnalysis.gPayNumber')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.gPayNumberTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
            <el-checkbox name="saleIndex" :label="$t('dataAnalysis.gVToP')">
              <span>{{$t('dataAnalysis.gVToP')}}</span>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="$t('dataAnalysis.gVToPTips')"
              >
                <i class="question-icon" slot="reference">?</i>
              </el-popover>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('dataAnalysis.guidingTransformation') + ':'" class="hide-label">
          <span id="maxSelectSpan">{{$t('dataAnalysis.upTo5')}}</span>
          <span class="form-inline-select">{{$t('dataAnalysis.selected')}} <span class="blue">{{selectNum}}</span> /{{$t('dataAnalysis.fiveItems')}}</span>
        </el-form-item>
      </el-form>
    </div>
    <!-- 单选框函数选择展示不同端数据 -->
    <div class="plat">
      <el-radio-group v-model="platValue" size="small" @change="radioChange">
        <el-radio-button label="0" class="plat-item">{{$t('date.a')}}</el-radio-button>
        <el-radio-button label="1" class="plat-item">pc</el-radio-button>
        <el-radio-button label="2" class="plat-item">h5</el-radio-button>
        <el-radio-button label="3" class="plat-item">{{$t('sysManagement.miniPrograms')}}</el-radio-button>
        <el-radio-button label="4" class="plat-item">{{$t('dataAnalysis.android')}}</el-radio-button>
        <el-radio-button label="5" class="plat-item">ios</el-radio-button>
      </el-radio-group>
    </div>
    <!-- /选择展示不同端数据 -->
    <!-- 整体看板 -->
    <div class="whole-plate">
      <!-- 图表 -->
      <page-analysis-table :prodData="prodData" :pageType="this.activeName" style="width: 100%" @sortData="sortData"></page-analysis-table>
      <!-- /图表 -->
    </div>
     <!-- 分页 -->
      <el-pagination
        v-if="prodData.data.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[5, 10, 20, 30, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
    <!-- /整体看板 -->
  </div>
</template>

<script>
import PageAnalysisTable from './page-analysis-table'
import moment from 'moment'
import Big from 'big.js'
export default {
  data () {
    return {
      sortType: 0,
      sort: 0,

      platValue: '0',
      activeName: '1',
      value: [0, 1],
      startTime: '',
      endTime: '',
      sumPayActualTotal: 0.00,
      dataForm: {
        group: 0,
        status: 0
      },
      form: {
        saleIndex: [], // 销售指标
        serviceIndex: [] // 服务指标
      },
      selectNum: 0, // 选择指标的数量
      sumData: [],
      prodName: null,
      prodData: {
        prodName: null, // 商品名称
        dateValue: 4, // 时间的选择
        dateRange1: null, // 时间区间
        dataForm: {
          group: null,
          status: null
        }, // 筛选信息
        form: {
          saleIndex: [''], // 销售指标
          serviceIndex: [''] // 服务指标
        }, // 指标选择信息
        sumData: [], // 所有指标
        data: [], // 数据
        params: {
          shopId: null,
          dateType: 1,
          group: 0,
          status: 0,
          prodName: null,
          startTime: null,
          endTime: null
        }
      }, // 商品 概况列表
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5 // 每页显示多少条
      },
      isMaxSelectSpanVisible: false,
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
      // 对可选日进行判断
      PickerOptions: {
        disabledDate (time) {
          let date = moment().add(-1, 'days').startOf('days').valueOf()
          return (
            time.getTime() > date   //  之后不可选
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
          let month1 = moment().startOf('month').valueOf()
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
        }
      ],
      dateRange: [],
      preDay: '',
      preWeek: '',
      preMonth: '', // 前一个月
      dateRange1: [], // 时间选择范围
      timeValue: '',
      start: ''
    }
  },
  mounted () {
    // this.setDate()
    // 初始化
    this.dateValue = 5
    let date = new Date()
    this.endTime = moment(date).add(-1, 'days').startOf('days').format('L')
    this.startTime = moment(date).add(-7, 'days').startOf('days').format('L')
    this.start = 0
    this.sizeChangeHandle()
  },
  updated () {

  },
  components: {
    PageAnalysisTable
  },
  watch: {
    'form.saleIndex' () {
      this.selectNum = this.form.serviceIndex.length + this.form.saleIndex.length
      this.prodData.form = this.form

      this.sumData = []
      this.sumData = this.sumData.concat(this.form.serviceIndex).concat(this.form.saleIndex)
      this.prodData.sumData = this.sumData
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 5) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
        if (this.selectNum < 5) {
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 5) {
        this.textShare(span, 'black')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.prodData.form = this.form

      this.sumData = []
      this.sumData = this.sumData.concat(this.form.serviceIndex).concat(this.form.saleIndex)
      this.prodData.sumData = this.sumData

      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 5) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
        if (this.selectNum < 5) {
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 5) {
        this.textShare(span, 'black')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    }
  },
  methods: {
    /**
     * 刷新时间
     */
    flushDateTime () {
      var date = new Date()
      this.nowDate = moment(date).format('LL')
      this.dateRange1 = [moment(date).format('L') + ' 00:00:00', this.nowDate]
      this.prodData.dateRange1 = this.dateRange1
      this.sizeChangeHandle()
    },
    /**
     * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月
     * 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
     * 1、2、3需要传时间戳，4、5、6不需要
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      this.dateValue = val
      let date = new Date()
      if (val === 4) {
        startDay = 0
        endDay = 0
        this.flushDateTime()
        return
      } else if (val === 5) {
        this.endTime = moment(date).add(-1, 'days').endOf('days').format('L')
        this.startTime = moment(date).add(-7, 'days').startOf('days').format('L')
        startDay = -6
        endDay = 0
      } else if (val === 6) {
        this.endTime = moment(date).add(-1, 'days').endOf('days').format('L')
        this.startTime = moment(date).add(-30, 'days').startOf('days').format('L')
      } else if (val === 1) {
        this.preDay = moment().add(-1, 'days').format('L')
        startDay = 0
        endDay = 0
        this.start = moment(date).add(-1, 'days').valueOf()
      } else if (val === 3) {
        this.preMonth = moment().add(-1, 'month').valueOf()
        this.start = this.preMonth
      } else if (val === 2) {
        let week = moment().add(-1, 'week').startOf('week')
        this.preWeek = week
        this.start = week.valueOf()
        this.startTime = moment(week).format('L')
        this.endTime = moment(week).endOf('week').format('L')
        this.sizeChangeHandle()
        return
      }
      const time = moment().add(-1, 'days')
      // 开始时间
      var startTime = moment(time).add(startDay, 'days').startOf('days').format('L')
      // 结束时间
      var endTime = moment(time).add(endDay, 'days').startOf('days').format('L')
      this.dateRange = [startTime, endTime]
      this.sizeChangeHandle()
    },
    /**
     * 获取前一个月的时间
     */
    getPreMonth () {
      var d2 = moment().add(-1, 'month').startOf('month')
      var timeStar = d2.format('L')
      var timeEnd = d2.endOf('month').format('L')
      this.dateRange1 = [timeStar, timeEnd]
      this.prodData.dateRange1 = this.dateRange1
      this.getProdEffect(this.page)
    },
    changeDay () {
      this.start = this.preDay ? this.preDay.getTime() : null
      this.sizeChangeHandle()
    },
    changeWeek () {
      this.start = this.preWeek ? this.preWeek.getTime() : null
      this.startTime = this.start ? moment(this.start).startOf('week').format('L') : ''
      this.endTime = this.start ? moment(this.start).endOf('week').format('L') : ''
      this.sizeChangeHandle()
    },
    changeMonth () {
      this.start = this.preMonth
      this.sizeChangeHandle()
    },
    /**
     * 获取商品概况数据
     */
    getProdEffect (page) {
      // this.dataListLoading = true
      // // 请求参数传给表格子组件
      this.$http({
        url: this.$http.adornUrl('/platform/flowPageAnalysis/page'),
        method: 'get',
        params: this.$http.adornParams(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
            systemType: this.platValue,  // 系统类型 0:全部 1:pc  2:h5  3:小程序 4:安卓  5:ios
            pageType: this.activeName,   // 1:页面统计数据  2:商品详情页数据
            start: this.start,
            timeType: this.dateValue,   // 1、2、3需要传时间戳，4、5、6不需要，1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天，自然周没有
            sort: this.sort, // 0默认；1降序；2升序
            sortType: this.sortType, // 0默认；1浏览量；2访客数; 3点击次数；4点击人数; 5分享访问次数；6分享访问人数；7引导下单金额；8引导下单人；9引导支付金额；10引导支付人数
          }
        )
      }).then(({ data }) => {
        this.prodData.data = data.records
        if (data) {
          data.records.forEach(element => {
            if (element.singleProdRate > 0) {
              Big.DP = 2
              element.singleProdRate = new Big(element.singleProdRate).times(100).toFixed()
            }
          })
          this.prodData.data = data.records
          this.page.total = data.total
          this.page.pageSize = data.size
          this.page.currentPage = data.current
          this.dataListLoading = false
        }
      })
    },

    // 列表排序回调
    sortData(sort,type) {
      this.sort = sort
      this.sortType = type
      // console.log(type)
      this.getProdEffect()
    },

    /**
    * 导航栏切换的响应函数
    */
    handleClick (tab, event) {
      // this.getProdEffect(this.page)
      this.sizeChangeHandle()
    },

    // 单选框切换的响应
    radioChange (val) {
      // this.getProdEffect(this.page)
      this.sizeChangeHandle()
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = !val ? this.page.pageSize : val
      this.page.currentPage = 1
      this.$forceUpdate()
      this.getProdEffect(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getProdEffect(this.page)
    },
    /**
     * 文字效果
     */
    textShare (div, color) {
      div.style.color = color
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-page-effect {
  .item-list {
    background: #f7f8fa;
    padding: 15px 20px;
    margin-bottom: 20px;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    .title-time {
      padding-left: 8px;
      color: #999;
    }
  }
  .flow-form {
    padding: 20px 20px;
    background: #f7f8fa;
    margin-bottom: 20px;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    ::v-deep .hide-label.el-form-item {
      .el-form-item__label {
        color: transparent;
      }
      .blue {
        color: #155bd4;
      }
    }
  }

  .whole-plate {
    margin-bottom: 20px;
  }

  .nav-box {
    ::v-deep .el-tabs__item.is-top {
      background: #F7F8FA;
      border-bottom: 1px solid #E4E7ED;
    }
    ::v-deep .el-tabs__item.is-top.is-active {
      background: #fff;
      border-bottom: 1px solid #fff;
    }
  }

  .flow-form {
    ::v-deep .el-checkbox__label {
      line-height: 14px;
    }
    .question-icon {
      display: inline-block;
      font-size: 13px;
      padding: 0 4px;
      line-height: 15px;
      color: #fff;
      background: #C8C9CC;
      border-radius: 50%;
      font-style: normal;
      font-weight: normal;
    }
  }

  .plat {
    .plat-item.el-radio-button {
      ::v-deep .el-radio-button__inner {
        width: 80px;
        text-align: center;
        padding: 0;
        height: 32px;
        line-height: 32px;
      }
    }
    ::v-deep .plat-item.el-radio-button:first-child,
    ::v-deep .plat-item.el-radio-button:last-child {
      .el-radio-button__inner {
        border-radius: 0;
      }
    }
    .plat-item.is-active {
      ::v-deep .el-radio-button__inner {
        color: #155bd4;
        background-color: rgba(21,91,212, .1);
      }
    }
  }

}
</style>
