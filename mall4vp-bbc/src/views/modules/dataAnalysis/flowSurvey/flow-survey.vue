<template>
  <!-- 流量概况 -->
  <div class="flow-home">
    <!-- 统计时间 -->
    <flow-survey-header></flow-survey-header>
    <!-- 流量总览 -->
    <flow-survey-overview ref="flowSurveyOverview"></flow-survey-overview>
    <!-- 流量趋势 -->
    <flow-survey-trend ref="flowSurveyTrend"></flow-survey-trend>
    <!-- 流量来源构成 -->
    <flow-survey-source ref="flowSurveySource"></flow-survey-source>
  </div>
</template>

<script>
import flowSurveyHeader from './flow-survey-header'
import flowSurveyOverview from './flow-survey-overview'
import flowSurveyTrend from './flow-survey-trend'
import flowSurveySource from './flow-survey-source'

export default {
  data () {
    return {
      timeType: 7,
      startTime: '',
      systemType: 0,
      endTime: ''
    }
  },
  watch: {
    timeType (val) {
      this.$refs.flowSurveyOverview.timeType = val
      this.$refs.flowSurveyTrend.timeType = val
      this.$refs.flowSurveySource.timeType = val
    },
    startTime (val) {
      this.$refs.flowSurveyOverview.startTime = val
      this.$refs.flowSurveySource.startTime = val
      this.$refs.flowSurveyTrend.startTime = val
    },
    systemType (val) {
      this.$refs.flowSurveyTrend.systemType = val
      this.$refs.flowSurveyOverview.systemType = val
    },
    endTime (val) {
      this.$refs.flowSurveyOverview.endTime = val
      this.$refs.flowSurveySource.endTime = val
      this.$refs.flowSurveyTrend.endTime = val
    }
  },
  components: {
    flowSurveyHeader,
    flowSurveyOverview,
    flowSurveyTrend,
    flowSurveySource
  }
}
</script>

<style lang="scss">
.flow-home {
  .flow-title {
    width: 100%;
    height: 62px;
    background: #F7F8FA;
    box-sizing: border-box;
    padding: 19px 20px;
    display: flex;
    justify-content: space-between;
    margin: 20px 0 10px 0;
    .flow-title-left {
      display: flex;
      align-items: center;
      .line {
      width: 4px;
      height: 19px;
      background: #155bd4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }
      .text {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        opacity: 1;
      }
    }
    .flow-title-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .flow-form {
    padding: 0 20px 10px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>

