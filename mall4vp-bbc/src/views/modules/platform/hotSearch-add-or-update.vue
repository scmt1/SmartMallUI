<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      :title="
        !dataForm.hotSearchId ? $t('brand.add') : $t('sysManagement.modify')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px"
      >
        <el-form-item :label="$t('shop.hotTitle')" prop="title">
          <el-input
            size="small"
            v-model="dataForm.title"
            controls-position="right"
            :min="0"
            maxlength="50"
            show-word-limit
            :label="$t('distributionMsg.title')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('shop.hotContent')" prop="content">
          <el-input
            size="small"
            v-model="dataForm.content"
            controls-position="right"
            @change="checkcontent"
            :min="0"
            maxlength="250"
            show-word-limit
            :label="$t('publics.content')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('brand.sequence')" prop="seq">
          <el-input-number
            size="small"
            v-model="dataForm.seq"
            controls-position="right"
            :min="-99999"
            :max="9999999"
            :label="$t('hotSearch.seq')"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('brand.status')" size="mini" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">{{$t('groups.notEnabled')}}</el-radio>
            <el-radio :label="1">{{$t('brand.enAble')}}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script>
export default {
  data () {
    var validateTitle = (rule, value, callback) => {
      if (String(value).trim() === '') {
        callback(new Error(this.$i18n.t('order.cannotEmpty')))
      } else {
        callback()
      }
    }
    var validateContent = (rule, value, callback) => {
      if (String(value).trim() === '') {
        callback(new Error(this.$i18n.t('order.cannotEmpty')))
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
        status: 0
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
          { required: true, message: this.$i18n.t('hotSearch.titleCannotBeEmpty'), trigger: 'blur' },
          { min: 1, max: 50, message: this.$i18n.t('hotSearch.length50'), trigger: 'blur' },
          {validator: validateTitle, trigger: 'blur'}
        ],
        content: [
          { required: true, message: this.$i18n.t('hotSearch.ContentCannotBeEmpty'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$i18n.t('hotSearch.length250'), trigger: 'blur' },
          {validator: validateContent, trigger: 'blur'}
        ]
      }
    }
  },
  components: {},
  methods: {
    init (data) {
      this.visible = true
      this.isSubmit = false
      if (data) {
        this.dataForm = Object.assign({}, data)
        this.$refs['dataForm'].clearValidate()
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          this.dataForm = {
            hotSearchId: 0,
            title: '',
            content: '',
            recDate: '',
            seq: 0,
            status: 0
          }
        })
      }
    },
    checkcontent () {
      this.dataForm.content = this.dataForm.content.trim()
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
            url: this.$http.adornUrl(`/platform/hotSearch`),
            method: param.hotSearchId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
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
    }
  }
}
</script>
