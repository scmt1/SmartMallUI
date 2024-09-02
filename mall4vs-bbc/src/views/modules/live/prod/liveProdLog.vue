<template>
  <div class="mod-live-liveProdLog">
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" @click="addOrUpdateHandle()">{{$t("crud.addTitle")}}</div>
      </div>
      <div class="table-con live-prod-table">
        <el-table
          ref="liveProdListTable"
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
            prop="liveProdLogId"
            :label="$t('live.proLogId')"
            width="auto">
          </el-table-column>

          <el-table-column
            align="center"
            prop="liveProdStoreId"
            :label="$t('live.proLibId')"
            width="auto">
          </el-table-column>

          <el-table-column
            align="center"
            prop="updateTime"
            :label="$t('live.updateTime')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('live.status')"
            width="auto">
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
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.liveProdLogId)"
                >{{$t("crud.updateBtn")}}</div>
                <div
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.liveProdLogId)"
                >{{$t("text.delBtn")}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './liveProdLog-add-or-update'

export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {}, // 搜索
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
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/live/liveProdLog/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
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
          url: this.$http.adornUrl('/live/liveProdLog/' + id),
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
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
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
</style>
