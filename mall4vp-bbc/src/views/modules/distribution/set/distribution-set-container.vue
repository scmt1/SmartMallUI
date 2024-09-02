<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
      <el-tab-pane :label="$t('distribution.basicSettings')">
        <basic ref="basic" />

      </el-tab-pane>
      <el-tab-pane :label="$t('distribution.promotionSettings')">
        <recruit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import basic from './distribution-basic-set.vue'
import recruit from './distribution-recruit-set.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    basic,
    recruit
  }
}
</script>

<style lang="scss">
.mod-marketing-distribution {
  .mod-marketing-distribution-item {
    .form-item {
      .title {
        font-weight: bolder;
        margin: 10px 0 20px 0;
        font-size: 14px;
      }
      .form-item-content {
        padding-left: 30px;
      }
      .tips {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>

