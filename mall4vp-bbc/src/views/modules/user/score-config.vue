<template >
  <div class="distribution-积分设置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{ $t("user.pointSettings") }} <span class="tip">{{ $t("user.pointSettingsTip") }} </span></div>
    <el-form
      label-width="180px"
      class="set-form"
      :rules="dataRule"
      :model="dataForm"
      ref="dataForm"
      size="mini"
    >
      <!-- <el-form-item label="奖励设置"> -->
      <!-- <el-checkbox v-model="dataForm.awardSwitch"
                     :false-label='0'
      :true-label='1'>默认奖励</el-checkbox>-->
      <!-- </el-form-item> -->
      <!-- <el-checkbox v-model="dataForm.levelSetConditionsSwitch.boundCustomers">绑定客户数</el-checkbox>
      <el-checkbox v-model="dataForm.levelSetConditionsSwitch.invitedVeeker">邀请分销员数</el-checkbox>-->
      <br />
      <!-- <el-button @click="addRow"                    :rules="[{required: true, message: '注册积分获取不能为空', trigger: 'blur'}]"
      style="margin-top:15px">添加等级</el-button>-->
      <el-form-item
        :label="$t('user.pointsEarnOne')"
        style="width: 440px"
        prop="signInScoreOne"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreOne"
          :placeholder="$t('order.score')"
          controls-position="right"
          size="small"
          :precision="0"
          :min="1"
          :max="99999"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnTwo')"
        style="width: 440px"
        prop="signInScoreTwo"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreTwo"
          controls-position="right"
          size="small"
          :precision="0"
          :min="1"
          :max="99999"
          :placeholder="$t('order.score')"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnThree')"
        style="width: 440px"
        prop="signInScoreThree"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreThree"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="99999"
          size="small"
          :placeholder="$t('order.score')"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnFour')"
        style="width: 440px"
        prop="signInScoreFour"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreFour"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="99999"
          size="small"
          :placeholder="$t('order.score')"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnFive')"
        style="width: 440px"
        prop="signInScoreFive"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreFive"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="99999"
          size="small"
          :placeholder="$t('order.score')"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnSix')"
        style="width: 440px"
        prop="signInScoreSix"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreSix"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="99999"
          size="small"
          :placeholder="$t('order.score')"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsEarnSeven')"
        style="width: 440px"
        prop="signInScoreSeven"
      >
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreSeven"
          controls-position="right"
          :precision="0"
          :min="1"
          :max="99999"
          size="small"
          :placeholder="$t('order.score')"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('user.pointsForRegistration')"
        style="width: 440px"
        prop="registerScore"
      >
        <el-input-number
          v-model="dataForm.registerScore"
          :placeholder="$t('order.score')"
          :precision="0"
          :min="0"
          :max="99999"
          controls-position="right"
          size="small"
          type="number"
        ></el-input-number>
      </el-form-item>
      <!-- <div class="title">积分使用设置</div> -->
      <!-- <br> -->
      <el-form-item
        :label="$t('user.pointsSwitch')"
        style="width: 440px"
        prop="shopScoreSwitch"
      >
        <el-switch v-model="dataForm.shopScoreSwitch"></el-switch>
      </el-form-item>
      <el-form-item
        v-if="dataForm.shopScoreSwitch"
        :label="$t('user.perPurchase')"
        style="width: 440px"
        prop="shopGetScore"
      >
        <el-input
          v-model="dataForm.shopGetScore"
          size="small"
          type="number"
          oninput="value=value.replace(/[^\d]/g,'')"
          style="width:350px"
          @change="setShopGetScore"
        >
          <template slot="append"
            >{{ $t("coupon.yuan") }}{{ $t("user.earnOnePoint") }}</template
          >
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.shopScoreSwitch"
        :label="$t('user.pointsPurchase')"
        style="width: 440px"
        :placeholder="$t('order.score')"
        prop="shopUseScore"
      >
        <el-input
          v-model="dataForm.shopUseScore"
          size="small"
          type="number"
          :min="1"
          :max="1000"
          oninput="value=value.replace(/[^\d]/g,'')"
          style="width:350px"
          @change="setShopUseScore"
        >
          <template slot="append">{{ $t("user.pointsDeducted") }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('user.pointsEarnLimit')" style="width: 440px">
        <el-radio-group v-model="getDiscountRange">
          <el-radio :label="0">{{ $t("user.platformPercent") }}</el-radio>
          <el-radio :label="1">{{ $t("user.categoryPercent") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('user.pointsUseLimit')" style="width: 440px">
        <el-radio-group v-model="useDiscountRange">
          <el-radio :label="0">{{ $t("user.platformPercent") }}</el-radio>
          <el-radio :label="1">{{ $t("user.categoryPercent") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('user.getPercentLimit')"
        v-if="getDiscountRange === 0"
      >
        <el-input-number
          v-model="dataForm.getDiscount"
          controls-position="right"
          :precision="1"
          :min="0"
          :step="0.1"
          :max="100"
          size="small"
          :placeholder="$t('user.percent')"
          type="number"
        ></el-input-number>
        <span class="tip">{{$t('user.userConsumptionAmount')+dataForm.getDiscount+$t('user.RedeemableForPoints')}}</span>
      </el-form-item>
      <el-form-item
        :label="$t('user.usePercentLimit')"
        v-if="useDiscountRange === 0"
      >
        <el-input-number
          v-model="dataForm.useDiscount"
          controls-position="right"
          :precision="1"
          :min="0"
          :step="0.1"
          :max="100"
          size="small"
          :placeholder="$t('user.percent')"
          type="number"
        ></el-input-number>
        <span class="tip">{{$t('user.userConsumptionAmount')+dataForm.useDiscount+$t('user.CanBeOffsetWithPoints')}}</span>
      </el-form-item>
      <!-- <el-form-item label="比例上限(%):" style="width:1840px"> -->
      <el-table
        :data="dataForm.categoryConfigs"
        class="elTable"
        style="width: 1002px"
        v-if="useDiscountRange === 1 || getDiscountRange === 1"
        border
      >
        <!-- width="700" -->
        <el-table-column
          prop="levelName"
          header-align="center"
          align="center"
          width="250"
          :label="$t('category.categoryName')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="levelName"
          header-align="center"
          align="center"
          width="250"
          :label="$t('category.categoryEn')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.categoryNameEn }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="presScore"
          :label="$t('user.getPercentLimit')"
          align="center"
          v-if="getDiscountRange === 1"
          header-align="center"
          width="250"
        >
          <template slot-scope="scope">
            <div class="table-template">
              <!-- <div class="table-input-box"> -->
              <el-form-item
                label-width="0px"
                :prop="'categoryConfigs.' + scope.$index + '.getScoreLimit'"
                align="center"
              >
                <el-input-number
                  v-model="scope.row.getScoreLimit"
                  size="medium"
                  :max="100"
                  :min="0"
                  :precision="1"
                ></el-input-number>
                <span class="tip">{{$t('user.userConsumptionAmount')+scope.row.getScoreLimit+$t('user.RedeemableForPoints')}}</span>
              </el-form-item>
              <!-- </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="presScore"
          :label="$t('user.usePercentLimit')"
          header-align="center"
          align="center"
          width="250"
          v-if="useDiscountRange === 1"
        >
          <template slot-scope="scope">
            <div class="table-template">
              <!-- <div class="table-input-box"> -->
              <el-form-item
                label-width="0px"
                :prop="'categoryConfigs.' + scope.$index + '.useScoreLimit'"
                align="center"
              >
                <el-input-number
                  v-model="scope.row.useScoreLimit"
                  size="medium"
                  :max="100"
                  :min="0"
                  :precision="1"
                ></el-input-number>
              </el-form-item>
               <span class="tip">{{$t('user.userConsumptionAmount')+scope.row.useScoreLimit+$t('user.CanBeOffsetWithPoints')}}</span>
              <!-- </div> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-form-item> -->
    </el-form>
    <div class="default-btn" @click="dataFormSubmit()">{{
      $t("sysManagement.save")
    }}</div>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        id: null,
        registerScore: 0,
        useDiscountRange: 0,
        getDiscountRange: 0,
        signInScore: [],
        shopGetScore: 0,
        useDiscount: 0,
        shopScoreSwitch: false,
        getDiscount: 0,
        shopUseScore: 0,
        categoryConfigs: []
      },
      useDiscountRange: 0,
      getDiscountRange: 0,
      signInScoreOne: 0,
      signInScoreTwo: 0,
      signInScoreThree: 0,
      signInScoreFour: 0,
      signInScoreFive: 0,
      signInScoreSix: 0,
      signInScoreSeven: 0,
      isConfig: false,
      value: '',
      dataRule: {
        registerScore: [
          { required: true, message: this.$i18n.t('user.pointsOfRegistrationCannotEmpty'), trigger: 'blur' }
        ],
        // signInScoreSeven: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreOne: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreTwo: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreThree: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreFour: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreFive: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreSix: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        shopGetScore: [
          { required: true, message: this.$i18n.t('user.pointsOfShoppingCannotEmpty'), trigger: 'blur' }
        ],
        shopUseScore: [
          { required: true, message: this.$i18n.t('user.shoppingPointsDeductedCannotEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreConfig/info/' + 'SCORE_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data.signInScoreString) {
            this.dataForm = data
            this.signInScoreOne = data.signInScore[0]
            this.signInScoreTwo = data.signInScore[1]
            this.signInScoreThree = data.signInScore[2]
            this.signInScoreFour = data.signInScore[3]
            this.signInScoreFive = data.signInScore[4]
            this.signInScoreSix = data.signInScore[5]
            this.signInScoreSeven = data.signInScore[6]
            if (!data.useDiscountRange) {
              this.useDiscountRange = 0
            } else {
              this.useDiscountRange = this.dataForm.useDiscountRange
            }
            if (!data.getDiscountRange) {
              this.getDiscountRange = 0
            } else {
              this.getDiscountRange = this.dataForm.getDiscountRange
            }
          }
          this.dataForm.categoryConfigs = data.categoryConfigs
        })
      })
    },
    setShopGetScore () {
      const num = Number(this.dataForm.shopGetScore).toFixed(2)
      this.dataForm.shopGetScore = num < 1 ? 1 : num
      if (num >= 100000000) {
        this.dataForm.shopGetScore = 100000000
      }
    },
    setShopUseScore () {
      let num = Math.round(this.dataForm.shopUseScore)
      num = num < 1 ? 1 : num
      num = num > 1000 ? 1000 : num
      this.$set(this.dataForm, 'shopUseScore', num)
    },
    comparaConfig () {
      this.isConfig = false
      this.dataForm.categoryConfigs.forEach(item => {
        if (this.useDiscountRange === 1 && !item.useScoreLimit) {
          this.value = this.$i18n.t('user.usePointsCannotEmpty')
          this.isConfig = true
          return true
        }
        if (this.getDiscountRange === 1 && !item.getScoreLimit) {
          this.value = this.$i18n.t('user.getPointsCannotEmpty')
          this.isConfig = true
          return true
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.dataForm.signInScore = []
      this.dataForm.useDiscountRange = this.useDiscountRange
      this.dataForm.getDiscountRange = this.getDiscountRange
      this.dataForm.getDiscount = !this.dataForm.getDiscount ? 0 : this.dataForm.getDiscount
      this.dataForm.useDiscount = !this.dataForm.useDiscount ? 0 : this.dataForm.useDiscount
      this.dataForm.signInScore.push(this.signInScoreOne || 0)
      this.dataForm.signInScore.push(this.signInScoreTwo || 0)
      this.dataForm.signInScore.push(this.signInScoreThree || 0)
      this.dataForm.signInScore.push(this.signInScoreFour || 0)
      this.dataForm.signInScore.push(this.signInScoreFive || 0)
      this.dataForm.signInScore.push(this.signInScoreSix || 0)
      this.dataForm.signInScore.push(this.signInScoreSeven || 0)
      this.comparaConfig()
      if (this.isConfig) {
        this.errorMsg(this.value)
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/user/scoreConfig'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          })
        }
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style scoped>
div >>>.is-success .el-input-number__decrease,
div >>>.is-success .el-input-number__increase,
div >>>.is-error .el-input-number__decrease,
div >>>.is-error .el-input-number__increase {
  right: 1px !important;
}
.tip{
  margin-left: 10px;
  font-size: 12px;
  color:#999;
  font-weight: normal;
}
</style>
