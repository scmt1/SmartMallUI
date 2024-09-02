<template>
  <div class="mod-stock-receive-list">
    <!-- 顶部按钮 -->
    <div v-if="isAuth('multishop:sendStock:add')" class="default-btn primary-btn" @click="addOrUpdateHandle(null, null)">{{ this.$i18n.t('stock.newlyBuildOtherOutbound') }}</div>
    <div style="height: 10px"></div>
    <!-- 搜索栏组件 -->
    <stockBillSearchFrom :type="1" :search-form="searchForm" @searchChange="searchChange(true)" @exportStockLog="exportStockLog"/>
    <div style="height: 10px"></div>
    <!-- 状态导航选择组件 -->
    <statusSelectTabs :type="1" :statusArr="statusArr" :defaultKey="statusArr[0].key" @statusChange="statusChange"/>
    <!-- 表格组件 -->
    <stockBillTable ref="stockBillTable" class="stockBillTable" :type="1" :dataList="dataList" />
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
    <!-- 导出入库明细 -->
    <el-dialog
      :title="this.$i18n.t('stock.exportOutboundDetails')"
      :visible.sync="exportStockBillLogVisible"
    >
      <el-radio v-model="exportRadio" :label="1">{{ this.$i18n.t('stock.exportOfSearchOutbound') }}</el-radio>
      <el-radio v-model="exportRadio" :label="2">{{ this.$i18n.t('stock.exportOfSelectOutbound') }}</el-radio>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="exportStockBillLogVisible = false">{{ this.$i18n.t('crud.filter.cancelBtn') }}</div>
        <div class="default-btn primary-btn" @click="confirmExport">{{ this.$i18n.t('crud.filter.submitBtn') }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import statusSelectTabs from './components/status-select-tabs'
import stockBillSearchFrom from './components/stock-bill-search-from'
import stockBillTable from './components/stock-bill-table'

export default {
  name: 'stock-send-list',
  components: {
    statusSelectTabs,
    stockBillSearchFrom,
    stockBillTable
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      isSubmit: false,
      dataListLoading: false,
      dataList: [], // 表格数据
      exportStockBillLogVisible: false, // 导出弹窗是否可见
      exportRadio: 1, //  1 按搜索条件导出 2 按选择项导出
      dataListSelections: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      statusArr: [
        { id: 0, key: null, label: this.$i18n.t('stock.all') },
        { id: 1, key: 2, label: this.$i18n.t('stock.waitSubmit') },
        { id: 2, key: 1, label: this.$i18n.t('stock.inOutbound') },
        { id: 3, key: 0, label: this.$i18n.t('stock.voided') }
      ], // 状态导航组件参数
      searchForm: {
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词
        bizBillNo: '', // 单据编号
        bizOrderType: '', // 出入库原因
        businessDetailTypeId: '', // 单据类型id
        sourceOrderNo: '', // 关联单号
        employeeId: '', // 员工id
        status: null // 状态
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getDataList()
    },
    getDataList (page, newData = false) {
      this.dataListLoading = true
      this.searchForm.type = 1
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    /**
     * 导航选择状态
     */
    statusChange (item) {
      this.searchForm.status = item.key
      this.page.currentPage = 1
      this.theData = JSON.parse(JSON.stringify(this.searchForm))
      this.getDataList()
    },
    /**
     * 确定导出
     */
    confirmExport () {
      if (this.exportRadio !== 1 && this.exportRadio !== 2) {
        this.$message({
          message: this.$i18n.t('stock.exportRadioEmptyTips'),
          type: 'error',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
          }
        })
        return
      }
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // 准备参数
      let params = {}
      if (this.exportRadio === 1) {
        // 导出模式为按搜索条件导出
        if (this.page.total === 0) {
          this.$message({
            message: this.$i18n.t('stock.exportStockLogSearchEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        params = this.searchForm
      } else {
        // 导出模式为按选中的数据导出
        this.getSelectList()
        if (this.dataListSelections.length === 0) {
          this.$message({
            message: this.$i18n.t('stock.exportStockLogSelectEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        params.stockBillLogIds = this.dataListSelections.map(item => {
          return item.stockBillLogId
        })
        params.type = 1
      }
      const loading = this.$loading({
        lock: true,
        target: '.mod-stock-receive-list',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('formData.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/exportStockBillLog'),
        method: 'get',
        params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({ data }) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.searchForm.type === 1 ? this.$i18n.t('stock.stockBillLogOutXls') : this.$i18n.t('stock.stockBillLogXls')
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('stock.exportSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
            this.exportStockBillLogVisible = false
          }
        })
      }).catch((e) => {
        loading.close()
        this.isSubmit = false
      })
    },
    exportStockLog () {
      this.exportStockBillLogVisible = true
    },
    /**
     * 跳转到新建库存明细页
     */
    addOrUpdateHandle (type, stockBillLogId) {
      this.$router.push({
        path: '/stock-send-add-or-update',
        query: {
          type: type,
          stockBillLogId: stockBillLogId
        }
      })
    },
    getSelectList () {
      this.dataListSelections = this.$refs.stockBillTable.getSelectList()
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(null, newData)
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
.mod-stock-receive-list {
}
.mod-stock-receive-list .stockBillTable::v-deep .el-table__fixed-right::before,
.mod-stock-receive-list .stockBillTable::v-deep .el-table__fixed::before{
  height:0 !important
}
</style>
