<template>
  <div class="Mall4j mod-prod-list">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchParam" size="small" label-width="180">
        <div class="input-row">
          <!-- 商品名称 -->
          <el-form-item :label="$t('notice.msgContent') + '：'">
            <el-input v-model="searchParam.message" :placeholder="$t('notice.msgContent')" maxlength="100" clearable />
          </el-form-item>
          <el-form-item :label="$t('notice.msgType') + '：'">
            <el-select v-model="searchParam.sendType" :placeholder="$t('notice.msgType')" clearable>
              <el-option
                v-for="item in msgStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('notice.msgStatus') + '：'">
            <el-select v-model="searchParam.status" :placeholder="$t('notice.msgStatus')" clearable>
              <el-option :label="$t('chat.read')" :value="1" />
              <el-option :label="$t('chat.unRead')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('notice.publishTime')+ '：'">
            <el-date-picker
              v-model="dateRange"
              size="small"
              type="datetimerange"
              :range-separator="this.$i18n.t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('time.start')"
              :end-placeholder="this.$i18n.t('time.end')"
            />
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <div class="default-btn primary-btn" @click="loadSearchParam(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearchInfo">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <!-- 2.发布/展示/处理商品操作 -->
      <div class="operation-bar">
        <el-checkbox v-if="pageVO.records.length" v-model="isSelectedAll" :indeterminate="isIndeterminate" class="all-check-btn" @change="handleSelectAll">{{ $t('publics.currentSelectAll') }}</el-checkbox>
        <span v-if="selectedProdList.length" class="had-selected-tips">{{ $t('notice.selectedItem') }} {{ selectedProdList.length }}</span>
        <el-button v-show="pageVO.records.length" size="small" type="primary" @click="batchRead([])">
          {{ $t('notice.allRead') }}
        </el-button>
        <el-button
          type="primary"
          v-show="pageVO.records.length"
          @click="batchRead([])"
          size="small"
          >{{ $t('notice.allRead') }}
        </el-button>
        <el-button size="small" plain :disabled="!selectedProdList.length" @click="batchRead(selectedProdList)">{{ $t('notice.batchRead') }}</el-button>
      </div>
      <!-- 商品展示表格 -->
      <div class="table-con">
        <el-table
          ref="prodListTable"
          :data="pageVO.records"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="50"
          />
          <el-table-column
            :label="$t('notice.msgContent')"
            width="600"
            prop="message"
          />
          <el-table-column
            :label="$t('notice.msgType')"
            prop="label"
            min-width="120"
          />
          <el-table-column
            :label="$t('notice.publishTime')"
            prop="createTime"
            min-width="120"
          />
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('crud.menu')"
            width="120"
          >
            <template slot-scope="{ row }">
              <!-- <div class="table-btn-con"> -->
                <el-button type="text" @click="toReleasePage(row.sendType)">{{ $t('crud.viewBtn') }}</el-button>
              <!-- </div> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <el-pagination
        v-if="pageVO.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageQuery.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageVO.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSubmit: false,
      searchParam: {
        message: '',
        sendType: '',
        skuCode: '',
        spuCode: ''
      },
      pageQuery: {
        size: 10,
        current: 1
      },
      // 商品表格数据
      tableData: [],
      // 多选
      isSelectedAll: false,
      isIndeterminate: false,
      selectedProdList: [], // 被选中的列表
      // 返回参数
      pageVO: {
        records: [], // 返回的列表
        total: 0, // 一共多少条数据
        pages: 0 // 一共多少页
      },
      // loading
      pageLoading: true,
      dateRange: []
    }
  },
  computed: {
    msgStatusList () {
      return [{
        value: 102,
        label: this.$i18n.t('admin.confirmReceRem')
      }, {
        value: 103,
        label: this.$i18n.t('admin.buyerRefundRem')
      }, {
        value: 104,
        label: this.$i18n.t('admin.buyerReturnRem')
      }, {
        value: 105,
        label: this.$i18n.t('admin.buyerPaySuccessRem')
      }, {
        value: 106,
        label: this.$i18n.t('notice.productRemovalReminder')
      }, {
        value: 107,
        label: this.$i18n.t('notice.commodityAuditResultReminder')
      }, {
        value: 108,
        label: this.$i18n.t('notice.ReminderPurchased')
      }, {
        value: 109,
        label: this.$i18n.t('notice.reminderToNeReceived')
      }, {
        value: 110,
        label: this.$i18n.t('notice.ReminderMarketingActivityOffShelf')
      }, {
        value: 111,
        label: this.$i18n.t('notice.ActivityAuditResultReminder')
      }]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    loadSearchParam () {
      this.pageQuery.current = 1
      this.pageQuery.message = this.searchParam.message
      this.pageQuery.sendType = this.searchParam.sendType
      this.pageQuery.status = this.searchParam.status
      this.pageQuery.startTime = this.dateRange === null ? null : this.dateRange[0] // 开始时间
      this.pageQuery.endTime = this.dateRange === null ? null : this.dateRange[1] // 结束时间
      this.getData()
    },
    /**
     * 获取消息列表
     */
    getData () {
      this.pageLoading = true
      this.$http({
        url: this.$http.adornUrl('/multishop/notifyLog/pageByNotifyLogParam'),
        method: 'get',
        params: this.$http.adornParams(this.pageQuery)
      }).then(({ data }) => {
        this.pageVO = data
        this.pageVO.records.forEach(item => {
          this.msgStatusList.forEach(obj => {
            if (obj.value === item.sendType) {
              item.label = obj.label
            }
          })
        })
        this.pageLoading = false
      })
      this.isSelectedAll = false
      this.isIndeterminate = false
      this.selectedProdList = []
    },
    // 查看跳转页面
    toReleasePage (type) {
      const routeList = this.$store.state.common.routeList
      const pathObj = {
        path: '',
        query: {}
      }
      if (type === 102 || type === 103 || type === 104) {
        pathObj.path = '/order-orderRefund'
        pathObj.query.returnMoneySts = type === 102 ? 4 : type === 103 ? 1 : 5
      }
      if (type === 105 || type === 109) {
        pathObj.path = '/order-order'
        pathObj.query.status = type === 105 ? 2 : 3
      }
      if (type === 108) {
        pathObj.path = '/stock-purchasesOrder'
      }
      if (type === 110 || type === 111) {
        pathObj.path = '/marketing-discount'
      }
      const flag = routeList.some(item => '/' + item.url === pathObj.path)
      if (!flag) {
        return this.$message.error(this.$i18n.t('home.authTip'))
      }
      this.$router.push(pathObj)
    },
    /**
     * 监听表格选中
     */
    handleSelectionChange (val) {
      this.selectedProdList = val.map(item => item.logId)
      this.isSelectedAll = val.length === this.pageVO.records.length
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.prodListTable.selection.length < this.pageVO.records.length) {
        this.isSelectedAll = true
      } else {
        this.isSelectedAll = false
      }
      this.$refs.prodListTable.toggleAllSelection()
    },
    // 批量已读
    batchRead (ids) {
      const obj = {
        logIds: ids,
        type: ids.length > 0 ? 0 : 1
      }
      this.$http({
        url: this.$http.adornUrl('/multishop/notifyLog/is_read'),
        method: 'put',
        params: this.$http.adornParams(obj)
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500
        })
      })
    },
    /**
     * 清空
     */
    clearSearchInfo () {
      this.searchParam.message = ''
      this.searchParam.status = ''
      this.searchParam.sendType = ''
      this.dateRange = []
    },
    handleSizeChange (val) {
      this.pageQuery.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageQuery.current = val
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-btn-con {
  display: flex;
  flex-wrap: wrap;
}
.mod-prod-list {
  // 1.筛选条件搜索
  .search-bar {
    padding: 20px;
    background: #f9f9f9;
    .el-cascader.el-cascader--small,
    .el-input.el-input--small {
      width: 200px;
    }
    .el-form-item {
      display: inline-block;
      margin-right: 30px;
      .el-form-item__label {
        width: 80px;
      }
      .el-form-item__content {
        width: 200px;
      }
      .el-input__inner {
        height: 31px !important;
        line-height: 31px !important;
        padding-right: 0;
      }
    }
  }
  .main-content {
    .operation-bar {
      display: flex;
      align-items: center;
      .had-selected-tips {
        font-size: 12px;
        margin-right: 10px;
        margin-top: 4px;
        color: #155bd4;
      }
      .all-check-btn {
        margin: 0 15px;
      }
      .el-radio-group {
        margin-right: 10px;
      }
    }
    .operation-bar.bottom-bar {
      margin-top: 20px;
      margin-bottom: 0;
    }
    .table-con {
      margin-top: 20px;
      padding-bottom: 30px;
      .el-table-column--selection .cell {
        text-align: center;
      }
    }
  }
}
</style>
<style scoped>
.single-input-number /deep/ .el-input-number--small { width: 100%; }
</style>
