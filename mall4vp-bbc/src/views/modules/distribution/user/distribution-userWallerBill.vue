<template>
  <div class="mod-distribution-distributionUserWalletBill">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="state" :label="$t('distribUserWallet.mobileTelNumber')" class="search-form-item">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distribUserWallet.mobileTelNumber')"></el-input>
          </el-form-item>
        </div>
        <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
        <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="nickName"
            :label="$t('distribUserWallet.distributorNickname')"
            width="auto">
             <template slot-scope="scope">
              {{scope.row.distributionUser.nickName}}
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="unsettledAmount"
            :label="$t('distribUserWallet.pschange')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="settledAmount"
            :label="$t('distribUserWallet.wachange')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="invalidAmount"
            :label="$t('distribUserWallet.iachange')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="addupAmount"
            :label="$t('distribUserWallet.aichange')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="remarks"
            :label="$t('distribUserWallet.remark')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            :label="$t('distribUserWallet.creationTime')"
            width="auto">
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

  </div>
</template>

<script>
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {
        userMobile: ''
      },
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserWalletBill/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
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
    rowDel: function (row, index) {
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distribution/distributionUserWalletBill/' + row.id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.isTop = ''
      this.categoryId = null
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

<style lang="scss" scoped>
</style>
