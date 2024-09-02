<template>
  <div class="mod-pay">
    <quickbird :saveUrl="saveUrl" :changeFlag="changeFlag" ref="quickbird" @activationConfig="activationConfig"/>
    <quick100 :saveUrl="saveUrl" :changeFlag="changeFlag" ref="quick100" @activationConfig="activationConfig"/>
    <quickAli :saveUrl="saveUrl" :changeFlag="changeFlag" ref="quickAli" @activationConfig="activationConfig"/>
  </div>
</template>
<script>
  import quickbird from './quickbird-config.vue'
  import quick100 from './quick100-config'
  import quickAli from './quick-ali-config.vue'
  export default {
    data () {
      return {
        // 保存文件上传配置的url
        saveUrl: '/sys/pconfig/saveDeliveryConfig',
        changeFlag: true
      }
    },
    methods: {
      // 激活配置回调
      activationConfig () {
        this.changeFlag = !this.changeFlag
      }
    },
    components: {
      quickbird,
      quick100,
      quickAli
    }
  }
</script>
<style lang="scss">
</style>


