<template>
  <div class="mod-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 数据 -->

    <!-- 实时概况板块 -->
    <div class="realtime-situation">
      <!-- 栏目标题行 -->
      <div class="new-page-title">
        <!-- 左边 -->
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{$t("dataAnalysis.commodityInsight")}}</span>
        </div>
        <!-- 右边             suffix-icon="el-icon-search" -->
        <div class="title-right">
          <el-input
            size="small"
            :placeholder="this.$i18n.t('dataAnalysis.searchProd')"
            v-model="prodName"
            @keyup.enter.native="searchHandle"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchHandle"></i>
          </el-input>
        </div>
      </div>
      <!-- /栏目标题行 -->
      <div></div>
      <!-- 商品概况列表 -->
      <div class="item-list">
        <el-form :inline="true" :model="dataForm" class="form-inline">
          <el-form-item :label="$t('dataAnalysis.grouping')+':'">
            <el-select
              style="width:120px;height: 15px;"
              size="mini"
              v-model="dataForm.group"
              @change="changeDataForm()"
              :placeholder="$t('dataAnalysis.activeArea')"
            >
              <el-option :label="$t('dataAnalysis.allGroup')" :value="0"></el-option>
              <el-option :label="$t('dataAnalysis.hideInList')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('brand.status')+':'">
            <el-select
              style="height: 15px;"
              size="mini"
              v-model="dataForm.status"
              @change="changeDataForm()"
              :placeholder="$t('dataAnalysis.activeArea')"
            >
              <el-option :label="$t('dataAnalysis.allStatus')" :value="0"></el-option>
              <el-option :label="$t('dataAnalysis.selling')" :value="1"></el-option>
              <el-option :label="$t('dataAnalysis.inTheWarehouse')" :value="2"></el-option>
              <el-option :label="$t('dataAnalysis.soldOut')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="title-right">
              <el-select
                v-model="dateValue"
                @change="setDateRange(dateValue)"
                style="height: 15px;"
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
            </div>
            <div class="title-picker">
              <el-date-picker
                size="mini"
                style="width: 150px;"
                v-if="dateValue === 4 "
                v-model="dateRange[0]"
                @change="handleRangeFour()"
                type="date"
                :placeholder="$t('dataAnalysis.selectDate')"
                :picker-options="PickerOptions"
              ></el-date-picker>
            </div>
            <div class="title-picker">
              <el-date-picker
                size="mini"
                style="width: 150px;"
                v-if="dateValue === 5 "
                v-model="preMonth"
                @change="handleMonth()"
                type="month"
                :placeholder="$t('dataAnalysis.selectMonth')"
                :picker-options="monthPickerOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <div class="export-btn">
          <el-button type="primary" v-if="isAuth('flow:prod:effect')" size="small" @click="exportFrom()">{{$t('order.export')}}</el-button>
        </div>
        <el-form :model="form" class="form-inline">
          <el-form-item :label="$t('dataAnalysis.saleIndicators')+':'">
            <el-checkbox-group v-model="form.saleIndex" :max="saleIndicatorsMax" @change="selectNumChange">
              <el-checkbox :label="$t('dataAnalysis.exposureTimes')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.exposurePeoples')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.addCartNumbers')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.carNumbers')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.placeOrderPerson')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.paidNumbers')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.placeOrderNum')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.goodsPaid')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.placeOrderAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.goodsPaidAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.unitConversionRate')" name="saleIndex"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('dataAnalysis.serviceIndicators')">
            <!-- :style="selectNum >= 8 ? 'pointer-events: none;' : ''" 设置不能点击 -->
            <el-checkbox-group v-model="form.serviceIndex" :max="serviceIndicatorsMax" @change="selectNumChange">
              <el-checkbox :label="$t('dataAnalysis.refundOrdersCounts')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.applyingForRefund')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundedCounts')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundedSuccessCounts')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.successfulRefundAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundRate')" name="saleIndex"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('dataAnalysis.serviceIndicators')" class="transparent-text">
            <div class="select-txt" style="color:#155bd4 !important;" id="maxSelectSpan">{{$t("dataAnalysis.upTo8")}}</div>
            <div class="select-txt">{{$t("dataAnalysis.selected")}} <span class="select-num-txt">{{selectNum}}</span>/{{$t("dataAnalysis.eightItems")}}</div>
          </el-form-item>
          <!-- <el-button @click="submitTest">测试</el-button> -->
        </el-form>
        <span></span>
      </div>
      <!-- /商品概况列表 -->
      <!-- 说明文字板块 -->
      <div class="title-text-info">
        <div>{{$t("dataAnalysis.descText1")}}{{$t("dataAnalysis.descText1Content")}}</div>
        <div>{{$t("dataAnalysis.descText2")}}</div>
      </div>
      <!-- /说明文字板块 -->
      <div class="prod-hid-txt">{{$t("dataAnalysis.hideTips")}}</div>
    </div>
    <!-- /实时概况板块 -->
    <!-- 整体看板 -->
    <div class="whole-plate">
      <!-- 图表 -->
      <prod-effect-table :prodData="prodData" style="width: 100%"></prod-effect-table>
      <!-- /图表 -->
      <!-- 分页 -->
      <el-pagination
        v-if="prodData.data.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[5, 10, 20, 30, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        style="margin-top: 15px"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
    </div>
    <!-- /整体看板 -->
  </div>
</template>

<script>
import ProdEffectTable from './prod-effect-table'
import { Debounce } from '@/utils/debounce'
import Big from 'big.js'
import moment from 'moment'
export default {
  data () {
    return {
      value: [0, 1],
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
      dateValue: 2,
      serviceIndicatorsMax: 8, // 服务指标最大可选
      saleIndicatorsMax: 8, // 销售指标最大可选
      PickerOptions: {
        disabledDate (time) {
          let date = moment().add(-1, 'days').startOf('day')
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
    this.setDateRange(2)
    // this.flushDateTime()
    // 初始选择3个默认数据项
    this.form.saleIndex = [
      this.$i18n.t('dataAnalysis.exposureTimes'),
      this.$i18n.t('dataAnalysis.exposurePeoples')
    ]
    this.form.serviceIndex = [
      this.$i18n.t('dataAnalysis.refundOrdersCounts')
    ]
    // this.getProdEffect(this.page)
    this.selectNumChange()
  },
  updated () {
    // this.getpayInfo()
  },
  components: {
    ProdEffectTable
  },
  watch: {
    'form.saleIndex' () {
      this.selectNum = this.form.serviceIndex.length + this.form.saleIndex.length
      this.prodData.form = this.form
      // console.log(this.form.saleIndex)
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.serviceIndex).concat(this.form.saleIndex)
      this.prodData.sumData = this.sumData
      // console.log(this.sumData)
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.prodData.form = this.form
      // this.getProdEffect(this.page)
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.serviceIndex).concat(this.form.saleIndex)
      this.prodData.sumData = this.sumData
      // console.log(this.sumData)
    }
  },
  methods: {
    /**
     * 刷新时间
     */
    flushDateTime () {
      const date = moment()
      this.nowDate = date.format('LL')
      this.dateRange1 = [moment(date).startOf('days').format('LL'), this.nowDate]
      this.prodData.dateRange1 = this.dateRange1
      this.getProdEffect(this.page)
    },
    /**
     * 1:今天 2: 近七天 3:近30天 4:昨天 5:自然月(前一个月如当前月为7月，自然月为6月)
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      this.prodData.dateValue = val
      if (val === 1) {
        startDay = 0
        endDay = 0
        this.dateRange1 = [moment().startOf('days').format('LL'), this.nowDate]
        this.prodData.dateRange1 = this.dateRange1
        this.getProdEffect(this.page)
        return
      } else if (val === 2) {
        startDay = -6
        endDay = 0
      } else if (val === 3) {
        startDay = -29
        endDay = 0
      } else if (val === 4) {
        startDay = 0
        endDay = 0
      } else if (val === 5) {
        this.preMonth = this.getPreMonth()
        return
      } else {
        return
      }
      const time = moment().add(-1, 'days')
      // 开始时间
      const startTime = moment(time).add(startDay, 'days')
      // 结束时间
      const endTime = moment(time).add(endDay, 'days')
      this.dateRange = [startTime.format('L'), endTime.format('L')]
      this.dateRange1 = [startTime.startOf('days').format('LL'), endTime.endOf('days').format('LL')]
      this.prodData.dateRange1 = this.dateRange1
      this.getProdEffect(this.page)
    },
    /**
     * 获取前一个月的时间
     */
    getPreMonth (date) {
      if (!date) {
        date = new Date()
      }
      // 月的开始时间
      var timeStar = moment(date).startOf('month')
      // 月的结束时间
      var timeEnd = moment(timeStar).endOf('month')
      this.dateRange1 = [timeStar.format('LL'), timeEnd.format('LL')]
      this.prodData.dateRange1 = this.dateRange1
      this.getProdEffect(this.page)
      return moment(date).format('L')
    },
    /**
     * 当dateRange == 4 监听dateRange[0]的变化
     */
    handleRangeFour () {
      var date = this.dateRange[0]
      if (date) {
        var d = moment(date).startOf('days')
        this.dateRange1 = [d.format('LL'), moment(d).endOf('days').format('LL')]
        this.prodData.dateRange1 = this.dateRange1
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
        this.prodData.dateRange1 = this.dateRange1
      }
      this.getProdEffect(this.page)
    },
    /**
     * 当dateRange == 5 监听dateRange[0]的变化
     */
    handleMonth () {
      if (this.preMonth) {
        this.getPreMonth(this.preMonth)
      } else {
        this.dateRange1 = ['1971-01-01 00:00:00', '1971-01-01 00:00:00']
        this.getProdEffect(this.page)
      }
    },
    /**
     * 获取商品概况数据
     */
    getProdEffect (page) {
      this.dataListLoading = true
      // 请求参数传给表格子组件
      let params = {}
      params.shopId = null
      params.dateType = this.dateValue
      params.group = this.dataForm.group
      params.status = this.dataForm.status
      params.prodName = this.prodName
      params.startTime = this.dateRange1[0]
      params.endTime = this.dateRange1[1]
      this.prodData.params = params
      this.$http({
        url: this.$http.adornUrl('/platform/prodAnalysis/getProdEffect'),
        method: 'get',
        params: this.$http.adornParams(
          {
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            shopId: null,
            dateType: this.dateValue,
            group: this.dataForm.group,
            status: this.dataForm.status,
            prodName: this.prodName,
            startTime: this.dateRange1[0],
            endTime: this.dateRange1[1]
          }
        )
      }).then(({ data }) => {
        if (data) {
          data.records.forEach(element => {
            if (element.singleProdRate > 0) {
              Big.DP = 2
              element.singleProdRate = new Big(element.singleProdRate).times(100).toFixed()
              element.refundSuccessRate = new Big(element.refundSuccessRate).times(100).toFixed()
            }
          })
          this.prodData.data = data.records
          this.page.total = data.total
          this.dataListLoading = false
        }
      })
    },
    /**
     * 搜索商品名称
     */
    searchHandle () {
      this.getProdEffect(this.page)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getProdEffect(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getProdEffect(this.page)
    },
    /**
     * 选择框改变
     */
    changeDataForm () {
      this.prodData.dataForm = this.dataForm
      this.getProdEffect(this.page)
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
    },
    // 导出
    exportFrom: Debounce(function () {
        const loading = this.$loading({
          lock: true,
          target: '.mod-home',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/platform/prodAnalysis/prodEffectExport'),
          method: 'get',
          params: this.$http.adornParams(
            {
              current: this.page.currentPage,
              size: this.page.pageSize,
              shopId: null,
              dateType: this.dateValue,
              group: this.dataForm.group,
              status: this.dataForm.status,
              prodName: this.prodName,
              startTime: this.dateRange1[0],
              endTime: this.dateRange1[1]
            }
          ),
          responseType: 'blob'
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('dataAnalysis.commodityInsight') +'.xlsx'

          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
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
    /**
     * 动态修改最大可选数
     */
    selectNumChange() {
      let num = 8 - (this.form.saleIndex.length + this.form.serviceIndex.length)
      if(num <= 0) {
        this.saleIndicatorsMax = this.form.saleIndex.length
        this.serviceIndicatorsMax = this.form.serviceIndex.length
      }else {
        this.saleIndicatorsMax = 8
        this.serviceIndicatorsMax = 8
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-home {
  // font-size: 1em;
  // line-height: 2em;
  // .strong {
  //   margin: 0;
  //   font-size: 17px;
  //   font-weight: bold;
  //   text-align: center;
  //   margin-bottom: 0.5em;
  // }
  // .content {
  //   font-size: 16px;
  //   padding: 0 30px;
  // }
  .transparent-text ::v-deep .el-form-item__label {
    color: transparent;
  }
  div ::v-deep .el-input__inner {
    border-radius: 3px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  // 栏目标题行
  .title-line {
    background: #f8f8f8;
    padding: 12px;
    font-size: 12px;
    line-height: 1em;
    display: flex;

  }
  .item-list {
    background: #F7F8FA;
    margin: 20px 0 20px;
    padding-top: 20px;
    padding-bottom: 10px;
    position: relative;
  }
  .form-inline {
    margin-left: 20px;
  }
  .title-text-info {
    background: rgba(246, 192, 35, 0.06);
    border: 1px solid #F6C023;
    padding: 18px;
  }
  .title-left {
    text-align: left;
    display: flex;
    align-items: center;
    width: 80%;
  }
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
    color: #999999;
    vertical-align: middle;
    vertical-align: middle;
  }

  .realtime {
    display: flex;
    margin-top: 40px;
    margin-left: 20px;
    padding: 0;
  }

  /**
  实时概况
   */
  .realtime-situation {
    // margin-bottom: 40px;
  }

  /**
  整体看板
   */
  .whole-plate {
    margin: 15px 0 30px;
    .related-income {
      margin: 30px 0 0 20px;
      display: flex;
      flex-wrap: wrap;
    }
    .related-income-item {
      flex: 1;
    }
    .item-tit {
      margin-bottom: 15px;
    }
    .item-num {
      height: 24px;
      line-height: 24px;
    }
    .item-num-price {
      font-size: 18px;
      font-weight: 700;
    }
    .item-num a {
      color: #155bd4;
      text-decoration: none;
    }
    .integral-plate {
      margin-top: 15px;
    }
  }

  /**
  退款看板
   */
  .refund-plate {
    //  上
    .refund-chart-box {
      display: flex;
      width: 100%;
      margin-top: 15px;
      .successed-refund,
      .refund-rate-box {
        display: flex;
        flex-direction: column;
        background: #fbfbfb;
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
      }
      .successed-refund {
        margin-right: 10px;
      }
      .refund-chart-msg {
        margin-bottom: 25px;
      }
      .msg-tit {
        font-size: 15px;
        margin-bottom: 15px;
      }
      .msg-price {
        margin: 6px 0;
        line-height: 26px;
        padding: 0;
        font-size: 24px;
        font-weight: bold;
        line-height: 1em;
      }
      .msg-txt-p {
        width: 146px;
      }
      .compare {
        color: #9b9b9b;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 5px;
      }
      .compare-left {
        margin-right: 10px;
        white-space: nowrap;
      }
    }
    // 下
    .ranking-box {
      margin-top: 10px;
      display: flex;
      width: 100%;
      .ranking-left,
      .ranking-right {
        display: flex;
        flex-direction: column;
        background: #fbfbfb;
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
      }
      .ranking-left {
        margin-right: 10px;
      }
      .ranking-title {
        font-weight: 700;
        color: #333;
        margin-bottom: 10px;
      }
      .table {
        width: 100%;
        border: none;
        tr {
          border: none;
          height: 3em;
          line-height: 3em;
          background: #fbfbfb;
        }
        td {
          border: none;
        }
        .table-tit-item {
          color: #999;
          text-align: left;
        }
        .rank {
          width: 15%;
        }
        .prod {
          width: 50%;
        }
        .ref {
          width: 20%;
        }
        .ranks {
          width: 12%;
        }
        .prods {
          width: 40%;
        }
        .refs {
          width: 10%;
        }
        .prop {
          width: 18%;
          // text-align: center;
        }
      }
      .no-data {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .title-text-info div {
    font-size: 12px;
    line-height: 18px;
    color: #666;
    &:first-child {
      margin-bottom: 12px;
    }
  }
  .select-txt:first-child {
    color: #155bd4;
  }
  .select-txt {
    font-size: 12px;
    color: #999999;
    display: inline-block;
  }
  .select-num-txt {
    color: #155BD4;
  }
  .prod-hid-txt {
    margin-top: 25px;
    font-size: 12px;
    color: #666666;
  }

  .export-btn {
    right: 10px;
  }
  ::v-deep .export-load {
    top: -50% !important;
  }
}

</style>
