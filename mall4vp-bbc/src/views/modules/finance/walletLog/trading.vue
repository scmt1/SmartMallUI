<template>
  <div class="table-box">
    <div class="search-bar">
      <el-form clearable :inline="true" :model="dataFrom" class="search-form" size="small">
        <div class="input-row">
          <el-form-item :label="this.$i18n.t('chat.orderNumber') + ':'">
            <el-input v-model="dataFrom.orderNumber" maxlength="20" onkeyup="value=value.replace(/[^\d]/g,'')" clearable :placeholder="this.$i18n.t('chat.orderNumber')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('order.refundId') + ':'">
            <el-input v-model="dataFrom.refundSn" maxlength="19" onkeyup="value=value.replace(/[^\d]/g,'')"  clearable :placeholder="this.$i18n.t('order.refundId')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shop.ioType') + ':'">
            <el-select v-model="dataFrom.ioType" clearable :placeholder="this.$i18n.t('shop.ioType')">
              <el-option
                v-for="item in ioType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('prodList.shopName') + ':'">
            <el-input v-model="dataFrom.shopName" maxlength="19" clearable :placeholder="this.$i18n.t('prodList.shopName')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shop.amountType') + ':'">
            <el-select v-model="dataFrom.amountType" clearable :placeholder="this.$i18n.t('shop.amountType')">
              <el-option
                v-for="item in amountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shop.reason') + ':'">
            <el-select v-model="dataFrom.reason" clearable :placeholder="this.$i18n.t('shop.reason')">
              <el-option
                v-for="item in reason"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
              @change="changeDateRangeParam"
              :end-placeholder="$t('date.end')">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="onSubmit(true)">{{this.$i18n.t('order.query')}}</div>
            <div class="default-btn" @click="clear">{{this.$i18n.t('order.clear')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <div class="table-con">
        <el-table
          :data="tableData"
          style="width: 100%"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
        >
          <!-- scope.$index -->
          <el-table-column
            type="index"
            :label="this.$i18n.t('sysManagement.serialNumber')"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="operation"
            :label="this.$i18n.t('shop.amountType')"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ [$t('shop.amoSett'),$t('shopWallet.platfromIncomeAmount')][scope.row.amountType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="changeAomunt"
            :label="this.$i18n.t('shop.changeAomunt')"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ ['-','+'][scope.row.ioType] }} ￥{{ scope.row.changeAomunt }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNumber"
            :label="this.$i18n.t('chat.orderNumber')"
            width="200"
          />
          <el-table-column
            prop="refundSn"
            :label="this.$i18n.t('order.refundId')"
            width="200"
          />
          <el-table-column
            prop="userAmount"
            :label="this.$i18n.t('shopWallet.operationAmount')"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformAmount"
            :label="this.$i18n.t('settlementDetail.platformShareReduce')"
            width="120"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.platformAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopReduceAmount"
            :label="this.$i18n.t('settlementDetail.multishopReduce')"
            width="120"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.shopReduceAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="distributionAmount"
            :label="this.$i18n.t('shopWallet.distributionAmount')"
            width="120"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.distributionAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformCommission"
            :label="this.$i18n.t('shopWallet.platformCommission')"
            width="120"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.platformCommission }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            :label="this.$i18n.t('shopWallet.amountChangeReason')"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ [$t('shop.userPay'),$t('shopWallet.orderSettlement'),$t('shopWallet.applyRefund'),$t('shopWallet.rejectApplyRefund')][scope.row.reason] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="this.$i18n.t('shopFeature.chooseFeature.createTime')"
            width="160"
          />
          <el-table-column
            prop="operation"
            :label="this.$i18n.t('text.menu')"
            align="center"
            fixed="right"
            width="150"
          >
            <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                :class="{'disabled-btn': !scope.row.orderNumber && !scope.row.refundSn}"
                @click="handleDetail(scope.row.orderNumber,scope.row.refundSn)">{{$t('user.details')}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <!-- 分页条 -->
      <el-pagination
        v-if="total > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // import Pagination from '@/components/Pagination'
  // import { page } from '@/api/wallet-log/index'
  export default {
    // filters: {
    //   price (value) {
    //     if (value) {
    //       return (value / 100).toFixed(2)
    //     }
    //     return 0
    //   }
    // },
    // components: { Pagination },
    props: {
      load: {
        type: String,
        default: '0'
      }
    },

    data () {
      return {
        theData: null, // 保存上次点击查询的请求条件

        time: '',
        activeName: 'second',
        total: 0,
        params: {
          current: 1,
          size: 10
        },
        datePickerType: 'daterange', // 日期筛选类型
        dateRangeParam: null,
        ioType: [{
          value: 0,
          label: this.$i18n.t('shop.pay')
        }, {
          value: 1,
          label: this.$i18n.t('shop.income')
        }],
        amountType: [{
          value: 0,
          label: this.$i18n.t('shop.amoSett')

        }, {
          value: 1,
          label: this.$i18n.t('shopWallet.platfromIncomeAmount')
        }], // '未结算金额', '可提现金额', '冻结金额'
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
        reason: [
          {
            value: 0,
            label: this.$i18n.t('shop.userPay')
          },
          {
            value: 1,
            label: this.$i18n.t('shopWallet.orderSettlement')
          },
          {
            value: 2,
            label: this.$i18n.t('shopWallet.applyRefund')
          },
          {
            value: 3,
            label: this.$i18n.t('shopWallet.rejectApplyRefund')
          }
          // {
          //   value: 4,
          //   label: this.$i18n.t('shop.withApply')
          // },
          // {
          //   value: 5,
          //   label: this.$i18n.t('shop.withNoPass')
          // },
          // {
          //   value: 6,
          //   label: this.$i18n.t('shop.withPass')
          // }
          // {
          //   value: 7,
          //   label: this.$i18n.t('shop.succIss')
          // },
          // {
          //   value: 8,
          //   label: this.$i18n.t('shop.failIss')
          // }
        ],
        dataFrom: {
          ioType: '',
          amountType: '',
          orderNumber: '',
          refundSn: '',
          reason: '',
          startTime: '',
          endTime: ''
        },
        tableData: [{
          balance: 111
        }],

        isload: this.load
      }
    },

    mounted () {
      this.getData()
    },

    methods: {
      // 获取列表数据
      getData (newData = false) {
        if (newData || !this.theData) {
          this.theData = { ...this.dataFrom, ...this.params }
        } else {
          this.theData = { ...this.theData, ...this.params }
        }

        // 判断是否为详情页返回
        if(this.isload === '0') {
          localStorage.setItem("walletLogSearch", JSON.stringify(this.theData));
        }else {
          this.theData = JSON.parse(localStorage.getItem("walletLogSearch"));
          this.params = {
            current: this.theData.current,
            size: this.theData.size
          }
          this.dataFrom = {
            ioType: this.theData.ioType,
            amountType: this.theData.amountType,
            orderNumber: this.theData.orderNumber,
            refundSn: this.theData.refundSn,
            reason: this.theData.reason,
          }
        }
        this.isload = '0'

        this.$http({
          url: this.$http.adornUrl('/shop/shopWallet/pagePlatformInfo'),
          method: 'get',
          params: this.theData
        }).then(({data}) => {
          this.tableData = data.records
          this.total = data.total
        })
      },
      changeDateRangeParam() {
        this.dataFrom.startTime = this.dateRangeParam ? this.dateRangeParam[0] : '',
        this.dataFrom.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
      },
      setdatePickerType (val) {
        this.datePickerType = val
      },
      // 切换tab
      handleClick (tab) {
        console.log(tab.name)
      },
      pagination (page) {
        this.params.current = page.current
        this.params.size = page.size
        this.getData()
      },
      // 查询
      onSubmit (newData = false) {
        this.params.current = 1
        this.getData(newData)
      },
      handleSizeChange (val) {
        this.params.size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.current = val
        this.getData()
      },
      // 跳转到详情页
      handleDetail (orderNumber, refundSn) {
        this.$router.push({
          path: '/finance-billing-details/index',
          query: {
            path: 0,
            orderNumber,
            refundSn
          }
        })
      },
      // 清空查询 的表单
      clear () {
        this.dataFrom = {
          ioType: '',
          amountType: '',
          orderNumber: '',
          refundSn: '',
          reason: '',
          shopName: '',
          startTime: '',
          endTime: ''
        }
        this.dateRangeParam = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table {
    margin-top: 30px;
    .list{
      padding: 20px 0;
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

</style>
