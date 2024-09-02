<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
        <el-tab-pane :label="$t('user.merchandiseManagement')">
          <distributionProd />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.salesRecord')">
          <recruit />
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import distributionProd from './distribution-prod-basic'
import recruit from './distribution-prod-log'
export default {
  name: 'mod-marketing-distribution',
  components: {
    distributionProd,
    recruit
  },
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
