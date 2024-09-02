<template>
  <div class="mod-distribution-distributionUserWalletBill">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionMsg.distriTelPhone') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distributionMsg.distriTelPhone')"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con distr-user-allet-bill-tbale">
        <el-table
          ref="distributionUserWalletBillTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            width="auto"
            prop="nickName"
            :label="$t('distribUserWallet.distributorNickname')"
          >
            <template slot-scope="scope">
              {{scope.row.distributionUser ? scope.row.distributionUser.nickName : '' }}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            width="auto"
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUser ? scope.row.distributionUser.userMobile : '' }}
            </template>
          </el-table-column>
          <!-- 待结算金额变更数额 -->
          <el-table-column
            width="auto"
            prop="unsettledAmount"
            :label="$t('distribIncome.pschange')"
          >
            <template slot-scope="scope">
              {{ scope.row.unsettledAmount }}
            </template>
          </el-table-column>
          <!-- 可提现金额变更数额 -->
          <el-table-column
            width="auto"
            prop="settledAmount"
            :label="$t('distribIncome.wachange')"
          >
            <template slot-scope="scope">
              {{ scope.row.settledAmount }}
            </template>
          </el-table-column>
          <!-- 已失效金额变更数额 -->
          <el-table-column
            width="auto"
            prop="invalidAmount"
            :label="$t('distribIncome.iachange')"
          >
            <template slot-scope="scope">
              {{ scope.row.invalidAmount }}
            </template>
          </el-table-column>
          <!-- 积累收益变更数额 -->
          <el-table-column
            width="auto"
            prop="addupAmount"
            :label="$t('distribIncome.aichange')"
          >
            <template slot-scope="scope">
              {{ scope.row.addupAmount }}
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            width="auto"
            prop="remarks"
            :label="$t('publics.remark')"
          >
            <template slot-scope="scope">
              {{ scope.row.remarks }}
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            width="auto"
            prop="createTime"
            :label="$t('sys.creationTime')"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
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
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      searchForm: {},
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserWalletBill/pageAndUser'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
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
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      // this.searchForm = params
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
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

</style>
