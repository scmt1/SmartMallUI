<template>
  <div class="quickbird-快递100物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.quickAliConfig')}}</div>
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
      <el-form-item :label="`${this.$i18n.t('sysManagement.quickAliCode')}:`" style="width:640px" prop="aliCode">
        <el-input v-model="dataForm.aliCode" :placeholder="`${this.$i18n.t('sysManagement.quickAliCode')}`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="`${this.$i18n.t('sysManagement.quickAliConfig')} reqUrl:`" style="width:640px" prop="reqUrl">
        <el-input v-model="dataForm.reqUrl" :placeholder="`${this.$i18n.t('sysManagement.quickAliConfig')} reqUrl`" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.isActive')" style="width:640px" prop="isOpen">
        <el-switch v-model="dataForm.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
        aliCode: null,
        reqUrl: null,
        isOpen: false
      },
      activationEventOriginate: false,
      dataRule: {
        aliCode: [
          { required: true, message: `code ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        reqUrl: [
          { required: true, message: `Url ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ]
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'ALI_QUICK_CONFIG'),
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
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(this.saveUrl),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'ALI_QUICK_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '阿里快递物流配置'
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
    }
  }
}
</script>
