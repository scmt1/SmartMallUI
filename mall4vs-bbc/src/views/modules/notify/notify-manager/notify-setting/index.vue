<template>
  <div class="Mall4j">
    <!-- 列表相关区域 -->
    <el-table
      v-loading="pageLoading"
      :data="pageVO.records"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%;"
    >
      <el-table-column
        prop="menu"
        align="left"
        :label="$t('notice.menu')"
        width="100"
      />
      <el-table-column :label="$t('notice.msgType')" prop="label" align="left" />
      <el-table-column
        align="left"
        prop="nodeName"
        :label="$t('notice.pushNode')"
      />
      <!-- 操作 -->
      <el-table-column :label="$t('crud.menu')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div class="table-btn-con">
            <el-button type="text" @click="change(row)">
              {{ row.isRemind === 0 ? $t('notice.enableReminder') : $t('notice.turnOffReminder') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script>
export default {
  name: '',
  data () {
    return {
      pageQuery: {
        size: 10,
        current: 1
      },
      // 返回参数
      pageVO: {
        records: [], // 返回的列表
        total: 0, // 一共多少条数据
        pages: 0 // 一共多少页
      },
      // loading
      pageLoading: false
    }
  },
  computed: {
    msgStatusList () {
      return [{
        value: 104,
        label: this.$i18n.t('notice.buyerReturnedGoodsReminder')
      }, {
        value: 105,
        label: this.$i18n.t('notice.ReminderSuccessfulPayment')
      }, {
        value: 106,
        label: this.$i18n.t('notice.productRemovalReminder')
      }, {
        value: 107,
        label: this.$i18n.t('notice.commodityAuditResultReminder')
      }, {
        value: 108,
        label: this.$i18n.t('notice.ReminderChangeConsignment')
      }, {
        value: 102,
        label: this.$i18n.t('notice.userConfirmsReceiptNotification')
      }, {
        value: 109,
        label: this.$i18n.t('notice.reminderOfPendingShipment')
      }, {
        value: 110,
        label: this.$i18n.t('notice.ReminderPurchased')
      }, {
        value: 103,
        label: this.$i18n.t('notice.reminderOfPendingRefund')
      }, {
        value: 111,
        label: this.$i18n.t('notice.reminderToNeReceived')
      }, {
        value: 112,
        label: this.$i18n.t('notice.ReminderMarketingActivityOffShelf')
      }, {
        value: 113,
        label: this.$i18n.t('notice.ActivityAuditResultReminder')
      }]
    }
  },
  mounted () {
    this.getPage()
  },
  methods: {
    getPage () {
      this.pageLoading = true
      this.$http({
        url: this.$http.adornUrl('/multishop/notifyTemplateRemind/page'),
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
    },
    change (row) {
      const obj = JSON.parse(JSON.stringify(row))
      obj.isRemind = obj.isRemind === 1 ? 0 : 1
      this.$http({
        url: this.$http.adornUrl('/multishop/notifyTemplateRemind'),
        method: 'put',
        data: this.$http.adornParams(obj)
      }).then((res) => {
        this.$message({
          message: this.$t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getPage()
          }
        })
      })
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
