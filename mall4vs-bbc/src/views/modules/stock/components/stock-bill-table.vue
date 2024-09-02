<template>
  <div class="content main-container">
    <!-- 表格 -->
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
          fixed="left"
          width="55"
          :reserve-selection="true"
          >
        </el-table-column>
        <el-table-column
          :label="type === 1 ? $t('stock.outStockOrderNo') : $t('stock.inStockOrderNo')"
          prop="stockBillNo"
          fixed="left"
          width="240">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.stockBillNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.stockBillType')"
          prop="stockBillType"
          >
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.stockBillType | type}}{{scope.row.reason ? '-' + scope.row.reason : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.billStatus')"
          prop="status"
          width="200">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{type === 1 ? statusStrOutArr[scope.row.status] : statusStrInArr[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="type === 1 ? $t('stock.actualOutCount') : $t('stock.actualInCount')"
          prop="totalCount"
          width="100px"
          >
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.totalCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="type === 1 ? $t('stock.totalOutAmount') : $t('stock.totalInAmount')"
          prop="totalAmount"
          width="180">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.totalAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('takeStock.maker')"
          prop="employeeMobile"
          width="180">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.employeeMobile || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.createOrderTime')"
          prop="createTime"
          width="200">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('crud.menu')"
          fixed="right"
          width="150"
        >
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div v-if="((isAuth('multishop:receiveStock:edit') && type === 2) || (isAuth('multishop:sendStock:edit') && type === 1)) && scope.row.status === 2" class="default-btn text-btn" @click="updateHandle(scope.row.stockBillLogId)">
                {{ $t('text.editBtn') }}</div>
              <el-popconfirm
                class="default-btn text-btn"
                v-if="((isAuth('multishop:receiveStock:voided') && type === 2) || (isAuth('multishop:sendStock:voided') && type === 1)) && scope.row.status === 2"
                :confirm-button-text="$t('takeStock.voidInventory')"
                :cancel-button-text="$t('order.cancel')"
                :hide-icon="true"
                :title="$t('stock.voidInventoryTips')"
                placement="top"
                @confirm="voidedHandle(scope.row.stockBillLogId)"
              >
                <div v-if="((isAuth('multishop:receiveStock:voided') && type === 2) || (isAuth('multishop:sendStock:voided') && type === 1)) && scope.row.status === 2" slot="reference">{{ $t('takeStock.voidInventory') }}</div>
              </el-popconfirm>
              <div class="default-btn text-btn" @click="detailHandle(scope.row.stockBillLogId)">{{ $t('shop.withdrawalDetail') }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
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
      isSubmit: false,
      dataListSelections: [],
      statusStrInArr: [
        this.$i18n.t('stock.voided'),
        this.$i18n.t('stock.inStorage'),
        this.$i18n.t('stock.waitSubmit')
      ],
      statusStrOutArr: [
        this.$i18n.t('stock.voided'),
        this.$i18n.t('stock.inOutbound'),
        this.$i18n.t('stock.waitSubmit')
      ]
    }
  },
  props: {
    dataList: {
      default: [],
      type: Array // 数据列表
    },
    type: {
      default: 0,
      type: Number // 1 出库 2 入库
    }
  },
  beforeCreate () {
    vueApp = this
  },
  methods: {
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    getSelectList () {
      return this.dataListSelections
    },
    updateHandle (stockBillLogId) {
      let path = this.type === 1 ? '/stock-send-add-or-update' : '/stock-receive-add-or-update'
      this.$router.push({
        path: path,
        query: {
          type: this.type,
          stockBillLogId: stockBillLogId
        }
      })
    },
    voidedHandle (stockBillLogId) {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/voided'),
        method: 'put',
        params: this.$http.adornParams(
          {stockBillLogId: stockBillLogId}
        )
      }).then(() => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000
        })
        this.isSubmit = false
        this.$emit('refreshList')
      }).catch(() => {
        this.isSubmit = false
      })
    },
    detailHandle (stockBillLogId) {
      let path = this.type === 1 ? '/stock-send-detail' : '/stock-receive-detail'
      this.$router.push({
        path: path,
        query: {
          type: this.type,
          stockBillLogId: stockBillLogId
        }
      })
    }
  }
}
</script>
