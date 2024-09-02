<template>
  <el-dialog
    :title="!dataForm.employeeId ? this.$i18n.t('product.addNew') : this.$i18n.t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="handleDialogClose"
    width="568px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="$t('language')=='简体中文'?'80px':'100px'"
      size="small"
    >
      <el-form-item :label="$t('sys.nickName')" prop="nickName">
        <el-input  v-model="dataForm.nickName" :placeholder="$t('sys.nickName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.userName')" prop="userName">
        <el-input v-model="dataForm.userName" :placeholder="$t('sys.userName')" :disabled="dataForm.type === 0"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.phoneNumber')" prop="mobile">
        <el-input v-model="dataForm.mobile" maxlength="11" :placeholder="$t('shop.phoneNumber')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.password')" prop="password" :class="{ 'is-required': !dataForm.employeeId }">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('sys.password')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.confirmPassword')" prop="comfirmPassword" :class="{ 'is-required': !dataForm.employeeId }">
        <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t('sys.confirmPassword')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.email')" prop="email">
        <el-input v-model="dataForm.email" :placeholder="$t('sys.email')"></el-input>
      </el-form-item>
      <el-form-item v-if="roleList.length && dataForm.type !== 0" :label="$t('sys.roles')" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('product.status')" size="mini" prop="status" v-if="dataForm.type !== 0">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
          <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div @click="visible = false" class="default-btn">{{$t('crud.filter.cancelBtn')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('crud.filter.submitBtn')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile, isUserName } from '@/utils/validate'
import { encrypt } from '@/utils/crypto'
export default {
  data () {
    var validateUsername = (rule, value, callback) => {
      if (!isUserName(value)) {
        callback(new Error(this.$i18n.t('homes.InputCorrectUsername')))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.employeeId && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('sys.passwordNoNull')))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.employeeId && !/\S/.test(value)) {
        callback(new Error(this.$i18n.t('sys.confirmPassNoNull')))
      } else if (this.dataForm.password !== value) {
        callback(new Error(this.$i18n.t('sys.passworldContrast')))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
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
        employeeId: 0,
        userName: '',
        nickName: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1,
        type: '',
        userId: '',
        shopId: 0,
        createEmployeeId: 0
      },
      dataRule: {
        userName: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: this.$i18n.t('sys.nickNameNoNull'), trigger: 'blur' }
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
      this.dataForm.employeeId = id || 0
      this.isSubmit = false
      this.$http({
        url: this.$http.adornUrl('/sys/shopRole/list'),
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
        if (this.dataForm.employeeId) {
          this.$http({
            url: this.$http.adornUrl(`/sys/shopEmployee/info/${this.dataForm.employeeId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.userName = data.username
            this.dataForm.nickName = data.nickname
            this.dataForm.email = data.email
            this.dataForm.mobile = data.mobile
            this.dataForm.roleIdList = data.roleIdList
            this.dataForm.status = data.status
            this.dataForm.type = data.type
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
            url: this.$http.adornUrl(`/sys/shopEmployee`),
            method: this.dataForm.employeeId ? 'put' : 'post',
            data: this.$http.adornData({
              'employeeId': this.dataForm.employeeId || undefined,
              'username': this.dataForm.userName,
              'nickname': this.dataForm.nickName,
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
    },
    handleDialogClose () {
      this.roleList = []
      this.dataForm.type = ''
    }
  }
}
</script>
