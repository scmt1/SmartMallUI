<template>
  <el-dialog
    :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item :label="$t('sys.userName')" prop="userName">
        <el-input v-model="dataForm.userName" size="small" :placeholder="$t('sys.userName')" :disabled="dataForm.id === 1"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.nickName')" prop="nickName">
        <el-input v-model="dataForm.nickName" size="small" :placeholder="$t('sys.nickName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.password')" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" size="small" type="password" :placeholder="$t('sys.password')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.confirmPassword')" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" size="small" :placeholder="$t('sys.confirmPassword')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.email')" prop="email">
        <el-input v-model="dataForm.email" size="small" :placeholder="$t('sys.email')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('publics.phoneNumber')" prop="mobile">
        <el-input v-model="dataForm.mobile" size="small" maxlength="11" :placeholder="$t('publics.phoneNumber')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.roles')" size="mini" prop="roleIdList" v-if="dataForm.id !== 1">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('product.status')" size="mini" prop="status" v-if="dataForm.id !== 1 && dataForm.isSelf !== 1">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
          <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('coupon.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile, validEmail } from '@/utils/validate'
import { encrypt } from '@/utils/crypto'
export default {
  data () {
    var validateNickName = (rule, value, callback) => {
      const str = value.trim()
      if (!str) {
        callback(new Error(this.$i18n.t('sys.nickNameNoNull')))
      } else {
        if (str.length >= 2 && str.length <= 20) {
          callback()
        }
        callback(new Error(this.$i18n.t('sys.nickNameBetween')))
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('sys.passwordNoNull')))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('sys.confirmPassNoNull')))
      } else if (this.dataForm.password !== value) {
        callback(new Error(this.$i18n.t('sys.passworldContrast')))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$i18n.t('sys.emailaError')))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$i18n.t('sys.mobilePhoneError')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isSubmit: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: '',
        nickName: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1,
        isSelf: 0
      },
      dataRule: {
        userName: [
          { required: true, message: this.$i18n.t('sys.userNameNoNull'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('sys.userNameBetween'), trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: this.$i18n.t('sys.nickNameNoNull'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$i18n.t('sys.nickNameBetween'), trigger: 'blur' },
          { validator: validateNickName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$i18n.t('sys.emailaNoNull'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$i18n.t('sys.mobilePhoneNoNull'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.isSubmit = false
      this.$http({
        url: this.$http.adornUrl('/sys/role/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.roleList = data
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.userName = data.username
            this.dataForm.nickName = data.nickName
            this.dataForm.email = data.email
            this.dataForm.mobile = data.mobile
            this.dataForm.roleIdList = data.roleIdList
            this.dataForm.status = data.status
            this.dataForm.isSelf = data.isSelf
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/sys/user`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData({
              'userId': this.dataForm.id || undefined,
              'username': this.dataForm.userName,
              'nickName': this.dataForm.nickName,
              'password': encrypt(this.dataForm.password),
              'email': this.dataForm.email,
              'mobile': this.dataForm.mobile,
              'status': this.dataForm.status,
              'roleIdList': this.dataForm.roleIdList
            })
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
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
