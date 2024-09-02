<template>
  <div class="mod-marketing-distribution">
    <el-tabs @tab-click="hanldeClick">
        <el-tab-pane :label="$t('user.distributorManagement')">
          <user />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.distributorAudit')">
          <auditing />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.relationshipSearch')">
          <bind />
        </el-tab-pane>
        <el-tab-pane :label="$t('user.blockingRecords')">
          <ban ref="ban" ></ban>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import user from './distribution-user-basic.vue'
import auditing from './distribution-auditing.vue'
import bind from './distribution-bind.vue'
import ban from './distribution-ban.vue'

export default {
  name: 'mod-marketing-distribution',
  components: {
    user,
    auditing,
    bind,
    ban
  },
  data () {
    return {

    }
  },
  methods: {
    hanldeClick (el) {
      this.$nextTick(() => {
        if (Number(el.index) === 3) {
          this.$refs.ban.getDataList()
        }
      }
      )
    }

  }
}
</script>
