<template>
  <div class="mod-marketing-distribution-item recruit-set">
    <el-form
      ref="dataForm"
      size="small"
      label-width="75"
      :rules="dataRule"
      :model="dataForm"
    >
    <div class="form-item">
      <div class="title">{{ $t("recruit.recruitPop") }}</div>
      <div class="form-item-content">
        <el-form-item :label="$t('recruit.popularizeSwitch')+':'" prop="state">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="0">{{ $t("seckill.close") }}</el-radio>
            <el-radio :label="1">{{ $t("seckill.open") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('recruit.coverImage')+':'">
          <img-upload v-model="dataForm.pic" />
        </el-form-item>

        <el-form-item :label="$t('recruit.popularizeTitle')+':'" prop="title">
          <el-input
            v-model="dataForm.title"
            style="width: 900px"
            maxlength="60"
            size="small"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('recruit.popularizeContent')+':'" prop="content">
          <tiny-mce
            v-model="dataForm.content"
            style="width: 900px;display: inline-block;"
            :key="tinymceFlag"
          ></tiny-mce>
        </el-form-item>
        <el-form-item >
          <template slot='label'>
             <span class="item" style="visibility: hidden;">
                {{ $t('recruit.popularizeContent')+'*:'}}
              </span>
          </template>
          <div class="default-btn primary-btn" style="display: inline-block;" @click="dataFormSubmit()">{{$t('distribution.save')}}</div>
        </el-form-item>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import ImgUpload from './distribution-recruit-set-img-upload.vue'
import TinyMce from '@/components/tiny-mce'
import { isHtmlNull } from '@/utils/index.js'

export default {
  components: {
    ImgUpload,
    TinyMce
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/distributionConfig/recruit_info'),
        method: 'get'
      }).then(({ data }) => {
        if (data) {
          this.setDate(data)
        }
        this.dataListLoading = false
      })
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        console.log('valid:', valid)
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/platform/distributionConfig/recruit`),
            method: 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  },
  data () {
    var validateContent = (rule, value, callback) => {
      if (isHtmlNull(value)) {
        callback(new Error(this.$i18n.t('product.content')))
      } else {
        callback()
      }
    }
    return {
      addOrUpdateVisible: false,
      tinymceFlag: new Date() + 1,
      dataForm: {
        'pic': '',
        'title': '',
        'content': ''
      },
      dataRule: {
        title: [
          { required: true, message: this.$i18n.t('recruit.tipTitleTip1'), trigger: 'brue' },
          { max: 255, message: this.$i18n.t('recruit.limitLangTip2'), trigger: 'brue' }
        ],
        content: [
          { required: true, message: this.$i18n.t('product.content'), trigger: 'brue' },
          { validator: validateContent, trigger: 'blur' }
        ]
      }
    }
  },
  // keep-alive缓存的缘故 需调用钩子函数 设置key值不然编辑器无法使用
  activated () {
    this.tinymceFlag = new Date() + 1
  }
}
</script>

