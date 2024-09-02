<template>
  <div class="table-box">
    <div class="total-amount">
      <div class="item">
        <div class="pay-name">{{$t("order.weixinPay")}}</div>
        <div class="pay-amount">￥  {{ reconciliationDetails.wechatAmount }} </div>
        <div class="pay-percent">{{ reconciliationDetails.wechatPercent | percent }}%</div>
      </div>
      <div class="item">
        <div class="pay-name">{{$t("order.aliPay")}}</div>
        <div class="pay-amount">￥ {{ reconciliationDetails.alipayAmount }} </div>
        <div class="pay-percent">{{ reconciliationDetails.alipayPercent | percent }}%</div>
      </div>
      <div class="item">
        <div class="pay-name">{{$t("publics.pointsRedemption")}}</div>
        <div class="pay-amount">{{ reconciliationDetails.scoreCount }}  </div>
      </div>
      <div class="item">
        <div class="pay-name">{{$t("publics.balancePay")}}
          <el-tooltip effect="dark" placement="right">
            <div slot="content" style="max-width:500px">{{$t("shopWallet.amountPaidBuyerAccountBalance")}}</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="pay-amount">￥  {{ reconciliationDetails.balanceAmount }}  </div>
        <div class="pay-percent">{{ reconciliationDetails.balancePercent | percent }}%</div>
      </div>
      <!-- <div class="item marBottom">
        <div class="pay-name">{{$t("publics.transferMoney")}}</div>
        <div class="pay-amount">￥  {{ reconciliationDetails.paypalAmount }}  </div>
        <div class="pay-percent">{{ reconciliationDetails.paypalPercent | percent }}%</div>
      </div>
      <div class="item marBottom">
        <div class="pay-name">{{$t("publics.creditPayment")}}</div>
        <div class="pay-amount">￥  {{ reconciliationDetails.paypalAmount }}  </div>
        <div class="pay-percent">{{ reconciliationDetails.paypalPercent | percent }}%</div>
      </div> -->
      <div class="item marBottom">
        <div class="pay-name">{{$t("shopWallet.payPal")}}</div>
        <div class="pay-amount">￥  {{ reconciliationDetails.paypalAmount }}  </div>
        <div class="pay-percent">{{ reconciliationDetails.paypalPercent | percent }}%</div>
      </div>
      <div class="item marBottom">
        <div class="pay-name">{{$t("shopWallet.totalNum")}}</div>
        <div class="pay-amount">￥  {{ reconciliationDetails.total }}  </div>
      </div>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          :label="this.$i18n.t('formData.serialNumber')"
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          :label="this.$i18n.t('coupon.shopName')"
          prop="shopName">
          <template slot-scope="scope">
            <span> {{scope.row.shopName}}
              <span v-if="scope.row.shopId === 0" class="platform-icon">{{$t("home.platform")}}</span>
            </span>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="alipayAmount"
          :label="this.$i18n.t('order.aliPay')"
        >
          <template slot-scope="scope">
            <span> {{scope.row.alipayAmount !== null ? '￥' + scope.row.alipayAmount : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatAmount"
          :label="this.$i18n.t('order.weixinPay')"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.wechatAmount !== null ? '￥' + scope.row.wechatAmount : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          :label="this.$i18n.t('publics.balancePay')"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.balanceAmount !== null ? '￥' + scope.row.balanceAmount : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$i18n.t('user.scorePay')"
          prop="scoreCount">
          <template slot-scope="scope">
            <span> {{scope.row.scoreCount !== null ? scope.row.scoreCount : '-'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :label="this.$i18n.t('publics.creditPayment')"
          prop="paypalAmount">
          <template slot-scope="scope">
            <span>￥ {{ scope.row.paypalAmount }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="paypalAmount"
          :label="this.$i18n.t('shopWallet.payPal')"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.paypalAmount !== null ? '￥' + scope.row.paypalAmount : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          :label="this.$i18n.t('shopWallet.totalNum')"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.total !== null ? '￥' + scope.row.total : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="this.$i18n.t('remindPop.operation')"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <div class="default-btn text-btn" @click="exportFrom(scope.row.orderNumber)">{{$t("shopWallet.exportRiconciliazioneDetail")}}</div> -->
            <div class="default-btn text-btn" @click="handleDetail(scope.row.shopId)">{{$t("shopWallet.riconciliazioneDetail")}}</div>
            <!-- <el-button type="text" size="small" @click="handleDetail(scope.row.orderNumber)">明细</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 分页条 -->
    <!-- <pagination style="text-align: right" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize" @pagination="pagination" /> -->
  </div>
</template>

<script>
  // import Pagination from '@/components/Pagination'
  import moment from 'moment'
  export default {
    filters: {
      percent (value) {
        return (value * 100).toFixed(2)
      }
    },
    // components: { Pagination },
    data () {
      return {
        time: '',
        activeName: 'second',
        total: 0,
        params: {
          pageNum: 1,
          pageSize: 10
        },
        tableData: [],
        reconciliationDetails: {
          wechatAmount: 0.00,
          wechatPercent: 0.00,
          alipayAmount: 0.00,
          alipayPercent: 0.00,
          balanceAmount: 0.00,
          balancePercent: 0.00,
          paypalAmount: 0.00,
          paypalPercent: 0.00,
          scoreCount: 0
        },
        timeData: ''
      }
    },

    mounted () {
      // this.getDataList()
    },

    methods: {
      handleClick (tab) {
        console.log(tab.name)
      },
      getDataDetail (params) {
        this.timeData = params
        this.tableData = []
        this.$http({
          url: this.$http.adornUrl('/platform/accountDetail/getIncomeAccountDetail'),
          method: 'get',
          params: params
        }).then(({data}) => {
          this.reconciliationDetails = data
        })
        this.getData()
      },
      getData () {
        this.$http({
          url: this.$http.adornUrl('/platform/accountDetail/getIncomeAccountDetailInfo'),
          method: 'get',
          params: {...this.timeData, ...this.params}
        }).then(({data}) => {
          this.tableData = data.records
          this.total = data.total
        })
      },
      handleSizeChange (val) {
        this.params.size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.current = val
        this.getData()
      },
      // 跳转到明细详情页
      handleDetail (shopId) {
        this.$router.push({
          path: '/finance-reconciliation-details/index',
          query: {
            type: 1,
            shopId: shopId,
            ...this.timeData
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-box {
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
      .marBottom {
        margin-top: 15px;
      }
    }
    .list{
      margin-top: 25px;
      padding-bottom: 30px;
      .platform-icon {
        padding: 2px 4px;
        font-size: 12px;
        color: #fff;
        border-radius: 3px;
        margin-left: 5px;
        background-color: #155bd4;
      }
    }
  }
</style>
