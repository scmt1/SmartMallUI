<template>
  <div class="mod-service-notifyTemplate">
    <!-- <div class="screening-conditions">
      <el-divider direction="vertical" class="lines"></el-divider>
      <span style="fontSize:18px;text-align:center">{{$i18n.t('platform.sendMsgRecord')}}</span>
    </div> -->
    <div class="search-bar search-bar-box">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(this.page)" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item :label="this.$i18n.t('platform.sendTime') + ':'" class="search-form-item">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('date.start')"
              :end-placeholder="this.$i18n.t('date.end')"
            ></el-date-picker>&nbsp;&nbsp;&nbsp;
            <div class="default-btn" @click="setDateRange(1)">{{$i18n.t('date.t')}}</div>
            <div class="default-btn" @click="setDateRange(2)">{{$i18n.t('date.y')}}</div>
            <div class="default-btn" @click="setDateRange(3)">{{$i18n.t('date.n')}}</div>
            <div class="default-btn" @click="setDateRange(4)">{{$i18n.t('th')}}</div>
          </el-form-item>
          <el-form-item>
            <div
              class="default-btn primary-btn"
              @click="searchChange(true)"
            >{{$i18n.t('order.query')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con prod-table">
        <el-table :data="dataList" stripe style="width: 100%"
            header-cell-class-name="table-header"
            row-key="key"
            row-class-name="table-row-low">
          <el-table-column :label="this.$i18n.t('formData.serialNumber')" type="index" :index="1" width="auto"></el-table-column>
          <el-table-column prop="message"  :label="this.$i18n.t('platform.notifyConten')" width="400">
            <template slot-scope="scope">
              <div class="table-cell-text"> {{ scope.row.message }} </div>
            </template>
          </el-table-column>
          <el-table-column prop="shopName"  :label="this.$i18n.t('prodList.shopName')" width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.sendType === 10" size="small" type="small">{{$i18n.t('platform.platform')}}</span>
              <span v-else>{{scope.row.shopName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nickName"  :label="this.$i18n.t('platform.senduserName')" width="auto"></el-table-column>
          <el-table-column prop="userMobile"  :label="this.$i18n.t('platform.sendPhoNum')" width="auto"></el-table-column>
          <el-table-column prop="remindType" width="auto" :label="this.$i18n.t('platform.notifyType')">
            <template slot-scope="scope">
              <span v-if="scope.row.remindType === 1" >{{$t("platform.msgNotifyFree")}}</span>

              <span v-if="scope.row.remindType === 2" >{{$t("platform.publicNotify")}}</span>
              <span v-if="scope.row.remindType === 3" >{{$t("platform.appletMessage")}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="this.$i18n.t('platform.sendStatus')" width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1 || scope.row.remindType === 3">{{$t("platform.success")}}</span>
              <span v-if="scope.row.status === 0 && scope.row.remindType !== 3">{{$t("platform.fail")}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" :label="this.$i18n.t('platform.sendTime')" width="auto"></el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>


    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <log v-if="seeLogVisible" ref="log" @refreshDataList="refreshChange"></log>
    <mobile v-if="updateMobileVisible" ref="mobile" @refreshDataList="refreshChange"></mobile>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      currentDate: new Date(),
      typeMap: new Map([
        [1, '订单催付'],
        [2, '付款成功通知'],
        [3, '商家同意退款'],
        [4, '商家拒绝退款'],
        [5, '核销提醒'],
        [6, '发货提醒'],
        [7, '拼团失败提醒'],
        [8, '拼团成功提醒'],
        [9, '拼团开团提醒'],
        [10, '会员升级提醒'],
        [101, '退款临近超时提醒'],
        [102, '确认收货提醒'],
        [103, '买家发起退款提醒'],
        [104, '买家已退货提醒']
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
  },
  created () {
    // this.getDataList()
  },
  mounted () {
    this.getDataList()
    this.getShopWalletInfo()
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
    getDataList (page, newData = false) {
      // var date = new Date()
      // var seperator1 = '-'
      // var year = date.getFullYear()
      // var month = date.getMonth() + 1
      // var strDate = date.getDate()
      // var hours = date.getHours()
      // var minutes = date.getMinutes()
      // var seconds = date.getSeconds()
      // if (month >= 1 && month <= 9) {
      //   month = '0' + month
      // }
      // if (strDate >= 0 && strDate <= 9) {
      //   strDate = '0' + strDate
      // }
      // if (hours >= 1 && hours <= 9) {
      //   hours = '0' + hours
      // }
      // if (minutes >= 0 && minutes <= 9) {
      //   minutes = '0' + minutes
      // }
      // if (seconds >= 0 && seconds <= 9) {
      //   seconds = '0' + seconds
      // }
      // this.nowDate = year + seperator1 + month + seperator1 + strDate + ' ' + hours + ':' + minutes + ':' + seconds
      this.nowDate = moment().format('LL')
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/platform/notifyLog/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(x => {
          x.key = Math.random()
        })
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
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
      this.$confirm(`确定进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/msgTemplate/' + row.msgTemplateId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
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
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
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
<style lang="scss">
.mod-service-notifyTemplate{
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
    margin-left: 30px;
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
}
div ::v-deep .overview > .show-data > .data-board.data-board-left{
    min-width: 865px;
    width: 865px;
}

</style>
