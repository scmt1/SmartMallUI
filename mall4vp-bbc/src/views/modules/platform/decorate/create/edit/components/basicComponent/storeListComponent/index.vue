<template>
    <div class="store-list-container">
        <commonFloorTitle :config="titleConfig"></commonFloorTitle>
        <div class="store-list-pages">
            <storeListComponent :config="storeConfig"></storeListComponent>
        </div>
    </div>
</template>
<script>
import commonFloorTitle from '../../../../commonComponent/floorTitleComponent/index.vue'
import storeListComponent from '../../../../commonComponent/storelistComponent/index.vue'
export default {
  components: {
    commonFloorTitle,
    storeListComponent
  },
  props: {
    itemComponent: { // 当前组件的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      titleConfig: {
        mainContent: {
          title: this.$i18n.t('pcdecorate.storeList.storeTitle'),
          fontSize: '24px',
          color: 'rgba(51, 51, 51, 1)'
        },
        background: 'rgba(244, 244, 244, 1)',
        marginTop: '18px',
        marginBottom: '18px',
        showMore: 0,
        moreLink: '',
        moreTextColor: 'rgba(153, 153, 153, 1)',
        showSubTitle: 0,
        subContent: {
          title: this.$i18n.t('pcdecorate.storeList.storeSubTitle'),
          fontSize: '12px',
          color: 'rgba(153, 153, 153, 1)'
        }
      }, // 标题配置
      storeConfig: {} // 店铺配置
    }
  },
  watch: {
    itemComponent: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.titleConfig = {
            mainContent: { // 主标题
              title: this.$i18n.t('pcdecorate.storeList.storeTitle'),
              fontSize: newVal.rightConfigMessage.mainFontSize + 'px', // 主标题文字大小
              color: newVal.rightConfigMessage.mainTextColor // 主标题颜色
            },
            background: newVal.rightConfigMessage.bgColor, // 标题的背景颜色
            marginTop: newVal.rightConfigMessage.marginTop + 'px', // 上边距
            marginBottom: newVal.rightConfigMessage.marginBottom + 'px', // 下边距
            showMore: 0,
            moreLink: '',
            moreTextColor: 'rgba(153, 153, 153, 1)',
            showSubTitle: newVal.rightConfigMessage.showSubTitle, // 是否展示副标题
            subContent: {
              title: newVal.rightConfigMessage.subTitle,
              fontSize: newVal.rightConfigMessage.subFontSize + 'px',
              color: newVal.rightConfigMessage.subTextColor
            }
          }
            // 店铺列表展示
          this.storeConfig = {
            storeList: newVal.rightConfigMessage.storeList
          }
        } else {
          this.titleConfig = {
            mainContent: {
              title: this.$i18n.t('pcdecorate.storeList.storeTitle'),
              fontSize: '24px',
              color: 'rgba(51, 51, 51, 1)'
            },
            subContent: {
              title: this.$t('pcdecorate.componentTitle.subTitleCon'),
              fontSize: '12px',
              color: 'rgba(153, 153, 153, 1)'
            },
            showSubTitle: 0, // 是否展示副标题
            background: 'rgba(244, 244, 244, 1)', // 背景颜色
            marginTop: '18px', // 上边距
            marginBottom: '18px', // 下边距
            showMore: 0, // 是否展示更多
            path: {
              link: '', // 更多的链接
              name: '',
              type: ''
            },
            moreTextColor: 'rgba(153, 153, 153, 1)' // 查看更多的文字颜色
          }
          // 店铺列表展示
          this.storeConfig = {
            storeList: []
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
$currentContentWidth: 1200px ; // 当前页面内容宽度
.store-list-container {
  width: 100%;
  overflow: hidden;
  .store-list-pages {
    width: $currentContentWidth;
    margin: 0 auto;
  }
}

</style>