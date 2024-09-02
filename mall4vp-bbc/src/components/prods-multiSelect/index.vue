<template>
  <el-dialog
    :title="$t('product.select')"
    top="100px"
    :append-to-body="visible"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <el-form :inline="true" :model="dataForm" size="small" class="demo-form-inline">
      <el-form-item :label="$t('product.prodName')">
        <el-input
          v-model="prodName"
          :placeholder="$t('product.prodName')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.categoryParent')">
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
        <div class="default-btn primary-btn" @click="searchProd">{{ $t("coupon.query") }}</div>
        <div class="default-btn" @click="clean">{{ $t("product.reset") }}</div>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        height="500"
        v-loading="dataListLoading"
        :row-key="getRowKeys"
        @selection-change="selectChangeHandle"
        @select="selectProd"
        @select-all="selectAllProd"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="prodName"
          header-align="center"
          align="center"
          :label="$t('coupon.commodityName')"
        ></el-table-column>
        <el-table-column align="center" width="140" :label="$t('product.pic')">
          <template slot-scope="scope">
            <img v-if="scope.row.pic" :src="imgPathFormat(scope.row.pic)" width="100" height="100" />
            <img v-else src="~@/assets/img/def.png" width="100" height="100">
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
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
    </div>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{ $t("coupon.cancel") }}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{ $t("coupon.confirm") }}</div>
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
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      prodName: null,
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,

      selectAllData: []
    }
  },
  props: {
    prodType: {
      default: null,
      type: Number
    },
    dataUrl: {
      default: '/platform/search/prod/page',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  beforeDestroy () {
    this.$refs.prodTable.clearSelection()
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
          this.selectAllData.push(row)
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
          maxGrade: 2,
          status: 1
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      })
    },
    getDataList (isSel = true) {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              keyword: this.prodName ? this.prodName : null,
              categoryId: this.categoryId ? this.categoryId : null,
              status: 1,
              prodType: this.prodType,
              isActive: 1 // 过滤掉活动商品
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        // if (this.selectProds && this.selectProds.length) {
        //   this.$nextTick(() => {
        //     this.selectProds.forEach(row => {
        //       let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
        //       if (index >= 0) {
        //         this.$refs.prodTable.toggleRowSelection(this.dataList[index], true)
        //       }
        //     })
        //   })
        // }

        if (isSel) {
          this.$nextTick(() => {
            console.log('page', this.pageIndex)
            let dataIndexList = this.dataList.map((item) => { return item.prodId })
            this.selectAllData.forEach(row => {
                // let index = this.dataList.findIndex((prodItem) => prodItem.prodId === )
              if (dataIndexList.indexOf(row.prodId) >= 0) {
                console.log('prodId', row.prodId)
                this.$refs.prodTable.toggleRowSelection(this.dataList[dataIndexList.indexOf(row.prodId)], true)
              }
            })
            this.$forceUpdate()
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
      this.dataListSelections = selection
    },
    // 选择商品
    selectProd (sel, row) {
      let selIndexList = sel.map((item) => { return item.prodId })
      let allIndexList = this.selectAllData.map((item) => { return item.prodId })
      if (selIndexList.indexOf(row.prodId) > -1 && allIndexList.indexOf(row.prodId) < 0) {
        this.selectAllData.push(row)
      } else {
        this.selectAllData.splice(allIndexList.indexOf(row.prodId), 1)
      }
      console.log('all', this.selectAllData)
    },
    selectAllProd (sel) {
      let selIndexList = sel.map((item) => { return item.prodId })
      let allIndexList = this.selectAllData.map((item) => { return item.prodId })
      let dataIndexList = this.dataList.map((item) => { return item.prodId })
      if (sel.length > 0) {
        selIndexList.forEach((item, index) => {
          if (allIndexList.indexOf(item) < 0) {
            this.selectAllData.push(sel[index])
          }
        })
      } else {
        this.selectAllData = this.selectAllData.filter((item) => {
          return dataIndexList.indexOf(item.prodId) < 0
        })
      }
      console.log('all', this.selectAllData)
    },
    // isExist (dataListSelections, spu) {
    //   for (const item of dataListSelections) {
    //     if (item.prodId === spu.prodId) {
    //       return true
    //     }
    //   }
    //   return false
    // },
    getRowKeys (row) {
      return row.prodId
    },
    /**
     * 获取分类id
     */
    handleChange (val) {
      this.categoryId = val[val.length - 1]
    },
    /**
     * 根据条件搜索商品
     */
    searchProd () {
      this.pageIndex = 1
      this.getDataList(false)
    },
    /**
     * 清空搜索条件
     */
    clean () {
      this.prodName = ''
      this.categoryId = null
      this.selectedCategory = idList(this.categoryList, this.categoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      let prods = []
      this.selectAllData.forEach(item => {
        let prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
        if (prodIndex === -1) {
          prods.push(
            {
              prodId: item.prodId,
              prodName: item.prodName,
              pic: this.resourcesUrl + item.pic,
              prodType: item.prodType,
              oriPrice: item.oriPrice,
              price: item.price,
              brief: item.brief,
              activityPrice: item.activityPrice
            }
            )
        }
      })
      this.$emit('refreshSelectProds', prods)
      this.selectAllData = []
      this.visible = false
    },
    // 图片路径格式化
    imgPathFormat (picPath) {
      if (picPath.includes('http')) {
        return picPath
      }
      return this.resourcesUrl + picPath
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
}
</style>

