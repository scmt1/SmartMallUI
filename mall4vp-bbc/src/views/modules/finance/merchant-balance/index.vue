<template>
  <div class="shop-walletLog">
    <div class="title">{{$t('settlementDetail.tip1')}}</div>
    <div class="head">
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">{{$t("shop.availableStoreBalance")}}</span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('shop.incAvaStoBal')" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:20px">{{shopWalletInfo.settledAmount}}</span>
          <!-- <el-button size="mini" type="primary" plain @click="caswithdrawalBtn">提现</el-button> -->
        </div>
      </div>
      <div class="head-item" style="margin-left:20px">
        <div class="text">
          <span style="margin-right:1px">{{$t("shop.pendingSettlement")}}</span>
          <el-tooltip class="item" effect="dark"   :content="this.$i18n.t('shop.pendingSettlementTip')" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ shopWalletInfo.unsettledAmount }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">{{$t("shop.unusableBalanceYuan")}}</span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('shop.unusableBalanceYuanTip')" placement="right">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ shopWalletInfo.freezeAmount  }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">{{$t("shop.totalSettlementAmount")}}</span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('shop.totalSettlementAmountTip2')" placement="left">
            <span><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ shopWalletInfo.totalSettledAmount}}</span>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="this.$i18n.t('shop.recentTransactions')" name="first">
          <trading :load="load" />
        </el-tab-pane>
        <!-- <el-tab-pane label="提现记录" name="second">
          <withdrawal />
        </el-tab-pane> -->
      </el-tabs>

    </div>
  </div>
</template>

<script>
import trading from './trading.vue'
export default {
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
        url: this.$http.adornUrl('/shop/shopWallet/getAllShopWallet'),
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
     justify-content: space-around;
     margin-bottom: 20px;
     .head-item {
       height: 100%;
       width: 230px;
       display: flex;
       flex-direction: column;
       justify-content: space-around;
       text-align: center;
       .balance {
         font-size: 22px;
       }
     }
   }
 }
</style>
