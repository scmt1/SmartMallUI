<template>
  <div class="mod-home">
    <path-analysis-header ref="pathAnalysisHeader"></path-analysis-header>
    <path-analysis-map ref="pathAnalysisMap"></path-analysis-map>
    <path-analysis-text ref="pathAnalysisText"></path-analysis-text>
  </div>
</template>

<script>
import pathAnalysisHeader from './path-analysis-header'
import pathAnalysisMap from './path-analysis-map'
// import pathAnalysisText from './path-analysis-text'
import pathAnalysisText from './path-analysis-text-new'

export default {
  components: {
    pathAnalysisHeader,
    pathAnalysisMap,
    pathAnalysisText
  },
  data () {
    return {
      timeType: 1,
      pageType: 1,
      systemType: 0,
      preDay: '',
      start: '',
      startTime: '',
      endTime: '',
      end: ''
    }
  },
  watch: {
    timeType (val) {
      this.$refs.pathAnalysisMap.timeType = val
    },
    start (val) {
      this.$refs.pathAnalysisMap.start = val
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.base-section {
  padding: 15px 20px;
  background-color: #f7f8fa;
  margin-bottom: 16px;
}
</style>

