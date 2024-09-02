<template>
  <div class="mod-seckill-shopWallet">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="shopName" :label="$t('shop.storeName')+':'">
            <el-input v-model="searchForm.shopName" type="text" clearable  :placeholder="$t('shop.storeName')"></el-input>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange">{{ $t('crud.searchBtn') }}</div>
          <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
          <el-table
              :data="dataList"
              header-cell-class-name="table-header"
              row-class-name="table-row"
              style="width: 100%"
              ref="hotTable"
          >
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              :label="$t('shop.storeName')"
              prop="shopName"
              align="center">
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('shop.shopLogo')"
            >
              <template slot-scope="scope">
                <div class="table-cell-image">
                  <img :src="scope.row.shopLogo" width="150" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="settledAmount"
              :label="$t('shop.availableStoreBalance')"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="unsettledAmount"
              :label="$t('shop.pendingSettlement')"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="freezeAmount"
              :label="$t('shop.unusableBalanceYuan')"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="totalSettledAmount"
              :label="$t('shop.totalSettlementAmount')"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="updateTime"
              :label="$t('home.updateTime')"
            >
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
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        shopName: ''
      }, // 搜索
      dataListLoading: false
    }
  },
  created () {
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/shopWallet/page'),
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
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-seckill-shopWallet {

}
</style>
