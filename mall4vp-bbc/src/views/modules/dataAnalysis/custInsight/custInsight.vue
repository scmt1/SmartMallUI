<template>
  <!-- 客户洞察 -->
  <div class="cust-home">
    <!-- 客户洞察头部 -->
    <!-- <div class="header">
      <div class="header-title">{{$t('dataAnalysis.customeriInsight')}}</div> -->
      <!-- <div class="header-text">公开内测中</div> -->
    <!-- </div> -->

    <!-- RFM模型分析 -->
    <div class="main">
      <!-- 主要页面第一部分 -->
      <div class="main-one">
        <div class="one-title">{{$t('dataAnalysis.RMF')}}</div>
        <!-- 第一种选择时间栏 -->
        <div class="one-time">
          <div class="time-select">
            <span class="el-form-item">{{$t('dataAnalysis.timeBefore')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                size="small"
                v-model="value1"
                type="date"
                :placeholder="$t('tip.select')"
                class="time-border"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('dataAnalysis.before')}}</span>
            <el-select v-model="value2" :placeholder="$t('date.a')" class="el-form-item" size="small">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="el-form-item">{{$t('dataAnalysis.cusData')}}</span>
          </div>
          <!-- 绑定下面表格数据 -->
          <div class="one-time-right">
            <div class="default-btn primary-btn" @click="buttonRFM()">{{$t('dataAnalysis.filter')}}</div>
            <!--            <button class="one-time-screen" @click="buttonRFM()">筛选</button>-->
          </div>
        </div>
        <div>
          <!-- 按钮的切换，绑定三个数据表格页面 -->
          <div class="one-radio">
            <span class="el-form-item">{{$t('dataAnalysis.selectIndicators1')}}</span>
            <el-radio-group v-model="radio1">
              <!-- 这里radio1默认绑定了' :label1="1" ',所以最开始默认选中的就是第一个，radio1绑定的就是下面的label值 -->
              <el-radio :label="1">{{$t('dataAnalysis.customersPro')}}</el-radio>
              <el-radio :label="2">{{$t('dataAnalysis.cumulativePayment')}}</el-radio>
              <el-radio :label="3">{{$t('dataAnalysis.customerUnitPrice')}}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 这个表格有点难弄，先放着，占位先 -->
        <!-- show-summary
        :summary-method="getSummaries"-->
        <div class="one-table">
          <el-table
            :data="tableData1"
            border
            header-cell-class-name="cust-table-header"
            style="width: 100%"
            :cell-class-name="tableRowClassName"
          >
            <el-table-column prop="recencyName" :label="$t('dataAnalysis.RF')" width="180"></el-table-column>
            <el-table-column prop="amount1" label="F=1">
              <template slot-scope="scope">
                <!-- 点击按钮，响应页面展示就是这部分 -->
                <!-- radio1绑定的就是下面的label值，所以通过v-if条件判断来响应按钮的点击与页面的展示 -->
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyers1 }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}}{{scope.row.payBuyers1Rate}}%</span>
                </template>
                <template v-else-if="radio1 === 2">
                  <!-- <span class="hidden">{{'hidden'}}</span> -->
                  <!-- <br /> -->
                  <span class="row-text">{{ scope.row.payAmount1 }} {{$t('dataAnalysis.yuan')}}</span>
                  <!-- <br /> -->
                  <!-- <span class="hidden">{{'hidden'}}</span> -->
                </template>
                <template v-else>
                  <!-- <span class="hidden">{{'hidden'}}</span> -->
                  <!-- <br /> -->
                  <span>{{ scope.row.priceSingle1 }} {{$t('dataAnalysis.yuan')}}</span>
                  <!-- <br /> -->
                  <!-- <span class="hidden">{{'hidden'}}</span> -->
                </template>
                <!-- <template v-else-if="value2 === 1 && scope.row.recency === 5">-</template> -->
              </template>
            </el-table-column>
            <el-table-column prop="amount2" label="F=2">
              <template slot-scope="scope">
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyers2 }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}} {{scope.row.payBuyers2Rate}}%</span>
                </template>
                <template v-else-if="radio1=== 2">
                  <span>{{ scope.row.payAmount2 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row.priceSingle2 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="amount3" label="F=3">
              <template slot-scope="scope">
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyers3 }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}} {{scope.row.payBuyers3Rate}}%</span>
                </template>
                <template v-else-if="radio1 === 2">
                  <span>{{ scope.row.payAmount3 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row.priceSingle3 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="amount4" label="F=4">
              <template slot-scope="scope">
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyers4 }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}} {{scope.row.payBuyers4Rate}}%</span>
                </template>
                <template v-else-if="radio1 === 2">
                  <span>{{ scope.row.payAmount4 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row.priceSingle4 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="amount5" label="F>=5">
              <template slot-scope="scope">
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyers5 }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}} {{scope.row.payBuyers5Rate}}%</span>
                </template>
                <template v-else-if="radio1 === 2">
                  <span>{{ scope.row.payAmount5 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row.priceSingle5 }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="amountAll" :label="$t('dataAnalysis.rowTotal')">
              <template slot-scope="scope">
                <template v-if="radio1 === 1">
                  <span>{{ scope.row.payBuyersTotal }} {{$t('groups.people')}}</span>
                  <br />
                  <span>{{$t('home.Percentage')}} {{scope.row.payBuyersTotalRate}}%</span>
                </template>
                <template v-else-if="radio1 === 2">
                  <span>{{ scope.row.payAmountTotal }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
                <template v-else>
                  <span>{{ scope.row.priceSingleTotal }} {{$t('dataAnalysis.yuan')}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 主要页面第二部分 -->
      <div class="main-one">
        <div class="one-title">{{$t('dataAnalysis.analysisOfConsumptionCapacity')}}</div>
        <div class="one-time two-time">
          <div>
            <!-- 第二种时间选择栏 -->
            <span class="el-form-item">{{$t('order.paymentTime')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                size="small"
                v-model="dateValue2StartTime"
                type="date"
                :placeholder="$t('date.start')"
                class="time-border"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('date.tip')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                size="small"
                v-model="dateValue2EndTime"
                type="date"
                :placeholder="$t('date.end')"
                class="time-border"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('dataAnalysis.newOrOld')}}</span>
            <el-select v-model="value3" :placeholder="$t('dataAnalysis.allCus')" class="el-form-item" size="small">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="one-time-right">
            <!-- <button @click="payAmountDistribution()" class="one-time-screen two-time-screen">筛选</button>-->
            <div
              class="default-btn primary-btn"
              @click="payAmountDistribution()"
            >{{$t('dataAnalysis.filter')}}</div>
          </div>
        </div>
        <div class="main-two-text">
          <div>
            <span>{{$t('dataAnalysis.payAmountMap')}}</span>
            <!-- <a target="_blank" rel="noopener noreferrer">导出数据</a> -->
          </div>
          <p>{{$t('dataAnalysis.mapText')}}</p>
        </div>
        <div>
          <!-- 三个按钮绑定三个不同的数据图 -->
          <div class="one-radio">
            <span class="el-form-item">{{$t('dataAnalysis.selectIndicators1')}}</span>
            <el-radio-group v-model="radio2">
              <el-radio :label="1">{{$t('dataAnalysis.customers')}}</el-radio>
              <el-radio :label="2">{{$t('dataAnalysis.totalPayment')}}</el-radio>
              <el-radio :label="3">{{$t('dataAnalysis.goodsPaid')}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 第二部分柱形数据图 -->
        <div class="main-two-chart">
          <div class="integral-plate" id="main-two-chart" style="width:100%;height:200px;"></div>
        </div>
        <div class="main-two-text">
          <div>
            <span>{{$t('dataAnalysis.payment')}}</span>
          </div>
        </div>
        <!-- 支付金额数据表 -->
        <div class="main-two-table">
          <el-table :data="tableData2"
            header-cell-class-name="table-header"
            row-class-name="table-row-row"
            stripe style="width: 100%">
            <el-table-column prop="section" :label="$t('dataAnalysis.amountRange')" width="180"></el-table-column>
            <el-table-column prop="custs" :label="$t('dataAnalysis.customers')" width="180"></el-table-column>
            <el-table-column prop="custPro" :label="$t('dataAnalysis.customPro')"></el-table-column>
            <el-table-column prop="commons" :label="$t('dataAnalysis.goodsPaid')"></el-table-column>
            <el-table-column prop="pers" :label="$t('dataAnalysis.perCapitaPaidCounts')"></el-table-column>
            <el-table-column prop="payment" :label="$t('dataAnalysis.totalPaymentYuan')"></el-table-column>
            <el-table-column prop="paymentPro" :label="$t('dataAnalysis.payTotalPro')"></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 主要页面第三部分 -->
      <div class="main-one">
        <div class="one-title">{{$t('dataAnalysis.cFA')}}</div>
        <div class="one-time two-time">
          <div>
            <span class="el-form-item">{{$t('order.paymentTime')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                v-model="dateValue3StartTime"
                type="date"
                :placeholder="$t('date.start')"
                class="time-border"
                size="small"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('date.tip')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                v-model="dateValue3EndTime"
                type="date"
                :placeholder="$t('date.end')"
                class="time-border"
                size="small"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('dataAnalysis.newOrOld')}}</span>
            <el-select v-model="value4" :placeholder="$t('dataAnalysis.allCus')" class="el-form-item" size="small">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="one-time-right">
            <!--            <button @click="getConsumeFreAnalysis()" class="one-time-screen two-time-screen">筛选</button>-->
            <div
              class="default-btn primary-btn"
              @click="getConsumeFreAnalysis()"
            >{{$t('dataAnalysis.filter')}}</div>
          </div>
        </div>
        <div class="main-two-text">
          <div>
            <span>{{$t('dataAnalysis.buyDis')}}</span>
            <!-- <a target="_blank" rel="noopener noreferrer">导出数据</a> -->
          </div>
        </div>
        <div>
          <div class="one-radio">
            <span class="el-form-item">{{$t('dataAnalysis.selectIndicators1')}}</span>
            <el-radio-group v-model="radio3">
              <el-radio :label="1">{{$t('dataAnalysis.customers')}}</el-radio>
              <el-radio :label="2">{{$t('dataAnalysis.totalPayment')}}</el-radio>
              <el-radio :label="3">{{$t('dataAnalysis.goodsPaid')}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="main-two-chart">
          <div class="integral-plate" id="main-three-chart" style="width:100%;height:200px;"></div>
        </div>
        <div class="main-two-text">
          <div>
            <span>{{$t('dataAnalysis.buyDet')}}</span>
          </div>
        </div>
        <div class="main-two-table">
          <el-table :data="tableData3"
           header-cell-class-name="table-header"
           row-class-name="table-row-row"
           stripe style="width: 100%">
            <el-table-column prop="times" :label="$t('dataAnalysis.buyTimes')" width="180"></el-table-column>
            <el-table-column prop="custs" :label="$t('dataAnalysis.customers')" width="180"></el-table-column>
            <el-table-column prop="custPro" :label="$t('dataAnalysis.customPro')"></el-table-column>
            <el-table-column prop="commons" :label="$t('dataAnalysis.goodsPaid')"></el-table-column>
            <el-table-column prop="pers" :label="$t('dataAnalysis.perCapitaPaidCounts')"></el-table-column>
            <el-table-column prop="payment" :label="$t('dataAnalysis.totalPaymentYuan')"></el-table-column>
            <el-table-column prop="paymentPro" :label="$t('dataAnalysis.payTotalPro')"></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 主要页面第四部分 -->
      <div class="main-one">
        <div class="one-title">{{$t('dataAnalysis.cycAnalysis')}}</div>
        <div class="one-time two-time three-time">
          <div>
            <span class="el-form-item">{{$t('order.paymentTime')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                v-model="dateValue4StartTime"
                type="date"
                :placeholder="$t('date.start')"
                class="time-border"
                size="small"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('date.tip')}}</span>
            <div class="block el-form-item">
              <el-date-picker
                v-model="dateValue4EndTime"
                type="date"
                :placeholder="$t('date.end')"
                class="time-border"
                size="small"
                :picker-options="pickerBeforeMonthOptions"
              ></el-date-picker>
            </div>
            <span class="el-form-item">{{$t('dataAnalysis.newOrOld')}}</span>
            <el-select v-model="value5" :placeholder="$t('dataAnalysis.allCus')" class="el-form-item" size="small">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="one-time-right">
            <!--            <button @click="getConsumeRepurchaseCount()" class="one-time-screen two-time-screen">筛选</button>-->
            <div
              class="default-btn primary-btn"
              @click="getConsumeRepurchaseCount()"
            >{{$t('dataAnalysis.filter')}}</div>
          </div>
          <!-- <p>经统计，平均回购周期为0天</p> -->
        </div>
        <div class="main-two-text">
          <div>
            <!-- <span>回购周期分布明细</span> -->
            <!-- <a target="_blank" rel="noopener noreferrer">导出数据</a> -->
          </div>
        </div>
        <div>
          <!-- 这里是绑定一个天数的获取 -->
          <div class="one-radio two-radio">
            <span class="el-form-item">{{$t('dataAnalysis.cycInt')}}</span>
            <el-radio-group v-model="radio4" @change="changeRepurchaseCount()">
              <el-radio :label="10">{{$t('dataAnalysis.tenDays')}}</el-radio>
              <el-radio :label="30">{{$t('dataAnalysis.thirtyDays')}}</el-radio>
            </el-radio-group>
          </div>
          <!-- 这里是绑定下面表格的数据图切换 -->
          <div class="one-radio two-radio">
            <span class="el-form-item">{{$t('dataAnalysis.selectIndicators1')}}</span>
            <el-radio-group v-model="radio5">
              <el-radio :label="1">{{$t('dataAnalysis.payM')}}</el-radio>
              <!-- <el-radio :label="2">购买频次(F)</el-radio> -->
            </el-radio-group>
          </div>
        </div>
        <!-- 默认第一个数据图 -->
        <div class="main-two-table">
          <el-table :data="tableData4"
            header-cell-class-name="table-header"
            row-class-name="table-row-row"
            stripe style="width: 100%; margin: 20px 0">
            <!-- <el-table-column prop="times" label="回购周期" width="180"></el-table-column> -->
            <el-table-column prop="custs" :label="$t('dataAnalysis.customers')" width="180"></el-table-column>
            <el-table-column prop="custPro" :label="$t('dataAnalysis.customPro')"></el-table-column>
            <el-table-column prop="commons" :label="$t('dataAnalysis.cumulativeProportion')"></el-table-column>
            <el-table-column prop="pers" :label="$t('dataAnalysis.totalAvg')"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      // 时间的点击获取，目前设计是只统计最近两年时间的数据
      pickerOptions: {
        disabledDate (time) {
          let date = moment().startOf('days').valueOf()
          // 当前时间前两年的时间
          let preYearDate = moment().subtract(2, 'years').valueOf()
          return (
            time.getTime() > date ||
            time.getTime() < preYearDate
          )
        }
      },
      // 当前时间 14天至昨天的时间点禁止选择其他时间
      pickerBeforeMonthOptions: {
        disabledDate (time) {
          // var now = new Date()
          // var date = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 1)
          // var nowMonth = now.getMonth() // 当前月
          // var nowYear = now.getFullYear() // 当前年
          // var nowDay = now.getDate() // 当前天
          // // 本月的开始时间
          // var monthStartDate = new Date(nowYear, nowMonth, nowDay - 14)
          // let curDate = monthStartDate.getTime()
          // return (
          //   time.getTime() < curDate ||
          //   time.getTime() > date.getTime()
          // )
          let date = moment().startOf('days').valueOf()
          return (
            time.getTime() > date
          )
        }
      },
      // 切换按钮的静态数据
      options1: [{
        value: 0,
        label: this.$i18n.t('date.a')
      }, {
        value: 1,
        label: this.$i18n.t('dataAnalysis.aYear')
      }],
      options2: [{
        value: 0,
        label: this.$i18n.t('dataAnalysis.allCus')
      }, {
        value: 1,
        label: this.$i18n.t('dataAnalysis.newCus')
      }, {
        value: 2,
        label: this.$i18n.t('dataAnalysis.oldCus')
      }],
      // 第一个大表格的数据
      tableData1: [
        {
          recencyName: 'R<=30',
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        },
        {
          recencyName: '30<R<=90',
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        },
        {
          recencyName: '90<R<=180',
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        },
        {
          recencyName: '180<R<=365',
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        },
        {
          recencyName: 'R>365',
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        },
        {
          recencyName: this.$i18n.t('dataAnalysis.colTotal'),
          amount1: 0,
          amount2: 0,
          amount3: 0,
          amount4: 0,
          amount5: 0,
          amountAll: 0,
          frequency: 0,
          payAmount1: 0,
          payBuyers1: 0,
          payBuyers1Rate: 0,
          priceSingle1: 0,
          payAmount2: 0,
          payBuyers2: 0,
          payBuyers2Rate: 0,
          priceSingle2: 0,
          payAmount3: 0,
          payBuyers3: 0,
          payBuyers3Rate: 0,
          priceSingle3: 0,
          payAmount4: 0,
          payBuyers4: 0,
          payBuyers4Rate: 0,
          priceSingle4: 0,
          payAmount5: 0,
          payBuyers5: 0,
          payBuyers5Rate: 0,
          priceSingle5: 0,
          recency: 0,
          payAmountTotal: 0,
          payBuyersTotal: 0,
          payBuyersTotalRate: 0,
          priceSingleTotal: 0
        }
      ],
      tableData2: [{
        section: this.$i18n.t('dataAnalysis.zeroTo50'),
        custs: '1',
        custPro: '100%',
        commons: '1',
        pers: '1',
        payment: '0.01',
        paymentPro: '100%'
      }],
      tableData3: [{
        times: this.$i18n.t('dataAnalysis.buyOne'),
        custs: '1',
        custPro: '100%',
        commons: '1',
        pers: '1',
        payment: '0.01',
        paymentPro: '100%'
      }],
      tableData4: [{
        times: this.$i18n.t('dataAnalysis.notRebuy'),
        custs: '1',
        custPro: '100%',
        commons: '100%',
        pers: '0.01'
      }],
      // 一些默认的静态的传参
      value1: '',
      value2: 0,
      value3: 0,
      value4: 0,
      value5: 0,
      radio1: 1,
      radio2: 1,
      radio3: 1,
      radio4: 10,
      radio5: 1,
      value3Temp: 0,
      value4Temp: 0,
      dateValue2StartTime: null,
      dateValue2EndTime: null,
      secondLeftData: [],
      payBuyersTotal1: 0,
      payAmountTotal1: 0,
      dateValue3StartTime: null,
      dateValue3EndTime: null,
      thirdLeftData2: [],
      payBuyersTotal2: 0,
      payAmountTotal2: 0,
      dateValue4StartTime: null,
      dateValue4EndTime: null,
      payBuyersTotal3: 0,
      payAmountTotal3: 0,
      payProdCountTotal3: 0,

      twoSourceData: {
        end: 0,
        newPayAmount: 0,
        newPayBuyers: 0,
        newPayProdCount: 0,
        oldPayAmount: 0,
        oldPayBuyers: 0,
        oldPayProdCount: 0,
        start: 0
      },
      trendTwoRight: {
        newValue: 0,
        oldValue: 0
      },
      trendTwoRightType: this.$i18n.t('groups.people'),
      trendTwoTipRate: [0, 0], // new,old
      twoAllProdCount: 0,

      threeSourceData: {
        end: 0,
        newPayAmount: 0,
        newPayBuyers: 0,
        newPayProdCount: 0,
        oldPayAmount: 0,
        oldPayBuyers: 0,
        oldPayProdCount: 0,
        start: 0
      },
      trendThreeRight: {
        newValue: 0,
        oldValue: 0
      },
      trendThreeRightType: this.$i18n.t('groups.people'),
      trendThreeTipRate: [0, 0], // new,old
      threeAllProdCount: 0
    }
  },

  watch: {
    radio2 (val) {
      this.radio2Switch()
    },
    radio3 (val) {
      this.radio3Switch()
    }
  },
  mounted () {
    // 两个动态数据图的初始化调用
    this.getMainTwoChart()
    this.getMainThreeChart()
    // 数据初始化, RFM模型分析
    this.value1 = moment().endOf('days').format('LL')
    const start = moment().add(-1, 'month').startOf('days').valueOf()
    const end = moment().format('L')
    // 数据初始化，消费能力分析
    this.dateValue2StartTime = start
    this.dateValue2EndTime = end
    this.dateValue3StartTime = start
    this.dateValue3EndTime = end
    this.dateValue4StartTime = start
    this.dateValue4EndTime = end
    this.payAmountDistribution()
    this.getConsumeFreAnalysis()
    this.getConsumeRepurchaseCount()
    this.buttonRFM()
  },

  methods: {
    // 第一个大表格的列合算总和
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$i18n.t('dataAnalysis.colTotal')
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (this.radio1 === 1) {
            sums[index] += ` ${this.$i18n.t('groups.people')}`
          } else {
            sums[index] += ` ${this.$i18n.t('groups.yuan')}`
          }
        } else {
          sums[index] = '-'
        }
      })

      return sums
    },
    /**
     * 请求数据
     */
    buttonRFM () {
      if (!this.value1) {
        return this.$message.error(this.$i18n.t('dataAnalysis.latestPayTime'))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getCustomerRFMSecond'),
        method: 'get',
        params: this.$http.adornParams(
          {
            recentTime: moment(this.value1).format('LL'),
            type: this.value2
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.tableData1 = data
          this.tableData1.forEach(i => {
            if (i.payBuyers1Rate) {
              i.payBuyers1Rate = (i.payBuyers1Rate * 100).toFixed(2)
            }
            if (i.payBuyers2Rate) {
              i.payBuyers2Rate = (i.payBuyers2Rate * 100).toFixed(2)
            }
            if (i.payBuyers3Rate) {
              i.payBuyers3Rate = (i.payBuyers3Rate * 100).toFixed(2)
            }
            if (i.payBuyers4Rate) {
              i.payBuyers4Rate = (i.payBuyers4Rate * 100).toFixed(2)
            }
            if (i.payBuyers5Rate) {
              i.payBuyers5Rate = (i.payBuyers5Rate * 100).toFixed(2)
            }
            if (i.payBuyersTotalRate) {
              if (i.payBuyersTotalRate === 1) {
                i.payBuyersTotalRate = (i.payBuyersTotalRate * 100).toFixed(0)
              } else {
                i.payBuyersTotalRate = (i.payBuyersTotalRate * 100).toFixed(2)
              }
            }
          })
        }
      })
    },
    // echart的两个数据图，有点难搞！
    // 第二部分的Echart图
    getMainTwoChart () {
      const myChart = this.$echarts.init(document.getElementById('main-two-chart'), 'walden')
      let _this = this
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: ''
          },
          formatter: function (params) {
            var res = '<div><p>' + '</p></div>'
            if (_this.value3Temp === 1) {
              res +=
                '<p>' + params[0].marker + params[0].seriesName + '：' + params[0].data + '&emsp;' + _this.trendTwoTipRate[0] + '</p>'
            } else if (_this.value3Temp === 2) {
              res +=
                '<p>' + params[1].marker + params[1].seriesName + '：' + params[1].data + '&emsp;' + _this.trendTwoTipRate[1] + '</p>'
            } else {
              for (var i = 0; i < params.length; i++) {
                res +=
                  '<p>' + params[i].marker + params[i].seriesName + '：' + params[i].data + '&emsp;' + _this.trendTwoTipRate[i] + '</p>'
              }
            }
            return res
          }
        },
        grid: {
          left: '3%',
          top: '4%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          type: 'category',
          // 静态
          data: [this.tableData2[0].section]
          // data: this.secondLeftData
        },
        series: [
          {
            label: {
              show: true,
              position: 'right',
              formatter: function (params) {
                if (_this.value3Temp === 2) {
                  return ''
                } else {
                  return params.data + _this.trendTwoRightType
                }
              },
              color: '#000'
            },
            name: this.$i18n.t('dataAnalysis.nCus'),
            type: 'bar',
            data: [this.trendTwoRight.newValue],
            // barWidth: 设置宽度大小
            barWidth: 20,
            // 设置颜色
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    '#00B0FF'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
            label: {
              show: true,
              position: 'right',
              formatter: function (params) {
                if (_this.value3Temp === 1) {
                  return ''
                } else {
                  return params.data + _this.trendTwoRightType
                }
              },
              color: '#000'
            },
            name: this.$i18n.t('dataAnalysis.oCus'),
            type: 'bar',
            data: [this.trendTwoRight.oldValue || 0],
            // barWidth: 设置宽度大小
            barWidth: 20,
            // 设置颜色
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    '#3DD86B'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }]
      }
      if (this.value3Temp === 1) {
        option.series[0].label.show = true
        option.series[1].label.show = false
      } else if (this.value3Temp === 2) {
        option.series[0].label.show = false
        option.series[1].label.show = true
      } else {
        option.series[0].label.show = true
        option.series[1].label.show = true
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 第二部分请求数据
     */
    payAmountDistribution () {
      if (!this.dateValue2StartTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTST'))
      }
      if (!this.dateValue2EndTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTET'))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getConsumePower'),
        method: 'get',
        params: this.$http.adornParams(
          {
            startTime: moment(this.dateValue2StartTime).format('LL'),
            endTime: moment(this.dateValue2EndTime).format('LL'),
            type: this.value3
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.value3Temp = Number(this.value3)
          this.twoSourceData = data
          var arr = [data.start + '~' + data.end + this.$i18n.t('dataAnalysis.yuan')]
          this.secondLeftData = arr
          var payBuyers = data.newPayBuyers + data.oldPayBuyers
          var prodCount = data.newPayProdCount + data.oldPayProdCount
          var payAmountTotal = data.newPayAmount + data.oldPayAmount
          this.tableData2[0].section = '0~' + data.end + this.$i18n.t('dataAnalysis.yuan')
          this.tableData2[0].custs = payBuyers + ''
          this.tableData2[0].commons = prodCount
          if (payBuyers <= 0) {
            this.tableData2[0].pers = 0
          } else {
            let pers = (prodCount / payBuyers).toFixed(0)
            this.tableData2[0].pers = pers
          }
          this.tableData2[0].payment = payAmountTotal.toFixed(2)
          if (this.value3 === 0) {
            this.twoAllProdCount = prodCount
            this.payBuyersTotal1 = payBuyers
            this.payAmountTotal1 = payAmountTotal
            if (this.tableData2[0].custs > 0) {
              this.tableData2[0].custPro = 100 + '%'
            } else {
              this.tableData2[0].custPro = 0 + '%'
            }
            if (payAmountTotal <= 0) {
              this.tableData2[0].paymentPro = 0 + '%'
            } else {
              this.tableData2[0].paymentPro = 100 + '%'
            }
          } else {
            this.tableData2[0].custPro = ((payBuyers / this.payBuyersTotal1) * 100).toFixed(2) + '%'
            this.tableData2[0].paymentPro = ((payAmountTotal / this.payAmountTotal1) * 100).toFixed(2) + '%'
          }
        } else {
          var arr2 = [0 + '~' + 50 + this.$i18n.t('dataAnalysis.yuan')]
          this.secondLeftData = arr2
        }
        this.radio2Switch()
      })
    },

    // 第三部分的Echart图
    getMainThreeChart () {
      const myChart = this.$echarts.init(document.getElementById('main-three-chart'), 'walden')
      let _this = this
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: ''
          },
          formatter: function (params) {
            var res = '<div><p>' + '</p></div>'
            if (_this.value4Temp === 1) {
              res +=
                '<p>' + params[0].marker + params[0].seriesName + '：' + params[0].data + '&emsp;' + _this.trendThreeTipRate[0] + '</p>'
            } else if (_this.value4Temp === 2) {
              res +=
                '<p>' + params[1].marker + params[1].seriesName + '：' + params[1].data + '&emsp;' + _this.trendThreeTipRate[1] + '</p>'
            } else {
              for (var i = 0; i < params.length; i++) {
                res +=
                  '<p>' + params[i].marker + params[i].seriesName + '：' + params[i].data + '&emsp;' + _this.trendThreeTipRate[i] + '</p>'
              }
            }
            return res
          }
        },
        grid: {
          left: '3%',
          top: '4%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.thirdLeftData2
        },
        series: [
          {
            label: {
              show: true,
              position: 'right',
              // formatter: '{c}' + this.trendThreeRightType,
              formatter: function (params) {
                if (_this.value4Temp === 2) {
                  return ''
                } else {
                  return params.data + _this.trendThreeRightType
                }
              },
              color: '#000'
            },
            name: this.$i18n.t('dataAnalysis.nCus'),
            type: 'bar',
            data: [this.trendThreeRight.newValue],
            barWidth: 20,
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    '#00B0FF'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
            label: {
              show: true,
              position: 'right',
              formatter: function (params) {
                if (_this.value4Temp === 1) {
                  return ''
                } else {
                  return params.data + _this.trendThreeRightType
                }
              },
              color: '#000'
            },
            name: this.$i18n.t('dataAnalysis.oCus'),
            type: 'bar',
            data: [this.trendThreeRight.oldValue],
            barWidth: 20,
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    '#3DD86B'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      if (this.value4Temp === 1) {
        option.series[0].label.show = true
        option.series[1].label.show = false
      } else if (this.value4Temp === 2) {
        option.series[0].label.show = false
        option.series[1].label.show = true
      } else {
        option.series[0].label.show = true
        option.series[1].label.show = true
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    /**
     * 第三部分请求数据, 消费频次分析
     */
    getConsumeFreAnalysis () {
      if (!this.dateValue3StartTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTST'))
      }
      if (!this.dateValue3EndTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTET'))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getConsumeFrequency'),
        method: 'get',
        params: this.$http.adornParams(
          {
            startTime: moment(this.dateValue3StartTime).format('LL'),
            endTime: moment(this.dateValue3EndTime).format('LL'),
            type: this.value4
          }
        )
      }).then(({ data }) => {
        if (data) {
          this.value4Temp = Number(this.value4)
          this.threeSourceData = data
          this.tableData3[0].times = data.end
          var arr = [this.$i18n.t('dataAnalysis.buy') + data.end + this.$i18n.t('dataAnalysis.times')]
          this.thirdLeftData2 = arr
          var payBuyers = data.newPayBuyers + data.oldPayBuyers
          console.log('payBuyers', payBuyers)
          var prodCount = data.newPayProdCount + data.oldPayProdCount
          var payAmountTotal = data.newPayAmount + data.oldPayAmount
          this.tableData3[0].custs = payBuyers + ''
          this.tableData3[0].commons = prodCount
          if (payBuyers <= 0) {
            this.tableData3[0].pers = 0
          } else {
            let pers = (prodCount / payBuyers).toFixed(0)
            this.tableData3[0].pers = pers
          }
          this.tableData3[0].payment = payAmountTotal.toFixed(2)
          if (this.value4 === 0) {
            this.threeAllProdCount = prodCount
            this.payBuyersTotal2 = payBuyers
            this.payAmountTotal2 = payAmountTotal
            if (this.tableData3[0].custs > 0) {
              this.tableData3[0].custPro = 100 + '%'
            } else {
              this.tableData3[0].custPro = 0 + '%'
            }
            if (payAmountTotal <= 0) {
              this.tableData3[0].paymentPro = 0 + '%'
            } else {
              this.tableData3[0].paymentPro = 100 + '%'
            }
          } else {
            this.tableData3[0].custPro = ((payBuyers / this.payBuyersTotal2) * 100).toFixed(2) + '%'
            this.tableData3[0].paymentPro = ((payAmountTotal / this.payAmountTotal2) * 100).toFixed(2) + '%'
          }
          this.radio3Switch()
        }
      })
    },
    /**
     * 请求数据，回购周期分析
     */
    getConsumeRepurchaseCount () {
      if (!this.dateValue4StartTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTST'))
      }
      if (!this.dateValue4EndTime) {
        return this.$message.error(this.$i18n.t('dataAnalysis.PTET'))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/customerAnalysis/getConsumeRepurchaseCount'),
        method: 'get',
        params: this.$http.adornParams(
          {
            startTime: moment(this.dateValue4StartTime).format('LL'),
            endTime: moment(this.dateValue4EndTime).format('LL'),
            type: this.value5,
            cycle: this.radio4
          }
        )
      }).then(({ data }) => {
        if (data) {
          if (this.value5 === 0) {
            this.payBuyersTotal3 = data.detail[0].payBuyers
            this.payProdCountTotal3 = data.detail[0].payProdCount
          }
          this.tableData4[0].custs = data.detail[0].payBuyers
          if (data.detail[0].payBuyers === 0) {
            this.tableData4[0].custPro = 0 + '%'
            // 人均消费
            this.tableData4[0].pers = 0
          } else {
            // 人均消费
            this.tableData4[0].pers = (data.detail[0].payAmount / data.detail[0].payBuyers).toFixed(2)
            if (this.value5 === 0) {
              this.tableData4[0].custPro = 100 + '%'
            } else {
              this.tableData4[0].custPro = ((data.detail[0].payBuyers / this.payBuyersTotal3) * 100).toFixed(2) + '%'
            }
          }
          if (data.detail[0].payProdCount === 0) {
            this.tableData4[0].commons = 0 + '%'
          } else {
            if (this.value5 === 0) {
              this.tableData4[0].commons = 100 + '%'
            } else {
              this.tableData4[0].commons = ((data.detail[0].payProdCount / this.payProdCountTotal3) * 100).toFixed(2) + '%'
            }
          }
        }
      })
    },
    changeRepurchaseCount () {
      this.getConsumeRepurchaseCount()
    },
    /**
     * 表格样式处理
     */
    tableRowClassName ({ row, column, rowIndex, columnIndex }) {
      // rowIndex: 0~4 columnIndex: 1~5
      if ((rowIndex === 0 && columnIndex === 1) || (rowIndex === 1 && columnIndex === 2) || (rowIndex === 2 && columnIndex === 3) || (rowIndex === 3 && columnIndex === 4) || (rowIndex === 4 && columnIndex === 5)) {
        return 'row-column1'
      }
      if ((rowIndex === 1 && columnIndex === 1) || (rowIndex === 2 && columnIndex === 2) || (rowIndex === 3 && columnIndex === 3) || (rowIndex === 4 && columnIndex === 4)) {
        return 'row-column2'
      }
      if ((rowIndex === 2 && columnIndex === 1) || (rowIndex === 3 && columnIndex === 2) || (rowIndex === 4 && columnIndex === 3)) {
        return 'row-column3'
      }
      if ((rowIndex === 3 && columnIndex === 1) || (rowIndex === 4 && columnIndex === 2)) {
        return 'row-column4'
      }
      if ((rowIndex === 4 && columnIndex === 1)) {
        return 'row-column5'
      }
      if ((rowIndex === 0 && columnIndex === 2) || (rowIndex === 1 && columnIndex === 3) || (rowIndex === 2 && columnIndex === 4) || (rowIndex === 3 && columnIndex === 5)) {
        return 'column-row1'
      }
      if ((rowIndex === 0 && columnIndex === 3) || (rowIndex === 1 && columnIndex === 4) || (rowIndex === 2 && columnIndex === 5)) {
        return 'column-row2'
      }
      if ((rowIndex === 0 && columnIndex === 4) || (rowIndex === 1 && columnIndex === 5)) {
        return 'column-row3'
      }
      if ((rowIndex === 0 && columnIndex === 5)) {
        return 'column-row4'
      }
      return 'row-column-other'
    },
    /**
     * 第二部分，选择指标时，修改柱状图右侧数据
     */
    radio2Switch () {
      switch (this.radio2) {
        case 1:
          this.trendTwoRightType = this.$i18n.t('groups.people')
          this.trendTwoRight.newValue = this.twoSourceData.newPayBuyers
          this.trendTwoRight.oldValue = this.twoSourceData.oldPayBuyers
          if (this.value3Temp === 0) {
            var newVal = this.twoSourceData.newPayBuyers / this.tableData2[0].custs || 0
            newVal = (newVal * 100).toFixed(2) + '%'
            var oldVal = this.twoSourceData.oldPayBuyers / this.tableData2[0].custs || 0
            oldVal = (oldVal * 100).toFixed(2) + '%'
            this.trendTwoTipRate[0] = newVal
            this.trendTwoTipRate[1] = oldVal
          } else if (this.value3Temp === 1) {
            this.trendTwoTipRate[0] = this.tableData2[0].custPro
          } else if (this.value3Temp === 2) {
            this.trendTwoTipRate[1] = this.tableData2[0].custPro
          }
          break
        case 2:
          this.trendTwoRightType = this.$i18n.t('dataAnalysis.yuan')
          this.trendTwoRight.newValue = this.twoSourceData.newPayAmount
          this.trendTwoRight.oldValue = this.twoSourceData.oldPayAmount

          if (this.value3Temp === 0) {
            var newVal2 = this.twoSourceData.newPayAmount / this.tableData2[0].payment || 0
            newVal2 = (newVal2 * 100).toFixed(2) + '%'
            var oldVal2 = this.twoSourceData.oldPayAmount / this.tableData2[0].payment || 0
            oldVal2 = (oldVal2 * 100).toFixed(2) + '%'
            this.trendTwoTipRate[0] = newVal2
            this.trendTwoTipRate[1] = oldVal2
          } else if (this.value3Temp === 1) {
            this.trendTwoTipRate[0] = this.tableData2[0].paymentPro
          } else if (this.value3Temp === 2) {
            this.trendTwoTipRate[1] = this.tableData2[0].paymentPro
          }
          break
        case 3:
          this.trendTwoRightType = this.$i18n.t('order.piece')
          this.trendTwoRight.newValue = this.twoSourceData.newPayProdCount
          this.trendTwoRight.oldValue = this.twoSourceData.oldPayProdCount
          if (this.value3Temp === 0) {
            var newVal3 = this.twoSourceData.newPayProdCount / this.twoAllProdCount || 0
            newVal3 = (newVal3 * 100).toFixed(2) + '%'
            var oldVal3 = this.twoSourceData.oldPayProdCount / this.twoAllProdCount || 0
            oldVal3 = (oldVal3 * 100).toFixed(2) + '%'
            this.trendTwoTipRate[0] = newVal3
            this.trendTwoTipRate[1] = oldVal3
          } else if (this.value3Temp === 1) {
            var newVal4 = this.tableData2[0].commons / this.twoAllProdCount
            newVal4 = (newVal4 * 100).toFixed(2) + '%'
            this.trendTwoTipRate[0] = newVal4
          } else if (this.value3Temp === 2) {
            var oldVal5 = this.tableData2[0].commons / this.twoAllProdCount
            oldVal5 = (oldVal5 * 100).toFixed(2) + '%'
            this.trendTwoTipRate[1] = oldVal5
          }
          break
      }
      this.getMainTwoChart()
    },
    radio3Switch () {
      switch (this.radio3) {
        case 1:
          this.trendThreeRightType = this.$i18n.t('groups.people')
          this.trendThreeRight.newValue = this.threeSourceData.newPayBuyers
          this.trendThreeRight.oldValue = this.threeSourceData.oldPayBuyers
          if (this.value4Temp === 0) {
            var newVal = this.threeSourceData.newPayBuyers / this.tableData3[0].custs
            newVal = (newVal * 100).toFixed(2) + '%'
            var oldVal = this.threeSourceData.oldPayBuyers / this.tableData3[0].custs
            oldVal = (oldVal * 100).toFixed(2) + '%'
            this.trendThreeTipRate[0] = newVal
            this.trendThreeTipRate[1] = oldVal
          } else if (this.value4Temp === 1) {
            this.trendThreeTipRate[0] = this.tableData3[0].custPro
          } else if (this.value4Temp === 2) {
            this.trendThreeTipRate[1] = this.tableData3[0].custPro
          }
          break
        case 2:
          this.trendThreeRightType = this.$i18n.t('dataAnalysis.yuan')
          this.trendThreeRight.newValue = this.threeSourceData.newPayAmount
          this.trendThreeRight.oldValue = this.threeSourceData.oldPayAmount

          if (this.value4Temp === 0) {
            var newVal2 = this.threeSourceData.newPayAmount / this.tableData3[0].payment
            newVal2 = (newVal2 * 100).toFixed(2) + '%'
            var oldVal2 = this.threeSourceData.oldPayAmount / this.tableData3[0].payment
            oldVal2 = (oldVal2 * 100).toFixed(2) + '%'
            this.trendThreeTipRate[0] = newVal2
            this.trendThreeTipRate[1] = oldVal2
          } else if (this.value4Temp === 1) {
            this.trendThreeTipRate[0] = this.tableData3[0].paymentPro
          } else if (this.value4Temp === 2) {
            this.trendThreeTipRate[1] = this.tableData3[0].paymentPro
          }
          break
        case 3:
          this.trendThreeRightType = this.$i18n.t('order.piece')
          this.trendThreeRight.newValue = this.threeSourceData.newPayProdCount
          this.trendThreeRight.oldValue = this.threeSourceData.oldPayProdCount
          if (this.value4Temp === 0) {
            var newVal3 = this.threeSourceData.newPayProdCount / this.threeAllProdCount
            newVal3 = (newVal3 * 100).toFixed(2) + '%'
            var oldVal3 = this.threeSourceData.oldPayProdCount / this.threeAllProdCount
            oldVal3 = (oldVal3 * 100).toFixed(2) + '%'
            this.trendThreeTipRate[0] = newVal3
            this.trendThreeTipRate[1] = oldVal3
          } else if (this.value4Temp === 1) {
            var newVal4 = this.tableData3[0].commons / this.threeAllProdCount
            newVal4 = (newVal4 * 100).toFixed(2) + '%'
            this.trendThreeTipRate[0] = newVal4
          } else if (this.value4Temp === 2) {
            var oldVal5 = this.tableData3[0].commons / this.threeAllProdCount
            oldVal5 = (oldVal5 * 100).toFixed(2) + '%'
            this.trendThreeTipRate[1] = oldVal5
          }
          break
      }
      this.getMainThreeChart()
    }
  }
}
</script>

<style lang="scss">
.cust-home {
  //头部
  .header {
    background: #f8f8f8;
    padding: 12px;
    font-size: 12px;
    margin-bottom: 1em;
  }

  .header-title {
    font-size: 20px;
    line-height: 20px;
    font-weight: bold;
    margin: 0.5em 0;
  }

  .header-text {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 0.5em;
  }

  // 主要内容
  //第一部分
  .main-one {
    padding: 12px;
    font-size: 14px;
    margin-bottom: 1em;
  }

  .one-title {
    font-size: 18px;
    font-weight: bold;
    line-height: 16px;
    color: #333333;
    margin: 0.5em 0 1em 0;
  }
  .cust-table-header {
    background: #F7F8FA;
  }

  .one-time {
    display: flex;
    background: #F7F8FA;
    vertical-align: middle;
    align-items: center;
    padding: 20px;
    justify-content: space-between;
    .one-time-right {
      margin-left: 30px;
    }
  }

  .el-form-item {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    vertical-align: middle;
    margin-bottom: 0;
  }

  //修改了框架的时间选择框默认样式
  .el-input__inner-change {
    height: 30px;
    width: 180px;
  }

  .el-input__icon {
    line-height: 30px;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }

  .time-border {
    margin: 4px 0;
  }

  .one-time-screen {
    display: block;
    /*width: 70px;*/
    /*height: 34px;*/
    /*font-size: 14px;*/
    /*line-height: 30px;*/
    text-align: center;
    color: #ffffff;
    /*background: #285ed4ee;*/
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    outline: none;
    position: absolute;
    top: 22px;
    right: 16px;
  }

  .one-radio {
    margin-top: 20px;
    margin-left: -10px;
  }

  .one-table {
    padding: 1em 0;
    background: #ffffff;
  }

  .one-table .el-table .row-column1 {
    background: #d8effb;
  }

  .one-table .el-table .row-column2 {
    background: #afe4fc;
  }

  .one-table .el-table .row-column3 {
    background: #86d7fc;
  }

  .one-table .el-table .row-column4 {
    background: #5dcbfe;
  }

  .one-table .el-table .row-column5 {
    background: #2abdff;
  }

  .one-table .el-table .column-row1 {
    background: #f9eece;
  }

  .one-table .el-table .column-row2 {
    background: #fbdb8c;
  }

  .one-table .el-table .column-row3 {
    background: #fcd160;
  }

  .one-table .el-table .column-row4 {
    background: #ffc020;
  }

  .one-table .el-table .row-column-other {
    background: #f7f8fa;
  }

  .hidden {
    visibility: hidden; // 不显示内容，但是需要占位
  }

  //第二部分，对一个不同的样式进行修改与补充
  .two-time-screen {
    position: absolute;
    top: 67px;
    left: 94px;
  }

  .main-two-text div {
    margin-top: 24px;
  }

  .main-two-text div span {
    font-size: 16px;
  }

  .main-two-text div a {
    text-decoration: none;
    cursor: pointer;
    float: right;
    color: #175bf0;
  }

  .main-two-text p {
    color: #999999;
    font-size: 14px;
    margin-top: 6px;
  }

  .main-two-chart {
    height: 200px;
    width: 100%;
  }

  .main-two-table {
    margin: 20px 0;
  }

  .two-radio {
    width: 40%;
    float: left;
    margin-bottom: 20px;
  }

  .two-time p {
    height: 60px;
    width: 98%;
    border-top: #92949b dotted 1px;
    position: absolute;
    top: 106px;
    left: 10px;
    padding-top: 14px;
  }
}
</style>

