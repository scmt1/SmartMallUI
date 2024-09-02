<template>
  <div class="mod-groupActivity">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.stockBillLogId
          ?  this.$i18n.t('purchase.order.newPurchaseInbound')
          : this.$i18n.t('purchase.order.viewPurchaseInbound')
        }}
      </div>
    </div>
    <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        label-width="auto"
        size="small"
        class="form-box"
      >
        <!-- 供应商 -->
        <el-form-item
          :label="this.$i18n.t('purchase.order.supplier')"
          prop="supplierName"
        >
          <div class="default-btn" v-if="!dataForm.supplierName" @click="selectSupplier" >{{
            $t("product.chooseSupplier")
          }}</div>
          <el-tag :closable="!dataForm.stockBillLogId" v-if="dataForm.supplierName" @close="handleClose()">{{
            dataForm.supplierName
          }}</el-tag>
        </el-form-item>
        <!-- 送达时间 -->
        <el-form-item
          :label="this.$i18n.t('purchase.order.deliverTime')"
          prop="businessTime"
        >
          <el-date-picker
            v-model="dataForm.businessTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$i18n.t('admin.seleData')"
            :picker-options="inboundPickerOptions"
            :disabled="dataForm.stockBillLogId">
          </el-date-picker>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item
          :label="this.$i18n.t('purchase.order.remark')"
          prop="remark"
        >
         <el-input
            :placeholder="this.$i18n.t('purchase.order.remark')"
            maxlength="50"
            show-word-limit
            type="textarea"
            v-model="dataForm.remark"
            class="groupActivity-input"
            :disabled="dataForm.stockBillLogId"
          ></el-input>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item
          :label="this.$i18n.t('home.product')"
          v-if="!dataForm.stockBillLogId"
        >
          <el-button plain @click="selectSupplierProd" :disabled="!dataForm.supplierId">{{$t("product.select")}}</el-button>
          <el-button plain @click.stop="getUpload" :disabled="!dataForm.supplierId">{{$t("product.importGoods")}}</el-button>
        </el-form-item>
        <!-- 选择供应商商品列表（新增时使用） -->
        <el-form-item v-if="!dataForm.stockBillLogId">
          <span v-if="prods.length > 0 && !dataForm.stockBillLogId">
            {{ $i18n.t('order.amountOfGoods') + '：' + dataForm.totalCount + ', ' +
              $i18n.t('order.totalPrice') + '：' + dataForm.totalAmount
            }}
          </span>
          <el-table
            v-if="prods.length > 0 && !dataForm.stockBillLogId"
            :data="prods"
            style="width: 100%">
            <el-table-column
              label=""
              width="300">
              <template slot-scope="scope">
                <div class="mod-order-order">
                  <div class="item">
                    <div class="prod-image">
                        <img v-if="scope.row.pic" :src="imgSrc(scope.row.pic)" />
                        <img v-else src="../../../assets/img/def.png" width="60" height="60" />
                    </div>
                    <div class="prod-name">
                      <div class="item">
                        {{scope.row.prodName}}
                      </div>
                      <!-- <div class="item">
                        {{scope.row.skuName}}
                      </div>
                      <div class="item">
                        {{scope.row.partyCode}}
                      </div> -->
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column
              :label="$i18n.t('groups.sku')"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.skuName }}</span>
              </template>
            </el-table-column>
            <!-- 商品编码 -->
            <el-table-column
              :label="$i18n.t('product.commodityCode')"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.partyCode }}</span>
              </template>
            </el-table-column>
            <!-- 库存 -->
            <el-table-column
              :label="$i18n.t('coupon.stock')"
              width="100">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.stocks }}</span>
              </template>
            </el-table-column>
            <!-- 采购数量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseNum')"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.stockCount" @change="changStock(scope.row)" size="small">
                  <el-tooltip slot="suffix" class="item" effect="dark" :content="$i18n.t('purchase.order.purchaseNumThanMinimum')" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-input>
              </template>
            </el-table-column>
            <!-- 采购价 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchasePrice')"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unitPrice" @change="changPrice(scope.row)" size="small">
                  <el-tooltip slot="suffix" class="item" effect="dark" :content="$i18n.t('purchase.order.purchasePriceMustThen0')" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-input>
              </template>
            </el-table-column>
            <!-- 采购金额 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseAmount')"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.purchaseAmount" size="small" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('crud.menu')">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">{{ $t('text.delBtn') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 详情列表（查看详情时使用） -->
        <el-form-item
          :label="this.$i18n.t('home.product')"
          v-if="dataForm.stockBillLogId"
          prop="startTime"
        >
        <br>
        <span v-if="prods.length > 0">
            {{ $i18n.t('order.amountOfGoods') + '：' + dataForm.totalCount + ', ' +
              $i18n.t('order.totalPrice') + '：' + dataForm.totalAmount
            }}
        </span>
         <el-table
            :data="prods"
            v-if="prods.length > 0"
            style="width: 100%">
            <el-table-column
              label=""
              width="300">
              <template slot-scope="scope">
                <div class="mod-order-order">
                  <div class="item">
                    <div class="prod-image">
                        <img v-if="scope.row.pic" :src="imgSrc(scope.row.pic)" />
                        <img v-else src="../../../assets/img/def.png" width="60" height="60" />
                    </div>
                    <div class="prod-name">
                      <div class="item">
                        {{scope.row.prodName}}
                      </div>
                      <div class="item">
                        {{scope.row.skuName}}
                      </div>
                      <div class="item">
                        {{scope.row.partyCode}}
                      </div>
                      <div class="item order-status" v-if="scope.row.isDelete">
                        {{ $t("purchase.order.deleted")}}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column
              :label="$i18n.t('groups.sku')"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.skuName }}</span>
              </template>
            </el-table-column>
            <!-- 商品编码 -->
            <el-table-column
              :label="$i18n.t('product.commodityCode')"
              width="100">
              <template slot-scope="scope">
                <span >{{ scope.row.partyCode }}</span>
              </template>
            </el-table-column>
            <!-- 库存 -->
            <el-table-column
              :label="$i18n.t('coupon.stock')"
              width="100">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.stocks }}</span>
              </template>
            </el-table-column>
            <!-- 采购数量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseNum')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.stockCount}} </span>
              </template>
            </el-table-column>
            <!-- 采购价 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchasePrice')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.unitPrice}} </span>
              </template>
            </el-table-column>
            <!-- 采购金额 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseAmount')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.totalAmount}} </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <div class="default-btn" @click="back()" size="mini">{{
            $t("shopFeature.edit.back")
          }}</div>
          <div v-if="!this.dataForm.stockBillLogId" class="default-btn primary-btn" type="primary" size="mini" @click="dataFormSubmit()">{{
            this.dataForm.stockBillLogId ? $t('purchase.order.inbound') : $t("groups.submit")
          }}</div>
        </el-form-item>
      </el-form>

      <!-- 供应商选择弹窗-->
      <supplier-select
        v-if="supplierSelectVisible"
        ref="supplierSelect"
        @refreshSelectSupplier="supplierSelectHandle"
        :isSingle="true"
      ></supplier-select>

      <!-- 供应商商品选择弹窗-->
      <supplier-prod-select
        v-if="supplierProdSelectVisible"
        ref="supplierProdSelect"
        @refreshSelectSupplier="supplierProdSelectHandle"
        :type="1"
        dataUrl="/supplier/supplierProd/page"
      ></supplier-prod-select>
      <!-- excel -->
      <excel-upload
        v-if="uploadVisible"
        ref="excelUpload"
        @refreshDataList="refreshDataList"
        :modelUrl="modelUrl"
        :uploadUrl="uploadUrl"
        :templateName="templateName"
      ></excel-upload>
  </div>
</template>

<script>
import moment from 'moment'
import Big from 'big.js'
import ExcelUpload from './components/purchases-prod-upload'
import SupplierSelect from '@/components/supplier-select'
import SupplierProdSelect from '@/components/supplier-prod-select'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'newGroupActivity',
  data () {
    return {
      uploadVisible: false,
      supplierSelectVisible: false,
      supplierProdSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      roleList: [],
      selectTime: [],
      dvyNames: [],
      prods: [],
      supplierProds: [],
      // dialogWidth:'895px',
      modelUrl: null,
      uploadUrl: null,
      templateName: null,
      dataForm: {
        remark: '',
        purchaseOrderId: '',
        purchaseNumber: '',
        businessTime: '',
        supplierId: '',
        stockBillType: 1,
        totalCount: 0,
        totalAmount: 0,
        type: 2,
        supplierName: null
      },
      isSubmit: false,
      groupProdAndSkuLists: [],
      inboundPickerOptions: {
        disabledDate (time) {
          let month1 = moment().startOf('day')
          return (
            time.getTime() > month1.valueOf()
          )
        }
      },
      dataRule: {
        supplierName: [
          { required: true, message: this.$i18n.t('purchase.order.selectSupplier'), trigger: 'blur' }
        ],
        businessTime: [
          { required: true, message: this.$i18n.t('purchase.order.deliverTimeNotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ExcelUpload,
    SupplierSelect,
    SupplierProdSelect
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.dataForm.stockBillLogId = this.$route.query.stockBillLogId ? parseInt(this.$route.query.stockBillLogId) : null
      // 更新菜单路径
      let navTitles = JSON.parse(JSON.stringify(this.$store.state.common.selectMenu))
      let title = !this.dataForm.stockBillLogId ? this.$i18n.t('purchase.order.newPurchaseInbound') : this.$i18n.t('purchase.order.viewPurchaseInbound')
      navTitles.splice(navTitles.length - 1, 1, title)
      this.$store.commit('common/updateSelectMenu', navTitles)
      // 初始化数据
      this.isSubmit = false
      this.prods = []
      this.$refs['dataForm'].resetFields()
      if (this.dataForm.stockBillLogId) {
        this.$http({
          url: this.$http.adornUrl('/shop/stockBillLog/purchaseInfo/' + this.dataForm.stockBillLogId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.validEndTime = data.endTime
          // this.dataForm.supplierName = data.supplierName
          data.stockBillLogItems.forEach(item => {
            item.totalAmount = new Big(item.stockCount).times(item.unitPrice)
          })
          this.prods = data.stockBillLogItems
        })
      }
    },
    handleDelete (index) {
      this.prods.splice(index, 1)
      this.setTotalAmountAndCount()
    },
    changStock (row) {
      var numReg = /^([0-9]|[1-9]\d+)(\.\d{2})?$/
      var numRe = new RegExp(numReg)
      var stockCount = row.stockCount
      if (!numRe.test(stockCount) || !stockCount || stockCount < row.minOrderQuantity) {
        stockCount = row.minOrderQuantity
      } else if (stockCount > 9999999) {
        stockCount = 9999999
      }
      this.$set(row, 'stockCount', Math.round(stockCount))
      this.$set(row, 'purchaseAmount', new Big(stockCount).times(row.unitPrice))
      this.setTotalAmountAndCount()
    },
    changPrice (row) {
      var numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
      var unitPrice = row.unitPrice
      var numRe = new RegExp(numReg)
      if (!unitPrice || !numRe.test(unitPrice) || !unitPrice) {
        unitPrice = row.price
      } else if (!this.dataForm.isDefault && unitPrice < row.price) {
        unitPrice = row.price
      } else if (unitPrice > 9999999.99) {
        unitPrice = 9999999.99
      }
      this.$set(row, 'unitPrice', parseFloat(unitPrice).toFixed(2))
      this.$set(row, 'purchaseAmount', new Big(row.stockCount).times(unitPrice))
      this.setTotalAmountAndCount()
    },
    setTotalAmountAndCount () {
      var totalCount = 0
      var totalAmount = 0
      this.prods.forEach(item => {
        totalAmount = new Big(totalAmount).plus(item.purchaseAmount)
        totalCount = new Big(totalCount).plus(item.stockCount)
      })
      this.$set(this.dataForm, 'totalAmount', totalAmount)
      this.$set(this.dataForm, 'totalCount', totalCount)
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.prods || this.prods.length < 1) {
            this.$message.error(this.$i18n.t('purchase.order.selectSupplierProduct'))
            return
          }
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              if (this.isSubmit) {
                return false
              }
              this.dataForm.stockBillLogItems = this.prods
              this.dataForm.status = 1
              this.isSubmit = true
              this.$http({
                url: this.$http.adornUrl('/shop/stockBillLog'),
                method: 'post',
                data: this.$http.adornData(this.dataForm)
              }).then(({ data }) => {
                this.selectTime = []
                this.$message({
                  message: this.$i18n.t('publics.operation'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.back()
                    this.isSubmit = false
                  }
                })
              }).catch((e) => {
                this.isSubmit = false
              })
            }
          })
        }
      })
    }),
    // 选择供应商
    selectSupplier () {
      let suppliers = []
      suppliers.push({ supplierId: this.dataForm.supplierId })
      this.supplierSelectVisible = true
      this.$nextTick(() => {
        this.$refs.supplierSelect.init(suppliers)
      })
    },
    // 供应商选择回调
    supplierSelectHandle (data) {
      if (!data) {
        return
      }
      this.dataForm.supplierId = data[0].supplierId
      this.dataForm.supplierName = data[0].supplierName
      this.dataForm.isDefault = data[0].isDefault
      // 获取供应商商品
    },
    // 选择供应商商品
    selectSupplierProd () {
      if (!this.dataForm.supplierId) {
        return
      }
      const supplierProdIds = []
      this.supplierProds.forEach(item => {
        supplierProdIds.push(item.supplierProdId)
      })
      let skuIds = []
      this.prods.forEach(prod => {
        skuIds.push(prod.skuId)
      })
      let data = {
        supplierId: this.dataForm.supplierId,
        skuIds: skuIds
      }
      this.supplierProdSelectVisible = true
      this.$nextTick(() => {
        this.$refs.supplierProdSelect.init(data)
      })
    },
    // 供应商商品选择回调
    supplierProdSelectHandle (data) {
      data.forEach(prod => {
        if (this.containsId(prod)) {
          this.$set(prod, 'stockCount', prod.minOrderQuantity)
          this.$set(prod, 'unitPrice', prod.purchasePrice)
          this.$set(prod, 'price', prod.purchasePrice)
          this.$set(prod, 'purchaseAmount', new Big(prod.purchasePrice).times(prod.minOrderQuantity))
          this.prods.push(prod)
        }
      })
      this.setTotalAmountAndCount()
    },
    containsId (prod) {
      let skuIds = []
      this.prods.forEach(prod => {
        skuIds.push(prod.skuId)
      })
      if (skuIds.indexOf(prod.skuId) === -1) {
        return true
      }
      return false
    },
    /**
    * 删除供应商
    */
    handleClose () {
      // this.dataForm.supplierId = null
      this.dataForm.supplierName = ''
      this.dataForm.supplierId = null
      this.prods = []
    },
    groupNumCheck () {
      var maxNum = Math.round(this.dataForm.groupNumber)
      if (!maxNum) {
        maxNum = 2
      } else if (maxNum < 2) {
        maxNum = 2
      } else if (maxNum > 500) {
        maxNum = 500
      }
      this.dataForm.groupNumber = maxNum
    },
    maxNumCheck () {
      var maxNum = Math.round(this.dataForm.maxNum)
      if (!maxNum) {
        maxNum = 1
      } else if (maxNum < 1) {
        maxNum = 1
      } else if (maxNum > 1000000000) {
        maxNum = 1000000000
      }
      this.dataForm.maxNum = maxNum
    },
    // 删除活动商品
    deleteProd (index) {
      this.dataForm.groupProds.splice(index, 1)
    },
    imgSrc (pic) {
      return pic.indexOf('http') === -1 && pic.indexOf('https') === -1 ? this.resourcesUrl + pic : pic
    },
    back () {
      this.$router.push({
        name: 'stock-purchasesInbound'
      })
    },
    // 弹出导入供应商商品窗口
    getUpload () {
      this.uploadVisible = true
      this.modelUrl = '/purchase/order/downloadModel'
      this.uploadUrl = '/purchase/order/exportExcel/' + this.dataForm.supplierId
      this.templateName = this.$t('purchase.order.purchaseProdTemplate')
      this.$nextTick(() => {
        this.$refs.excelUpload.init()
      })
    },
    // excel上传回调
    refreshDataList (data) {
      if (data.errorMsg) {
        alert(data.errorMsg)
      }
      if (data.data) {
        const ids = []
        const list = JSON.parse(data.data)
        this.prods.forEach(item => {
          ids.push(item.skuId)
        })
        list.forEach(prod => {
          this.$set(prod, 'stockCount', prod.purchaseStock)
          this.$set(prod, 'unitPrice', prod.purchasePrice)
          this.$set(prod, 'price', prod.purchasePrice)
          this.$set(prod, 'purchaseAmount', new Big(prod.purchasePrice).times(prod.stockCount || prod.minOrderQuantity))
          prod.pic = this.resourcesUrl + prod.pic
          if (this.containsId(prod)) {
            this.prods.push(prod)
          }
        })
      }
      this.setTotalAmountAndCount()
    }
  }
}
</script>
<style lang="scss">
.mod-groupActivity {
  .date-picker {
    width: 60%;
  }

  .card-prod-bottom {
    position: relative;
    text-align: left;

    .card-prod-name {
      margin: auto;
      padding: 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }

    .card-prod-name-button {
      position: absolute;
      top: 24px;
      right: 10px;
    }

    .card-edit-sku-button {
      position: absolute;
      top: 24px;
      left: 10px;
    }
  }

  .groupActivity-input {
    width: 60%;
  }

  .auxiliary-font {
    font-size: 12px;
    color: #cbc0cb;
    line-height: 20px;
  }

  .font-color-red {
    color: crimson;
  }
  .groupActivity-input {
    width: 524px;
  }
  .form-box {
    margin-left: 30px;
  }
}
.mod-order-order {
  .prod-image {
    margin-right: 20px;
    width: 80px;
    height: 80px;
    float: left;
  }
  .prod-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .prod-name {
    width: 100%;
    text-align: left;
    float: right;
    .item {
      box-sizing: border-box;
      display: -webkit-box;
      word-break: break-word;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.order-status {
  display: inline-block;
  margin-top: 15px;
  padding: 2px 4px;
  border: 1px solid #e43130;
  border-radius: 2px;
  color: #e43130;
}
</style>
