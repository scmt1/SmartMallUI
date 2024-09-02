<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    :modal="false"
    top="1"
    style="padding-top:60px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="980px"
    class="single-prods-select-dialog"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('product.itemName')">
        <el-input v-model="prodName" :placeholder="this.$i18n.t('product.itemName')" clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.singleProductBar')">
        <el-input v-model="barCode" :placeholder="this.$i18n.t('product.singleProductBar')" clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('marketing.subHeadings')">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          v-model="selectedCategory"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="searchProd">{{$t("order.query")}}</div>
        <div class="default-btn" @click="clean">{{$t("shop.resetMap")}}</div>
      </el-form-item>
    </el-form>
    <div class="main-container">
      <div class="table-con prods-select-body">
        <el-table
          ref="prodTable"
          :data="dataList"
          :header-cell-style="{height: '42px', background: '#F6F7FA', color:'#666666','font-weight': '500'}"
          :cell-style="{height: '64px', padding: '8px 0', color:'#000'}"
          v-loading="dataListLoading"
          @selection-change="selectChangeHandle"
          style="width: 100%;"
          height="530"
        >
          <el-table-column v-if="isSingle" width="50" align="center">
            <template slot-scope="scope">
              <div>
                <el-radio
                  :label="scope.row.retailProdId"
                  v-model="singleSelectProdId"
                  @change.native="getSelectProdRow(scope.row)"
                >&nbsp;</el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isSingle"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column width="100" :label="this.$i18n.t('product.singleProdPic')">
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img v-if="scope.row.pic" :src="scope.row.pic">
                <img v-else src="../../assets/img/def.png">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="this.$i18n.t('product.itemName')">
            <template slot-scope="scope">
              <div class="table-cell-text">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="spec" :label="this.$i18n.t('product.singleProdSpe')"></el-table-column>
          <el-table-column prop="costPrice" :label="this.$i18n.t('product.singleProd')"></el-table-column>
          <el-table-column prop="stocks" :label="this.$i18n.t('product.singleProdInve')"></el-table-column>
          <el-table-column prop="barCode" :label="this.$i18n.t('product.singleProductBar')"></el-table-column>
          <el-table-column prop="categoryName" :label="this.$i18n.t('product.singleProdClas')">
            <template slot-scope="scope">
              <div class="table-cell-text">
                {{scope.row.categoryName}}
              </div>
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
    </div>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      singleSelectProdId: 0,
      allData: [],
      selectProds: [],
      dataList: [],
      prodName: '',
      barCode: '',
      shopCategoryId: null,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: [],
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      oriSelectData: [] // 选择的原来的数据
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    dataUrl: {
      default: '/shop/retailProd/page',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (selectProds) {
      this.singleSelectProdId = 0
      this.selectProds = selectProds
      this.visible = true
      this.dataListLoading = true
      if (this.selectProds) {
        this.selectProds.forEach(row => {
          this.dataListSelections.push(row)
          this.oriSelectData.push(row)
        })
      }
      this.getDataList()
      this.getCategoryList()
    },
    getCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          status: 1
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      })
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
              name: this.prodName ? this.prodName : null,
              categoryId: this.shopCategoryId ? this.shopCategoryId : null,
              barCode: this.barCode ? this.barCode : null
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectProds) {
          this.$nextTick(() => {
            this.selectProds.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.retailProdId === row.retailProdId)
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          })
        }
      })
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
          return selectedProd.retailProdId === tableItem.retailProdId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.retailProdId === tableItem.retailProdId)
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
      this.prodName = ''
      this.barCode = ''
      this.shopCategoryId = null
      this.selectedCategory = idList(this.categoryList, this.shopCategoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      this.dataListSelections.forEach(item => {
        if (this.oriSelectData.length) {
          let oriProd = this.oriSelectData.find((oriItem) => oriItem.retailProdId === item.retailProdId)
          if (oriProd) {
            item.retailNums = oriProd.retailNums
            item.total = oriProd.total
          } else {
            item.retailNums = 1
            item.total = item.costPrice
          }
        } else {
          item.retailNums = 1
          item.total = item.costPrice
        }
      })
      this.$emit('refreshSelectSingleProds', this.dataListSelections)
      this.dataListSelections = []
      this.oriSelectData = []
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.single-prods-select-dialog {
  .el-form-item.el-form-item--small {
    margin-bottom: 0;
  }
  .el-form-item.el-form-item--small:last-child {
    margin-right: 0;
  }
  .main-container {
    padding: 0;
    .table-con.prods-select-body{
      padding-bottom: 0;
      height: 550px;
      overflow: auto;
    }
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 439px;
    background: #F7F8FA;
    opacity: 1;
    border-radius: 4px;
  }
  // 滚动条的滑块
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    width: 6px;
    height: 150px;
    background: #E9ECF3;
    opacity: 1;
    border-radius: 4px;
  }
}

</style>
