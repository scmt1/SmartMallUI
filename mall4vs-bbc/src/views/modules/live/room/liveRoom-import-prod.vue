<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    :modal="true"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('publics.name')">
        <el-input v-model="name" :placeholder="this.$i18n.t('publics.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="searchProd">{{$t("order.query")}}</div>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="clean">{{$t("shop.resetMap")}}</div>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTable"
        :data="dataList"
        v-loading="dataListLoading"
        @selection-change="selectChangeHandle"
        header-cell-class-name="table-header"
        row-class-name="table-row"
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
            <img :src="scope.row.pic" width="70" height="70" />
          </template>
        </el-table-column>
        <el-table-column align="center" width="140" :label="this.$i18n.t('live.liveProductCover')">
          <template slot-scope="scope">
            <img :src="scope.row.coverPic" width="70" height="70" />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          :label="this.$i18n.t('publics.name')"
        ></el-table-column>
        <el-table-column
          prop="price"
          header-align="center"
          align="center"
          :label="this.$i18n.t('live.commodityPriceYuan')"
          width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.priceType === 3">{{scope.row.price2}}</span>
            <span v-if="scope.row.priceType !== 3">{{scope.row.price}}</span>
            <span></span>
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
    </div>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
// import { treeDataTranslate, idList } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        liveProdStores: [],
        id: null
      },
      singleSelectProdId: 0,
      allData: [],
      selectProds: [],
      dataList: [],
      name: '',
      shopCategoryId: null,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      isSubmit: false,
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
      default: '/live/liveProdStore/listAppleProds',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (id) {
      this.dataListSelections = []
      this.visible = true
      this.isSubmit = false
      this.dataListLoading = true
      this.dataForm.id = id
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
              name: this.name ? this.name : null,
              id: this.dataForm.id ? this.dataForm.id : null
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
    },
    // 确定事件
    submitProds () {
      this.dataForm.liveProdStores = this.dataListSelections
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl('/multishop/live/liveRoom/addLiveRoomProd'),
        method: 'post',
        data: this.$http.adornData(this.dataForm)
      }).then(({ data }) => {
        this.isSubmit = true
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      }).catch(() => {
        console.log('boom')
        this.isSubmit = false
      })
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 600px;
  overflow: auto;
  margin-bottom: 20px;
}
.prods-select-body ::v-deep .el-table {
  margin-bottom: 20px;
}
</style>
