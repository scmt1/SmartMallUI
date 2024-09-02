<template>
  <div class="mod-marketing-distribution-item base-set">
    <el-form
      ref="dataForm"
      size="small"
      class="set-form"
      :model="dataForm"
    >
      <!-- 基本设置 -->
      <div class="form-item">
        <div class="title">{{ $t('distribution.basicDistributionSet') }}</div>
        <div class="form-item-content">
          <!-- 分销开关 -->
          <el-form-item :label="this.$i18n.t('distribution.distributionSwitch')+':'">
            <el-radio-group v-model="dataForm.distributionSwitch">
              <el-radio :label="0">{{ $t('seckill.close') }}</el-radio>
              <el-radio :label="1">{{ $t('seckill.open') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 业绩归属 -->
          <el-form-item :label="this.$i18n.t('distribution.performanceAttribution')+':'">
            <el-radio-group v-model="dataForm.attribution">
              <el-radio :label="0">{{ $t('distribution.paTip1') }}
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content"  class="performanceAttribution-content">
                    {{ $t('distribution.promptPaTip1') }}
                    </div>
                  <i class="el-icon-question performanceAttribution" />
                </el-tooltip>
              </el-radio>
              <el-radio :label="1">{{ $t('distribution.paTip2') }}
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content"   class="performanceAttribution-content">
                    {{ $t('distribution.promptPaTip2') }}
                    </div>
                  <i class="el-icon-question performanceAttribution" />
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 申请条件-条件审核判定 -->
          <el-form-item :label="this.$i18n.t('distribution.conditionalAuditJudgment')+':'">
            <el-radio-group v-model="dataForm.autoCheck" @change="changeRadio(dataForm.autoCheck)">
              <el-radio :label="0">{{ $t('distribution.manualJudgment') }}</el-radio>
              <el-radio :label="1">{{ $t('distribution.systemJudgment') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 申请条件 -->
          <el-form-item v-if="dataForm.autoCheck === 1" :label="this.$i18n.t('distribution.applicationConditions')+':'">
            <div class="condition-item marginBottom">
              <el-checkbox v-model="isProd">{{ $t('distribution.purchaseDesignatedGoods') }}</el-checkbox>
              <el-button v-if="isProd" plain size="small" @click="prodsSelectHandle">{{ '选择商品' }}</el-button>
              <span class="tips">{{ $t('distribution.buyConditionTip2') }}</span>
              <el-row v-if="isProd">
                <div
                  v-for="(prod, index) in productVOList"
                  :key="index"
                  class="productStyle"
                >
                  <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
                    <img :src="prod.pic" style="height:104px;width:100%">
                    <div class="card-prod-bottom">
                      <span class="card-prod-name">{{ prod.prodName }}</span>
                      <el-button
                        type="text"
                        class="card-prod-name-button"
                        @click="deleteProd(index)"
                      >{{ $t('user.deleteBtn') }}</el-button>
                    </div>
                  </el-card>
                </div>
              </el-row>
            </div>

            <div class="condition-item input-group" :style="this.$i18n.t('language') === 'language' ?'marginLeft:150px':'marginLeft:72px'">
              <el-checkbox v-model="isExpenseNumber" class="input-checked" @change="removeExpenseNumber">{{ $t('distribution.bcTip3') }}</el-checkbox>
              <el-form-item prop="expenseNumber">
                <el-input
                  v-model="dataForm.expenseNumber"
                  type="number"
                  min="1"
                  :disabled="!isExpenseNumber"
                  style="width:240px"
                  @change="checkNumber"
                >
                  <template slot="append">{{ $t('distribution.bcTip4') }}</template>
                </el-input>
              </el-form-item>
              <span class="tips">{{ $t('distribution.bcTip5') }}</span>
            </div>

            <div class="condition-item input-group" :style="this.$i18n.t('language') === 'language' ?'marginLeft:150px':'marginLeft:72px'">
              <el-checkbox
                v-model="isExpenseAmount"
                class="input-checked"
                @change="removeExpenseAmount"
              >{{ $t('distribution.dbcTip1') }}</el-checkbox>
              <el-form-item prop="expenseAmount">
                <el-input
                  v-model="dataForm.expenseAmount"
                  type="number"
                  min="0"
                  style="width:240px"
                  :disabled="!isExpenseAmount"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  @change="checkAmount"
                >
                  <template slot="append">{{$t('distribution.dbcTip2') }}</template>
                </el-input>
              </el-form-item>
              <span class="tips">{{ $t('distribution.dbcTip3') }}</span>
            </div>
          </el-form-item>
          <!-- 申请所需信息 -->
          <el-form-item :label="this.$i18n.t('distribution.applyNeedInfo')+':'" >
            <el-checkbox v-model="dataForm.realName">{{ $t('distribution.realName') }}</el-checkbox>
            <el-checkbox v-model="dataForm.identityCardNumber">{{ $t('distribution.idCardNo') }}</el-checkbox>
            <el-checkbox v-model="dataForm.identityCardPic">{{ $t('distribution.idCardPhoto') }}</el-checkbox>
          </el-form-item>
<!--          提现发放方式-->
          <el-form-item :label="this.$i18n.t('distribution.Withdrawal')+':'">
            &nbsp;
            <el-tooltip class="item" effect="light" :content="$t('distribution.WithdrawalTip')" placement="right" style="color: #155BD4;">
              <i class="el-icon-question" />
            </el-tooltip>
            &nbsp;
            <el-radio-group v-model="dataForm.withdrawal">
            <el-radio :label="0">{{ $t('distribution.Issued1') }}</el-radio>
            <el-radio :label="1">{{ $t('distribution.Issued2') }}</el-radio>
            <el-radio :label="2">{{ $t('distribution.Issued3') }}</el-radio>
            </el-radio-group>
          </el-form-item>

        </div>
      </div>
      <!-- 提现设置 -->
      <div class="form-item">
        <div class="title">{{ $t('distribution.withdrawalSettings') }}</div>
        <div class="form-item-content">
          <!-- 单笔提现 -->
          <el-form-item :label="this.$i18n.t('withdraw.eachWithdrawal')+':'">
            <el-input v-model.number="dataForm.amountMin" style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10">
              <template slot="append">{{ $t('distribution.dbcTip2') }}</template>
            </el-input>
            <span class="input-tips">,{{ $t('withdraw.tip2') }}</span>
            <el-input v-model.number="dataForm.amountMax" style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
            >
              <template slot="append">{{ $t('distribution.dbcTip2') }}</template>
            </el-input>
            <span class="tips">{{  $t('withdraw.tip3') }}</span>
          </el-form-item>
          <!-- 提现频次 -->
          <el-form-item :label="this.$i18n.t('withdraw.withdrawalFrequency')+':'">
            <el-select
              v-model="dataForm.frequency"
              :placeholder="this.$i18n.t('user.pleaseSelect')"
              style="display: inline-black"
            >
              <el-option :label="this.$i18n.t('withdraw.everyDay')" :value="1" />
              <el-option :label="this.$i18n.t('withdraw.weekly')" :value="7" />
              <el-option :label="this.$i18n.t('withdraw.monthly')" :value="30" />
              <el-option :label="this.$i18n.t('withdraw.unlimited')" :value="-1" />
            </el-select>

            <el-input
              v-if="dataForm.frequency !== -1"
              v-model.number="dataForm.number"
              style="width: 180px; display: inline-black"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="2"
              @blur="numberInpBlur"
            >
              <template slot="append">{{ $t('distribution.bcTip4') }}</template>
            </el-input>
          </el-form-item>
          <!-- 提现说明 -->
          <el-form-item :label="this.$i18n.t('withdraw.withdrawalInstructions')+':'">
            <el-input
              v-model="dataForm.paymentExplain"
              type="textarea"
              style="width: 455px"
              :rows="5"
              maxlength="50"
              show-word-limit
            />
            <br>
            <span class="tips">{{ $t('withdraw.tip4') }}</span>
          </el-form-item>
          <el-form-item label="">
            <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('distribution.save')}}</div>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :activity-type="1"
      @refreshSelectProds="selectDistributionProds"
    />
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-multiSelect'
// import {validNoEmptySpace } from '@/utils/validate'
export default {
  components: {
    ProdsSelect
  },
  data () {
    // 消费次数校验规则
    var isExpenseNumber = (rule, value, callback) => {
      if (!this.isexpense_number) {
        callback()
      }
      if (!Number.isInteger(value)) {
        callback(new Error(this.$i18n.t('distribution.errorIntegerTip1')))
        return
      }
      if (parseInt(value) > 1000) {
        callback(new Error(this.$i18n.t('distribution.errorIntegerTip2')))
        return
      }
      if (parseInt(value) <= 0) {
        callback(new Error(this.$i18n.t('distribution.errorIntegerTip3')))
        return
      }
      callback()
    }
    // 消费金额校验规则
    var isExpenseAmount = (rule, value, callback) => {
      if (!this.isexpense_amount) {
        callback()
      }
      // eslint-disable-next-line no-useless-escape
      var reg = /^(([0-9]+[\.]?[0-9]{1,2})|[1-9])$/
      if (!reg.test(value)) {
        callback(new Error(this.$i18n.t('distribution.decimalTip1')))
        return
      }
      if (parseFloat(value) > 10000) {
        callback(new Error(this.$i18n.t('distribution.decimalTip2')))
        return
      }
      callback()
    }
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      prodsSelectVisible: false,
      // 是否指定商品
      isProd: false,
      // 是否指定单数
      isExpenseNumber: false,
      // 是否指定消费
      isExpenseAmount: false,
      productVOList: [],
      dataForm: {
        distributionSwitch: 0,
        attribution: 1,
        autoCheck: 0,
        expenseNumber: null,
        prodIdList: [],
        productVOList: [],
        expenseAmount: null,
        realName: false,
        identityCardPic: false,
        identityCardNumber: false,
        frequency: null,
        amountMax: '',
        amountMin: '',
        paymentExplain: null,
        number: null,
        withdrawal: 2
      },
      rules: {
        expenseNumber: [
          { validator: isExpenseNumber, trigger: 'blur' }
        ],
        expenseAmount: [
          { validator: isExpenseAmount, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    language () {
      return this.$store.getters.language
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 提现次数
    numberInpBlur () {
      if (this.dataForm.number > 10) {
        this.dataForm.number = 10
      }
      if (this.dataForm.number < 1) {
        this.dataForm.number = 1
      }
    },
    // 获取数据
    getData () {
      this.$http({
        url: this.$http.adornUrl(`/platform/distributionConfig/info`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data !== null) {
          this.setDate(data)
        }
      })
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
      if (this.dataForm.productVOList == null) {
        this.dataForm.productVOList = []
      }
      this.dataForm.productVOList.forEach(el => {
        el.pic = el.pic.indexOf('http') > -1 ? el.pic : this.resourcesUrl + el.pic
      })
      this.productVOList = this.dataForm.productVOList
      if (this.dataForm.expenseNumber > 0) {
        this.isExpenseNumber = true
      }
      if (this.dataForm.expenseAmount > 0) {
        this.isExpenseAmount = true
      }
      if (this.dataForm.prodIdList != null && this.dataForm.prodIdList.length > 0) {
        this.isProd = true
      }
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const prodIdList = []
        if (this.productVOList && this.isProd) {
          this.productVOList.forEach(element => {
            prodIdList.push(element.prodId)
          })
        }
        this.dataForm.prodIdList = prodIdList
        if (this.isProd && this.dataForm.prodIdList.length <= 0) {
          this.$message({
            message: this.$i18n.t('marketing.pleaseSelectAProduct'),
            type: 'error',
            duration: 1500
          })
          return
        }
        if (!this.isProd) {
          this.dataForm.prodIdList = []
        }
        if (this.dataForm.expenseNumber === '.' || this.dataForm.expenseNumber === '-' || this.dataForm.expenseAmount === '.' || this.dataForm.expenseAmount === '-') {
          return
        }
        if (this.isExpenseNumber && !this.dataForm.expenseNumber) {
          this.$message({
            message: this.$i18n.t('distribution.errorIntegerTip1'),
            type: 'error',
            duration: 1500
          })
          return
        }
        // if (validNoEmptySpace(this.dataForm.amountMin) || validNoEmptySpace(this.dataForm.amountMax)) {
        //   this.$message({
        //     message: this.$i18n.t('withdraw.eachWithdrawal') + this.$i18n.t('order.cannotEmpty'),
        //     type: 'error',
        //     duration: 1500
        //   })
        //   return
        // }
        if (this.dataForm.amountMin < 1) {
          this.$message({
            message: this.$i18n.t('withdraw.errotTip1'),
            type: 'error',
            duration: 1500
          })
          return
        }
        if (this.dataForm.amountMax > 20000) {
          this.$message({
            message: this.$i18n.t('withdraw.errorTip7'),
            type: 'error',
            duration: 1500
          })
          return
        }
        if (this.dataForm.amountMax < this.dataForm.amountMin) {
          this.$message({
            message: this.$i18n.t('withdraw.errorTip2'),
            type: 'error',
            duration: 1500
          })
          return
        }
        if (this.isExpenseAmount && !this.dataForm.expenseAmount) {
          this.$message({
            message: this.$i18n.t('distribution.decimalTip1'),
            type: 'error',
            duration: 1500
          })
          return
        }
        if (this.dataForm.autoCheck === 1) {
          if (!this.isExpenseNumber && !this.isProd && !this.isExpenseAmount) {
            this.$message({
              message: this.$i18n.t('distribution.systemJudgmentTips'),
              type: 'error',
              duration: 1500
            })
            return
          }
        }
        const param = this.dataForm
        console.log(param)
        this.$http({
          url: this.$http.adornUrl(`/platform/distributionConfig`),
          method: 'post',
          data: this.$http.adornData(param)
        }).then(data => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
            }
          })
        }).catch((e) => {
        })
      })
    },
    /**
     * 切换选项数据初始化
     */
    changeRadio (autoCheck) {
      if (autoCheck === 0) {
        this.isProd = false
        this.dataForm.productVOList = []
        this.productVOList = []
        this.isExpenseNumber = false
        this.dataForm.expenseNumber = null
        this.isExpenseAmount = false
        this.dataForm.expenseAmount = null
      }
    },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.productVOList)
      })
    },
    // 商品选择回调
    selectDistributionProds (prods) {
      if (prods) {
        console.log('prods: ', prods)
        this.productVOList = []
        for (var i in prods) {
          this.productVOList.push(prods[i])
        }
      }
    },
    // 删除指定商品
    deleteProd (index) {
      console.log(this.productVOList)
      this.productVOList.splice(index, 1)
    },
    // 清除消费次数数据
    removeExpenseAmount () {
      this.dataForm.expenseAmount = null
    },
    // 清除消费金额数据
    removeExpenseNumber () {
      this.dataForm.expenseNumber = null
    },
    // 消费次数上限校验
    checkNumber () {
      const inNumber = Math.round(parseInt(this.dataForm.expenseNumber))
      if (inNumber < 1) {
        this.dataForm.expenseNumber = 1
      } else {
        this.dataForm.expenseNumber = inNumber > 1000 ? 1000 : inNumber
      }
    },
    // 消费金额校验
    checkAmount () {
      const inAmount = parseFloat(this.dataForm.expenseAmount).toFixed(2)
      if (inAmount < 0) {
        this.dataForm.expenseAmount = 0
      } else {
        this.dataForm.expenseAmount = inAmount > 10000 ? 10000 : inAmount
      }
    },
    // 单笔最小金额检验
    checkamountMin () {
      if (this.dataForm.amountMin === '') {
        return
      }
      const inAmount = parseFloat(this.dataForm.amountMin).toFixed(2)
      if (inAmount < 1) {
        this.dataForm.amountMin = 1
      } else {
        this.dataForm.amountMin = inAmount > 20000 ? 20000 : inAmount
      }
    },
    // 单笔最大金额检验
    checkamountMax () {
      if (this.dataForm.amountMax === '') {
        return
      }
      const inAmount = parseFloat(this.dataForm.amountMax).toFixed(2)
      if (inAmount < 1) {
        this.dataForm.amountMax = 1
      } else {
        this.dataForm.amountMax = inAmount > 20000 ? 20000 : inAmount
      }
    }
  }
}
</script>
<style lang="scss">
.mod-marketing-distribution-item {
  .input-group .el-form-item--small {
    display: inline-block;
  }
  .input-group .el-form-item--mini {
    display: inline-block;
  }
  .input-group {
    margin-left: 72px;
  }
  .marginBottom{
    margin-bottom: 10px;
  }
  .el-form-item__content {
    margin-left: 0px !important;
  }
  .form-item-content {
    .lastItem {
      margin-top: 0px;
    }
  }
  .productStyle {
    margin: 5px 10px 0px 68px;
    float:left
  }
  .productStyleEn {
     margin: 5px 10px 0px 142px;
  }
  .performanceAttribution{
    color: #155BD4;
    margin-left: 6px;
    font-size: 15px;
  }
}
.performanceAttribution-content{
  max-width: 300px;
}
</style>
