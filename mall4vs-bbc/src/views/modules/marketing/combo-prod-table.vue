<template>
  <!-- 商品信息 -->
  <div class="prodItem-container">
    <div class="default-btn" :class="{'disabled-btn': productItems.length === limit || pageType === 2}" @click="selectProdHandle()">{{ this.$i18n.t('shop.addProd') }}</div>
    <div class="count-desc-text">{{ type === 1 ? this.$i18n.t('combo.mainProdTips') : this.$i18n.t('combo.matchingProdTips') }}</div>
    <div v-if="!verifyFlag" class="error-tips">{{ type === 1 ? this.$i18n.t('combo.mainProdErrorTips') : this.$i18n.t('combo.matchingProdErrorTips') }}</div>
    <div v-if="productItems && productItems.length > 0" class="prodItem-table">
      <el-table
        :data="productItems"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        :style="tableWidth"
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
              <div class="prod-image">
                <img v-if="scope.row.pic" :src="scope.row.pic && (scope.row.pic).indexOf('http') === -1 ? resourcesUrl + scope.row.pic : scope.row.pic ">
                <img v-else src="">
              </div>
              <div class="prod-name">
                <div class="prod-name-txt">
                  {{scope.row.prodName}}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('combo.participateSpec')"
          align="center"
          prop="skuName"
          width="200px"
        >
          <template slot-scope="scope">
            <div
              class="items name"
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              <span class="sku-name">
                {{sku.skuName || '-'}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.price')"
          align="center"
          prop="skuName"
          width="200px"
        >
          <template slot-scope="scope">
            <div
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              <span class="sku-name">
                {{sku.price}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchingPrice"
          :label="$t('combo.matchingPrice')"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <div
              class="items name"
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              <div class="matching-price">
                <input
                  :disabled="pageType === 2"
                  v-model.number="sku.matchingPrice"
                  type="number"
                  :precision="2"
                  :max="sku.price"
                  :step="0.01"
                  size="small"
                  style="width: 80%;"
                  class="tag-input-width"
                  @blur="inputMatchingPrice(sku, sku.matchingPrice, scope.$index, skuIndex)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchingPrice"
          :label="$t('combo.leastNum')"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <div class="custom-rate">
              <input
                :disabled="pageType === 2"
                v-model="scope.row.leastNum"
                type="number"
                :precision="0"
                :max="99999999"
                :step="1"
                size="small"
                style="width: 80%;"
                class="tag-input-width"
                @keyup="
                    scope.row.leastNum = String(scope.row.leastNum).match(/[^0-9]/) ? 1 : scope.row.leastNum
                  "
                @blur="inputValue(scope.row, scope.row.leastNum, 'leastNum', 1, 99999999)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="required"
          v-if="type === 2"
          :label="$t('combo.isRequired')"
          align="center"
          width="140px"
        >
          <template slot-scope="scope">
            <el-checkbox :disabled="pageType === 2" v-model="scope.row.required" @change="checkRequired(scope.row, scope.$index)" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="pageType === 1"
          align="center"
          :label="$t('crud.menu')"
          fixed="right"
          width="140px"
        >
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div class="default-btn text-btn" @click="editSpecHandle(scope.$index, scope.row)">{{ $t('combo.editSpec') }}</div>
              <div class="default-btn text-btn" @click="deleteHandle(scope.$index,scope.row.prodId)">{{ $t('text.delBtn') }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <skuSelect
      v-if="addProdVisible"
      :isRadio="true"
      :chosen-check-items="productItems"
      :limit="limit"
      @refreshSelectProds="selectProdItem"
      :status="1"
      :skuStatus="1"
      :isActive="isActive"
      :mold="mold"
      :mainProdId='mainProdId'
      ref="ProdsSelect"
    ></skuSelect>
    <prodSkuSelect ref="prodSkuSelect" @refreshSelectSkus="selectSkuItem" v-if="prodSkuSelectDialogVisible"></prodSkuSelect>
  </div>
</template>

<script>
import skuSelect from '@/components/sku-select'
import prodSkuSelect from './prod-sku-select'

export default {
  components: {
    skuSelect,
    prodSkuSelect
  },
  props: {
    type: {
      default: 1,
      type: Number // 1 主商品 2 搭配商品
    },
    mainProdId: {
      default: [],
      type: Array // 主商品Id
    },
    comboId: {
      default: 0,
      type: Number // 套餐id
    },
    limit: {
      default: -1,
      type: Number // 限制数量 -1代表没有限制
    },
    pageType: {
      default: 1,
      type: Number // 1：新增/编辑 2：查看
    },
    mold: {
      default: null,
      type: Number // 商品类别 1.实物商品 2. 虚拟商品
    },
    isActive: {
      default: null,
      type: Number // null: 普通商品 1：普通商品 + 活动商品
    }
  },
  data () {
    return {
      addd: true,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      tableWidth: {
        width: '1180px'
      },
      productItems: [], // 已选择的商品项
      selectSkuProdIndex: null,
      addProdVisible: false, // 添加商品弹窗是否可见
      prodSkuSelectDialogVisible: false, // 商品规格选择弹窗是否可见
      verifyFlag: true, // 数据校验标记，true：正确，false：错误
      totalCount: 0, // 总出入库量
      failureCount: 0, // 失效的商品数量
      rowspan: {}// 表格合并数据

    }
  },
  watch: {
  },
  mounted () {
    this.init()
  },
  methods: {
    init (productItems) {
      if (this.type === 1) {
        this.tableWidth.width = this.pageType === 1 ? '1180px' : '1040px'
      } else {
        this.tableWidth.width = this.pageType === 1 ? '1320px' : '1180px'
      }
      if (productItems) {
        this.computeRowspan(productItems)
        this.productItems = productItems
      } else {
        this.productItems = []
      }
    },
    getSkuList () {
    },
    selectProdHandle () {
      if (this.productItems.length >= this.limit || this.pageType === 2) {
        return
      }
      this.addProdVisible = true
      this.$nextTick(() => {
        this.$refs.ProdsSelect.init(1)
      })
    },
    // 选择商品项回调
    selectProdItem (prodItems) {
      console.log('prodItems', prodItems)
      this.productItems = []
      let requiredCount = 0
      prodItems.forEach(prod => {
        this.$set(prod, 'required', 0)
        prod.skuList.forEach(sku => {
          sku.matchingPrice = sku.matchingPrice ? sku.matchingPrice : sku.price
        })
        prod.required = prod.required === 1 ? 1 : 0
        requiredCount += prod.required ? 1 : 0
        prod.leastNum = prod.leastNum ? prod.leastNum : 1
      })
      this.computeRowspan(prodItems)
      this.$emit('refreshSelectProds', prodItems)
      // 重置verifyFlag
      if (this.type === 1) {
        if (prodItems.length === 1) {
          this.verifyFlag = true
        }
      } else {
        if (prodItems.length > 0 && prodItems.length < 5 && requiredCount > 0) {
          this.verifyFlag = true
        }
      }
      this.productItems = prodItems
    },
    // 选择sku项回调
    selectSkuItem (skuList) {
      if (!skuList || skuList.length === 0) {
        const prodId = this.productItems[this.selectSkuProdIndex].prodId
        this.productItems.splice(this.selectSkuProdIndex, 1)
        this.$emit('refreshDeleteHandle', prodId)
      } else {
        skuList.forEach(sku => {
          sku.matchingPrice = sku.matchingPrice ? sku.matchingPrice : sku.price
        })
        this.productItems[this.selectSkuProdIndex].skuList = skuList
      }
      this.computeRowspan(this.productItems)
    },
    computeRowspan (prodItems) {
      this.rowspan = {}
      let prodId = -1
      let firstIndex = -1
      for (let i = 0; i < prodItems.length; i++) {
        if (prodItems[i].prodId === prodId) {
          if (this.rowspan[firstIndex]) {
            this.rowspan[firstIndex] += 1
          } else {
            this.rowspan[firstIndex] = 2
          }
        } else {
          firstIndex = i
          prodId = prodItems[i].prodId
          this.rowspan[firstIndex] = 1
        }
      }
    },
    tableSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.rowspan[rowIndex]) {
          return {
            rowspan: this.rowspan[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    controlSwitch (index, row) {
      this.$set(this.productItems, index, row)
    },
    // 校验数据，校验成功返回数据项，不成功返回null
    verifyDataForm () {
      if (this.type === 1) {
        if (this.productItems.length === 1) {
          this.verifyFlag = true
          return this.productItems
        } else {
          this.verifyFlag = false
          return null
        }
      }
      if (this.type === 2) {
        if (this.productItems.length <= 4) {
          this.verifyFlag = true
          return this.productItems
        } else {
          this.verifyFlag = false
          return null
        }
      }
    },
    // 输入值校验
    inputMatchingPrice (row, max, index1, index2) {
      var con = JSON.parse(JSON.stringify(this.productItems[index1]))
      var matchingPrice = String(row.matchingPrice).match(/\d+(\.\d{0,2})?/)
                    ? Number.parseFloat(String(row.matchingPrice).match(/\d+(\.\d{0,2})?/)[0])
                    : null
      if (row !== undefined && row !== null) {
        if (matchingPrice > max) {
          this.$set(row, 'matchingPrice', max)
          con.skuList[index2].matchingPrice = max
        }
        if (matchingPrice < 0.01 || !matchingPrice) {
          this.$set(row, 'matchingPrice', 0.01)
          con.skuList[index2].matchingPrice = 0.01
        }
      } else {
        this.$set(row, 'matchingPrice', 0.01)
        con.skuList[index2].matchingPrice = 0.01
      }
      this.$set(this.productItems, index1, con)
    },
    // 输入值校验
    inputValue (row, val, dataFields, min, max) {
      console.log('inputValue', row, val, dataFields, min, max)
      console.log(row.matchingPrice)
      if (row !== undefined && row !== null) {
        if (val > max) {
          this.$set(row, dataFields, max)
        }
        if (val < min || !val) {
          this.$set(row, dataFields, min)
        }
      } else {
        this.$set(row, dataFields, min)
      }
      console.log(row.matchingPrice)
    },
    // 编辑商品规格
    editSpecHandle (index, row) {
      this.selectSkuProdIndex = index
      this.prodSkuSelectDialogVisible = true
      this.$nextTick(() => {
        this.$refs.prodSkuSelect.init(row.prodId, row.skuList)
      })
    },
    checkRequired (row, index) {
      this.$set(this.productItems, index, row)
    },
    // 删除已选择的商品项
    deleteHandle (index, id) {
      this.productItems.splice(index, 1)
      this.$emit('refreshDeleteHandle', id)
      this.computeRowspan(this.productItems)
    }
  }
}
</script>

<style lang="scss" scoped>
.mainProd {
  width: 1180px;
}
.matchingProd {
  width: 1320px;
}
.prodItem-container {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }
  .count-desc-text {
    margin-bottom: 4px;
    color: #888888;
    font-size: 14px;
  }
  .error-tips {
    color: #f56c6c;
    font-size: 12px;
    padding-bottom: 4px;
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
        }
      }
      .prod-name {
        flex: 1;
        height: 80px;
        display: flex;
        flex-direction: column;
        text-align: start;
        justify-content: center;
        .prod-name-txt {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
    .sku-name {
      font-size: 14px;
      color: #333333;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      width: 170px;
    }
    .matching-price,.custom-rate {
      height: 45px;
      line-height: 45px;
    }
    // 表格输入框
    .tag-input-width {
      width: 100%;
      padding-left: 5px;
      padding-right: 0;
      border: 1px solid #DCDCDC;
      border-radius: 2px;
      height: 32px;
      line-height: 32px;
      box-sizing: border-box;
      &:focus {
        outline: 0;
      }
    }
  }
}
.el-table__fixed::before, .el-table__fixed-right::before{
  height:0 !important
}
</style>
