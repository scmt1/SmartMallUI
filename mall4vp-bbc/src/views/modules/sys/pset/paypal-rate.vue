<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('sysManagement.exchangeRate')}}</div>
    <el-form
      ref="dataForm"
      label-width="90px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
      :inline="true"
    >
      <el-form-item :label="$t('sysManagement.systemCoins')" prop="currencyLocal">
        <el-input type="number"
                  v-model="dataForm.currencyLocal"
                  :placeholder="$t('sysManagement.systemCoins')"
                 ></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysManagement.currencyUSD')"  prop="currencyUsd">
        <el-input type="number"
                  v-model="dataForm.currencyUsd"
                  :placeholder="$t('sysManagement.currencyUSD')"
                  >
          <template slot="append">$</template>
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          // 系统币
          currencyLocal: 1.00,
          // 美元
          currencyUsd: 0.1529
        },
        dataRule: {
          currencyLocal: [
            { required: true, message: this.$i18n.t('sysManagement.systemCoinsNullTips'), trigger: 'blur' }
          ],
          currencyUsd: [
            { required: true, message: this.$i18n.t('sysManagement.currencyUSDNullTips'), trigger: 'blur' }
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
            url: this.$http.adornUrl('/sys/pconfig/info/' + 'EXCHANGE_RATE_CONFIG'),
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
                'paramKey': 'EXCHANGE_RATE_CONFIG',
                'paramValue': JSON.stringify(this.dataForm),
                'remark': this.$i18n.t('sysManagement.exchangeRateConfiguration')
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
