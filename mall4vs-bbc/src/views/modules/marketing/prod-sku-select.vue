<template>
  <el-dialog
    :title="$t('combo.editSpec')"
    :visible.sync="visible"
  >
    <el-table
      ref="dataListRef"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      :row-style="{ height:'70px'}"
      style="width: 100%"
    >
      <el-table-column
        prop="partyCode"
        header-align="center"
        align="center"
        width="60"
      >
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="isCheckAll" :indeterminate="indeterminate" @change="checkAll"></el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.check" @change="checkSku(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="skuName"
        header-align="center"
        align="center"
        :label="$t('stock.spec')"
      >
        <template slot-scope="scope">
          <div class="sku-name-txt">
            {{scope.row.skuName || '-'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.stock')"
        prop="stocks"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span class="table-cell-text line-clamp-one">{{scope.row.stocks}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('stock.price')"
        prop="price"
        align="center"
        width="120">
        <template slot-scope="scope">
          <span class="table-cell-text line-clamp-one">{{scope.row.price}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{
          $t("crud.filter.cancelBtn")
        }}</div>
      <div class="default-btn primary-btn" type="primary" @click="submitProds()">{{
          $t("crud.filter.submitBtn")
        }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      visible: false,
      dataList: [], // 数据列表
      isCheckAll: false, // 全部选择
      indeterminate: false, // 部分选择
      choseSkuMap: {}, // 已选择的sku对象Map
      choseSkuCount: 0, // 选择的sku
      searchForm: {
        prodId: null
      }
    }
  },
  created () {
  },
  methods: {
    init (prodId, choseSkuList) {
      this.visible = true
      this.dataList = []
      this.choseSkuMap = {}
      this.choseSkuCount = 0
      this.searchForm.prodId = prodId
      choseSkuList.forEach(sku => {
        ++this.choseSkuCount
        this.choseSkuMap[sku.skuId] = sku
      })
      this.getDataList()
    },
    // 点击选择sku
    checkSku (row) {
      if (row.check) {
        ++this.choseSkuCount
        this.$set(row, 'check', true)
      } else {
        --this.choseSkuCount
        this.$set(row, 'check', false)
      }
      this.isCheckAll = this.choseSkuCount === this.dataList.length
      this.indeterminate = this.choseSkuCount > 0 && (this.choseSkuCount < this.dataList.length)
    },
    // 点击全选按钮
    checkAll () {
      if (this.isCheckAll) {
        this.dataList.forEach(sku => {
          this.$set(sku, 'check', true)
        })
        this.choseSkuCount = this.dataList.length
      } else {
        this.dataList.forEach(sku => {
          this.$set(sku, 'check', false)
        })
        this.choseSkuCount = 0
      }
      this.indeterminate = false
    },
    // 获取sku列表
    getDataList (page) {
      this.$http({
        url: this.$http.adornUrl('/sku/getEnableSkuList'),
        method: 'get',
        params: this.$http.adornParams(
            this.searchForm
        )
      }).then(({data}) => {
        data.forEach(sku => {
          if (this.choseSkuMap[sku.skuId]) {
            this.$set(sku, 'check', true)
          } else {
            this.$set(sku, 'check', false)
          }
        })
        this.isCheckAll = this.choseSkuCount === data.length
        this.indeterminate = this.choseSkuCount > 0 && (this.choseSkuCount < data.length)
        this.dataList = data
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 确认提交
    submitProds () {
      let skuList = []
      this.dataList.forEach(sku => {
        if (sku.check) {
          let temp = this.choseSkuMap[sku.skuId] ? this.choseSkuMap[sku.skuId] : sku
          skuList.push(temp)
        }
      })
      this.$emit('refreshSelectSkus', skuList)
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
