<template>
  <el-dialog
    :title="
      !dataForm.categoryId
        ? this.$i18n.t('brand.add')
        : this.$i18n.t('brand.revise')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    width="550px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto"
      size="small"
    >
      <!-- :inline="true" -->
      <el-form-item
        v-if="dataForm.type !== 2 && isSecondLevel === false"
        :label="this.$i18n.t('category.categoryPicture')"
        prop="pic"
      >
        <img-upload v-model="dataForm.pic"></img-upload>
        <span v-if="dataForm.parentId === 0"
          >{{ $t("category.recPicSize") }}532*160</span
        >
        <span v-if="dataForm.parentId !== 0"
          >{{ $t("category.recPicSize") }}120*120</span
        >
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        :label="this.$i18n.t('publics.categoryCn')"
        prop="categoryName"
      >
        <el-input
          size="small"
          v-model.trim="dataForm.categoryName"
          controls-position="right"
          :min="0"
          :label="this.$i18n.t('publics.categoryCn')"
          maxlength="7"
          show-word-limit
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
          controls-position="right"
          :min="0"
          maxlength="50"
          show-word-limit
          :label="this.$i18n.t('publics.categoryEn')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('category.categoryParent')">
        <el-cascader
          size="small"
          expand-trigger="hover"
          :key="cascaderKey"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          v-model="selectedCategory"
          @change="handleChange"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        :label="this.$i18n.t('hotSearch.seq')"
        prop="seq"
      >
        <el-input-number
          class="input-num"
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
          :max="100000000"
          :label="this.$i18n.t('hotSearch.seq')"
        ></el-input-number>
      </el-form-item>
      <el-form-item v-if="this.selectedCategory.length === 2" :label="this.$i18n.t('category.deductionRate')" prop="deductionRate">
        <el-input-number
          class="input-num"
          v-model.number="dataForm.deductionRate"
          type="number"
          controls-position="right"
          :precision="4"
          :step="0.1"
          :min="0"
          :max="99.9999"
          placeholder="0~99.9999"
        />
        %
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('product.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t("brand.offline") }}</el-radio>
          <el-radio :label="1">{{ $t("brand.normal") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("remindPop.confirm")
      }}</div>
    </div>
  </el-dialog>
</template>
<script>
import { treeDataTranslate, idList } from '@/utils'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    return {
      visible: false,
      isSecondLevel: false,
      dataForm: {
        categoryId: 0,
        grade: 0,
        categoryName: '',
        categoryNameEn: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: '',
        deductionRate: ''
      },
      cascaderKey: 'cascaderKey',
      isSubmit: false,
      dataRule: {
        categoryName: [
          {
            required: true,
            message: this.$i18n.t('publics.categoryNoNull'),
            trigger: 'blur'
          }
        ],
        pic: [
          {
            required: true,
            message: this.$i18n.t('category.categoryPicNull'),
            trigger: 'blur'
          }
        ]
      },
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName',
        checkStrictly: true
      }
    }
  },
  watch: {
    dataForm: {
      handler () {
        if (this.dataForm.type !== 2 && this.isSecondLevel) {
          this.dataForm.pic = ''
        }
      },
      deep: true // true 深度监听
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    init (id) {
      this.isSecondLevel = false
      this.dataForm.parentId = 0
      this.dataForm.categoryId = id || 0
      this.isSubmit = false
      this.dataForm.categoryName = ''
      this.dataForm.categoryNameEn = ''
      this.selectedCategory = []
      this.$http({
        url: this.$http.adornUrl(
          '/prod/category/upAndCurrCategoryList/' + this.dataForm.categoryId
        ),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 1,
          status: 1
        })
      })
        .then(({ data }) => {
          this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.selectedCategory = []
          })
        })
        .then(() => {
          if (this.dataForm.categoryId) {
            // 修改
            this.$http({
              url: this.$http.adornUrl(
                `/prod/category/info/${this.dataForm.categoryId}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              console.log('修改分类data：', data)
              this.isSecondLevel = data.grade === 1
              this.dataForm.categoryId = data.categoryId
              this.dataForm.categoryName = data.categoryName
              this.dataForm.categoryNameEn = data.categoryNameEn
              this.dataForm.seq = data.seq
              this.dataForm.pic = data.pic
              this.dataForm.parentId = data.parentId
              this.dataForm.status = data.status
              this.dataForm.deductionRate = data.deductionRate
              this.selectedCategory = idList(
                this.categoryList,
                data.parentId,
                'categoryId',
                'children'
              ).reverse()
            })
          }
        })
      console.log('categoryNameEn:', JSON.parse(JSON.stringify(this.dataForm.categoryNameEn)))
    },
    handleChange (val) {
      this.isSecondLevel = val.length === 1
      this.dataForm.parentId = val[val.length - 1]
      if (!this.dataForm.parentId && this.dataForm.parentId !== 0) {
        this.dataForm.parentId = 0
      }
      this.cascaderKey = Math.random() * 10000000000000
    },
    // 表单提交
    dataFormSubmit () {
      console.log(this.selectedCategory.length)
      if (this.selectedCategory.length === 0) {
        this.dataForm.grade = 0
      }
      if (this.selectedCategory.length === 1) {
        this.dataForm.grade = 1
      }
      if (this.selectedCategory.length === 2) {
        this.dataForm.grade = 2
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/prod/category`),
            method: this.dataForm.categoryId ? 'put' : 'post',
            data: this.$http.adornData({
              categoryId: this.dataForm.categoryId || undefined,
              categoryName: this.dataForm.categoryName,
              categoryNameEn: this.dataForm.categoryNameEn,
              status: this.dataForm.status,
              seq: this.dataForm.seq,
              grade: this.dataForm.grade,
              parentId: this.dataForm.parentId,
              deductionRate: this.dataForm.deductionRate,
              pic: this.dataForm.pic
            })
          })
            .then(({ data }) => {
              this.$message({
                message: this.$i18n.t('remindPop.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  setTimeout(() => {
                    this.dataForm.pic = ''
                  }, 500)
                }
              })
            })
            .catch((e) => {
              this.isSubmit = false
            })
        }
      })
    },
    close () {
      this.dataForm = {
        categoryId: 0,
        grade: 0,
        categoryName: '',
        categoryNameEn: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: '',
        deductionRate: ''
      }
    }
  }
}
</script>
<style lang="scss">
.input-num .el-input__inner{
  padding-right: 40px !important;
}
</style>