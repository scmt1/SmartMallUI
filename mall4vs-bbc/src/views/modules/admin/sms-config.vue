<template>
  <div class="mod-service-notifyTemplate">
    <div class="screening-conditions">
      <!-- <el-divider direction="vertical" class="lineColor"></el-divider> -->
      <!-- <i class="el-icon-s-comment"></i> -->
      <el-divider direction="vertical" class="lines"></el-divider>
      <span style="fontsize: 18px; text-align: center">{{
        $t("admin.remaSms")
      }}</span>
      <span class="title-time"
        >{{ $t("home.updateTime") }}：{{ this.nowDate }}</span
      >
      <div class="default-btn text-btn" @click="refreshChange()">{{
        $t("admin.refresh")
      }}</div>
    </div>
    <div class="recharge">
      <span class="divider">{{ $t("admin.remaSms") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span class="divider">{{ $t("admin.expiredSms") }}</span>
      <el-divider direction="vertical"></el-divider>
      <!-- <nuxt-link
        to="/v4/subscribe/appmarket/appdesc?id=9638"
        target="_blank"
        class="recharge-header-link"
      >{{$t("admin.smsRecharge")}}</nuxt-link>-->
      <div class="default-btn text-btn" @click="addOrUpdateHandle()">{{
        $t("admin.smsRecharge")
      }}</div>

      <span class="divider"></span>
      <el-divider direction="vertical"></el-divider>
      <div class="default-btn text-btn" @click="seeLog()">{{
        $t("admin.rechargeRecord")
      }}</div>
      <el-divider direction="vertical"></el-divider>
      <div class="default-btn text-btn" @click="updateMobile()">{{
        $t("admin.modiReceNum")
      }}</div>
      <div class="smsBox">
          <div class="divider">
            {{ shopWallet.smsNum === null ? 0 : shopWallet.smsNum }}
          </div>
          <el-divider direction="vertical" class="margin-top: 5px;"></el-divider>
          <div class="divider">
            {{ shopWallet.expiredSmsNum === null ? 0 : shopWallet.expiredSmsNum }}
          </div>
      </div>
    </div>
    <div class="screening-conditions">
      <!-- <el-divider direction="vertical" class="lineColor"></el-divider> -->
      <!-- <i class="el-icon-s-comment"></i> -->
      <el-divider direction="vertical" class="lines"></el-divider>
      <span style="fontsize: 18px; text-align: center">{{
        $t("admin.smsSendRecord")
      }}</span>
    </div>
    <div class="search-bar">
      <el-form
      :inline="true"
      :model="dataForm"
      size="small"
      @keyup.enter.native="getDataList(this.page)"
    >
      <div class="search">
        &nbsp;&nbsp;&nbsp;
        <el-form-item :label="this.$i18n.t('admin.sendTime') + '：'">
          <el-date-picker
            size="small"
            v-model="dateRange"
            type="datetimerange"
            :range-separator="this.$i18n.t('time.tip')"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="this.$i18n.t('time.start')"
            :end-placeholder="this.$i18n.t('time.end')"
          ></el-date-picker
          >&nbsp;&nbsp;&nbsp;
          <div class="default-btn" @click="setDateRange(1)">{{$t("time.t")}}</div>
          <div class="default-btn" @click="setDateRange(2)">{{$t("time.y")}}</div>
          <div class="default-btn" @click="setDateRange(3)">{{$t("time.n")}}</div>
          <div class="default-btn" @click="setDateRange(4)">{{$t("temp.m")}}</div>
        </el-form-item>
      </div>
      <div class="operation-box">
        <el-form-item>
          <div class="default-btn primary-btn" @click="searchChange()">{{ $t("order.query") }}</div>
        </el-form-item>
      </div>
    </el-form>
    </div>
    <div class="table-con">
      <el-table
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        :row-style="{ height:'70px'}"
        style="width: 100%"
      >
        <el-table-column
          prop="message"
          :label="this.$i18n.t('admin.smsContent')"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="nickName"
          :label="this.$i18n.t('admin.senduserName')"
        >
        <template slot-scope="scope">
            <span v-if="scope.row.sendType === 104 || scope.row.sendType === 103 || scope.row.sendType === 102 || scope.row.sendType === 11" size="small">{{shopName}}</span>
            <span v-else slot="scope">{{scope.row.nickName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userMobile"
          :label="this.$i18n.t('admin.sendPhoNum')"
          width="120"
        ></el-table-column>
        <el-table-column prop="status" width="100" :label="this.$i18n.t('admin.sendStatus')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" size="small">{{
              $t("order.success")
            }}</span>
            <span v-if="scope.row.status === 0" size="small" type="error">{{
              $t("order.fail")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="this.$i18n.t('admin.sendTime')"
          width="200"
        ></el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <log v-if="seeLogVisible" ref="log" @refreshDataList="refreshChange"></log>
    <mobile
      v-if="updateMobileVisible"
      ref="mobile"
      @refreshDataList="refreshChange"
    ></mobile>
  </div>
</template>
<script>
import AddOrUpdate from './pay-sms-package'
import log from './pay-sms-log'
import mobile from './update-shop-mobile'
import moment from 'moment'

export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      currentDate: new Date(),
      typeMap: new Map([
        [1, this.$i18n.t('admin.orderPay')],
        [2, this.$i18n.t('admin.paySuccNotify')],
        [3, this.$i18n.t('admin.merAgreeRefund')],
        [4, this.$i18n.t('admin.merRefuseRefund')],
        [5, this.$i18n.t('admin.wriOffRem')],
        [6, this.$i18n.t('admin.shipRem')],
        [7, this.$i18n.t('admin.groupFailRem')],
        [8, this.$i18n.t('admin.groupSuccRem')],
        [9, this.$i18n.t('admin.startGroupRem')],
        [10, this.$i18n.t('admin.memUpRem')],
        [11, this.$i18n.t('admin.timeoutRem')],
        [102, this.$i18n.t('admin.confirmReceRem')],
        [103, this.$i18n.t('admin.buyerRefundRem')],
        [104, this.$i18n.t('admin.buyerReturnRem')]
      ]),
      dataForm: {},
      searchForm: {}, // 搜索
      dataListLoading: false,
      seeLogVisible: false,
      updateMobileVisible: false,
      dateRange: [],
      nowDate: null,
      shopWallet: {},
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    log,
    mobile
  },
  created () {
    // this.getDataList()
  },
  mounted () {
    this.getDataList()
    this.getShopWalletInfo()
  },
  computed: {
    shopName () {
      return this.$store.state.user.name
    }
  },
  methods: {
    getShopWalletInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopWallet/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.shopWallet = data
      })
    },
    getDataList (page) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hours >= 1 && hours <= 9) {
        hours = '0' + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      this.nowDate = year + seperator1 + month + seperator1 + strDate + ' ' + hours + ':' + minutes + ':' + seconds
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/multishop/notifyLog/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    /**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
      } else if (val === 3) {
        startDay = -7
        endDay = -1
      } else if (val === 4) {
        startDay = -30
        endDay = -1
      } else {
        return
      }
      // 开始时间
      let startTime = moment().add(startDay, 'days').startOf('days').format('LL')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.dateRange = [startTime, endTime]
    },
    /**
     * 通过天数获取对应天数前的时间, 负数：多少天前, 正数：多少天后
     */
    getTimeByDayNum (dayNum) {
      var date = new Date()
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * dayNum)
      let mouth = date.getMonth() + 1 >= 10 ? date.getMonth() : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + (date.getDate())
      var time = date.getFullYear() + '-' + mouth + '-' + day + ' '
      return time
    },
    // 新增 / 修改
    seeLog () {
      this.seeLogVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    },
    /**
     * 修改手机号码
     */
    updateMobile () {
      this.updateMobileVisible = true
      this.$nextTick(() => {
        this.$refs.mobile.init()
      })
    },
    deleteHandle (row) {
      this.$confirm(`${this.$i18n.t('admin.isDeleOper')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/msgTemplate/' + row.msgTemplateId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    // 搜索查询
    searchChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getShopWalletInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.recharge {
  display: inline-block;
  color: #333;
  font-size: 12px;
  padding: 25px 36px;
  background: rgba(0, 0, 0, 0.04);
}
.screening-conditions {
  display: block;
  padding: 8px;
  font-size: 20px;
  background: #f8f8f9;
  margin-bottom: 20px;
  margin-top: 20px;
}
.divider {
  font-size: 18px;
}
.lines {
  width: 3px;
  background: #155bd4;
  margin: 3px;
  height: 18px;
}
.title-time {
  display: inline-block;
  color: gray;
  font-size: 15px;
}
.search {
  width: 900px;
}
.operation-box {
  display: inline-block;
  margin-left: 20px;
}
.tit1 {
  margin-bottom: 15px;
  background: #f8f8f9;
  z-index: 11;
}
.tit1 .item {
  padding: 0 10px;
  width: 10%;
  text-align: center;
}
.tit1 .product {
  width: 25%;
}

// 新增样式 过期短信
.smsBox{
  display: flex;
}

.smsBox ::v-deep .el-divider {
  margin-top: 4px !important;
}
.table-con {
  margin-top: 10px;
  margin-bottom: 20px;
}
.search-bar {
  padding: 25px 20px;
  padding-bottom: 10px;
  background-color: #F7F8FA;
}

</style>
