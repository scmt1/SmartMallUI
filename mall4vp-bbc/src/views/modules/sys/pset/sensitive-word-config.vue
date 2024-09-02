<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.sensitiveConfiguration')}}</div>
    <el-form
      ref="dataForm"
      label-width="5px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >

      <el-form-item style="width:500px" prop="sensitiveWord">
        <el-alert
          :title="$t('sysManagement.sensitiveAlert')"
          type="warning"
          :closable="false"
          show-icon
        />
        <el-input
          v-model="dataForm.sensitiveWord"
          type="textarea"
          rows="28"
          :placeholder="$t('sysManagement.sensitiveWord')"
          controls-position="right"
          @input="inputLimit"
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
        sensitiveWord: null
      },
      dataRule: {
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'SENSITIVE_WORDS'),
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
    inputLimit (val) {
      // 正则匹配非中英文及数字以及中文逗号的字符
      const reg = /[^\u4e00-\u9fa5\uff0c]/
      // 查找是否有非中英文及数字的字符
      // 没有则返回-1，有则返回对应位置
      const n = val.search(reg)
      if (n !== -1 || (val[val.length - 2] === '，' && val[val.length - 1] === '，')) {
        this.dataForm.sensitiveWord = val.slice(0, n)
        this.$forceUpdate()
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'SENSITIVE_WORDS',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': this.$i18n.t('sysManagement.sensitiveConfiguration')
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
    /**
     * dataform -> alipay
     */
    // getAlipayParam () {
    //   this.alipay.appId = this.dataForm.appId
    //   this.alipay.appCertPath = this.dataForm.appCertPath
    //   this.alipay.alipayCertPath = this.dataForm.alipayCertPath
    //   this.alipay.alipayRootCertPath = this.dataForm.alipayRootCertPath
    //   this.alipay.appPrivateKey = this.dataForm.appPrivateKey
    // },
    /**
     *  alipay -> dataform
     */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.appId = this.alipay.appId
    //   this.dataForm.appCertPath = this.alipay.appCertPath
    //   this.dataForm.alipayCertPath = this.alipay.alipayCertPath
    //   this.dataForm.alipayRootCertPath = this.alipay.alipayRootCertPath
    //   this.dataForm.appPrivateKey = this.alipay.appPrivateKey
    // }
  }
}
</script>
