<template>
  <div class="mod-prod-sku-table">
    <el-form-item :label="this.$i18n.t('product.priceAndInventory')" :label-width="this.$i18n.t('language') === 'English'?'150px':'130px'">

      <div class="sku-table-con">
        <!--sku列表-->
        <div class="table-con">
          <el-table
            :data="lists"
            header-cell-class-name="table-header"
            :span-method="tableSpanMethod"
            row-class-name="table-row"
            border
          >
            <el-table-column
              v-for="(leftTitle, index) in tableLeftTitles"
              :key="index"
              :label="$t('language') === 'English' ? leftTitle.tagNameEn : leftTitle.tagName"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.propertiesEn && scope.row.properties">
                  {{$t('language') === 'English' ? scope.row.propertiesEn.split(';')[index].split(':')[1] : scope.row.properties.split(';')[index].split(':')[1]}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              v-if="tableLeftTitles.length"
              prop="pic"
              :label="this.$i18n.t('product.skuPictures')"
              width="180"
            >
              <template slot-scope="scope">
                <img-upload v-model="scope.row.pic"></img-upload>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="prodNameCn"
              :label="this.$i18n.t('product.prodNameCn')"
              width="250"
              v-if="tableLeftTitles.length"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.prodNameCn" type="textarea" :disabled="!scope.row.status"></el-input>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="prodNameEn"
              :label="this.$i18n.t('product.prodNameEn')"
              width="250"
              v-if="tableLeftTitles.length"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.prodNameEn" type="textarea" :disabled="!scope.row.status"></el-input>
              </template>
            </el-table-column> -->
            <!-- 售价 -->
            <el-table-column
              prop="price"
              :label="this.$i18n.t('product.sellingPrice')"
            >
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.price"
                  type="number"
                  :precision="2"
                  :max="100000000"
                  :min="0.01"
                  :step="0.01"
                  :disabled="!scope.row.status || scope.row.isParticipate === 1"
                  class="tag-input-width"
                  @blur="handleInputValue(scope.row.price, scope.$index, 'price', 0.01, 100000000)"
                />
                <!-- <el-input-number
                  size="small"
                  v-model="scope.row.price"
                  controls-position="right"
                  :precision="2"
                  :max="1000000000"
                  :min="0.01"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                ></el-input-number> -->
              </template>
            </el-table-column>
            <!-- 库存 -->
            <el-table-column prop="stocks" :label="this.$i18n.t('coupon.stock')">
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.stocks"
                  type="number"
                  :max="9999999"
                  :min="0"
                  :step="1"
                  :disabled="!scope.row.status || isCompose == 1"
                  class="tag-input-width"
                  @keyup="
                    scope.row.stocks = String(scope.row.stocks).match(/[^0-9]/) ? '' : scope.row.stocks
                  "
                  @blur="handleInputValue(scope.row.stocks, scope.$index, 'stocks', 0, 9999999)"
                />
                <!-- <el-input-number
                  size="small"
                  v-model="scope.row.stocks"
                  controls-position="right"
                  :precision="0"
                  :max="9999999"
                  :min="0"
                  :disabled="!scope.row.status || isCompose == 1"
                  class="tag-input-width"
                ></el-input-number> -->
              </template>
            </el-table-column>
            <!-- 市场价 -->
            <el-table-column prop="oriPrice" :label="this.$i18n.t('product.marketPrice')">
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.oriPrice"
                  type="number"
                  :precision="2"
                  :max="100000000"
                  :min="0"
                  :step="0.01"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                  @blur="handleInputValue(scope.row.oriPrice, scope.$index, 'oriPrice', 0, 100000000)"
                />
                <!-- <el-input-number
                  size="small"
                  v-model="scope.row.oriPrice"
                  controls-position="right"
                  :precision="2"
                  :max="1000000000"
                  :min="0.01"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                ></el-input-number> -->
              </template>
            </el-table-column>
            <!-- 体积 -->
            <el-table-column v-if="mold===0" prop="volume" :label="this.$i18n.t('product.commodityVolume')">
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.volume"
                  type="number"
                  :max="100000000"
                  :min="0"
                  :step="0.01"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                  @blur="handleInputValue(scope.row.volume, scope.$index, 'volume', 0, 100000000)"
                />
                <!-- <el-input-number
                  size="small"
                  v-model="scope.row.volume"
                  controls-position="right"
                  :precision="2"
                  :max="1000000000"
                  :min="0"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                ></el-input-number> -->
              </template>
            </el-table-column>
            <!-- 重量 -->
            <el-table-column v-if="mold===0" prop="weight" :label="this.$i18n.t('product.commodityWeight')">
              <template slot-scope="scope">
                <input
                  v-model.number="scope.row.weight"
                  type="number"
                  :max="100000000"
                  :min="0"
                  :step="0.01"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                  @blur="handleInputValue(scope.row.weight, scope.$index, 'weight', 0, 100000000)"
                />
                <!-- <el-input-number
                  size="small"
                  v-model="scope.row.weight"
                  controls-position="right"
                  :precision="2"
                  :max="1000000000"
                  :min="0"
                  :disabled="!scope.row.status"
                  class="tag-input-width"
                ></el-input-number> -->
              </template>
            </el-table-column>
            <!-- 编码 -->
            <el-table-column
              prop="partyCode"
              :label="this.$i18n.t('product.commodityCode')"
              width="220px"
            >
              <template slot-scope="scope">
                <input
                  ref="partyCodeInt"
                  v-model="scope.row.partyCode"
                  type="text"
                  maxlength="36"
                  :disabled="!scope.row.status"
                  class="tag-input-width text-input party-code"
                  :placeholder="$t('product.postProductTips15')"
                  @blur="validatePartyCode(scope)"
                />
                <!-- :class="{'err-tips': scope.row.partyCodeSame}" -->
                <!-- <el-input v-model="scope.row.partyCode" size="small" maxlength="100" class="tag-input-width"></el-input> -->
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              :label="this.$i18n.t('text.menu')"
              align="center"
            >
              <!-- :width="this.$i18n.t('language') === 'English' ? '210' : '120'" -->
              <template slot-scope="scope">
                <div
                  class="default-btn text-btn"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  v-if="scope.row.status"
                >{{$t("publics.disable")}}</div>
                <div
                  class="default-btn text-btn"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  v-else
                >{{$t("shop.ena")}}</div>
                <!-- {{scope.row.skuSingleProds != null ? '编辑关联单品' : '关联单品'}} -->
                <div
                  class="default-btn text-btn"
                  @click="relationSkuRetailProd(scope.row, scope.$index)"
                  v-if="isCompose === 1"
                >{{$t("product.relatedItems")}}({{ scope.row.skuSingleProds ? scope.row.skuSingleProds.length || 0 : 0 }})</div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--批量设置-->
        <div class="batch-settings-box">
          <div class="set-txt">
            <span class="default-btn text-btn" @click="switchSet">{{$t("groups.batchSettings")}}</span>
            <span class="weak-txt">{{ $t('product.postProductTips14') }}</span>
          </div>
          <div v-if="isEdit" class="batch-settings-tb">
            <!-- 头部 -->
            <ul class="batch-settings-Head">
              <li class="head-item">{{ $t('product.sellingPrice')}}</li>
              <li class="head-item">{{ $t('coupon.stock') }}</li>
              <li class="head-item">{{ $t('product.marketPrice') }}</li>
              <li class="head-item" v-if="mold===0">{{ $t('product.commodityVolume') }}</li>
              <li class="head-item" v-if="mold===0">{{ $t('product.commodityWeight') }}</li>
              <!-- <li class="head-item">{{ $t('product.commodityCode') }}</li> -->
            </ul>
            <el-form :inline="true" class="demo-form-inline">
              <div class="batch-settings-con">
                <div class="item">
                  <!--  :label="this.$i18n.t('product.sellingPrice')" -->
                  <!-- 价格 -->
                  <el-form-item>
                    <input
                      v-model.number="dataFrom.price"
                      type="number"
                      :max="100000000"
                      :min="0.01"
                      :step="0.01"
                      class="tag-input-width"
                      @blur="handleInputValue(dataFrom.price, null, 'price', 0.01, 100000000)"
                    />
                    <!-- <el-input-number v-model="dataFrom.price"
                                    controls-position="right"
                                    size="small"
                                    :precision="2"
                                    :max="1000000000"
                                    :min="0"
                    ></el-input-number> -->
                  </el-form-item>
                </div>
                <div class="item">
                  <!-- :label="this.$i18n.t('coupon.stock')" -->
                  <el-form-item>
                    <input
                      v-model.number="dataFrom.stocks"
                      type="number"
                      :disabled="isCompose === 1"
                      :max="9999999"
                      :min="0"
                      :step="1"
                      class="tag-input-width"
                      @keyup="
                        dataFrom.stocks = String(dataFrom.stocks).match(/[^0-9]{1,7}/) ? 0 : dataFrom.stocks
                      "
                      @blur="handleInputValue(dataFrom.stocks, null, 'stocks', 0, 9999999)"
                    />
                    <!-- <el-input-number v-model="dataFrom.stocks"
                                    controls-position="right"
                                    :disabled="isCompose == 1"
                                    size="small"
                                    :precision="0"
                                    :max="9999999"
                                    :min="0"
                    ></el-input-number> -->
                  </el-form-item>
                </div>
                <div class="item">
                  <!-- :label="this.$i18n.t('live.marketPrice')" -->
                  <el-form-item>
                    <input
                      v-model.number="dataFrom.oriPrice"
                      type="number"
                      :max="100000000"
                      :min="0"
                      :step="0.01"
                      class="tag-input-width"
                      @blur="handleInputValue(dataFrom.oriPrice, null, 'oriPrice', 0, 100000000)"
                    />
                    <!-- <el-input-number v-model="dataFrom.oriPrice"
                                    controls-position="right"
                                    size="small"
                                    :precision="2"
                                    :max="1000000000"
                                    :min="0"
                    ></el-input-number> -->
                  </el-form-item>
                </div>
                <div class="item" v-if="mold===0">
                  <!-- :label="this.$i18n.t('product.commodityVolume')" -->
                  <el-form-item>
                    <input
                      v-model.number="dataFrom.volume"
                      type="number"
                      :max="100000000"
                      :min="0"
                      :step="0.01"
                      class="tag-input-width"
                      @blur="handleInputValue(dataFrom.volume, null, 'volume', 0, 100000000)"
                    />
                    <!-- <el-input-number v-model="dataFrom.volume"
                                    controls-position="right"
                                    size="small"
                                    :precision="2"
                                    :max="1000000000"
                                    :min="0"
                    ></el-input-number> -->
                  </el-form-item>
                </div>
                <div class="item" v-if="mold===0">
                  <!--  :label="this.$i18n.t('product.commodityWeight')" -->
                  <el-form-item>
                    <input
                      v-model.number="dataFrom.weight"
                      type="number"
                      :max="100000000"
                      :min="0"
                      :step="0.01"
                      class="tag-input-width"
                      @blur="handleInputValue(dataFrom.weight, null, 'weight', 0, 100000000)"
                    />
                    <!-- <el-input-number v-model="dataFrom.weight"
                                    controls-position="right"
                                    size="small"
                                    :precision="2"
                                    :max="1000000000"
                                    :min="0"
                    ></el-input-number> -->
                  </el-form-item>
                </div>
                <!-- <div class="item">
                  <el-form-item>
                    <input
                      v-model="dataFrom.partyCode"
                      type="text"
                      maxlength="36"
                      class="tag-input-width"
                    />
                  </el-form-item>
                </div> -->
              </div>
              <div class="btn-row">
                <div class="default-btn primary-btn" @click="batchSet">{{$t("order.save")}}{{$t('publics.batchSetting')}}</div>
                <div class="default-btn" @click="switchSet">{{$t("crud.filter.cancelBtn")}}</div>
              </div>
              <!-- <el-form-item>
                <el-button size="small" type="primary" @click="batchSet" class="filter-submitBtn">{{$t("crud.filter.submitBtn")}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="switchSet" class="filter-submitBtn">{{$t("crud.filter.cancelBtn")}}</el-button>
              </el-form-item> -->
            </el-form>
          </div>
        </div>

      </div>

    </el-form-item>
    <!-- 弹窗, 关联单品的弹窗 -->
    <sku-single-prod
      v-if="relationVisible"
      ref="skuSingleProd"
      @refreshSelectSingleProds="selectSingleProds"
    ></sku-single-prod>
  </div>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import {validNoEmptySpace} from '@/utils/validate'
import ImgUpload from '@/components/img-upload'
import SkuSingleProd from './sku-single-prod'
import {flatten as genFlatten} from '@/utils'
import Big from 'big.js'

export default {
  data () {
    return {
      // 表格数据
      lists: [],
      rowspan: [],
      // 数据库中的规格
      dbSpecs: [],
      // 根据选定的规格所查询出来的规格值
      dbSpecValues: [],
      specs: [], // 使用的规格
      initIsCompose: false,
      initing: false,
      relationVisible: false,
      isEdit: false,
      dataFrom: {
        oriPrice: null,
        price: null,
        stocks: null,
        weight: null,
        volume: null
      },
      partyCodeErrTips: false
    }
  },
  components: {
    ImgUpload,
    SkuSingleProd
  },
  props: {
    value: {
      default: [],
      type: Array
    },
    prodNameCn: {
      default: ''
    },
    prodNameEn: {
      default: ''
    },
    isCompose: {
      default: 0,
      type: Number
    },
    mold: {
      default: 0,
      type: Number
    }
  },
  watch: {
    skuTags: {
      deep: true,
      immediate: true,
      handler () {
        this.lists = genFlatten(this.skuTags, this.lists, this.defalutSku)
        this.computeRowspan()
      }
    },
    value (val) {
    },
    prodNameCn: function () {
      this.skuAddProdName()
    },
    prodNameEn: function () {
      this.skuAddProdName()
    },
    rowSpan: function () {
    },
    isCompose (val) {
      if (!this.initIsCompose) {
        return
      }
      if (val === 0) {
        // 清除已选择的单品
        this.clearSingleProds()
      } else {
        // 清除库存
        this.clearStocks()
      }
      this.$set(this.dataFrom, 'stocks', null)
    }
  },
  created: function () {
    this.initIsCompose = true
    this.isEdit = false
    this.$http({
      url: this.$http.adornUrl(`/prod/spec/list`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({ data }) => {
      this.dbSpecs = data
    })
    if (!this.lists.length) {
      this.lists.push({
        oriPrice: 0.01,
        partyCode: '',
        price: 0.01,
        prodName: '',
        status: 1,
        stocks: 0,
        volume: 0,
        weight: 0,
        isCompose: this.isCompose
      })
    }
  },
  computed: {
    tableLeftTitles () {
      // for (let i = 0; i < this.skuTags.length; i++) {
      //   const skuTag = this.skuTags[i]
      //   res.push(skuTag)
      // }
      return this.skuTags
    },
    skuTags: {
      get () {
        return this.$store.state.prod.skuTags.filter(item => {
          return !!(item.tagItems && item.tagItems.length && !item.tagItems[0].creating)
        })
      }
    },
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  methods: {
    init (skuList) {
      this.initing = true
      this.lists = genFlatten(this.skuTags, skuList, this.defalutSku)
      this.computeRowspan()
    },
    getTableSpecData () {
      return this.lists
    },
    getDataList () {
      return this.lists
    },
    changeSkuImg (propValue, img) {
      // 把对应的sku图片修改
      for (let i = 0; i < this.lists.length; i++) {
        if (!this.lists[i].properties) {
          continue
        }
        let properties = ((this.lists[i].properties.split(';'))[0].split(':'))[1]
        if (properties === propValue) {
          this.lists[i].pic = img
        }
      }
    },
    clearSkuImg () {
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].pic = ''
      }
    },
    computeRowspan () {
      this.rowspan = []
      const rowspan = (index) => {
        let span = []
        let dot = 0
        this.lists.map((item, idx) => {
          if (idx === 0) {
            span.push(1)
          } else {
            if (this.checkIsEqualByIndex(item.properties, this.lists[idx - 1].properties, index)) {
              span[dot] += 1
              span.push(0)
            } else {
              dot = idx
              span.push(1)
            }
          }
        })

        this.rowspan.push(span)
      }
      this.skuTags.map((item, index) => {
        rowspan(index)
      })
    },
    checkIsEqualByIndex (str1, str2, index, splitStr = ':') {
      let strArr1 = str1.split(';')
      let strArr2 = str2.split(';')
      let temp1 = strArr1[index].split(':')
      let temp2 = strArr2[index].split(':')
      return temp1[1] === temp2[1]
    },
    tableSpanMethod ({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < this.skuTags.length; i++) {
        if (columnIndex === i) {
          if (this.rowspan[i] && this.rowspan[i][rowIndex]) {
            return {
              rowspan: this.rowspan[i][rowIndex],
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    changeSkuStatus (tagIndex) {
      this.lists[tagIndex].status = this.lists[tagIndex].status ? 0 : 1
      this.$emit('input', this.lists)
    },
    skuAddProdName () {
      if (this.initing) {
        return
      }
      let skuList = []
      this.$emit('input', this.lists)
      for (let i = 0; i < this.lists.length; i++) {
        const sku = Object.assign({}, this.lists[i])
        if (!sku.properties || !sku.propertiesEn) {
          return
        }
        sku.skuName = ''
        sku.skuNameEn = ''
        let properties = sku.properties.split(';')
        let propertiesEn = sku.propertiesEn.split(';')
        for (const propertiesKey in properties) {
          sku.skuName += properties[propertiesKey].split(':')[1] + ' '
        }
        for (const propertiesKey in propertiesEn) {
          sku.skuNameEn += propertiesEn[propertiesKey].split(':')[1] + ' '
        }
        sku.prodNameCn = this.prodNameCn + ' ' + sku.skuName
        sku.prodName = this.prodNameCn + ' ' + sku.skuName
        sku.prodNameEn = this.prodNameEn + ' ' + sku.skuNameEn
        skuList.push(sku)
      }
    },
    // 清除已选择的单品
    clearSingleProds () {
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].skuSingleProds = []
      }
      this.$emit('input', this.lists)
    },
    // 清除所有sku的库存
    clearStocks () {
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].stocks = 0
      }
      this.$emit('input', this.lists)
    },
    relationSkuRetailProd (row, index) {
      this.relationVisible = true
      this.$nextTick(() => {
        this.$refs.skuSingleProd.init(row.skuSingleProds, index)
      })
    },
    selectSingleProds (data, index) {
      let skuSingleProds = JSON.parse(JSON.stringify(data))
      this.lists[index].stocks = this.countSkuStock(skuSingleProds)
      let price = this.countSkuPrice(skuSingleProds)
      this.lists[index].price = price === 0 ? 0.01 : price
      this.lists[index].oriPrice = price
      this.lists[index].skuSingleProds = skuSingleProds
      this.$emit('input', this.lists)
    },
    countSkuStock (skuSingleProds) {
      let stock = 0
      if (!skuSingleProds) {
        return stock
      }
      if (!skuSingleProds.length) {
        return stock
      }
      let arr = []
      skuSingleProds.forEach(element => {
        var x = new Big(element.stocks)
        var y = new Big(element.retailNums)
        var result = 0
        if (y > 0) {
          result = parseInt(x.div(y))
        }
        arr.push(result)
      })
      if (!arr || arr.length === 0) {
        stock = 0
      }
      stock = Math.min.apply(null, arr)
      return stock
    },
    // 计算sku所有单品的总价格
    countSkuPrice (skuSingleProds) {
      let price = 0
      if (!skuSingleProds) {
        return price
      }
      if (!skuSingleProds.length) {
        return price
      }
      skuSingleProds.forEach(element => {
        var x = new Big(element.total)
        var y = new Big(price)
        price = parseFloat(y.plus(x))
      })
      return price === 0 ? 0.01 : price.toFixed(2)
    },
    switchSet () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) {
        this.dataFrom.oriPrice = null
        this.dataFrom.price = null
        this.dataFrom.stocks = null
        this.dataFrom.weight = null
        this.dataFrom.volume = null
        this.dataFrom.partyCode = ''
      }
    },
    batchSet () {
      this.lists.forEach(sku => {
        if (this.dataFrom.oriPrice || this.dataFrom.oriPrice === 0) {
          sku.oriPrice = this.dataFrom.oriPrice
        }
        if (this.dataFrom.price) {
          sku.price = this.dataFrom.price
        }
        if ((this.dataFrom.stocks || this.dataFrom.stocks === 0) && this.isCompose !== 1) {
          sku.stocks = this.dataFrom.stocks
          this.initing = false
        }
        if (this.dataFrom.weight || this.dataFrom.weight === 0) {
          sku.weight = this.dataFrom.weight
        }
        if (this.dataFrom.volume || this.dataFrom.volume === 0) {
          sku.volume = this.dataFrom.volume
        }
      })
      this.switchSet()
      // this.isEdit = false
      this.skuAddProdName()
    },

    /**
     * 处理输入框数据
     * @param data
     * @param index
     * @param dataFields
     * @param min 最小值
     * @param max 最大值
     */
    handleInputValue (data, index, dataFields, min, max) {
      if (index !== undefined && index !== null) {
        // 表格
        if (+data > max) {
          this.$set(this.lists[index], dataFields, max)
          if (dataFields === 'stocks') {
            this.$emit('input', this.lists)
          }
          return
        }
        if (+data <= min || !data) {
          this.$set(this.lists[index], dataFields, min)
          if (dataFields === 'stocks') {
            this.$emit('input', this.lists)
          }
          return
        }
        if (dataFields === 'price' ||
          dataFields === 'oriPrice' ||
          dataFields === 'volume' ||
          dataFields === 'weight') {
          this.$set(this.lists[index], dataFields, this.checkInput(data))
        }
      } else {
        // 批量
        if (data === null || data === '') { return }
        console.log('批量data:', data)
        console.log('批量min:', min)
        if (+data > max) {
          this.$set(this.dataFrom, dataFields, max)
          return
        }
        if (+data <= min) {
          this.$set(this.dataFrom, dataFields, min)
          return
        }
        if (dataFields === 'price' ||
          dataFields === 'oriPrice' ||
          dataFields === 'volume' ||
          dataFields === 'weight') {
          this.$set(this.dataFrom, dataFields, this.checkInput(data))
        }
      }
      if (dataFields === 'stocks') {
        this.$emit('input', this.lists)
      }
    },

    /**
     * 只允许输入正数和小数(保留小数点后两位)
     */
    checkInput (num) {
      if (num) {
        var tmpVal = String(num).replace(/[^\d^\\.]/g, '')
        var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
        if (!reg.test(tmpVal)) {
          tmpVal = tmpVal + ''
          tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
          var n = (tmpVal.split('.')).length - 1
          if (n > 1) {
            tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
          }
        }
        return tmpVal
      } else {
        return ''
      }
    },

    /**
     * 编码输入框校验
     */
    validatePartyCode (scope) {
      const { row, $index } = scope
      // 纯空格校验
      if (validNoEmptySpace(row.partyCode)) {
        this.$set(this.lists[$index], 'partyCode', '')
        return
      }
      // 商品编码重复校验
      this.check(row, $index)
    },

    check (row, $index) {
      // if (
      //   row.partyCode &&
      //   this.lists.find((el, index) => el.partyCode &&
      //     index !== $index &&
      //     el.partyCode === row.partyCode)
      // ) {
      //   this.$message({
      //     message: this.$i18n.t('product.postProductTips16'),
      //     type: 'error',
      //     duration: 1500
      //   })
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

.mod-prod-sku-table {
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .pic {
      width: 120px;
      height: 120px;
      display: block;
    }
  }
  .pic-uploader-component .el-upload:hover {
    border-color: #409eff;
  }
  .del {
    color: #155bd4;
    cursor: pointer;
  }
  .tag-input-width.el-input-number--small {
    width: 100%;
  }
  .tag-input-width.party-code::placeholder {
    color: #999;
  }
  .tag-input-width.party-code.err-tips {
    border-color: #D40000;
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
  .tag-input-width.text-input {
    padding-right: 5px;
  }
  // 表格+批量设置
  .sku-table-con {
    display: block;
    padding: 10px;
    border: 1px solid #DCDCDC;
    .table-header {
      background: #f8f8f8;
    }

    // 批量设置
    .batch-settings-box {
      .set-txt {
        padding-top: 10px;
        .weak-txt {
          color: #999;
          font-size: 12px;
          margin-left: 5px;
        }
      }
      .batch-settings-tb {
        margin: 10px 0;
        // 头部
        ul,
        li {
          list-style: none;
          margin: 0;
          padding: 0;
          line-height: 1em;
        }
        .batch-settings-Head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          background: #f8f8f8;
          .stress {
            font-size: 14px;
            color: #D40000;
            margin-right: 3px;
          }
          li.head-item {
            flex: 1;
            padding: 0 10px;
            font-weight: bold;
          }
        }

        .batch-settings-con {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          .item {
            flex: 1;
            padding: 0 10px;
            & >>> .el-form-item,
            & >>> .el-form-item__content {
              width: 100%;
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}

// ::v-deep .el-table{
//   width: 76.5%;
// }

// div ::v-deep .el-form-item__content span,
// div ::v-deep .mul-pic-upload div {
//   color: #02A1E9;
// }
.filter-submitBtn span{
  color:#fff !important;
}
div >>> .el-table tbody tr:hover>td { background-color: #ffffff }
</style>
