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
          <el-form-item :label="this.$i18n.t('purchase.order.purchaseNumber') + ':'">
            <el-input
              v-model="params.purchaseNumber"
              :placeholder="this.$i18n.t('purchase.order.purchaseNumber')"
              clearable
              :maxlength="50"

            ></el-input>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('purchase.order.supplier') + ':'">
            <el-input
              v-model="params.supplierName"
              :maxlength="50"
              :placeholder="this.$i18n.t('purchase.order.supplier')"
              clearable
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
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" v-if="isAuth('purchase:purchaseOrder:save')" @click="addOrUpdateHandle(0)">{{ $t('crud.addBtn') }}</div>
      </div>
      <!-- 表格 -->
      <div class="table-con">
        <!-- 导航 -->
        <el-tabs v-model="activeName" @tab-click="selectNav">
          <el-tab-pane
            name="0"
            :label="$t('time.a')"
          >
          </el-tab-pane>
          <el-tab-pane
            name="1"
            :label="$t('purchase.order.voided')"
          >
          </el-tab-pane>
          <el-tab-pane
            name="2"
            :label="$t('purchase.order.warehoused')"
          >
          </el-tab-pane>
          <el-tab-pane
            name="3"
            :label="$t('purchase.order.partiallyComplete')"
          >
          </el-tab-pane>
          <el-tab-pane
            name="4"
            :label="$t('purchase.order.complete')"
          >
          </el-tab-pane>
        </el-tabs>
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          ref="imgTable"
        >
          <!-- 采购编号 -->
          <el-table-column
            prop="seq"
            :label="$t('purchase.order.purchaseNumber')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.purchaseNumber }}</span>
            </template>
          </el-table-column>
          <!-- 物流编号 -->
          <el-table-column
            :label="$t('order.logisticsNumber')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.dvyFlowId }}</span>
            </template>
          </el-table-column>
          <!-- 供应商 -->
          <el-table-column
            :label="$t('product.supplier')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.supplierName }}</span>
            </template>
          </el-table-column>
          <!-- 采购金额 -->
          <el-table-column
            prop="imgType"
            :label="$t('purchase.order.purchaseAmount')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalAmount }}</span>
            </template>
          </el-table-column>
          <!-- 采购数量 -->
          <el-table-column
            prop="imgType"
            :label="$t('purchase.order.purchaseNum')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalStock }}</span>
            </template>
          </el-table-column>
          <!-- 送达日期 -->
          <el-table-column
            prop="imgType"
            :label="$t('purchase.order.deliverTime')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.deliverTime }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="imgType"
            :label="$t('publics.status')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">{{ $t('purchase.order.voided') }}</span>
              <span v-if="scope.row.status === 1">{{ $t('purchase.order.warehoused') }}</span>
              <span v-if="scope.row.status === 2">{{ $t('purchase.order.partiallyComplete') }}</span>
              <span v-if="scope.row.status === 3">{{ $t('purchase.order.complete') }}</span>
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
                <div
                  class="default-btn text-btn"
                  v-if="( scope.row.status === 1 || scope.row.status === 2 ) && isAuth('purchase:purchaseOrder:inbound')"
                  @click="addOrUpdateHandle(scope.row.purchaseOrderId)"
                >
                  {{ $t('purchase.order.inbound') }}
                </div>
                <div class="default-btn text-btn" v-if="scope.row.status === 1 && isAuth('purchase:purchaseOrder:nullify')"  @click="nullifyHandle(scope.row.purchaseOrderId)">{{ $t('purchase.order.nullify') }}</div>
                <div class="default-btn text-btn" v-if="scope.row.status === 2 && isAuth('purchase:purchaseOrder:complete')"  @click="completeHandle(scope.row.purchaseOrderId)">{{ $t('purchase.order.finish') }}</div>
                <div class="default-btn text-btn" v-if="isAuth('purchase:purchaseOrder:info')" @click="addOrUpdateHandle(scope.row.purchaseOrderId, true)">{{ $t('shop.withdrawalDetail') }}</div>
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
  name: 'stock-purchasesOrder',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      lang: localStorage.getItem('lang'),
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      dataForm: {},
      sts: 0,
      status: -1,
      isSubmit: false,
      dateRange: [],
      params: {
        supplierName: '',
        purchaseNumber: ''
      },
      activeName: '0',
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
        url: this.$http.adornUrl('/purchase/order/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              status: this.status >= 0 ? this.status : null
            },
            this.theData
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.sts = this.status >= 0 ? this.status + 1 : 0
        console.log('this.sts', this.sts, this.status)
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id, view) {
      this.$router.push({
        name: 'stock-newPurchasesOrder',
        query: {
          purchaseOrderId: id,
          view: view
        }
      })
    },
    // 作废
    nullifyHandle (id) {
      this.$confirm(`${this.$i18n.t('purchase.order.determineCancellationPurchaseOrder')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        if (this.isSubmit) {
          return
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl('/purchase/order/nullify/' + id),
          method: 'delete'
        }).then(({ data }) => {
          this.getDataList(this.page)
          this.isSubmit = false
        }).catch(e => {
          this.isSubmit = false
        })
      })
    },
    // 完成
    completeHandle (id) {
      this.$confirm(`${this.$i18n.t('purchase.order.finalizePurchaseOrder')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        if (this.isSubmit) {
          return
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl('/purchase/order/complete'),
          method: 'put',
          data: {
            purchaseOrderId: id
          }
        }).then(({ data }) => {
          this.getDataList(this.page)
          this.isSubmit = false
        }).catch(e => {
          this.isSubmit = false
        })
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
    /**
     * 导航选择状态
     */
    selectNav (e) {
      var sts = e.name
      this.activeName = sts
      this.sts = parseInt(sts)
      this.status = this.sts ? parseInt(this.sts) - 1 : null
      this.page.currentPage = 1
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

