<template>
  <el-dialog
    :title="!dataForm.categoryId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('groups.edit')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="480px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'English'?'180px':'120px'"
    >
      <el-form-item
        v-if="dataForm.type !== 2"
        :label="this.$i18n.t('publics.categoryCn')"
        prop="categoryName"
      >
        <el-input
          size="small"
          v-model="dataForm.categoryName"
          maxlength="7"
          show-word-limit
          :label="this.$i18n.t('publics.categoryCn')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        :label="this.$i18n.t('publics.categoryEn')"
        prop="categoryNameEn"
      >
        <el-input
          size="small"
          v-model="dataForm.categoryNameEn"
          :min="0"
          maxlength="50"
          show-word-limit
          :label="this.$i18n.t('publics.categoryEn')"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" :label="this.$i18n.t('hotSearch.seq')" prop="seq">
        <el-input v-model.number="dataForm.seq" size="small" maxlength="9" :label="this.$i18n.t('hotSearch.seq')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t("live.offline")}}</el-radio>
          <el-radio :label="1">{{$t("publics.normal")}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>
<script>
import { treeDataTranslate, idList } from '@/utils'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    var validateCategoryName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('publics.categoryNoNull')))
      } else {
        callback()
      }
    }
    var validateSeq = (rule, value, callback) => {
      var reg = /[^-\d]/
      var regs = /^\s+$/g
      if (value == null || value === '') {
        this.$refs.dataForm.clearValidate('seq')
        callback()
      } else if (reg.test(value)) {
        callback(new Error(this.$i18n.t('prodTag.tips')))
      } else if (regs.test(value)) {
        callback(new Error(this.$i18n.t('publics.categoryNoNull')))
      } else {
        callback()
      }
    }
    // var validateCategoryNameEn = (rule, value, callback) => {
    //   if (!value.trim()) {
    //     callback(new Error(this.$i18n.t('publics.categoryNoNull')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      dataForm: {
        categoryId: 0,
        grade: 0,
        categoryName: '',
        categoryNameEn: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: ''
      },
      dataRule: {
        categoryName: [
          { required: true, message: this.$i18n.t('publics.categoryNoNull'), trigger: 'blur' },
          {validator: validateCategoryName, trigger: 'blur'}
        ],
        // categoryNameEn: [
        //   { required: true, message: this.$i18n.t('publics.categoryNoNull'), trigger: 'blur' },
        //   {validator: validateCategoryNameEn, trigger: 'blur'}
        // ],
        pic: [
          { required: true, message: this.$i18n.t('publics.imageNoNull'), trigger: 'blur' }
        ],
        seq: [
          { validator: validateSeq }
        ]
      },
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      }
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    init (id) {
      this.dataForm.categoryId = id || 0
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.selectedCategory = []
        })
      }).then(() => {
        if (this.dataForm.categoryId) {
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/prod/category/info/${this.dataForm.categoryId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.categoryId = data.categoryId
            this.dataForm.categoryName = data.categoryName
            this.dataForm.categoryNameEn = data.categoryNameEn
            this.dataForm.seq = data.seq
            this.dataForm.pic = data.pic
            this.dataForm.parentId = data.parentId
            this.dataForm.status = data.status
            this.selectedCategory = idList(this.categoryList, data.parentId, 'categoryId', 'children').reverse()
          })
        }
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 表单提交
    dataFormSubmit () {
      if (this.selectedCategory.length === 1) {
        this.dataForm.grade = 0
      }
      if (this.selectedCategory.length === 2) {
        this.dataForm.grade = 1
      }
      if (this.selectedCategory.length === 3) {
        this.dataForm.grade = 2
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/prod/category`),
            method: this.dataForm.categoryId ? 'put' : 'post',
            data: this.$http.adornData({
              'categoryId': this.dataForm.categoryId || undefined,
              'categoryName': this.dataForm.categoryName,
              'categoryNameEn': this.dataForm.categoryNameEn,
              'status': this.dataForm.status,
              'seq': this.dataForm.seq,
              'grade': this.dataForm.grade,
              'parentId': this.dataForm.parentId,
              'pic': this.dataForm.pic
            })
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
