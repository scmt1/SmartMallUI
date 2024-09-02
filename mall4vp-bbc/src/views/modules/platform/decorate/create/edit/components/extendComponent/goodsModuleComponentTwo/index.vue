<template>
    <div class="goods-module-two-component">
        <goods-module-two :config="configMessage"></goods-module-two>
    </div>
</template>
<script>
import goodsModuleTwo from '../../../../commonComponent/goodsModuleTwo/index.vue'
export default {
  components: {
    goodsModuleTwo
  },
  props: {
    itemComponent: { // 组件信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      configMessage: {
        title: this.$i18n.t('pcdecorate.floorTitle.mainTitle')
      }
    }
  },
  watch: {
    itemComponent: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.configMessage = {
            title: newVal.rightConfigMessage.title, // 自定义标题
            maingoodsList: newVal.rightConfigMessage.maingoodsList, // 主商品
            othergoodsList: newVal.rightConfigMessage.othergoodsList // 其他商品
          }
        } else {
          this.configMessage = {
            title: this.$t('pcdecorate.goodsModule1.mainTitleCon'),
            maingoodsList: [],
            othergoodsList: []
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
.goods-module-two-component {
  width: $currentContentWidth;
  margin: 0 auto;
}
</style>