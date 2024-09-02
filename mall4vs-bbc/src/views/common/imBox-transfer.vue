<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item :label="this.$i18n.t('product.prodName')">
        <el-input v-model="prodName" :placeholder="this.$i18n.t('product.prodName')" clearable></el-input>
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
        <el-button type="primary" @click="searchProd" icon="el-icon-search">{{$t("order.query")}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="clean" icon="el-icon-delete">{{$t("shop.resetMap")}}</el-button>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectChangeHandle"
        style="width: 100%;"
      >
        <el-table-column v-if="isSingle" width="50" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.prodId"
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
        <el-table-column align="center" width="140" :label="this.$i18n.t('product.pic')">
          <template slot-scope="scope">
            <img :src="scope.row.pic" width="100" height="100" />
          </template>
        </el-table-column>
        <el-table-column
          prop="prodName"
          header-align="center"
          align="center"
          :label="this.$i18n.t('product.prodName')"
        ></el-table-column>
        <el-table-column
          prop="price"
          header-align="center"
          align="center"
          :label="this.$i18n.t('components.commodityPrice')"
          width="200px"
        ></el-table-column>
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
    </div>
    <span slot="footer">
      <el-button @click="visible = false">{{$t("crud.filter.cancelBtn")}}</el-button>
      <el-button type="primary" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</el-button>
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
      }
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    dataUrl: {
      default: '/prod/prod/page',
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
        })
      }
      this.getDataList()
      this.getCategoryList()
    },
    getCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams()
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
              prodName: this.prodName ? this.prodName : null,
              shopCategoryId: this.shopCategoryId ? this.shopCategoryId : null,
              status: 1
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
              let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
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
          return selectedProd.prodId === tableItem.prodId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
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
      this.shopCategoryId = null
      this.selectedCategory = idList(this.categoryList, this.shopCategoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      let prods = []
      this.dataListSelections.forEach(item => {
        let prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
        if (prodIndex === -1) {
          prods.push(
            {
              prodId: item.prodId,
              prodName: item.prodName,
              pic: item.pic,
              activityId: item.activityId,
              prodType: item.prodType
            }
          )
        }
      })
      var msgInfo = ''
      // 秒杀活动选择商品的提示
      if (this.dataUrl.includes('canSekcillProdPage')) {
        msgInfo = this.$i18n.t('components.whetherToContinue')
      } else if (this.dataUrl.includes('getNotGroupProdPage')) {
        // 拼团活动选择商品的提示
        msgInfo = this.$i18n.t('components.whetherToContinue')
      }
      if (msgInfo !== '' && msgInfo !== null) {
        this.prodIsSeckill(prods, msgInfo)
      } else {
        this.$emit('refreshSelectProds', prods)
        this.dataListSelections = []
        this.visible = false
      }
    },
    /**
     * 查询商品是否在参与秒杀活动
     */
    prodIsSeckill (prods, msgInfo) {
      let prodIds = []
      for (let index = 0; index < prods.length; index++) {
        prodIds.push(prods[index].prodId)
      }
      this.$http({
        url: this.$http.adornUrl('/admin/discount/prodIsDiscount'),
        method: 'post',
        data: prodIds
      }).then(({ data }) => {
        var msg = data
        if (msg !== undefined && msg !== null && msg !== '') {
          this.$confirm(msgInfo, this.$i18n.t('text.tips'), {
            confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
            cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
            type: 'warning'
          }).then(() => {
            this.$emit('refreshSelectProds', prods)
            this.dataListSelections = []
            this.visible = false
          }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消选择'
            // })
          })
        } else {
          this.$emit('refreshSelectProds', prods)
          this.dataListSelections = []
          this.visible = false
        }
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
