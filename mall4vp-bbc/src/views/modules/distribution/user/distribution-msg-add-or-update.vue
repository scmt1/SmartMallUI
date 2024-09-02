<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      :title="$t('distributionMsg.announcementManagement')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="770px"
      top="10vh"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="
          this.$i18n.t('language') === 'language' ? '150px' : '90px'
        "
      >
        <el-form-item :label="$t('distributionMsg.whetherTop')" prop="msgType">
          <el-radio-group v-model="dataForm.isTop">
            <el-radio :label="1">{{ $t("publics.yes") }}</el-radio>
            <el-radio :label="0">{{ $t("publics.no") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  :label="$t('marketing.castTime')"  prop="startTime" >
            <el-date-picker
              v-model="dataForm.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              size="small"
              :placeholder="$t('marketing.castTime')"
            ></el-date-picker>
        </el-form-item>

        <el-form-item prop="endTime" :label="$t('marketing.endTime')">
            <el-date-picker
              v-model="dataForm.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              size="small"
              :placeholder="$t('marketing.endTime')"
            ></el-date-picker>
        </el-form-item>
<!--        </el-form-item>-->

        <el-form-item :label="$t('distributionMsg.title')" prop="msgTitle">
          <el-input
            v-model="dataForm.msgTitle"
            :placeholder="$t('distributionMsg.pleaseTitle')"
            controls-position="right"
            size="small"
            :min="0"
            :label="$t('distributionMsg.title')"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="封面图片"
                      prop="pic">
          <pic-upload v-model="dataForm.pic"></pic-upload>
        </el-form-item>-->

        <el-form-item :label="$t('publics.content')" prop="content">
          <div class="rich-text">
            <tiny-mce
              v-model="dataForm.content"
              ref="tinyMce"
              :tinymceHeight="250"
              v-if="visible"
            ></tiny-mce>
          </div>
        </el-form-item>

        <!-- <el-form-item label="状态"
                      size="mini"
                      prop="state">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{ $t("remindPop.cancel") }}</div>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t("remindPop.confirm") }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
import { isHtmlNull } from '@/utils/index.js'
export default {

  data () {
    var validateTime = (rule, value, callback) => {
      if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('coupon.validateTime')))
      } else {
        callback()
      }
    }
    var validateTitle = (rule, value, callback) => {
      if (!value || !value.trim()) {
        callback(new Error(this.$i18n.t('recruit.tipTitleTip1')))
      } else {
        callback()
      }
    }
    var validateContent = (rule, value, callback) => {
      if (isHtmlNull(value)) {
        callback(new Error(this.$i18n.t('product.content')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        'time': [],
        'msgId': 0,
        'msgTitle': '',
        'isTop': 0,
        'content': '',
        'pic': '',
        'msgType': 0,
        'state': 0,
        'startTime': '',
        'endTime': ''
      },
      addProdVisible: false,
      isSubmit: false,
      visible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        msgTitle: [
          { required: true, message: this.$i18n.t('recruit.tipTitleTip1'), trigger: 'blur' },
          { max: 255, message: this.$i18n.t('recruit.limitLangTip2'), trigger: 'blur' },
          { validator: validateTitle, trigger: 'blur' }
        ],
        content: [
          { required: true, message: this.$i18n.t('product.content'), trigger: 'blur' },
          { validator: validateContent, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('coupon.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('coupon.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    TinyMce,
    ImgUpload
  },
  methods: {
    init (msgId) {
      this.dataForm.msgId = msgId || 0
      this.isSubmit = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.msgId) {
        this.getDataList()
      }
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionMsg/info/${this.dataForm.msgId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.$nextTick(() =>
          this.$refs.tinyMce.setContent(this.dataForm.content))
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionMsg`),
            method: param.msgId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$refs['dataForm'].resetFields()
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.time-item {
  display: flex;
  span {
    margin: 0 8px;
  }
}
.time-item >>> .el-form-item {
  display: inline-block;
}
.time-item >>> .el-form-item__content {
  margin-left: 0 !important;
}
</style>
