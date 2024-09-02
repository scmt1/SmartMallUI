<template>
    <div class="goods-module-three">
        <div class="left">
            <goods-module-three :config="config.leftConfig"></goods-module-three>
        </div>
        <div class="right">
            <goods-module-three :config="config.rightConfig"></goods-module-three>
        </div>
    </div>
</template>
<script>
import goodsModuleThree from '../../../../commonComponent/goodsModuleThree/index.vue'
export default {
  components: {
    goodsModuleThree
  },
  props: {
    itemComponent: { // 组件的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      config: { // 配置信息
        leftConfig: {
          title: this.$i18n.t('pcdecorate.floorTitle.mainTitle')
        }, // 左边配置信息
        rightConfig: {
          title: this.$i18n.t('pcdecorate.floorTitle.mainTitle')
        } // 右边配置信息
      }
    }
  },
  watch: {
    itemComponent: { // 监听组件的信息
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.config.leftConfig = { // 左边商品列表
            title: newVal.rightConfigMessage.leftConfig.title,
            goodsList: newVal.rightConfigMessage.leftConfig.goodsList
          }
          this.config.rightConfig = { // 右边商品列表
            title: newVal.rightConfigMessage.rightConfig.title,
            goodsList: newVal.rightConfigMessage.rightConfig.goodsList
          }
        } else {
          this.config.leftConfig = {
            title: this.$t('pcdecorate.goodsModule1.mainTitleCon'),
            goodsList: []
          }
          this.config.rightConfig = {
            title: this.$t('pcdecorate.goodsModule1.mainTitleCon'),
            goodsList: []
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module-three {
  width: $currentContentWidth;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .left {
    width: calc(50% - 10px);
    margin-right: 10px;
  }
  .right {
    width: calc(50% - 10px);
    margin-left: 10px;
  }
}
</style>