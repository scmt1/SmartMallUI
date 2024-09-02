<template>
  <div class="login" :style="backgroundImage">
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <img :src="configuration.bsLoginLogoImg" style="max-height: 45px;max-width: 174px;"  alt />
          <span class="login-title" v-if="this.$i18n.t('language')=='English'">{{configuration.bsTitleContentEn}}</span>
          <span class="login-title" v-else>{{configuration.bsTitleContentCn}}</span>
        </div>
      </div>
      <div class="mid">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
        >
          <el-form-item prop="username">
            <el-input
              class="info"
              v-model="dataForm.username"
              maxlength="16"
              :placeholder="this.$i18n.t('sys.userName')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="info"
              v-model="dataForm.password"
              type="password"
              maxlength="16"
              show-password
              :placeholder="this.$i18n.t('sys.password')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="mobile">
            <div class="mobile-box">
              <div class="mobile-int">
                <el-input
                  class="info"
                  v-model="dataForm.mobile"
                  type="text"
                  maxlength="11"
                  :placeholder="this.$i18n.t('distribution.phoneNum')"
                >
                  <div v-if="show" slot="append" class="get-code-btn" @click="geCode()">{{ $t('shop.getVerificationCode') }}</div>
                  <div v-else  slot="append" class="get-code-btn">{{ count }} s</div>
                </el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="validCode">
            <el-input
              class="info"
              v-model="dataForm.validCode"
              type="text"
              :placeholder="this.$i18n.t('home.verificationCode')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <div class="item-btn default-btn primary-btn" @click="dataFormSubmit()">{{ $t('homes.register') }}</div>
              <!-- <input type="button" :value="this.$i18n.t('homes.register')" @click="dataFormSubmit()" /> -->
              <div class="bottom-row">
                <div class="protocol" v-if="this.merchantRegisterProtocolSwitch === true">
                  <el-checkbox v-model="checked" @change="changeCheckbox" />
                  <div class="ag-txt">{{ $t('homes.readConsent') }}<span class="default-btn text-btn" @click="queryRegisterProtocol">《{{ $t('homes.registerProtocol') }}》</span></div>
                </div>
                <div class="to-login">{{ $t('homes.alreadyAccount') }}？<span class="default-btn text-btn" @click="toLogin">{{ $t('homes.goToLogin') }}</span></div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom">{{
        $i18n.t('language') === 'English' ?
        configuration.bsCopyrightEn : configuration.bsCopyrightCn
        }}</div>
    </div>


    <!-- 商家注册协议弹窗 -->
    <el-dialog
      :title="this.$i18n.t('homes.registerProtocol')"
      :visible.sync="protocolDialogVisible"
      width="80%"
      top="6vh"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="merchant-register-protocol"
    >
      <div class="registration-agreement">
        <div v-html="registerProtocol" />
      </div>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="protocolDialogVisible = false">关闭</el-button> -->
        <div class="default-btn primary-btn" @click="readAndAgree">{{ $t('homes.readConsent') }}</div>
      </div>
    </el-dialog>

    <!-- 注册成功提示弹窗 -->
    <el-dialog
      :title="this.$i18n.t('text.tips')"
      :visible.sync="dialogVisible"
      width="350px"
      center
      class="success-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      :append-to-body="true"
      top="25vh"
    >
      <img src="~@/assets/img/success.png" class="success-icon">
      <div class="txt">{{ $t('homes.registerSuccess') }}</div>
    </el-dialog>

  </div>
</template>

<script>
import { isMobile, isUserName } from '@/utils/validate'
import { encrypt } from '@/utils/crypto'
export default {
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('homes.InputCorrectPhone')))
      } else {
        callback()
      }
    }
    const validateUserName = (rule, value, callback) => {
      if (!isUserName(value)) {
        callback(new Error(this.$i18n.t('homes.InputCorrectUsername')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      var reg = /[^\w]/
      if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shopProcess.addShopErrorTip7')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        username: '',
        password: '',
        mobile: '',
        validCode: ''
      },

      // 背景样式
      backgroundImage: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        position: 'fixed',
        top: 0
      },

      configuration: {
        bsLoginLogoImg: null,
        bsLoginBgImg: null,
        bsCopyrightCn: null,
        bsCopyrightEn: null,
        bsTitleContentCn: null,
        bsTitleContentEn: null,
        bsTitleImg: null,
        bsMenuTitleOpenCn: null,
        bsMenuTitleOpenEn: null,
        bsMenuTitleCloseCn: null,
        bsMenuTitleCloseEn: null
      },

      isSubmit: false,
      dataRule: {
        username: [
          { required: true, message: this.$i18n.t('home.userNameNoNull'), trigger: 'blur' },
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$i18n.t('home.pawNoNull'), trigger: 'blur' },
          { min: 6, max: 16, message: this.$i18n.t('homes.InputCorrectPassword'), trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        validCode: [
          { required: true, message: this.$i18n.t('home.capNoNull'), trigger: 'blur' }
        ]
      },

      // 验证码相关
      show: true,
      count: '',
      timer: null,
      hadGotCode: false,

      // 已阅读协议
      checked: false,
      // 协议弹窗显隐
      protocolDialogVisible: false,
      // 注册协议
      registerProtocol: '',
      merchantRegisterProtocolSwitch: true,
      // 注册成功弹窗显隐
      dialogVisible: false
    }
  },
  created () {
    this.getWebConfigData()
  },
  methods: {
    // 多选框变化
    changeCheckbox (val) {
      this.checked = val
    },
    /**
     * 商家注册协议
     */
    queryRegisterProtocol () {
      this.protocolDialogVisible = true
      this.$http({
        url: this.$http.adornUrl('/shop/shopUserRegister/getMerchantRegisterProtocol'),
        method: 'get'
      }).then(({data}) => {
        this.registerProtocol = this.DOMPurify.sanitize(JSON.parse(data).content)
      })
    },
    // 已阅读并同意注册协议
    readAndAgree () {
      this.protocolDialogVisible = false
      this.checked = true
    },

    /**
     * 获取验证码
     */
    geCode () {
      if (!this.dataForm.mobile || !isMobile(this.dataForm.mobile)) {
        this.$refs.dataForm.validateField('mobile')
        return
      }
      if (this.hadGotCode) {
        return
      }
      // 判断值
      this.hadGotCode = true
      this.$http({
        url: this.$http.adornUrl('/shop/shopUserRegister/sendCode'),
        method: 'post',
        data: this.$http.adornData({
          mobile: this.dataForm.mobile,
          shopAccount: 1 // 是否店铺账号： 1是
        })
      }).then(({ data }) => {
        const timeCount = 60
        if (!this.timer) {
          this.count = timeCount
          this.show = false
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= timeCount) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
              this.hadGotCode = false
            }
          }, 1000)
        }
      }).catch(() => {
        this.hadGotCode = false
      })
    },

    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.checked) {
            this.$message({
              message: this.$i18n.t('homes.readFirst') + '《' + this.$i18n.t('homes.registerProtocol') + '》',
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.isSubmit) {
            return
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/shop/shopUserRegister'),
            method: 'POST',
            data: this.$http.adornData({
              username: this.dataForm.username,
              password: encrypt(this.dataForm.password),
              mobile: this.dataForm.mobile,
              validCode: this.dataForm.validCode
            })
          }).then(({ data }) => {
            this.dialogVisible = true
            setTimeout(() => {
              this.dialogVisible = false
              this.toLogin()
            }, 1500)
            this.isSubmit = false
          }).catch(() => {
            this.isSubmit = false
          })
        }
      })
    },

    // 获取网站配置信息
    getWebConfigData () {
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/getActivity'),
        method: 'get'
      }).then(({data}) => {
        this.$store.commit('webConfig/addData', data)
        this.configuration = data
        this.backgroundImage.backgroundImage = 'url(' + data.bsLoginBgImg + ')'
        this.merchantRegisterProtocolSwitch = data.merchantRegisterProtocolSwitch
        if (this.merchantRegisterProtocolSwitch === false) {
          this.readAndAgree()
        }
      })
    },

    // 去注册
    toLogin () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  /*background: url(~@/assets/img/login-bg.png) no-repeat;*/
  background: no-repeat;
  background-size: cover;
  position: fixed;
  top:0
}
.login .login-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  padding-top: 10%;
}
.login .login-box .top {
  margin-bottom: 30px;
  text-align: center;
}
.login .login-box .top .logo {
  font-size: 0;
}
.login-title {
  font-size: 30px;
  color: #000;
  margin: 0.5em 0;
  vertical-align: middle;
  margin-left: 20px;
  font-size: 28px;
}
.login .login-box .top .company {
  font-size: 16px;
  margin-top: 10px;
}
.login .login-box .mid {
  font-size: 14px;
}
// 手机号
.login .login-box .mid .mobile-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.login .login-box .mid .mobile-box .mobile-int {
  width: 100%;
}
// .login .login-box .mid .mobile-box .mobile-int {
//   & ::v-deep .el-input__inner {
//     border-radius: 4px 0 0 4px;
//   }
// }
.login .login-box .mid .mobile-box .get-code-btn {
  // display: block;
  // width: 20%;
  // min-width: 90px;
  // height: 40px;
  // text-align: center;
  // background:#f8f8f8;
  // border: 1px solid #DCDFE6;
  // border-radius: 0 4px 4px 0;
  // box-sizing: border-box;
  // border-left: 0;
  cursor: pointer;
}
.login .login-box .mid .mobile-box .get-code-btn.num {
  cursor: not-allowed;
}

// .login .login-box .mid .item-btn {
//   margin-top: 20px;
// }
.login .login-box .mid .btn-box .item-btn {
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.login .login-box .mid .btn-box .to-login {
  display: block;
  text-align: right;
  color: #999;
}
.login .login-box .mid .btn-box .bottom-row {
  margin-top: 10px;
  line-height: 1.5em;
}
.login .login-box .mid .btn-box .bottom-row,
.login .login-box .mid .btn-box .bottom-row .protocol {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login .login-box .mid .btn-box .bottom-row .protocol .ag-txt {
  margin-left: 5px;
}

// .info {
//   width: 410px;
// }
.login-captcha {
  height: 40px;
}
.login .login-box .bottom {
  position: absolute;
  bottom: 10%;
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}

// 注册成功弹窗
.success-dialog {
  & ::v-deep .el-dialog__header {
    border: none;
  }
  & ::v-deep .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 10px;
    padding-bottom: 30px;
    padding-left: 30px;
    padding-right: 30px;
    .txt {
      // text-align: center;
      font-size: 15px;
      line-height: 1em;
    }
    .success-icon {
      display: block;
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
}

@media screen and ( max-height: 768px ) {
  .login .login-box {
    padding-top: 5%;
  }
  .login .login-box .bottom {
    bottom: 8%;
  }
}

@media screen and ( max-height: 480px ){

.login .login-box {
  padding-top: 2%;
}
.login .login-box .bottom {
  bottom: 0;
}

}
</style>
