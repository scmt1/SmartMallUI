<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
      <el-tab-pane :label="$t('user.ordinaryMemberSet')">
        <ordinary />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.paidMembershipSet')">
        <vip />
      </el-tab-pane>
    </el-tabs>
  </div>
</template> 
<script>
import ordinary from './userLevel-ordinary.vue'
import vip from './userLevel-vip.vue'

export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    ordinary,
    vip
  }
}
</script>