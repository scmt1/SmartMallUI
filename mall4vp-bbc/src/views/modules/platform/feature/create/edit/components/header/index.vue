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
      <div v-if="formData.bgType===0" class="preview-header" :style="{ 'background': formData.bgColor }">
        <div class="preview-header-title" :style="{color: formData.textColor}">{{ formData.title || $t('shopFeature.header.microTitle') }}</div>
      </div>
      <div v-else-if="formData.bgType===1" class="preview-header" :style="[formData.bgImg ? {'background-image': `url(${resources + formData.bgImg}) !important`} : { 'background': formData.bgColor }]">
        <div class="preview-header-title" :style="{color: formData.textColor}">{{ formData.title || $t('shopFeature.header.microTitle') }}</div>
      </div>
      <div v-else class="preview-header">
        <div class="preview-header-title" :style="{color: formData.textColor}">{{ formData.title || $t('shopFeature.header.microTitle') }}</div>
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
                  :rules="rules"
                  label-width="100px">
            <el-form-item :label="$i18n.t('shopFeature.header.pageName')"
                          prop="title">
              <el-input v-model.trim="formData.title"
                        maxlength="10"
                        :placeholder="$i18n.t('shopFeature.header.pageNamePlaceholder')"
                        size="small" />
            </el-form-item>
            <!-- <el-form-item :label="$i18n.t('shopFeature.header.fontColor')">
              <el-radio v-model="formData.textColor" label="#ffffff">{{$t('shopFeature.header.white')}}</el-radio>
              <el-radio v-model="formData.textColor" label="#000000">{{$t('shopFeature.header.black')}}</el-radio>
            </el-form-item> -->
            <!-- <el-form-item :label="$i18n.t('shopFeature.header.headerBg')">
              <el-radio v-model="formData.bgType" :label="0">{{$t('shopFeature.header.customColor')}}</el-radio>
              <el-radio v-model="formData.bgType" :label="1">{{$t('shopFeature.header.pic')}}</el-radio>
              <div v-if="formData.bgType === 1">
                <img-upload v-model="formData.bgImg"></img-upload>
                <div class="default-btn" @click="formData.bgImg=''">
                  {{$t('shopFeature.header.reset')}}
                </div>
              </div>
              <el-form-item
                v-if="formData.bgType === 0"
                prop="bgColor">
                <el-input v-model.trim="formData.bgColor"
                  :placeholder="$i18n.t('shopFeature.header.colorErrTips')"
                  size="small" />
              </el-form-item>
            </el-form-item> -->
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
import ImgUpload from '@/components/img-upload'
/** 头部配置 */
export default {
  name: 'micro-header-box',
  mixins: [microCreateMinis],
  props: {},
  data () {
    const validateBgColor = (rule, value, callback) => {
      console.log(value)
      const colorTest = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      if (!colorTest.test(value)) {
        callback(new Error(this.$i18n.t('shopFeature.header.colorErrTips')))
      } else {
        callback()
      }
    }
    const validatePageTitle = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shopFeature.header.pageNameCanntEmpty')))
      } else {
        callback()
      }
    }
    return {
      formData: {
        title: '',
        bgImg: '',
        textColor: '#ffffff',
        description: '',
        category: '',
        gmtStart: '',
        bgType: 0,
        bgColor: '#e43130'
      },
      id: '',
      resources: process.env.VUE_APP_RESOURCES_URL,
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      errorMessage: '', // 错误提示信息
      rules: {
        bgColor: [
          { validator: validateBgColor, trigger: 'blur' }
        ],
        title: [
          { required: true, validator: validatePageTitle, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  components: {
    ImgUpload
  },
  computed: {},
  mounted () { },
  methods: {
    /**
     * 开始验证
     */
    checkData () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.myCheckResult(true)
          this.showCheckForm()
        } else {
          this.$newMessage.error(this.$i18n.t('shopFeature.header.pageNameCanntEmpty'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

