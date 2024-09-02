<template>
  <el-dialog
    :title="!dataForm.balanceId ? $t('brand.add') : $t('brand.revise')"
    :close-on-click-modal="false"
    :append-to-body="visible"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
      size="small"
      class="body-content"
    >
      <el-form-item
        :label="$t('distributionMsg.title')"
        :placeholder="$t('publics.titleNoEnter')"
        prop="balanceTitle"
        class="input-width"
      >
        <el-input v-model="dataForm.balanceTitle" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('user.rechargeAmount')"
        :placeholder="$t('user.enterRechargeAmount')"
        prop="rechargeAmount"
        style="width: 400px"
        class="input-width"
      >
        <el-input
          v-model="dataForm.rechargeAmount"
          :min="0.01"
          @change="inputChange(1)"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('user.bgImg')" prop="img">
        <img-upload v-model="dataForm.img"></img-upload>
      </el-form-item> -->
      <el-form-item :label="$t('user.rewardAmount')" prop="presAmount">
        <el-input
          :placeholder="$t('user.enterRewardAmount')"
          v-model="dataForm.presAmount"
          min="0"
          max="100000000"
          @change="inputChange(2)"
          class="input-width"
        >
          <template slot="prepend">{{ $t("user.reward") }}</template>
          <template slot="append">{{ $t("home.amount") }}</template>
        </el-input>
        <!-- <el-input v-model="dataForm.presAmount"></el-input> -->
      </el-form-item>
      <el-form-item
        :label="$t('user.rewardScore')"
        :placeholder="$t('user.enterRewardScore')"
        prop="presScore"
      >
        <el-input
          v-model="dataForm.presScore"
          min="0"
          max="100000000"
          @change="inputChange(3)"
          class="input-width"
        >
          <template slot="prepend">{{ $t("user.reward") }}</template>
          <template slot="append">{{ $t("order.score") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('user.rewardGrowthValue')"
        :placeholder="$t('user.enterRewardGrowthValue')"
        prop="presGrowth"
      >
        <el-input
          v-model="dataForm.presGrowth"
          min="0"
          max="100000000"
          @change="inputChange(4)"
          class="input-width"
        >
          <template slot="prepend">{{ $t("user.reward") }}</template>
          <template slot="append">{{ $t("user.growth") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('user.rewardCoupon')" prop="couponList">
        <template>
          <span>
            <div
              @click="conpouSelectHandle()"
              class="text-btn default-btn"
              >{{ $t("user.selectCoupons") }}</div
            >
          </span>
          <el-table
            :data="dataForm.couponList"
            style="width: 100%"
            v-if="dataForm.couponList.length > 0"
          >
            <el-table-column :label="$t('marketing.couponName')" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{
                  scope.row.couponName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('user.couponUpperLimit')" width="140">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.limitNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('order.quantity')" min-width="170px">
              <template slot-scope="scope">
                <el-input-number
                  :min="1"
                  :max="scope.row.limitNum"
                  size="mini"
                  v-model="scope.row.couponNum"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column :label="$t('publics.operating')" width="180">
              <template slot-scope="scope">
                <div
                  class="text-btn default-btn"
                  @click="deleteCoupon(scope.$index)"
                  >{{ $t("brand.delete") }}</div
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item :label="$t('brand.sequence')" prop="seq">
        <el-input-number
          v-model="dataForm.seq"
          @change="inputChange(5)"
          controls-position="right"
          size="medium"
          :min="1"
          :max="100"
        ></el-input-number>
        <!-- <el-input v-model="dataForm.seq"></el-input> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div class="primary-btn default-btn" @click="dataFormSubmit()">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
    <coupon-select
      v-if="couponSelectVisible"
      ref="couponSelect"
      :getWay="1"
      @refreshSelectCouponList="selectDistributionCoupon"
    ></coupon-select>
  </el-dialog>
</template>

<script>
import ImgUpload from '@/components/img-upload'
import CouponSelect from '@/components/coupon-select'
export default {
  data () {
    var validateTitle = (rule, value, callback) => {
      if (String(value).trim() === '') {
        callback(new Error(this.$i18n.t('shop.titCanNoBlank')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isSubmit: false,
      dataForm: {
        balanceId: null,
        balanceTitle: null,
        rechargeAmount: 0,
        img: null,
        presAmount: 0,
        presScore: 0,
        presGrowth: 0,
        seq: 1,
        couponList: []
      },
      couponSelectVisible: false,
      dataRule: {
        balanceTitle: [
          { required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur' },
          {validator: validateTitle, trigger: 'blur'}
        ]
      }
        // img: [
        //   { required: true, message: this.$i18n.t('user.bgImgCannotEmpty'), trigger: 'blur' }
        // ]
    }
  },
  components: {
    ImgUpload,
    CouponSelect
  },
  methods: {
    init (balanceId) {
      console.log('balanceId', balanceId)
      this.dataForm.balanceId = balanceId || 0
      this.visible = true
      this.isSubmit = false
      this.dataForm.balanceTitle = null
      this.dataForm.rechargeAmount = 0
      this.dataForm.img = null
      this.dataForm.presAmount = 0
      this.dataForm.presScore = 0
      this.dataForm.presGrowth = 0
      this.dataForm.seq = 1
      this.dataForm.couponList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.balanceId) {
          this.$http({
            url: this.$http.adornUrl('/user/userBalance/info/' + this.dataForm.balanceId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
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
      console.log(coupons)
      // 初始化优惠券数量
      coupons.forEach(coupon => {
        coupon.couponNum = 1
        this.dataForm.couponList.forEach(item => {
          if (coupon.couponId === item.couponId) {
            coupon.couponNum = item.couponNum
          }
        })
      })
      // 更新优惠券列表数据
      if (coupons.length > 0) {
        this.dataForm.couponList = coupons
      } else {
        this.dataForm.couponList = []
        this.isCoupon = false
      }
    },
    deleteCoupon (index) {
      this.dataForm.couponList.splice(index, 1)
    },
    inputChange (type) {
      if (type === 1) {
        let amount = !this.dataForm.rechargeAmount ? 0.01 : this.checkNumber(this.dataForm.rechargeAmount, 1)
        this.dataForm.rechargeAmount = amount < 0.01 ? 0.01 : amount
      } else if (type === 2) {
        this.dataForm.presAmount = !this.dataForm.presAmount ? 0 : this.checkNumber(this.dataForm.presAmount, 1)
      } else if (type === 3) {
        this.dataForm.presScore = !this.dataForm.presScore ? 0 : this.checkNumber(this.dataForm.presScore, 2)
      } else if (type === 4) {
        this.dataForm.presGrowth = !this.dataForm.presGrowth ? 0 : this.checkNumber(this.dataForm.presGrowth, 2)
      } else if (type === 5) {
        this.dataForm.seq = !this.dataForm.seq ? 0 : this.checkNumber(this.dataForm.seq, 2)
      }
    },
    checkNumber (num, type) {
      var reg = ''
      if (type === 1) {
        reg = /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/
        if (!reg.test(num)) {
          return 0
        } else if (num > 1000000) {
          return 1000000
        }
      } else {
        reg = /^[0-9]*$/
        if (!reg.test(num)) {
          return 0
        } else if (num > 1000000) {
          return 1000000
        }
      }
      return num
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          if (this.dataForm.rechargeAmount < 0.01) {
            this.$message.error(this.$i18n.t('marketing.moreThan0'))
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/user/userBalance'),
            method: this.dataForm.balanceId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.succeeded'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.isSubmit = false
                this.$emit('refreshDataList')
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
.body-content{
  overflow: auto;
}
.input-width {
  width: 400px;
}
el-form-item {
  margin-bottom: 80px;
}
</style>
