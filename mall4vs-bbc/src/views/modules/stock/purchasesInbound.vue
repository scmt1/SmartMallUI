<template>
  <div class="mod-order-order">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList(this.page)"
        label-width="auto"
        size="small"
      >
        <div class="input-row">
          <el-form-item :label="this.$i18n.t('purchase.order.stockNumber') + ':'">
            <el-input
              v-model="params.stockBillNo"
              :placeholder="this.$i18n.t('purchase.order.stockNumber')"
              clearable
              :maxlength="50"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('purchase.order.purchaseNumber') + ':'">
            <el-input
              v-model="params.sourceOrderNo"
              :placeholder="this.$i18n.t('purchase.order.purchaseNumber')"
              clearable
              :maxlength="50"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('purchase.order.supplier') + ':'">
            <el-input
              v-model="params.supplierName"
              :maxlength="50"
              :placeholder="this.$i18n.t('purchase.order.supplier')"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div
              class="default-btn primary-btn"
              @click="searchChange(true)"
              >{{ $t("order.query") }}</div
            >
            <div
              class="default-btn"
              @click="clear()"
              >{{ $t("shop.resetMap") }}</div
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 列标题 -->
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" @click="addOrUpdateHandle(0)">{{ $t('crud.addBtn') }}</div>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          ref="imgTable"
        >
          <!-- 库存编号 -->
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('purchase.order.stockNumber')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.stockBillNo }}</span>
            </template>
          </el-table-column>
          <!-- 采购编号 -->
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('purchase.order.purchaseNumber')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sourceOrderNo }}</span>
            </template>
          </el-table-column>
          <!-- 供应商 -->
          <el-table-column
            align="center"
            :label="$t('product.supplier')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.supplierName }}</span>
            </template>
          </el-table-column>
          <!-- 采购金额 -->
          <el-table-column
            align="center"
            prop="imgType"
            :label="$t('purchase.order.purchaseAmount')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalAmount }}</span>
            </template>
          </el-table-column>
          <!-- 采购数量 -->
          <el-table-column
            align="center"
            prop="imgType"
            :label="$t('purchase.order.purchaseNum')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalCount }}</span>
            </template>
          </el-table-column>
          <!-- 送达日期 -->
          <el-table-column
            align="center"
            prop="imgType"
            :label="$t('purchase.order.deliverTime')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.businessTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            width="220"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn" v-if="isAuth('purchase:purchasesInbound:info')" @click="addOrUpdateHandle(scope.row.stockBillLogId)">{{ $t('shop.withdrawalDetail') }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'stock-purchasesInbound',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      lang: localStorage.getItem('lang'),
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      dataForm: {},
      isSubmit: false,
      dateRange: [],
      params: {
        supplierName: '',
        sourceOrderNo: '',
        stockBillNo: ''
      },
      timeActive: null,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  components: {
  },
  created () {
    // 携带参数查询
    this.getDataList(this.page, this.$route.query)
    this.isSubmit = false
  },
  activated () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.getDataList(this.page, query)
    }
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
  },
  watch: {

  },
  methods: {
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > 400
    },

    /**
     * 获取数据列表
     */
    getDataList (page, newData = false) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.params))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/purchasePage'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({
        name: 'stock-newPurchasesInbound',
        query: {
          stockBillLogId: id
        }
      })
    },
    // 刷新回调
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    orderStatus (val) {
      this.status = val
    },
    // 清空按钮
    clear () {
      this.params = {
        supplierName: '',
        purchaseNumber: ''
      }
    },
    // 搜索查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
