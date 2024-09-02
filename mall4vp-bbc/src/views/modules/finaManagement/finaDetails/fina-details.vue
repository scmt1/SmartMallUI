<template>
  <div class="mod-fina-details">
    <!-- <div class="header">
      <h3>{{$t('finaManage.finaDeta')}}</h3>
    </div> -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" size="small">
        <div class="input-row">
          <!-- 订单编号 -->
          <el-form-item :label="$t('order.number') + ':'">
            <el-input v-model="orderId" :placeholder="$t('finaManage.pleEntOrderNum')"></el-input>
          </el-form-item>
          <!--支付方式 -->
          <el-form-item :label="$t('order.paymentMethod') + ':'">
            <el-select
              v-model="paymentMethodValue"
              @change="setPaymentMethodRange(paymentMethodValue)"
              >
                <el-option
                  v-for="item in paymentMethodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>
          <!-- 交易时间 -->
          <el-form-item :label="$t('finaManage.transactionHour') + ':'" class="date-range-param">
            <el-select
              class="date-picker-type"
              v-model="datePickerType"
              @change="setdatePickerType(datePickerType)"
              >
                <el-option
                  v-for="item in datePickerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            <el-date-picker
              v-model="dateRangeParam"
              :type="datePickerType"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :range-separator="$t('date.tip')"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')">
            </el-date-picker>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <div class="primary-btn default-btn" @click="queryData">{{$t('order.query')}}</div>
            <div class="default-btn" @click="resetData">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" v-if="isAuth('finance:detail:excel')">
          <a v-on:click="exportFrom()">{{$t('order.exportForm')}}</a>
        </div>
      </div>
      <div class="table-con">
        <el-table header-cell-class-name="table-header" row-class-name="table-row-low" :data="tableData" style="width: 99%">
          <!-- :render-header="renderHeadeTime" -->
          <el-table-column prop="transDate" width="160" :label="$t('finaManage.transactionHour')"></el-table-column>
          <!-- :render-header="renderHeadeThree" -->
          <el-table-column prop="orderNumber" width="170" :label="$t('order.number')"></el-table-column>
          <el-table-column prop="placeTime" width="160" :label="$t('order.createTime')"></el-table-column>
          <el-table-column prop="prodName" :label="$t('order.transactionSummary')"></el-table-column>
          <el-table-column prop="shopName" :label="$t('order.occurrenceChannel')"></el-table-column>
          <el-table-column prop="userName" :label="$t('order.fundingChangeApplicant')"></el-table-column>
          <el-table-column prop="bizPayNo" :label="$t('order.payPlatformTransactionTicketNumber')">
            <template slot-scope="scope">
              {{scope.row.bizPayNo ? scope.row.bizPayNo : '-'}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="orderId" :label="$t('order.payPlatformTransactionTicketNumber')"></el-table-column> -->
          <el-table-column prop="bizType" :label="$t('order.businessType')">
            <template slot-scope="scope">
              <span>
                {{
                  [
                    '',
                    $t("order.orderPaymentS"),
                    $t("order.orderRefunds"),
                    $t("order.balanceTopUp"),
                    $t("order.purchaseMembership")
                  ][scope.row.bizType]
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payType" :label="$t('order.paymentMethod')"></el-table-column>
          <el-table-column prop="transAmount" :label="$t('order.amountIncomeAndExpenditure')"></el-table-column>
          <!-- <el-table-column prop="orderId" :label="$t('order.accountBalance')"></el-table-column> -->
          <!-- <el-table-column prop="incPayType" :label="$t('shop.ioType')"></el-table-column> -->
          <!-- <el-table-column prop="transAmount" :label="$t('finaManage.amountTrans')"></el-table-column> -->
        </el-table>
      </div>
      <el-pagination
        class="paging"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>
    </div>
   </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        storeId: -1,  // 门店切换数据
        dropDowmOptions: [
          {
            label: this.$i18n.t('date.a'),
            value: -1
          }
        ],
        oddValue: '1',  // 单号查询数据
        oddNumbers: [
          {
            label: this.$i18n.t('order.number'),
            value: '1'
          }
        ],
        orderId: '',  // 单号输入

        dateRange: [], // 展示的时间参数
        dateRangeParam: [moment().add(-6, 'days').startOf('day').format('YYYY-MM-DD'), moment().endOf('day').format('YYYY-MM-DD')],
        timeRange: '',
        startTime: '',
        endTime: '',
        dateValue: 1, //  时间栏默认选中
        paymentMethodValue: -1,
        dateOptions: [
          {
            label: this.$i18n.t('user.lastSevenDay'),
            value: 1
          },
          {
            label: this.$i18n.t('user.lastThirtyDay'),
            value: 2
          },
          {
            label: this.$i18n.t('user.customRange'),
            value: 3
          }
        ],
        datePickerTypeOptions: [
          {
            label: this.$i18n.t('date.daterange'),
            value: 'daterange'
          },
          {
            label: this.$i18n.t('date.monthrange'),
            value: 'monthrange'
          }
        ],
        paymentMethodOptions: [
          {
            label: this.$i18n.t('tip.select'),
            value: -1
          },
          {
            label: this.$i18n.t('order.pointsPayment'),
            value: 0
          },
          {
            label: this.$i18n.t('order.wecProPay'),
            value: 1
          },
          {
            label: this.$i18n.t('platform.aliPay'),
            value: 2
          },
          {
            label: this.$i18n.t('order.wechatScanCodePayment'),
            value: 3
          },
          {
            label: this.$i18n.t('order.wechatH5Payment'),
            value: 4
          },
          {
            label: this.$i18n.t('order.weclAccountPay'),
            value: 5
          },
          {
            label: this.$i18n.t('order.alipayH5Payment'),
            value: 6
          },
          {
            label: this.$i18n.t('order.alipayAPPPayment'),
            value: 7
          },
          {
            label: this.$i18n.t('order.wechatAPPPayment'),
            value: 8
          },
          {
            label: this.$i18n.t('order.balancePayment'),
            value: 9
          },
          {
            label: this.$i18n.t('order.payPalPayment'),
            value: 10
          }
        ],
        datePickerType: 'daterange', // 日期筛选类型
        isFilter: false, //  筛选按钮判断
        finaData: '', //  财务数据

        incPayType: 0,  //  筛选条件
        radio2: '1',
        radio3: '1',
        radio4: '1',
        payType: -1, // 当前选中的支付方式 -1表示不限
        payTypeList: [this.$i18n.t('order.pointsPayment'), this.$i18n.t('platform.weChatPay'), this.$i18n.t('platform.aliPay'), this.$i18n.t('order.wechatScanCodePayment'), this.$i18n.t('order.wechatH5Payment'), this.$i18n.t('order.weclAccountPay'), this.$i18n.t('order.alipayH5Payment'), this.$i18n.t('order.alipayAPPPayment'), this.$i18n.t('order.wechatAPPPayment'), this.$i18n.t('order.balancePayment'), this.$i18n.t('order.payPalPayment')], // 所有支付方式
        minAmount: null, // 交易金额
        maxAmount: null,

        tableData: [
          { transDate: null, orderId: null, incPayType: null, payType: null, transAmount: null }
        ],  //  表格数据

        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageTotal: 0, // 一共多少条数据

        tempFormData: null
      }
    },
    watch: {
      /**
       * 关闭筛选则修改为默认值
       */
      // isFilter (val) {
      //   if (!val) {
      //     this.incPayType = 0
      //     this.minAmount = null
      //     this.maxAmount = null
      //     this.payType = -1
      //   }
      // },
      dateRangeParam: {
        handler (newValue, oldValue) {
          this.getFinaDetailsData()
        },
        deep: true
      },
      // storeId (val) {
      //   this.getFinaDetailsData()
      // }
    },
    mounted () {
      // this.getShopList()
      // this.setDateRange(1)
      this.getFinaDetailsData()
    },
    methods: {
      queryData() {
        this.currentPage = 1
        this.getFinaDetailsData()
      },
      // 点击查询
      getFinaDetailsData () {
        // if(!this.dateRangeParam) return
        this.tempFormData = Object.assign({
          startTime: this.dateRangeParam ? this.dateRangeParam[0] + ' 00:00:00' : '',
          endTime: this.dateRangeParam ? this.dateRangeParam[1] + ' 23:59:59' : '',
          // stationId: this.storeId,
          orderNumber: this.orderId,
          payType: this.payType,
          // incPayType: this.incPayType,
          // minAmount: this.minAmount,
          // maxAmount: this.maxAmount,
          current: this.currentPage,
          size: this.pageSize
        })
        this.$http({
          url: this.$http.adornUrl('/platform/financialManagement/getFinanceDetail'),
          method: 'get',
          params: this.$http.adornParams({
            ...this.tempFormData
          })
        }).then(({ data }) => {
          // console.log(data)
          this.tableData = data.records
          // 将支付类型（int）转中文（str）
          this.tableData.forEach(element => {
            element.payType = this.payTypeList[element.payType]
            if (element.incPayType === '1') {
              element.incPayType = this.$i18n.t('shop.income')
            } else {
              element.incPayType = this.$i18n.t('shop.pay')
            }
          })
          this.currentPage = data.current
          this.pageSize = data.size
          this.pageTotal = data.total
        })
      },
      // 清空
      resetData () {
        this.orderId = null
        this.payType = -1
        this.incPayType = 0
        this.maxAmount = null
        this.minAmount = null
        this.paymentMethodValue = -1
        this.dateRangeParam = null
      },

      exportFrom () {
        if(!this.dateRangeParam) {
          this.$message.warning(this.$t('tip.select') + this.$t('finaManage.transactionHour'))
          return
        }
        const loading = this.$loading({
          lock: true,
          target: '.main-container',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/platform/financialManagement/getFinanceDetailForm'),
          method: 'get',
          params: this.$http.adornParams({
            ...this.tempFormData
          }),
          responseType: 'blob'
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          let fileName = this.$i18n.t('finaManage.finaDeta')
          if (this.dateRangeParam[0] !== this.dateRangeParam[1]) {
            fileName = fileName + '(' + this.dateRangeParam[0] +
            ' ' + this.$i18n.t('date.tip') + ' ' +
            this.dateRangeParam[1] + ')'
          }else {
            fileName = fileName + `(${this.dateRangeParam[0]})`
          }
          fileName = fileName + '.xlsx'

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
        }).catch((e) => {
          loading.close()
        })
      },
      // 1-3:最近7天、最近30天、自定义时间
      setDateRange (val) {
        var startDay = null
        var endDay = null
        this.dateValue = val
        if (val === 1) {
          startDay = -7
          endDay = -1
        } else if (val === 2) {
          startDay = -30
          endDay = -1
        } else if (val === 3) {
          startDay = -2
          endDay = 0
        } else {
          return
        }
        // 开始时间
        let startTime = moment().add(startDay, 'days').startOf('days')

        // 结束时间
        let endTime = moment().add(endDay, 'days').endOf('days')
        this.startTime = startTime.format('L')
        this.endTime = endTime.format('L')
        // this.dateRange = [this.startTime, this.endTime]
        this.dateRangeParam = [this.startTime, this.endTime]
      },
      // 0：积分支付  1：微信小程序支付  2：支付宝 3：微信扫码支付  4：微信H5支付  5：微信公众号支付 6：支付宝H5支付  7：支付宝APP支付  8：微信App支付  9：用户余额支付  10：PayPal支付
      setPaymentMethodRange (val) {
        this.payType = val
        this.getFinaDetailsData()
      },
      setdatePickerType (val) {
        this.currentPage = 1
        this.datePickerType = val
      },
      // 为表格头标题添加小图标并hover后出现提示信息
      renderHeadeTime (h, { column, $index }) {
        // h 是一个渲染函数       column 是一个对象表示当前列      $index 第几列
        return h('div', [
          h('span', column.label + '  ', {
            align: 'center'
          }),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',    // 一般 icon 处可添加浮层说明，浮层位置等属性
                width: '240',
                trigger: 'hover'
              }
            },
            [
              h('p', this.$i18n.t('finaManage.succOrFailTime'), {
                class: 'text-align: center; margin: 0'
              }),
              h('i', {                            // 生成 i 标签 ，添加icon 设置 样式，slot 必填
                class: 'el-icon-question',
                style: 'color:#ccc,margin:18px',
                slot: 'reference'
              })
            ]
          )
        ])
      },
      renderHeadeThree (h, { column, $index }) {
        return h('div', [
          h('span', column.label + '  ', {
            align: 'center'
          }),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',
                width: '240',
                trigger: 'hover'
              }
            },
            [
              h('p', this.$i18n.t('finaManage.twoOrderNum'), {
                class: 'text-align: center; margin: 0'
              }),
              h('i', {
                class: 'el-icon-question',
                style: 'color:#ccc,margin:18px',
                slot: 'reference'
              })
            ]
          )
        ])
      },
      // 页数的切换
      handleSizeChange (val) {
        this.pageSize = val
        this.tempFormData.size = val
        this.getFinaDetailsData()
      },
      //  换页
      handleCurrentChange (val) {
        this.currentPage = val
        this.tempFormData.current = val
        // this.tempFormData.size
        this.getFinaDetailsData()
      },
      getShopList () {
        this.$http({
          url: this.$http.adornUrl(`/platform/financialManagement/getStation`),
          method: 'get',
          params: this.$http.adornParams({
            shopId: null
          })
        }).then(({data}) => {
          if (data) {
            for (let i = 0; i < data.length; i++) {
              this.dropDowmOptions.push({
                label: data[i].stationName,
                value: data[i].stationId
              })
            }
            // this.dropDowmOptions.push({
            //   label: this.$i18n.t('prodList.other'),
            //   value: -2
            // })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mod-fina-details {
    .time-text {
      padding-left: 10px;
      color: #999;
    }
    .default-btn {
      a {
        text-decoration: none;
        color: unset;
      }
    }
  }
  .date-picker-type {
    width: 120px !important;
  }
  ::v-deep .date-picker-type .el-input--suffix {
    width: 120px !important;
  }
  ::v-deep .el-range-separator {
    width: 18px;
  }
  ::v-deep .el-date-editor--daterange {
    width: 300px !important;
  }

  ::v-deep .date-range-param .el-form-item__label:before {
    color: #F56C6C;
    margin-right: 4px;
    content: '*';
  }
  .productImg-label .el-upload--picture-card i {
    position: absolute;
    top: 39%;
    left: 37%;
  }
</style>

