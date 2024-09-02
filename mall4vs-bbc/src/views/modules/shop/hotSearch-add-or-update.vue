<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      :title="
        !dataForm.hotSearchId
          ? this.$i18n.t('crud.addTitle')
          : this.$i18n.t('temp.modify')
      "
      :close-on-click-modal="false"
      @closed="dialogClosed"
      :visible.sync="visible"
      :width="dialogWidth"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="labelWidth"
      >
        <el-form-item :label="this.$i18n.t('shop.title')" prop="title">
          <el-input
            v-model="dataForm.title"
            controls-position="right"
            maxlength="50"
            size="small"
            show-word-limit
            :label="this.$i18n.t('shop.title')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('shop.content')" prop="content">
          <el-input
            v-model="dataForm.content"
            controls-position="right"
            maxlength="250"
            type="textarea"
            show-word-limit
            :label="this.$i18n.t('shop.content')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('hotSearch.seq')" prop="seq">
          <el-input-number
            v-model="dataForm.seq"
            controls-position="right"
            :min="0"
            size="small"
            :max="999"
            :label="this.$i18n.t('hotSearch.seq')"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          :label="this.$i18n.t('product.status')"
          size="mini"
          prop="status"
        >
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="1">{{ $t("publics.normal") }}</el-radio>
            <el-radio :label="0">{{ $t("live.offline") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn"  @click="visible = false">{{ $t("crud.filter.cancelBtn") }}</div>
        <div class="default-btn primary-btn"  @click="dataFormSubmit">{{ $t("crud.filter.submitBtn") }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
export default {
  data () {
    var validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shop.title') + this.$i18n.t('publics.noNull')))
      } else {
        callback()
      }
    }
    var validateContent = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('shop.content') + this.$i18n.t('publics.noNull')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        hotSearchId: 0,
        title: '',
        content: '',
        recDate: '',
        seq: 0,
        status: 1
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      isSubmit: false,
      addProdVisible: false,
      visible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        title: [
          { required: true, message: this.$i18n.t('shop.title') + this.$i18n.t('publics.noNull'), trigger: 'blur' },
          {validator: validateTitle, trigger: 'blur'}
        ],
        content: [
          { required: true, message: this.$i18n.t('shop.content') + this.$i18n.t('publics.noNull'), trigger: 'blur' },
          {validator: validateContent, trigger: 'blur'}
        ]
      },
      dialogWidth: '',
      defWidth: 600,
      labelWidth: localStorage.getItem('lang') === 'en' ? '120px' : '80px'
    }
  },
  components: {},
  created () {
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
  },
  methods: {
    init (data) {
      this.visible = true
      this.isSubmit = false
      if (data) {
        this.dataForm = Object.assign({}, data)
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm = {
            hotSearchId: 0,
            title: '',
            content: '',
            recDate: '',
            seq: 0,
            status: 1
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let param = this.dataForm
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/admin/hotSearch`),
            method: param.hotSearchId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    // 清除表单验证
    dialogClosed () {
      this.$refs.dataForm.clearValidate()
    }
  }
}
</script>

<style scoped lang="scss">
  div ::v-deep .el-textarea__inner {
    padding-right: 56px;
  }
</style>
