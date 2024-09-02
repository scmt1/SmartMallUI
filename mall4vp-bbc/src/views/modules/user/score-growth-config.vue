<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
      <el-tab-pane :label="$t('user.pointSettings')">
        <score ref="basic" />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.growthEarnSetting')">
        <growth ref="explain" />
      </el-tab-pane>
      <el-tab-pane :label="$t('user.otherConfiguration')">
        <!-- <explain ref="explain" /> -->
        <expire ref="expire" />
        <question ref="question" />
        <level ref="level" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template> 
<script>
import score from './score-config.vue'
import growth from './growth-config.vue'
import explain from './score-explain-config.vue'
import expire from './score-expire-config.vue'
import question from './score-question-config.vue'
import level from './level-show-config.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    score,
    growth,
    explain,
    expire,
    level,
    question
  }
}
</script>
<style lang="scss">
/*
通用样式
*/
.mod-marketing-distribution {
  .sdp-top {
    .IsdistributionText {
      display: inline-block;
      padding-left: 10px;
    }
  }
  .footer-bar-pagination {
    width: calc(100% + 30px);
    background-color: white;
    bottom: 0px;
    position: fixed;
    height: 50px;
    text-align: center;
    z-index: 100;
    left: -30px;
    line-height: 50px;
  }
  #tabs {
    margin-top: 20px;
  }

  .tips {
    color: #9797a1;
    font-size: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
  .gray-box {
    background: #f2f2f6;
    padding: 20px 35px;
    height: 100%;
  }
  .border-bottom-gray {
    border-bottom: 1px solid #dddce2;
  }
  .bottom-redius {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .top-redius {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .set-form {
    margin-left: 20%;
    margin: 20px;
  }

  .valid-input {
    margin-left: 20px;
    border-top-left-radius: 0px;
  }

}
</style>

