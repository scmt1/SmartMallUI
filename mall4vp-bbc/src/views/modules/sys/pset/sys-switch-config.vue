<template>
  <div class="mod-pay">
    <pay ref="pay"/>
    <service ref="service"/>
    <prod ref="prod"/>
    <balance ref="balance"/>
  </div>
</template>
<script>
import pay from './pay-switch-config.vue'
import service from './service-switch-config.vue'
import prod from './prod-switch-config.vue'
import balance from './balance-switch-config.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    pay,
    service,
    prod,
    balance
  }
}
</script>
<style lang="scss">
</style>

