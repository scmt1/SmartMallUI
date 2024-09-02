<template>
  <div class="store-billing">

    <div class="total-amount">
      <div class="item">
        <div class="pay-name">{{$t('shop.availableStoreBalance')}}
          <el-tooltip effect="dark" placement="right">
            <div slot="content" style="max-width:500px">{{$t('shopWallet.availableStoreBalancesTip')}}</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="pay-amount"> {{details.settledAmount}} </div>
        <!-- <div class="pay-percent">{{ details.wechatPercent | percent }}%</div> -->
      </div>
      <div class="item">
        <div class="pay-name">{{$t('shop.pendingSettlement')}}
          <el-tooltip effect="dark" placement="right">
            <div slot="content" style="max-width:500px">{{$t('shop.pendingSettlementTip')}}</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="pay-amount"> {{details.unsettledAmount}} </div>
        <!-- <div class="pay-percent">{{ details.alipayPercent | percent }}%</div> -->
      </div>
      <div class="item">
        <div class="pay-name">{{$t('shopWallet.freezeBalances')}}
          <el-tooltip effect="dark" placement="right">
            <div slot="content" style="max-width:500px">{{$t('shop.unusableBalanceYuanTip')}}</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="pay-amount">{{details.freezeAmount}}  </div>
        <!-- <div class="pay-percent">{{ details.balancePercent | percent }}%</div> -->
      </div>
      <div class="item">
        <div class="pay-name">{{$t('shop.totalSettlementAmount')}}
          <el-tooltip effect="dark" placement="right">
            <div slot="content" style="max-width:500px">{{$t("shop.totalSettlementAmountTip2")}}</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="pay-amount"> {{details.totalSettledAmount}} </div>
        <!-- <div class="pay-percent">{{ details.balancePercent | percent }}%</div> -->
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('coupon.shopName') + ':'">
            <el-input v-model="searchForm.shopName" :placeholder="$t('coupon.pleEntShopName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('formData.timeLimit')+':'">
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
              value-format="yyyy-MM-dd HH:mm:ss"
              :range-separator="$t('date.tip')"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange">
              {{$t('order.query')}}
              <!-- <el-tooltip
                effect="light"
              >
                <div slot="content" style="max-width:500px">{{$t("shopWallet.trovaTips")}}</div>
                <i class="el-icon-question" />
              </el-tooltip> -->
            </div>
            <div class="default-btn" @click="resetSearchForm">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="table-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="this.$i18n.t('shopWallet.transactionHistory')" name="trade">
          <recording :active-name="activeName" ref="trade" @selectionChange="selectionChange" />
        </el-tab-pane>
        <!-- <el-tab-pane :label="this.$i18n.t('shopWallet.withdrawalRecords')" name="withdrawals">
          <recording :active-name="activeName" ref="withdrawals" />
        </el-tab-pane> -->
      </el-tabs>
      <div class="export-btn">
        <el-button  icon="el-icon-download" v-if="isAuth('shop:wallet:excel')" @click="exportFrom()">{{$t('order.export')}}</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import recording from './recording.vue'
  export default {
    name: 'finance-store-billing/index',
    components: {
      recording
    },
    data () {
      return {
        activeName: 'trade', // 对账类型 0支出 1 收入
        datePickerType: 'daterange', // 日期筛选类型
        shopName: '',
        dateRangeParam: null,
        searchForm: {
          startTime: '',
          endTime: '',
          shopName: '',
          size: 10,
          current: 1
        },
        tableData: [],
        details: {},
        datePickerTypeOptions: [
          {
            label: this.$i18n.t('date.daterange'),
            value: 'daterange'
          },
          {
            label: this.$i18n.t('date.monthrange'),
            value: 'monthrange'
          }
        ]
      }
    },

    mounted () {
      this.getData()
      this.getDataDetail()
    },

    methods: {
      handleClick (tab) {
        this.getData()
      },
      getData () {
        if (this.activeName === 'trade') {
          this.$refs.trade.getDataDetail(JSON.parse(JSON.stringify(this.searchForm)))
        } else if (this.activeName === 'withdrawals') {
          this.$refs.withdrawals.getDataDetail(JSON.parse(JSON.stringify(this.searchForm)))
        }
      },
      getDataDetail () {
        this.details = {
          freezeAmount: '-',
          settledAmount: '-',
          totalSettledAmount: '-',
          unsettledAmount: '-'
        }
        this.$http({
          url: this.$http.adornUrl('/shop/shopWallet/getAllShopWallet'),
          method: 'get',
          params: this.searchForm
        }).then(({data}) => {
          this.details.freezeAmount = data.freezeAmount !== null ? data.freezeAmount : '-'
          this.details.settledAmount = data.settledAmount !== null ? data.settledAmount : '-'
          this.details.totalSettledAmount = data.totalSettledAmount !== null ? data.totalSettledAmount : '-'
          this.details.unsettledAmount = data.unsettledAmount !== null ? data.unsettledAmount : '-'
        })
      },
      setdatePickerType (val) {
        this.datePickerType = val
      },

      selectionChange (list) {
        this.shopIdList = list
      },

      // 条件查询
      searchChange () {
        // if (!this.dateRangeParam) {
        //   return this.$message.error(this.$t('coupon.pleaseSelTime'))
        // }
        this.searchForm.startTime = this.dateRangeParam ? this.dateRangeParam[0] : ''
        this.searchForm.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
        this.getDataDetail()
        this.getData()
      },
      /**
       * 重置表单
       * @param {String} formName 表单名称
       */
      resetSearchForm () {
        this.searchForm.shopName = ''
        this.dateRangeParam = ''
      },
      exportFrom () {
        this.searchForm.startTime = this.dateRangeParam ? this.dateRangeParam[0] : ''
        this.searchForm.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
        if (!this.dateRangeParam) {
          this.$message.warning(this.$t('tip.select') + this.$t('formData.timeLimit'))
          return
        }
        let params = {...this.searchForm}
        params['shopIds'] = this.shopIdList
        const loading = this.$loading({
          lock: true,
          target: '.table-box',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/shop/shopWallet/getShopWalletLogForm'),
          method: 'get',
          params: this.$http.adornParams(params),
          responseType: 'blob'
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('finaManage.storeBilling') + '.xlsx'

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
      }
    }
  }
</script>

<style lang="scss" scoped>
.store-billing {
    .total-amount {
      background: #f7f8fa;
      padding: 15px 40px;
      flex-wrap: wrap;
      width: 100%;
      display: flex;
      flex-direction: row;
      .item {
        // flex: 1;
        font-size: 14px;
        width: 25%;
        .pay-name {
          color: #666;
          margin-bottom: 8px;
        }
        .pay-amount {
          color: #333;
          font-size: 26px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .pay-percent {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }

.table-box {
  position: relative;
  .export-btn {
    position: absolute;
    right: 0;
    top: -5px;
  }
}

    // 搜索栏
  .search-bar {
    margin-top: 20px;
    padding-bottom: 25px;
    .input-row {
      ::v-deep .el-form-item.el-form-item--small{
        // margin-bottom: 0;
        // margin-right: 0 !important;
      }
      & span {
        padding: 0 12px;
      }
      .default-btn {
        margin-left: 20px;
      }
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
  ::v-deep .export-load {
    top: -50% !important;
  }
</style>
