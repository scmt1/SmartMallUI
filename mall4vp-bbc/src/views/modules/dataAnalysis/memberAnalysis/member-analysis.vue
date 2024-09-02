<template>
  <!-- 会员分析 -->
  <div class="data-analysis member-analysis">

    <div class="board">
      <!-- 统计时间 -->
      <path-analysis-header :date-options="dateOptions" />

      <!-- 会员概览 -->
      <membership-overview ref="overview" :board-type="'overview'" />
    </div>

    <div class="board">
      <!-- 会员人数趋势 -->
      <membership-overview ref="numTrends" :board-type="'numTrends'" />
    </div>

    <div class="board">
      <!-- 会员占比趋势 -->
      <membership-overview ref="percentageTrend" :board-type="'percentageTrend'" />
    </div>

    <div class="board">
      <!-- 会员贡献价值分析 -->
      <member-contribution-value-analysis ref="memberContribution" />
    </div>

    <div class="board">
      <!-- 新老会员成交分析 -->
      <transaction-analysis ref="transaction" />
    </div>

    <div class="profile-trends-mod">
      <!-- 客户留存分析 -->
      <customer-retention-analysis ref="retention" />
    </div>
    

  </div>
</template>

<script>
import pathAnalysisHeader from './path-analysis-header'
import membershipOverview from './membership-overview'
import memberContributionValueAnalysis from './member-contribution-value-analysis'
import transactionAnalysis from './transaction-analysis'
import customerRetentionAnalysis from './customer-retention-analysis'

export default {
  components: {pathAnalysisHeader, membershipOverview, memberContributionValueAnalysis, transactionAnalysis, customerRetentionAnalysis},
  data () {
    return {
      timeType: 1,
      startTime: '',
      dateRange: [],
      start: '',
      endTime: '',
      // 时间类型列表
      dateOptions: [
        {
          label: this.$t('dataAnalysis.todayRealTime'),
          value: 4
        },
        {
          label: this.$t('dataAnalysis.naturalDay'),
          value: 1
        },
        {
          label: this.$t('dataAnalysis.naturalMonth'),
          value: 3
        },
        {
          label: this.$t('dataAnalysis.nearly7'),
          value: 5
        },
        {
          label: this.$t('dataAnalysis.nearly30'),
          value: 6
        }
      ]
    }
  },
  watch: {
    dateRange () {
      this.$refs.dateType = this.timeType
      this.$refs.overview.dateRange = this.dateRange
      this.$refs.numTrends.dateRange = this.dateRange
      this.$refs.percentageTrend.dateRange = this.dateRange
      this.$refs.memberContribution.dateRange = this.dateRange
      this.$refs.transaction.dateRange = this.dateRange
      this.$refs.retention.dateRange = this.dateRange
    }
  }
}
</script>

<style lang="scss">
.data-analysis.member-analysis {
  display: block;
  width: 100%;
  background: #f1f4f5;
  .board {
    display: block;
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    .board-title {
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
  .profile-trends-mod {
    display: block;
    width: 100%;
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>
