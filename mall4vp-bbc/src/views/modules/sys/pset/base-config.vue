<template>
    <div class="mod-pay">
        <domain ref="domain"/>
        <sms ref="sms"/>
        <ztSms ref="ztSms"/>
    </div>
</template>
<script>
import sms from './sms-config.vue'
import domain from './domain-config.vue'
import ztSms from './zt-sms-config.vue'

export default {
    data () {
        return {}
    },
    methods: {},
    components: {
        sms,
        domain,
        ztSms
    }
}
</script>
<style lang="scss">
</style>

