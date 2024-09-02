<template>
  <!-- 申请开店流程 -->
  <div class="shop-process-container">
    <top-navbar ref="topNavbar" />

    <div class="sp-wrapper">
      <!-- 店铺状态提示框 -->
      <div class="status-prompt-box">
        <!-- 待申请开店状态 -->
        <div v-if="applyStatus === -2" class="status-item apply">
          <i class="el-icon-warning text-icon" />
          <span class="text">{{ $t('shopProcess.notSubmitApplyTips') }}</span>
        </div>
        <!-- 店铺正在审核状态 -->
        <div v-if="applyStatus === 0" class="status-item auditing">
          <i class="el-icon-success text-icon" />
          <span class="text">{{ $t('shopProcess.applyAuditingTips') }}</span>
        </div>
        <!-- 审核未通过状态 -->
        <div v-if="applyStatus === -1" class="status-item audit-failed">
          <i class="el-icon-error text-icon" />
          <span class="text">{{ $t('shopProcess.applyFailTips') }}{{ auditingInfo }}</span>
        </div>
      </div>

      <!-- 店铺协议/信息 -->
      <div class="shop-opening-contents">
        <!--
          状态标题
          applyStatus 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核, -2未开店
        -->
        <div class="con-title">
          <span v-if="applyStatus === -2">{{ $t('shopProcess.applyShop') }}</span>
          <span v-if=" applyStatus === 0">{{ $t('shopProcess.applyAuditing') }}</span>
          <span v-if=" applyStatus === -1">{{ $t('shopProcess.applyFail') }}</span>
        </div>

        <!-- 第0步 开店协议 -->
        <div v-if="applyStep === applyStepConstants.shopAgreement" class="agreement-box">
          <div class="sa-content">
            <div v-html="shopProtocol" />
          </div>
          <div class="sa-checkbox">
            <el-checkbox v-model="isAgreen"><span class="text">{{ $t('homes.readConsent') }}<span class="flag">《{{ $t('homes.shopProtocol') }}》</span></span></el-checkbox>
          </div>
          <div class="btn-row">
            <div class="default-btn primary-btn" @click="toNextStep">{{ $t('shopProcess.nextStep') }}</div>
          </div>
        </div>

        <!-- 店铺信息数据 -->
        <div
        v-if="applyStep !== applyStepConstants.shopAgreement" class="shop-content-box">
          <!-- 步骤进度条 -->
          <div class="progress-bar" :class="lang === 'en' ? 'en-progress-bar' : 'zh-progress-bar'">
            <div class="first-step step" :class="{'active-step':applyStep > applyStepConstants.shopAgreement}">
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">1</div>
                  <div class="step-text">{{$t('shopProcess.basicInfo')}}</div>
                </div>
              </div>
            </div>
            <div class="second-step step" :class="{'active-step':applyStep > applyStepConstants.shopBasicInfo}">
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">2</div>
                  <div class="step-text">{{$t('shopProcess.businessInfo')}}</div>
                </div>
              </div>
            </div>
            <div class="third-step step" :class="{'active-step':applyStep > applyStepConstants.shopBusinessInfo}">
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">3</div>
                  <div class="step-text">{{$t('shopProcess.signUpInfo')}}</div>
                </div>
              </div>
            </div>
            <div class="fourth-step step" :class="{'active-step':applyStep > applyStepConstants.shopSigningInfo}">
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">4</div>
                  <div class="step-text">{{$t('shopProcess.financeInfo')}}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第一步 基本信息 -->
          <div v-if="applyStep === applyStepConstants.shopBasicInfo" class="shop-content">
            <shop-process-basic
              :applyStep="applyStep"
              :isNotEdit="isNotEdit"
              :applyStatus="applyStatus"
              @toNextStep="toNextStep"
              @viewNextStep="viewNextStep"
            />
          </div>

          <!-- 第二步 工商信息 -->
          <div v-if="applyStep === applyStepConstants.shopBusinessInfo" class="shop-content">
            <shop-process-business
              :applyStep="applyStep"
              :isNotEdit="isNotEdit"
              :applyStatus="applyStatus"
              @toNextStep="toNextStep"
              @toPrevStep="toPrevStep"
              @viewNextStep="viewNextStep"
            />
          </div>

          <!-- 第三步 签约信息 -->
          <div v-if="applyStep === applyStepConstants.shopSigningInfo" class="shop-content">
            <!-- 类目 -->
            <shop-signing-list
              :signingType="1"
              :applyStep="applyStep"
              :isNotEdit="isNotEdit"
              :applyStatus="applyStatus"
              @getCategories="getCategories"
            />
            <!-- 品牌 -->
            <shop-signing-list
              :signingType="2"
              :applyStep="applyStep"
              :isNotEdit="isNotEdit"
              :applyStatus="applyStatus"
            />

            <div class="footer">
              <div v-if="applyStatus !== 0 && applyStatus !== 1" class="btn-row">
                <div class="default-btn" @click="toPrevStep">{{$t('shopProcess.previousStep')}}</div>
                <div class="default-btn primary-btn" @click="toNextStep">{{$t('shopProcess.nextStep')}}</div>
              </div>
              <div v-if="applyStatus === 0 || applyStatus === 1" class="btn-row">
                <div class="default-btn" @click="toPrevStep">{{$t('shopProcess.seePreviousStep')}}</div>
                <div class="default-btn primary-btn" @click="viewNextStep">{{$t('shopProcess.seeNextStep')}}</div>
              </div>
            </div>
          </div>

          <!-- 第四步 财务信息 -->
          <div v-if="applyStep === applyStepConstants.shopFinanceInfo" class="shop-content">
            <shop-process-finance
              :applyStep="applyStep"
              :isNotEdit="isNotEdit"
              :applyStatus="applyStatus"
              @backToFirstStep="backToFirstStep"
              @toPrevStep="toPrevStep"
            />
          </div>

        </div>
      </div>


    </div>
  </div>
</template>

<script>
import TopNavbar from './top-navbar'
import shopProcessBasic from './shop-process-basic'
import shopProcessBusiness from './shop-process-business'
import shopSigningList from './shop-signing-list'
import shopProcessFinance from './shop-process-finance'
export default {
  components: {
    TopNavbar,
    shopProcessBasic,
    shopProcessBusiness,
    shopSigningList,
    shopProcessFinance
  },
  data () {
    return {
      // 语言
      lang: window.localStorage.getItem('lang'),
      // 申请步骤
      applyStep: 0,
      // 申请步骤
      applyStepConstants: {
        // 开店协议
        shopAgreement: 0,
        // 基本信息
        shopBasicInfo: 1,
        // 工商信息
        shopBusinessInfo: 2,
        // 签约信息
        shopSigningInfo: 3,
        // 财务信息
        shopFinanceInfo: 4
      },
      // 店铺申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
      applyStatus: -2,
      // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
      isNotEdit: false,
      // 申请不通过理由
      auditingInfo: this.$i18n.t('shopProcess.incompleteInformation'),
      // 开店协议
      shopProtocol: '',
      // 是否已阅读开店协议
      isAgreen: false,
      // 是否开启开店协议开关
      shopProtocolSwitch: true,
      // 已签约类目列表
      signedCategories: []
    }
  },

  mounted () {
    // 获取店铺审核状态
    this.getAuditingInfo()
    if (this.applyStep === 0) {
      // 开店协议
      this.getShopProtocol()
    }
  },

  methods: {
    /**
     * 获取开店协议
     */
    getShopProtocol () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopUserRegister/getShopProtocol`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.shopProtocol = this.DOMPurify.sanitize(JSON.parse(data).content)
        }
        if (this.applyStep === 0) {
          if (this.shopProtocolSwitch === false) {
            this.isAgreen = true
            this.toNextStep()
          }
        }
      })
    },

    /**
     * 获取店铺审核状态信息
     */
    getAuditingInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopDetail/getAuditingInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          // 审核状态status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核
          this.applyStatus = data.status
          this.auditingInfo = data.remarks
          this.isNotEdit = data.status === 0 || data.status === 1
          this.shopProtocolSwitch = data.shopProtocolSwitch
        } else {
          // 未开店
          this.applyStatus = -2
        }
        if (this.applyStatus === 0) {
          this.applyStep = 1
        }
      })
    },

    /**
     * 获取已签约分类列表
     */
    getCategories (list) {
      this.signedCategories = list
    },

    /**
     * 提交申请后
     */
    backToFirstStep () {
      // 获取店铺审核信息
      this.getAuditingInfo()
    },

    /**
     * 上一步
     */
    toPrevStep () {
      this.applyStep -= 1
    },
    // 查看下一步
    viewNextStep () {
      this.applyStep += 1
    },
    // 下一步
    toNextStep () {
      if (this.applyStep === 0 && !this.isAgreen) {
        this.$message({
          message: this.$i18n.t('shopProcess.readShopProtocolTips'),
          type: 'error',
          duration: 1500
        })
        return
      }
      if (this.applyStep === 3 && !this.signedCategories.length) {
        this.$message({
          message: this.$i18n.t('shopProcess.categorySigningNotEmpty'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.applyStep += 1
      if (this.applyStep === 2) {
        this.$refs.topNavbar.getUserInfo()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-process-container {
  .sp-wrapper {
    display: block;
    width: 90%;
    min-width: 1044px;
    margin: 30px auto;
    /** 公共样式 **/
    & >>> .btn-row {
      display: block;
      text-align: center;
      margin-top: 30px;
    }
    /** 公共样式 end **/

    // 状态提示框
    .status-prompt-box {
      .status-item {
        display: block;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        .text {
          padding-left: 5px;
          color: #666;
          line-height: 1.5em;
          vertical-align: middle;
          word-break: break-word;
        }
        .text-icon {
          font-size: 16px;
          line-height: 1.5em;
          vertical-align: middle;
        }
        &.apply {
          background: #FFF7DD;
          border: 1px solid #FFD888;
          .text-icon {
            color: #ffa900;
          }
        }
        &.auditing {
          background: rgba(24, 144, 255, 0.08);
          border: 1px solid #155bd4;
          .text-icon {
            color: #155bd4;
          }
        }
        &.audit-failed {
          background: rgba(255, 33, 32, 0.05);
          border: 1px solid #FF2120;
          .text-icon {
            color: #FF2120;
          }
        }
      }
    }

    // 店铺协议/信息
    .shop-opening-contents {
      display: block;
      width: 100%;
      margin: 30px 0;
      // 状态标题
      .con-title {
        text-align: center;
        font-size: 22px;
        margin-bottom: 30px;
      }

      // 0-协议
      .agreement-box {
        .sa-content {
          width: 100%;
          height: 517px;
          padding: 30px 33px 25px;
          border: 1px solid #EAEAEA;
          box-sizing: border-box;
          overflow-y: scroll;
          /* 谷歌隐藏滚动条 */
          &::-webkit-scrollbar {
            display: none;
          }
          /* 隐藏滚动条，当IE下溢出，仍然可以滚动 */
          /* IE隐藏滚动条 */
          -ms-overflow-style: none;
          /* 火狐隐藏滚动条 */
          overflow: -moz-scrollbars-none;
        }
        .sa-checkbox {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          cursor: pointer;
          .text {
            font-size: 14px;
            color: #000;
            .flag {
              color: #155bd4;
            }
          }
        }
      }

      // 店铺信息数据
      .shop-content-box {
        display: block;
        width: 100%;
        border: 1px solid #EAEAEA;
        padding-bottom: 30px;
        .footer {
          width: 90%;
          margin: 0 auto;
        }
        // 进度条
        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1010px;
          overflow: hidden;
          margin: 50px auto;
          .step {
            position: relative;
            width: 315px;
            .step-item {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              .step-num {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                background: #D2D2D2;
                text-align: center;
                border: 4px solid #EFEFEF;
                border-radius: 50%;
                margin: 0 auto;
                z-index: 10;
              }
              .step-text {
                width: 64px;
                font-size: 16px;
                color: #999;
                margin-top: 18px;
              }
            }
            &::after {
              position: absolute;
              top: 15px;
              left: -280px;
              content: '';
              display: block;
              width: 300px;
              height: 6px;
              background: #F2F2F2;
            }
            &:nth-child(1) {
              &::after {
                display: none;
              }
            }
            &:nth-child(4) {
              width: 64px;
            }
          }
          .active-step {
            .step-item {
              .step-text {
                color: #155bd4;
              }
              .step-num {
                background: #155bd4;
                border: 4px solid #DEEFFF;
              }
            }
            &::after {
              background: #C1E1FF;
            }
          }
        }
        // 国际化 -English
        .progress-bar.en-progress-bar {
          .step {
            width: 255px;
            &::after {
              left: -180px;
              width: 250px;
            }
          }
          .step-item {
            width: 150px;
            .step-text {
              width: 150px;
              text-align: center;
            }
          }
        }
        // 店铺信息
        .shop-content {
          width: 100%;
        }
      }
    }

  }
}
</style>
