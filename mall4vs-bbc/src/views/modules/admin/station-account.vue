<template>
  <el-dialog
    :title="status ? this.$i18n.t('admin.resetPwd') : this.$i18n.t('admin.createAcc')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="lang === 'en'? '650px':'600px'"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
      style="width:500px;"
      size="small"
    >
      <el-form-item :label="this.$i18n.t('station.stationNames')" prop="stationName" style="width:500px;">
        <el-input v-model="dataForm.stationName" disabled></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('homes.userName')" prop="account" style="width:580px;">
        <el-row style="width:100%">
          <el-col :span="20">
            <el-input
              v-model="dataForm.account"
              maxlength="50"
              show-word-limit
              class="account"
              @change="checkAccount()"
              :disabled="!editAccount"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              icon="el-icon-edit"
              type="text"
              size="small"
              v-if="!editAccount"
              @click="changeAccountInfo()"
            >{{$t("admin.modifyAcc")}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.password')" prop="password" style="width:500px;">
        <el-input type="password" v-model="dataForm.password" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.confirmPassword')" prop="passwordConfirm" style="width:500px;">
        <el-input type="password" v-model="dataForm.passwordConfirm" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" type="primary" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import ImgsUpload from '@/components/imgs-upload'
import { encrypt } from '@/utils/crypto'
export default {
  data () {
    var validateAccount = (rule, value, callback) => {
      var reg = /[^\w]/
      if (reg.test(value)) {
        callback(new Error(this.lang === 'en' ? 'The account can contain only digits or letters' : '账号只能为数字或字母'))
      } else if (!value.trim()) {
        callback(new Error(this.$i18n.t('home.accNoNull')))
      }
      this.$http({
        url: this.$http.adornUrl('/admin/station/checkStationAccount/'),
        method: 'get',
        params: this.$http.adornParams({
          stationId: this.dataForm.stationId,
          account: value
        })
      }).then(({ data }) => {
        if (!data) {
          callback(new Error(this.$i18n.t('admin.accIsExist')))
        } else {
          callback()
        }
      })
    }
    var validatePassword = (rule, value, callback) => {
      if (this.dataForm.password !== this.dataForm.passwordConfirm) {
        callback(new Error(this.$i18n.t('admin.twoPwdIncon')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      status: true,
      editAccount: true,
      lang: window.localStorage.getItem('lang'),
      dataForm: {
        account: '',
        password: '',
        passwordConfirm: ''
      },
      dataRule: {
        account: [
          { required: true, message: this.$i18n.t('admin.stationAccNoNull'), trigger: 'blur' },
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$i18n.t('home.pawNoNull'), trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: this.$i18n.t('home.pawNoNull'), trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    ImgsUpload
  },
  methods: {
    init (stationId) {
      this.dataForm.stationId = stationId || 0
      this.visible = true
      this.dataRule.password[0].required = true
      this.dataRule.passwordConfirm[0].required = true
      this.show = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.dataForm.resetFields()
        this.dataForm.account = null
        this.dataForm.password = null
        this.dataForm.passwordConfirm = null
        this.getDataInfo()
      })
    },
    // 获取店铺详情数据
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl('/admin/station/info/' + this.dataForm.stationId),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.dataForm.password = ''
        if (data.account) {
          this.status = true
        } else {
          this.status = false
        }
        this.editAccount = !this.dataForm.account
      })
    },
    changeAccountInfo () {
      this.editAccount = true
      // this.dataRule.password[0].required = false
      // this.dataRule.passwordConfirm[0].required = false
      // this.$set(this.dataForm, 'passwordConfirm', '')
    },
    checkAccount () {
      this.dataForm.account = this.dataForm.account.trim()
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.dataForm))
          data.password = encrypt(data.password)
          data.passwordConfirm = encrypt(data.passwordConfirm)
          this.$http({
            url: this.$http.adornUrl('/admin/station/changeAccountInfo'),
            method: 'put',
            data: this.$http.adornData(data)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
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
<style scoped>
.account >>> .el-input__inner {
  padding-right: 45px !important;
}
</style>
