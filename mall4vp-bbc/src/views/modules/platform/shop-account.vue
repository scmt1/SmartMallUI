<template>
  <el-dialog
    :title="$t('shop.accountManagement')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '160px' : '100px'"
      size="small"
    >
      <!-- 店铺名称 -->
      <el-form-item :label="$t('prodList.shopName')" prop="shopName">
        <el-input v-model="dataForm.shopName" disabled></el-input>
      </el-form-item>

      <!-- 店铺账号(用户名),唯一,可作为登陆账号 -->
      <el-form-item :label="$t('shop.shopAccount')" prop="username">
        <el-row style="width:100%">
          <el-col :span="19">
            <el-input
              v-model="dataForm.username"
              show-word-limit
              :placeholder="$t('shop.addShopErrorTip3')"
              :disabled="!editUsername"
            ></el-input>
          </el-col>
          <el-col :span="5">
            <div class="default-btn text-btn"
              v-if="!editUsername"
              @click="changeEditUsername()"
            >{{$t('platform.modifyAcc')}}</div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('shop.loginPassword')" prop="password">
        <el-input type="password" v-model="dataForm.password" maxlength="50" show-word-limit></el-input>
      </el-form-item>

      <el-form-item :label="$t('sys.confirmPassword')" prop="checkPassword">
        <el-input type="password" v-model="dataForm.checkPassword" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer btn-row">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import ImgsUpload from '@/components/imgs-upload'
import { isUserName } from '@/utils/validate'
export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isUserName(value)) {
        callback(new Error(this.$i18n.t('shop.InputCorrectUsername')))
      } else {
        this.$http({
          url: this.$http.adornUrl('/shop/shopAuditing/checkUsername'),
          method: 'get',
          params: this.$http.adornParams({
            username: this.dataForm.username,
            shopId: this.dataForm.shopId
          })
        }).then(({ data }) => {
          if (data) {
            callback()
          } else {
            callback(new Error(this.$i18n.t('shop.addShopErrorTip6')))
          }
        })
      }
    }
    var validatePassword = (rule, value, callback) => {
      var reg = /[^\w]/
      if (!this.editUsername && !value) {
        callback(new Error(this.$i18n.t('shop.loginPasswordTip')))
      } else if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shop.addShopErrorTip7')))
      } else {
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      var reg = /[^\w]/
      if (this.dataForm.password && !value) {
        callback(new Error(this.$i18n.t('shop.againInput')))
      } else if (reg.test(value)) {
        callback(new Error(this.$i18n.t('shop.addShopErrorTip7')))
      } else if (this.dataForm.password !== this.dataForm.checkPassword && this.dataForm.password !== null && this.dataForm.checkPassword !== null) {
        callback(new Error(this.$i18n.t('shop.notEmptyTip10')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      editUsername: false,
      dataForm: {
        shopId: 0,
        username: '',
        password: '',
        checkPassword: ''
      },
      dataRule: {
        username: [
          { required: true, message: this.$i18n.t('shop.errorTip11'), trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: false, message: this.$i18n.t('sys.passwordNoNull'), trigger: 'blur' },
          { min: 6, max: 16, message: this.$i18n.t('shopProcess.passwordRule2'), trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: false, message: this.$i18n.t('sys.confirmPassNoNull'), trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ImgsUpload
  },
  methods: {
    init (shopId) {
      this.dataForm.shopId = shopId || 0
      this.visible = true
      this.show = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.dataForm.resetFields()
        this.editUsername = false
        this.dataForm.username = ''
        this.dataForm.password = ''
        this.dataForm.checkPassword = ''
        this.getDataInfo()
      })
    },
    changeEditUsername () {
      this.editUsername = true
    },
    // 获取店铺详情数据
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl('/platform/shopDetail/getMerchantInfo?shopId=' + this.dataForm.shopId),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.editUsername && !this.dataForm.password) {
            this.$refs.dataForm.validateField('password')
          }
          if (!this.editUsername &&
            this.dataForm.password &&
            !this.dataForm.checkPassword) {
            this.$refs.dataForm.validateField('checkPassword')
          }
          //  let username = this.editUsername ? this.dataForm.username : null
          this.$http({
            url: this.$http.adornUrl('/platform/shopDetail/updateMerchantInfo'),
            method: 'put',
            data: this.$http.adornData({
              shopId: this.dataForm.shopId,
              password: this.dataForm.password,
              username: this.dataForm.username
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
    message (msg) {
      this.$message({
        message: msg,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

