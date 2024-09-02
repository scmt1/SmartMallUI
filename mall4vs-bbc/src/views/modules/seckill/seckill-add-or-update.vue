<template>
  <div>
    <el-dialog
      :title="
        !dataForm.seckillId
          ? this.$i18n.t('crud.addTitle')
          : this.$i18n.t('live.view')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="lang === 'en'?'190px':'80px'"
      >
        <el-form-item :label="this.$i18n.t('group.actName')" prop="seckillName">
          <el-input
            v-model.trim="dataForm.seckillName"
            style="width: 200px"
            maxlength="36"
            show-word-limit
            :disabled="!!dataForm.seckillId"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('marketing.activTime')"
          prop="dateRange"
        >
          <el-date-picker
            v-model="dataForm.dateRange"
            type="datetimerange"
            :range-separator="this.$i18n.t('time.tip')"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="this.$i18n.t('time.start')"
            :end-placeholder="this.$i18n.t('time.end')"
            :disabled="!!dataForm.seckillId"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item :label="this.$i18n.t('seckill.')活动标签" prop="seckillTag">
          <el-input
            v-model="dataForm.seckillTag"
            style="width:200px"
            :disabled="!!dataForm.seckillId"
          ></el-input>
        </el-form-item>-->
        <el-form-item
          :label="this.$i18n.t('seckill.purcPerPerson')"
          prop="maxNum"
        >
          <el-checkbox
            v-model="hasMaxNum"
            @click="handlerChangeMaxNum"
            :disabled="!!dataForm.seckillId"
            >{{ $t("seckill.openPurchaseLimit") }}</el-checkbox
          >
          <span v-show="hasMaxNum">
            {{ $t("seckill.canBePurcPer") }}
            <el-input-number
              v-model="dataForm.maxNum"
              controls-position="right"
              :min="1"
              :max="1000"
              size="mini"
              style="width: 100px"
              :disabled="!!dataForm.seckillId"
            ></el-input-number
            >{{ $t("marketing.item") }}
          </span>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('seckill.cancelTheOrder')"
          prop="maxCancelTime"
        >
          {{ $t("order.buyer") }}&nbsp;
          <el-input-number
            v-model="dataForm.maxCancelTime"
            :min="2"
            :max="15"
            controls-position="right"
            size="mini"
            style="width: 100px"
            :disabled="!!dataForm.seckillId"
          ></el-input-number
          >&nbsp;&nbsp;{{ $t("seckill.unpaidnutes") }}
        </el-form-item>
        <el-form-item :label="this.$i18n.t('home.product')">
          <el-button
            plain
            @click="prodsSelectHandle()"
            style="float: left"
            v-if="!dataForm.seckillId"
            >{{ $t("product.select") }}</el-button
          >
          <el-alert
            :title="this.$i18n.t('seckill.warning')"
            type="warning"
            :closable="false"
            style="width: 295px; float: left; height: 40px; margin-left: 10px"
          ></el-alert>
        </el-form-item>
        <el-form-item>
          <el-card
            :body-style="{ padding: '0px' }"
            style="height: 160px; width: 120px"
            v-if="prod != null"
          >
            <img :src="prod.pic" style="height: 104px; width: 100%" />
            <div class="card-prod-bottom"
            v-if="!this.dataForm.seckillId"
            >
              <span class="card-prod-name">{{ prod.prodName }}</span>
              <el-button
                type="text"
                class="card-prod-name-button"
                @click="deleteProd"
                >{{ $t("text.delBtn") }}</el-button
              >
            </div>
          </el-card>
        </el-form-item>
        <el-form-item v-if="skuList.length">
          <!--      批量设置-->
          <div>
            <!-- <el-button
              type="text"
              icon="el-icon-document-checked"
              size="small"
              @click="switchSet"
            >{{$t("groups.batchSettings")}}</el-button> -->
            <el-form :inline="true" class="demo-form-inline" v-if="isEdit">
              <el-form-item :label="this.$i18n.t('product.eventPrice')">
                <el-input-number v-model="dataForm.price"
                                 controls-position="right"
                                 size="small"
                                 :precision="2"
                                 :max="1000000000"
                                 :min="0"
                ></el-input-number>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('marketing.activeInventory')">
                <el-input-number v-model="dataForm.stocks"
                                 controls-position="right"
                                 :disabled="isCompose == 1"
                                 size="small"
                                 :precision="0"
                                 :max="9999999"
                                 :min="0"
                ></el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="batchSet" class="filter-submitBtn">{{$t("crud.filter.submitBtn")}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="switchSet" class="filter-submitBtn">{{$t("crud.filter.cancelBtn")}}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            v-if="skuList.length"
            :data="skuList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column
              prop="prodName"
              :label="this.$i18n.t('product.prodName')"
              width="250"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="this.$i18n.t('product.eventPrice')"
              :width="lang === 'en'? '251' : '201'"
            >
              <template slot-scope="scope">
                <el-input-number
                  :precision="2"
                  :step="0.01"
                  :min="0.01"
                  :max="scope.row.price"
                  v-model="scope.row.seckillPrice"
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                ></el-input-number>
                <div>{{ $t("seckill.price") }}{{ scope.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="stocks"
              :label="this.$i18n.t('marketing.activeInventory')"
              width="201"
            >
              <template slot-scope="scope">
                <el-input-number
                  type="number"
                  v-model="scope.row.seckillStocks"
                  :min="0"
                  :max=9999999
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                ></el-input-number>
                <div>{{ $t("seckill.exisocks") }}{{ scope.row.stocks }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="!dataForm.seckillId?this.$i18n.t('text.menu'):this.$i18n.t('product.status')">
              <template slot-scope="scope">
                <div v-if="!dataForm.seckillId">
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-if="scope.row.status"
                  >{{ $t("publics.disable") }}
                  </el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-else
                  >{{ $t("shop.ena") }}</el-button
                >
                </div>
                <div v-else>
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-if="!scope.row.seckillPrice"
                  >{{ $t("publics.disable") }}
                  </el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-else
                  >{{ $t("shop.ena") }}</el-button
                >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div @click="visible = false" class="default-btn">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div
          type="primary"
          class="default-btn primary-btn"
          :class="[!!dataForm.seckillId?'disabled-btn':'','default-btn primary-btn']"
          @click="dataFormSubmit(!!dataForm.seckillId)"
          >{{ $t("crud.filter.submitBtn") }}</div
        >
      </span>
    </el-dialog>
    <!-- 商品选择弹窗 -->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      :prodType="0"
      @refreshSelectProds="selectSeckillProd"
    ></prods-select>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
export default {
  data () {
    var validatorDateRange = (rule, value, callback) => {
      if (!this.dataForm.dateRange || !this.dataForm.dateRange[0] || !this.dataForm.dateRange[1]) {
        callback(new Error(this.$i18n.t('seckill.pleaheyTime')))
      }
      if (!this.dataForm.seckillId && new Date() > Date.parse(this.dataForm.dateRange[1])) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      prodsSelectVisible: false,
      hasMaxNum: false,
      isEdit: false,
      lang: localStorage.getItem('lang'),
      dataForm: {
        dateRange: [],
        seckillId: null,
        seckillName: null,
        startTime: null,
        endTime: null,
        seckillTag: null,
        maxNum: 1,
        hasMaxNum: false,
        maxCancelTime: 2,
        price: null,
        stocks: null
      },
      prod: null,
      skuList: [],
      isError: false,
      value: '',
      dataRule: {
        startTime: [
          { required: true, message: this.$i18n.t('seckill.timeCanEmpty'), trigger: 'blur' }
        ],
        seckillName: [
          { required: true, message: this.$i18n.t('seckill.evenBeEmpty'), trigger: 'blur' }
        ],
        maxCancelTime: [
          { required: true, message: this.$i18n.t('seckill.theOrionEmpty'), trigger: 'blur' }
        ],
        dateRange: [
          { required: true, validator: validatorDateRange, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ProdsSelect
  },
  methods: {
    init (seckillId) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.prod = null
        this.skuList = []
        this.dataForm.seckillId = seckillId || 0
        this.hasMaxNum = false
        if (this.dataForm.seckillId) {
          this.$http({
            url: this.$http.adornUrl('/seckill/seckill/info/' + this.dataForm.seckillId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            data.seckill.dateRange = [data.seckill.startTime, data.seckill.endTime]
            this.dataForm = data.seckill
            // this.dataForm.hasMaxNum = !!data.seckill.hasMaxNum
            this.hasMaxNum = data.seckill.maxNum > 0
            this.prod = data.prod
            this.getSkuList(data.prod.prodId, data.seckillSkus)
          })
        }
      })
    },
    switchSet () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) {
        this.dataForm.price = 0
        this.dataForm.stocks = 0
      }
    },
    batchSet () {
      this.skuList.forEach(sku => {
        if (this.dataForm.price) {
          sku.seckillPrice = this.dataForm.price
        }
        if (this.dataForm.stocks) {
          sku.seckillStocks = this.dataForm.stocks
        }
      })
      this.isEdit = false
    },
    getSkuList (prodId, seckillSkus) {
      this.$http({
        url: this.$http.adornUrl('/sku/getAllSkuList'),
        method: 'get',
        params: this.$http.adornParams({
          prodId: prodId
        })
      }).then(({ data }) => {
        if (seckillSkus) {
          data.forEach(sku => {
            seckillSkus.forEach(seckillSku => {
              if (sku.skuId === seckillSku.skuId) {
                sku.seckillStocks = seckillSku.seckillStocks
                sku.seckillPrice = seckillSku.seckillPrice
              }
            })
          })
        }
        this.skuList = data
      })
    },
    /**
     * 判断sku中的商品价格与库存是否有填写
     */
    checkSku () {
      this.isError = false
      let disableNum = 0
      this.skuList.forEach(element => {
        if (!element.seckillPrice && element.status === 1) {
          this.isError = true
          this.value = this.$i18n.t('seckill.commoBeEmpty')
          return true
        }
        if (!element.seckillStocks && element.seckillStocks !== 0 && element.status === 1) {
          this.isError = true
          this.value = this.$i18n.t('seckill.commodiBeEmpty')
          return true
        }
        if (element.status === 0) {
          disableNum += 1
        }
      })
      if (disableNum === this.skuList.length) {
        this.isError = true
        this.value = this.$i18n.t('seckill.enableMustOne')
        return true
      }
    },
    // 表单提交
    dataFormSubmit (status) {
      if (status) {
        return
      }
      // 秒杀不能更新
      if (this.dataForm.seckillId) {
        this.visible = false
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.prod) {
            this.$message({
              message: this.$i18n.t('seckill.pleaSenProc'),
              type: 'error'
            })
            return
          }
          if (!this.hasMaxNum) {
            this.dataForm.maxNum = -1
          }
          // 判断sku中的商品价格与库存是否有填写
          this.checkSku()
          if (this.isError) {
            this.$message.error(this.value)
            return
          }
          this.dataForm.startTime = this.dataForm.dateRange[0]
          this.dataForm.endTime = this.dataForm.dateRange[1]
          this.dataForm.prodId = this.prod.prodId
          this.dataForm.seckillSkus = this.skuList.filter(sku => sku.status)

          let paramData = Object.assign({}, this.dataForm)
          paramData.hasMaxNum = this.hasMaxNum ? 1 : 0
          this.$http({
            url: this.$http.adornUrl('/seckill/seckill'),
            method: 'post',
            data: this.$http.adornData(paramData)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.discountProds)
      })
    },
    handlerChangeMaxNum (val) {
      if (val) {
        this.dataForm.maxNum = 1
      } else {
        this.dataForm.maxNum = -1
      }
    },
    // 添加指定商品
    selectSeckillProd (prods) {
      if (prods.length) {
        this.prod = prods[0]
        this.getSkuList(prods[0].prodId)
      } else {
        this.skuList = []
        this.prod = null
      }
    },
    deleteProd () {
      this.prod = null
      this.skuList = []
    },
    changeSkuStatus (tagIndex) {
      this.skuList[tagIndex].status = this.skuList[tagIndex].status ? 0 : 1
    }
  }
}
</script>

<style scoped>
>>>.is-success .el-input-number__decrease,
>>>.is-success .el-input-number__increase,
>>>.is-error .el-input-number__decrease,
>>>.is-error .el-input-number__increase {
  right: 1px !important;
}
>>>.el-date-editor .el-range-separator {
  width: 8%;
}
</style>
