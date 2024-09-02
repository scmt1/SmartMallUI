<template>
  <div class="mod-distribution-settlement">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="state" label="订单状态" class="search-form-item">
            <el-select v-model="searchForm.state" placeholder="订单状态">
              <el-option label="待付款" :value="0"></el-option>
              <el-option label="待发货" :value="1"></el-option>
              <el-option label="待收货" :value="2"></el-option>
              <el-option label="已完成" :value="3"></el-option>
              <el-option label="已取消" :value="-1"></el-option>
            </el-select>
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
            prop="orderNumber"
            label="订单号"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            label="订单状态"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="sumAmount"
            label="订单总金额"
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
import AddOrUpdate from './distribution-userWallet-update'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dataListLoading: false,
      addOrUpdateVisible: false,
      searchForm: {
        state: ''
      }
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
    // 订单状态修改为结算
    settlement (orderNumber) {
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserIncome/settlement'),
        method: 'put',
        data: this.$http.adornData(orderNumber, false)
      }).then(() => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getDataList()
          }
        })
      })
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserIncome/settlementPage'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.searchForm))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
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
