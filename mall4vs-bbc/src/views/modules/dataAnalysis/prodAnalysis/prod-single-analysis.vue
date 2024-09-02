<template>
  <div class="mod-single">
    <div>
      <!-- //第五部分多选标签栏 -->
      <div class="five-checkbox">
        <div class="item-list">
          <el-form :model="form" class="form-inline">
            <!-- :style="selectNum >= 8 || selectNum <=1 ? 'pointer-events: none;' : ''"
              实现了但最后一个时与超过8哥时不能再进行选择，但不能退选与继续进行多选
            在还没8个跟一个时则能继续反复选择-->
            <!-- <el-form-item label="基础指标:">
              <el-checkbox-group v-model="form.saleIndex">
                <el-checkbox label="累计会员数" name="saleIndex" checked></el-checkbox>
                <el-checkbox label="累计会员占比" name="saleIndex" checked></el-checkbox>
              </el-checkbox-group>
            </el-form-item>-->
            <el-form-item :label="this.$i18n.t('dataAnaly.transactionIndicator') + ':'">
              <!-- :style="selectNum >= 8 ? 'pointer-events: none;' : ''" 设置不能点击，但已经选择的不能退选了？ -->
              <el-checkbox-group v-model="form.serviceIndex">
                <el-checkbox :label="this.$i18n.t('dataAnaly.numberOfTransactionMembers')" name="saleIndex" checked></el-checkbox>
                <el-checkbox :label="this.$i18n.t('dataAnaly.proportionOfTradingMembers')" name="saleIndex" checked></el-checkbox>
                <el-checkbox :label="this.$i18n.t('home.payCount')" name="saleIndex" checked></el-checkbox>
                <el-checkbox :label="this.$i18n.t('home.customerPrice')" name="saleIndex"></el-checkbox>
                <el-checkbox :label="this.$i18n.t('home.payAmount')" name="saleIndex"></el-checkbox>
                <el-checkbox :label="this.$i18n.t('dataAnaly.proportionOfPaymentAmount')" name="saleIndex"></el-checkbox>
                <el-checkbox :label="this.$i18n.t('dataAnaly.perCapitaConsumptionFrequency')" name="saleIndex"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- <span id="maxSelectSpan">最多选择8项</span>
            <span class="form-inline-select">已选择 {{selectNum}}/8 个指标</span>-->
          </el-form>
        </div>
      </div>
      <!-- //第五部分数据表 -->
      <!-- 如何实现响应展示 -->
      <div class="three-chart five-chart">
        <div>
          <el-table :data="tableData5" style="width: 100%" height="180">
            <el-table-column
              highlight-current-row="true"
              fixed
              prop="custType"
              :label="this.$i18n.t('dataAnaly.customerType')"
              width="160"
            ></el-table-column>
            <!-- <el-table-column prop label="累计会员数" width="120"></el-table-column>
            <el-table-column prop label="累计会员占比" width="120"></el-table-column>-->
            <el-table-column prop :label="this.$i18n.t('dataAnaly.numberOfTransactionMembers')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('dataAnaly.proportionOfTradingMembers')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('home.payCount')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('home.customerPrice')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('home.payAmount')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('dataAnaly.proportionOfPaymentAmount')" width="120"></el-table-column>
            <el-table-column prop :label="this.$i18n.t('dataAnaly.perCapitaConsumptionFrequency')" width="120"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        serviceIndex: []
      },
      tableData5: []
    }
  }
}
</script>

<style>
</style>
