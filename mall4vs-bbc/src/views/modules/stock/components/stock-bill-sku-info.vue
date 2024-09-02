<template>
  <!-- 商品信息 -->
  <div class="prodItem-container">
    <span class="title">{{ this.$i18n.t('group.prodInfo') }}</span>
    <el-divider></el-divider>
    <div class="default-btn primary-btn" @click="selectProdHandle()">{{ this.$i18n.t('shop.addProd') }}</div>
    <el-tooltip class="item" :disabled="stockBillLogItems.length === 0" effect="dark" :content="this.$i18n.t('stock.uploadNotEmptyTips')" placement="top">
      <div class="default-btn" :class="{'disabled-btn': stockBillLogItems.length > 0}" @click="uploadSku">{{ this.$i18n.t('stock.batchImport') }}</div>
    </el-tooltip>
    <div v-if="failureCount > 0" class="default-btn" @click="deleteFailureProd">{{ this.$i18n.t('stock.deleteFailureProd') }}</div>
    <div class="count-desc-text">{{ this.$i18n.t('order.total') }}{{stockBillLogItems.length}}{{ type === 1 ? this.$i18n.t('stock.prodCountOutTips') : this.$i18n.t('stock.prodCountTips') }}:{{totalCount}}</div>
    <div v-if="failureCount > 0" class="count-desc-text">{{ this.$i18n.t('stock.include') }}{{failureCount}}{{ this.$i18n.t('stock.failureCountTips') }}</div>
    <div v-if="!verifyFlag" class="error-tips">{{ this.$i18n.t('stock.prodNotEmpty') }}</div>
    <div class="prodItem-table">
      <el-table
        :data="stockBillLogItems.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          :label="this.$i18n.t('group.prodInfo')"
          prop="reason"
          fixed="left"
          align="center"
          width="320px"
          >
          <template slot-scope="scope">
            <div class="prod-info-container">
              <div v-if="scope.row.type === 1" class="prod-image">
                <img v-if="scope.row.pic" :src="resourcesUrl + scope.row.pic">
                <img v-else src="">
              </div>
              <div v-else class="prod-image">
                <img v-if="scope.row.pic" :src="scope.row.pic && (scope.row.pic).indexOf('http') === -1 ? resourcesUrl + scope.row.pic : scope.row.pic ">
                <img v-else src="">
              </div>
              <div class="prod-name">
                <el-tooltip :content="scope.row.prodName" placement="top" effect="light">
                  <div class="prod-name-txt">
                    {{scope.row.prodName}}
                  </div>
                </el-tooltip>
                <el-tooltip :content="scope.row.skuName" placement="top" effect="light">
                  <div class="spec">
                    {{scope.row.skuName}}
                  </div>
                </el-tooltip>
                <div class="prod-no">
                  {{scope.row.partyCode}}
                </div>
              </div>
              <!-- <div v-if="scope.row.type === 1" class="prod-name">
                <el-tooltip :content="scope.row.prodName" placement="top" effect="light">
                  <div class="prod-name-txt">
                    {{scope.row.prodName}}
                  </div>
                </el-tooltip>
                <el-tooltip :content="scope.row.skuName" placement="top" effect="light">
                  <div class="spec">
                    {{scope.row.skuName}}
                  </div>
                </el-tooltip>
                <div class="prod-no">
                  {{scope.row.partyCode}}
                </div>
              </div>
              <div v-else class="prod-name">
                <el-tooltip :content="scope.row.name" placement="top" effect="light">
                  <div class="prod-name-txt">
                    {{scope.row.name}}
                  </div>
                </el-tooltip>
                <el-tooltip :content="scope.row.spec" placement="top" effect="light">
                  <div class="spec">
                    {{scope.row.spec}}
                  </div>
                </el-tooltip>
                <div class="prod-no">
                  {{scope.row.barCode}}
                </div>
              </div> -->
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
          v-if="type === 1"
          prop="stocks"
          :label="this.$i18n.t('stock.availableStock')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="stock_count"
          :label="type === 1 ? this.$i18n.t('stock.deliveryCount') : this.$i18n.t('stock.warehousingCount')"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip :disabled="scope.row.status !== -1" content="当前商品已失效" placement="top" effect="light">
              <div class="custom-rate">
                <el-input
                  :disabled="scope.row.status === -1"
                  v-model="scope.row.stockCount"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  oninput="if(value<0 || value >9999999)value=0"
                  type="number"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  size="small"
                  style="width: 80%;"
                  @change="inputStockCount(scope.$index, scope.row.stockCount)"
                  @blur="inputStockCount(scope.$index, scope.row.stockCount)"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('crud.menu')"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div class="default-btn text-btn" @click="deleteHandle(scope.$index)">{{ $t('text.delBtn') }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="stockBillLogItems.length"
      ></el-pagination>
    </div>
    <skuSelect
      v-if="addProdVisible"
      :chosen-check-items="productItems"
      :is-memory-old-data="true"
      :isCompose="0"
      @refreshSelectProds="selectProdItem"
      ref="ProdsSelect"
    ></skuSelect>
    <stockSkuUpload
      v-if="batchImportVisible"
      ref="skuUpload"
      :type="type"
      @refreshDataList="refreshDataList"
    ></stockSkuUpload>
  </div>
</template>

<script>
import skuSelect from './sku-select-components'
import stockSkuUpload from './stock-sku-upload'

export default {
  components: {
    skuSelect,
    stockSkuUpload
  },
  props: {
    type: {
      default: 0,
      type: Number // 1 出库 2 入库
    },
    stockBillLogId: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      stockBillLogItems: [], // 合并商品与单品结果列表
      productItems: [], // 已选择的商品项
      addProdVisible: false, // 添加商品弹窗是否可见
      batchImportVisible: false, // 批量导入商品弹窗是否可见
      verifyFlag: true, // 数据校验标记，true：正确，false：错误
      totalCount: 0, // 总出入库量
      failureCount: 0, // 失效的商品数量
      page: {
        currentPage: 1, // 初始页
        pageSize: 10 // 每页数据大小
      }
    }
  },
  // watch: {
  //   stockBillLogItems (val) {
  //     this.countChange()
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.stockBillLogId) {
        this.getSkuList()
      }
    },
    getSkuList () {
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLogItem/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            stockBillLogId: this.stockBillLogId
          }
        )
      }).then(({data}) => {
        this.stockBillLogItems = data
        this.productItems = []
        data.forEach(item => {
          if (item.status === -1) {
            ++this.failureCount
          }
          this.productItems.push(Object.assign({}, item))
          this.totalCount += parseInt(item.stockCount)
        })
      })
    },
    selectProdHandle () {
      this.addProdVisible = true
      this.$nextTick(() => {
        this.$refs.ProdsSelect.init()
      })
    },
    deleteFailureProd () {
      let stockBillLogArr = []
      let prodArr = []
      this.productItems.forEach(item => {
        if (item.status !== -1) {
          prodArr.push(item)
          stockBillLogArr.push(item)
        } else {
          this.totalCount -= parseInt(item.stockCount)
        }
      })
      this.productItems = prodArr
      this.stockBillLogItems = stockBillLogArr
      this.page.currentPage = 1
      this.failureCount = 0
    },
    selectProdItem (prodItem) {
      this.productItems = prodItem
      this.mergeProdAndRetail()
    },
    mergeProdAndRetail () {
      let res = []
      this.totalCount = 0
      this.productItems.forEach(item => {
        res.push({ ...item, type: 1 })
        this.totalCount += (parseInt(item.stockCount) || 0)
      })
      this.verifyFlag = res.length !== 0
      this.stockBillLogItems = res
    },
    uploadSku () {
      if (this.stockBillLogItems.length > 0) {
        return
      }
      this.batchImportVisible = true
      this.$nextTick(() => {
        this.$refs.skuUpload.init()
      })
    },
    refreshDataList (e) {
      this.page.currentPage = 1
      this.stockBillLogItems = e.stockBillLogItemList
      this.productItems = []
      this.stockBillLogItems.forEach(item => {
        this.productItems.push(item)
      })
    },
    /**
     * 校验数据，校验成功返回数据项，不成功返回null
     */
    verifyDataForm () {
      if (this.stockBillLogItems.length === 0) {
        this.verifyFlag = false
        return null
      } else {
        for (let i = 0; i < this.stockBillLogItems.length; i++) {
          if (!this.stockBillLogItems[i].stockCount || this.stockBillLogItems[i].stockCount === '') {
            this.$message({
              message: this.$i18n.t('stock.countNotEmptyOr0'),
              type: 'error',
              duration: 1500,
              onClose: () => {
              }
            })
            return null
          }
        }
        this.verifyFlag = true
        return this.stockBillLogItems
      }
    },
    inputStockCount (index, val) {
      let stockCount = parseInt(val)
      stockCount = isNaN(stockCount) ? 0 : stockCount
      if (stockCount > 9999999) {
        stockCount = 9999999
      }
      // 当前位置在商品数组
      if (this.type === 1) {
        if (stockCount > this.productItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stocks) {
          stockCount = this.productItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stocks
        }
      }
      this.totalCount -= parseInt(this.productItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stockCount) || 0
      this.productItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stockCount = stockCount
      this.totalCount += stockCount
      this.stockBillLogItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stockCount = stockCount
    },
    /**
     * 删除已选择的商品项
     * @param index 当前商品项在当前页的位置
     */
    deleteHandle (index) {
      // 页码-1 * 页面大小 + index = 当前删除项在合并数组中的位置
      this.stockBillLogItems.splice(((this.page.currentPage - 1) * this.page.pageSize) + index, 1)
      // 在商品数组中删除对应的数据
      this.totalCount -= (parseInt(this.productItems[((this.page.currentPage - 1) * this.page.pageSize) + index].stockCount) || 0)
      this.productItems.splice(((this.page.currentPage - 1) * this.page.pageSize) + index, 1)
      // 判断当前页码是否超过删除后的页码大小
      if (this.page.currentPage > ((this.stockBillLogItems.length - 1) / this.page.pageSize + 1)) {
        this.page.currentPage = --this.page.currentPage || 1
      }
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
    }
  }
}
</script>

<style lang="scss">

.prodItem-container {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }
  .count-desc-text {
    margin-top: 8px;
    margin-bottom: 8px;
    color: #333333;
    font-size: 14px;
  }
  .error-tips {
    color: #e43130;
    font-size: 14px;
    padding-bottom: 6px;
  }
  .disabled-btn {
    color: #C0C4CC;
    &:hover {
      cursor: not-allowed;
      color: #C0C4CC;
    }
  }
  .prodItem-table {
    .prod-info-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      .prod-image {
        margin-right: 20px;
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .prod-name {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .prod-name-txt {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .spec {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .prod-no {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
}
@media (max: width 1440px) {
  div >>> .el-card__body {
    padding-bottom: 40px;
  }
}
</style>
