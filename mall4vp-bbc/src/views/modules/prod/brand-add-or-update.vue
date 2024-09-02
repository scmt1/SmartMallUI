<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.brandId ? this.$i18n.t('brand.add') : this.$i18n.t('brand.revise')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialogHandle"
      width="570px"
    >
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="115px" size="small">
        <!-- 中文品牌名称 -->
        <el-form-item :label="$t('brandPopups.nameZh')" prop="nameZh">
          <el-input v-model="dataForm.nameZh" :placeholder="$t('brandPopups.inputBrandName')" maxlength="30" show-word-limit />
        </el-form-item>
        <!-- 英文品牌名称 -->
        <el-form-item :label="$t('brandPopups.nameEn')" prop="nameEn" label-position="right">
          <el-input v-model="dataForm.nameEn" :placeholder="$t('brandPopups.inputBrandName')" maxlength="30" show-word-limit />
        </el-form-item>
        <!-- 品牌首字母 -->
        <el-form-item :label="this.$i18n.t('brandPopups.brandInitials')" prop="firstLetter">
          <el-input
            type="text"
            :placeholder="this.$i18n.t('brandPopups.inputBrandInitials')"
            v-model="dataForm.firstLetter"
            maxlength="1"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 品牌logo -->
        <el-form-item :label="this.$i18n.t('brandPopups.brandLogo')" prop="imgUrl">
          <img-upload v-model="dataForm.imgUrl"></img-upload>
        </el-form-item>
        <!-- 序号 -->
        <el-form-item :label="this.$i18n.t('brand.sequence')" prop="seq">
          <el-input v-model="dataForm.seq" type="number" :max="32767" @blur="handleSortValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{ $t("remindPop.cancel") }}</div>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("remindPop.confirm")}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImgUpload from '@/components/img-upload'
import { Debounce } from '@/utils/debounce'
import { validNoEmptySpace } from '@/utils/validate'
export default {
  data () {
    const validateFirstLetter = (rule, value, callback) => {
      const regexp = /^[A-Z]{1}$/
      if (!regexp.test(value)) {
        callback(new Error('请输入一位大写字母'))
      } else {
        callback()
      }
    }
    const validateNotEmpty = (role, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        brandId: 0,
        nameZh: '',
        nameEn: '',
        imgUrl: '',
        brief: '',
        seq: 0,
        status: 1,
        firstLetter: ''
      },
      brandSelectVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      selectedCategories: [],
      categorySelectorVisible: false, // 分类弹窗显隐
      dataRule: {
        nameZh: [
          { required: true, message: this.$i18n.t('brandPopups.emptyBrandName'), trigger: 'blur' },
          { validator: validateNotEmpty, trigger: 'blur' }
        ],
        nameEn: [
          { validator: validateNotEmpty, trigger: 'blur' }
        ],
        firstLetter: [
          { required: true, message: this.$i18n.t('brandPopups.emptyBrandInitials'), trigger: 'blur' },
          { validator: validateFirstLetter, trigger: 'blur' }
        ],
        seq: [
          { required: true, message: this.$i18n.t('brandPopups.emptysequence'), trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: this.$i18n.t('brandPopups.selectLogo'), trigger: 'blur' }
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
      this.selectedCategories = []
      this.visible = true
      this.dataForm.brandId = id || 0
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.brandId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/platform/brand/info/${this.dataForm.brandId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.categoryShow(data.categories) // 分类回显
          // 国际化处理
          data.brandLangList.forEach(item => {
            if (item.lang === 0) {
              this.$set(this.dataForm, 'nameZh', item.name)
            } else {
              this.$set(this.dataForm, 'nameEn', item.name)
            }
          })
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
     * 分类回显
     */
    categoryShow (categories) {
      if (categories !== null && categories.length) {
        var categoryObj = {}
        var categoryIds = []
        categories.forEach((el, index) => {
          categoryIds.push(el.categoryId)
          categoryObj.firstCategoryName = el.categories[0].categoryName
          categoryObj.secondCategoryName = el.categories[1].categoryName
          categoryObj.threeCategoryName = el.categoryName
          this.selectedCategories.push(categoryObj)
          categoryObj = {}
        })
        this.dataForm.categoryIds = categoryIds
      }
    },
    // /**
    //  * 选择分类弹窗
    //  */
    // selectOrReviseCategory () {
    //   this.categorySelectorVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.categorySelector.init() // 1代表从创建分类进入
    //   })
    // },

    // /**
    //  * 获取子组件返回数据
    //  */
    // getCategorySelected (selectedCategories, categoryId) {
    //   this.categorySelectorVisible = false
    //   var categoryObj = {}
    //   categoryObj.firstCategoryName = selectedCategories[0].categoryName
    //   categoryObj.secondCategoryName = selectedCategories[1].categoryName
    //   categoryObj.threeCategoryName = selectedCategories[2].categoryName
    //   // 去重
    //   if (this.selectedCategories.length) {
    //     this.dataForm.categoryIds.forEach((item, index) => {
    //       if (item === categoryId) {
    //         this.selectedCategories.splice(index, 1)
    //         this.dataForm.categoryIds.splice(index, 1)
    //       }
    //     })
    //   }
    //   if (!this.dataForm.categoryIds) {
    //     this.dataForm.categoryIds = []
    //   }
    //   console.log('categoryId', categoryId)
    //   this.dataForm.categoryIds.push(categoryId)
    //   this.selectedCategories.push(categoryObj)
    // },
    // // 删除选中的某一项分类
    // deleteCategoryItemOfSelected (index) {
    //   this.selectedCategories.splice(index, 1)
    //   this.dataForm.categoryIds.splice(index, 1)
    // },

    // 处理排序输入框
    handleSortValue () {
      if (this.dataForm.seq > 32767) {
        this.$set(this.dataForm, 'seq', 32767)
        return
      }
      if (this.dataForm.seq <= 0 || !this.dataForm.seq) {
        this.$set(this.dataForm, 'seq', 0)
      }
    },

    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          const brandLangList = []
          brandLangList.push({ lang: 0, name: this.dataForm.nameZh })
          brandLangList.push({ lang: 1, name: (this.dataForm.nameEn && this.dataForm.nameEn !== '') ? this.dataForm.nameEn : this.dataForm.nameZh })
          param.brandLangList = brandLangList
          this.$http({
            url: this.$http.adornUrl(`/platform/brand`),
            method: param.brandId ? 'put' : 'post',
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
          })
        }
      })
    }, 1500),
    // 关闭对话框回调
    closeDialogHandle () {
      this.$refs['dataForm'].resetFields()
      this.dataForm.relation = null
    }
  }
}
</script>
<style lang="scss">
  .el-input__inner {
    line-height: 1px !important;
  }
</style>
