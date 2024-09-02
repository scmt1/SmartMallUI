<template>
  <div class="cust-retention">
    <!-- header部分 -->
    <div class="new-page-title">
        <!-- 左边 -->
        <div class="title-left">
          <p class="line"></p>
          <span class="text">{{$t('dataAnalysis.customerRetentionAnalysis')}}</span>
        </div>
        <!-- 右边 -->
        <div class="new-page-title-right">
          <div class="title-right">
            <div class="time-left">
              <el-select size="small" style="margin-right: 10px;" v-model="rangeValue" @change="setDateRange(rangeValue)" placeholder="请选择">
                <el-option
                  v-for="item in rangeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="time-right">
              <span
                class="title-time"
                v-if="rangeValue === 1 || rangeValue === 2 || rangeValue === 3"
              >{{this.dateRange[0]}}{{$t('date.tip')}}{{this.dateRange[1]}}</span>
            </div>
          </div>
        </div>
      </div>
    <!-- /header部分 -->

    <!-- 选择展示信息 -->
    <div class="type">
      <el-tabs type="card" v-model="retainType">
        <el-tab-pane :label="$t('dataAnalysis.browseRetention')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('dataAnalysis.dealRetention')" name="2"></el-tab-pane>
      </el-tabs>
      <div class="right-time">
        <el-button size="mini" type="text" @click="refreshRetainedData()">
          {{$t('dataAnalysis.clearCache')}}
          <el-popover placement="top" width="300" trigger="hover" style="margin-left: 5px;" :content="$t('dataAnalysis.clearCacheTip')">
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </el-button>
        <el-select style="height: 32px;" v-model="typeValue" :placeholder="$t('tip.select')" disabled>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <!-- /选择展示信息 -->

    <!-- 表格 -->
    <div class="three-chart five-chart">
      <el-table
        border
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row-row"
        style="width: 100%"
      >
        <el-table-column fixed prop="currentMonth" v-if="retainType==2" :label="$t('dataAnalysis.dealTime')" width="180"></el-table-column>
        <el-table-column prop="newCustomers" v-if="retainType==2" :label="$t('dataAnalysis.numberOfNewCustomersTraded')" width="180"></el-table-column>
        <el-table-column fixed prop="currentMonth" v-if="retainType==1" :label="$t('dataAnalysis.accessTime')" width="180"></el-table-column>
        <el-table-column prop="newCustomers" v-if="retainType==1" :label="$t('dataAnalysis.newCustomer')" width="180"></el-table-column>

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
    <!-- /表格 -->
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      // 时间范围
      rangeValue: 2, // 1最近1个月 2最近3个月 3最近6个月 4最近1年
      rangeOptions: [
        {
          label: this.$i18n.t('dataAnalysis.last3M'),
          value: 2
        },
        {
          label: this.$i18n.t('dataAnalysis.last6M'),
          value: 3
        },
        {
          label: this.$i18n.t('dataAnalysis.last1Y'),
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
      dataList: [],
      colLength: 0
    }
  },
  mounted () {
    this.setDateRange(this.rangeValue)
    this.getRetentionData()
  },
  watch: {
    rangeValue (val) {
      this.getRetentionData()
    },
    retainType (val) {
      this.getRetentionData()
    }

  },
  methods: {
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
      this.dateRange = [startTime, endTime]
    },
    /**
     * 深拷贝
     */
    deepCopy (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key])   // 递归复制
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    /**
     *获取 成交留存数据
     */
    getRetentionData () {
      if (this.rangeValue === 1) {
        this.colLength = 1
      } else if (this.rangeValue === 2) {
        this.colLength = 2
      } else if (this.rangeValue === 3) {
        this.colLength = 5
      } else if (this.rangeValue === 4) {
        this.colLength = 6
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getCustomerRetained'),
        method: 'get',
        params: this.$http.adornParams({
          dateType: this.rangeValue, // 1最近1个月 2最近3个月 3最近6个月 4最近1年
          retainType: this.retainType, // 1访问留存  2成交留存
          dateRetainType: this.typeValue, // 1月留存 2周留存 暂时不统计周留存
          startTime: this.dateRange[0] + ' 00:00:00', // yyyy-MM-dd HH:mm:ss
          endTime: this.dateRange[1] + ' 23:59:59' // yyyy-MM-dd HH:mm:ss
        })
      }).then(({ data }) => {
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
        url: this.$http.adornUrl('/platform/customerAnalysis/refreshRetainedData'),
        method: 'get',
        params: this.$http.adornParams({}),
        timeout: 1000 * 60 * 10
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1000
        })
        this.getRetentionData()
      })
    },
    table_bg (data) {
      // console.log('data', data)
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
      return ''
    }
  }
}
</script>

<style lang="scss">
.cust-retention {
  /* header部分内容 */
  .header {
    display: flex;
    align-items: center;
  }

  .header .title {
    display: flex;
    align-items: center;
    line-height: 20px;
    color: #323233;
    font-weight: 500;
  }

  .header .title:before {
    width: 3px;
    height: 14px;
    content: "";
    background-color: #155bd4;
    margin-right: 8px;
  }

  .header .time {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-end;
    text-align: right;
  }

  /* /header部分内容 */

  /* 选择展示信息 */
  .type {
    position: relative;
  }

  .type .right-time {
    position: absolute;
    top: 0;
    right: 16px;
  }

  .type .right-time input {
    width: 230px;
    height: 32px;
  }

  /* /选择展示信息 */
}

.table_bg {
  background: #6bc1ff;
}
 .new-page-title  {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .new-page-title-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .title-right {
    display: flex;
    align-items: center;
    .title-time {
      padding-right: 0;
    }
  }
  .title-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
