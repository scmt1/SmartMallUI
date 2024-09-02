<template>
  <div class="content main-container">
    <!-- 表格 -->
    <div class="table-con">
      <el-table ref="dataListRef" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
        <el-table-column :label="$t('takeStock.InventoryNo')" prop="takeStockNo" fixed="left" width="250">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.takeStockNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('takeStock.InventoryStatus')" prop="billStatus">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one" v-if="scope.row.billStatus === 0">{{ $t("takeStock.voided") }}</span>
            <span class="table-cell-text line-clamp-one" v-if="scope.row.billStatus === 1">{{ $t("takeStock.taking") }}</span>
            <span class="table-cell-text line-clamp-one" v-if="scope.row.billStatus === 2">{{ $t("takeStock.complete") }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('takeStock.skuCount')" prop="skuCount" >
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.skuCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('takeStock.createTime')" prop="createTime" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('takeStock.maker')" prop="makerMobile">
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{scope.row.makerMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('crud.menu')" fixed="right" width="200">
          <template slot-scope="scope">
            <div class="text-btn-con" :key="scope.row.takeStockId">
              <div v-if="isAuth('multishop:takeStockProd:edit') && scope.row.billStatus === 1" class="default-btn text-btn"
                   @click="updateHandle(scope.row.takeStockId)">{{ $t('text.editBtn') }}</div>
                    <el-popconfirm
                      class="default-btn text-btn"
                      :confirm-button-text="$t('takeStock.voidInventory')"
                      :cancel-button-text="$t('resource.cancel')"
                      :hide-icon="true"
                      :title="$t('takeStock.voidTip')"
                      placement="top"
                      @confirm="voidedHandle(scope.row.takeStockId)">
                      <div slot="reference" v-if="isAuth('multishop:takeStock:voided') && scope.row.billStatus === 1">
                        {{ $t('takeStock.voidInventory') }}
                      </div>
                    </el-popconfirm>
              <div v-if="isAuth('multishop:takeStock:detail')" class="default-btn text-btn"
                   @click="detailHandle(scope.row.takeStockId,scope.row.billStatus)">{{$t('shop.withdrawalDetail')}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    dataList: {
      default: []
    }
  },
  methods: {
    updateHandle (takeStockId) {
      this.$router.push({
        path: 'stock-edit-take-stock',
        query: {
          takeStockId: takeStockId
        }
      })
    },
    voidedHandle (takeStockId) {
      this.$http({
        url: this.$http.adornUrl('/stock/takeStock/voidedInventory/' + takeStockId),
        method: 'put',
        params: this.$http.adornParams()
      }).then(() => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000
        })
        this.refreshChange()
      })
    },
    detailHandle (takeStockId, billStatus) {
      this.$router.push({
        path: 'stock-detail-take-stock',
        query: {
          takeStockId: takeStockId,
          billStatus: billStatus
        }
      })
    },
    refreshChange () {
      this.$emit('refreshChange')
    }
  }
}
</script>
<style scoped>
div >>> .table-cell-text{
  display: inline !important;
}
</style>
