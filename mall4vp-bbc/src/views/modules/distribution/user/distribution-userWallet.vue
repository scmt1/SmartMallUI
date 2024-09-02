<template>
  <!-- 分销钱包 -->
  <div class="mod-marketing-distribution">
    <el-tabs>
        <el-tab-pane :label="$t('user.walletManagement')">
          <userWallet />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.walletFlow')">
          <userWalletBill />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.withdrawalManagement')">
          <withdrawCash />
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userWallet from './distribution-userWallet-basic'
import userWalletBill from './distribution-userWalletBill'
import withdrawCash from './distribution-withdrawCash'
export default {
  name: 'mod-marketing-distribution',
  components: {
    userWallet,
    userWalletBill,
    withdrawCash
  },
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>
