<template>
<!-- 财务信息 -->
  <div class="shop-finance-info">
    <!-- 表格上方标题 -->
    <div class="table-data-title">
      <div class="text">
        <span class="stress">*</span>{{ $t('shopProcess.add') }}&nbsp;{{ $t('shopProcess.settlementAccount') }}
      </div>
      <div class="tips">
        {{ $t('shopProcess.added') }}
        <span class="txt-bold">{{ bankCartInfoForm.data.length }}</span>
        {{ $t('shopProcess.piece') }}&nbsp;{{ $t('shopProcess.settlementAccount') }}，{{ $t('shopProcess.mostAdd') }}
        <span class="txt-bold">{{ maxNumOfbank }}</span>
        {{ $t('shopProcess.piece') }}&nbsp;{{ $t('shopProcess.settlementAccount') }}，{{ $t('shopProcess.settlementAccountEditTips') }}
      </div>
      <div
        v-if="applyStatus !== 0 && applyStatus !== 1"
        class="edit-btn default-btn primary-btn"
        @click="addBankInfo()"
      >{{ $t('shopProcess.add') }}</div>
      <!-- <div v-if="applyStatus !== 0 && applyStatus !== 1" class="edit-btn" @click="addBankInfo()">
        <span class="plus">+</span>添加
      </div> -->
    </div>

    <!-- 表格 -->
    <div class="table-con settlement-accounts-table">
      <!-- 添加图表 -->
      <el-form
        v-if="applyStatus !== 0 && applyStatus !== 1"
        ref="bankCartInfoForm"
        :model="bankCartInfoForm"
        :rules="bankCartInfoForm.rule"
        size="small"
      >
        <el-table
          ref="settlementAccountsTable"
          :data="bankCartInfoForm.data"
          header-cell-class-name="table-header"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="this.$i18n.t('number')"
            width="80"
          />
          <el-table-column
            prop="bankName"
            :label="this.$i18n.t('shopProcess.bankName')"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'data.' + scope.$index + '.bankName'"
                :rules="bankCartInfoForm.rule.bankName"
              >
                <el-input
                  v-model="scope.row.bankName"
                  :placeholder="$t('shopProcess.brandNameInputTips')"
                  maxlength="20"
                  @blur="
                    scope.row.bankName =
                    scope.row.bankName ?
                    removeHeadAndTailSpaces(scope.row.bankName) :
                    scope.row.bankName
                  "
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="recipientName"
            :label="this.$i18n.t('shopProcess.recipientName')"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'data.' + scope.$index + '.recipientName'"
                :rules="bankCartInfoForm.rule.recipientName"
              >
                <el-input
                  v-model="scope.row.recipientName"
                  maxlength="20"
                  :placeholder="$t('shopProcess.recipientNameInputTips')"
                  @blur="
                    scope.row.recipientName =
                    scope.row.recipientName ?
                    removeHeadAndTailSpaces(scope.row.recipientName) :
                    scope.row.recipientName
                  "
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="cardNo"
            :label="this.$i18n.t('shopProcess.account')"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'data.' + scope.$index + '.cardNo'"
                :rules="bankCartInfoForm.rule.cardNo"
              >
                <el-input v-model="scope.row.cardNo" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('shopProcess.cardNoInputTips')" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="openingBank"
            :label="this.$i18n.t('shopProcess.openingBank')"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'data.' + scope.$index + '.openingBank'"
                :rules="bankCartInfoForm.rule.openingBank"
              >
                <el-input
                  v-model="scope.row.openingBank"
                  :placeholder="$t('shopProcess.branchInputTips')"
                  maxlength="20"
                  @blur="
                    scope.row.openingBank =
                    scope.row.openingBank ?
                    removeHeadAndTailSpaces(scope.row.openingBank) :
                    scope.row.openingBank
                  "
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <i v-if="bankCartInfoForm.data.length > 1" class="el-icon-remove-outline" @click="deleteBankInfoItem(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 展示列表 -->
      <div v-if="applyStatus === 0 || applyStatus === 1" class="show-tab">
        <el-table
          :data="bankCartInfoForm.data"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="this.$i18n.t('number')"
            width="80"
          />
          <el-table-column
            prop="bankName"
            :label="this.$i18n.t('shopProcess.bankName')"
          />
          <el-table-column
            prop="recipientName"
            :label="this.$i18n.t('shopProcess.recipientName')"
          />
          <el-table-column
            prop="cardNo"
            :label="this.$i18n.t('shopProcess.cardNo')"
          />
          <el-table-column
            prop="openingBank"
            :label="this.$i18n.t('shopProcess.openingBank')"
          />
        </el-table>
      </div>

      <!-- 脚部按钮 -->
      <div class="footer">
        <div v-if="applyStatus !== 0 && applyStatus !== 1" class="btn-row">
          <div class="default-btn" @click="toPrevStep">{{ $t('shopProcess.previousStep') }}</div>
          <div class="default-btn primary-btn" @click="saveBankCartInfo">{{ $t('shopProcess.submitApply') }}</div>
        </div>
        <div v-if="applyStatus === 0 || applyStatus === 1" class="btn-row">
          <div class="default-btn" @click="toPrevStep">{{ $t('shopProcess.seePreviousStep') }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { validNoEmptySpace, removeHeadAndTailSpaces } from '@/utils/validate'
export default {
  props: {
    // 申请步骤 4.财务信息
    applyStep: {
      default: 4,
      type: String / Number
    },
    // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
    isNotEdit: {
      default: false,
      type: Boolean
    },
    // 店铺申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
    applyStatus: {
      default: 0,
      type: String / Number
    }
  },
  data () {
    const validEmptyTab = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    // var validateCardNo = (rule, value, callback) => {
    //   if (!(/^([0-9]{1})(\d{12,18})$/).test(value)) {
    //     callback(new Error(this.$i18n.t('shopProcess.cardNoErrorTips')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      removeHeadAndTailSpaces: removeHeadAndTailSpaces,
      // 结算账户最大可添加数
      maxNumOfbank: 5,

      bankCartInfoForm: {
        // 添加的结算账户列表
        data: [
          {
            bankName: '',
            recipientName: '',
            cardNo: '',
            openingBank: ''
          }
        ],
        rule: {
          bankName: [
            { required: true, message: this.$i18n.t('shopProcess.brandNameNotEmpty'), trigger: 'blur' },
            { min: 2, max: 20, message: this.$i18n.t('shopProcess.brandNameErrorTips'), trigger: 'blur' },
            { validator: validEmptyTab, trigger: 'blur' }
          ],
          recipientName: [
            { required: true, message: this.$i18n.t('shopProcess.recipientNameNotEmpty'), trigger: 'blur' },
            { min: 2, max: 20, message: this.$i18n.t('shopProcess.recipientNameInputTips'), trigger: 'blur' },
            { validator: validEmptyTab, trigger: 'blur' }
          ],
          cardNo: [
            { required: true, message: this.$i18n.t('shopProcess.accountNotEmpty'), trigger: 'blur' },
            // { validator: validateCardNo, trigger: 'blur' }
            { validator: validEmptyTab, trigger: 'blur' }
          ],
          openingBank: [
            { required: true, message: this.$i18n.t('shopProcess.openingBankNotEmpty'), trigger: 'blur' },
            { min: 2, max: 20, message: this.$i18n.t('shopProcess.openingBankErrorTips'), trigger: 'blur' },
            { validator: validEmptyTab, trigger: 'blur' }
          ]
        }
      }
    }
  },

  mounted () {
    this.getBankCartInfo()
  },

  methods: {
    /**
     * 获取银行卡列表
     */
    getBankCartInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopBankCard/getShopBankCardList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.bankCartInfoForm.data = data
        if (this.bankCartInfoForm.data === null || this.bankCartInfoForm.data.length === 0) {
          this.bankCartInfoForm.data = [
            {
              bankName: '',
              recipientName: '',
              cardNo: '',
              openingBank: ''
            }
          ]
        }
      })
    },

    /**
     * 增加银行信息项
     */
    addBankInfo () {
      if (this.bankCartInfoForm.data.length < 5) {
        this.bankCartInfoForm.data.push(
          {
            bankName: '',
            recipientName: '',
            cardNo: '',
            openingBank: ''
          }
        )
      } else {
        this.$message({
          message: this.$i18n.t('shopProcess.cardMaxLimitTips'),
          type: 'error',
          duration: 1000
        })
        // this.$message.error('最多可添加5个结算账户')
      }
    },

    /**
     * 删除银行信息项
     * @param {Number} index 索引
     */
    deleteBankInfoItem (index) {
      this.bankCartInfoForm.data.splice(index, 1)
    },

    /**
     * 保存银行卡信息
     */
    saveBankCartInfo () {
      this.$refs['bankCartInfoForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopBankCard/saveAndApplyShop'),
            method: 'post',
            data: this.bankCartInfoForm.data
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('shopProcess.submitApplySuccessTips'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                // 获取银行卡列表
                this.getBankCartInfo()
                this.$emit('backToFirstStep')
              }
            })
          })
        }
      })
    },

    /**
     * 上一步
     */
    toPrevStep () {
      this.$emit('toPrevStep')
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-finance-info {
  display: block;
  width: 90%;
  margin: 0 auto;
  // 表格上方标题
  .table-data-title {
    display: flex;
    align-items: center;
    height: 50px;
    .text {
      font-size: 16px;
      .stress {
        color: #FF2120;
        padding-right: 5px;
      }
    }
    .tips {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
      .txt-bold {
        color: #333;
      }
    }
    .edit-btn {
      margin-left: auto;
      cursor: pointer;
    }
  }

  // 表格
  .table-con.settlement-accounts-table {
    & >>> .el-form-item {
      margin-top: 16px;
      margin-bottom: 16px;
    }
    // 删除银行卡icon
    .el-icon-remove-outline {
      display: inline-block;
      width: 100%;
      text-align: center;
      vertical-align: middle;
    }
    & >>> .el-icon-remove-outline::before {
      font-size: 20px;
      cursor: pointer;
    }

    .footer {
      margin-top: 50px;
    }
  }
}
</style>
