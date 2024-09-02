<template>
<!-- 工商信息 -->
  <div class="shop-business">
    <el-form
      ref="companyInfoForm"
      :model="companyInfoForm"
      :rules="companyInfoRule"
      label-width="auto"
      size="small"
    >
      <div class="ci-wrapper">
        <div class="left-info">
          <el-form-item :label="this.$i18n.t('shopProcess.creditCode')" prop="creditCode">
            <el-input v-model="companyInfoForm.creditCode" maxlength="20" :placeholder="this.$i18n.t('shopProcess.creditCodeInputTips')" :disabled="isNotEdit" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.firmName')" prop="firmName">
            <el-input
              v-model="companyInfoForm.firmName"
              maxlength="50"
              :placeholder="this.$i18n.t('shopProcess.firmNameInputTips')"
              :disabled="isNotEdit"
              @blur="
                companyInfoForm.firmName =
                companyInfoForm.firmName ?
                removeHeadAndTailSpaces(companyInfoForm.firmName) :
                companyInfoForm.firmName
              "
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.residence')" prop="residence">
            <el-input
              v-model="companyInfoForm.residence"
              maxlength="50"
              :placeholder="this.$i18n.t('shopProcess.residenceInputTips')"
              :disabled="isNotEdit"
              @blur="
                companyInfoForm.residence =
                companyInfoForm.residence ?
                removeHeadAndTailSpaces(companyInfoForm.residence) :
                companyInfoForm.residence
              "
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.representative')" prop="representative">
            <el-input
              v-model="companyInfoForm.representative"
              maxlength="20"
              :placeholder="this.$i18n.t('shopProcess.representativeInputTips')"
              :disabled="isNotEdit"
              @blur="
                companyInfoForm.representative =
                companyInfoForm.representative ?
                removeHeadAndTailSpaces(companyInfoForm.representative) :
                companyInfoForm.representative
              "
            />
          </el-form-item>
            <!-- 注册资本 -->
          <el-form-item :label="this.$i18n.t('shopProcess.capital')" class="capital-int" prop="capital">
            <el-input
              v-model="companyInfoForm.capital"
              :disabled="isNotEdit"
              type="text"
              @input="changeNum"
              @keydown.native="channelInputLimit"
            >
              <el-button slot="append">{{$t("shopProcess.tenThousandYuan")}}</el-button>
            </el-input>
            <!-- <span class="price-unit-text">{{$t("shopProcess.tenThousandYuan")}}</span> -->
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.fountTime')" prop="foundTime" class="found-time">
            <el-date-picker
              v-model="companyInfoForm.foundTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="this.$i18n.t('admin.seleData')"
              :disabled="isNotEdit"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.businessTime')" prop="timeRange">
            <el-date-picker
              v-model="companyInfoForm.timeRange"
              type="daterange"
              :range-separator="this.$i18n.t('time.tip')"
              :start-placeholder="this.$i18n.t('shopProcess.startTime')"
              :end-placeholder="this.$i18n.t('shopProcess.endTime')"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="business-term"
              :disabled="isNotEdit"
              :clearable="false"
              @change="handleTimeData"
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('shopProcess.businessScope')" prop="businessScope" style="margin-bottom:30px;">
            <el-input
              v-model="companyInfoForm.businessScope"
              type="textarea"
              resize="none"
              :rows="4"
              :placeholder="this.$i18n.t('shopProcess.businessScopeInputTips')"
              maxlength="500"
              :disabled="isNotEdit"
              @blur="
                companyInfoForm.businessScope =
                companyInfoForm.businessScope ?
                removeHeadAndTailSpaces(companyInfoForm.businessScope) :
                companyInfoForm.businessScope
              "
            />
          </el-form-item>
        </div>

        <div class="right-info">
          <el-form-item :label="this.$i18n.t('shopProcess.businessLicense')" prop="businessLicense">
            <div class="business-license-box">
              <div class="license-content">
                <img-upload v-if="applyStatus !== 0" v-model="companyInfoForm.businessLicense" @input="imgChange(companyInfoForm.businessLicense, 'businessLicense')" />
                <el-image
                  v-if="applyStatus === 0 && companyInfoForm.businessLicense"
                  class="rotating-img"
                  :src="companyInfoForm.businessLicense.indexOf('http') === 0 ? companyInfoForm.businessLicense : resourcesUrl + companyInfoForm.businessLicense"
                  :preview-src-list="companyInfoForm.businessLicense.indexOf('http') === 0 ? [companyInfoForm.businessLicense] : [resourcesUrl + companyInfoForm.businessLicense]"
                />
                <div class="example-box">
                  <img src="~@/assets/img/example-img/Business-license.png">
                  <div class="tips">{{ $t('shopProcess.example') }}</div>
                </div>
              </div>
              <div class="upload-tips">{{ $t('shopProcess.logoTips') }}</div>
            </div>
          </el-form-item>
          <div class="id-box">
            <div class="upload-content">
              <!-- 法人身份证 -->
              <div class="upload-img" :class="lang === 'en' ? 'en-upload-img' : 'zh-upload-img'">
                <el-form-item class="idcard" :label="this.$i18n.t('shopProcess.corporateIdentityCard')" prop="identityCardFront">
                  <img-upload
                    v-if="applyStatus !== 0 || (applyStatus === 0 && !companyInfoForm.identityCardFront)"
                    v-model="companyInfoForm.identityCardFront"
                    @input="imgChange(companyInfoForm.identityCardFront, 'identityCardFront')"
                  />
                  <el-image
                    v-if="applyStatus === 0 && companyInfoForm.identityCardFront"
                    class="rotating-img"
                    :src="companyInfoForm.identityCardFront.indexOf('http') === 0 ? companyInfoForm.identityCardFront : resourcesUrl + companyInfoForm.identityCardFront"
                    :preview-src-list="companyInfoForm.identityCardFront.indexOf('http') === 0 ?  [companyInfoForm.identityCardFront] : [resourcesUrl + companyInfoForm.identityCardFront]"
                  />
                </el-form-item>
                <el-form-item class="idcard" label-width="0" prop="identityCardLater">
                  <img-upload
                    v-if="applyStatus !== 0 || (applyStatus === 0 && !companyInfoForm.identityCardLater)"
                    v-model="companyInfoForm.identityCardLater"
                    @input="imgChange(companyInfoForm.identityCardLater, 'identityCardLater')"
                  />
                  <el-image
                    v-if="applyStatus === 0 && companyInfoForm.identityCardLater"
                    class="rotating-img"
                    :src="companyInfoForm.identityCardLater.indexOf('http') === 0 ? companyInfoForm.identityCardLater : resourcesUrl + companyInfoForm.identityCardLater"
                    :preview-src-list="companyInfoForm.identityCardLater.indexOf('http') === 0 ? [companyInfoForm.identityCardLater] : [resourcesUrl + companyInfoForm.identityCardLater]"
                  />
                </el-form-item>
              </div>
              
              <div :class="lang === 'en' ? 'en-left' : 'zh-left'">
                <div class="upload-example">
                  <div class="example-box">
                    <img src="~@/assets/img/example-img/idcard1.png">
                    <div class="tips">{{ $t('shopProcess.identityCardFront') }}</div>
                  </div>
                  <div class="example-box">
                    <img src="~@/assets/img/example-img/idcard2.png">
                    <div class="tips">{{ $t('shopProcess.identityCardLater') }}</div>
                  </div>
                </div>
                <div class="upload-tips">{{ $t('shopProcess.identityCardTips') }}</div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <div v-if="applyStatus !== 0 && applyStatus !== 1" class="btn-row">
          <div class="default-btn" @click="toPrevStep">{{$t("shopProcess.previousStep")}}</div>
          <div class="default-btn primary-btn" @click="saveCompanyInfo">{{$t("shopProcess.submitAndNextStep")}}</div>
        </div>
        <div v-if="applyStatus === 0 || applyStatus === 1" class="btn-row">
          <div class="default-btn" @click="toPrevStep">{{$t("shopProcess.seePreviousStep")}}</div>
          <div class="default-btn primary-btn" @click="viewNextStep">{{$t("shopProcess.seeNextStep")}}</div>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { isCreditCode, validNoEmptySpace, removeHeadAndTailSpaces } from '@/utils/validate'
import ImgUpload from '@/components/img-upload'
export default {
  props: {
    // 申请步骤 2.工商信息
    applyStep: {
      default: 2,
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
  components: {
    ImgUpload
  },
  data () {
    const vaildCreditCode = (rule, value, callback) => {
      if (!isCreditCode(value)) {
        callback(new Error(this.$i18n.t('shopProcess.creditCodeErrorTips')))
      } else {
        callback()
      }
    }
    const validEmptyTab = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }

    return {
      lang: window.localStorage.getItem('lang'), // 语言
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 图片前缀

      removeHeadAndTailSpaces: removeHeadAndTailSpaces,
      // 第二步---工商信息
      companyInfoForm: {
        creditCode: '',
        firmName: '',
        residence: '',
        representative: '',
        capital: '',
        foundTime: '',
        startTime: '',
        endTime: '',
        businessScope: '',
        timeRange: [],
        // 上传的图片或pdf
        businessLicense: '',
        identityCardFront: '',
        identityCardLater: ''
      },

      // 成立日期：今日之前可选
      pickerOptions: {
        disabledDate (time) {
          const date = moment().add(0, 'days').startOf('days')
          return (
            time.getTime() >= date.valueOf()
          )
        }
      },
      companyInfoRule: {
        creditCode: [
          { required: true, message: this.$i18n.t('shopProcess.creditCodeInputTips'), trigger: 'blur' },
          { validator: vaildCreditCode, trigger: 'blur' }
        ],
        firmName: [
          { required: true, message: this.$i18n.t('shopProcess.firmNameNotEmpty'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        residence: [
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        businessScope: [
          { required: true, message: this.$i18n.t('shopProcess.businessScopeNotEmpty'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        timeRange: [
          { required: true, message: this.$i18n.t('shopProcess.businessTimeNotEmpty'), trigger: 'blur' }
        ],
        representative: [
          { required: true, message: this.$i18n.t('shopProcess.representativeNotEmpty'), trigger: 'blur' },
          { validator: validEmptyTab, trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: this.$i18n.t('shopProcess.businessLicenseNotEmpty'), trigger: 'change' }
        ],
        identityCardFront: [
          { required: true, message: this.$i18n.t('shopProcess.identityCardFrontNotEmpty'), trigger: 'change' }
        ],
        identityCardLater: [
          { required: true, message: this.$i18n.t('shopProcess.identityCardLaterNotEmpty'), trigger: 'change' }
        ]
      }
    }
  },

  mounted () {
    if (this.applyStep === 2) {
      this.getCompanyInfo()
    }
  },

  methods: {
    /**
     * 图片的值发生改变，重新校验对应表单字段
     */
    imgChange (value, prop) {
      if (value) {
        this.$refs.companyInfoForm.validateField(prop)
      }
    },

    /**
     * 获取工商信息
     */
    getCompanyInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopCompany`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.companyInfoForm = data
          if (data.startTime && data.endTime) {
            this.$set(this.companyInfoForm, 'timeRange', [data.startTime, data.endTime])
          }
        }
      })
    },

    /**
     * 保存工商信息
     */
    saveCompanyInfo () {
      this.$refs['companyInfoForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopCompany/storage'),
            method: 'post',
            data: this.$http.adornData(this.companyInfoForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('shopProcess.businessSaveSuccess'),
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.toNextStep()
              }
            })
          })
        }
      })
    },

    /**
     * 营业时间赋值
     */
    handleTimeData (value) {
      if (value && value.length) {
        this.companyInfoForm.startTime = value[0]
        this.companyInfoForm.endTime = value[1]
      }
    },

    /**
     * 注册资本输入框校验
     */
    changeNum () {
      const capital = this.companyInfoForm.capital
      this.companyInfoForm.capital = this.checkInput(capital)
      if (Number.parseFloat(this.companyInfoForm.capital) === 0) {
        this.companyInfoForm.capital = 0
      }
      if (Number.parseFloat(this.companyInfoForm.capital) > 99999999) {
        this.companyInfoForm.capital = 99999999
      }
    },
    /**
     * input输入框只允许输入正数和小数(保留小数点后两位)
     */
    checkInput (num) {
      if (num) {
        var tmpVal = num.replace(/[^\d^\\.]/g, '')
        var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
        if (!reg.test(tmpVal)) {
          tmpVal = tmpVal + ''
          tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
          var n = (tmpVal.split('.')).length - 1
          if (n > 1) {
            tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
          }
        }
        return tmpVal
      } else {
        return ''
      }
    },
    /**
     * 输入框不允许输入'-'或'+'
     */
    channelInputLimit (e) {
      const key = e.key
      if (key === '-' || key === '+') {
        e.returnValue = false
        return false
      }
      return true
    },

    /**
     * 上一步
     */
    toPrevStep () {
      this.$emit('toPrevStep')
    },
    /**
     * 查看下一步
     */
    viewNextStep () {
      this.$emit('viewNextStep')
    },
    /**
     * 提交，下一步
     */
    toNextStep () {
      this.$emit('toNextStep')
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-business {
  display: block;
  width: 90%;
  margin: 0 auto;
  .ci-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    // 上传图片提示
    .upload-tips {
      font-size: 12px;
      color: #999;
      height: 16px;
      line-height: 20px;
      margin-top: 13px;
    }
    .left-info,
    .right-info {
      width: 45%;
    }
    // 注册资本
    .capital-int {
      & >>> .el-input {
        width: 60%;
        min-width: 250px;
        .el-input__inner {
          padding-right: 0!important;
          border-radius: 2px 0 0 2px!important;
        }
      }
    }
    // 成立日期
    .found-time {
      & >>> .el-date-editor--date {
        width: 60%;
        min-width: 250px;
      }
    }
    // 营业期限
    & >>> .business-term.el-range-editor.el-input__inner {
      width: 100%;
      .el-range-separator {
        width: 8%;
      }
    }
  }
}

.right-info {
  .license-content {
    display: flex;
  }
  .en-left {
    // margin-left: 240px;
    margin-left: 150px;
  }
  .zh-left  {
    // margin-left: 120px;
    margin-left: 134px;
  }
  // 图片示例
  .upload-example {
    display: flex;
    .example-box {
      margin-left: 0;
      &:nth-child(2) {
        margin-left: 30px;
      }
    }
  }
  // 示例框
  .example-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    min-width: 130px;
    height: 130px;
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    border-radius: 3px;
    box-sizing: border-box;
    margin-left: 30px;
    img {
      display: block;
      width: auto;
      max-width: 100%;
      height: auto;
      max-height: 100%;
    }
    .tips {
      position: absolute;
      left: -1px;
      bottom: 0;
      width: 130px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background: rgba(51, 51, 51, 0.5);
      text-align: center;
      border-radius: 0px 0px 3px 3px;
    }
  }
  .id-box {
    .upload-content {
      .upload-img {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        div {
          &:nth-child(2) {
            margin-left: 30px;
          }
        }
        .disabled-upload {
          & >>> .el-upload {
            background: #f5f7fa;
          }
        }
        & >>> .el-form-item__content {
          height: 130px;
        }
        & >>> .el-form-item {
          margin-bottom: 10px;
        }
      }
      .upload-img.en-upload-img {
        & >>> .el-form-item.is-error {
          margin-bottom: 45px;
        }
      }
      .upload-img.zh-upload-img {
        & >>> .el-form-item.is-error {
          margin-bottom: 22px;
        }
      }
    }
  }
  
}
.shop-business .rotating-img {
    width: 130px;
    height: 130px;
  }
</style>
