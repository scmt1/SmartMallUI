<template>
  <el-dialog
    :title="$t('product.select')"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="closeBefore"
    width="960px"
    class="prods-select-dialog"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="$t('product.prodName') + ':'">
        <el-input
          v-model.trim="prodName"
          :placeholder="$t('product.prodName')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('marketing.subHeadings') + ':'">
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
        <div class="default-btn" @click="clean">{{
          $t("shop.resetMap")
        }}</div>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        :header-cell-style="{height: '42px', background: '#F6F7FA', color:'#666666','font-weight': '500'}"
        :cell-style="{height: '64px', padding: '8px 0', color:'#000'}"
        v-loading="dataListLoading"
        :row-key="getRowKeys"
        @selection-change="selectChangeHandle"
        @select="selectHandle"
        @select-all="selectAllHandle"
        style="width: 100%"
        height="420"
      >
        <el-table-column
          v-if="isSingle"
          width="50"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div class="prods-select-radio">
              <el-radio
                :label="scope.row.prodId"
                v-model="singleSelectProdId"
                @change.native="getSelectProdRow(scope.row)"
                >&nbsp;</el-radio
              >
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
        <el-table-column
          align="left"
          width="550"
          :label="$t('product.prodInfo')"
        >
          <template slot-scope="scope">
            <div class="prod-info">
              <img v-if="scope.row.pic" :src="resourcesUrl + scope.row.pic" width="48" height="48">
              <img v-else src="~@/assets/img/def.png" width="48" height="48">
              <span class="prod-name">{{scope.row.prodName}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 销售价(元) -->
        <el-table-column
          prop="price"
          :label="$t('product.sellingPrice')"
        >
          <template slot-scope="scope">
            <span class="prod-name">{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalStocks"
          :label="$t('product.totalStocks')"
        ></el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="margin-top:15px"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer">
      <div class="default-btn" @click="cancelFn">{{
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
        label: this.$i18n.t('language') === 'English' ? 'categoryNameEn' : 'categoryName'
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    prodType: {
      default: null,
      type: Number
    },
    dataUrl: {
      default: '/prod/prod/page',
      type: String
    },
    giveawayId: {
      default: 0,
      type: [String, Number]
    },
    groupActivityId: {
      default: null,
      type: [String, Number]
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
      this.selectProds = selectProds || []
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
        params: this.$http.adornParams({
          status: 1
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      })
    },
    cancelFn () {
      this.clean()
      this.visible = false
      this.$refs.prodTable.clearSelection()
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
              prodType: this.prodType,
              shopCategoryId: this.shopCategoryId ? this.shopCategoryId : null,
              status: 1,
              giveawayId: this.giveawayId ? this.giveawayId : null,
              groupActivityId: this.groupActivityId ? this.groupActivityId : null,
              isActive: 1 // 过滤掉活动商品
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.dataListSelections.length) {
          this.$nextTick(() => {
            this.dataListSelections.forEach(row => {
              let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
              if (index >= 0) {
                this.$refs.prodTable.toggleRowSelection(this.dataList[index], true)
              }
            })
          })
        }
        // if (this.selectProds.length) {
        //   this.$nextTick(() => {
        //     this.selectProds.forEach(row => {
        //       let index = this.dataList.findIndex((prodItem) => prodItem.prodId === row.prodId)
        //       if (index >= 0) {
        //         this.$refs.prodTable.toggleRowSelection(this.dataList[index], true)
        //       }
        //     })
        //   })
        // }
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
    selectAllHandle (e) {
      if (e.length > 0) {
        this.dataListSelections = this.dataListSelections.filter(value => this.dataList.map(val => val.prodId).indexOf(value.prodId) === -1)
        this.dataList.map(value => {
          this.dataListSelections.push(value)
        })
      } else {
        this.dataListSelections = this.dataListSelections.filter(value => this.dataList.map(val => val.prodId).indexOf(value.prodId) === -1)
      }
      console.log(this.dataListSelections)
    },
    // 多选点击事件
    selectHandle (selection, row) {
        // 判断是否选中
      let selectionStatu = selection.map(element => element.prodId).indexOf(row.prodId) !== -1
      if (selectionStatu && selection.length > 0 && selection) {
          // 选中添加
        this.dataListSelections.push(row)
      } else {
          // 未选中删除
        this.dataListSelections = this.dataListSelections.filter(element => element.prodId !== row.prodId)
      }
    },
    // 多选事件
    selectChangeHandle (selection) {
      // console.log(selection)
      // this.dataListSelections = selection
    },
    getRowKeys (row) {
      return row.prodId
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
      // 商品单选情况
      if (this.isSingle) {
        this.dataListSelections.length && this.$emit('refreshSelectProds', this.dataListSelections[0])
        this.dataListSelections = []
        this.visible = false
        // 商品多选情况
      } else {
        let prods = []
        // let flag = true
        this.dataListSelections.forEach(item => {
          let prodIndex = prods.findIndex((prod) => prod.prodId === item.prodId)
          // if (item.pic.indexOf(this.resourcesUrl) > -1) {
          //   flag = false
          // }
          if (prodIndex === -1) {
            prods.push(
              {
                prodId: item.prodId,
                prodName: item.prodName,
                pic: item.pic.indexOf(this.resourcesUrl) === -1 ? this.resourcesUrl + item.pic : item.pic,
                activityId: item.activityId,
                prodType: item.prodType,
                oriPrice: item.oriPrice,
                price: item.price,
                brief: item.brief,
                activityPrice: item.activityPrice
              }
            )
            // prods.push({ prodId: item.prodId, prodName: item.prodName, pic: item.pic, groupActivityId: item.groupActivityId, seckillActivityId: item.seckillActivityId })
          }
        })
        // this.$refs.prodTable.clearSelection()
        var msgInfo = ''
        // 秒杀活动选择商品的提示
        if (this.dataUrl.includes('canSekcillProdPage')) {
          msgInfo = this.$i18n.t('components.seckillWhetherToContinue')
        } else if (this.dataUrl.includes('getNotGroupProdPage')) {
          // 拼团活动选择商品的提示
          msgInfo = this.$i18n.t('components.groupWhetherToContinue')
        }
        if (msgInfo !== '' && msgInfo !== null) {
          this.prodIsSeckill(prods, msgInfo)
        } else {
          this.$emit('refreshSelectProds', prods)
          this.dataListSelections = []
          this.visible = false
        }
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
    },
    /**
     * 关闭前操作
     */
    closeBefore (done) {
      this.clean()
      this.$emit('closeProdsSelect')
      this.visible = false
      done()
    }
  }
}
</script>
<style lang="scss" scoped>
.prods-select-dialog {
  .el-input.el-input--small,
  .el-cascader.el-cascader--small {
    width: 180px;
  }
  .prods-select-body {
    height: 420px;
  }
  .prods-select-radio {
    .el-radio__label {
      display: none;
    }
  }
  .prod-info {
    display: flex;
    align-items: center;
    img {
      object-fit: contain;
    }
    .prod-name {
      flex: 1;
      margin-left: auto;
      padding: 0 30px 0 10px;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
     /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 20px;
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
