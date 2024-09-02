<template>
  <div class="trading">
    <div class="search-bar">
      <el-form clearable :inline="true" :model="dataFrom" class="demo-form-inline from" size="small">
        <div class="input-row">
          <el-form-item :label="this.$i18n.t('chat.orderNumber') + ':'">
            <el-input v-model="dataFrom.orderNumber" maxlength="20" onkeyup="value=value.replace(/[^\d]/g,'')" clearable :placeholder="this.$i18n.t('chat.orderNumber')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('order.refundId') + ':'">
            <el-input v-model="dataFrom.refundSn" maxlength="19" onkeyup="value=value.replace(/[^\d]/g,'')" clearable :placeholder="this.$i18n.t('order.refundId')" />
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
              :range-separator="$t('time.tip')"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="onSubmit(true)">{{this.$i18n.t('order.query')}}</div>
            <div class="default-btn" @click="clear">{{this.$i18n.t('shop.resetMap')}}</div>
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

        <el-table-column
          type="index"
          :label="$t('number')"
          align="left"
          width="85"
        >
        </el-table-column>
          <el-table-column
            prop="operation"
            :label="this.$i18n.t('shop.amountType')"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ [$t('shop.amoSett'),$t('shop.avaStoAmo'),$t('shopWallet.unusableBalance'),$t('shop.summAmo')][scope.row.amountType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="changeAomunt"
            :label="this.$i18n.t('shop.changeAomunt')"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ ['-','+'][scope.row.ioType] }} ￥{{ Math.abs(scope.row.changeAomunt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNumber"
            :label="this.$i18n.t('chat.orderNumber')"
            align="left"
            width="220"
          />
          <el-table-column
            prop="refundSn"
            :label="this.$i18n.t('order.refundId')"
            width="220"
          />
          <!-- <el-table-column
          prop="ioType"
          label="收支类型"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ ['支出','收入'][scope.row.ioType] }}</span>
          </template>
        </el-table-column> -->
          <el-table-column
            prop="userAmount"
            :label="this.$i18n.t('shopWallet.operationAmount')"
            width="140"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.userAmount === 0 || !scope.row.userAmount">0</span>
              <span v-else>{{ scope.row.reason === 2 ? '-' : ['-','+'][scope.row.ioType] }}{{ scope.row.userAmount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformAmount"
            :label="this.$i18n.t('settlementDetail.platformShareReduce')"
            width="150"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.platformAmount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopReduceAmount"
            :label="this.$i18n.t('settlementDetail.multishopReduce')"
            width="150"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.shopReduceAmount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
          prop="distributionAmount"
          :label="this.$i18n.t('settlementDetail.distributionAmount')"
          width="130"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.distributionAmount }}</span>
          </template>
        </el-table-column> -->
          <el-table-column
            prop="platformCommission"
            :label="this.$i18n.t('shopWallet.platformCommission')"
            width="130"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.platformCommission || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            width="150"
            align="left"
            :label="this.$i18n.t('shopWallet.amountChangeReason')"
          >
            <template slot-scope="scope">
              <span>{{ [$t('shop.userPay'),$t('shopWallet.orderSettlement'),$t('shopWallet.applyRefund'),$t('shopWallet.rejectApplyRefund'),$t('shop.withApply'),
                $t('shop.withNoPass'),$t('shop.withPass'),$t('shop.succIss'),$t('shop.failIss')][scope.row.reason] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="150"
            :label="this.$i18n.t('shopFeature.chooseFeature.createTime')"
          />
          <el-table-column
            prop="operation"
            :label="this.$i18n.t('text.menu')"
            align="center"
            fixed="right"
            width="120"
          >
            <template slot-scope="scope">
              <el-button :disabled="!scope.row.orderNumber && !scope.row.refundSn" type="text" @click="handleDetail(scope.row.orderNumber,scope.row.refundSn)">{{$t('shop.withdrawalDetail')}}</el-button>
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
      datePickerTypeOptions: [
        {
          label: this.$i18n.t('formData.daterange'),
          value: 'daterange'
        },
        {
          label: this.$i18n.t('formData.monthrange'),
          value: 'monthrange'
        }
      ],
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
        label: this.$i18n.t('shop.avaStoAmo')
      }, {
        value: 2,
        label: this.$i18n.t('shopWallet.unusableBalance')
      }], // '未结算金额', '可提现金额', '冻结金额'
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
        // {
        //   value: 3,
        //   label: this.$i18n.t('shopWallet.rejectApplyRefund')
        // },
        {
          value: 4,
          label: this.$i18n.t('shop.withApply')
        },
        {
          value: 5,
          label: this.$i18n.t('shop.withNoPass')
        },
        {
          value: 6,
          label: this.$i18n.t('shop.withPass')
        }
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
      }]
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
      this.$http({
        url: this.$http.adornUrl('/shop/shopWalletLog/page'),
        method: 'get',
        params: this.theData
      }).then(({data}) => {
        // console.log(data)
        this.tableData = data.records
        this.total = data.total
      })
    },
    setdatePickerType (val) {
      this.datePickerType = val
    },
    // 切换tab
    handleClick (tab) {
      // console.log(tab.name)
    },
    pagination (page) {
      this.params.current = page.current
      this.params.size = page.size
      this.getData()
    },
    // 查询
    onSubmit (newData = false) {
      this.dataFrom.orderNumber = this.dataFrom.orderNumber.trim()
      this.dataFrom.refundSn = this.dataFrom.refundSn.trim()
      this.dataFrom.startTime = this.dateRangeParam ? this.dateRangeParam[0] : ''
      this.dataFrom.endTime = this.dateRangeParam ? this.dateRangeParam[1] : ''
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
