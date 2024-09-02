<template>
  <!-- 商品信息 -->
  <div class="prodItem-container">
    <div class="default-btn" :class="{'disabled-btn': productItems.length === limit || pageType === 2 }" @click="selectProdHandle()">{{ this.$i18n.t('giveaway.addInKindProd') }}</div>
    <div class="count-desc-text">{{ this.$i18n.t('giveaway.giveawayLimitTips') }}</div>
    <div v-if="!verifyFlag" class="error-tips">{{ this.$i18n.t('giveaway.giveawayProdErrorTips') }}</div>
    <div v-if="productItems && productItems.length > 0" class="prodItem-table">
      <el-table
        :data="productItems"
        header-cell-class-name="table-header"
        :span-method="tableSpanMethod"
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
                <prod-pic
                  :pic="scope.row.pic"
                ></prod-pic>
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
            {{scope.row.skuName || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.price')"
          align="center"
          prop="price"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          prop="refundPrice"
          :label="$t('giveaway.refundPrice')"
          align="center"
          width="160px"
        >
          <template slot="header" slot-scope="scope">
            {{$t('giveaway.refundPrice')}}
            <el-tooltip class="item" effect="dark" :content="$t('giveaway.refundPriceTips')" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div class="custom-rate">
              <input
                :disabled="pageType === 2"
                v-model.number="scope.row.refundPrice"
                type="number"
                :precision="2"
                :max="scope.row.price"
                :min="0"
                :step="0.01"
                class="tag-input-width"
                @keyup="
                    scope.row.refundPrice = String(scope.row.refundPrice).match(/\d+(\.\d{0,2})?/) ?
                    Number.parseFloat(String(scope.row.refundPrice).match(/\d+(\.\d{0,2})?/)[0]) :
                    ''
                  "
                @blur="inputValue(scope.$index, scope.row.refundPrice, 'refundPrice', 0, scope.row.price)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="giveawayNum"
          :label="$t('giveaway.giveawayNum')"
          align="center"
          width="160px"
        >
          <template slot-scope="scope">
            <div class="custom-rate">
              <input
                :disabled="pageType === 2"
                v-model="scope.row.giveawayNum"
                type="number"
                :precision="0"
                :min="1"
                :max="99999999"
                :step="1"
                size="small"
                style="width: 80%;"
                class="tag-input-width"
                @keyup="
                    scope.row.giveawayNum = String(scope.row.giveawayNum).match(/[^0-9]/) ? 1 : scope.row.giveawayNum
                  "
                @blur="inputValue(scope.$index, scope.row.giveawayNum, 'giveawayNum', 1, 99999999)"
              />
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="required"-->
<!--          v-if="type === 2"-->
<!--          :label="$t('combo.isRequired')"-->
<!--          align="center"-->
<!--          width="140px"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <el-switch-->
<!--              v-model="scope.row.required"-->
<!--              :active-value="1"-->
<!--              :inactive-value="0"-->
<!--              @change="controlSwitch(scope.$index, scope.row)"-->
<!--            >-->
<!--            </el-switch>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          v-if="pageType === 1"
          align="center"
          :label="$t('crud.menu')"
          fixed="right"
          width="140px"
        >
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div class="default-btn text-btn" @click="deleteHandle(scope.$index)">{{ $t('text.delBtn') }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <skuSelect
      v-if="addProdVisible"
      :chosen-check-items="productItems"
      :limit="15"
      :limitType="2"
      :itemDataType="2"
      :status="1"
      :isActive="1"
      :skuStatus="1"
      :mold="1"
      @refreshSelectProds="selectProdItem"
      ref="ProdsSelect"
    ></skuSelect>
  </div>
</template>

<script>
import skuSelect from '@/components/sku-select'
import ProdPic from '@/components/prod-pic'
export default {
  components: {
    skuSelect,
    ProdPic
  },
  props: {
    type: {
      default: 1,
      type: Number // 1 主商品 2 搭配商品
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
    }
  },
  data () {
    return {
      addd: true,
      tableWidth: {
        width: '1180px'
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      productItems: [], // 已选择的商品项
      addProdVisible: false, // 添加商品弹窗是否可见
      verifyFlag: true, // 数据校验标记，true：正确，false：错误
      totalCount: 0, // 总出入库量
      failureCount: 0, // 失效的商品数量
      rowspan: {} // 表格合并数据
    }
  },
  watch: {
  },
  mounted () {
    this.init()
  },
  methods: {
    init (productItems) {
      this.tableWidth.width = this.pageType === 1 ? '1180px' : '1040px'
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
        this.$refs.ProdsSelect.init()
      })
    },
    // 选择商品项回调
    selectProdItem (prodItems) {
      this.productItems = []
      let requiredCount = 0
      prodItems.forEach(item => {
        item.refundPrice = item.refundPrice ? item.refundPrice : 0
        item.required = item.required === 0 ? 0 : 1
        requiredCount += item.required ? 1 : 0
        item.giveawayNum = item.giveawayNum ? item.giveawayNum : 1
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
      if (this.productItems.length > 0 && this.productItems.length <= 15) {
        return this.productItems
      } else {
        this.verifyFlag = false
        return null
      }
    },
    // 输入值校验
    inputValue (index, val, dataFields, min, max) {
      let info = this.productItems[index]
      if (index !== undefined && index !== null) {
        if (val > max) {
          info[dataFields] = max
          this.$set(this.productItems, index, {...info})
        }
        if (val < min || !val) {
          info[dataFields] = min
          this.$set(this.productItems, index, {...info})
        }
      }

      if (info[dataFields] === '' && dataFields === 'refundPrice') {
        info[dataFields] = 0
        this.$set(this.productItems, index, {...info})
      }
    },
    // 删除已选择的商品项
    deleteHandle (index) {
      this.productItems.splice(index, 1)
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
  width: 1180px;
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
          object-fit: contain;
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
