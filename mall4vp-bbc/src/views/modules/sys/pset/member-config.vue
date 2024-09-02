<template>
  <div class="gray-box top-redius border-bottom-gray">
    <el-tabs>
      <el-tab-pane v-for="(param,index) in params" :key="index" :label="param.title">
        <member-components :params="param"></member-components>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MemberComponents from './member-components'
export default {
  components: {
    MemberComponents
  },
  data () {
    return {
      params: [
        // 使用流程参数
        {
          title: "使用流程",
          keyCN: 'MEMBER_USE_FLOW_CONFIG_CN',
          remarkCN: "使用流程配置",
        },
        // 使用须知参数
        {
          title: "使用须知",
          keyCN: 'MEMBER_USE_NOTICE_CONFIG_CN',
          remarkCN: "使用须知配置",
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
