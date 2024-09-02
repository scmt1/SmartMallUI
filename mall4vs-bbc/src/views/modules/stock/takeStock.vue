<template>
  <div class="mod-stock-receive-list">
    <!-- 顶部按钮 -->
    <div v-if="isAuth('multishop:takeStock:new')" class="default-btn primary-btn" @click="addOrUpdateHandle()">{{ $t('takeStock.newInventory') }}</div>
    <div style="height: 10px"></div>
    <!-- 搜索栏组件 -->
    <stockTakeSearchFrom :search-form="searchForm" @searchChange="searchChange(true)" @confirmExport="confirmExport"/>
    <!-- 表格组件 -->
    <stockTakeTable ref="stockTakeTable" class="stockTakeTable" :dataList="dataList" @refreshList="getDataList" @refreshChange="refreshChange()"/>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
import stockTakeSearchFrom from './components/take-stock-search-form'
import stockTakeTable from './components/take-stock-table'

export default {
  name: 'stock-takeStock',
  components: {
    stockTakeSearchFrom,
    stockTakeTable
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      isSubmit: false,
      dataListLoading: false,
      dataList: [], // 表格数据
      exportRadio: 1, //  1 按搜索条件导出 2 按选择项导出
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        takeStockNo: '', // 盘点单号
        billStatus: '', // 盘点状态 0已作废 1盘点中 2已完成
        maker: '', // 制单人id
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词(0:商品名称 1：商品编码)
        createStartTime: '', // 盘点起始时间
        createEndTime: '', // 盘点结束时间
        prodName: '',
        partyCode: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getDataList(this.page)
    },
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (this.searchForm.prodKeyType === 1) {
        this.searchForm.prodName = this.searchForm.prodKey
        this.searchForm.partyCode = null
      } else if (this.searchForm.prodKeyType === 2) {
        this.searchForm.partyCode = this.searchForm.prodKey
        this.searchForm.prodName = null
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/stock/takeStock/page'),
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
      })
        .then(({ data }) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
        .catch(() => {
          this.dataListLoading = false
        })
    },
    /**
     * 导出
     */
    confirmExport () {
      if (this.searchForm.prodKeyType === 1) {
        this.searchForm.prodName = this.searchForm.prodKey
        this.searchForm.partyCode = null
      } else if (this.searchForm.prodKeyType === 2) {
        this.searchForm.partyCode = this.searchForm.prodKey
        this.searchForm.prodName = null
      }
      this.$confirm(`${this.$i18n.t('shop.exportProdTip_physical')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          target: '.mod-stock-receive-list',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('formData.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/stock/takeStock/exportTakeStock'),
          method: 'get',
          params: this.$http.adornParams(this.searchForm),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('takeStock.exportInventoryFileName')
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }).catch((e) => {
          loading.close()
        })
      })
    },
    addOrUpdateHandle () {
      this.$router.push({
        path: 'stock-new-take-stock',
        query: {
        }
      })
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    refreshChange () {
      this.getDataList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-stock-receive-list .stockTakeTable::v-deep .el-table__fixed-right::before,
.mod-stock-receive-list .stockTakeTable::v-deep .el-table__fixed::before{
  height:0 !important
}
</style>
