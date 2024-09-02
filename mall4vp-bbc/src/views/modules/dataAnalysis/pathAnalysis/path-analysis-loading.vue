<template>
  <div class="realtime-chart-box" id="time-survey" style="width:100%;height:300px"></div>
</template>

<script>
export default {
  data () {
    return {
      value: [0, 1],
      sumPayActualTotal: 0.00,
      dataForm: {},
      nowActualTotal: [],
      payYesterdayActualTotal: [],
      dataArray: [],
      timeArray: [],
      nowDate: null,
      dataInfo: {},
      rate: [],
      refundRateInfo: [],
      refundRankForActualTotal: [],
      refundRankForCause: []
    }
  },
  methods: {
    getRealTimechartData () {
      const myChart = this.$echarts.init(document.getElementById('time-survey'), 'walden')
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }

      myChart.setOption(option)
    }
  },
  mounted () {
    this.getRealTimechartData()
  }
}
</script>


