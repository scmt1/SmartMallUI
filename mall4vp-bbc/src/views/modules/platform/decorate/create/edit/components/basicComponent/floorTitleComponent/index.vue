<template>
  <div class="floor-page-container">
    <commonFloorTitle :config="config"></commonFloorTitle>
  </div>
</template>
<script>
import commonFloorTitle from '../../../../commonComponent/floorTitleComponent/index.vue'
export default {
  components: {
    commonFloorTitle
  },
  props: {
    itemComponent: { // 当前组件的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      config: {}
    }
  },
  watch: {
    itemComponent: { // 监听组件信息
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.config = {
            mainContent: { // 主标题
              title: newVal.rightConfigMessage.mainTitle,
              fontSize: newVal.rightConfigMessage.mainFontSize + 'px',
              color: newVal.rightConfigMessage.mainTextColor
            },
            subContent: { // 副标题
              title: newVal.rightConfigMessage.subTitle,
              fontSize: newVal.rightConfigMessage.subFontSize + 'px',
              color: newVal.rightConfigMessage.subTextColor
            },
            showSubTitle: 0, // 是否展示副标题
            background: newVal.rightConfigMessage.bgColor, // 背景颜色
            marginTop: newVal.rightConfigMessage.marginTop + 'px', // 上边距
            marginBottom: newVal.rightConfigMessage.marginBottom + 'px', // 下边距
            showMore: newVal.rightConfigMessage.more, // 是否展示更多
            path: {
              link: newVal.rightConfigMessage.path.link, // 更多的链接
              name: newVal.rightConfigMessage.path.name,
              type: newVal.rightConfigMessage.path.type
            },
            moreTextColor: newVal.rightConfigMessage.moreTextColor // 查看更多的文字颜色
          }
        } else {
          this.config = {
            mainContent: {
              title: this.$t('pcdecorate.floorTitle.mainTitCon'),
              fontSize: '24px',
              color: 'rgba(51, 51, 51, 1)'
            },
            subContent: {
              title: this.$t('pcdecorate.floorTitle.subTitCon'),
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
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped>
.floor-page-container {
    overflow: hidden;
}
</style>