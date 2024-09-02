<template>
  <el-dialog :title="this.$i18n.t('homes.updatePwd')" :visible.sync="visible" :append-to-body="true">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item :label="this.$i18n.t('homes.userName')">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('homes.oldPwd')" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item :label="$t('homes.newPwd')" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('sys.confirmPassword')" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("homes.no")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("homes.yes")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  import { encrypt } from '@/utils/crypto'
  export default {
    data () {
      const validatePassword = (rule, value, callback) => {
        var reg = /[^\w]/
        if (reg.test(value)) {
          callback(new Error(this.$i18n.t('shopProcess.addShopErrorTip7')))
        } else {
          callback()
        }
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error(this.$i18n.t('homes.istrue')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, message: this.$i18n.t('sys.oldPwdNotNull'), trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: this.$i18n.t('sys.newPwdNotNull'), trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: this.$i18n.t('sys.confirmPassNoNull'), trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.userName }
      },
      // mobile: {
      //   get () { return this.$store.state.user.mobile }
      // },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/shopEmployee/password'),
              method: 'post',
              data: this.$http.adornData({
                password: encrypt(this.dataForm.password),
                newPassword: encrypt(this.dataForm.newPassword)
              })
            }).then(({ data }) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$nextTick(() => {
                    this.mainTabs = []
                    clearLoginInfo()
                    this.$router.replace({ name: 'login' })
                  })
                }
              })
            })
          }
        })
      }
    }
  }
</script>

