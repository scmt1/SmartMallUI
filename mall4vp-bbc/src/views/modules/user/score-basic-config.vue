<template>
  <div class="mod-marketing-distribution">
    <el-tabs width="360">
      <!-- <el-tab-pane label="基础设置"> -->
      <!-- <normal ref="basic" /> -->
      <category width="360" />
      <!-- </el-tab-pane> -->
    </el-tabs>

  </div>
</template> 
<script>
// import normal from './score-normal-config.vue'
// import category from './score-category-config.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    // normal,
    // category
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

