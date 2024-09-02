<template>
  <div class="mod-shop-refundAddr">
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('shop:refundAddr:save')" class="default-btn primary-btn" @click="addOrUpdateHandle()">{{ $t('crud.addBtn') }}</div>
      </div>
      <div class="table-con">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('publics.addressee')"
              prop="receiverName"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">
                  {{ scope.row.receiverName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="receiverMobile"
              :label="$t('publics.mobilePhone')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="receiverTelephone"
              :label="$t('address.receiverTelephone')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="postCode"
              :label="$t('address.postalCode')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="province"
              :label="$t('address.province')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="city"
              :label="$t('address.city')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="area"
              :label="$t('temp.area')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="addr"
              :label="$t('address.detailed')"
            >
              <template slot-scope="scope">
                  <span class="table-cell-text">
                    {{ scope.row.addr }}
                  </span>
                </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="160"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div v-if="isAuth('shop:refundAddr:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.refundAddrId)">{{ $t('text.updateBtn') }}</div>
                  <div v-if="isAuth('shop:refundAddr:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row.refundAddrId)">{{ $t('text.delBtn') }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './refundAddr-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList(this.page)
  },
  mounted () {
  },
  methods: {
    getDataList (page, params) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/refundAddr/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, this.searchForm))
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
          url: this.$http.adornUrl('/shop/refundAddr/' + id),
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
    // 刷新回调用
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    searchChange () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss" scoped>

.mod-shop-refundAddr {
  .main-container {
    margin: 0;
    padding: 0;
  }
}
</style>
