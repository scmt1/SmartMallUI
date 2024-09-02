<!--公共广告头部组件-->
<template>
  <div class="micro-header-ad-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div class="preview-header">
        <div class="preview-header-title">{{ title }}</div>
      </div>
    </div>
    <!--编辑工作区-->
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <el-form ref="form"
                 :model="formData"
                 label-width="100px">
          <el-form-item :label="$i18n.t('shopFeature.headerAd.showPosition')">
            <el-radio v-for="(itemPosition,indexPosition) in positions"
                      :key="indexPosition"
                      v-model="formData.position"
                      :label="itemPosition.label">{{ itemPosition.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$i18n.t('shopFeature.headerAd.showPages')">
            <el-checkbox-group v-model="formData.page">
              <el-checkbox v-for="(itemShowContent,indexShowContent) in pages"
                           :key="indexShowContent"
                           :label="itemShowContent.label">{{ itemShowContent.title }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import index from './index.js'

export default index
</script>
