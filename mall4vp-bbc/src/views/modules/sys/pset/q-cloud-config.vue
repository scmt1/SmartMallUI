<template>
  <div class="uploadfile-腾讯云上传配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.qcloudFileUploadConfig')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :model="dataForm"
    >
      <el-form-item :label="`${$t('sysManagement.qcloud')} secretId:`" style="width:640px" prop="secretId">
        <el-input v-model="dataForm.secretId" :placeholder="`${$t('sysManagement.qcloud')}accessKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qcloud')} secretKey:`" style="width:640px" prop="secretKey">
        <el-input v-model="dataForm.secretKey" :placeholder="`${$t('sysManagement.qcloud')}secretKey`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qcloud')} bucketName:`" style="width:640px" prop="bucketName">
        <el-input v-model="dataForm.bucketName" :placeholder="`${$t('sysManagement.qcloud')}bucketName`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('sysManagement.qcloud')} region:`" style="width:640px" prop="region">
        <el-input v-model="dataForm.region" :placeholder="`${$t('sysManagement.qcloud')}region`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.isActive')" style="width:640px" prop="isOpen">
        <el-switch v-model="dataForm.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
    </span>
  </div>
</template>

<script>
export default {
  props: {
    saveUrl: {
      type: String,
      default: '/sys/pconfig/save'
    },
    changeFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    changeFlag: function (newVal, oldVal) {
      if (!this.activationEventOriginate) {
        this.dataForm.isOpen = false
      }
      this.activationEventOriginate = false
    }
  },
  data () {
    return {
      dataForm: {
        secretId: null,
        secretKey: null,
        bucketName: null,
        region: null
      },
      activationEventOriginate: false,
      value: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'Q_CLOUD_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.dataForm = JSON.parse(data)
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    message (msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    },
    checkConfig () {
      if (this.dataForm.secretId == null || this.dataForm.secretId === '') {
        this.message(`${this.$i18n.t('sysManagement.qcloud')} secretId ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.secretKey == null || this.dataForm.secretKey === '') {
        this.message(`${this.$i18n.t('sysManagement.qcloud')} secretKey ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.bucketName == null || this.dataForm.bucketName === '') {
        this.message(`${this.$i18n.t('sysManagement.qcloud')} bucketName ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.region == null || this.dataForm.region === '') {
        this.message(`${this.$i18n.t('sysManagement.qcloud')} region ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      return true
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.isOpen && !this.checkConfig()) {
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(this.saveUrl),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'Q_CLOUD_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.qcloudFileUploadConfig')
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                if (this.dataForm.isOpen) {
                  this.activationEventOriginate = true
                  this.$emit('activationConfig')
                }
              }
            })
          })
        }
      })
    }
  }
}
</script>
