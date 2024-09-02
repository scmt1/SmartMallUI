
<template>
  <div class="mod-marketing-distribution">
    <el-tabs v-model="tabValue">
      <el-tab-pane :label="$t('shop.setUpShop')" name="shop">
        <shop ref="shop" />
      </el-tab-pane>
      <el-tab-pane :label="$t('shop.applicationForStoreOpening')" name="management">
        <management ref="management"/>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('shop.contractApplication')">
        <signManagement ref="signManagement"/>
      </el-tab-pane> -->
      <el-tab-pane :label="$t('shop.changeBusinessInfor')">
        <businessInformationApplication ref="businessInformationApplication"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import shop from './auditShop-basic'
import management from './account-management'
import signManagement from './sign-management'
import businessInformationApplication from './business-information-application'

export default {
  name: 'platform-auditShop',
  components: {
    shop,
    management,
    signManagement,
    businessInformationApplication
  },
  data () {
    return {
      tabValue: 'shop'
    }
  },
  activated () {
    if (this.tabValue === 'shop') {
      this.$refs.shop.getDataList()
    } else {
      this.$refs.management.getDataList()
    }
  }
}
</script>

<style scoped>
div >>> .el-col-md-6{
  width:30%
}
</style>
