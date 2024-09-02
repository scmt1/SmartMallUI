<template>
  <el-dialog
    :title="this.$i18n.t('product.relatedItems')"
    :visible.sync="visible"
    :before-close="closeDialog"
    width="950px"
  >
    <div class="default-btn primary-btn" @click="selectSingleProds()">{{
      $t("product.chooSingPro")
    }}</div>
    <div class="main-container">
      <div class="table-con">
        <el-table
          :data="retailProdTable"
          :header-cell-style="{height: '42px', background: '#F6F7FA', color:'#666666','font-weight': '500'}"
          :cell-style="{height: '64px', padding: '8px 0', color:'#000'}"
          style="width: 100%"
          height="420">
          <el-table-column
            prop="name"
            :label="this.$i18n.t('product.itemName')"
            width="180"
          >
           <template slot-scope="scope">
              <div class="table-cell-text">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="spec"
            :label="this.$i18n.t('product.singleProdSpe')"
            width="180"
          >
            <template slot-scope="scope">
              <div class="table-cell-text">
                {{scope.row.spec}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="retailNums"
            :label="this.$i18n.t('product.quantityInCom')"
          >
            <template slot-scope="scope">
              <label>
                <input
                  v-model.number="scope.row.retailNums"
                  type="number"
                  :max="1000000"
                  :min="1"
                  :step="1"
                  class="tag-input-width"
                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  @keyup="
                     scope.row.retailNums = String(scope.row.retailNums).match(/[^0-9]/) ? 0 : scope.row.retailNums
               "
                  @blur="countTotal(scope.row, scope.$index)"
                />
              </label>
            </template>
          </el-table-column>
          <el-table-column
            prop="costPrice"
            :label="this.$i18n.t('product.singleProd')"
          ></el-table-column>
          <el-table-column
            prop="total"
            :label="this.$i18n.t('product.total')"
          ></el-table-column>
          <el-table-column
            prop="stocks"
            :label="this.$i18n.t('product.singleProdInve')"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <el-dialog width="50%" title="选择单品" :visible.sync="innerVisible" append-to-body></el-dialog> -->
    <div slot="footer" class="dialog-footer">
      <div class="default-btn" @click="closeDialog">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" @click="confirm">{{ $t("crud.filter.submitBtn") }}</div>
    </div>
    <!-- 单品选择弹窗  测试完之后添加这个链接  dataUrl='/group/prod/getNotGroupProdPage'-->
    <single-prods-select
      v-if="sprodVisible"
      ref="singleProdsSelect"
      @refreshSelectSingleProds="getRetailTable"
    ></single-prods-select>
  </el-dialog>
</template>

<script>
import SingleProdsSelect from '@/components/single-prods-select'
import Big from 'big.js'

export default {
  components: {
    SingleProdsSelect
  },
  data () {
    return {
      visible: false,
      sprodVisible: false,
      checkPass: false,
      retailProdTable: [],
      resProdList: [],
      rowOriData: null,
      oriIndex: null
    }
  },
  methods: {
    init (skuSingleProds, index) {
      this.retailProdTable = []
      this.oriIndex = index
      if (skuSingleProds) {
        this.retailProdTable = JSON.parse(JSON.stringify(skuSingleProds))
      }
      this.visible = true
    },
    getRetailTable (prods) {
      if (prods) {
        prods.forEach(item => {
          let total = new Big(item.costPrice)
          item.total = total.times(item.retailNums).toFixed(2)
        })
        this.retailProdTable = prods
      }
    },
    selectSingleProds () {
      this.sprodVisible = true
      this.$nextTick(() => {
        this.$refs.singleProdsSelect.init(this.retailProdTable)
      })
    },
    countTotal (rowData, index) {
      let total = new Big(rowData.costPrice)
      if (!/^[0-9]\d*$/.test(rowData.retailNums) || parseInt(rowData.retailNums) <= 0) {
        this.$message.error(this.$i18n.t('retailProd.tipError'))
        this.$set(this.retailProdTable[index], 'retailNums', 1)
        return
        // return new Error(this.$i18n.t('formData.pleaseThan0'))
      }
      rowData.retailNums = parseInt(rowData.retailNums)
      rowData.total = total.times(rowData.retailNums).toFixed(2)
      // let index = this.retailProdTable.findIndex((item) => item.retailProdId === rowData.retailProdId)
      // this.$set(this.retailProdTable, index, this.retailProdTable[index])
    },
    // 关闭弹窗
    closeDialog () {
      this.visible = false
      this.retailProdTable = []
    },
    confirm () {
      if (this.retailProdTable === null || this.retailProdTable === undefined || this.retailProdTable.length <= 0) {
        return this.$message.error(this.$i18n.t('retailProd.tip2Error'))
      }
      for (let i = 0; i < this.retailProdTable.length; i++) {
        if (!/^[0-9]\d*$/.test(this.retailProdTable[i].retailNums) || parseInt(this.retailProdTable[i].retailNums) === 0) {
          return this.$message.error(this.$i18n.t('retailProd.tipError'))
        }
      }
      this.$emit('refreshSelectSingleProds', this.retailProdTable, this.oriIndex)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  .table-con {
    padding-bottom: 0;
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
</style>
