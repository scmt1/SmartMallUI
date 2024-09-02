<template>
  <el-dialog :title="this.$i18n.t('shop.withdraw')" :close-on-click-modal="false" :visible.sync="visible" :width="dialogWidth" @close="onClose">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="labelWidth"
    >
      <el-form-item :label="this.$i18n.t('shop.storeName') + '：'" prop="shopName">
        <span class="shop-name">{{dataForm.shopName}}</span>
      </el-form-item>

      <!-- <el-form-item :label="this.$i18n.t('shop.')付款账户：" prop="shopBalance">
        <el-radio v-model="radio" :label="this.$i18n.t('shop.')店铺余额">店铺余额</el-radio>
      </el-form-item>-->

      <el-form-item :label="this.$i18n.t('shop.withdraBala') + '：'" prop="withdrawalAmount">
        <span class="withdrawalAmount">{{settledAmount}}&nbsp;{{$t("admin.dollar")}}</span>
      </el-form-item>

      <el-form-item :label="this.$i18n.t('shop.withdr') +'：'" prop="amount">
        <div>
          <el-input
            type="number"
            v-model="dataForm.amount"
            size="small"
            :placeholder="this.$i18n.t('shop.pleEnWithAmo')"
            :disabled="settledAmount<1"
            @change="checkAmount"
          ></el-input>
          <el-button type="text" class="text-btn" v-if="settledAmount>0" @click="allAmount">{{$t("shop.withdrawAll")}}</el-button>
          <span class="error-tips" v-if="settledAmount<1">{{$t("shop.unToTime")}}</span>
        </div>
      </el-form-item>

      <el-form-item :label="this.$i18n.t('shop.debitCard') + '：'" prop="shopBankCardId">
        <div class="bankcard-box">
          <div
            :class="['bankcard',dataForm.shopBankCardId == item.shopBankCardId?'active':'']"
            @click="clickCard(item.shopBankCardId)"
            v-for="(item,shopBankCardId) in bankCardList"
            :key="shopBankCardId"
          >
            <div class="close-icon" @click="deleteBankCard(item)">×</div>
            <div class="card-num">{{item.cardNo}}</div>
            <div class="card-bottom">
              <div class="card-name">{{item.bankName}}</div>
              <div class="default" v-if="item.isDefault === 1">{{$t("shop.defaultBankCard")}}</div>
              <div
                class="chooseDefault"
                v-if="item.isDefault === 0"
                @click="setDefault(item.shopBankCardId)"
              >{{$t("shop.setAsDefault")}}</div>
            </div>
          </div>
          <div v-if="!bankCardList.length" style="color:#C0C4CC">{{$t("shop.noData")}}</div>
        </div>
      </el-form-item>
      <div class="add-card" :style="'margin-left:'+labelWidth">
        <el-button type="text" @click="addBankCard">{{$t("shop.addBankCard")}}</el-button>
      </div>

      <el-form-item :label="this.$i18n.t('shop.smsVerification') + '：'" prop="code">
        <div>
          <el-input size="small" v-model="dataForm.code" placeholder></el-input>
          <!-- <el-button type="primary" @click="sendCode">{{$t("shop.getVerificationCode")}}</el-button> -->
          <div :class="['default-btn primary-btn', showCount && isSendCode ? 'disabled-btn' : '']"  @click="sendCode">{{$t("shop.getVerificationCode") + (showCount && isSendCode ? count : '')}}</div>
        </div>
      </el-form-item>
      <br />
      <div class="yzm-tips" v-if="isSendCode">{{$t("shop.verifySMS")}}：{{this.mobile}}，{{$t("shop.pleaseCheck")}}</div>

      <el-form-item :label="this.$i18n.t('publics.remark') + '：'" prop="shopRemarks">
        <el-input size="small" type="textarea" :placeholder="this.$i18n.t('shop.maximumInput')" maxlength="60" @input="handleInput" v-model="dataForm.shopRemarks"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>

    <addBankCardPop v-if="showAddCardPop" ref="addBankCardPop" @refreshCardList="getShopCardList"></addBankCardPop>
  </el-dialog>
</template>

<script>
import addBankCardPop from './addBankCard'
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
import { validNoEmptySpace } from '@/utils/validate'
export default {
  components: {
    addBankCardPop
  },
  data () {
    var validateShopRemarks = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      radio: true,
      isCheckCard: false,
      showAddCardPop: false,  // 添加银行卡弹框
      dataForm: {
        shopName: '',
        shopBankCardId: '', // 当前选择的银行卡id
        amount: 1,  // 提现金额
        code: null,  // 验证码
        shopRemarks: '' // 备注
      },
      mobile: '',
      settledAmount: 1, // 全部可提现金额
      isSendCode: false,
      dataRule: {
        settledAmount: [
          { required: true, message: this.$i18n.t('shop.withdrawaEmpty'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$i18n.t('shop.pleaseEnteCode'), trigger: 'blur' }
        ],
        shopBankCardId: [
          { required: true, message: this.$i18n.t('shop.pleSelTheBankCard'), trigger: 'blur' }
        ],
        shopRemarks: [
          { validator: validateShopRemarks, trigger: 'blur' }
        ]
      },
      bankCardList: [], // 银行卡列表
      currentCard: {}, // 当前银行卡
      dialogWidth: '',
      defWidth: localStorage.getItem('lang') === 'en' ? 800 : 700,
      labelWidth: localStorage.getItem('lang') === 'en' ? '170px' : '120px',
      count: null,
      showCount: null,
      timer: null
    }
  },
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    init () {
      this.isSendCode = false
      this.visible = true
      this.getDataList()
    },
    /**
     * 输入限制
     */
    handleInput (value) {
      this.dataForm.shopRemarks = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5.]/g, '')
    },
    /**
     * 获取店铺钱包信息
     */
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/shop/withdrawCash/getShopInfo'),
        method: 'get'
      }).then(({ data }) => {
        this.dataForm = data
        this.dataForm.amount = parseFloat(data.amount)
        this.settledAmount = parseFloat(data.amount)
        this.getShopCardList()
      })
    },
    /**
     * 获取店铺绑定的银行卡
     */
    getShopCardList () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopBankCard/getShopBankCardList'),
        method: 'get'
      }).then(({ data }) => {
        this.bankCardList = data
        for (let i = 0; i < this.bankCardList.length; i++) {
          if (this.bankCardList[i].isDefault) {
            this.clickCard(this.bankCardList[i].shopBankCardId)
          }
          if (this.bankCardList[i].isDefault && i !== 0) {
            let t = this.bankCardList[i]
            this.bankCardList[i] = this.bankCardList[0]
            this.bankCardList[0] = t
            break
          }
        }
        this.$set(this.bankCardList, data)
      })
    },
    /**
     * 校验提现金额的格式
     */
    checkAmount () {
      let re = /([0-9]+\.[0-9]{2})[0-9]*/
      let num = parseFloat(this.dataForm.amount.replace(re, '$1'))
      if (num < 0) {
        this.dataForm.amount = 0
      } else if (num > this.settledAmount) {
        this.dataForm.amount = this.settledAmount
      } else {
        this.dataForm.amount = num
      }
    },
    /**
     * 发送验证码
     */
    sendCode () {
      if (this.isSendCode) {
        return
      }
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/sendCode'),
        method: 'post',
        data: this.$http.adornData()
      }).then(({ data }) => {
        this.isSendCode = true
        this.mobile = data
        const timeCount = 60
        if (!this.showCount) {
          this.count = timeCount
          this.showCount = true
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= timeCount) {
              this.count--
            } else {
              clearInterval(this.timer)
              this.isSendCode = false
              this.showCount = false
            }
          }, 1000)
        }
      })
    },
    /**
     * 设置默认银行卡
     */
    setDefault (shopBankCardId) {
      this.$http({
        url: this.$http.adornUrl('/shop/shopBankCard/setDefault'),
        method: 'put',
        data: this.$http.adornData({
          shopBankCardId: shopBankCardId
        })
      }).then(({ data }) => {
        this.getShopCardList()
      })
    },
    /**
     * 选择银行卡
     */
    clickCard (cardId) {
      this.bankCardList.forEach(element => {
        if (element.cardId === cardId) {
          this.currentCard = element
        }
      })
      this.dataForm.shopBankCardId = cardId
    },
    /**
     * 添加银行卡
     */
    addBankCard () {
      this.showAddCardPop = true
      this.$nextTick(() => {
        this.$refs.addBankCardPop.init()
      })
    },
    /**
     * 删除银行卡
     */
    deleteBankCard (item) {
      let cardId = item.shopBankCardId
      if (item.isDefault === 1) {
        return
      }
      this.$http({
        url: this.$http.adornUrl('/shop/shopBankCard/' + cardId),
        method: 'delete'
      }).then(({ data }) => {
        this.getShopCardList()
      })
    },
    onClose () {
      this.visible = false
      this.$emit('refreshDataList', this.page)
    },
    allAmount () {
      this.dataForm.amount = this.settledAmount
    },
    /**
     * 表单提交
     */
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (!this.dataForm.amount || this.dataForm.amount < 1) {
            this.$message({
              message: this.$i18n.t('shop.withdraBalaless'),
              type: 'error',
              duration: 1500
            })
            return
          }
          this.$http({
            url: this.$http.adornUrl('/shop/withdrawCash/apply'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.shop-name {
  font-size: 15px;
}
.balance {
  font-size: 15px;
  color: #e43130;
}
.el-input {
  width: 35%;
}
.el-textarea__inner {
  width: 55%;
  min-height: 100px;
}
div >>> .el-input .el-input--suffix input.el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
}
div >>> .el-textarea__inner {
  width: 60%;
  height: 130px;
}
.yzm-tips {
  display: block;
  color: #aaa;
  margin-left: 120px;
  line-height: 2em;
  margin-bottom: 10px;
}
.error-tips {
  color: #e43130;
}
.add-card {
  display: block;
  margin-left: 120px;
  line-height: 1em;
}
.el-form-item {
  margin-bottom: 15px;
  /* margin-top: 15px; */
}

div >>> .el-dialog__body {
  padding: 10px 20px !important;
}
/* 银行卡 */
.bankcard {
  position: relative;
  display: inline-block;
  width: 250px;
  height: 100px;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 10px;
  margin-right: 20px;
  cursor: pointer;
  margin-top: 10px;
}
.close-icon {
  display: block;
  position: absolute;
  top: 6px;
  right: 6px;
  border: 1px solid #bbb;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  font-size: 12px;
  color: #bbb;
  cursor: pointer;
  z-index: 11;
}
.card-num {
  font-size: 15px;
  line-height: 1.5em;
  color: #333;
  text-align: left;
  margin-bottom: 20px;
  width: 210px;
  /* vertical-align:baseline; */
  /* word-break:break-word; */
}
.card-bottom {
  position: absolute;
  bottom: 10px;
  font-size: 14px;
  display: flex;
  width: 90%;
  justify-content: space-between;
  line-height: 1.5em;
}
.card-name {
  width: 145px;
  flex: 1;
}
.chooseDefault {
  text-align: right;
  /* color: #02a1e9; */
  color: #155BD4;
  cursor: pointer;
  flex: 1;
}
.default {
  color: #999;
  cursor: auto;
}
.active {
  border: 1px solid #155bd4;
}
.bankcard-box{
  display: flex;
  flex-wrap: wrap;
}
</style>
