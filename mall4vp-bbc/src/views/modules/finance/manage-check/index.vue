<template>
  <div class="manage-check">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('coupon.shopName') + ':'">
            <el-input v-model="searchForm.shopName" :placeholder="$t('coupon.pleEntShopName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('formData.timeLimit')+':'" class="date-range-param">
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
            </div>
            <div class="default-btn" @click="resetSearchForm">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="table-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="this.$i18n.t('shopWallet.incomeCheck')" name="revenue">
          <revenue ref="revenue" />
        </el-tab-pane>
        <el-tab-pane :label="this.$i18n.t('shopWallet.refundCheck')" name="refunds">
          <refunds ref="refunds" />
        </el-tab-pane>
      </el-tabs>
      <div class="export-btn">
        <el-button  v-if="isAuth('pay:refund:excel')" icon="el-icon-download" @click="exportFrom()">{{$t('order.export')}}</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import revenue from './revenue.vue'
  import refunds from './refunds.vue'
  import moment from 'moment'
  export default {
    name: 'finance-manage-check/index',
    components: {
      revenue,
      refunds
    },
    data () {
      return {
        activeName: 'revenue', // 对账类型 0支出 1 收入
        datePickerType: 'daterange', // 日期筛选类型
        dateRangeParam: [moment().add(-6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
        searchForm: {
          startTime: '',
          endTime: '',
          shopName: ''
        },
        tableData: [],
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
      // this.params.startTime = this.time[0]
      // this.params.endTime = this.time[1]
      // console.log(this.searchForm.time[1])
      this.searchChange()
    },

    methods: {
      handleClick (tab) {
        this.getData()
      },
      getData () {
        if (this.activeName === 'revenue') {
          this.$refs.revenue.getDataDetail(JSON.parse(JSON.stringify(this.searchForm)))
        } else if (this.activeName === 'refunds') {
          this.$refs.refunds.getDataDetail(JSON.parse(JSON.stringify(this.searchForm)))
        }
      },
      setdatePickerType (val) {
        this.datePickerType = val
      },

      // 条件查询
      searchChange () {
        if (!this.dateRangeParam) {
          return this.$message.error(this.$t('coupon.pleaseSelTime'))
        }
        this.searchForm.startTime = this.dateRangeParam ? this.dateRangeParam[0] : ''
        this.searchForm.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
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
        if (!this.dateRangeParam) {
          this.$message.warning(this.$t('tip.select') + this.$t('formData.timeLimit'))
          return
        }
        this.searchForm.startTime = this.dateRangeParam ? this.dateRangeParam[0] : ''
        this.searchForm.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
        const loading = this.$loading({
          lock: true,
          target: '.table-box',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/platform/accountDetail/getPayAndRefundInfoForm'),
          method: 'get',
          params: this.$http.adornParams({
            ...this.searchForm
          }),
          responseType: 'blob'
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          let fileName = this.$i18n.t('shopWallet.riconciliazioneFinanziaria')
          if (this.dateRangeParam[0].split(' ')[0] !== this.dateRangeParam[1].split(' ')[0]) {
            fileName = fileName + '(' + this.dateRangeParam[0].split(' ')[0] +
            ' ' + this.$i18n.t('date.tip') + ' ' +
            this.dateRangeParam[1].split(' ')[0] + ')'
          } else {
            fileName = fileName + `(${this.dateRangeParam[0].split(' ')[0]})`
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.manage-check {
  .search-bar {
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

.table-box {
  position: relative;
  .export-btn {
    position: absolute;
    right: 0;
    top: -5px;
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
