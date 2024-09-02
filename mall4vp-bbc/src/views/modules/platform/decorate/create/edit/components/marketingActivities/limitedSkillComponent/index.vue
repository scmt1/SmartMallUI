<template>
    <div class="limited-skill-container">
        <floor-title-component :config="titleConfig"></floor-title-component>
        <div class="limited-skill-pages">
            <goods-list-component 
              :config="goodsConfig" 
              :currentType="true" 
              :type="'skill'"></goods-list-component>
        </div>
    </div>
</template>
<script>
import floorTitleComponent from '../../../../commonComponent/floorTitleComponent/index.vue'
import goodsListComponent from '../../../../commonComponent/goodsListComponent/index.vue'
export default {
  components: {
    floorTitleComponent,
    goodsListComponent
  },
  props: {
    itemComponent: { // 当前组件的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      titleConfig: { // 标题配置信息
        mainContent: {
          title: this.$i18n.t('pcdecorate.limitedSkill.mainTitle'),
          fontSize: '16px',
          color: 'rgba(51, 51, 51, 1)'
        },
        background: 'rgba(244, 244, 244, 1)',
        marginTop: '30px',
        marginBottom: '20px',
        showMore: 0,
        moreLink: '',
        moreTextColor: 'rgba(153, 153, 153, 1)',
        showSubTitle: 0,
        subContent: {
          title: this.$i18n.t('pcdecorate.limitedSkill.subTitle'),
          fontSize: '12px',
          color: 'rgba(153, 153, 153, 1)'
        }
      },
      goodsConfig: { // 商品配置信息
        showMany: 4,
        showName: 0,
        showDescription: 0,
        showPrice: 0,
        listTypeList: new Array(4),
        dataList: []
      }
    }
  },
  watch: {
    itemComponent: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    // 标题
          this.titleConfig = {
            mainContent: {
              title: this.$i18n.t('pcdecorate.limitedSkill.mainTitle'),
              fontSize: newVal.rightConfigMessage.mainFontSize + 'px',
              color: newVal.rightConfigMessage.mainTextColor
            },
            background: newVal.rightConfigMessage.bgColor,
            marginTop: newVal.rightConfigMessage.marginTop + 'px',
            marginBottom: newVal.rightConfigMessage.marginBottom + 'px',
            showMore: 0, // 是否展示查看更多
            moreLink: '', // 查看更多的链接
            moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多的文字颜色
            showSubTitle: newVal.rightConfigMessage.showSubTitle, // 是否展示副标题
            subContent: {
              title: newVal.rightConfigMessage.subTitle, // 副标题的内容
              fontSize: newVal.rightConfigMessage.subFontSize + 'px', // 副标题的大小
              color: newVal.rightConfigMessage.subTextColor // 副标题的文字颜色
            }
          }
                    // 商品列表
          this.goodsConfig = {
            showMany: 4,
            showName: newVal.rightConfigMessage.showContent.find(item => Number(item) === 0) ? 0 : 1,
            showDescription: newVal.rightConfigMessage.showContent.find(item => Number(item) === 1) ? 0 : 1,
            showPrice: newVal.rightConfigMessage.showContent.find(item => Number(item) === 2) ? 0 : 1,
            listTypeList: new Array(4),
            dataList: newVal.rightConfigMessage.goodsList
          }
        } else {
          this.titleConfig = {
            mainContent: {
              title: this.$i18n.t('pcdecorate.limitedSkill.mainTitle'),
              fontSize: '24px',
              color: 'rgba(51, 51, 51, 1)'
            },
            subContent: {
              title: this.$t('pcdecorate.limitedSkill.subTitle'),
              fontSize: '12px',
              color: 'rgba(153, 153, 153, 1)'
            },
            showSubTitle: 0, // 是否展示副标题
            background: 'rgba(244, 244, 244, 1)', // 背景颜色
            marginTop: '30px', // 上边距
            marginBottom: '20px', // 下边距
            showMore: 0, // 是否展示更多
            path: {
              link: '', // 更多的链接
              name: '',
              type: ''
            },
            moreTextColor: 'rgba(153, 153, 153, 1)' // 查看更多的文字颜色
          }
                    // 商品列表
          this.goodsConfig = {
            showMany: 4, // 一行展示多少个商品
            showName: 0, // 是否展示商品名称
            showDescription: 0, // 是否展示商品描述
            showPrice: 0, // 是否展示商品价格
            listTypeList: new Array(4),
            dataList: []
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
.limited-skill-container {
    width: 100%;
    overflow: hidden;
    .limited-skill-pages {
        margin: 0 auto;
    }
}

</style>