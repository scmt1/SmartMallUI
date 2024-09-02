<template>
  <el-dialog
    class="mod-coupon-add-or-update"
    :title="dataForm.couponId ? $t('coupon.viewCoupon') : $t('coupon.newCoupon')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      :disabled="true"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="$t('language') === 'language' ? '180px':'110px'"
      size="small"
    >
      <el-form-item :label="$t('coupon.couponName')" prop="couponName">
        <el-input
          v-model="dataForm.couponName"
          :placeholder="$t('coupon.couponName')"
          :disabled="dataForm.couponId !== 0"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('coupon.couponSubtitle')" prop="subTitle">
        <el-input
          v-model="dataForm.subTitle"
          :placeholder="$t('coupon.couponSubtitle')"
          :disabled="dataForm.couponId !== 0"
        ></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('coupon.deliveryStatus')" prop="putonStatus">
        <el-radio-group v-model="dataForm.putonStatus">
          <el-radio :label="0">{{ $t("coupon.waitAutoLaunch") }}
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">{{ $t("coupon.launchTip")}}</div>
              <span>
             <i class="el-icon-question"></i>
            </span>
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">{{ $t("coupon.launched") }}</el-radio>
          <el-radio :label="4">{{ $t("coupon.waitLaunch") }}</el-radio>
          <el-radio :label="-1">{{ $t("coupon.cancelLaunch") }}
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">{{ $t("coupon.launchTip1")}}</div>
              <span>
             <i class="el-icon-question"></i>
            </span>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('coupon.getWay')" size="mini" prop="getWay">
        <el-radio-group v-model="dataForm.getWay" :disabled="dataForm.isGroup === 1">
          <el-radio :label="0">{{ $t('coupon.receiveDirectly') }}</el-radio>
          <el-radio :label="1">{{ $t('coupon.exchangeOrSystemIssue') }}</el-radio>
          <!-- <el-radio :label="3">兑换券</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否团购" prop="isGroup">
        <el-radio-group v-model="dataForm.isGroup">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
              label="团购金额"
              prop="groupAmount"
              v-if="dataForm.isGroup === 1"
      >
        <el-input
                v-model="dataForm.groupAmount"
                size="small"
                type="number"
                placeholder="团购金额"
                min="0"
        >
          <template slot="append">{{ $t('coupon.yuan') }}</template>
        </el-input>
      </el-form-item>

      <el-form-item label="类型" size="mini" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">线上券</el-radio>
          <el-radio :label="2">线下券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('coupon.couponType')" prop="couponType">
        <el-radio-group v-model="dataForm.couponType" :disabled="dataForm.couponId !== 0">
          <el-radio :label="1">{{ $t('coupon.cashCoupon') }}</el-radio>
          <el-radio :label="2">{{ $t('coupon.discountVoucher') }}</el-radio>
           <el-radio :label="4">提货卡/券</el-radio>
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
      <!-- 投放结束时间 -->
      <el-form-item
              :label="this.$i18n.t('coupon.endTimeToMarket')"
              prop="launchEndTime"
              v-if="dataForm.putonStatus === 0"
      >
        <el-date-picker
                v-model="dataForm.launchEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :placeholder="this.$i18n.t('coupon.chooseLaunchEndTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('coupon.reductionAmount')" prop="reduceAmount" v-if="dataForm.couponType === 1">
        <el-input
          v-model="dataForm.reduceAmount"
          :placeholder="$t('coupon.reductionAmount')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t('coupon.yuan') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.discountAmount')" prop="couponDiscount" v-if="dataForm.couponType === 2">
        <el-input
          v-model="dataForm.couponDiscount"
          :placeholder="$t('coupon.discountAmount')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t('coupon.off') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="提货卡/券名称" prop="cardName" v-if="dataForm.couponType === 4">
        <el-input
                v-model.trim="dataForm.cardName"
                placeholder="请输入提货卡/券名称"
                maxlength="20"
                show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="赠送券" prop="giveCouponId" v-if="dataForm.couponType === 4">
        <el-select v-model="dataForm.giveCouponId" placeholder="选择赠送券" filterable style="width: 100%">
          <el-option v-for="(item,index) in couponList" :key="index" :label="item.couponName" :value="item.couponId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('coupon.conditionsOfUse')" prop="cashCondition">
        {{ $t('coupon.spendMoreThan') }}
        <el-input
          v-model="dataForm.cashCondition"
          :placeholder="$t('coupon.conditionsOfUse')"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t('coupon.yuan') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
              label="提货卡/券金额"
              prop="reduceAmount"
              v-if="dataForm.couponType === 4"
      >
        <el-input
                v-model="dataForm.reduceAmount"
                placeholder="提货卡/券金额"
                type="number"
                min="0"
        >
          <template slot="append">{{ $t('coupon.yuan') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.effectiveType')" np prop="validTimeType">
        <el-radio-group v-model="dataForm.validTimeType" :disabled="dataForm.couponId !== 0">
          <el-radio :label="1">{{ $t('coupon.fixedTime') }}</el-radio>
          <el-radio :label="2">{{ $t('coupon.effectiveAfterReceiving') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('coupon.startTime')" prop="startTime" v-if="dataForm.validTimeType === 1">
        <el-date-picker
          :disabled="dataForm.couponId !== 0"
          v-model="dataForm.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('coupon.chooseStartTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('coupon.endTime')" prop="endTime" v-if="dataForm.validTimeType === 1">
        <el-date-picker
          v-model="dataForm.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('coupon.chooseEndTime')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('coupon.AfterReceipt')" prop="afterReceiveDays" v-if="dataForm.validTimeType === 2">
        <el-input
          v-model="dataForm.afterReceiveDays"
          type="number"
          :disabled="dataForm.couponId !== 0"
        >
          <template slot="append">{{ $t('coupon.day') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.validDate')" prop="validDays" v-if="dataForm.validTimeType === 2">
        <el-input v-model="dataForm.validDays" type="number" :disabled="dataForm.couponId !== 0">
          <template slot="append">{{ $t('coupon.day') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.restrictionsPerPerson')" prop="limitNum">
        <el-input v-model="dataForm.limitNum" type="number">
          <template slot="append">{{ $t('coupon.sheet') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.stock')" prop="stocks">
        <el-input v-model="dataForm.stocks" type="number" :disabled="dataForm.couponId !== 0">
          <template slot="append">{{ $t('coupon.sheet') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.couponImg')">
        <img-upload v-model="dataForm.couponImg"></img-upload>
      </el-form-item>
      <el-form-item :label="$t('coupon.couponClaimRules')" prop="claimRules">
        <el-input v-model="dataForm.claimRules" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.couponUseRules')" prop="useRules">
        <el-input v-model="dataForm.useRules" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item :label="$t('coupon.applicableGoods')" prop="suitableProdType">
        <el-radio-group v-model="dataForm.suitableProdType">
          <el-radio :label="0">{{ $t('coupon.allProductsParticipate') }}</el-radio>
          <el-radio :label="1">{{ $t('coupon.participateInDesignatedProd') }}</el-radio>
          <el-radio :label="2">{{ $t('coupon.specifiedProductsDoNotParticipate') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          v-if="dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2"
          @click="prodsSelectHandle()"
        >{{ $t('coupon.selectGoods') }}</el-button>
      </el-form-item>
      <!-- 商品 -->
      <el-form-item v-if="dataForm.suitableProdType !== 0">
        <div class="prod-con">
          <el-card  v-for="(couponProd, index) in dataForm.couponProds" :key="index" :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
            <prod-pic
              height="104px"
              width="100%"
              :pic="couponProd.pic"
            ></prod-pic>
            <div class="card-prod-bottom">
              <span class="card-prod-name">{{couponProd.prodName}}</span>
              <el-button type="text" class="card-prod-name-button" @click="deleteProd(index)">{{ $t('coupon.delete') }}</el-button>
            </div>
          </el-card>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('coupon.cancel') }}</el-button>
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
    </span>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      @refreshSelectProds="selectCouponProds"
    ></prods-select>
    <shop-select v-if="shopsSelectVisible" ref="shopsSelect" @refreshSelectShops="selectCouponShops"></shop-select>
  </el-dialog>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import ShopSelect from '@/components/shop-selection'
import ProdPic from '@/components/prod-pic'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    var validate = (rule, value, callback) => {
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$t('coupon.discountValidate')))
      } else {
        callback()
      }
    }
    var validateTime = (rule, value, callback) => {
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$t('coupon.validateTime')))
      } else {
        callback()
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
        validDays: 0,
        stocks: 1,
        suitableProdType: 0,
        limitNum: 1,
        putonStatus: 0,
        couponProds: [],
        couponShops: [],
        couponImg:'',
        claimRules:'',
        useRules:'',
        launchEndTime:null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      errorTip: false,
      dataListSelections: [],
      prodsSelectVisible: false,
      shopsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        couponName: [
          { required: true, message: this.$t('coupon.couponNameCannotBeEmpty'), trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: this.$t('coupon.couponTypeNotEmpty'), trigger: 'blur' }
        ],
        reduceAmount: [
          { required: true, message: this.$t('coupon.theDedEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        limitNum: [
          { required: true, message: this.$t('coupon.theLimitetBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        couponDiscount: [
          { required: true, message: this.$t('coupon.theDiscouBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$t('coupon.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$t('coupon.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        afterReceiveDays: [
          { required: true, message: this.$t('coupon.timeCannotBeEmpty'), trigger: 'blur' }
        ],
        validDays: [
          { required: true, message: this.$t('coupon.timeCannotBeEmpty'), trigger: 'blur' }
        ],
        cashCondition: [
          { required: true, message: this.$t('coupon.conditionBeEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        validTimeType: [
          { required: true, message: this.$t('coupon.effectiveotBeEmpty'), trigger: 'blur' }
        ],
        stocks: [
          { required: true, message: this.$t('coupon.invenEmpty'), trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        suitableProdType: [
          { required: true, message: this.$t('coupon.applicabltBeEmpty'), trigger: 'blur' }
        ],
        couponImg: [
          {required: true, message: this.$i18n.t('coupon.couponImgCannotBeEmpty'), trigger: 'blur'}
        ],
        claimRules: [
          {required: true, message: this.$i18n.t('coupon.couponClaimRulesCannotBeEmpty'), trigger: 'blur'}
        ],
        useRules: [
          {required: true, message: this.$i18n.t('coupon.couponUseRulesCannotBeEmpty'), trigger: 'blur'}
        ],
        launchEndTime: [
          {required: true, message: this.$i18n.t('coupon.launchEndTimeTip1'), trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    ProdsSelect,
    ProdPic,
    ShopSelect,
    ImgUpload
  },
  watch: {
    visible: function () {
      if (this.visible === false) {
        this.prodsSelectVisible = false
        this.shopsSelectVisible = false
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
        url: this.$http.adornUrl(`/platform/coupon/info/${this.dataForm.couponId}`),
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
    // 显示添加指定商品弹框
    shopsSelectHandle () {
      this.shopsSelectVisible= true
      this.$nextTick(() => {
        this.$refs.shopsSelect.init(this.dataForm.couponShops)
      })
    },
    // 删除指定商品
    deleteProd (index) {
      this.dataForm.couponProds.splice(index, 1)
    },
    deleteShop (index) {
      this.dataForm.couponShops.splice(index, 1)
      this.$forceUpdate();
    },
    // 添加指定商品
    selectCouponProds (prods) {
      if (prods) {
        this.dataForm.couponProds = prods
      }
    },
    // 添加指定店铺
    selectCouponShops (shops) {
      if (shops) {
        this.dataForm.couponShops = shops
        this.$forceUpdate();
      }
    },
    // 表单提交
    dataFormSubmit () {
      if (this.errorTip) {
        this.$message({
          message: this.$t('coupon.quantitssThan0'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/platform/coupon`),
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
              'couponProds': this.dataForm.couponProds,
              'couponShops': this.dataForm.couponShops,
              'couponImg': this.dataForm.couponImg,
              'claimRules': this.dataForm.claimRules,
              'useRules': this.dataForm.useRules,
              'launchEndTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchEndTime : null
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$t('coupon.successfulOperation'),
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
<style lang="scss" scoped>
.mod-coupon-add-or-update {
  .prod-con {
    display: flex;
    flex-wrap: wrap;
    .el-card {
      margin: 0 15px 15px 0;
    }
  }
}
</style>
