<template>
  <div>
    <el-dialog
      :title="!dataForm.seckillId ? $t('seckill.newAdd') : $t('seckill.view')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="60%"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        :disabled="true"
        size="small"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="this.$i18n.t('language') === 'language' ? '180px' : '80px'"
      >
        <el-form-item :label="$t('seckill.activityName')" prop="seckillName">
          <el-input
            v-model="dataForm.seckillName"
            style="width: 460px; max-width:100%"
            :disabled="!!dataForm.seckillId"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('seckill.activityTimeRange')" prop="dateRange">
          <el-date-picker
            v-model="dataForm.dateRange"
            type="datetimerange"
            :range-separator="$t('coupon.to')"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="$t('date.start')"
            :end-placeholder="$t('date.end')"
            :disabled="!!dataForm.seckillId"
            style="width: 460px; max-width:100%"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item :label="$t('seckill.activityLabel')" prop="seckillTag">
          <el-input
            v-model="dataForm.seckillTag"
            style="width:200px"
            :disabled="!!dataForm.seckillId"
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('seckill.purchaseLimitPerPerson')" prop="maxNum">
          <el-checkbox
            v-model="dataForm.hasMaxNum"
            @click="handlerChangeMaxNum"
            :disabled="!!dataForm.seckillId"
          >{{$t('seckill.openPurchaseLimit')}}</el-checkbox>
          <span v-show="dataForm.hasMaxNum">
            {{$t('seckill.canBePurcPer')}}
            <el-input-number
              v-model="dataForm.maxNum"
              controls-position="right"
              :min="1"
              :max="1000"
              style="width:100px"
              :disabled="!!dataForm.seckillId"
            ></el-input-number>
            {{$t('seckill.item')}}
          </span>
        </el-form-item>
        <el-form-item :label="$t('seckill.orderCancel')" prop="maxCancelTime">
          {{$t('seckill.buyer')}}
          <el-input-number
            v-model="dataForm.maxCancelTime"
            :min="2"
            :max="15"
            controls-position="right"
            style="width:100px"
            :disabled="!!dataForm.seckillId"
          ></el-input-number>
          {{$t('seckill.buyerCancelTips')}}
        </el-form-item>
        <el-form-item :label="$t('seckill.commodity')">
          <el-button
            plain
            @click="prodsSelectHandle()"
            style="float:left"
            v-if="!dataForm.seckillId"
          >{{$t('coupon.selectGoods')}}</el-button>
          <el-alert
            :title="$t('seckill.alertSeckillTips')"
            type="warning"
            :closable="false"
            show-icon
            style="display: inline;"
          ></el-alert>
        </el-form-item>
        <el-form-item>
          <el-card
            :body-style="{ padding: '0px' }"
            style="height: 160px;width: 120px"
            v-if="prod != null"
          >
            <prod-pic
              height="104px"
              width="100%"
              :pic="prod.pic"
            ></prod-pic>
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{prod.prodName}}</span>
              <el-button
                v-if="prod.status === -1"
                type="text"
                class="card-prod-name-button"
                @click="deleteProd"
              >{{$t('seckill.productHasBeenDeleted')}}</el-button>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item v-if="skuList.length">
          <el-table :data="skuList" header-cell-class-name="table-header" row-class-name="table-row">
            <el-table-column prop="prodName" :label="$t('product.prodName')" width="320">
              <template slot-scope="scope">{{scope.row.prodName}}</template>
            </el-table-column>
            <el-table-column prop="price" :label="$t('seckill.eventPrice')" :width="this.$i18n.t('language') === 'language' ? '241' : '201'">
              <template slot-scope="scope">
                <el-input-number
                  size="small"
                  :precision="2"
                  :step="0.01"
                  :min="0.01"
                  :max="scope.row.price"
                  v-model="scope.row.seckillPrice"
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                ></el-input-number>
                <div>{{$t('seckill.skuPrice')}} {{scope.row.price}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="stocks" :label="$t('seckill.activeInventory')" width="201">
              <template slot-scope="scope">
                <el-input-number
                  size="small"
                  type="number"
                  v-model="scope.row.seckillStocks"
                  :min="0"
                  :disabled="!!(!scope.row.status || dataForm.seckillId)"
                ></el-input-number>
                <div>{{$t('seckill.skuInventory')}} {{scope.row.stocks}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="small"
                           @click="changeSkuStatus(`${scope.$index}`)"
                           v-if="scope.row.status">禁用</el-button>
                <el-button type="text"
                           size="small"
                           @click="changeSkuStatus(`${scope.$index}`)"
                           v-else>启用</el-button>
              </template>
            </el-table-column>-->
            <el-table-column :label="$t('publics.status')">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.seckillPrice"
                >{{$t('groups.startUsing')}}</el-button>
                <el-button type="text" size="small" v-else>{{$t('publics.disable')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="visible = false">{{$t('coupon.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 商品选择弹窗-->
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
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    return {
      visible: false,
      prodsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
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
        maxCancelTime: 2
      },
      prod: null,
      skuList: [],
      dataRule: {
        startTime: [
          { required: true, message: '时间不可为空', trigger: 'blur' }
        ],
        seckillName: [
          { required: true, message: '活动名称不可为空', trigger: 'blur' }
        ],
        maxCancelTime: [
          { required: true, message: '订单取消时间不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ProdsSelect,
    ProdPic
  },
  methods: {
    init (seckillId) {
      this.dataForm.seckillId = seckillId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.prod = null
        this.skuList = []
        if (this.dataForm.seckillId) {
          this.$http({
            url: this.$http.adornUrl('/platform/seckill/info/' + this.dataForm.seckillId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            data.seckill.dateRange = [data.seckill.startTime, data.seckill.endTime]
            this.dataForm = data.seckill
            this.dataForm.hasMaxNum = data.seckill.maxNum > 0
            this.prod = data.prod
            this.getSkuList(data.prod.prodId, data.seckillSkus)
          })
        }
      })
    },
    getSkuList (prodId, seckillSkus) {
      this.$http({
        url: this.$http.adornUrl('/platform/sku/getAllSkuList'),
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
    // 表单提交
    dataFormSubmit () {
      // 秒杀不能更新
      if (this.dataForm.seckillId) {
        this.visible = false
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.prod) {
            this.$message({
              message: '请选择活动商品',
              type: 'error'
            })
            return
          }
          if (!this.dataForm.hasMaxNum) {
            this.dataForm.maxNum = -1
          }
          this.dataForm.startTime = this.dataForm.dateRange[0]
          this.dataForm.endTime = this.dataForm.dateRange[1]
          this.dataForm.prodId = this.prod.prodId
          this.dataForm.seckillSkus = this.skuList.filter(sku => sku.status)

          this.$http({
            url: this.$http.adornUrl('/seckill/seckill'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
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
      if (prods) {
        this.prod = prods[0]
        this.getSkuList(prods[0].prodId)
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
