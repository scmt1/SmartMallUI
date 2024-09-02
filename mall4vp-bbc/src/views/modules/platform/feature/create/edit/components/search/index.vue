<!--公共广告头部组件-->
<template>
  <div class="micro-search-bar-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
        <div class="search-con" :style="{background:formData.bgColor }">
          <div class="micro-search-bar" :style="{height: formData.boxHeight + 'px',background:formData.boxColor, color: formData.textColor, borderRadius: formData.boxRadio+ 'px', justifyContent: formData.textAlgin }">
            <i class="el-icon-search"></i>
            <div class="tit-text">{{$t('shopFeature.searchBar.search')}}</div>
        </div>
      </div>
    </div>
    <!--编辑工作区-->
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{formData.title}}</div>
        <el-form ref="formData"
                 label-width="100px"
                 label-position="left"
                 >
          <el-form-item :label="$i18n.t('shopFeature.searchBar.showPos')">
            <el-radio v-for="(itemPosition,indexPosition) in positionType"
                      :key="indexPosition"
                      v-model="formData.position"
                      :label="itemPosition.label">{{ itemPosition.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.textPos')">
            <el-radio v-for="(textItem,textIndex) in textAlgin"
                      :key="textIndex"
                      v-model="formData.textAlgin"
                      :label="textItem.label">{{ textItem.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.boxStyle')">
            <el-radio v-for="(redioItem,styleIndex) in boxRadio"
                      :key="styleIndex"
                      v-model="formData.boxRadio"
                      :label="redioItem.label">{{ redioItem.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.boxHeight')">
            <el-slider v-model="formData.boxHeight" style="width: 100%" :show-tooltip="showTooltip" show-input input-size="mini" @input="changeBoxHeight(true)" @change="changeBoxHeight(false)" :min="28" :max="40"></el-slider>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.bgColor')">
              <el-color-picker v-model="formData.bgColor"/>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.boxColor')">
              <el-color-picker v-model="formData.boxColor"/>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.searchBar.textColor')">
              <el-color-picker v-model="formData.textColor"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import './index.scss'
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import {microCreateMinis} from '../../minis'

export default {
  name: 'micro-search-bar',
  mixins: [microCreateMinis],
  props: {
    current: {
      type: Number,
      default: true
    },
    currentUseComponents: {
      type: Array,
      default: true
    }

  },
  data () {
    return {
      formData: {
        title: this.$i18n.t('shopFeature.searchBar.search'),
        position: 1,
        boxRadio: 2,
        textAlgin: 'start',
        boxHeight: 28,
        bgColor: '#FFFFFF',
        boxColor: '#EEEEEE',
        textColor: '#999999'
      },
      // 各项设置
      positionType: [
        {label: 1, title: this.$i18n.t('shopFeature.searchBar.normal')},
        {label: 2, title: this.$i18n.t('shopFeature.searchBar.topThenLock')}
      ],
      boxRadio: [
        {label: 2, title: this.$i18n.t('shopFeature.searchBar.square')},
        {label: 50, title: this.$i18n.t('shopFeature.searchBar.fillet')}
      ],
      textAlgin: [
        {label: 'start', title: this.$i18n.t('shopFeature.searchBar.left')},
        {label: 'center', title: this.$i18n.t('shopFeature.searchBar.center')}
      ],
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数

      showTooltip: true
    }
  },
  watch: {
    position (val) {
      if (val === 2) {
        this.currentUseComponents.unshift(this.currentUseComponents[this.current])
        this.currentUseComponents.splice(this.current + 1, 1)
        this.$emit('topFixed')
      }
    }
  },
  components: {},
  computed: {
    position () {
      return this.formData.position
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 开始验证
     */
    checkData () {
      this.myCheckResult(this.formData.title)
    },
    /* 控制滑块tooltip隐藏 */
    changeBoxHeight(t) {
      this.showTooltip = t
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
