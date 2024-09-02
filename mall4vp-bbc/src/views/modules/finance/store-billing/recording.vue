<template>
  <div class="table-box">
    <div class="list">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="selectionChange"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          type="selection"
          prop="shopId"
          width="55" />
        <el-table-column
          :label="this.$i18n.t('formData.serialNumber')"
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          :label="this.$i18n.t('coupon.shopName')"
          prop="shopName">
        </el-table-column>
        <el-table-column
          prop="settledAmount"
          :label="this.$i18n.t('shopWallet.availableStoreBalances')"
        >
          <template slot-scope="scope">
            <span> {{scope.row.settledAmount !== null ? '￥' + scope.row.settledAmount : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalSettledAmount"
          :label="this.$i18n.t('shopWallet.settledAmount')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.totalSettledAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unsettledAmount"
          :label="this.$i18n.t('shop.pendingSettlement')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.unsettledAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$i18n.t('shop.unusableBalanceYuan')"
          prop="freezeAmount">
          <template slot-scope="scope">
            <span>￥ {{ scope.row.freezeAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="this.$i18n.t('remindPop.operation')"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <div class="default-btn text-btn" @click="exportFrom(scope.row.orderNumber)">{{$t("shopWallet.exportRiconciliazioneDetail")}}</div> -->
            <div class="default-btn text-btn" @click="handleDetail(scope.row.shopId)">{{$t("user.details")}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <!-- <pagination style="text-align: right" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize" @pagination="pagination" /> -->
    <el-pagination
        class="paging"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="timeData.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="timeData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
    props: {
      activeName: {
        type: String
      }
    },
    data () {
      return {
        time: '',
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
          paypalPercent: 0.00
        },
        timeData: {}
      }
    },

    mounted () {
      // this.getDataList()
    },

    activated () {
      this.$store.commit('router/updateIncludePageList', ['finance-store-billing/index'])
      this.$store.commit('router/pushHisPageList', ['finance-store-billing/index'])
    },

    methods: {
      handleClick (tab) {
        // console.log(tab.name)
      },
      getDataDetail (params) {
        this.timeData = params
        this.tableData = []
        this.$http({
          url: this.$http.adornUrl('/shop/shopWallet/pageShopWalletByTime'),
          method: 'get',
          params: params
        }).then(({data}) => {
          this.reconciliationDetails = data.records
          this.tableData = data.records
          this.total = data.total
        })
      },
      // 跳转到明细详情页
      handleDetail (shopId) {
        // 增加缓存页面
        this.$store.commit('router/pushIncludePageList', 'finance-store-billing/trading')
        this.$router.push({
          path: this.activeName === 'trade' ? '/finance-store-billing/trading' : '/finance-store-billing/withdrawal',
          query: {
            type: 1,
            shopId: shopId,
            ...this.timeData
          }
        })
      },
      selectionChange (list) {
        this.$emit('selectionChange', list.map(x => x.shopId))
      },
      // 页数的切换
      handleSizeChange (val) {
        this.pageSize = val
        this.timeData.size = val
        this.getDataDetail(this.timeData)
      },
      //  换页
      handleCurrentChange (val) {
        this.currentPage = val
        this.timeData.current = val
        this.getDataDetail(this.timeData)
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
    }
    .list{
      margin-top: 25px;
      padding-bottom: 30px;
    }
  }
</style>
