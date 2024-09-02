<template>
  <div class="cust-analysis-header">
    <div class="cust-analysis-header__title">
      <h3>{{title}}</h3>
      <el-popover placement="top" width="300" trigger="hover" style="margin-left: 5px;" :content="tips">
        <i style="color: #DFDFDF;font-size: 17px;margin-bottom: 7px;margin-left:5px;" class="el-icon-question" slot="reference"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      default: null
    },
    tips: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss">
.cust-analysis-header {
  display: flex;
  box-sizing: border-box;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 15px;
  margin-top: 30px;
  min-height: 40px;
  .cust-analysis-header__title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
  }
  .cust-analysis-header__title h3 {
    height: 24px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 16px;
    color: #333333;
    opacity: 1;
  }
}
</style>

