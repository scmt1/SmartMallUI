<template>
  <div class="mod-marketing-distribution">
    <sku-stock-flow />
  </div>
</template>

<script>
import skuStockFlow from './components/sku-stock-flow'

export default {
  components: {
    skuStockFlow
  }
}
</script>

<style scoped>
div >>> .el-tabs__item.is-active{
  color:#000;
  font-weight: 800;
}
div >>> .el-col-md-6{
  width:30%
}
</style>

<style lang="scss">
.select-time-btn {
  margin-right: 20px;
  display: inline-block;
  color: #AAAAAA;
  font-size: 14px;
  cursor:pointer;
}
.select-time-btn:last-child {
  margin-right: 0;
}
.select-time-btn.is-active {
  color: #155BD4;
}
</style>
