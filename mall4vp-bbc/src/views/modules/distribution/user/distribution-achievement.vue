<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
        <el-tab-pane :label="$t('user.performanceStatistics')">
          <achievement />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.promotionalEffect')">
          <income />
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import achievement from './distribution-achievement-basic.vue'
import income from './distribution-income.vue'
export default {
  name: 'mod-marketing-distribution',
  components: {
    achievement,
    income
  },
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

