<template>
  <el-dialog
    :title="!isEdit ? this.$i18n.t('live.view') : this.$i18n.t('groups.edit')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      size="small"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <div v-if="!isEdit">
        <el-row>
          <el-col :span="12">
            <!-- 记录时间 -->
            <el-form-item :label="this.$i18n.t('productComm.recTime')" prop="userName">
              <el-input v-model="dataForm.recTime" :readonly="true" :disabled="!isEdit"></el-input>
            </el-form-item>
            <!-- IP来源 -->
            <el-form-item :label="this.$i18n.t('productComm.postip')" prop="userName">
              <el-input v-model="dataForm.postip" :readonly="true" :disabled="!isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 回复时间 -->
            <el-form-item :label="this.$i18n.t('productComm.replyTime')" prop="userName" :readonly="true">
              <el-input v-model="dataForm.replyTime" :readonly="true" :disabled="!isEdit"></el-input>
            </el-form-item>
            <!-- 评价得分 -->
            <el-form-item :label="this.$i18n.t('productComm.score')" prop="score">
              <el-input v-model="dataForm.score" :readonly="true" :disabled="!isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 评论内容 -->
        <el-form-item :label="this.$i18n.t('productComm.content')" prop="userName">
          <el-input type="textarea" :rows="4" :readonly="true" v-model="dataForm.content" :disabled="!isEdit" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <!-- 掌柜回复 -->
        <el-form-item :label="this.$i18n.t('productComm.replyContent')" type="textarea" prop="userName">
          <el-input type="textarea" :rows="4" v-model="dataForm.replyContent" :readonly="!isEdit" :disabled="!isEdit" maxlength="480" show-word-limit></el-input>
        </el-form-item>
        <!-- 评论图片 -->
        <el-form-item :label="this.$i18n.t('productComm.pics')" prop="userName">
          <div v-if="!pics">{{$t("productComm.no")}}</div>
          <imgs-upload v-model="pics" :disabled="true" :modal="false" :prompt="false" />
        </el-form-item>
        <!-- 是否匿名 -->
        <el-form-item :label="this.$i18n.t('productComm.isAnonymous')" size="mini" prop="isAnonymous">
          <el-radio-group v-model="dataForm.isAnonymous" :disabled="true">
            <el-radio :label="1">{{$t("publics.yes")}}</el-radio>
            <el-radio :label="0">{{$t("publics.no")}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="isEdit">
        <el-form-item :label="this.$i18n.t('productComm.replyContent')" type="textarea" prop="replyContent" class="textarea-right">
          <el-input type="textarea" :rows="5" v-model="dataForm.replyContent" :readonly="!isEdit" :disabled="!isEdit" maxlength="480" show-word-limit></el-input>
        </el-form-item>
        <!-- 审核 -->
<!--        <el-form-item :label="this.$i18n.t('productComm.status')" size="mini" prop="status">-->
<!--          <el-radio-group v-model="dataForm.status" :readonly="true">-->
<!--            <el-radio :label="1">{{$t("productComm.pass")}}</el-radio>-->
<!--            <el-radio :label="-1">{{$t("productComm.noPass")}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" v-if="isEdit" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { validNoEmptySpace } from '@/utils/validate'
import ImgsUpload from '@/components/imgs-upload'
export default {
  data () {
    const validateReplyContent = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      isEdit: false,
      visible: false,
      dataForm: {
        prodCommId: null,
        prodId: null,
        orderItemId: null,
        userId: null,
        content: null,
        replyContent: null,
        recTime: null,
        replyTime: null,
        replySts: null,
        postip: null,
        score: null,
        usefulCounts: null,
        photoJson: null,
        isAnonymous: null,
        status: 1
      },
      pics: '',
      dataRule: {
        replyContent: [{validator: validateReplyContent}]
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    ImgsUpload
  },
  methods: {
    init (prodCommId, isEdit) {
      this.isEdit = isEdit
      this.dataForm.prodCommId = prodCommId || 0
      this.visible = true
      this.pics = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.prodCommId) {
          this.$http({
            url: this.$http.adornUrl('/prod/prodComm/info/' + this.dataForm.prodCommId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            var imgs = ''
            this.dataForm.picsArray.forEach(element => {
              imgs = imgs + element + ','
            })
            this.pics = imgs.substr(0, imgs.length - 1)
            this.$forceUpdate()
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/prod/prodComm'),
            method: this.dataForm.prodCommId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.textarea-right >>> .el-textarea__inner{
  padding-right: 50px;
}
.textarea-right >>> .el-textarea .el-input__count {
  right: 21px;
}
</style>
