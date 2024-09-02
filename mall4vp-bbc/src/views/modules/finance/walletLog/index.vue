<template>
  <div class="shop-walletLog">
    <div class="title">{{$t('shopWallet.platfromBalance')}}</div>
    <div class="head">
      <div class="head-item">
        <div class="text">
          <span>{{$t("shopWallet.platfromIncomeBalance")}} </span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('shopWallet.platfromIncomeBalanceTips')" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span>{{ shopWalletInfo.settledAmount }}</span>
          <!-- <el-button size="mini" type="primary" plain @click="caswithdrawalBtn">提现</el-button> -->
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span>{{$t("shop.pendingSettlement")}}</span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('shop.platfromPendingSettlementTip')" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span>{{ shopWalletInfo.unsettledAmount }}</span>
        </div>
      </div>
      <!-- <div class="head-item">
        <div class="text">
          <span>冻结金额(元)</span>
          <el-tooltip class="item" effect="dark" content="商城进行提现申请的时候，将会把余额冻结，增加冻结金额" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ shopWalletInfo.freezeAmount }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">总结算金额(元)</span>
          <el-tooltip class="item" effect="dark" content="用户确认收货15天后的所有金额，当用户发生退款的时候，总结算金额会减少" placement="left">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ shopWalletInfo.totalSettledAmount }}</span>
        </div>
      </div> -->
    </div>
    <div class="table-box">
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="交易记录" name="first">
          <trading />
        </el-tab-pane>
        <el-tab-pane label="提现记录" name="second">
          <withdrawal />
        </el-tab-pane>
      </el-tabs> -->
      <trading :load="load" />
    </div>
  </div>
</template>

<script>
  import trading from './trading.vue'
  export default {
    name: 'finance-walletLog/index',
    components: {
      trading
    },
    data () {
      return {
        time: '',
        activeName: 'first',
        isCaswithdrawal: false,
        payList: [
          {
            name: '银联',
            amount: 0.00,
            percent: 0.00
          },
          {
            name: '微信',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '支付宝',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '积分兑换',
            amount: 0.30,
            percent: 0.40
          },
          {
            name: '转账汇款',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '企业银联',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '余额',
            amount: 0.10,
            percent: 0.10
          }
        ],
        tableData: [],
        shopWalletInfo: '',

        load: '0'
      }
    },

    created () {
      this.load = this.$route.query.load || '0'
    },

    mounted () {
      this.getShopWallet()
    },

    methods: {
      handleClick (tab) {
        console.log(tab.name)
      },
      // 获取店铺余额信息
      getShopWallet () {
        this.$http({
          url: this.$http.adornUrl('/shop/shopWallet/getShopWallet'),
          method: 'get'
        }).then(({data}) => {
          this.shopWalletInfo = data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shop-walletLog {
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .head {
      background: #f7f8fa;
      height: 110px;
      padding: 20px;
      display: flex;
      // justify-content: space-around;
      margin-bottom: 20px;
      .head-item {
        height: 100%;
        width: 230px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
        margin-right: 250px;
        .balance {
          font-size: 22px;
        }
      }
    }
  }
</style>
