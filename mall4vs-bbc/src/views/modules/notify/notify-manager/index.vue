<template>
  <div class="Mall4j app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('notice.msgList')" name="first">
        <notifyList />
      </el-tab-pane>
      <el-tab-pane :label="$t('notice.msgSettings')" name="second">
        <notifySetting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import notifyList from './notify-list'
import notifySetting from './notify-setting'
export default {
  components: {
    notifyList,
    notifySetting
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style lang="scss">

</style>
