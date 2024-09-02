<template>
  <el-dialog
    class="mod-coupon-add-or-update"
    :title="
      dataForm.couponId
        ? this.$i18n.t('marketing.modifyCoupon')
        : this.$i18n.t('marketing.newCoupon')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item
        :label="this.$i18n.t('marketing.couponName')"
        prop="couponName"
      >
        <el-input
          v-model="dataForm.couponName"
          maxlength="20"
          show-word-limit
          :placeholder="this.$i18n.t('marketing.couponName')"
          :disabled="dataForm.couponId !== 0"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.couponSubtitle')"
        prop="subTitle"
      >
        <el-input
          v-model="dataForm.subTitle"
          :placeholder="this.$i18n.t('marketing.couponSubtitle')"
          :disabled="dataForm.couponId !== 0"
          maxlength="32"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('coupon.launchStatus')"
        size="mini"
        prop="putonStatus"
      >
        <el-radio-group v-model="dataForm.putonStatus" :disabled="dataForm.putonStatus < 0">
          <el-radio :label="0">{{ $t("coupon.waitAutoLaunch") }}
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">{{ $t("coupon.launchTip")}}</div>
              <span>
               <i class="el-icon-question"></i>
              </span>
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">{{ $t("coupon.launched") }}</el-radio>
          <el-radio :label="2">{{ $t("coupon.waitLaunch") }}</el-radio>
          <el-radio :disabled="true" :label="-1">{{ $t("coupon.cancelLaunch") }}
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">{{ $t("coupon.launchTip1")}}</div>
              <span>
               <i class="el-icon-question"></i>
              </span>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 投放时间 -->
      <el-form-item
        :label="this.$i18n.t('coupon.timeToMarket')"
        prop="launchTime"
        v-if="dataForm.putonStatus === 0"
      >
        <el-date-picker
          v-model="dataForm.launchTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="this.$i18n.t('coupon.chooseLaunchTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('coupon.couponType')"
        size="mini"
        prop="couponType"
      >
        <el-radio-group
          v-model="dataForm.couponType"
          :disabled="dataForm.couponId !== 0"
        >
          <el-radio :label="1">{{ $t("coupon.voucher") }}</el-radio>
          <el-radio :label="2">{{ $t("coupon.discountCoupon") }}</el-radio>
            <el-radio :label="4">团购券</el-radio>
          <!-- <el-radio :label="3">兑换券</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.conditionsOfUse')"
        prop="cashCondition"
      >
        {{ $t("marketing.fullConsumption") }}
        <el-input
          v-model="dataForm.cashCondition"
          :placeholder="this.$i18n.t('marketing.conditionsOfUse')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t("admin.dollar") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.reductionAmount')"
        prop="reduceAmount"
        v-if="dataForm.couponType === 1"
      >
        <el-input
          v-model="dataForm.reduceAmount"
          :placeholder="this.$i18n.t('marketing.reductionAmount')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t("admin.dollar") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.discountAmount')"
        prop="couponDiscount"
        v-if="dataForm.couponType === 2"
      >
        <el-input
          v-model="dataForm.couponDiscount"
          :placeholder="this.$i18n.t('marketing.pleaseEnterDiscount')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t("marketing.fold") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('coupon.effectiveType')"
        np
        size="mini"
        prop="validTimeType"
      >
        <el-radio-group
          v-model="dataForm.validTimeType"
          :disabled="dataForm.couponId !== 0"
        >
          <el-radio :label="1">{{ $t("marketing.fixedTime") }}</el-radio>
          <el-radio :label="2">{{ $t("marketing.effectiveAfterReceipt") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 固定时间数据 START -->
      <div v-if="dataForm.validTimeType === 1">
        <el-form-item
          :label="this.$i18n.t('coupon.startTime')"
          prop="startTime"
          v-if="dataForm.validTimeType === 1"
        >
          <el-date-picker
            :disabled="dataForm.couponId !== 0"
            v-model="dataForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="this.$i18n.t('marketing.chooseStartTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('coupon.endTime')"
          prop="endTime"
          v-if="dataForm.validTimeType === 1"
        >
          <el-date-picker
            v-model="dataForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="this.$i18n.t('marketing.chooseEndTime')"
          ></el-date-picker>
        </el-form-item>
      </div>
      <!-- 固定时间数据 END -->
      <!-- 领取后生效数据 START -->
      <el-form-item
        :label="this.$i18n.t('marketing.afterReceivingTheCoupon')"
        prop="afterReceiveDays"
        v-if="dataForm.validTimeType === 2">
        <el-input
          v-model="dataForm.afterReceiveDays"
          type="number"
          oninput="if(value>3652)value=1"
          :max="3652"
          :disabled="dataForm.couponId !== 0">
          <template slot="append">{{ $t("marketing.effectiveDays") }}</template>
        </el-input>
        <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.validDate')"
        prop="validDays"
        v-if="dataForm.validTimeType === 2">
        <el-input
          v-model="dataForm.validDays"
          type="number"
          oninput="if(value>3652)value=1"
          :max="3652"
          :disabled="dataForm.couponId !== 0">
          <template slot="append">{{ $t("form.day") }}</template>
        </el-input>
        <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-form-item>
      <!-- 领取后生效数据 END -->
      <el-form-item
        :label="this.$i18n.t('marketing.perPerson')"
        prop="limitNum"
      >
        <el-input v-model="dataForm.limitNum" type="number">
          <template slot="append">{{ $t("marketing.piece") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('marketing.inventory')" prop="stocks">
        <el-input
          v-model="dataForm.stocks"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t("marketing.piece") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.applicableGoods')"
        size="mini"
        prop="suitableProdType"
      >
        <el-radio-group v-model="dataForm.suitableProdType">
          <el-radio :label="0">{{ $t("marketing.allProdsPar") }}</el-radio>
          <el-radio :label="1">{{ $t("marketing.participateInD") }}</el-radio>
          <el-radio :label="2">{{ $t("marketing.specifiedProduct") }}</el-radio>
        </el-radio-group>
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
      <el-form-item style="width: 100%" v-if="dataForm.suitableProdType !== 0">
        <el-row>
          <el-col
            v-for="(couponProd, index) in dataForm.couponProds"
            :key="index"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <img :src="couponProd.pic" style="height: 104px; width: 100%" />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ couponProd.prodName }}</span>
                <el-button
                  type="text"
                  class="card-prod-name-button"
                  @click="deleteProd(index)"
                  >{{ $t("text.delBtn") }}</el-button
                >
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("crud.filter.submitBtn")
      }}</div>
    </span>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      @refreshSelectProds="selectCouponProds"
    ></prods-select>
  </el-dialog>
</template>

<script>
import ProdsSelect from '@/components/prods-select'

export default {
  data () {
    var validate = (rule, value, callback) => {
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$i18n.t('live.pleaseEnteThan0')))
      } else if (value >= 10000000000000) {
        callback(new Error(this.$i18n.t('live.numberLimit')))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('formData.pleaseThan0')))
      } else if (value >= 2147483600) {
        callback(new Error(this.$i18n.t('formData.stockLimit')))
      } else {
        callback()
      }
    }
    var validateStocks = (rule, value, callback) => {
      if (value === 0 && this.dataForm.couponId) {
        callback()
      } else if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('formData.pleaseThan0')))
      } else if (value >= 2147483600) {
        callback(new Error(this.$i18n.t('formData.stockLimit')))
      } else {
        callback()
      }
    }
    var validateeDays = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('marketing.pleaseaTo0')))
      } else {
        callback()
      }
    }
    var validateeOneDays = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('marketing.pleaseaTo1')))
      } else {
        callback()
      }
    }
    var discountValidate = (rule, value, callback) => {
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$i18n.t('marketing.pleaseTo10')))
      } else if (parseInt(value) >= 10 || parseInt(value) < 0) {
        callback(new Error(this.$i18n.t('marketing.pleaseTo10')))
      } else {
        callback()
      }
    }
    var validateTime = (rule, value, callback) => {
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('marketing.timeCanThanOrEqualTo')))
      }
      // if (this.dataForm.couponId === 0 && rule.field === 'startTime' && new Date() > Date.parse(value)) {
      //   callback(new Error(this.$i18n.t('groups.activityTimeTime')))
      // }
      if (this.dataForm.couponId === 0 && rule.field === 'endTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      } else {
        callback()
      }
    }
    var validateLaunchTime = (rule, value, callback) => {
      if (this.dataForm.putonStatus === 0 && Date.parse(this.dataForm.launchTime) <= Date.now()) {
        callback(new Error(this.$i18n.t('coupon.launchTimeTip')))
      }
    }
    return {
      visible: false,
      dataForm: {
        couponId: 0,
        couponName: '',
        subTitle: '',
        couponType: 1,
        reduceAmount: 0,
        couponDiscount: 0,
        cashCondition: 0,
        validTimeType: 1,
        launchTime: null,
        startTime: null,
        endTime: null,
        afterReceiveDays: 0,
        validDays: 1,
        stocks: 1,
        suitableProdType: 0,
        limitNum: 1,
        putonStatus: 0,
        couponProds: []
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      errorTip: false,
      dataListSelections: [],
      prodsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        couponName: [
          { required: true, message: this.$i18n.t('marketing.couponNameCannotBeEmpty'), trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: this.$i18n.t('marketing.couponTypeCannotBeEmpty'), trigger: 'blur' }
        ],
        reduceAmount: [
          { required: true, message: this.$i18n.t('marketing.theDedEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        limitNum: [
          { required: true, message: this.$i18n.t('marketing.theLimitetBeEmpty'), trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        afterReceiveDays: [
          { required: true, message: this.$i18n.t('marketing.collectioeEmpty'), trigger: 'blur' },
          { validator: validateeDays, trigger: 'blur' }
        ],
        validDays: [
          { required: true, message: this.$i18n.t('marketing.effectiveEmpty'), trigger: 'blur' },
          { validator: validateeOneDays, trigger: 'blur' }
        ],
        couponDiscount: [
          { required: true, message: this.$i18n.t('marketing.theDiscouBeEmpty'), trigger: 'blur' },
          { validator: discountValidate, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('formData.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        cashCondition: [
          { required: true, message: this.$i18n.t('marketing.conditionBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        validTimeType: [
          { required: true, message: this.$i18n.t('marketing.effectiveotBeEmpty'), trigger: 'blur' }
        ],
        stocks: [
          { required: true, message: this.$i18n.t('marketing.invenEmpty'), trigger: 'blur' },
          { validator: validateStocks, trigger: 'blur' }
        ],
        suitableProdType: [
          { required: true, message: this.$i18n.t('marketing.applicabltBeEmpty'), trigger: 'blur' }
        ],
        launchTime: [
          { required: true, message: this.$i18n.t('coupon.launchTimeTip1'), trigger: 'blur' },
          { validator: validateLaunchTime, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ProdsSelect
  },
  watch: {
    visible: function () {
      if (this.visible === false) {
        this.prodsSelectVisible = false
      }
    }
  },
  methods: {
    // 获取数据列表
    init (couponId) {
      this.dataForm.couponId = couponId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.couponId) {
        this.getDataList()
      }
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/admin/coupon/info/${this.dataForm.couponId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      })
    },
    // 选择点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedProd) => {
          if (!selectedProd) {
            return false
          }
          return selectedProd.prodId === tableItem.prodId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
    },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.couponProds)
      })
    },
    // 删除指定商品
    deleteProd (index) {
      this.dataForm.couponProds.splice(index, 1)
    },
    // 添加指定商品
    selectCouponProds (prods) {
      if (prods) {
        this.dataForm.couponProds = prods
      }
    },
    // 表单提交
    dataFormSubmit () {
      if (this.errorTip) {
        this.$message({
          message: this.$i18n.t('marketing.quantitssThan0'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.couponType === 1 && (parseFloat(this.dataForm.cashCondition) <= parseFloat(this.dataForm.reduceAmount))) {
            this.$message.error(this.$i18n.t('marketing.amounnCannotBe'))
            return false
          }
          this.$http({
            url: this.$http.adornUrl(`/admin/coupon`),
            method: this.dataForm.couponId ? 'put' : 'post',
            data: this.$http.adornData({
              'couponId': this.dataForm.couponId || undefined,
              'couponName': this.dataForm.couponName,
              'subTitle': this.dataForm.subTitle,
              'couponType': this.dataForm.couponType,
              'reduceAmount': this.dataForm.reduceAmount,
              'couponDiscount': this.dataForm.couponDiscount,
              'cashCondition': this.dataForm.cashCondition,
              'validTimeType': this.dataForm.validTimeType,
              'launchTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchTime : null,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'afterReceiveDays': this.dataForm.afterReceiveDays,
              'validDays': this.dataForm.validDays,
              'stocks': this.dataForm.stocks,
              'suitableProdType': this.dataForm.suitableProdType,
              'limitNum': this.dataForm.limitNum,
              'putonStatus': this.dataForm.putonStatus,
              'couponProds': this.dataForm.couponProds
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataForm.couponProds = []
                this.$emit('refreshDataList', this.page)
                this.visible = false
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.mod-coupon-add-or-update {
  .el-col{
    width: 130px;
  }
}
</style>
