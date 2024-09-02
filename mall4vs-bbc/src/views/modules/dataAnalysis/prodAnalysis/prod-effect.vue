<template>
  <div class="mod-prod-effect">
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
          <span class="text">{{$t("menuList.commodityInsight")}}</span>
        </div>
        <!-- 右边             suffix-icon="el-icon-search" -->
        <div class="title-right">
          <el-input
            size="small"
            style="width: 200px"
            :placeholder="this.$i18n.t('dataAnaly.pleasToSearch')"
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
        <el-form :inline="true" :model="dataForm" size="mini">
          <el-form-item :label="this.$i18n.t('dataAnaly.grouping') + ':'">
            <el-select
              style="width:120px;height: 15px;"
              v-model="dataForm.group"
              @change="changeDataForm()"
              :placeholder="this.$i18n.t('dataAnaly.activityArea')"
            >
              <el-option :label="this.$i18n.t('dataAnaly.groupAll')" :value="0"></el-option>
              <el-option :label="this.$i18n.t('dataAnaly.hiddenFromList')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('product.status') + ':'">
            <el-select
              style="width:100px;height: 15px;"
              v-model="dataForm.status"
              @change="changeDataForm()"
              :placeholder="this.$i18n.t('dataAnaly.activityArea')"
            >
              <el-option :label="this.$i18n.t('dataAnaly.allStatus')" :value="0"></el-option>
              <el-option :label="this.$i18n.t('dataAnaly.onSale')" :value="1"></el-option>
              <el-option :label="this.$i18n.t('dataAnaly.inTheWarehouse')" :value="2"></el-option>
              <el-option :label="this.$i18n.t('dataAnaly.soldOut')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="title-right">
              <el-select
                v-model="dateValue"
                @change="setDateRange(dateValue)"
                style="width:100px;height: 15px;"
              >
                <el-option
                  v-for="item in dateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span class="title-time" v-if="dateValue === 1">{{this.nowDate}}</span>
              <div
                v-if="dateValue === 1"
                @click="flushDateTime"
                class="default-btn text-btn"
              >{{$t("admin.refresh")}}</div>
              <span
                class="title-time"
                v-if="dateValue === 2 || dateValue === 3"
              >{{this.dateRange[0]}}{{$t("time.tip")}}{{this.dateRange[1]}}</span>
            </div>
            <div class="title-picker">
              <el-date-picker
                style="width: 150px;"
                v-if="dateValue === 4 "
                v-model="dateRange[0]"
                @change="handleRangeFour()"
                type="date"
                :placeholder="this.$i18n.t('admin.seleData')"
                :picker-options="PickerOptions"
              ></el-date-picker>
            </div>
            <div class="title-picker">
              <el-date-picker
                style="width: 150px;"
                v-if="dateValue === 5 "
                v-model="preMonth"
                type="month"
                @change="handleMonth"
                :placeholder="this.$i18n.t('dataAnaly.selectMonth')"
                :picker-options="monthPickerOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <el-form :model="form" size="mini">
          <el-form-item :label="this.$i18n.t('dataAnaly.salesIndex')">
            <el-checkbox-group v-model="form.saleIndex">
              <el-checkbox :label="this.$i18n.t('dataAnaly.impressions')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.exposure')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfAdditionalPurchases')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfCases')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.placeOrderPerson')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.payers')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.placeOrderNum')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfGoodsPaid')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.placeOrderAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.commodityPaymentAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.singleProductConversionRate')" name="saleIndex"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('dataAnaly.serviceIndex')">
            <!-- :style="selectNum >= 8 ? 'pointer-events: none;' : ''" 设置不能点击 -->
            <el-checkbox-group v-model="form.serviceIndex">
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfOrdersRequestedForRefund')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfPeopleApplyingForRefund')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfSuccessfullyRefundedOrders')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfSuccessfulRefunds')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.successfulRefundAmount')" name="saleIndex"></el-checkbox>
              <el-checkbox :label="this.$i18n.t('dataAnaly.refundRate')" name="saleIndex"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('dataAnaly.serviceIndex')" class="transparent-text">
            <div class="select-txt" style="color: #155BD4;" id="maxSelectSpan">{{$t("dataAnaly.chooseUpTo8Items")}}</div>
            <div class="select-txt">{{$t("dataAnaly.chosen")}} <span class="select-num-txt">{{selectNum}}</span>/8 {{$t("dataAnaly.indicators")}}</div>
          </el-form-item>
          <!-- <el-button @click="submitTest">测试</el-button> -->
          
        </el-form>
      </div>
      <!-- /商品概况列表 -->
      <!-- 说明文字板块 -->
      <div class="title-text-info">
        <div>{{$t("dataAnaly.orderTip3")}}{{$t("dataAnaly.orderTip4")}}</div>
        <div>{{$t("dataAnaly.orderTip5")}}</div>
      </div>
      <!-- /说明文字板块 -->
      <div class="prod-hid-txt">{{$t("dataAnaly.prodHid")}}</div>
    </div>
    <!-- /实时概况板块 -->
    
    <!-- 整体看板 -->
    <div class="whole-plate">
      <!-- 图表 -->
      <prod-effect-table :prodData="prodData" style="width: 100%; margin-bottom: 20px"></prod-effect-table>
      <!-- /图表 -->
      <!-- 分页 -->
      <el-pagination
        v-if="prodData.data.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
    </div>
    <!-- /整体看板 -->
  </div>
</template>

<script>
  import ProdEffectTable from './prod-effect-table'
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
          pageSize: 10 // 每页显示多少条
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
            label: this.$i18n.t('dataAnaly.realTimeToday'),
            value: 1
          },
          {
            label: this.$i18n.t('dataAnaly.nearly7Days'),
            value: 2
          },
          {
            label: this.$i18n.t('dataAnaly.nearly30Days'),
            value: 3
          },
          {
            label: this.$i18n.t('dataAnaly.natureDay'),
            value: 4
          },
          {
            label: this.$i18n.t('dataAnaly.naturalMoon'),
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
        this.$i18n.t('dataAnaly.impressions'),
        this.$i18n.t('dataAnaly.exposure')
      ]
      this.form.serviceIndex = [
        this.$i18n.t('dataAnaly.numberOfOrdersRequestedForRefund')
      ]
      // this.getProdEffect(this.page)
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
        var checks = document.getElementsByName('saleIndex')
        // console.log(checks)
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
          this.textShare(span, 'black')
          checks.forEach(i => {
            i.removeAttribute('disabled')
          })
        }
      },
      'form.serviceIndex' () {
        this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
        this.prodData.form = this.form
        // this.getProdEffect(this.page)
        this.sumData = []
        this.sumData = this.sumData.concat(this.form.serviceIndex).concat(this.form.saleIndex)
        this.prodData.sumData = this.sumData
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
          startDay = -7
          endDay = -1
        } else if (val === 3) {
          startDay = -30
          endDay = -1
        } else if (val === 4) {
          startDay = 0
          endDay = 0
        } else if (val === 5) {
          this.preMonth = this.getPreMonth()
          return
        } else {
          return
        }
        // 开始时间
        const startTime = moment().add(startDay, 'days')
        // 结束时间
        const endTime = moment().add(endDay, 'days')
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
          url: this.$http.adornUrl('/multishop/prodAnalysis/getProdEffect'),
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
          this.prodData.data = data.records
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
      }
    }
  }
</script>

<style lang="scss" scoped>

  .mod-prod-effect {
    .item-list {
      background: #f7f8fa;
      margin-bottom: 20px;
      padding: 25px 20px;
      .el-form {
        .el-form-item.el-form-item--mini {
          margin-bottom: 14px;
        }
        .el-form-item.el-form-item--mini.transparent-text {
          margin-bottom: 0;
        }
        .transparent-text ::v-deep .el-form-item__label {
          color: transparent;
        }
      }
    }
    .title-text-info {
      background: rgba(246, 192, 35, 0.06);
      border: 1px solid #F6C023;
      padding: 18px;
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
      .default-btn.text-btn {
        font-size: 12px;
      }
    }
    .title-picker {
      display: inline;
    }
    .title-time {
      color: #666666;
      font-size: 12px;
      vertical-align: middle;
      padding: 0 12px;
    }

    /**
    整体看板
     */
    .whole-plate {
      margin: 15px 0 30px;
    }
  }
</style>

