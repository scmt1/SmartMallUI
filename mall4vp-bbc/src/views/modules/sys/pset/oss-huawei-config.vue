<template>
  <div class="uploadfile-Obs文件上传配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.hwObsFileUpload')}}</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item label="obs—accessKeyId:" style="width:640px" prop="accessKeyId">
        <el-input
          v-model="dataForm.accessKeyId"
          :placeholder="`obs ${$t('sysManagement.fileUpload')} accessKeyId`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="obs—secretAccessKey:" style="width:640px" prop="accessKeySecret">
        <el-input
          v-model="dataForm.secretAccessKey"
          :placeholder="`obs ${$t('sysManagement.fileUpload')} secretAccessKey`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="obs—endpoint:" style="width:640px" prop="endpoint">
        <el-input
          v-model="dataForm.endpoint"
          :placeholder="`obs ${$t('sysManagement.fileUpload')} endpoint`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="obs—bucketName:" style="width:640px" prop="bucketName">
        <el-input
          v-model="dataForm.bucketName"
          :placeholder="`obs ${$t('sysManagement.fileUpload')} bucketName`"
          controls-position="right"
        ></el-input>
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
        accessKeyId: '',
        secretAccessKey: '',
        endpoint: '',
        bucketName: '',
        isOpen: false
      },
      activationEventOriginate: false,
      dataRule: {
        // accessKeyId: [
        //   { required: true, message: `'obs ${this.$i18n.t('sysManagement.fileUpload')} accessKeyId ${this.$i18n.t('sysManagement.nullTips')}'`, trigger: 'blur' }
        // ],
        // secretAccessKey: [
        //   { required: true, message: `'obs ${this.$i18n.t('sysManagement.fileUpload')} secretAccessKey ${this.$i18n.t('sysManagement.nullTips')}'`, trigger: 'blur' }
        // ],
        // endpoint: [
        //   { required: true, message: `'obs ${this.$i18n.t('sysManagement.fileUpload')} endpoint ${this.$i18n.t('sysManagement.nullTips')}'`, trigger: 'blur' }
        // ],
        // bucketName: [
        //   { required: true, message: `'obs ${this.$i18n.t('sysManagement.fileUpload')} bucketName ${this.$i18n.t('sysManagement.nullTips')}'`, trigger: 'blur' }
        // ]
      }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'HUAWEI_OBS_CONFIG'),
          method: 'get',
          params: this.$http.adornParams({
            id: this.dataForm.id,
            key: this.dataForm.paramKey
          })
        }).then(({ data }) => {
          if (data) {
            this.dataForm = JSON.parse(data)
          }
        })
        this.$refs['dataForm'].resetFields()
      })
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
              'paramKey': 'HUAWEI_OBS_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.hwObsFileUpload')
            })
          }).then(({ data }) => {
            if (data) {
              this.init()
            }
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
    },
    checkConfig () {
      if (this.dataForm.accessKeyId == null || this.dataForm.accessKeyId === '') {
        this.message(`obs ${this.$i18n.t('sysManagement.fileUpload')} accessKeyId ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.secretAccessKey == null || this.dataForm.secretAccessKey === '') {
        this.message(`obs ${this.$i18n.t('sysManagement.fileUpload')} secretAccessKey ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.endpoint == null || this.dataForm.endpoint === '') {
        this.message(`obs ${this.$i18n.t('sysManagement.fileUpload')} endpoint ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      if (this.dataForm.bucketName == null || this.dataForm.bucketName === '') {
        this.message(`obs ${this.$i18n.t('sysManagement.fileUpload')} bucketName ${this.$i18n.t('sysManagement.nullTips')}`, 'error')
        return false
      }
      return true
    },
    message (msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    }
  }
}
</script>
