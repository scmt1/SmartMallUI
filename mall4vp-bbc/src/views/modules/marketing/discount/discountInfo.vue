<template>
  <div class="mod-discountInfo">
    <el-dialog
      :title="this.$i18n.t('groups.activityDetails')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="950px"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        :disabled="true"
        :label-width="
          this.$i18n.t('language') === 'language' ? '180px' : '120px'
        "
        size="small"
        style="width: 850px"
      >
        <el-form-item
          :label="$t('seckill.activityName')"
          prop="discountName"
          :rules="[{ required: true, message: $t('publics.noNull') }]"
        >
          <el-input
            v-model="dataForm.discountName"
            :placeholder="$t('seckill.activityName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('seckill.activityTimeRange')" class="tableEn">
          <el-col :span="8">
            <el-form-item
              prop="startTime"
              :rules="[{ required: true, message: $t('publics.noNull') }]"
            >
              <el-date-picker
                v-model="dataForm.startTime"
                type="datetime"
                :placeholder="$t('discount.chooseStartDate')"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" :class="[$t('language')=='language'?'timeLine':'']">-</el-col>
          <el-col :span="8">
            <el-form-item
              prop="endTime"
              :rules="[{ required: true, message: $t('publics.noNull') }]"
            >
              <el-date-picker
                v-model="dataForm.endTime"
                type="datetime"
                :placeholder="$t('discount.chooseEndDate')"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('marketing.typeOfActivity')" size="mini" prop="discountRule">
          <el-radio-group v-model="dataForm.discountRule">
            <el-radio :label="0">{{ $t("marketing.fullMoneoney") }}</el-radio>
            <!-- <el-radio :label="1">{{
              $t("marketing.fullPieceReduceMoney")
            }}</el-radio> -->
            <el-radio :label="2">{{
              $t("marketing.fullMoneyDiscount")
            }}</el-radio>
            <el-radio :label="3">{{ $t("marketing.fullDiscount") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('marketing.typeOfExemption')"
          size="mini"
          prop="discountType"
          v-if="dataForm.discountRule === 0 || dataForm.discountRule === 1"
        >
          <el-radio-group
            v-model="dataForm.discountType"
            @change="discountTypeChange"
          >
            <el-radio :label="0">{{
              $t("marketing.decreaseOestLevel")
            }}</el-radio>
            <el-radio :label="1">{{ $t("marketing.decreaeryTime") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('marketing.maximumDiscountAmount')"
          prop="maxReduceAmount"
          :rules="[{ required: true, message: $t('publics.noNull') }]"
        >
          <el-input
            v-model="dataForm.maxReduceAmount"
            :placeholder="$t('marketing.maximumDiscountAmount')"
          ></el-input>
        </el-form-item>
        <!-- 卡片 START -->
        <el-form-item :label="$t('marketing.offerContent')">
          <el-card
            class="box-card"
            v-for="(discountItem, index) in dataForm.discountItems"
            :key="discountItem.discountItemId"
            style="margin-bottom: 30px"
          >
            <div slot="header" class="clearfix" v-if="!dataForm.discountType">
              <span>{{ $t("marketing.activityLevel") }} {{ index + 1 }}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="deleteActivityClass(index)"
                v-if="dataForm.discountItems.length > 1"
                >{{ $t("brand.delete") }}</el-button
              >
            </div>
            <!-- 条件 -->
            <el-form-item
              class="text item"
              :label="$t('common.condition')"
              style="margin-bottom: 20px"
              :rules="[{ required: true, message: $t('publics.noNull') }]"
            >
              {{ $t("marketing.everyFull") }}
              <el-input
                size="small"
                v-model="discountItem.needAmount"
                style="width: 200px"
              >
                <template slot="append">{{ discountItemTexts[0] }}</template>
              </el-input>
              <!-- <el-button type="text" disabled>{{
                $t("marketing.geZeroTips")
              }}</el-button> -->
            </el-form-item>
            <el-form-item
              class="text item"
              :label="$t('marketing.discount')"
              :rules="[{ required: true, message: $t('publics.noNull') }]"
            >
            <span v-if="dataForm.discountRule < 2"
              >&nbsp;&nbsp;&nbsp;&nbsp;{{ $t("marketing.reducea") }}</span
            >
            <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t("marketing.dozen") }}</span>
              <el-input
                size="small"
                v-model="discountItem.discount"
                style="width: 200px"
              >
                <template slot="append">{{ discountItemTexts[1] }}</template>
              </el-input>
              <!-- <el-button type="text" disabled>{{
                $t("marketing.gtZeroTips")
              }}</el-button> -->
            </el-form-item>
          </el-card>
        </el-form-item>
        <!-- 卡片 END -->
        <!-- <el-form-item>
          <el-button
            plain
            @click="addActivityClass()"
            v-if="!dataForm.discountType"
            >{{ $t("marketing.addActivity") }}</el-button
          >
        </el-form-item> -->
        <el-form-item
          :label="$t('marketing.applicableProductType')"
          size="mini"
          prop="suitableProdType"
          :rules="[{ required: true, message: $t('publics.noNull') }]"
        >
          <el-radio-group v-model="dataForm.suitableProdType">
            <el-radio :label="0">{{
              $t("coupon.allProductsParticipate")
            }}</el-radio>
            <el-radio :label="1">{{
              $t("coupon.participateInDesignatedProd")
            }}</el-radio>
            <el-radio :label="2">{{
              $t("coupon.specifiedProductsDoNotParticipate")
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.suitableProdType !== 0"
        >
          <div class="prod-box">
            <div
              v-for="(discountProd, index) in dataForm.discountProds"
              :key="index"
              class="prod-box-item"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                style="height: 160px; width: 120px"
              >
                <prod-pic
                  height="104px"
                  width="100%"
                  :pic="discountProd.pic"
                ></prod-pic>
                <div class="card-prod-bottom">
                  <span class="card-prod-name">{{
                    discountProd.prodName
                  }}</span>
                  <el-button
                    type="text"
                    class="card-prod-name-button"
                    @click="deleteProd(index)"
                    >{{ $t("remindPop.delete") }}</el-button
                  >
                </div>
              </el-card>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            plain
            v-if="
              dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2
            "
            @click="prodsSelectHandle()"
            >{{ $t("product.select") }}</el-button
          >
        </el-form-item>
        <!-- 商品 -->
        <el-form-item :label="$t('product.status')" size="mini" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="1">{{ $t("seckill.open") }}</el-radio>
            <el-radio :label="0">{{ $t("seckill.close") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="mini"
        @click="closeTag()">取消</el-button>-->
        <div class="default-btn primary-btn"  @click="visible = false">{{
          $t("remindPop.confirm")
        }}</div>
      </span>
      <!-- 商品选择弹窗-->
      <prods-select
        v-if="prodsSelectVisible"
        ref="prodsSelect"
        @refreshSelectProds="selectDiscountProds"
      ></prods-select>
    </el-dialog>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    return {
      dataForm: {
        discountId: 0,
        discountName: '',
        discountRule: 0,
        discountType: 0,
        suitableProdType: 0,
        maxReduceAmount: 0,
        shopId: '',
        startTime: '',
        endTime: '',
        status: 0,
        discountItems: [],
        discountProds: []
      },
      visible: false,
      prodsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    ProdsSelect,
    ProdPic
  },
  computed: {
    discountItemTexts: function () {
      let texts = []
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 2) {
        texts[0] = this.$i18n.t('coupon.yuan')
      } else {
        texts[0] = this.$i18n.t('order.piece')
      }
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 1) {
        texts[1] = this.$i18n.t('coupon.yuan')
      } else {
        texts[1] = this.$i18n.t('marketing.fold')
      }
      return texts
    }
  },
  activated () {
  },
  watch: {
    'dataForm.discountRule': function (val) {
      if (val === 2 || val === 3) {
        this.dataForm.discountType = 0
      }
    }
  },
  methods: {
    init (discountId) {
      this.dataForm.discountId = discountId || null
      this.visible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        if (this.dataForm.discountId) {
          this.$http({
            url: this.$http.adornUrl(`/platform/discount/info/${this.dataForm.discountId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    getDataList () {
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.discountItems = [{}]
      })
      if (this.dataForm.discountId) {
        this.$http({
          url: this.$http.adornUrl(`/platform/discount/info/${this.dataForm.discountId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
        })
      }
    },
    // 添加活动层级
    addActivityClass () {
      this.dataForm.discountItems.push({})
    },
    // 删除活动层级
    deleteActivityClass (index) {
      this.dataForm.discountItems.splice(index, 1)
    },
    // 删除指定商品
    deleteProd (index) {
      this.dataForm.discountProds.splice(index, 1)
    },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.discountProds)
      })
    },
    // 添加指定商品
    selectDiscountProds (prods) {
      if (prods) {
        this.dataForm.discountProds = prods
      }
    },
    discountTypeChange () {
      this.dataForm.discountItems = [{}]
    }
  }
}
</script>

<style scoped>
.item ::v-deep .el-form-item__content {
  margin-left: 75px !important
}
.prod-box {
  /* width: 770px; */
  display: flex;
  flex-wrap: wrap;
}
.prod-box-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
.timeLine {
  margin-left: 19px !important;
}
</style>
