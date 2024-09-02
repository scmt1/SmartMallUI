<template>
  <!-- 客户留存分析 -->
  <div class="customer-profile customer-retention-analysis">
    <!-- 标题栏 -->
    <div class="data-analysis title-bar">
      <div class="module-title">
        <div class="tit-lf">{{ title }}</div>
        <div class="tit-rg">
          <div class="statistics-time">
            <span>{{$t('dataAnalysis.statisticalTime')}}：</span>
            <el-select v-model="rangeValue" :placeholder="$t('tip.select')" @change="setDateRange(rangeValue)">
              <el-option
                v-for="item in rangeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="date-display">{{ dateRange[0] }}{{ $t('date.tip') }}{{ dateRange[1] }}</div>
          <!-- <div class="refresh">刷新</div> -->
          <!-- <el-button size="mini" type="text" @click="refreshRetainedData()">
            {{$t('dataAnalysis.refresh')}}
            <el-popover placement="top" width="300" trigger="hover" style="margin-left: 5px;" content="拉取分析数据比较慢，请勿频繁刷新缓存数据">
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </el-button> -->
        </div>
      </div>
    </div>
    <!-- 选项卡 -->
    <el-tabs v-model="retainType" class="tabs" type="card">
      <!-- <el-tab-pane :label="$t('dataAnalysis.browseRetention')" name="1" /> -->
      <el-tab-pane :label="$t('dataAnalysis.dealRetention')" name="2" />
    </el-tabs>

    <!-- 表格 -->
    <div class="table-box">
      <div class="table">
        <el-table :data="dataList" border>
          <el-table-column v-if="retainType==2" fixed prop="currentMonth" :label="$t('dataAnalysis.dealTime')" width="180" />
          <el-table-column v-if="retainType==2" prop="newCustomers" :label="$t('dataAnalysis.newCustomer')" width="180" />
          <el-table-column v-if="retainType==1" fixed prop="currentMonth" :label="$t('dataAnalysis.accessTime')" width="180" />
          <el-table-column v-if="retainType==1" prop="newCustomers" :label="$t('dataAnalysis.newCustomer')" width="180" />

          <el-table-column v-if="1<=colLength" :label="$t('dataAnalysis.retained1')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.firstMonthRemain }}</p>
                <p v-if="scope.row.firstMonthRemainRate !== null">{{ scope.row.firstMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="2<=colLength" :label="$t('dataAnalysis.retained2')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.secondMonthRemain }}</p>
                <p v-if="scope.row.secondMonthRemainRate !== null">{{ scope.row.secondMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="3<=colLength" :label="$t('dataAnalysis.retained3')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.thirdMonthRemain }}</p>
                <p v-if="scope.row.thirdMonthRemain !== null">{{ scope.row.thirdMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="4<=colLength" :label="$t('dataAnalysis.retained4')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.fourthMonthRemain }}</p>
                <p v-if="scope.row.fourthMonthRemain !== null">{{ scope.row.fourthMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="5<=colLength" :label="$t('dataAnalysis.retained5')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.fifthMonthRemain }}</p>
                <p v-if="scope.row.fifthMonthRemain !== null">{{ scope.row.fifthMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="6<=colLength" :label="$t('dataAnalysis.retained6')">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.sixthMonthRemain }}</p>
                <p v-if="scope.row.sixthMonthRemainRate !== null">{{ scope.row.sixthMonthRemainRate }}%</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
// import titleBar from '../public-components/title-bar'

import moment from 'moment'
export default {
  // components: { titleBar },
  data () {
    return {
      title: this.$t('dataAnalysis.customerRetentionAnalysis'),
      dataList: [],
      // 时间范围
      rangeValue: 2, // 1最近1个月 2最近3个月 3最近6个月 4最近1年
      rangeOptions: [
        {
          label: this.$t('dataAnalysis.last3M'),
          value: 2
        },
        {
          label: this.$t('dataAnalysis.last6M'),
          value: 3
        },
        {
          label: this.$t('dataAnalysis.last1Y'),
          value: 4
        }
      ],
      typeValue: 1, // 1月留存 2周留存 暂时不统计周留存
      typeOptions: [{
        label: this.$i18n.t('dataAnalysis.retained'),
        value: 1
      }],
      dateRange: [],
      retainType: '2', // 1访问留存  2成交留
      // title: '成交客户分析',
      // radio6B: 0,
      colLength: 0,
      tableData: [{
        currentMonth: '2021-02', // 当前月
        newCustomers: '789', // 新访问/访问客户数
        firstMonthRemain: '20%', // 第1月留存
        secondMonthRemain: '20%', // 第2月留存
        thirdMonthRemain: '20%', // 第3月留存
        fourthMonthRemain: '20%', // 第4月留存
        fifthMonthRemain: '20%', // 第5月留存
        sixthMonthRemain: '20%' // 第6月留存
      },
      {
        currentMonth: '2021-03', // 访问时间
        newCustomers: '457', // 新访问/访问客户数
        firstMonthRemain: '30%', // 第1月留存
        secondMonthRemain: '20%', // 第2月留存
        thirdMonthRemain: '20%', // 第3月留存
        fourthMonthRemain: '20%', // 第4月留存
        fifthMonthRemain: '20%', // 第5月留存
        sixthMonthRemain: '20%' // 第6月留存
      },
      {
        currentMonth: '2021-04', // 访问时间
        newCustomers: '547', // 新访问/访问客户数
        firstMonthRemain: '21%', // 第1月留存
        secondMonthRemain: '20%', // 第2月留存
        thirdMonthRemain: '20%', // 第3月留存
        fourthMonthRemain: '20%', // 第4月留存
        fifthMonthRemain: '20%', // 第5月留存
        sixthMonthRemain: '20%' // 第6月留存
      },
      {
        currentMonth: '平均留存率', // 访问时间
        newCustomers: '358', // 新访问/访问客户数
        firstMonthRemain: '23%', // 第1月留存
        secondMonthRemain: '20%', // 第2月留存
        thirdMonthRemain: '20%', // 第3月留存
        fourthMonthRemain: '20%', // 第4月留存
        fifthMonthRemain: '20%', // 第5月留存
        sixthMonthRemain: '20%' // 第6月留存
      }]
    }
  },
  watch: {
    dateRange () {
      this.dateType = this.$parent.timeType
      // 客户留存分析后台数据
      this.getMemberRetentionData()
    },
    retainType (val) {
      this.getMemberRetentionData()
    }
  },
  mounted () {
    // this.dateType = this.$parent.timeType
    this.setDateRange(this.rangeValue)
    // 客户留存分析后台数据
    // this.getMemberRetentionData()
  },

  methods: {
    getMemberRetentionData () {
      if (this.rangeValue === 1) {
        this.colLength = 1
      } else if (this.rangeValue === 2) {
        this.colLength = 2
      } else if (this.rangeValue === 3) {
        this.colLength = 5
      } else if (this.rangeValue === 4) {
        this.colLength = 6
      }
      console.log(this.retainType)
      const param = {
        dateType: this.rangeValue, // 1最近1个月 2最近3个月 3最近6个月 4最近1年
        retainType: this.retainType, // 1访问留存  2成交留存
        dateRetainType: this.typeValue, // 1月留存 2周留存 暂时不统计周留存
        startTime: this.dateRange[0].indexOf(':') !== -1 ? this.dateRange[0] : this.dateRange[0] + ' 00:00:00', // yyyy-MM-dd HH:mm:ss
        endTime: this.dateRange[1].indexOf(':') !== -1 ? this.dateRange[1] : this.dateRange[1] + ' 23:59:59' // yyyy-MM-dd HH:mm:ss
      }
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/getCustomerRetained'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(data => {
        console.log(data)
        data = data.data
        if (data) {
          this.dataList = data
          // var size = this.dataList.length
        } else {
          this.dataList = []
        }
      })
    },
    formatDate (date) {
      var tempDate = date + ''
      return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6)
    },
    // 刷新缓存数据
    refreshRetainedData () {
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/refreshRetainedData'),
        method: 'get',
        params: {}

      }).then(data => {
        data = data.data
        this.$message({
          message: this.$i18n.t('table.actionSuccess'),
          type: 'success',
          duration: 1000
        })
        this.getMemberRetentionData()
      })
    },
    handleClick (tab, event) {
    },
    setDateRange (val) {
      var startDay = null
      var endDay = null
      if (val === 2) {
        startDay = -90
        endDay = 0
      }
      if (val === 3) {
        startDay = -180
        endDay = 0
      }
      if (val === 4) {
        startDay = -360
        endDay = 0
      }
      // 开始时间
      var startTime = moment().add(startDay, 'days').format('L')
      // 结束时间
      var endTime = moment().add(endDay, 'days').format('L')
      this.$nextTick(() => {
        this.dateRange = [startTime, endTime]
      })
    },
    table_bg (data) {
      var size = this.dataList.length
      if (data.rowIndex === (size - 2)) {
        this.dataList[data.rowIndex].sixthMonthRemain = null
        this.dataList[data.rowIndex].sixthMonthRemainRate = null
        this.dataList[data.rowIndex].fifthMonthRemain = null
        this.dataList[data.rowIndex].fifthMonthRemainRate = null
        this.dataList[data.rowIndex].fourthMonthRemain = null
        this.dataList[data.rowIndex].fourthMonthRemainRate = null
        this.dataList[data.rowIndex].thirdMonthRemain = null
        this.dataList[data.rowIndex].thirdMonthRemainRate = null
        this.dataList[data.rowIndex].secondMonthRemain = null
        this.dataList[data.rowIndex].secondMonthRemainRate = null
        this.dataList[data.rowIndex].firstMonthRemain = null
        this.dataList[data.rowIndex].firstMonthRemainRate = null
      }
      if (size > 7) {
        if ((data.rowIndex <= 5 || data.rowIndex === (size - 1)) && data.columnIndex > 1) {
          return 'table_bg'
        }
        if (data.rowIndex > 5) {
          if (data.columnIndex > 1 && (data.columnIndex <= 6 + (this.colLength - data.rowIndex))) {
            if (data.rowIndex === 6) {
              this.dataList[data.rowIndex].sixthMonthRemain = null
              this.dataList[data.rowIndex].sixthMonthRemainRate = null
            }
            if (data.rowIndex === 7) {
              this.dataList[data.rowIndex].sixthMonthRemain = null
              this.dataList[data.rowIndex].sixthMonthRemainRate = null
              this.dataList[data.rowIndex].fifthMonthRemain = null
              this.dataList[data.rowIndex].fifthMonthRemainRate = null
            }
            if (data.rowIndex === 8) {
              this.dataList[data.rowIndex].sixthMonthRemain = null
              this.dataList[data.rowIndex].sixthMonthRemainRate = null
              this.dataList[data.rowIndex].fifthMonthRemain = null
              this.dataList[data.rowIndex].fifthMonthRemainRate = null
              this.dataList[data.rowIndex].fourthMonthRemain = null
              this.dataList[data.rowIndex].fourthMonthRemainRate = null
            }
            if (data.rowIndex === 9) {
              this.dataList[data.rowIndex].sixthMonthRemain = null
              this.dataList[data.rowIndex].sixthMonthRemainRate = null
              this.dataList[data.rowIndex].fifthMonthRemain = null
              this.dataList[data.rowIndex].fifthMonthRemainRate = null
              this.dataList[data.rowIndex].fourthMonthRemain = null
              this.dataList[data.rowIndex].fourthMonthRemainRate = null
              this.dataList[data.rowIndex].thirdMonthRemain = null
              this.dataList[data.rowIndex].thirdMonthRemainRate = null
            }
            if (data.rowIndex === 10) {
              this.dataList[data.rowIndex].sixthMonthRemain = null
              this.dataList[data.rowIndex].sixthMonthRemainRate = null
              this.dataList[data.rowIndex].fifthMonthRemain = null
              this.dataList[data.rowIndex].fifthMonthRemainRate = null
              this.dataList[data.rowIndex].fourthMonthRemain = null
              this.dataList[data.rowIndex].fourthMonthRemainRate = null
              this.dataList[data.rowIndex].thirdMonthRemain = null
              this.dataList[data.rowIndex].thirdMonthRemainRate = null
              this.dataList[data.rowIndex].secondMonthRemain = null
              this.dataList[data.rowIndex].secondMonthRemainRate = null
            }
            return 'table_bg'
          }
        }
      } else {
        this.getRows(data, size)
      }
      return ''
    },
    getRows (data, size) {
      if ((data.rowIndex === 0 || data.rowIndex === (size - 1)) && data.columnIndex > 1) {
        return 'table_bg'
      }
      if (data.rowIndex > 0) {
        if (data.rowIndex === 1 && this.colLength === 2) {
          this.dataList[data.rowIndex].secondMonthRemain = null
          this.dataList[data.rowIndex].secondMonthRemainRate = null
        }
        if (data.columnIndex > 1 && (data.columnIndex <= 1 + (this.colLength - data.rowIndex))) {
          if (data.rowIndex === 1) {
            this.dataList[data.rowIndex].sixthMonthRemain = null
            this.dataList[data.rowIndex].sixthMonthRemainRate = null
            this.dataList[data.rowIndex].fifthMonthRemain = null
            this.dataList[data.rowIndex].fifthMonthRemainRate = null
          }
          if (data.rowIndex === 2) {
            this.dataList[data.rowIndex].sixthMonthRemain = null
            this.dataList[data.rowIndex].sixthMonthRemainRate = null
            this.dataList[data.rowIndex].fifthMonthRemain = null
            this.dataList[data.rowIndex].fifthMonthRemainRate = null
            this.dataList[data.rowIndex].fourthMonthRemain = null
            this.dataList[data.rowIndex].fourthMonthRemainRate = null
          }
          if (data.rowIndex === 3) {
            this.dataList[data.rowIndex].sixthMonthRemain = null
            this.dataList[data.rowIndex].sixthMonthRemainRate = null
            this.dataList[data.rowIndex].fifthMonthRemain = null
            this.dataList[data.rowIndex].fifthMonthRemainRate = null
            this.dataList[data.rowIndex].fourthMonthRemain = null
            this.dataList[data.rowIndex].fourthMonthRemainRate = null
            this.dataList[data.rowIndex].thirdMonthRemain = null
            this.dataList[data.rowIndex].thirdMonthRemainRate = null
          }
          if (data.rowIndex === 4) {
            this.dataList[data.rowIndex].sixthMonthRemain = null
            this.dataList[data.rowIndex].sixthMonthRemainRate = null
            this.dataList[data.rowIndex].fifthMonthRemain = null
            this.dataList[data.rowIndex].fifthMonthRemainRate = null
            this.dataList[data.rowIndex].fourthMonthRemain = null
            this.dataList[data.rowIndex].fourthMonthRemainRate = null
            this.dataList[data.rowIndex].thirdMonthRemain = null
            this.dataList[data.rowIndex].thirdMonthRemainRate = null
            this.dataList[data.rowIndex].secondMonthRemain = null
            this.dataList[data.rowIndex].secondMonthRemainRate = null
          }
          return 'table_bg'
        }
      }
    }
    // /**
    //  * 深拷贝
    //  */
    // deepCopy(obj) {
    //   var result = Array.isArray(obj) ? [] : {}
    //   for (var key in obj) {
    //     if (obj.hasOwnProperty(key)) {
    //       if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         result[key] = this.deepCopy(obj[key]) // 递归复制
    //       } else {
    //         result[key] = obj[key]
    //       }
    //     }
    //   }
    //   return result
    // }
  }
}
</script>

<style lang="scss">
// 数据分析板块标题栏
.data-analysis.title-bar {
  // 板块标题栏
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    padding: 16px 10px;
    .tit-lf {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 17px;
      font-weight: bold;
      padding-left: 6px;
      color: #333;
    }
    .tit-lf::before {
      display: block;
      content: '';
      width: 3px;
      height: 16px;
      background: #155bd4;
      margin-right: 5px;
      border-radius: 8px;
    }
    .tit-rg {
      display: flex;
      align-items: center;
      font-size: 14px;
      .statistics-time {
        margin-right: 10px;
        .select-mod {
          width: 120px;
        }
      }
      .date-display {
        font-size: 12px;
        color: #666;
      }
      .refresh {
        font-size: 12px;
        color: #02A1E9;
        padding-left: 10px;
      }
    }
  }
}
.customer-profile.customer-retention-analysis {
  // 选项卡
  .tabs {
    margin-top: 20px;
    .el-tabs__item.is-active {
      color: #155bd4;
    }
    .el-tabs__item:hover {
      color: #155bd4;
    }
  }
  // 表格
  .table-box {
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 14px;
    .el-table {
      border-bottom: 0;
      border: 1px solid #EAF0F4;
      border-bottom: none;
      th.is-leaf, td {
        border-color: #EAF0F4;
      }
      .has-gutter {
        tr, th {
          background: #f7f8fa;
        }
        .cell {
          color: #000;
          font-weight: bold;
        }
      }
      tr {
        height: 56px;
      }
    }
    .el-table .cell {
      color: #666;
    }
  }
}
</style>
