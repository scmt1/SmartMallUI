<template>
  <div class="mod-admin-groupOrder">
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          @click="addOrUpdateHandle()">{{$t("crud.addTitle")}}</div>
      </div>
      <div class="table-con group-order-table">
        <el-table
          ref="groupOrderListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            :label="$t('number')">
          </el-table-column>
          <el-table-column
            align="center"
            prop="groupBuyId"
            :label="$t('group.prodInfo')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="groupGoodsId"
            :label="$t('group.actName')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="groupGoodsId"
            :label="$t('group.groupNum')"
            width="300">
          </el-table-column>
          <el-table-column
            align="center"
            prop="groupGoodsId"
            :label="$t('group.totalOrderAmount')"
            width="300">
          </el-table-column>
          <el-table-column
            align="center"
            prop="groupGoodsId"
            :label="$t('group.groupTime')"
            width="300">
          </el-table-column>
          <el-table-column
            align="center"
            prop="groupGoodsId"
            :label="$t('group.orderStatus')"
            width="300">
          </el-table-column>
           
          <el-table-column
            align="center"
            fixed="right"
            :label="$t('publics.operating')"
            width="auto"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn primary-btn"
                  @click="addOrUpdateHandle(scope.row.groupOrderId)">{{$t("crud.updateBtn")}}</div>
                <div
                  class="default-btn"
                  @click="deleteHandle(scope.row.groupOrderId)">{{$t("text.delBtn")}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './groupOrder-add-or-update'

export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, params) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/group/order/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            params
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/group/order/' + id),
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
    /**
     * 刷新回调
     */
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, params)
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
<style lang="scss">
.mod-admin-groupOrder {
}
</style>
