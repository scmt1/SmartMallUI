<template>
  <el-dialog
    :title="
      !dataForm.id ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="dialogWidth"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        :label="this.$i18n.t('shop.announcementTitle')"
        prop="title"
      >
        <el-input size="small" maxlength="36" v-model="dataForm.title" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{ $t("publics.publicar") }}</el-radio>
          <el-radio :label="0">{{ $t("publics.cancel") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('publics.isTop')" prop="isTop">
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="1">{{ $t("publics.yes") }}</el-radio>
          <el-radio :label="0">{{ $t("publics.no") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('shop.noticeContent')" prop="content">
        <tiny-mce ref="tinyMce"  :tinymce-height="277" v-model="dataForm.content" v-if="visible"></tiny-mce>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div @click="visible = false" class="default-btn">{{ $t("crud.filter.cancelBtn") }}</div>
       <div @click="dataFormSubmit()" class="default-btn primary-btn">{{ $t("crud.filter.submitBtn") }}</div>
    </span>
  </el-dialog>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
import { Debounce } from '@/utils/debounce'
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
export default {
  data () {
    var validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shop.titCanNoBlank')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        title: null,
        content: null,
        url: null,
        status: 1,
        isTop: 0
      },
      dataRule: {
        title: [
          { required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur' },
          { validator: validateTitle, trigger: 'blur' }
        ]
      },
      dialogWidth: '740px',
      defWidth: 740
    }
  },
  components: {
    TinyMce
  },
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/shop/notice/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.$nextTick(() =>
              this.$refs.tinyMce.setContent(this.dataForm.content))
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/notice'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
                this.dataForm.content = ''
              }
            })
          })
        }
      })
    }, 1500)
  }
}
</script>
