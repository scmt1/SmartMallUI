<template>
  <el-dialog
    :before-close="close"
    :title="
      !isShowProd
        ? this.$i18n.t('product.select')
        : this.$i18n.t('live.viewProduct')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"

  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('product.prodName')">
        <el-input
          v-model="prodName"
          :placeholder="this.$i18n.t('product.prodName')"
          clearable
        ></el-input>
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
        <div class="default-btn primary-btn" @click="searchProd">{{
          $t("order.query")
        }}</div>
      </el-form-item>
      <el-form-item>
        <div @click="clean" class="default-btn">{{
          $t("shop.resetMap")
        }}</div>
      </el-form-item>
    </el-form>
    <div class="main-container distribution-prod-add-or-update">
      <div class="table-con prods-select-body">
        <el-table
          ref="prodTable"
          :data="dataList"
          :header-cell-style="{height: '42px', background: '#F6F7FA', color:'#666666','font-weight': '500'}"
          :cell-style="{height: '64px', padding: '8px 0', color:'#000'}"
          v-loading="dataListLoading"
          style="width: 100%;"
          height="420"
        >
          <!-- <el-table-column v-if="!isShowProd"
                          type="selection"
                          header-align="center"
                          align="center"
                          width="50">
          </el-table-column>-->
          <el-table-column width="50" header-align="center" align="center">
            <template slot-scope="scope">
              <div>
                <el-radio
                  :label="scope.row.prodId"
                  v-model="prodId"
                  @change.native="getSelectProdRow(scope.$index, scope.row)"
                  >&nbsp;</el-radio
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="prodName"
            align="left"
            :label="this.$i18n.t('product.prodName')"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{scope.row.prodName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="this.$i18n.t('product.pic')"
          >
            <template slot-scope="scope">
              <!-- <img :src="resourcesUrl + scope.row.pic" width="60" height="60" /> -->
              <prod-pic
                height="60"
                width="60"
                :pic="scope.row.pic"
              ></prod-pic>
            </template>
          </el-table-column>
          <!-- 销售价(元) -->
           <el-table-column
            align="center"
            prop="price"
            :label="this.$i18n.t('product.sellingPrice')">
          </el-table-column>
        </el-table>
      </div>
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
      <div
        :class="[dataListSelections.length <= 0?'disabled-btn':'','default-btn primary-btn']"
        @click="selectProd(dataListSelections.length <= 0)"
        >{{ $t("crud.filter.submitBtn") }}</div
      >
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
import ProdPic from '@/components/prod-pic'
export default {
  components: {
    ProdPic
  },
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      isShowProd: 0,
      allData: [],
      prodId: 0,
      discountProds: [],
      discountId: 0,
      prodName: '',
      shopCategoryId: null,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: this.$i18n.t('language') === 'English' ? 'categoryNameEn' : 'categoryName'
      }
    }
  },
  props: {
    isDistribution: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    // 获取数据列表
    init (id, discountProds) {
      this.prodId = 0
      this.discountProds = discountProds
      this.discountId = id
      this.visible = true
      this.dataListLoading = true
      if (discountProds) {
        this.discountProds.forEach(row => {
          this.dataListSelections.push(row)
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
    showProd (id, val) {
      this.isShowProd = val
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(`/admin/discountProd/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          discountId: id
        })
      }).then(({ data }) => {
        this.dataList = data
      })
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionProd/canDistributionProdPage'),
        method: 'get',
        params: this.$http.adornParams({
          current: this.pageIndex,
          size: this.pageSize,
          prodName: this.prodName ? this.prodName : null,
          shopCategoryId: this.shopCategoryId ? this.shopCategoryId : null,
          status: 1,
          isDistribution: this.isDistribution ? 1 : 0,
          isActive: 1 // 过滤掉活动商品
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        this.$nextTick(() => {
          if (this.discountProds) {
            this.discountProds.forEach(row => {
              let index = this.dataList.findIndex(
                prodItem => prodItem.prodId === row.prodId
              )
              this.$refs.prodTable.toggleRowSelection(this.dataList[index])
            })
          }
        })
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
      if (this.isDistribution) {
        this.getDataList()
      } else {
        this.init(this.discountId, this.discountProds)
      }
    },
    /**
     * 清空搜索条件
     */
    clean () {
      this.prodName = ''
      this.shopCategoryId = null
      this.selectedCategory = idList(this.categoryList, this.shopCategoryId, 'categoryId', 'children').reverse()
    },
    close () {
      this.prodName = ''
      this.shopCategoryId = null
      this.visible = false
    },
    // 选择产品
    selectProd (status) {
      if (status) {
        return
      }
      var prods = []
      this.dataListSelections.forEach(item => {
        let prodIndex = prods.findIndex(prod => prod.prodId === item.prodId)
        if (prodIndex === -1) {
          prods.push({
            discountProdId: 0,
            prodId: item.prodId,
            prodName: item.prodName,
            pic: this.resourcesUrl + item.pic
          })
        }
      })
      // var prods = this.dataListSelections.map(item => {
      //   return {discountProdId: 0, prodId: item.prodId, prodName: item.prodName, pic: item.pic}
      // })
      this.$emit('refreshDiscountProds', prods)
      this.dataListSelections = []
      this.visible = false
    },
    // 获取当选的行
    getSelectProdRow (index, row) {
      this.dataListSelections = []
      this.dataListSelections.push(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container.distribution-prod-add-or-update {
  padding: 0;
  max-height: 480px;
  overflow: auto;
  .table-con {
    padding-bottom: 20px;
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
