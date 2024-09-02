<template>
  <el-dialog
    :title="$t('product.chooSingPro')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="$t('retailProd.name')">
        <el-input
          v-model.trim="name"
          :placeholder="$t('retailProd.name')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.shopCategories')">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          v-model="selectedCategory"
          @change="handleChange"
          style="width: 180px"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="searchProd">{{
            $t("order.query")
          }}</div>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="clean">{{
            $t("shop.resetMap")
          }}</div>
      </el-form-item>
    </el-form>
    <div>{{$t("dataAnaly.chosen")}}{{$t("home.product")}}:{{totalSelectCount}}</div>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%"
      >
        <el-table-column
          header-align="center"
          align="center"
          width="50"
        >
          <!--自定义选择-->
          <template slot="header" slot-scope="scope">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"/>
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.check" :key="scope.row.retailProdId" @change="handleCheckedCitiesChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="380"
          :label="$t('stock.retailInfo')"
        >
          <template slot-scope="scope">
            <div class="prod-info-container">
              <div class="prod-image">
                <img class="img"  v-if="scope.row.pic" :src="scope.row.pic" width="100" height="100" />
                <img v-else src="">
              </div>
              <div class="prod-name">
                <div class="prod-name-txt">
                  {{scope.row.name}}
                </div>
                <div class="prod-no">
                  {{scope.row.barCode}}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="this.$i18n.t('stock.unit')"
          prop="type"
          align="center"
        >
          <template slot-scope="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.unit || $t('stock.pieces') }}</span>
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
              {{scope.row.spec || '-'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="stocks"
          header-align="center"
          align="center"
          :label="$t('coupon.stock')"
        >
          <template slot-scope="scope">
            <div class="sku-name-txt">
              {{scope.row.stocks}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin:15px 5px"
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
import { treeDataTranslate, idList } from '@/utils'
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      visible: true,
      dataForm: {
        product: ''
      },
      prodItem: [], // 选择的sku商品项
      singleSelectProdId: 0,
      allData: [],
      checkAll: false, // 全选状态
      isIndeterminate: false, // 不确定状态
      currentPageCheckCount: 0, // 当前页选中的结点数量
      dataList: [],
      name: '',
      shopCategoryId: null,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      messageClosed: false,
      totalSelectCount: 0, // 当前选择的商品总数量
      chosenNodesMap: {}, // 已选择的结点对象map
      currentCheckNodesMap: {}, // 当前选择的结点对象map
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      }
    }
  },
  props: {
    prodType: {
      default: null,
      type: Number // 商品类型
    },
    dataUrl: {
      default: '/shop/retailProd/page',
      type: String // 商品请求url
    },
    chosenCheckItems: {
      default: [],
      type: Array // 已选择的数据项
    },
    isMemoryOldData: {
      default: false,
      type: Boolean // 是否记忆已选择的数据项中的数据
    }
  },
  watch: {
    chosenCheckItems (newVal) {
      // this.setDefaultCheckedKeys(newVal)
    }
  },
  activated () {
    this.init()
  },
  methods: {
    // 获取数据列表
    init () {
      this.dataListLoading = true
      this.name = ''
      this.selectedCategory = []
      this.shopCategoryId = null
      this.totalSelectCount = 0
      this.chosenNodesMap = {}
      this.currentCheckNodesMap = {}
      this.setDefaultCheckedKeys()
      this.getDataList()
      this.getCategoryList()
      this.visible = true
    },
    setDefaultCheckedKeys () {
      if (this.chosenCheckItems && this.chosenCheckItems.length > 0) {
        this.chosenCheckItems.forEach(node => {
          node = node || {}
          this.chosenNodesMap[node.retailProdId] = node
          this.currentCheckNodesMap[node.retailProdId] = node
          ++this.totalSelectCount
        })
      }
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
    /**
     * 点击全选按钮
     */
    handleCheckAllChange () {
      this.isIndeterminate = false
      this.totalSelectCount = this.totalSelectCount - this.currentPageCheckCount
      if (this.checkAll) {
        this.currentPageCheckCount = this.dataList.length
        this.dataList.forEach(item => {
          item.check = true
          this.currentCheckNodesMap[item.retailProdId] = item
        })
      } else {
        this.currentPageCheckCount = 0
        this.dataList.forEach(item => {
          item.check = false
          delete this.currentCheckNodesMap[item.retailProdId]
        })
      }
      this.totalSelectCount = this.totalSelectCount + this.currentPageCheckCount
    },
    /**
     * 点击行选择按钮
     */
    handleCheckedCitiesChange (row) {
      if (row.check) {
        // 勾选
        ++this.currentPageCheckCount
        ++this.totalSelectCount
        this.currentCheckNodesMap[row.retailProdId] = row
      } else {
        // 取消勾选
        --this.currentPageCheckCount
        --this.totalSelectCount
        delete this.currentCheckNodesMap[row.retailProdId]
      }
      this.setCheckAllVal()
    },
    setCheckAllVal () {
      this.checkAll = this.currentPageCheckCount === this.dataList.length
      this.isIndeterminate = this.currentPageCheckCount > 0 && this.currentPageCheckCount < this.dataList.length
    },
    /**
     * 获取商品数据
     */
    getDataList () {
      this.currentPageCheckCount = 0
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              name: this.name ? this.name : null,
              prodType: this.prodType,
              shopCategoryId: this.shopCategoryId
            }
          )
        )
      }).then(({ data }) => {
        this.totalPage = data.total
        if (this.chosenCheckItems) {
          data.records.forEach(item => {
            const retailProdId = item.retailProdId
            if (this.currentCheckNodesMap[retailProdId]) {
              ++this.currentPageCheckCount
              item.check = true
            } else {
              item.check = false
            }
          })
        }
        this.dataList = data.records
        this.setCheckAllVal()
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
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
      this.getDataList()
    },
    /**
     * 清空搜索条件
     */
    clean () {
      this.name = ''
      this.shopCategoryId = null
      this.selectedCategory = idList(this.categoryList, this.shopCategoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      let selectList = []
      if (this.isMemoryOldData) {
        for (let i in this.currentCheckNodesMap) {
          let item = this.currentCheckNodesMap[i]
          if (this.chosenNodesMap[item.retailProdId]) {
            selectList.push(this.chosenNodesMap[item.retailProdId])
          } else {
            selectList.push(item)
          }
        }
      } else {
        selectList = Object.values(this.currentCheckNodesMap)
      }
      this.$emit('refreshSelectProds', selectList)
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.prods-select-body {
  margin-top: 10px;
}
.prod-info-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-content: center;
  height: 70px;
  .prod-image {
    margin-right: 20px;
    width: 70px;
    height: 70px;
    .img {
      width: 70px !important;
      height: 70px !important;
    }
  }
  .prod-name {
    width: 260px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .prod-name-txt {
      font-size: 14px;
      color: #333333;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .prod-no {
      font-size: 14px;
      color: #333333;
    }
  }
}
.sku-name-txt {
  font-size: 14px;
  color: #333333;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
