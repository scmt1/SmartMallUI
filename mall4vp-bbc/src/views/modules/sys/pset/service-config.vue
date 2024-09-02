<template>
  <div class="gray-box top-redius border-bottom-gray">
    <el-tabs>
      <el-tab-pane v-for="(param,index) in params" :key="index" :label="param.title">
        <service-components :params="param"></service-components>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ServiceComponents from './service-components'
export default {
  components: {
    ServiceComponents
  },
  data () {
    return {
      params: [
        // 服务条款参数
        {
          title: this.$t('sysManagement.serviceTerms'),
          keyCN: 'SERVICE_TERMS_CONFIG_CN',
          keyEN: 'SERVICE_TERMS_CONFIG_EN',
          remarkCN: this.$t('sysManagement.serviceTermsCnConfig'),
          remarkEN: this.$t('sysManagement.serviceTermsEnConfig')
        },
        // 隐私策略参数
        {
          title: this.$t('sysManagement.privacyPolicy'),
          keyCN: 'SERVICE_POLICY_CONFIG_CN',
          keyEN: 'SERVICE_POLICY_CONFIG_EN',
          remarkCN: this.$t('sysManagement.privacyPolicyCnConfig'),
          remarkEN: this.$t('sysManagement.privacyPolicyEnConfig')
        },
        // 商家注册协议
        {
          title: this.$t('sysManagement.merchantRegisterProtocolConfig'),
          keyCN: 'MERCHANT_REGISTER_PROTOCOL_CN',
          keyEN: 'MERCHANT_REGISTER_PROTOCOL_EN',
          remarkCN: this.$t('sysManagement.merchantRegisterProtocolCNConfig'),
          remarkEN: this.$t('sysManagement.merchantRegisterProtocolENConfig')
        },
        // 开店协议
        {
          title: this.$t('sysManagement.shopProtocolConfig'),
          keyCN: 'SHOP_PROTOCOL_CN',
          keyEN: 'SHOP_PROTOCOL_EN',
          remarkCN: this.$t('sysManagement.shopProtocolCNConfig'),
          remarkEN: this.$t('sysManagement.shopProtocolENConfig')
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    }
  }
}
</script>
<style lang="scss">
</style>
