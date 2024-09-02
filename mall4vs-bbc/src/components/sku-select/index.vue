<template>
  <el-dialog
    :title="this.$i18n.t('product.select')"
    :modal="true"
    top="100px"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline" size="small">
      <el-form-item :label="this.$i18n.t('product.prodName')">
        <el-input
          v-model.trim="prodName"
          :placeholder="this.$i18n.t('product.prodName')"
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
    <div class="chosenCountTip">
      <span>{{$t("dataAnaly.chosen")}}{{limitType === 1 ? chosenProdCount : chosenSkuCount}}{{limitType === 1 ? $t("combo.countProd") : $t("giveaway.countSku")}},</span>
      <span v-if="limit !== -1">{{$t("combo.maxChose")}}{{limit}}{{limitType === 1 ? $t("combo.countProd") : $t("giveaway.countSku")}}</span>
    </div>
    <div class="main">
      <el-table
        row-class-name="table-row"
        header-cell-class-name="table-header"
        :data="dataList"
      >
        <el-table-column
          :label="$t('product.prodName')"
          fixed="left"
          align="center"
          width="380"
        >
          <template slot-scope="scope">
            <div class="prod-item">
              <div class="select-dor">
                <el-radio v-if="isRadio && limit === 1" :label="scope.row.prodId" v-model="checkProdId" @change="radioCheckProd(scope.$index)" :disabled="checkProdIsLimit(scope.row.prodId) || checkMainProdIds(scope.row.prodId)" >&nbsp;</el-radio>
                <el-checkbox v-else v-model="scope.row.check" :indeterminate="scope.row.indeterminate" @change="checkProd(scope.$index)" 
                :disabled="checkProdIsLimit(scope.row.prodId) || checkMainProdIds(scope.row.prodId)"></el-checkbox>
              </div>
              <div class="prod-info">
                <div class="prod-image">
                  <img v-if="scope.row.pic" class="prod-img" :src="resourcesUrl + scope.row.pic" />
                  <img v-else src="../../assets/img/def.png" width="80" height="80" />
                </div>
                <div class="prod-name">
                  {{scope.row.prodName}}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('product.productSpecifi')"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <div
              class="items name"
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              <span class="sku-container">
                <div class="select-dor">
                  <el-checkbox v-model="sku.check" v-if="scope.row.skuList.length > 1"
                               @change="checkSku(scope.$index, skuIndex)"
                               :disabled="checkSkuIsLimit(scope.row.prodId, sku.skuId) || checkMainProdIds(scope.row.prodId)"></el-checkbox>
                </div>
                <div class="name">
                  {{sku.skuName || '-'}}
                </div>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('components.commodityPrice')"
          align="center"
          width="120"
          class="prodPrice"
        >
          <template slot-scope="scope">
            <div
              class="price-container"
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              {{sku.price}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('coupon.stock')"
          align="center"
        >
          <template slot-scope="scope">
            <div
              class="stocks-container"
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
            >
              {{sku.stocks}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageParam.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageParam.pageSize"
        :total="pageParam.totalPage"
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
      visible: false,
      dataForm: {
        prodName: ''
      },
      dataList: [],
      prodName: '',
      shopCategoryId: null,
      pageParam: {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      },
      dataListLoading: false,
      chosenProdCount: 0, // 已选择的商品数量，用于限制数量
      chosenSkuCount: 0, // 已选择的sku数量，用于限制数量
      chosenSkuMap: {}, // 已选择的结点对象map
      chosenProdMap: {}, // 已选择的商品结点对象map
      currentCheckProdMap: {}, // 当前选择的结点对象map
      banSkuMap: {}, // 禁止选择的sku对象map
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: this.$i18n.t('language') === 'English' ? 'categoryNameEn' : 'categoryName'
      },
      // 单选框
      checkProdId: 0,
      lastCheckProd: null // 上一次所选的商品
    }
  },
  props: {
    prodType: {
      default: null,
      type: Number // 商品类型
    },
    mainProdId: {
      default: () => [],
      type: Array // 主商品id
    },
    mold: {
      default: null,
      type: Number // 商品类别 1.实物商品 2. 虚拟商品
    },
    dataUrl: {
      default: '/prod/prod/prodSkuPage',
      type: String // 商品请求url
    },
    chosenCheckItems: {
      default: () => [],
      type: Array // 已选择的数据项
    },
    limit: {
      default: -1,
      type: Number // 可选择的spu数量限制, -1代表没有限制
    },
    limitType: {
      default: 1,
      type: Number // 限制数量类型 1：按商品 2：按sku
    },
    banSkuIdList: {
      default: () => [],
      type: Array // 禁止选择的skuId列表
    },
    itemDataType: {
      default: 1,
      type: Number // 初始化数据与返回的商品数据结构 1：以商品分组 2：以sku分组
    },
    status: {
      default: null,
      type: Number // 商品状态
    },
    skuStatus: {
      default: null,
      type: Number // sku状态
    },
    isActive: {
      default: null,
      type: Number // null: 普通商品 1：普通商品 + 活动商品
    },
    isRadio: {
      default: false, // 选取商品样式 true:单选框 false:复选框
      type: Boolean
    }
  },
  activated () {
    this.init()
  },
  methods: {
    // 获取数据列表
    init () {
      this.dataListLoading = true
      this.prodName = ''
      this.selectedCategory = []
      this.chosenProdCount = 0
      this.chosenSkuCount = 0
      this.shopCategoryId = null
      this.chosenSkuMap = {}
      this.chosenProdMap = {}
      this.currentCheckProdMap = {}
      this.initDefaultCheckedKeys()
      // this.initBanItems()
      this.getDataList()
      this.getCategoryList()
      this.visible = true
    },
    // 判断是否选为主商品
    checkMainProdIds (id) {
      return this.mainProdId.some(item => {
        return item === id
      })
    },
    // 初始化默认选择的商品项记录
    initDefaultCheckedKeys () {
      if (this.chosenCheckItems && this.chosenCheckItems.length > 0) {
        if (this.itemDataType === 1) {
          this.chosenCheckItems.forEach(prod => {
            prod = prod || {}
            this.chosenProdMap[prod.prodId] = prod
            this.currentCheckProdMap[prod.prodId] = prod
            ++this.chosenProdCount
            let choseSkuMap = {}
            prod.skuList.forEach(sku => {
              ++this.chosenSkuCount
              choseSkuMap[sku.skuId] = sku
            })
            this.chosenProdMap[prod.prodId].chosenSkuMap = choseSkuMap
            this.currentCheckProdMap[prod.prodId].currentCheckSkuMap = choseSkuMap
          })
        } else {
          this.chosenCheckItems.forEach(sku => {
            sku = sku || {}
            ++this.chosenSkuCount
            if (this.currentCheckProdMap[sku.prodId]) {
              this.currentCheckProdMap[sku.prodId].currentCheckSkuMap[sku.skuId] = sku
            } else {
              ++this.chosenProdCount
              let prodObj = {}
              prodObj.prodId = sku.prodId
              prodObj.prodName = sku.prodName
              prodObj.pic = sku.pic
              prodObj.currentCheckSkuMap = {}
              prodObj.currentCheckSkuMap[sku.skuId] = sku
              this.currentCheckProdMap[sku.prodId] = prodObj
            }
          })
        }
      }
    },
    // 处理商品选择
    handleProdCheck (prod) {
      // 商品选择事件
      if (this.limit !== -1 && this.chosenProdCount >= this.limit) {
          // 数量超过限制
        this.$set(prod, 'check', false)
        this.$message({
          message: '最多只能选择' + this.limit + '件商品',
          type: 'error',
          duration: 1500,
          onClose: () => {
          }
        })
        return
      }
        // 把该商品的可选择的sku置为选择状态并保存选择的商品信息
      if (!this.currentCheckProdMap[prod.prodId]) {
        ++this.chosenProdCount
        this.currentCheckProdMap[prod.prodId] = prod
      }
      let skuList = prod.skuList
      let currentCheckSkuMap = {}
      if (this.limit !== -1 && this.limitType === 2) {
        for (let i = 0; i < skuList.length && this.chosenSkuCount < this.limit; i++) {
          if (!skuList[i].check) {
            ++this.chosenSkuCount
            this.$set(skuList[i], 'check', true)
          }
          currentCheckSkuMap[skuList[i].skuId] = skuList[i]
        }
      } else {
        skuList.forEach(sku => {
          if (!sku.check) {
            ++this.chosenSkuCount
            this.$set(sku, 'check', true)
          }
          currentCheckSkuMap[sku.skuId] = sku
        })
      }
      prod.currentCheckSkuMap = currentCheckSkuMap
      this.$set(prod, 'indeterminate', false)
    },
    radioCheckProd (index) {
      let prod = this.dataList[index]
      prod.check = true
      // 对上次所选择的商品进行处理
      if (this.lastCheckProd) {
        // 商品取消选择事件，删除对应的商品结点
        delete this.currentCheckProdMap[this.lastCheckProd.prodId]
        --this.chosenProdCount
        this.lastCheckProd.skuList.forEach(sku => {
          if (sku.check) {
            --this.chosenSkuCount
            this.$set(sku, 'check', false)
          }
        })
        this.$set(this.lastCheckProd, 'check', false)
      }

      // 保存为上次操作
      this.lastCheckProd = prod

      // 处理商品选择
      this.handleProdCheck(prod)
    },
    // 选择或取消选择商品
    checkProd (index) {
      let prod = this.dataList[index]
      if (prod.check) {
        // 商品选择事件
        this.handleProdCheck(prod)
      } else {
        // 商品取消选择事件，删除对应的商品结点
        delete this.currentCheckProdMap[prod.prodId]
        --this.chosenProdCount
        prod.skuList.forEach(sku => {
          if (sku.check) {
            --this.chosenSkuCount
            this.$set(sku, 'check', false)
          }
        })
        this.$set(prod, 'check', false)
        this.$set(prod, 'indeterminate', false)
      }
    },
    // 检查商品是否已达到限制
    checkProdIsLimit (prodId) {
      if (this.limit === -1) {
        return false
      }
      let checkCount = this.limitType === 1 ? this.chosenProdCount : this.chosenSkuCount
      if (checkCount >= this.limit && !this.currentCheckProdMap[prodId]) {
        return true
      } else {
        return false
      }
    },
    // 检查sku是否已达到限制
    checkSkuIsLimit (prodId, skuId) {
      if (this.limit === -1) {
        return false
      }
      let checkCount = this.limitType === 1 ? this.chosenProdCount : this.chosenSkuCount
      if (checkCount >= this.limit) {
        if (this.limitType === 1) {
          return this.currentCheckProdMap[prodId] === undefined || this.currentCheckProdMap[prodId] === null
        }
        if (this.limitType === 2) {
          if (this.currentCheckProdMap[prodId] === undefined || this.currentCheckProdMap[prodId] === null) {
            return true
          }
          if (this.currentCheckProdMap[prodId].currentCheckSkuMap[skuId] === undefined || this.currentCheckProdMap[prodId].currentCheckSkuMap[skuId] === null) {
            return true
          }
          return false
        }
      }
      return false
    },
    // 选择或取消选择sku
    checkSku (prodIndex, skuIndex) {
      let prod = this.dataList[prodIndex]
      let sku = prod.skuList[skuIndex]
      if (sku.check) {
        // sku选择事件
        if (this.checkSkuIsLimit(prod.prodId, sku.skuId)) {
          // 数量超过限制
          this.$set(sku, 'check', false)
          this.$message({
            message: '最多只能选择' + this.limit + '件商品',
            type: 'error',
            duration: 1500,
            onClose: () => {
            }
          })
          return
        }
        if (this.currentCheckProdMap[prod.prodId]) {
          // 该商品存在已选择的sku
          this.currentCheckProdMap[prod.prodId].currentCheckSkuMap[sku.skuId] = sku
        } else {
          // 该商品没有已选择的sku
          this.currentCheckProdMap[prod.prodId] = prod
          ++this.chosenProdCount
          let currentCheckSkuMap = {}
          currentCheckSkuMap[sku.skuId] = sku
          this.currentCheckProdMap[prod.prodId].currentCheckSkuMap = currentCheckSkuMap
        }
        ++this.chosenSkuCount
        let choseCount = Object.keys(this.currentCheckProdMap[prod.prodId].currentCheckSkuMap).length
        this.$set(prod, 'check', true)
        this.$set(prod, 'indeterminate', !(choseCount === prod.skuList.length))
        // 当选择商品为单选按钮时
        if (this.isRadio) {
          this.checkProdId = prod.prodId
          this.lastCheckProd = prod
        }
      } else {
        // sku取消选择
        --this.chosenSkuCount
        this.$set(sku, 'check', false)
        let choseCount = Object.keys(this.currentCheckProdMap[prod.prodId].currentCheckSkuMap).length
        if (choseCount === 1) {
          --this.chosenProdCount
          this.$set(prod, 'check', false)
          this.$set(prod, 'indeterminate', false)
          // 当选择商品为单选按钮时
          if (this.isRadio) {
            this.checkProdId = 0
            this.lastCheckProd = null
          }
          delete this.currentCheckProdMap[prod.prodId]
        } else {
          this.$set(prod, 'indeterminate', true)
          delete this.currentCheckProdMap[prod.prodId].currentCheckSkuMap[sku.skuId]
        }
      }
    },
    // 获取店铺分类列表
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
    // 分页获取商品数据
    getDataList () {
      console.log('mold', this.mold)
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageParam.pageIndex,
              size: this.pageParam.pageSize,
              prodName: this.prodName ? this.prodName : null,
              prodType: this.prodType,
              shopCategoryId: this.shopCategoryId,
              mold: this.mold ? this.mold - 1 : null,
              status: this.status,
              skuStatus: this.skuStatus,
              // 选择主商品时需要过滤掉活动商品
              isActive: this.isActive === 1 ? 1 : null
            }
          )
        )
      }).then(({ data }) => {
        this.pageParam.totalPage = data.total
        this.setProdCheckStatus(data.records)
        this.dataList = data.records
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 根据已选择的商品项设置商品选择状态
    setProdCheckStatus (prodList) {
      prodList.forEach(prod => {
        let skuList = prod.skuList
        if (!this.currentCheckProdMap[prod.prodId]) {
          skuList.forEach(sku => this.$set(sku, 'check', false))
          this.$set(prod, 'check', false)
          this.$set(prod, 'indeterminate', false)
        } else {
          // 当前商品已选择的sku数量
          let selectCount = 0
          let checkSkuMap = this.currentCheckProdMap[prod.prodId].currentCheckSkuMap || {}
          skuList.forEach(sku => {
            if (checkSkuMap[sku.skuId]) {
              ++selectCount
              this.$set(sku, 'check', true)
            } else {
              this.$set(sku, 'check', false)
            }
          })
          this.$set(prod, 'check', selectCount > 0)
          this.$set(prod, 'indeterminate', selectCount > 0 && selectCount < skuList.length)
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageParam.pageSize = val
      this.pageParam.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageParam.pageIndex = val
      this.getDataList()
    },
    // 获取分类id
    handleChange (val) {
      this.shopCategoryId = val[val.length - 1]
    },
    // 根据条件搜索商品
    searchProd () {
      this.pageParam.pageIndex = 1
      this.getDataList()
    },
    // 清空搜索条件
    clean () {
      this.prodName = ''
      this.shopCategoryId = null
      this.selectedCategory = idList(this.categoryList, this.shopCategoryId, 'categoryId', 'children').reverse()
    },
    // 确定事件
    submitProds () {
      let selectList = []
      if (this.itemDataType === 1) {
        for (let prodId in this.currentCheckProdMap) {
          let prodObj = this.currentCheckProdMap[prodId]
          let choseProdMap = this.chosenProdMap[prodId] || {}
          let skuList = []
          for (let skuId in prodObj.currentCheckSkuMap) {
            let skuObj = (choseProdMap.chosenSkuMap !== undefined && choseProdMap.chosenSkuMap[skuId]) ? choseProdMap.chosenSkuMap[skuId] : prodObj.currentCheckSkuMap[skuId]
            skuObj.prodId = prodObj.prodId
            skuObj.prodName = prodObj.prodName
            skuObj.pic = prodObj.pic
            skuList.push(skuObj)
          }
          let prod = this.chosenProdMap[prodId] ? this.chosenProdMap[prodId] : this.currentCheckProdMap[prodId]
          prod.skuList = skuList
          selectList.push(prod)
        }
      } else {
        for (let prodId in this.currentCheckProdMap) {
          let prodObj = this.currentCheckProdMap[prodId]
          let choseProdMap = this.chosenProdMap[prodId] || {}
          for (let skuId in prodObj.currentCheckSkuMap) {
            let skuObj = (choseProdMap.chosenSkuMap !== undefined && choseProdMap.chosenSkuMap[skuId]) ? choseProdMap.chosenSkuMap[skuId] : prodObj.currentCheckSkuMap[skuId]
            skuObj.prodId = prodObj.prodId
            skuObj.prodName = prodObj.prodName
            skuObj.pic = prodObj.pic
            selectList.push(skuObj)
          }
        }
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
.main {
  .prod-item {
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
    .select-dor {
      width: 10px;
      padding: 2px;
    }
    .prod-info {
      display: flex;
      align-items: center;
    }
    .prod-image {
      width: 100px;
      height: 100px;
      padding: 10px;
      .prod-img {
        width: 80px !important;
        height: 80px !important;
      }
    }
    .prod-name {
      // width: 240px;
      flex:1;
      font-size: 14px;
      color: #333333;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .sku-container {
    width: 120px;
    display: flex;
    flex-direction: row;
    min-height: 30px;
    .select-dor {
      width: 10px;
      padding: 2px;
      margin-right: 10px;
    }
    .name {
      width: 100px;
      font-size: 14px;
      color: #333333;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
    }
  }
  .price-container {
    min-height: 30px;
    align-content: center;
  }
  .stocks-container {
    min-height: 30px;
    align-content: center;
  }
}
</style>
