<template>
  <div class="mod-seckill-shopWalletLog">
<!--    <div class="trading-record">-->
<!--      <div class="blue"></div>-->
<!--      <span class="record-txt">{{$t("shop.storeBalance")}}</span>-->
<!--    </div>-->
    <!-- 店铺余额栏 -->
    <div class="balance-wrapper">
      <div class="balance-item">
        <div class="balance-item-title">
          <span class="title-tips">{{$t("shop.availableStoreBalance")}}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="this.$i18n.t('shop.incAvaStoBal')"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="balance-show">
          <span class="balance-num">{{shopWallet.settledAmount}}</span>
          <!-- <span class="stress-btn">充值</span> -->
<!--          <div  class="default-btn primary-btn" v-if="isAuth('shop:withdrawCash:apply')" @click="applyWithdrawCash">{{$t("shop.withdraw")}}</div>-->
        </div>
      </div>

      <div class="balance-item">
        <div class="balance-item-title">
          <span class="title-tips">{{$t("shop.pendingSettlement")}}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="this.$i18n.t('shop.pendingSettlementTip')"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="balance-show">
          <span class="balance-num">{{shopWallet.unsettledAmount}}</span>
        </div>
      </div>

      <div class="balance-item">
        <div class="balance-item-title">
          <span class="title-tips">{{$t("shop.unusableBalanceYuan")}}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="this.$i18n.t('shop.unusableBalanceYuanTip')"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="balance-show">
          <span class="balance-num">{{shopWallet.freezeAmount}}</span>
        </div>
      </div>

      <div class="balance-item">
        <div class="balance-item-title">
          <span class="title-tips">{{$t("shop.totalSettlementAmount")}}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="this.$i18n.t('shop.totalSettlementAmountTip2')"
            placement="right"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="balance-show">
          <span class="balance-num">{{shopWallet.totalSettledAmount}}</span>
        </div>
      </div>
    </div>

    <el-tabs>
      <el-tab-pane :label="$t('shop.recentTransactions')">
        <trading ref="trading"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('shop.withdrawalRecord')">
        <withdrawal ref="withdrawal"/>
      </el-tab-pane>
    </el-tabs>

<!--    <div class="trading-record clearfix">-->
<!--      <div class="blue"></div>-->
<!--      <span class="record-txt">{{$t("shop.recentTransactions")}}</span>-->
<!--      &lt;!&ndash; <span class="all-record blue-font">全部交易记录</span> &ndash;&gt;-->
<!--    </div>-->


    <cashWithdrawal v-if="isCashWithdrawal" ref="cashWithdrawal" @refreshDataList="refreshChange"></cashWithdrawal>
  </div>
</template>

<script>
import cashWithdrawal from './cashWithdrawal'
import trading from './shopWalletLog-trading'
import withdrawal from './shopWalletLog-withdrawal'

export default {
  name: 'shop-shopWalletLog',
  data () {
    return {
      shopWallet: {},
      dataListLoading: false,
      isCashWithdrawal: false  // 提现弹框
    }
  },
  components: {
    cashWithdrawal,
    trading,
    withdrawal
  },
  created () {
    this.getShopWalletInfo()
  },
  methods: {
    getShopWalletInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopWallet/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopWallet = data
      })
    },
    // 提现
    applyWithdrawCash () {
      this.$refs.trading.getData()
      this.isCashWithdrawal = true
      this.$nextTick(() => {
        this.$refs.cashWithdrawal.init()
      })
    },
    refreshChange () {
      this.getShopWalletInfo()
      this.$refs.withdrawal.getDataList()
      this.$refs.trading.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-seckill-shopWalletLog {
  .trading-record {
    display: block;
    background: #f7f8fa;
    margin: 10px 0;
    padding: 10px 20px;
  }
  .all-record {
    float: right;
  }
  .record-txt {
    vertical-align: middle;
    font-weight: bold;
  }
  .blue {
    display: inline-block;
    width: 3px;
    height: 1em;
    background: #02a1e9;
    vertical-align: middle;
    margin-right: 2px;
  }
  .balance-wrapper {
    display: flex;
    background: #f7f8fa;
    padding: 30px 30px;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .balance-item {
    display: inline-block;
  }
  .balance-item-title {
    padding-bottom: 25px;
  }
  .title-tips {
    vertical-align: middle;
  }
  .blue-font {
    color: #02a1e9;
    padding-left: 5px;
    cursor: pointer;
    vertical-align: middle;
  }
  .balance-show {
    text-align: left;
  }
  .balance-num {
    font-size: 28px;
    vertical-align: middle;
    margin-right: 30px;
  }
  .stress-btn,
  .weak-btn {
    font-size: 15px;
    padding: 6px 15px;
    border-radius: 3px;
    vertical-align: middle;
    border: 1px solid #02a1e9;
    cursor: pointer;
  }
  .stress-btn {
    color: #fff;
    background: #02a1e9;
    margin-right: 10px;
  }
  .weak-btn {
    color: #02a1e9;
  }
  .clearfix::after {
    display: block;
    content: "";
    visibility: hidden;
    height: 0;
    clear: both;
  }
}
</style>

