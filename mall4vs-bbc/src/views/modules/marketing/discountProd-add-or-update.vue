<template>
  <el-dialog
    :title="
      !isShowProd
        ? this.$i18n.t('product.select')
        : this.$i18n.t('live.viewProduct')
    "
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item :label="this.$i18n.t('product.prodName')">
        <el-input
          v-model="prodName"
          :placeholder="this.$i18n.t('product.prodName')"
          maxlength="300"
          show-word-limit
          size="small"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('marketing.subHeadings')">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          size="small"
          v-model="selectedCategory"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <div @click="searchProd" class="default-btn primary-btn">{{
          $t("order.query")
        }}</div>
      </el-form-item>
      <el-form-item>
        <div @click="clean" class="default-btn">{{
          $t("shop.resetMap")
        }}</div>
      </el-form-item>
    </el-form>
    <el-table
      ref="prodTable"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      v-loading="dataListLoading"
      style="width: 100%; margin-bottom: 20px"
    >
      <!-- <el-table-column v-if="!isShowProd"
                       type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>-->

      <el-table-column
        prop="prodName"
        :label="this.$i18n.t('product.prodName')"
      ></el-table-column>
      <el-table-column
        align="center"
        width="140"
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
    </el-table>
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
      <!-- <el-button type="primary"
                 v-if="isShowProd"
                 size="small"
      @click="visible = false">{{$t("crud.filter.submitBtn")}}</el-button>-->
      <div
        :class="[dataListSelections.length <= 0 && isDistribution !== 102 && !isShowProd ? 'disabled-btn':'','default-btn primary-btn']"
        @click="selectProd()"
        >{{ $t("crud.filter.submitBtn") }}</div
      >
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate, idList } from '@/utils'
import ProdPic from '@/components/prod-pic'
export default {
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
        label: 'categoryName'
      }
    }
  },
  components: {
    ProdPic
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
    showProdInit (id, val) {
      this.getCategoryList()
      this.pageIndex = 1
      this.showProd(id, val)
    },
    showProd (id, val) {
      this.isShowProd = val
      this.discountId = id
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(`/admin/discountProd/info/${id}`),
        method: 'get',
        params: this.$http.adornParams({
          current: this.pageIndex,
          size: this.pageSize,
          prodName: this.prodName ? this.prodName : null,
          shopCategoryId: this.shopCategoryId ? this.shopCategoryId : null
        })
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
      })
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/prod/prod/pageOnLineProd'),
        method: 'get',
        params: this.$http.adornParams({
          current: this.pageIndex,
          size: this.pageSize,
          prodName: this.prodName ? this.prodName : null,
          shopCategoryId: this.shopCategoryId ? this.shopCategoryId : null,
          status: 1,
          isDistribution: this.isDistribution ? 1 : 0
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
      if (this.isDistribution) {
        this.getDataList()
      } else {
        this.showProd(this.discountId, this.discountProds)
      }
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      if (this.isDistribution) {
        this.getDataList()
      } else {
        this.showProd(this.discountId, this.discountProds)
      }
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
        this.showProd(this.discountId, this.discountProds)
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

    // 关闭页面操作
    beforeClose (done) {
      this.clean()
      done()
    },
    // 选择产品
    selectProd () {
      if (this.isShowProd) {
        this.clean()
        this.visible = false
        return
      }
      if (this.dataListSelections.length <= 0 && this.isDistribution !== 102) {
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
      this.clean()
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
