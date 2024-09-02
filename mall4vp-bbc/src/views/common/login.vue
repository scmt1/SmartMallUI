<template>
  <div class="login" :style="backgroundImage">
    <div class="login-box">
      <div class="top">
        <div class="logo">
<!--          <img src="~@/assets/img/login-logo.png" alt />-->
          <img
            v-if="configuration.bsLoginLogoImg"
            :src="configuration.bsLoginLogoImg.indexOf('http') === 0 ? configuration.bsLoginLogoImg : resourcesUrl + configuration.bsLoginLogoImg"
            style="max-height: 98px;max-width: 198px;"
            alt
          />
          <span class="login-title">
            {{
              $i18n.t('language') === 'English' ?
              configuration.bsTitleContentEn : configuration.bsTitleContentCn
            }}
         </span>
        </div>
      </div>
      <div class="mid">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          status-icon
        >
          <el-form-item prop="userName">
            <el-input class="info" v-model="dataForm.userName" :placeholder="this.$i18n.t('sys.userName')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="info" v-model="dataForm.password" type="password" :placeholder="this.$i18n.t('sys.password')"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="item-btn default-btn primary-btn" @click="dataFormSubmit()">{{$i18n.t('homes.login')}}</div>
          </el-form-item>
        </el-form>
      </div>

      <div class="bottom">{{
        $i18n.t('language') === 'English' ?
        configuration.bsCopyrightEn : configuration.bsCopyrightCn
        }}</div>
    </div>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :explain="$i18n.t('homes.verifyTip')"
      :img-size="{width:'400px',height:'200px'}"
      @success="login"
    />
  </div>
</template>

<script>
import Verify from '@/components/verifition/Verify'
import { encrypt } from '@/utils/crypto'
import { validNoEmptySpace } from '@/utils/validate'
export default {
  components: {
    Verify
  },
  data () {
    let validateSpace = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('home.loginTip')))
      } else {
        callback()
      }
    }
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataForm: {
        userName: '',
        password: '',
        uuid: '',
        captcha: ''
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
        userName: [
          { required: true, message: this.$i18n.t('home.userNameNoNull'), trigger: 'blur' },
          { validator: validateSpace, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$i18n.t('home.pawNoNull'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$i18n.t('home.capNoNull'), trigger: 'blur' }
        ]
      },
      captchaPath: ''
    }
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.handerKeyup)
  },
  created () {
    this.getWebConfigData()
    document.addEventListener('keyup', this.handerKeyup)
  },
  methods: {
    handerKeyup (e) {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        this.dataFormSubmit()
      }
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$refs.verify.show()
        }
      })
    },
    login (verifyResult) {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl('/platformLogin'),
        method: 'post',
        data: this.$http.adornData({
          'userName': this.dataForm.userName,
          'passWord': encrypt(this.dataForm.password),
          'captchaVerification': verifyResult.captchaVerification
        })
      }).then(({ data }) => {
        this.isSubmit = false
        this.$cookie.set('Authorization_vp', data.accessToken)
        this.$router.replace({ name: 'home' })
      }).catch(() => {
        this.isSubmit = false
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
        if (data.bsLoginBgImg) {
          let bgUrl = data.bsLoginBgImg
          if (bgUrl.indexOf('http') === -1) bgUrl = this.resourcesUrl + bgUrl
          this.backgroundImage.backgroundImage = 'url(' + bgUrl + ')'
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  /*background: url(~@/assets/img/login-bg.png) no-repeat;*/
  background: no-repeat;
  background-size: cover;
  position: fixed;
}
.login .login-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  padding-top: 10%;
  width: 300px;
}
.login .login-box .top {
  margin-bottom: 30px;
  text-align: center;
}
.login .login-box .top .logo {
  font-size: 0;
}
.login .login-box .top .company {
  font-size: 16px;
  margin-top: 10px;
}
.login .login-box .mid {
  font-size: 14px;
}
.login .login-box .mid .item-btn {
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.login-title {
  font-size: 30px;
  margin: 0.5em 0;
  vertical-align: middle;
  margin-left: 0.5em;
}
.info {
  width: 100%;
}
.login .login-box .bottom {
  position: absolute;
  bottom: 10%;
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}
</style>
