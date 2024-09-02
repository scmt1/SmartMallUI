<template>
  <div class="mod-stock-flow">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('takeStock.productFilter')+':'">
            <el-select v-model="searchForm.prodKeyType" @change="prodKeyTypeChange">
              <el-option
                v-for="node in prodKeyArr"
                :key="node.key"
                :label="node.label"
                :value="node.key">
              </el-option>
            </el-select>
            <el-input type="text" v-model="searchForm.prodKey" :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"/>
          </el-form-item>
          <el-form-item prop="stockBillNo" :label="$t('stock.stockBillNo')+':'">
            <el-input v-model="searchForm.stockBillNo" size="small" type="text" clearable :placeholder="$t('stock.pleaseStockBillNo')" />
          </el-form-item>
          <el-form-item prop="sourceOrderNo" :label="$t('stock.sourceOrderNo')+':'">
            <el-input v-model="searchForm.sourceOrderNo" size="small" type="text" clearable :placeholder="$t('stock.pleaseSourceOrderNo')" />
          </el-form-item>
          <el-form-item prop="businessDetailTypeId" :label="$t('stock.stockBillType')+':'">
            <el-select size="small" clearable v-model="searchForm.stockBillType" :placeholder="$t('tip.select')">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item :label="$t('takeStock.maker')+':'">
              <el-select clearable v-model="searchForm.employeeId">
                <el-option
                  v-for="node in employeeList"
                  :key="node.employeeId"
                  :label="node.mobile"
                  :value="node.employeeId">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('stock.createOrderTime')+':'">
            <el-date-picker
              size="small"
              v-model="createDateRange"
              type="datetimerange"
              :range-separator="$t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
              @change="createTimeChange"
            ></el-date-picker>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 1 }" @click="setDateRange(1)">{{$t("time.t") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 2 }" @click="setDateRange(2)">{{$t("time.y") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 3 }" @click="setDateRange(3)">{{$t("time.n") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 4 }" @click="setDateRange(4)">{{$t("temp.m") }}</div>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('multishop:stockFlow:export')" class="default-btn" @click="getExportExcel()">{{ $t('order.ExportingFiles') }}</div>
      </div>
      <div class="table-con">
        <el-table
          ref="dataListRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          :row-key="(row, index) => { return row.stockBillNo }"
          >
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
            width="55"
            :reserve-selection="true"
            >
          </el-table-column>
          <el-table-column :label="$t('stock.stockBillNo')" prop="stockBillLogId" align="left" width="190">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stockBillNo}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stock.sourceOrderNo')" prop="sourceOrderNo" align="left" width="210">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.sourceOrderNo || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stock.createOrderTime')" prop="createTime" align="left" width="160">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stock.stockBillType')" prop="stockBillType" align="left" width="120">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stockBillType | type}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.prodInfo')" prop="prodName" align="left" width="300">
            <template slot-scope="scope">
              <el-tooltip class="table-cell-text" placement="top" effect="light">
                <div slot="content">{{ scope.row.prodName }}<br/>{{ scope.row.skuName }}</div>
                <span>
                  {{ scope.row.prodName }}
                  <span v-if="scope.row.skuName">{{scope.row.skuName}}</span>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.commodityCode')" prop="partyCode" width="200">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.partyCode }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stock.unit')">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ $t('stock.pieces') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('stock.outInStock')" prop="totalCount" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stockType === 1 ? '-' : '+'}}{{scope.row.stockCount}}</span>
            </template>
          </el-table-column>
          <!-- 剩余量 -->
          <!-- <el-table-column :label="$t('stock.afterStock')" prop="totalCount" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.afterStock}}</span>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('takeStock.maker')" prop="employeeMobile" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.employeeMobile || '-'}}</span>
            </template>
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
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <!-- 导出 -->
    <el-dialog
      :title="$t('stock.export')"
      :visible.sync="exportStockFlowVisible"
    >
      <el-radio v-model="exportRadio" :label="1">{{ $t('stock.exportOfSearchFlow') }}</el-radio>
      <el-radio v-model="exportRadio" :label="2">{{ $t('stock.exportOfSelectFlow') }}</el-radio>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="exportStockFlowVisible = false">{{ $t('crud.filter.cancelBtn') }}</div>
        <div class="default-btn primary-btn" type="primary" @click="confirmExport">{{ $t('crud.filter.submitBtn') }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
// 用于指向this
let vueApp = null

export default {
  filters: {
    type (val) {
      switch (val) {
        case 1:return vueApp.$i18n.t('stock.purchaseInStock')
        case 2:return vueApp.$i18n.t('stock.returnToStorage')
        case 3:return vueApp.$i18n.t('stock.otherEntries')
        case 4:return vueApp.$i18n.t('stock.sellOut')
        case 5:return vueApp.$i18n.t('stock.editOutBound')
        case 6:return vueApp.$i18n.t('stock.otherOutbound')
        case 7:return vueApp.$i18n.t('stock.inventoryInitialization')
        case 8:return vueApp.$i18n.t('stock.orderCancelled')
        case 9:return vueApp.$i18n.t('stock.editStorage')
        case 10:return vueApp.$i18n.t('stock.profitStorage')
        case 11:return vueApp.$i18n.t('stock.lossOutBound')
      }
    }
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      createTimeActive: 0,
      dataList: [],
      employeeList: [], // 员工列表
      exportStockFlowVisible: false, // 导出弹窗是否可见
      exportRadio: 1, //  1 按搜索条件导出 2 按选择项导出
      dataListSelections: [], // 已选择的数据项
      prodKeyArr: [
        { key: 1, label: this.$i18n.t('product.prodName'), inputTips: this.$i18n.t('takeStock.inputName') },
        { key: 2, label: this.$i18n.t('product.commodityCode'), inputTips: this.$i18n.t('takeStock.inputPartyCode') }
      ], // 商品筛选类型
      options: [
        {value: 0, label: this.$i18n.t('stock.all')},
        {value: 1, label: this.$i18n.t('stock.purchaseInStock')},
        {value: 2, label: this.$i18n.t('stock.returnToStorage')},
        {value: 3, label: this.$i18n.t('stock.otherEntries')},
        {value: 4, label: this.$i18n.t('stock.sellOut')},
        {value: 5, label: this.$i18n.t('stock.editOutBound')},
        {value: 6, label: this.$i18n.t('stock.otherOutbound')},
        {value: 7, label: this.$i18n.t('stock.inventoryInitialization')},
        {value: 8, label: this.$i18n.t('stock.orderCancelled')},
        {value: 9, label: this.$i18n.t('stock.editStorage')},
        {value: 10, label: this.$i18n.t('stock.profitStorage')},
        {value: 11, label: this.$i18n.t('stock.lossOutBound')}
      ], // 单据类型
      createDateRange: [], // 制单时间范围
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        prodKeyType: 1, // 1：商品名称 2：商品编码
        sourceOrderNo: '', // 关联单号
        prodKey: '', // 搜索商品关键词
        stockBillNo: '', // 单据编号
        stockBillType: 0, // 单据类型
        employeeId: '', // 制单员工id
        createStartTime: '', // 制单起始时间
        createEndTime: '', // 制单结束时间
        stockBillItemType: 1
      }, // 搜索
      dataListLoading: false,
      addOrUpdateVisible: false,
      uploadVisible: false
    }
  },
  components: {
  },
  beforeCreate () {
    vueApp = this
  },
  mounted () {
    this.getDataList(this.page)
    // 获取员工列表
    this.getEmployeeList()
  },
  methods: {
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.page.currentPage = 1
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLogItem/flow'),
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
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getEmployeeList () {
      this.$http({
        url: this.$http.adornUrl('/sys/shopEmployee/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.employeeList = data
      })
    },
    getExportExcel () {
      this.exportStockFlowVisible = true
    },
    updateHandle (stockBillLogId, type) {
      let path
      if (type > 3) {
        path = '/stock-send-add-or-update'
      } else if (type <= 3) {
        path = '/stock-receive-add-or-update'
      }
      this.$router.push({
        path: path,
        query: {
          type: this.type,
          stockBillLogId: stockBillLogId
        }
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm.employeeId = ''
      this.searchForm.prodKeyType = 1
      this.searchForm.prodKey = ''
      this.searchForm.createStartTime = ''
      this.searchForm.createEndTime = ''
      this.searchForm.sourceOrderNo = null
      this.searchForm.stockBillType = 0
      this.searchForm.stockBillNo = null
      this.createDateRange = []
      this.createTimeActive = 0
    },
    prodKeyTypeChange () {
      this.searchForm.prodKey = ''
    },
    createTimeChange () {
      if (!this.createDateRange || this.createDateRange.length === 0) {
        this.searchForm.createStartTime = null
        this.searchForm.createEndTime = null
      } else {
        this.searchForm.createStartTime = this.createDateRange[0]
        this.searchForm.createEndTime = this.createDateRange[1]
      }
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
        params.stockBillLogItemIds = null
      } else {
        // 导出模式为按选中的数据导出
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
        params.stockBillLogItemIds = this.dataListSelections.map(item => {
          return item.stockBillLogItemId
        })
      }
      const loading = this.$loading({
        lock: true,
        target: '.mod-stock-flow',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('formData.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLogItem/exportFlow'),
        method: 'get',
        params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({ data }) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('stock.stockFlowXls')
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
            this.exportStockFlowVisible = false
          }
        })
      }).catch((e) => {
        loading.close()
        this.isSubmit = false
      })
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
      let startDay = null
      let endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
      } else if (val === 3) {
        startDay = -7
        endDay = -1
      } else if (val === 4) {
        startDay = -30
        endDay = -1
      } else {
        return
      }
      // 开始时间
      let startTime = moment()
        .add(startDay, 'days')
        .startOf('days')
        .format('LL')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.createDateRange = [startTime, endTime]
      this.searchForm.createStartTime = startTime
      this.searchForm.createEndTime = endTime
      this.createTimeActive = val
    }
  }
}
</script>
