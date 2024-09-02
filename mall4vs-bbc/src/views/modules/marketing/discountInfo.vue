<template>
  <div class="mod-discountInfo">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.discountId
          ? this.$i18n.t('marketing.newDiscount')
          : this.$i18n.t('marketing.viewDiscount')
        }}
      </div>
    </div>
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto"
      class="form-box"
      size="small"
    >
      <el-form-item
        :label="this.$i18n.t('group.actName')+':'"
        prop="discountName"
      >
        <el-input
          v-model="dataForm.discountName"
          maxlength="50"
          show-word-limit
          style="width: 520px;padding-right:46px"
          :placeholder="this.$i18n.t('group.actName')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.mobiltyDiagram')+':'"
        prop="mobilePic"
      >
        <img-upload v-model="dataForm.mobilePic"></img-upload>
        <span style="color: #999999">{{ $t("pictureManager.imageSize") }}710*260，{{ $t("marketing.suggest1") }}</span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.pcActivityListChart')+':'"
        prop="pcPic"
      >
        <img-upload v-model="dataForm.pcPic"></img-upload>
        <span style="color: #999999">{{ $t("pictureManager.imageSize") }}590*240</span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.pcActiviroundMap')+':'"
        prop="pcBackgroundPic"
      >
        <img-upload v-model="dataForm.pcBackgroundPic"></img-upload>
        <span style="color: #999999">{{ $t("pictureManager.imageSize") }}1200*360</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('marketing.activTime')+':'">
          <div class="date-picker">
            <el-form-item ref="startTime" prop="startTime">
              <el-date-picker
                v-model="dataForm.startTime"
                type="datetime"
                :placeholder="this.$i18n.t('live.chooseStartDate')"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <span style="margin: 0 10px">-</span>
            <el-form-item ref="endTime" prop="endTime">
              <el-date-picker
                v-model="dataForm.endTime"
                type="datetime"
                :placeholder="this.$i18n.t('live.chooseEndDate')"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </div>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.typeOfActivity')+':'"
        prop="discountRule"
      >
        <el-radio-group
          v-model="dataForm.discountRule"
          @change="changeDiscountRule"
          :disabled="!!dataForm.discountId"
        >
          <el-radio :label="0">{{ $t("marketing.fullMoneoney") }}</el-radio>
          <!-- <el-radio :label="1">满件减钱</el-radio> -->
          <el-radio :label="2">{{
            $t("marketing.fullMoneyDiscount")
          }}</el-radio>
          <el-radio :label="3">{{ $t("marketing.fullDiscount") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('marketing.typeOfExemption')+':'"
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
      <!-- 卡片 START -->
      <el-form-item :label="$t('marketing.offerContent')+':'">
        <el-card
          class="box-card"
          shadow="never"
          v-for="(discountItem, index) in dataForm.discountItems"
          :key="discountItem.discountItemId"
        >
          <div slot="header" class="box-card-header" v-if="!dataForm.discountType">
            <span>{{ $t("marketing.activityLevel") }} {{ index + 1 }}</span>
            <div
              class="default-btn text-btn"
              @click="deleteActivityClass(index)"
              v-if="dataForm.discountItems.length > 1"
              >{{ $t("text.delBtn") }}</div
            >
          </div>
          <el-form-item
            :label="$t('marketing.conditionsOfUse')+':'"
            :label-width="$t('language') === 'English' ? '150px' : '100px' "
            :rules="[{ required: true, message: $t('publics.noNull') }]"
          >
            <el-input
              type="number"
              v-model="discountItem.needAmount"
              style="width: 200px"
              @change="checkNumber(index, 1)"
            >
              <template v-if="dataForm.discountType === 1" slot="prepend">{{ $t("marketing.everyFull") }}</template>
              <template v-else slot="prepend">{{ $t("marketing.full") }}</template>
              <template slot="append">{{ discountItemTexts[0] }}</template>
            </el-input>
            <div class="pleaseEnteThan"> {{ $t("formData.pleaseThan0") }}
             <el-tooltip
              class="item"
              effect="light"
              placement="top"
              v-if="dataForm.discountType === 0"
            >
              <div slot="content">{{ $t("marketing.conditionsOfUseIn") }}</div>
              <span>
                <i style="color: #000000" class="el-icon-question"></i>
              </span>
            </el-tooltip>
           </div>
          </el-form-item>
          <el-form-item
            :label="$t('marketing.discountedPrice')+':'"
            :rules="[{ required: true, message: $t('publics.noNull') }]"
            :label-width="$t('language') === 'English' ? '150px' : '100px' "
          >
            <el-input
              type="number"
              v-model="discountItem.discount"
              style="width: 200px"
              @change="checkNumber(index, 2)"
            >
              <template v-if="dataForm.discountRule < 2" slot="prepend">{{ $t("marketing.reducea") }}</template>
              <template v-else slot="prepend">{{ $t("marketing.dozen") }}</template>
              <template slot="append">{{ discountItemTexts[1] }}</template>
            </el-input>
            <div class="pleaseEnteThan">{{
              dataForm.discountRule < 2
                ? $t("marketing.pleaseThan0")
                : $t("marketing.pleaseEnterTheNumber010")
            }}</div>
          </el-form-item>
        </el-card>
      </el-form-item>
      <!-- 卡片 END -->
      <el-form-item>
        <div
          plain
          class="default-btn"
          @click="addActivityClass()"
          v-if="dataForm.discountType === 0"
          >{{ $t("addAct") }}</div
        >
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.maximumDiscountAmount')+':'"
        prop="maxReduceAmount"
        v-if="dataForm.discountRule >= 2 || dataForm.discountType !== 0"
      >
        <el-input
          type="number"
          style="width: 520px"
          v-model="dataForm.maxReduceAmount"
          :placeholder="this.$i18n.t('marketing.maximumDiscountAmount')"
          @change="maxReduceAmountChange"
          :max="9999999999999"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.applicableProductType')+':'"
        prop="suitableProdType"
        :rules="[{ required: true, message: $t('publics.noNull') }]"
      >
        <el-radio-group v-model="dataForm.suitableProdType">
          <el-radio :label="0">{{ $t("marketing.allProdsPar") }}</el-radio>
          <el-radio :label="1">{{ $t("marketing.participateInD") }}</el-radio>
          <el-radio :label="2">{{ $t("marketing.specifiedProduct") }}</el-radio>
        </el-radio-group>
        <div class="discount-tip">{{$t("marketing.discountTip")}}</div>
      </el-form-item>
      <!-- 适用商品类型 -->
      <el-form-item
        v-if="dataForm.suitableProdType !== 0 && dataForm.discountProds.length"
      >
        <div class="prod-card">
          <div
            v-for="(discountProd, index) in dataForm.discountProds"
            :key="index"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px; margin-bottom: 15px;margin-right: 10px;"
            >
              <!-- <img :src="discountProd.pic" style="height: 104px; width: 100%" /> -->
              <prod-pic
                height="104px"
                width="100%"
                :pic="discountProd.pic"
              ></prod-pic>
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ discountProd.prodName }}</span>
                <el-button
                  type="text"
                  class="card-prod-name-button"
                  @click="deleteProd(index)"
                  >{{ $t("text.delBtn") }}</el-button
                >
              </div>
            </el-card>
          </div>
        </div>
      </el-form-item>
      <!-- 选择商品按钮 -->
      <el-form-item  v-if="dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2">
        <div
          @click="prodsSelectHandle()"
          class="default-btn"
          >{{ $t("product.select") }}</div
        >
      </el-form-item>
      <!-- 商品 -->
      <el-form-item
        :label="this.$i18n.t('product.status')+':'"
        prop="status"
        v-if="dataForm.status === 1 || dataForm.status === 0"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{ $t("combo.open") }}</el-radio>
          <el-radio :label="0">{{ $t("station.close") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
          $t("crud.filter.submitBtn")
        }}</div>
        <div class="default-btn" @click="closeTag()">{{
          $t("crud.filter.cancelBtn")
        }}</div>
      </el-form-item>
    </el-form>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      @refreshSelectProds="selectDiscountProds"
    ></prods-select>
  </div>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    var validateTime = (rule, value, callback) => {
      // if (this.dataForm.discountId === 0 && rule.field === 'startTime' && new Date() > Date.parse(value)) {
      //   callback(new Error(this.$i18n.t('groups.activityTimeTime')))
      // }
      // if (this.dataForm.discountId !== 0 && this.dataForm.status === 1 && rule.field === 'startTime' && new Date() > Date.parse(value)) {
      //   callback(new Error(this.$i18n.t('groups.alterActivityTime')))
      // }
      if (this.dataForm.status === 1 && rule.field === 'endTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      }
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('product.dateErrTips1')))
      } else if (this.dataForm.status === 1 && this.dataForm.groupActivityId && Date.parse(this.validEndTime) > Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('groups.extendedEndTime')))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (!value || !value.trim()) {
        callback(new Error(this.$t('publics.noNull')))
      } else {
        callback()
      }
    }
    var validateAmount = (rule, value, callback) => {
      const reg = /^\d+(\.{0,2}\d+){0,2}$/
      if (!value || !reg.test(value)) {
        callback(new Error(this.$t('marketing.pleaseThan0')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        discountId: 0,
        discountName: '',
        mobilePic: '',
        pcPic: '',
        pcBackgroundPic: '',
        discountRule: 0,
        discountType: 0,
        suitableProdType: 0,
        maxReduceAmount: 0,
        shopId: '',
        startTime: '',
        endTime: '',
        status: 1,
        discountItems: [],
        discountProds: []
      },
      dataRule: {
        mobilePic: [
          { required: true, message: this.$i18n.t('marketing.pleaseUploadAPicture'), trigger: 'blur' }
        ],
        pcPic: [
          { required: true, message: this.$i18n.t('marketing.pleaseUploadAPicture'), trigger: 'blur' }
        ],
        pcBackgroundPic: [
          { required: true, message: this.$i18n.t('marketing.pleaseUploadAPicture'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('groups.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('groups.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        discountName: [
          { required: true, message: this.$t('publics.noNull'), trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        maxReduceAmount: [
          { required: true, message: this.$t('marketing.pleaseThan0'), trigger: 'blur' },
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      prodsSelectVisible: false,
      isTrue: false,
      errorValue: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      isSubmitting: false
    }
  },
  components: {
    ProdsSelect,
    ImgUpload,
    ProdPic
  },
  computed: {
    discountItemTexts: function () {
      let texts = []
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 2) {
        texts[0] = this.$i18n.t('admin.dollar')
      } else {
        texts[0] = this.$i18n.t('marketing.item')
      }
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 1) {
        texts[1] = this.$i18n.t('admin.dollar')
      } else {
        texts[1] = this.$i18n.t('marketing.fold')
      }
      return texts
    },
    newStartTime: function () {
      return JSON.parse(JSON.stringify(this.dataForm.startTime))
    },
    newEndTime: function () {
      return JSON.parse(JSON.stringify(this.dataForm.endTime))
    }
  },
  mounted () {
    // if (this.$route.query.discountId !== undefined) {
    //   sessionStorage.setItem('discountInfo-params', JSON.stringify(this.$route.query || '{}'))
    // }
    // let sessionStorageParams = JSON.parse(sessionStorage.getItem('discountInfo-params'))
    if (this.$route.query.discountId !== undefined) {
      this.dataForm.discountId = this.$route.query.discountId
    }
    this.getDataList()
    let title = this.dataForm.discountId ? this.$i18n.t('marketing.viewDiscount') : this.$i18n.t('marketing.newDiscount')
    this.$store.commit('common/replaceSelectMenu', title)
  },
  watch: {
    'dataForm.discountRule': function (val) {
      if (val === 2 || val === 3) {
        this.dataForm.discountType = 0
      }
    },
    newStartTime (newVal, oldVal) {
      this.$refs.endTime.clearValidate('endTime')
    },
    newEndTime (newVal, oldVal) {
      this.$refs.startTime.clearValidate('startTime')
    }
  },
  methods: {
    getDataList () {
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.discountItems = [{ needAmount: 1, discount: 0.01 }]
      })
      if (this.dataForm.discountId) {
        this.$http({
          url: this.$http.adornUrl(`/admin/discount/info/${this.dataForm.discountId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.dataForm.maxReduceAmount = Math.ceil(this.dataForm.maxReduceAmount)
        }).catch((error) => {
          console.log('err', error)
          this.$router.go(-1)
        })
      }
    },
    /**
     * 活动类型变化时，更新优惠内容的值
     */
    changeDiscountRule () {
      for (var i = 0; i < this.dataForm.discountItems.length; i++) {
        this.checkNumber(i, 1)
        this.checkNumber(i, 2)
      }
    },
    /**
     * 输入框的数据改变时，对值进行校验
     * type 1:验证needAmount(满足使用条件需要达到的金额） 2：验证discount（优惠金额）
     */
    checkNumber (index, type) {
      var discountItem = this.dataForm.discountItems[index]
      // item.needAmount <= item.discount
      if (type === 1) {
        if (discountItem.needAmount < 1) {
          discountItem.needAmount = 1
        }
        if (discountItem.needAmount > 99999999) {
          discountItem.needAmount = 99999999
        }
        discountItem.needAmount = Math.round(discountItem.needAmount)
      }
      if (type === 2) {
        // 如果小于最小值
        if (discountItem.discount > 99999999) {
          discountItem.discount = 99999999
        }
        if (discountItem.discount < 0.01 && this.dataForm.discountRule < 2) {
          discountItem.discount = 0.01
        }
        if (discountItem.discount < 0.1 && this.dataForm.discountRule >= 2) {
          discountItem.discount = 0.1
        }
        if (discountItem.discount >= 10 && this.dataForm.discountRule >= 2) {
          // 如果折扣大于10
          discountItem.discount = 9.9
        } else if (this.dataForm.discountRule < 2) {
          // 优惠金额保留两位小数
          discountItem.discount = parseFloat(discountItem.discount).toFixed(2)
        } else {
          // 保留一位小数
          discountItem.discount = parseFloat(discountItem.discount).toFixed(1)
          discountItem.discount = discountItem.discount >= 10 ? 9.9 : discountItem.discount
        }
      }
    },
    /**
     * 优惠金额上限校验
     */
    maxReduceAmountChange () {
      let maxReduceAmount = Math.round(this.dataForm.maxReduceAmount)
      this.dataForm.maxReduceAmount = maxReduceAmount < 1 ? 1 : maxReduceAmount > 9999999999999 ? 9999999999999 : maxReduceAmount
    },

    /**
     * 减免类型选择时，更新数据
     */
    discountTypeChange () {
      this.dataForm.discountItems = [this.dataForm.discountItems[0]]
    },
    // 添加活动层级
    addActivityClass () {
      if (this.dataForm.discountItems.length >= 5) {
        this.$message.error(this.$i18n.t('marketing.maxActivityLevelsTips'))
        return
      }
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
      this.prodsSelectVisible = false
      if (prods) {
        this.dataForm.discountProds = prods
      }
    },
    // 关闭当前标签页
    closeTag () {
      // this.$store.commit('common/removeMainActiveTab')
      this.$router.go(-1)
    },
    /**
     * 错误提示框
     */
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    },
    /**
     * 校验优惠内容是否正确
     */
    checkDiscountItems () {
      this.isTrue = false
      // if (this.dataForm.discountItems.length === 0) {
      //   this.isTrue = true
      //   this.errorValue = '活动项不能为空，最少要有一个活动项'
      //   return true
      // }
      var minAmount = this.dataForm.discountItems[0].discount
      var maxAmount = this.dataForm.discountItems[0].discount
      var amount = 0
      var prevDiscount = 0
      var index = 1
      this.dataForm.discountItems.forEach(item => {
        if (this.dataForm.discountType === 0 && item.needAmount <= amount) {
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.activityLevel') + index + this.$i18n.t('marketing.theConditierThan') + amount
          return true
        }
        // 限制层级高的优惠金额不得低于层级低的优惠金额
        if (this.dataForm.discountType === 0 &&
            this.dataForm.discountRule === 0 &&
            Number(item.discount) <= Number(prevDiscount)) {
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.activityLevel') + index + this.$i18n.t('marketing.theOfferAmountThan') + prevDiscount
          return true
        }
        // 限制层级高的优惠折扣不得低于层级低的优惠折扣(折扣越低优惠金额越大)
        if (this.dataForm.discountType === 0 &&
            this.dataForm.discountRule !== 0 &&
            Number(item.discount) >= Number(prevDiscount) &&
            Number(prevDiscount) !== 0) {
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.activityLevel') + index + this.$i18n.t('marketing.theOfferDiscountThan') + prevDiscount
          return true
        }
        amount = item.needAmount
        prevDiscount = item.discount
        index = index + 1
        if (this.dataForm.discountRule === 0) {
          if (item.needAmount <= item.discount) {
            this.isTrue = true
            this.errorValue = this.$i18n.t('marketing.activimount')
            return true
          }
        }
        if (!item.needAmount) {
          console.log('item.needAmount', item)
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.activitytBeEmpty')
          return true
        }
        if (!item.discount) {
          console.log('item.discount', item)
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.promotioBeEmpty')
          return true
        }
        minAmount = item.discount < minAmount ? item.discount : minAmount
        maxAmount = item.discount > maxAmount ? item.discount : maxAmount
      })
      // 活动类型：满钱减钱 => 减免类型：按满足最高层减一次 => 优惠金额上限为最大金额
      if (this.dataForm.discountRule === 0 && this.dataForm.discountType === 0) {
        this.dataForm.maxReduceAmount = maxAmount
      }
      if (this.dataForm.discountRule < 2 && this.dataForm.discountType === 0) {
        this.dataForm.maxReduceAmount = maxAmount
      } else if (this.dataForm.discountRule < 2 && this.dataForm.discountType === 1) {
        if (this.dataForm.maxReduceAmount < minAmount) {
          this.isTrue = true
          this.errorValue = this.$i18n.t('marketing.maximumDiscountAmountBig')
          return true
        }
      }
      if (this.dataForm.suitableProdType !== 0 && this.dataForm.discountProds.length < 1) {
        this.isTrue = true
        this.errorValue = this.$i18n.t('marketing.pleaseSelectAProduct')
        return true
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.checkDiscountItems()
      if (this.isTrue) {
        this.errorMsg(this.errorValue)
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.endTime < this.dataForm.startTime) {
            this.errorMsg(this.$i18n.t('marketing.eventEndanStartTime'))
            return
          }
          if (this.dataForm.discountItems.length > 5) {
            this.$message.error(this.$i18n.t('marketing.maxActivityLevelsTips'))
            return
          }
          if (Number(this.dataForm.discountItems[0].discount) === 0.0 || Number(this.dataForm.discountItems[0].discount) === 0) {
            this.$message.error(this.$i18n.t('marketing.discountNoZero'))
            return
          }
          if (this.isSubmitting) {
            return
          }
          this.isSubmitting = true
          this.$http({
            url: this.$http.adornUrl(`/admin/discount`),
            method: this.dataForm.discountId ? 'put' : 'post',
            data: this.$http.adornData({
              'discountId': this.dataForm.discountId || undefined,
              'shopId': this.dataForm.shopId,
              'discountName': this.dataForm.discountName,
              'mobilePic': this.dataForm.mobilePic,
              'pcPic': this.dataForm.pcPic,
              'pcBackgroundPic': this.dataForm.pcBackgroundPic,
              'discountRule': this.dataForm.discountRule,
              'discountType': this.dataForm.discountType,
              'suitableProdType': this.dataForm.suitableProdType,
              'maxReduceAmount': this.dataForm.maxReduceAmount,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'status': this.dataForm.status,
              'discountItems': this.dataForm.discountItems,
              'discountProds': this.dataForm.discountProds
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.$store.commit('common/removeMainActiveTab')
                this.$router.go(-1)
              }
            })
          }).catch(() => {
            this.isSubmitting = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-discountInfo {
  .form-box {
    margin-left: 20px;
  }
  .date-picker {
    display: flex;
    .el-form-item.el-form-item--small {
      margin-bottom: 0;
    }
  }
}
.pleaseEnteThan {
  word-break: break-word;
  color: #999;
}
.discount-tip {
  color: #a3a3a3;
  font-size: 14px;
  margin-left: 2%;
  display: inline-block;
}
.box-card {
  margin-bottom: 30px;
  width: 515px;
  &:last-child {
    margin-bottom: 10px;
  }
  ::v-deep .el-card__header {
    padding: 15px;
  }
  .box-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 19px;
    line-height: 19px;
  }
  .el-form-item.el-form-item--small:last-child {
    margin-bottom: 0;
  }
}
.prod-card {
  display: flex;
  flex-wrap: wrap;
  .div {
    margin-right: 10px;
  }
}
</style>
