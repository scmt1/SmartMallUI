<template>
  <!-- 客户概况 -->
  <div class="cust-survey-home">
    <!-- 时间选择框 -->
    <cust-analysis-header @timeData="recTimeData"></cust-analysis-header>
    <!-- 客户概况及趋势 -->
    <cust-analysis-stats :timeData="timeData"></cust-analysis-stats>
    <!-- 会员统计 -->
    <cust-analysis-member :timeData="timeData"></cust-analysis-member>
    <!-- 成交客户分析 -->
    <cust-analysis-com :timeData="timeData"></cust-analysis-com>
    <!-- 客户留存分析 -->
    <cust-analysis-retention></cust-analysis-retention>
  </div>
</template>

<script>
import custAnalysisHeader from './cust-analysis-header'
import custAnalysisStats from './cust-analysis-stats'
import custAnalysisFans from './cust-analysis-fans'
import custAnalysisMember from './cust-analysis-member'
import custAnalysisCom from './cust-analysis-com'
import custAnalysisRetention from './cust-analysis-retention'

export default {
  components: {
    custAnalysisHeader,
    custAnalysisStats,
    custAnalysisFans,
    custAnalysisMember,
    custAnalysisCom,
    custAnalysisRetention
  },
  data () {
    return {
      timeData: {
        dateValue: 1,
        dateRange: []
      }
    }
  },
  methods: {
    /**
     * 接收时间参数
     */
    recTimeData (data) {
      this.timeData.dateValue = data.dateValue
      this.timeData.dateRange = data.dateRange
    }
  }
}
</script>

<style lang="scss">
.cust-survey-home {
  .base-section {
    padding: 16px;
    background: #f7f8fa;
    margin-bottom: 16px;
  }
}
</style>

