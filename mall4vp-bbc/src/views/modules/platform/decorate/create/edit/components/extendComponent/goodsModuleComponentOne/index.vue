<template>
    <div class="goods-module-one-component">
        <div class="one-items">
            <goods-module-one :config="config.leftConfigMessage"></goods-module-one>
        </div>
        <div class="one-items">
            <goods-module-one :config="config.centerConfigMessage"></goods-module-one>
        </div>
        <div class="one-items">
            <goods-module-one :config="config.rightConfigMessage"></goods-module-one>
        </div>
    </div>
</template>
<script>
import goodsModuleOne from '../../../../commonComponent/goodsModuleOne/index.vue'
export default {
  components: {
    goodsModuleOne
  },
  props: {
    itemComponent: { // 组件信息展示
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      config: { // 配置信息
        leftConfigMessage: {
          mainTitle: this.$i18n.t('pcdecorate.floorTitle.mainTitle'),
          subTitle: this.$i18n.t('pcdecorate.floorTitle.subTitle')
        }, // 左边配置信息
        centerConfigMessage: {
          mainTitle: this.$i18n.t('pcdecorate.floorTitle.mainTitle'),
          subTitle: this.$i18n.t('pcdecorate.floorTitle.subTitle')
        }, // 中间配置信息
        rightConfigMessage: {
          mainTitle: this.$i18n.t('pcdecorate.floorTitle.mainTitle'),
          subTitle: this.$i18n.t('pcdecorate.floorTitle.subTitle')
        } // 右边配置信息
      }
    }
  },
  methods: {
    init () {
      this.config.leftConfigMessage = {
        currentIndex: 1, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
      this.config.centerConfigMessage = {
        currentIndex: 3, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
      this.config.rightConfigMessage = {
        currentIndex: 2, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
    }
  },
  watch: {
    itemComponent: { // 监听组件的信息
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.config.leftConfigMessage = {...newVal.rightConfigMessage.leftConfig}
          this.config.centerConfigMessage = {...newVal.rightConfigMessage.centerConfig}
          this.config.rightConfigMessage = {...newVal.rightConfigMessage.rightConfig}
        } else {
          this.init()
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
.goods-module-one-component {
  width: $currentContentWidth;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .one-items{
    width: calc((100% - 40px) / 3)
  }
}
</style>