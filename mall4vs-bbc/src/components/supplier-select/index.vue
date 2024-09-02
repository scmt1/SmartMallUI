<template>
  <el-dialog
    :title="this.$i18n.t('product.chooseSupplier')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="914px"
    class="supplier-select-dialog"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('shop.supplierName')">
        <el-input v-model="supplierName" :placeholder="this.$i18n.t('shop.supplierName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="searchProd">{{$t("order.query")}}</div>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="clean">{{$t("shop.resetMap")}}</div>
      </el-form-item>
    </el-form>

    <div class="table-con supplier-list-con">
      <el-table
        ref="prodTable"
        :data="dataList"
        v-loading="dataListLoading"
        header-cell-class-name="table-header"
        row-class-name="supplier-table-row"
        style="width: 100%;"
        max-height="366"
      >
        <el-table-column v-if="isSingle" width="50" align="left">
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.supplierId"
                v-model="singleSelectSupplierId"
                @change.native="getSelectProdRow(scope.row)"
              >&nbsp;</el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isSingle"
          type="selection"
          align="left"
          width="50"
        ></el-table-column>
        <el-table-column prop="supplierName" align="left" :label="this.$i18n.t('shop.supplierName')" width="230"></el-table-column>
        <el-table-column prop="tel" align="left" :label="this.$i18n.t('shop.tel')" width="180"></el-table-column>
        <el-table-column prop="contactName" align="left" :label="this.$i18n.t('shop.contactName')" width="160"></el-table-column>
        <el-table-column prop="contactTel" align="left" :label="this.$i18n.t('shop.contactTel')" width="160"></el-table-column>
        <el-table-column align="left" :label="this.$i18n.t('product.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" class="tag-text">{{$t("groups.startUsing")}}</span>
            <span v-if="scope.row.status === 0" class="tag-text">{{$t("publics.disable")}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        supplier: ''
      },
      singleSelectSupplierId: 0,
      allData: [],
      selectProds: [],
      dataList: [],
      supplierName: '',
      shopCategoryId: null,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: []
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    dataUrl: {
      default: '/supplier/supplier/page',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (selectProds) {
      this.singleSelectSupplierId = 0
      this.selectProds = selectProds
      this.visible = true
      this.dataListLoading = true
      if (this.selectProds) {
        this.selectProds.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              supplierName: this.supplierName ? this.supplierName : null,
              status: 1
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.testSuppliers()
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.supplierId === row.supplierId)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      })
    },
    // 去除处于禁用状态的的供应商
    testSuppliers () {
      var suppliersTest = this.dataList
      var supplierNum = this.totalPage
      // for ()
      for (var i = 0; i < suppliersTest.length; i++) {
        if (suppliersTest[i].status === 0) {
          suppliersTest.splice(i, 1)
          supplierNum = supplierNum - 1
        }
      }
      this.totalPage = supplierNum
      this.dataList = suppliersTest
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 单选商品事件
    getSelectProdRow (row) {
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedProd) => {
          if (!selectedProd) {
            return false
          }
          return selectedProd.supplierId === tableItem.supplierId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.supplierId === tableItem.supplierId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    /**
     * 获取分类id
     */
    handleChange (val) {
      this.shopCategoryId = val[val.length - 1]
    },
    /**
     * 根据条件搜索商品
     */
    searchProd () {
      this.pageIndex = 1
      this.getDataList()
    },
    /**
     * 清空搜索条件
     */
    clean () {
      this.supplierName = ''
      this.shopCategoryId = null
    },
    // 确定事件
    submitProds () {
      let suppliers = []
      this.dataListSelections.forEach(item => {
        let supplierIndex = suppliers.findIndex((supplier) => supplier.supplierId === item.supplierId)
        if (supplierIndex === -1) {
          suppliers.push(
            {
              supplierId: item.supplierId,
              supplierName: item.supplierName,
              isDefault: item.isDefault
            }
          )
        }
      })
      this.$emit('refreshSelectSupplier', suppliers)
      this.dataListSelections = []
      this.selectProds = []
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.supplier-select-dialog {
  .supplier-list-con {
    margin-bottom: 20px;
    .supplier-table-row {
      height: 55px;
    }
  }
}

</style>
