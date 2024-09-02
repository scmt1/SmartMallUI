<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :title="$t('user.levelConfig')"
  >
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('user.generalConfiguration')" name="first">
        <div class="prods-select-body">
          <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataRule">
            <el-form-item :label="$t('user.levelName')" prop="levelName">
              <el-input
                v-model="dataForm.levelName"
                :placeholder="$t('user.enterGradeName')"
                maxlength="10"
                size="small"
                style="width: 400px"
                show-word-limit
                type="texe"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.bgImg')" prop="img">
              <img-upload v-model="dataForm.img"></img-upload>
              <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '320*170' + $t("webInfoConfig.px") }}</div>
            </el-form-item>
            <el-form-item
              :label="$t('user.paidMemberPrice')"
              prop="needAmount"
              v-if="dataForm.levelType === 1"
            >
              <el-input
                v-model="dataForm.needAmount"
                :placeholder="$t('user.enterPrice')"
                type="number"
                min="0.01"
                size="small"
                style="width: 400px"
                oninput="if(value.length>10)value=value.slice(0,10)"
                step="0.0000001"
                @change="dataForm.needAmount = oninput(dataForm.needAmount)"
              >
                <template slot="append">{{ $t("coupon.yuan") }}</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('user.timeType')"
              prop="termType"
              v-if="dataForm.levelType === 1"
            >
              <el-radio-group v-model="dataForm.termType">
                <el-radio :label="1">{{ $t("coupon.day") }}</el-radio>
                <el-radio :label="2">{{ $t("user.week") }}</el-radio>
                <el-radio :label="3">{{ $t("user.month") }}</el-radio>
                <el-radio :label="4">{{ $t("user.season") }}</el-radio>
                <el-radio :label="5">{{ $t("user.year") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('user.time')"
              prop="term"
              v-if="dataForm.levelType === 1"
            >
              <el-input
                v-model="dataForm.term"
                :placeholder="$t('user.enterInteger')"
                min="1"
                precision="0"
                size="small"
                type="number"
                style="width: 400px"
                oninput="if(value.length>5)value=value.slice(0,5)"
                @change="dataForm.term = termOnInput(dataForm.term, dataForm.termType)"
              >
                <template slot="append">{{
                  dataForm.termType === 1
                    ? $t("coupon.day")
                    : dataForm.termType === 2
                    ? $t("user.week")
                    : dataForm.termType === 3
                    ? $t("user.month")
                    : dataForm.termType === 4
                    ? $t("user.season")
                    : $t("user.year")
                }}</template>
              </el-input>
              <el-tooltip class="item" effect="dark" :content="$t('user.maxTimeTip')" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item
              :label="$t('user.requiredGrowthValue')"
              prop="needGrowth"
            >
              <el-input
                v-model="dataForm.needGrowth"
                :placeholder="$t('user.enterInteger')"
                type="number"
                size="small"
                style="width: 400px"
                :min="minNeedGrowth"
                :max="maxNeedGrowth"
                precision="0"
                @blur="changeNeedGrowth()"
                :disabled="dataForm.level === 1 && dataForm.levelType === 0"
              >
                <template slot="append">{{ $t("user.growth") }}</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('user.equityAllocation')" name="third">
        <div class="prods-select-body">
          <el-form label-width="30px">
            <el-form-item prop="isFreeFee">
              <el-checkbox v-model="isFreeFee">{{
                $t("user.selfFreeShipping")
              }}</el-checkbox>
            </el-form-item>
            <el-form-item prop="rateScore">
              <el-checkbox v-model="isRateScore">{{
                $t("user.pointFeedbackRate")
              }}</el-checkbox>
              <el-input-number
                v-model="dataForm.rateScore"
                :placeholder="$t('user.enterMagnification')"
                size="small"
                :min="1"
                :max="100"
                :precision="2"
                controls-position="right"
                v-if="isRateScore"
              ></el-input-number>
            </el-form-item>
            <el-form-item prop="couponList">
              <el-checkbox v-model="isCoupon">{{
                $t("user.coupons")
              }}</el-checkbox>
              <template v-if="isCoupon">
                <span style="margin: 0 20px">
                  <el-button
                    @click.native.prevent="conpouSelectHandle()"
                    type="text"
                    size="small"
                    >{{ $t("user.selectCoupons") }}</el-button
                  >
                </span>
                <span v-for="(item, index) in dataForm.couponList" :key="index">
                  <span v-if="index < 2"
                    >{{ item.couponName
                    }}{{
                      index == 1 && dataForm.couponList.length > 2
                        ? $t("user.etcCoupons")
                        : ""
                    }}</span
                  >
                  &nbsp;
                </span>
              </template>
            </el-form-item>
            <el-form-item prop="presScore">
              <el-checkbox v-model="isPresScore">{{
                $t("user.bonusPoints")
              }}</el-checkbox>
              <el-input-number
                v-model="dataForm.presScore"
                :placeholder="$t('user.enterInteger')"
                :min="0"
                :max="100000000"
                :precision="0"
                size="small"
                controls-position="right"
                v-if="isPresScore"
              >
                <template slot="append">{{ $t("order.score") }}</template>
              </el-input-number>
            </el-form-item>
            <el-form-item prop="discount">
              <el-checkbox v-model="isDiscount">{{
                $t("user.discount")
              }}</el-checkbox>
              <el-input-number
                v-model="dataForm.discount"
                :placeholder="$t('user.discountRange')"
                :min="0.01"
                :max="10"
                :precision="2"
                size="small"
                controls-position="right"
                v-if="isDiscount"
              >
                <template slot="append">{{ $t("marketing.fold") }}</template>
              </el-input-number>
              <div  style="color:red;"  class="disabled-btn text-btn default-btn">{{$t("marketing.discountTip1")}}</div>
            </el-form-item>
            <el-form-item
              prop="discountRange"
              v-if="isDiscount"
              class="discount-body"
            >
              <el-radio-group v-model="dataForm.discountRange">
                <el-radio :label="0">{{ $t("user.platform") }}</el-radio>
                <el-radio :label="1">{{ $t("user.selfShop") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="discountType" class="discount-body">
              <el-radio-group v-model="dataForm.discountType" v-if="isDiscount">
                <el-radio :label="0">{{ $t("user.allProducts") }}</el-radio>
                <el-radio :label="1">{{ $t("user.categoryGoods") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              prop="categorys"
              v-if="isDiscount && dataForm.discountType === 1"
            >
              <el-tree
                :data="categoryList"
                :props="categoryListTreeProps"
                node-key="categoryId"
                ref="categoryTree"
                show-checkbox
              ></el-tree>
            </el-form-item>
            <el-form-item prop="presScore">
              <el-form-item prop="discountRange">
                <el-checkbox v-model="isOrther">{{
                  $t("user.otherRights")
                }}</el-checkbox>
                <el-checkbox-group
                  v-model="userRightsIds"
                  v-if="isOrther"
                  @change="checkbox"
                >
                  <el-checkbox
                    style="margin:4px 30px 0 0"
                    v-for="item in rightsDataList"
                    :key="item.rightsId"
                    :label="item.rightsId"
                    border
                    >{{ item.rightsName }}</el-checkbox
                  >
                </el-checkbox-group>
                <div style="color:red;" class="disabled-btn text-btn default-btn">{{$t("marketing.discountTip2")}}</div>
              </el-form-item>
            </el-form-item>
          </el-form>
          <coupon-select
            v-if="couponSelectVisible"
            ref="couponSelect"
            :getWay="1"
            @refreshSelectCouponList="selectDistributionCoupon"
          ></coupon-select>
        </div>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{
        $t("coupon.cancel")
      }}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{
        $t("coupon.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import CouponSelect from '@/components/coupon-select'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  components: {
    CouponSelect,
    ImgUpload
  },
  data () {
    var validateTime = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!reg.test(this.dataForm.term)) {
        callback(new Error(this.$i18n.t('user.integerGreaterThanZero')))
      } else {
        callback()
      }
    }
    var validateNeedGrowth = (rule, value, callback) => {
      let num = this.setNumber(this.dataForm.needGrowth)
      if (this.maxNeedGrowth) {
        if (num > this.maxNeedGrowth) {
          callback(new Error(this.$i18n.t('user.requiredGrowthValueMaximum')))
        }
      }
      console.log(this.minNeedGrowth, this.maxNeedGrowth)
      if (num < this.minNeedGrowth) {
        callback(new Error(this.$i18n.t('user.requiredGrowthValueMinimum')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      couponSelectVisible: false,
      activeName: 'first',
      dataForm: {
        id: null,
        level: 0,
        levelName: '',
        levelType: 0,
        needGrowth: 0,
        needAmount: 0,
        term: 1,
        termType: 1,
        img: '',
        discount: 10,
        discountRange: 0,
        discountType: 0,
        presScore: 0,
        rateScore: 1,
        isFreeFee: 0,
        couponList: [],
        userRightsIds: [],
        categoryList: [],
        categorys: []
      },
      isRateScore: false,
      isFreeFee: false,
      isCoupon: false,
      isPresScore: false,
      isDiscount: false,
      isOrther: false,
      minNeedGrowth: null,
      maxNeedGrowth: null,
      changeRights: [],
      userRightsIds: [],
      rightsDataList: [],
      categoryList: [],
      categoryListTreeProps: {
        label: 'categoryName',
        children: 'children'
      },
      dataRule: {
        levelName: [
          { required: true, message: this.$i18n.t('user.gradeNmaeCannotEmpty'), trigger: 'blur' }
        ],
        img: [
          { required: true, message: this.$i18n.t('user.bgImgCannotEmpty'), trigger: 'blur' }
        ],
        term: [
          { required: true, validator: validateTime, trigger: 'blur' }
        ],
        needGrowth: [
          { required: true, validator: validateNeedGrowth, trigger: 'blur' }
        ]
      }
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (userLevels, index) {
      // 初始化
      this.visible = true
      this.dataListLoading = true
      this.activeName = 'first'
      this.isRateScore = false
      this.isFreeFee = false
      this.isCoupon = false
      this.isPresScore = false
      this.isDiscount = false
      this.isOrther = false
      this.isSubmit = true
      this.categoryList = []
      if (userLevels[index].id) {
        this.getDataList(userLevels, index)
      } else {
        // 保存直接写入数据
        this.dataForm = userLevels[index]
        this.userRightsIds = this.dataForm.userRightsIds
        // 设置所需积分最大最小值
        this.serMinOrMaxNeedGrowth(userLevels, index)
        this.getCategoryDataList()
        this.getRightsDataList()
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    /**
     * 获取初始话数据
     */
    getDataList (userLevels, index) {
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/info/' + parseInt(userLevels[index].id)),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.userRightsIds = data.userRightsIds
        this.setRightsStatus(data)
        this.serMinOrMaxNeedGrowth(userLevels, index)
        this.getCategoryDataList()
        this.getRightsDataList()
      })
    },
    /**
     * 获取商品分类列表
     */
    getCategoryDataList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2
        })
      }).then(({ data }) => {
        let categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
        categoryList.forEach(item1 => {
          let t = false
          if (item1.children && item1.children.length > 0) {
            item1.children.forEach(item2 => {
              if (item2.children && item2.children.length > 0) {
                t = true
              }
            })
          }
          if (t) {
            this.categoryList.push(item1)
          }
        })
        if (this.dataForm.discountType === 1) {
          this.$refs.categoryTree.setCheckedKeys(this.dataForm.categorys)
        }
      })
    },
    /**
     * 获取用户权益列表
     */
    getRightsDataList () {
      this.$http({
        url: this.$http.adornUrl('/user/userRights/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.rightsDataList = data
      })
    },
    /**
     * 设置所需积分最大最小值
     */
    serMinOrMaxNeedGrowth (userLevels, index) {
      if (userLevels[index].level > 1) {
        this.minNeedGrowth = userLevels[index - 1].needGrowth === 1000000000 ? userLevels[index - 1].needGrowth : userLevels[index - 1].needGrowth + 1
      } else {
        this.minNeedGrowth = 0
      }
      if (index < userLevels.length - 1 && userLevels[index + 1].needGrowth !== 0) {
        this.maxNeedGrowth = userLevels[index + 1].needGrowth - 1
      } else {
        this.maxNeedGrowth = 1000000000
      }
    },
    /**
     * 显示添加指定优惠券弹框
     */
    conpouSelectHandle () {
      this.couponSelectVisible = true
      this.$nextTick(() => {
        this.$refs.couponSelect.init(this.dataForm.couponList)
      })
    },
    /**
     * 优惠券选择回调
     */
    selectDistributionCoupon (coupons) {
      // console.log('coupons', coupons)
      if (coupons.length > 0) {
        this.dataForm.couponList = coupons
      } else {
        this.dataForm.couponList = []
        this.isCoupon = false
      }
    },
    /**
     * 权益选项数据校验
     */
    setRights () {
      // 邮费
      if (this.isFreeFee) {
        this.dataForm.isFreeFee = 1
      } else {
        this.dataForm.isFreeFee = 0
      }
      // 折扣
      if (!this.isDiscount) {
        this.dataForm.discount = 10
        this.dataForm.discountRange = 0
        this.dataForm.discountType = 0
      }
      // 优惠券
      if (!this.isCoupon) {
        this.dataForm.couponList = []
      }
      // 积分倍率
      if (!this.isRateScore) {
        this.dataForm.rateScore = 1
      }
      // 赠送积分
      if (!this.isPresScore) {
        this.dataForm.presScore = 0
      }
      // 其他权益
      if (!this.isOrther) {
        this.dataForm.userRightsIds = []
      } else {
        this.dataForm.userRightsIds = this.userRightsIds
      }
    },
    checkData () {
      if (!this.dataForm.img) {
        this.msg = this.$i18n.t('user.bgImgCannotEmpty')
        this.isCheckSccuss = false
        return false
      }
      if (this.isDiscount) {
        if (this.dataForm.discountType === 1 && this.$refs.categoryTree.getCheckedKeys().length === 0) {
          this.msg = this.$i18n.t('user.selectCategory')
          this.isCheckSccuss = false
          return false
        }
      }
      if (this.dataForm.levelName.length < 1 || !this.dataForm.levelName.trim()) {
        this.msg = this.$i18n.t('user.gradeNmaeCannotEmpty')
        this.isCheckSccuss = false
        return false
      }
      // 积分倍率
      if (this.isRateScore && this.dataForm.rateScore === 1) {
        this.msg = this.$i18n.t('user.feedback1')
        this.isCheckSccuss = false
        return false
      }
      // 优惠券
      if (this.isCoupon && this.dataForm.couponList.length < 1) {
        this.msg = this.$i18n.t('user.selectCoupons')
        this.isCheckSccuss = false
        return false
      }
      // 赠送积分
      if (this.isPresScore && this.dataForm.presScore === 0) {
        this.msg = this.$i18n.t('user.bonus0')
        this.isCheckSccuss = false
        return false
      }
      // 折扣
      if (this.isDiscount && this.dataForm.discount === 10) {
        this.msg = this.$i18n.t('user.discountRangeValue')
        this.isCheckSccuss = false
        return false
      }
    },
    /**
     * 确定事件
     */
    submitProds () {
      if (!this.isSubmit) {
        return
      }
      // 校验数据
      this.isCheckSccuss = true
      this.checkData()
      if (!this.isCheckSccuss) {
        this.errorMsg(this.msg)
        return
      }
      // 检验其他权益是否有冲突
      // if (this.userRightsIds.length < 1 && this.isOrther === true) {
      //   this.$message.error(this.$i18n.t('shop.rightsConflict'))
      //   return
      // }
      // 数据校验
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.isSubmit = false
        // 根据数据设置权限
        this.setRights()
        if (this.dataForm.discountType === 1) {
          this.dataForm.categorys = this.$refs.categoryTree.getCheckedKeys()
        }
        if (!this.isDiscount || !this.dataForm.discountType) {
          this.dataForm.categorys = null
        }
        this.$http({
          url: this.$http.adornUrl(`/user/userLevel`),
          method: 'put',
          data: this.$http.adornData(this.dataForm)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500
          })
          this.$emit('refreshDataList')
        }).catch(() => { })
        this.dataForm = {}
        this.visible = false
      })
    },
    setRightsStatus (data) {
      data.isFreeFee === 0 ? this.isFreeFee = false : this.isFreeFee = true
      data.discount === 10 ? this.isDiscount = false : this.isDiscount = true
      data.rateScore === 1 ? this.isRateScore = false : this.isRateScore = true
      data.presScore === 0 ? this.isPresScore = false : this.isPresScore = true
      data.couponList.length < 1 ? this.isCoupon = false : this.isCoupon = true
      data.userRightsIds.length < 1 ? this.isOrther = false : this.isOrther = true
    },
    /**
     * 所需成长值数据变化校验
     */
    changeNeedGrowth () {
      // let num = this.setNumber(this.dataForm.needGrowth)
      // if (this.maxNeedGrowth) {
      //   if (num > this.maxNeedGrowth) {
      //     this.errorMsg(this.$i18n.t('user.requiredGrowthValueMaximum'))
      //   }
      //   num = num > this.maxNeedGrowth ? this.maxNeedGrowth : num
      // }
      // if (num < this.minNeedGrowth) {
      //   this.errorMsg(this.$i18n.t('user.requiredGrowthValueMinimum'))
      // }
      // this.dataForm.needGrowth = num < this.minNeedGrowth ? this.minNeedGrowth : num
      var num = this.dataForm.needGrowth
      num = Number(num).toFixed(0)
      num = Number(num.toString().replace(/[^\d]/g, ''))
      this.dataForm.needGrowth = num
    },
    oninput (needAmount) {
      let amount = parseFloat(needAmount)
      if (isNaN(amount)) {
        // this.errorMsg(this.$i18n.t('marketing.pleaseThan0'))
        return 0.01
      }
      amount = Math.round(needAmount * 100) / 100
      if (amount === 0) {
        amount = 0.01
      }
      let cur = amount.toString()
      let reString = cur.indexOf('.')
      if (reString < 0) {
        reString = cur.length
        cur += '.'
      }
      while (cur.length <= reString + 2) {
        cur += '0'
      }
      if (parseFloat(needAmount) < 0) {
        return 0.01
      }
      return parseFloat(cur).toFixed(2)
    },
    /**
     * 所需金额数据变化校验
     */
    changeNeedAmount () {
      let needAmount = this.setNumber(this.dataForm.needAmount)
      this.dataForm.needAmount = needAmount === 0 ? 1 : needAmount
    },
    /**
     * 时间校验，最大10年
     */
    termOnInput (term, termType) {
      if (isNaN(term)) {
        return 1
      }
      switch (termType) {
        case 1: term = Math.min(3652, term)
          break
        case 2: term = Math.min(522, term)
          break
        case 3: term = Math.min(120, term)
          break
        case 4: term = Math.min(40, term)
          break
        case 5: term = Math.min(10, term)
          break
        default:
          break
      }
      return term
    },
    /**
     * 权益多选时触发事件
     */
    checkbox (value) {
      // if (value.length < 1) {
      //   this.isOrther = false
      // }
    },
    /**
     * 判断数据
     */
    setNumber (value) {
      var num = Math.round(value)
      if (num < 0) {
        return 0
      } else {
        return num
      }
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
    checkDiscount () {
      if (this.isDiscount && this.userRightsIds.length > 0) {
        this.userRightsIds = []
      }
    }
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 500px;
  overflow: auto;
}
.discount-body {
  margin-left: 30px;
  overflow: auto;
}
</style>
