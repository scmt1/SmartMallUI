<template>
  <div class="micro-notice-box">
    <div class="design-preview-controller">
      <div class="notice-content">
        <span class="iconfont_ckq ckq_notice" />
        {{ formData.title }}
      </div>
    </div>
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.notice.announcement')}}</div>
        <div class="add-notice">
          <p>{{$t('shopFeature.notice.announcementTips1')}}</p>
          <p>{{$t('shopFeature.notice.announcementTips2')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {microCreateMinis} from '../../minis'

export default {
  name: 'micro-notice-box',
  mixins: [microCreateMinis],
  props: {},
  data () {
    return {
      formData: {
        title: this.$i18n.t('shopFeature.notice.announcement')
      },
      commonCheckFieldRules: 'checkData' // 当前组件默认的规则判断函数
    }
  },
  watch: {},
  components: {},
  computed: {},
  mounted () {
  },
  methods: {
    /**
     * 开始验证
     */
    checkData () {
      this.myCheckResult(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
