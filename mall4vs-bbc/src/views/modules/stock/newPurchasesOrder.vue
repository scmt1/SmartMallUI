<template>
  <div class="mod-groupActivity">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          view ? this.$i18n.t('purchase.order.viewPurchaseOrder') :
            !dataForm.purchaseOrderId
            ?  this.$i18n.t('purchase.order.newPurchaseOrder')
            : this.$i18n.t('purchase.order.purchaseOrderInbound')
        }}
      </div>
    </div>
    <el-form
        :model="dataForm"
        ref="dataForm"
        :rules="dataRule"
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
          <el-tag :closable="!dataForm.purchaseOrderId" v-if="dataForm.supplierName" @close="handleClose()">{{
            dataForm.supplierName
          }}</el-tag>
        </el-form-item>
        <!-- 送达时间 -->
        <el-form-item
          :label="this.$i18n.t('purchase.order.deliverTime')"
          prop="deliverTime"
        >
          <el-date-picker
            v-model="dataForm.deliverTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$i18n.t('admin.seleData')"
            :picker-options="dataForm.purchaseOrderId ? inboundPickerOptions : purchasePickerOptions"
            :disabled="view">
          </el-date-picker>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item
          :label="this.$i18n.t('purchase.order.remark')"
          prop="startTime"
        >
         <el-input
            :placeholder="this.$i18n.t('purchase.order.remark')"
            maxlength="50"
            show-word-limit
            type="textarea"
            v-model="dataForm.remark"
            class="groupActivity-input"
            :disabled="view"
          ></el-input>
        </el-form-item>
        <!-- 配送类型 -->
        <el-form-item
          :label="this.$i18n.t('product.delType')"
          prop="startTime"
        >
          <el-radio v-model="dataForm.dvyType" :label="1" :disabled="dataForm.purchaseOrderId">{{ this.$i18n.t('order.expressDelivery') }}</el-radio>
          <el-radio v-model="dataForm.dvyType" :label="3" :disabled="dataForm.purchaseOrderId">{{ this.$i18n.t('order.noNeedRequired') }}</el-radio>
        </el-form-item>
        <el-form-item
          v-if="dataForm.dvyType === 1"
          :label="this.$i18n.t('order.logisticsCompany')"
          prop="dvyId"
        >
         <el-select v-model="dataForm.dvyId" :placeholder="$i18n.t('order.seleCouCom')" :disabled="dataForm.purchaseOrderId">
            <el-option
              v-for="item in dvyNames"
              :key="item.dvyId"
              :label="item.dvyName"
              :value="item.dvyId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 物流编号 -->
        <el-form-item
          v-if="dataForm.dvyType === 1"
          :label="this.$i18n.t('order.logisticsNumber')"
          prop="dvyFlowId"
        >
         <el-input
            :placeholder="this.$i18n.t('order.entCouNum')"
            maxlength="30"
            show-word-limit
            v-model="dataForm.dvyFlowId"
            :disabled="dataForm.purchaseOrderId"
            class="groupActivity-input"
          ></el-input>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item
          :label="this.$i18n.t('home.product')"
          v-if="!view && !dataForm.purchaseOrderId"
        >
          <el-button plain @click="selectSupplierProd" :disabled="!dataForm.supplierId">{{$t("product.select")}}</el-button>
          <el-button plain @click="getUpload" :disabled="!dataForm.supplierId">{{$t("product.importGoods")}}</el-button>
        </el-form-item>
        <!-- 选择供应商商品列表（新增时使用） -->
        <el-form-item v-if="!view">
          <span v-if="prods.length > 0 && !dataForm.purchaseOrderId">
            {{ $i18n.t('order.amountOfGoods') + '：' + dataForm.totalStock + ', ' +
              $i18n.t('order.totalPrice') + '：' + dataForm.totalAmount
            }}
          </span>
          <el-table
            v-if="prods.length > 0 && !dataForm.purchaseOrderId"
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
            <!-- 商品编码 -->
            <el-table-column
              :label="$i18n.t('product.commodityCode')"
              width="100"
              >
              <template slot-scope="scope">
                <span >{{ scope.row.partyCode }}</span>
              </template>
            </el-table-column>
              <!-- 规格 -->
            <el-table-column
              :label="$i18n.t('groups.sku')"
              width="100"
              >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.skuName }}</span>
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
                <el-input v-model="scope.row.purchaseStock" @change="changStock(scope.row)" size="small">
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
                <el-input v-model="scope.row.purchasePrice" @change="changPrice(scope.row)" size="small">
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
                <span>{{scope.row.purchaseAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('crud.menu')">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index)">{{ $t('text.delBtn') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 入库商品列表（入库时使用） -->
        <el-form-item
          :label="this.$i18n.t('home.product')"
          v-if="!view && dataForm.purchaseOrderId"
          prop="startTime"
        >
          <!-- <el-button plain @click="getExportExcel">{{ $t("purchase.order.exportInboundProd") }}</el-button> -->
          <el-button plain @click="getInboundUpload">{{$t("purchase.order.importInboundProd")}}</el-button>
        </el-form-item>
        <el-form-item
          v-if="!view && dataForm.purchaseOrderId"
          prop="startTime"
        >
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
            <!-- 采购金额 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseAmount')"
              width="180">
              <template slot-scope="scope">
                <span >{{scope.row.purchaseAmount}}</span>
              </template>
            </el-table-column>
            <!-- 预计入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.estimatedIncomingQuantity')"
              width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.purchaseStock }}</span>
              </template>
            </el-table-column>
            <!-- 已入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.numberInStock')"
              width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.alreadyStock }}</span>
              </template>
            </el-table-column>
            <!-- 剩余入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.remainingIncomingQuantity')"
              width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.remainingStock }}</span>
              </template>
            </el-table-column>
            <!-- 实际入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.actualIncomingQuantity')"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.actualStock" @change="changActualStock(scope.row)" size="small" :disabled="scope.row.isDelete"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 详情列表（查看详情时使用） -->
        <el-form-item
          :label="this.$i18n.t('home.product')"
          v-if="view && dataForm.purchaseOrderId"
          prop="startTime"
        >
        <span v-if="prods.length > 0 ">
            {{ $i18n.t('order.amountOfGoods') + '：' + dataForm.totalStock + ', ' +
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
                        <img :src="imgSrc(scope.row.pic)" />
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
                      <div class="item order-status" v-if="scope.row.isDelete">
                        {{ $t("purchase.order.deleted")}}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 商品规格 -->
            <el-table-column
              :label="$i18n.t('product.productSpecifi')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.skuName}} </span>
              </template>
            </el-table-column>
            <!-- 商品编码 -->
            <el-table-column
              :label="$i18n.t('product.commodityCode')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.partyCode}} </span>
              </template>
            </el-table-column>
            <!-- 采购数量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseNum')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.purchaseStock}} </span>
              </template>
            </el-table-column>
            <!-- 采购价 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchasePrice')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.purchasePrice}} </span>
              </template>
            </el-table-column>
            <!-- 采购金额 -->
            <el-table-column
              :label="$i18n.t('purchase.order.purchaseAmount')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.purchaseAmount}} </span>
              </template>
            </el-table-column>
            <!-- 预计入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.estimatedIncomingQuantity')"
              width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.purchaseStock }}</span>
              </template>
            </el-table-column>
            <!-- 实际入库量 -->
            <el-table-column
              :label="$i18n.t('purchase.order.actualIncomingQuantity')"
              width="180">
              <template slot-scope="scope">
                <span> {{scope.row.actualStock}} </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <div class="default-btn" @click="back()" size="mini">{{
            $t("shopFeature.edit.back")
          }}</div>
          <div v-if="!view" class="default-btn primary-btn" type="primary" size="mini" @click="dataFormSubmit()">{{
            this.dataForm.purchaseOrderId ? $t('purchase.order.inbound') : $t("groups.submit")
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
    var validateDvyFlowId = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        callback(new Error(this.$i18n.t('order.checkDvyIdMsg')))
      } else {
        callback()
      }
    }
    return {
      uploadVisible: false,
      showEventPreview: false,
      supplierSelectVisible: false,
      supplierProdSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      modelUrl: '',
      uploadUrl: '',
      templateName: '',
      roleList: [],
      selectTime: [],
      dvyNames: [],
      prods: [],
      supplierProds: [],
      view: false,
      // dialogWidth:'895px',
      dataForm: {
        purchaseOrderId: '',
        purchaseNumber: '',
        deliverTime: '',
        dvyType: 1,
        dvyId: '',
        dvyFlowId: '',
        supplierId: '',
        purchaseStock: 0,
        purchasePrice: 0,
        totalAmount: 0,
        totalStock: 0,
        actualTotalStock: 0,
        supplierName: null,
        remark: ''
      },
      isSubmit: false,
      groupProdAndSkuLists: [],
      purchasePickerOptions: {
        disabledDate (time) {
          let month1 = moment().startOf('day')
          return (
            time.getTime() < month1.valueOf()
          )
        }
      },
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
        deliverTime: [
          { required: true, message: this.$i18n.t('purchase.order.deliverTimeNotEmpty'), trigger: 'blur' }
        ],
        dvyId: [
          { required: true, message: this.$i18n.t('order.seleCouCom'), trigger: 'blur' }
        ],
        dvyFlowId: [
          { required: true, message: this.$i18n.t('order.logEmpty'), trigger: 'blur' },
          { validator: validateDvyFlowId, trigger: 'blur' }
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
      this.dataForm.purchaseOrderId = this.$route.query.purchaseOrderId ? parseInt(this.$route.query.purchaseOrderId) : null
      this.view = !!this.$route.query.view
      // 更新菜单路径
      let navTitles = JSON.parse(JSON.stringify(this.$store.state.common.selectMenu))
      let title = this.view ? this.$i18n.t('purchase.order.viewPurchaseOrder') : !this.dataForm.purchaseOrderId ? this.$i18n.t('purchase.order.newPurchaseOrder') : this.$i18n.t('purchase.order.purchaseOrderInbound')
      navTitles.splice(navTitles.length - 1, 1, title)
      this.$store.commit('common/updateSelectMenu', navTitles)
      // 初始化数据
      this.isSubmit = false
      this.prods = []
      this.loadData()
      this.$refs['dataForm'].resetFields()
      if (this.dataForm.purchaseOrderId) {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/info/' + this.dataForm.purchaseOrderId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (Date.parse(data.startTime) < Date.parse(new Date())) {
            this.showEventPreview = true
          } else {
            this.showEventPreview = false
          }
          this.dataForm = data
          this.validEndTime = data.endTime
          // this.dataForm.supplierName = data.supplierName
          if (!this.view) {
            data.purchaseProds.forEach(item => {
              item.alreadyStock = item.actualStock
              let remainingStock = item.purchaseStock - item.actualStock
              item.remainingStock = remainingStock < 0 ? 0 : remainingStock
              item.actualStock = item.remainingStock
            })
          }
          this.prods = data.purchaseProds
        })
      }
    },
    loadData () {
      // 请求物流公司
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dvyNames = data
        if (!this.dataForm.dvyId && this.dvyNames && this.dvyNames.length > 0) {
          this.dataForm.dvyId = this.dvyNames[0].dvyId
        }
      })
    },
    handleDelete (index) {
      this.prods.splice(index, 1)
      this.setTotalAmountAndCount()
    },
    changActualStock (row) {
      var numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(row.actualStock) || !row.actualStock) {
        this.$set(row, 'actualStock', 0)
      }
      if (row.actualStock > 9999999) {
        this.$set(row, 'actualStock', 9999999)
      }
      this.$set(row, 'actualStock', Math.round(row.actualStock))
    },
    changStock (row) {
      var numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
      var numRe = new RegExp(numReg)
      if (!numRe.test(row.purchaseStock) || !row.purchaseStock || row.purchaseStock < row.minOrderQuantity) {
        this.$set(row, 'purchaseStock', row.minOrderQuantity)
      } else if (row.purchaseStock > 9999999) {
        this.$set(row, 'purchaseStock', 9999999)
      }
      this.$set(row, 'purchaseStock', Math.round(row.purchaseStock))
      this.$set(row, 'purchaseAmount', new Big(row.purchaseStock).times(row.purchasePrice))
      this.setTotalAmountAndCount()
    },
    changPrice (row) {
      var numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
      var purchasePrice = row.purchasePrice
      var numRe = new RegExp(numReg)
      if (!row.purchasePrice || !numRe.test(purchasePrice) || !purchasePrice || purchasePrice < 0.01) {
        purchasePrice = row.price
      } else if (purchasePrice > 9999999.99) {
        purchasePrice = 9999999.99
      }
      this.$set(row, 'purchasePrice', parseFloat(purchasePrice).toFixed(2))
      this.$set(row, 'purchaseAmount', new Big(row.purchaseStock).times(row.purchasePrice))
      this.setTotalAmountAndCount()
    },
    setTotalAmountAndCount () {
      var totalAmount = 0
      var totalStock = 0
      this.prods.forEach(item => {
        totalAmount = new Big(totalAmount).plus(item.purchaseAmount)
        totalStock = new Big(totalStock).plus(item.purchaseStock)
      })
      this.$set(this.dataForm, 'totalAmount', totalAmount)
      this.$set(this.dataForm, 'totalStock', totalStock)
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (!this.dataForm.deliverTime) {
          //   this.$message.error(this.$i18n.t('purchase.order.deliverTimeNotEmpty'))
          //   return
          // }
          // if (this.dataForm.dvyType === 1) {
          //   if (!this.dataForm.dvyFlowId && this.dataForm.dvyFlowId !== ' ') {
          //     this.$message.error(this.$i18n.t('order.logEmpty'))
          //     return
          //   }
          // }
          if (!this.prods || this.prods.length < 1) {
            this.$message.error(this.$i18n.t('purchase.order.selectSupplierProduct'))
            return
          }
          this.dataForm.updateTime = null
          this.dataForm.createTime = null
          if (this.dataForm.dvyType !== 1) {
            this.dataForm.dvyId = null
            this.dataForm.dvyFlowId = ''
          }
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              if (this.isSubmit) {
                return false
              }
              this.dataForm.purchaseProds = this.prods
              this.isSubmit = true
              this.$http({
                url: this.$http.adornUrl(this.dataForm.purchaseOrderId ? '/purchase/order/inbound' : '/purchase/order'),
                method: this.dataForm.purchaseOrderId ? 'put' : 'post',
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
      this.$set(this.dataForm, 'supplierName', data[0].supplierName)
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
      const skuIds = []
      const retailProdIds = []
      this.prods.forEach(prod => {
        skuIds.push(prod.skuId)
      })
      let data = {
        supplierId: this.dataForm.supplierId,
        retailProdIds: retailProdIds,
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
          this.$set(prod, 'purchaseStock', prod.minOrderQuantity)
          this.$set(prod, 'purchasePrice', prod.purchasePrice)
          this.$set(prod, 'price', prod.purchasePrice)
          this.$set(prod, 'purchaseAmount', new Big(prod.purchasePrice).times(prod.minOrderQuantity))
          this.$set(prod, 'remark', '')
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
        name: 'stock-purchasesOrder'
      })
    },
    // excel上传回调
    refreshDataList (data) {
      if (data.errorMsg) {
        alert(data.errorMsg)
      }
      if (!this.dataForm.purchaseOrderId) {
        this.supplierRefreshDataList(data)
      } else {
        this.inboundRefreshDataList(data)
      }
    },
    // ==============================新增采购订单excel============================
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
    // 导入供应商商品回调
    supplierRefreshDataList (data) {
      if (data.data) {
        const ids = []
        const list = JSON.parse(data.data)
        this.prods.forEach(item => {
          ids.push(item.skuId)
        })
        list.forEach(prod => {
          this.$set(prod, 'purchaseAmount', new Big(prod.purchasePrice).times(prod.purchaseStock || prod.minOrderQuantity))
          prod.pic = this.resourcesUrl + prod.pic
          if (this.containsId(prod)) {
            this.prods.push(prod)
          }
        })
      }
      this.setTotalAmountAndCount()
    },
    // ==============================采购订单入库excel============================
    getExportExcel () {
      this.$confirm(`${this.$i18n.t('shop.exportProdTip')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/inbound/export'),
          method: 'get',
          params: this.$http.adornParams({
            purchaseOrderId: this.dataForm.purchaseOrderId
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('purchase.order.purchaseOrderTemplate')
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      })
    },
    getInboundUpload () {
      this.uploadVisible = true
      this.modelUrl = '/purchase/order/inbound/export?purchaseOrderId=' + this.dataForm.purchaseOrderId + '&t=' + new Date().getTime()
      this.uploadUrl = '/purchase/order/inbound/exportExcel/' + this.dataForm.purchaseOrderId
      this.templateName = this.$t('purchase.order.purchaseOrderTemplate')
      this.$nextTick(() => {
        this.$refs.excelUpload.init()
      })
    },
    // 导入采购入库商品回调
    inboundRefreshDataList (data) {
      if (data.data) {
        const ids = []
        const list = JSON.parse(data.data)
        list.forEach(item => {
          item.alreadyStock = item.actualStock
          item.alreadyStock = item.purchaseStock - item.remainingStock
          item.purchaseAmount = new Big(item.purchasePrice).times(item.actualStock ? item.actualStock : 0)
          ids.push(item.purchaseProdId)
        })
        for (var i = 0; i < this.prods.length; i++) {
          const item = this.prods[i]
          let index = ids.indexOf(item.purchaseProdId)
          if (index !== -1) {
            this.$set(this.prods, i, list[index])
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
    margin-right: 10px;
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
