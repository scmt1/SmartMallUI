<template>
  <el-dialog
    :title="dataList[0] ? dataList[0].prodName : $t('stock.skuStockInfo')"
    :visible.sync="visible"
  >
    <el-table
      ref="dataListRef"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      :row-style="{ height:'70px'}"
      style="width: 100%"
    >
      <el-table-column
        prop="partyCode"
        header-align="center"
        align="center"
        :label="$t('product.commodityCode')"
      >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.partyCode" placement="top" effect="light">
            <div class="sku-name-txt">
              {{scope.row.partyCode}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        prop="skuName"
        header-align="center"
        align="center"
        :label="$t('stock.spec')"
      >
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.skuName" placement="top" effect="light">
            <div class="sku-name-txt">
              {{scope.row.skuName}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('stock.unit')"
        prop="createTime"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span class="table-cell-text line-clamp-one">{{ $t('stock.pieces') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.stock')"
        prop="stocks"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span class="table-cell-text line-clamp-one">{{scope.row.stocks}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('stock.price')"
        prop="price"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span class="table-cell-text line-clamp-one">{{scope.row.price}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      visible: false,
      dataList: [], // 数据列表
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        prodId: null
      }
    }
  },
  created () {
  },
  methods: {
    init (prodId) {
      this.visible = true
      this.dataList = []
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
      this.searchForm.prodId = prodId
      this.getDataList()
    },
    getDataList (page) {
      this.$http({
        url: this.$http.adornUrl('/sku/pageSku'),
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
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
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
::v-deep .el-dialog__title{
  max-width: 95%;
  display:block;
  word-break: break-word;
}
</style>
