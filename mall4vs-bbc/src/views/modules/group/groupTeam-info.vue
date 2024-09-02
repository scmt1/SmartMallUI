<template>
  <el-dialog :title="this.$i18n.t('groups.groupOrderList')" width="60%" :close-on-click-modal="false"
             :visible.sync="dialogTableVisible">
    <el-table :data="tableData" header-cell-class-name="table-header" row-class-name="table-row-low"
              style="width: 100%">
      <el-table-column prop="orderNumber" :label="this.$i18n.t('order.number')" width="300">
      </el-table-column>
      <el-table-column prop="activityProdPrice" :label="this.$i18n.t('live.salesPrice')">
      </el-table-column>
      <el-table-column prop="groupPrice" :label="this.$i18n.t('groups.groupPrice')">
      </el-table-column>
      <el-table-column prop="payPrice" :label="this.$i18n.t('order.actualAmount')">
      </el-table-column>
      <el-table-column :label="this.$i18n.t('groups.membership')">
        <template slot-scope="scope">
          <span v-if="scope.row.identityType === 1 && scope.row.userId !== 0">{{$t("groups.head")}}</span>
          <span v-if="scope.row.identityType === 0 && scope.row.userId !== 0">{{$t("groups.member")}}</span>
          <span v-if="scope.row.userId === '0'">{{$t("groups.robot")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="180" :label="this.$i18n.t('order.createTime')">
      </el-table-column>
      <el-table-column :label="this.$i18n.t('text.menu')" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            @click="viewOrder(scope.row.orderNumber)"
            type="text"
            :disabled="scope.row.userId === '0' || !scope.row.userId"
          >{{$t("order.viewOrder")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dialogTableVisible: false,
      dataListLoading: false,
      GroupOrder: {
        groupTeamId: null
      }
    }
  },
  methods: {
    init (groupTeamId) {
      this.dialogTableVisible = true
      this.$nextTick(() => {
        if (groupTeamId) {
          this.GroupOrder.groupTeamId = groupTeamId
          this.getDataList(this.page)
        }
      })
    },
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/group/team/info'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.GroupOrder
          )
        )
      }).then(({ data }) => {
        this.tableData = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    viewOrder (orderNumber, userId) {
      if (Number(userId) === 0) {
        return
      }
      if (!this.isAuth('order:get:info')) {
        this.$message.info(this.$i18n.t('homes.noPermissionAccessPage'))
        return
      }
      this.dialogTableVisible = false
      this.$store.commit('router/updateIncludePageList', 'order-order')
      this.$store.commit('router/pushHisPageList', 'order-order')
      this.$router.push({
        path: '/order-order',
        query: { orderNumber }
      })
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
