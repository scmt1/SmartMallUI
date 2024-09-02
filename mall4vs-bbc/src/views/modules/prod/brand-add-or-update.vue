<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.brandId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('temp.modify')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialogHandle"
    >
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item :label="this.$i18n.t('product.brandName')" prop="brandName">
          <el-input
            type="text"
            :placeholder="this.$i18n.t('product.pleaEntBraName')"
            v-model="dataForm.brandName"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('product.branls')" prop="firstChar">
          <el-input
            type="text"
            :placeholder="this.$i18n.t('product.pletials')"
            v-model="dataForm.firstChar"
            maxlength="1"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('admin.carouselImg')" prop="brandPic">
          <img-upload v-model="dataForm.brandPic"></img-upload>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('publics.des')" prop="brief">
          <el-input
            type="textarea"
            :placeholder="this.$i18n.t('product.pleaemarks')"
            v-model="dataForm.brief"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('temp.sequence')" prop="seq">
          <el-input v-model="dataForm.seq" type="number" min="0"  @change="maxSeq"></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('product.status')" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">{{$t("publics.disable")}}</el-radio>
            <el-radio :label="1">{{$t("publics.normal")}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    var validateSeq = (rule, value, callback) => {
      if (this.dataForm.seq < 0 && rule.field === 'seq') {
        callback(new Error(this.$i18n.t('publics.seqError')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        brandId: 0,
        brandName: '',
        brandPic: '',
        brief: '',
        seq: 0,
        status: 1,
        firstChar: ''
      },
      brandSelectVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        brandName: [
          { required: true, message: this.$i18n.t('product.brandNaBeEmpty'), trigger: 'blur' }
        ],
        firstChar: [
          { required: true, message: this.$i18n.t('product.brandInitBeEmpty'), trigger: 'blur' }
        ],
        seq: [
          { required: true, message: this.$i18n.t('product.sortValmpty'), trigger: 'blur' }, {validator: validateSeq, trigger: 'blur'}
        ]
      },
      visible: false
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    // 获取分类数据
    init (id) {
      this.visible = true
      this.dataForm.brandId = id || 0
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.brandId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/admin/brand/info/${this.dataForm.brandId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.brandPic = ''
          this.relation = null
        })
      }
    },
    /**
     * 顺序值上限校验
     */
    maxSeq () {
      let maxseq = Math.round(this.dataForm.seq)
      if (this.dataForm.seq < 0) {
        this.dataForm.seq = 0
      }
      this.dataForm.seq = maxseq > 999999999 ? 999999999 : maxseq
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/admin/brand`),
            method: param.brandId ? 'put' : 'post',
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
          })
        }
      })
    },
    // 关闭对话框回调
    closeDialogHandle () {
      this.$refs['dataForm'].resetFields()
      this.dataForm.relation = null
    }
  }
}
</script>
<style lang="scss">
</style>
