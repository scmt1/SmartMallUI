<template>
  <div>
    <el-table :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      class="user-edit-table"
      style="width: 100%">
      <el-table-column
        prop="payTime"
        :label="$t('user.payTime')"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="orderNumber"
        :label="$t('order.number')"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="total"
        :label="$t('user.prodTotalPrice')"
      ></el-table-column>
      <el-table-column
        prop="freightAmount"
        :label="$t('user.orderFreight')"
      ></el-table-column>
      <el-table-column
        prop="actualTotal"
        :label="$t('order.actualAmount')"
      ></el-table-column>
      <el-table-column
        prop="reduceAmount"
        :label="$t('order.preferentialAmount')"
      ></el-table-column>
      <el-table-column
        prop="payScore"
        :label="$t('user.payScore')"
      ></el-table-column>
      <el-table-column prop="orderType" :label="$t('order.orderType')">
        <template slot-scope="scope">
          <span>{{
            [
              $t("order.normalOrder"),
              $t("order.groupPurchaseOrder"),
              $t("order.spikeOrder"),
              $t("user.scoreOrder"),
            ][scope.row.orderType]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payType"
        :label="$t('order.paymentMethod')"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            [
              $t("order.pointsPayment"),
              $t("platform.weChatPay"),
              $t("platform.aliPay"),
              $t("order.wechatScanCodePayment"),
              $t("order.wechatH5Payment"),
              $t("order.weclAccountPay"),
              $t("order.alipayH5Payment"),
              $t("order.alipayAPPPayment"),
              $t("order.wechatAPPPayment"),
              $t("order.balancePayment"),
              $t("order.payPalPayment"),
              '计全支付',
              '现金支付',
              '计全微信小程序支付',
              '红云余额支付',
              $t("publics.cardPay"),
              '组合支付',
            ][scope.row.payType]
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- /分页 -->
  </div>
</template>

<script>
export default {
  components: {
  },
  created () {
    this.getData()
  },
  data () {
    return {
      index: 0,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      maxLength: 0
    }
  },
  methods: {
    init (id) {
      this.userId = id
      Object.assign(this.page, this.$options.data().page)
      this.getData(this.page)
    },
    // 获取数据
    getData (page) {
      if (!this.userId) {
        return
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/order/getOrderByUserId'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            { userId: this.userId }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      this.addOrUpdateVisible = true
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getData(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getData(this.page)
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss">
</style>
