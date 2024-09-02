<template>
  <div class="app-container mod-notify-log">
    <el-tabs v-model="activeName">
      <el-tab-pane label="消息模板" name="first">
        <notifyTemplate />
      </el-tab-pane>
      <el-tab-pane label="消息记录" name="second">
        <notifyLog />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import notifyTemplate from '../notifyTemplate'
import notifyLog from '../notify-log'
export default {
  components: {
    notifyTemplate,
    notifyLog
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
