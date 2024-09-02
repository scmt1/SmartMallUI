<template>
  <div class="public-微信公众号配置-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t("sysManagement.weChatOfficialAccountConfiguration") }}
    </div>
    <el-form
      ref="dataForm"
      label-width="240px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item
        :label="`${$t('sysManagement.weChatOfficialAccount')}appId:`"
        style="width: 640px"
        prop="appId"
      >
        <el-input
          v-model="dataForm.appId"
          :placeholder="`${$t('sysManagement.weChatOfficialAccount')}appId`"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="`${$t('sysManagement.weChatOfficialAccount')}secret:`"
        style="width: 640px"
        prop="secret"
      >
        <el-input
          v-model="dataForm.secret"
          :placeholder="`${$t('sysManagement.weChatOfficialAccount')}secret`"
          controls-position="right"
        ></el-input>
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
  data () {
    return {
      dataForm: {
        appId: null,
        secret: null
      },
      dataRule: {
        appId: [
          { required: true, message: `${this.$i18n.t('sysManagement.weChatOfficialAccount')} appId ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ],
        secret: [
          { required: true, message: `${this.$i18n.t('sysManagement.weChatOfficialAccount')} secret ${this.$i18n.t('sysManagement.nullTips')}`, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'MP_CONFIG'),
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
      let obj = {}
      obj.appId = this.dataForm.appId
      obj.secret = this.dataForm.secret
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'MP_CONFIG',
              'paramValue': JSON.stringify(obj),
              'remark': this.$i18n.t('sysManagement.weChatOfficialAccountConfiguration')
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
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
