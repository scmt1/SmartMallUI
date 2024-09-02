<template>
  <el-dialog
    :title="!dataForm.sysAccessKeyId ? $t('brand.add') : $t('user.editBtn')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '150px' : '80px'"
    >
      <el-form-item :label="$t('sys.keyName')" prop="name">
        <el-input size="small" maxlength="30" v-model="dataForm.name" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('crud.remark')" prop="remark">
        <el-input size="small" type="textarea" maxlength="100" v-model="dataForm.remark" :autosize="{ minRows: 3, maxRows: 6}" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.accessId')" v-if="dataForm.sysAccessKeyId" prop="remark">
        <span> {{ dataForm.accessId }} </span>
      </el-form-item>
      <el-form-item :label="$t('sys.key')" v-if="dataForm.sysAccessKeyId" prop="remark">
        <span> {{ dataForm.accessKey }} </span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import {isHtmlNull} from '@/utils/index.js'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        sysAccessKeyId: 0,
        name: null,
        remark: null,
        accessId: null,
        accessKey: null,
        access_id: null
      },
      isSubmit: false,
      dataRule: {
        name: [
          { required: true, message: this.$i18n.t('sys.NameNoNull'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    init (id) {
      this.dataForm.sysAccessKeyId = id || 0
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.sysAccessKeyId) {
          this.$http({
            url: this.$http.adornUrl('/platform/sysAccessKey/info/' + this.dataForm.sysAccessKeyId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          if (isHtmlNull(this.dataForm.name)) {
            this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
            return
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/platform/sysAccessKey'),
            method: this.dataForm.sysAccessKeyId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
                this.dataForm.content = ''
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
