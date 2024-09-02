<template>
  <div class="paypal-config gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.payPalPaymentConfiguration')}}</div>
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
      <el-form-item :label="$t('sysManagement.payPalClientId')" style="width:640px" prop="clientId">
        <el-input type="textarea"
                  rows="3"
                  v-model="dataForm.clientId"
                  :placeholder="$t('sysManagement.payPalClientId')"
                  controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.payPalClientSecret')" style="width:640px" prop="clientSecret">
        <el-input type="textarea"
                  rows="3"
                  v-model="dataForm.clientSecret"
                  :placeholder="$t('sysManagement.payPalClientSecret')"
                  controls-position="right"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.mode')" style="width:640px" prop="mode">
        <!--<el-input v-model="dataForm.mode" :placeholder="$t('sysManagement.modePlaceholder')" controls-position="right"></el-input>-->
        <el-select
          v-model="dataForm.mode"
          filterable
          default-first-option
          :placeholder="`${$t('sysManagement.modePlaceholder')}`"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
            <!--<span style="float: left">{{ item.label }}</span>-->
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="receiverEmail" style="width:640px" prop="receiverEmail">

        <el-input v-model="dataForm.receiverEmail" :placeholder="$t('sysManagement.receiverEmail')" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="webHookId" style="width:640px" prop="webHookId">
        <el-input v-model="dataForm.webHookId" :placeholder="$t('sysManagement.webHookId')" controls-position="right">
          <el-popover slot="append" placement="right" width="200" trigger="hover" :content="$t('sysManagement.webHookIdTips')">
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
      <!-- <el-button @click="visible = false">取消</el-button> -->
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        clientId: null,
        clientSecret: null,
        mode: null,
        receiverEmail: null,
        webHookId: null
      },
      options: [
        {
          label: 'live',
          value: 'live'
        },
        {
          label: 'sandbox',
          value: 'sandbox'
        }
      ],
      dataRule: {
        clientId: [
          { required: true, message: this.$i18n.t('sysManagement.clientIdNullTips'), trigger: 'blur' }
        ],
        clientSecret: [
          { required: true, message: this.$i18n.t('sysManagement.clientSecretNullTips'), trigger: 'blur' }
        ],
        mode: [
          { required: true, message: this.$i18n.t('sysManagement.modeNullTips'), trigger: 'blur' }
        ],
        receiverEmail: [
          { required: true, message: this.$i18n.t('sysManagement.receiverEmailNullTips'), trigger: 'blur' }
        ]
        // webHookId: [
        //   { required: true, message: this.$i18n.t('sysManagement.modeNullTips'), trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'PAYPAL_CONFIG'),
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
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'PAYPAL_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.payPalPaymentConfiguration')
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
          })
        }
      })
    }
  }
}
</script>
