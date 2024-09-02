<!--结构必须如下 创建新组件是可以复制以下html-->
<!--
<div class="自定义class">
  <div class="design-preview-controller">
     预览区域
  </div>
  <div class="design-editor-item design-hide-class" v-if="isShowEdit">
      <div class="design-config-editor">
      <div class="design-editor-component-title">组件名称(如果为顶部配置组件可以不要该dom)</div>
      编辑区域
      </div>
  </div>
</div>
-->
<template>
  <div class="micro-header-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div class="preview-header">
        <div class="preview-header-title">{{ formData.title || $t('shopFeature.header.microTitle') }}</div>
      </div>
    </div>
    <!--编辑工作区-->
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.header.pageName')}}</div>
        <div style="padding: 20px 0;background: #fff">
          <el-form ref="formData"
                  :model="formData"
                  label-width="100px">
            <el-form-item :label="$i18n.t('shopFeature.header.pageName')"
                          prop="title"
                          :rules="{
                required: true, message: $i18n.t('shopFeature.header.pageNameCanntEmpty'), trigger: 'blur'
              }">
              <el-input v-model.trim="formData.title"
                        maxlength="10"
                        :placeholder="$i18n.t('shopFeature.header.pageNamePlaceholder')"
                        size="small" />
            </el-form-item>
            <!-- <el-form-item label="页面描述:">
              <el-input v-model="formData.description"
                        size="small"
                        placeholder="用户通过微信分享给朋友时，会自动显示页面描述" />
            </el-form-item>
            <el-form-item label="是否定时发布:">
              <el-switch v-model="formData.isTimeRelease"
                        :disabled="id!==''"
                        active-color="#13ce66"
                        inactive-color="#ff4949" />
            </el-form-item>
            <el-form-item v-if="formData.isTimeRelease"
                          label="定时发布时间:"
                          prop="gmtStart">
              <el-date-picker v-model="formData.gmtStart"
                              :disabled="id!==''"
                              size="mini"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              type="datetime"
                              placeholder="选择日期时间" />
            </el-form-item>   -->
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { microCreateMinis } from '../../minis'

/** 头部配置 */
export default {
  name: 'micro-header-box',
  mixins: [microCreateMinis],
  props: {},
  data () {
    return {
      formData: {
        title: '',
        description: '',
        category: '',
        gmtStart: ''
      },
      id: '',
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      errorMessage: '' // 错误提示信息
    }
  },
  watch: {},
  components: {},
  computed: {},
  mounted () {},
  methods: {
    /**
     * 开始验证
     */
    checkData () {
      let isPass = true
      if (!this.formData.title.trim()) {
        isPass = false
        this.errorMessage = this.$i18n.t('shopFeature.header.pageNameCanntEmpty')
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        this.showCheckForm()
        this.$newMessage.error(this.errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
