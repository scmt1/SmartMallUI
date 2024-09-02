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
          status-icon
        >
          <el-form-item prop="userName">
            <el-input
              class="info"
              v-model="dataForm.userName"
              :placeholder="this.$i18n.t('sys.userName')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="info"
              v-model="dataForm.password"
              type="password"
              :placeholder="this.$i18n.t('sys.password')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <div class="item-btn default-btn primary-btn" @click="dataFormSubmit()">{{$i18n.t('homes.login')}}</div>
              <div class="to-register">
                <div>
                  <span class="default-btn text-btn" @click="toFindPwd">{{ $t('sys.retrievePassword') }}</span>
                </div>
<!--                <div>-->
<!--                  {{ $t('homes.noAccount') }}<span class="default-btn text-btn" @click="toRegister">{{ $t('homes.registration') }}</span>-->
<!--                </div>-->
              </div>
            </div>
            <!-- <div class="item-btn default-btn primary-btn" @click="dataFormSubmit()">{{$i18n.t('homes.login')}}</div> -->
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
import router from '../../router'
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
      dataForm: {
        userName: '',
        password: ''
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
        url: this.$http.adornUrl('/shopLogin'),
        method: 'post',
        data: this.$http.adornData({
          userName: this.dataForm.userName,
          passWord: encrypt(this.dataForm.password),
          'captchaVerification': verifyResult.captchaVerification
        })
      }).then(async ({ data }) => {
        this.isSubmit = false
        this.$cookie.set('Authorization_vs', data.accessToken)
        let user
        try {
          user = await this.$store.dispatch('user/login')
          // 重置菜单路由
          router.options.isAddDynamicMenuRoutes = false
        } catch (error) {
          return
        }
        if (user.shopStatus === 4 || user.shopStatus === 5) {
          // 未开店，跳转申请开店
          await this.$router.push({name: 'shopProcess'})
        } else {
          // 已开店，跳转首页
          await this.$router.replace({name: 'home'})
        }
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
          this.backgroundImage.backgroundImage = 'url(' + data.bsLoginBgImg + ')'
        }
      })
    },

    // 去注册
    toRegister () {
      this.$router.push({ path: '/register' })
    },
    // 去注册
    toFindPwd () {
      this.$router.push({
        path: '/findPwd'
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
  top:0
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
.login .login-box .mid .item-btn {
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.login .login-box .mid .btn-box .to-register {
  display: block;
  margin-top: 10px;
  // text-align: right;
  display: flex;
  justify-content: space-between;
  color: #999;
}

// .info {
//   width: 410px;
// }
.login-captcha {
  height: 40px;
  img {
    height: 100%;
  }
}
.login .login-box .bottom {
  position: absolute;
  bottom: 10%;
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}

@media screen and ( max-height: 580px ){

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
