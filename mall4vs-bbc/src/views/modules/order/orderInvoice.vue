<template>
<!-- 发票管理 -->
  <div class="order-invoice">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="orderNumber" :label="$t('order.number')+':'">
            <el-input v-model="searchForm.orderNumber" type="text" clearable :placeholder="$t('order.number')"></el-input>
          </el-form-item>
          <el-form-item prop="invoiceState" :label="$t('order.invoiceStatus')+':'">
            <template>
              <el-select
                v-model="searchForm.invoiceState"
                clearable
                :placeholder="this.$i18n.t('order.invoiceStatus')"
              >
                <el-option
                  v-for="item in invoiceStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm()">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->

    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con invoice-table">
        <el-table
          ref="InvoiceTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <!-- 订单id -->
          <el-table-column :label="$t('order.number')" prop="orderNumber">
            <template slot-scope="{row}">
              <span>{{ row.orderNumber }}</span>
            </template>
          </el-table-column>
          <!-- 抬头类型 1.单位 2.个人 -->
          <el-table-column :label="$t('order.headerType')" prop="headerType">
            <template slot-scope="{row}">
              <span>{{ ['',$t('order.unit'),$t('order.personal')][row.headerType] }}</span>
            </template>
          </el-table-column>
          <!-- 发票状态 1.申请中 2.已开票 -->
          <el-table-column :label="$t('order.invoiceStatus')" prop="invoiceState">
            <template slot-scope="{row}">
              <span>{{ ['',$t('order.applicationInProgress'),$t('order.invoiceIssued'),$t('order.fail')][row.invoiceState] }}</span>
            </template>
          </el-table-column>
          <!-- 订单状态 -->
          <el-table-column
            :label="$t('order.status')"
            prop="orderStatus"
           >
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus === 1">{{$t('order.pendingPayment')}}</span>
              <span v-if="scope.row.orderStatus === 2">{{$t('order.toBeShipped')}}</span>
              <span v-if="scope.row.orderStatus === 3">{{$t('order.pendingReceipt')}}</span>
              <span v-if="scope.row.orderStatus === 4">{{$t('order.toBeEvaluated')}}</span>
              <span v-if="scope.row.orderStatus === 5">{{$t('order.success')}}</span>
              <span v-if="scope.row.orderStatus === 6">{{$t('order.fail')}}</span>
              <span v-if="scope.row.orderStatus === 7">{{$t('group.waitGroup')}}</span>
            </template>>
          </el-table-column>
          <!-- 申请时间 -->
          <el-table-column :label="$t('order.applicationTime')" prop="applicationTime">
            <template slot-scope="{row}">
              <span>{{ row.applicationTime }}</span>
            </template>
          </el-table-column>
          <!-- 上传时间 -->
          <el-table-column :label="$t('order.uploadTime')" prop="uploadTime">
            <template slot-scope="{row}">
              <span>{{ row.uploadTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('crud.menu')"
            fixed="right"
            align="center"
            width="200"
          >
            <template slot-scope="{row}">
              <el-button type="text" @click="viewOrderHandle(row.orderNumber)">
                {{ $t('order.viewOrder') }}
              </el-button>
              <el-button v-if="isAuth('order:orderInvoice:update')" type="text" @click="addOrUpdateHandle(row.orderInvoiceId)">
                {{ $t('text.editBtn') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"></add-or-update>

  </div>
</template>

<script>
import AddOrUpdate from './orderInvoice-add-or-update'
export default {
  name: 'order-orderInvoice',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      invoiceStates: [
        {
          label: this.$i18n.t('order.applicationInProgress'),
          value: 1
        },
        {
          label: this.$i18n.t('order.invoiceIssued'),
          value: 2
        },
        {
          label: this.$i18n.t('order.fail'),
          value: 3
        }
      ],
      // 编辑弹窗显隐
      addOrUpdateVisible: false
    }
  },

  mounted () {
    this.getDataList()
  },

  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/m/orderInvoice/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page ? page.currentPage : this.page.currentPage,
              size: page ? page.pageSize : this.page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
      })
    },

    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },

    /**
     * 查看订单
     */
    viewOrderHandle (id) {
      this.$router.push({
        path: '/order-orderInfo',
        query: {
          orderNumber: id
        }
      })
    },

    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },

    // 重置
    resetForm () {
      this.searchForm = {}
    },
    // 刷新回调用
    refreshChange () {
      this.page.current = 1
      this.getDataList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
