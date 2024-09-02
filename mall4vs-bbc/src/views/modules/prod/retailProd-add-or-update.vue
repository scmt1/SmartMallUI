<template>
  <el-dialog
    :title="
      !dataForm.retailProdId
        ? this.$i18n.t('product.addNew')
        : this.$i18n.t('groups.editEvent')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="handleDialogClose"
    :width="this.$i18n.t('language') === 'English'?'880px':'800px'"
    class="inline-form-dialog retail-prod-add-or-update"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
      size="small"
    >
      <el-row>
        <el-col :span="12">
          <!-- 单品名称 -->
          <el-form-item :label="this.$i18n.t('product.itemName')" prop="name" :class="this.$i18n.t('language') === 'English'?'errItem':''">
            <el-input
              v-model="dataForm.name"
              maxlength="60"

            ></el-input>
          </el-form-item>
          <!-- 单品库存 -->
          <el-form-item
            :label="this.$i18n.t('product.singleProdInve')"
            prop="stocks"
            type="number"
          >
            <el-input v-model="dataForm.stocks"></el-input>
          </el-form-item>
          <!-- 单品分类 -->
          <el-form-item
            :label="this.$i18n.t('product.singleProdClas')"
            prop="categoryId"
          >
            <el-select
              v-model="dataForm.categoryId"
              :placeholder="this.$i18n.t('tip.select')"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 单品成本 -->
          <el-form-item
            :label="this.$i18n.t('product.singleProd')"
            prop="costPrice"
            :class="this.$i18n.t('language') === 'English'?'errItem':''"
          >
            <el-input v-model="dataForm.costPrice" type="number">
              <template slot="append">{{ $t("admin.dollar") }}</template>
            </el-input>
          </el-form-item>
          <!-- 单品规格 -->
          <el-form-item :label="this.$i18n.t('product.singleProdSpe')" prop="spec">
            <el-input
              v-model="dataForm.spec"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <!-- 单品单位 -->
          <el-form-item :label="this.$i18n.t('product.singleProdUnit')" prop="unit">
            <el-select
              v-model="dataForm.unit"
              filterable
              allow-create
              clearable
              :placeholder="this.$i18n.t('product.pleaseSelectAUnit')"
            >
              <el-option
                v-for="item in unitOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 单品条码 -->
      <el-form-item :label="this.$i18n.t('product.singleProductBar')" prop="barCode" class="full-line-form-item">
        <el-input v-model="dataForm.barCode" maxlength="50" show-word-limit :placeholder="this.$i18n.t('product.noBarcode')">
          <template slot="append">{{ $t("product.usedToQuickItem") }}</template>
        </el-input>
      </el-form-item>
      <!-- 单品图片 -->
      <el-form-item :label="this.$i18n.t('product.singleProdPic')" prop="imgs" :class="this.$i18n.t('language') === 'English'?'errItem':''">
        <imgs-upload v-model="dataForm.imgs" :limit="5" />
        <span
          >{{ $t("admin.recommImgSize") }}800*800，{{
            $t("product.draggableSort")
          }}5{{ $t("marketing.piece") }}</span
        >
      </el-form-item>
      <!-- 供应商 -->
<!--      <el-form-item :label="this.$i18n.t('product.supplier')" prop="supplierId">-->
<!--        <div class="default-btn" v-if="!supplierName" @click="selectSupplier">{{-->
<!--          $t("product.chooseSupplier")-->
<!--        }}</div>-->
<!--        <el-tag :closable="true" v-if="supplierName" @close="handleClose()">{{-->
<!--          supplierName-->
<!--        }}</el-tag>-->
<!--      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div >
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("crud.filter.submitBtn")
      }}</div >
    </span>
    <!-- 商品选择弹窗-->
    <supplier-select
      v-if="supplierSelectVisible"
      ref="supplierSelect"
      @refreshSelectSupplier="supplierSelectHandle"
      :isSingle="true"
    ></supplier-select>
  </el-dialog>
</template>

<script>
import { unitOption } from '@//utils/unitOption'
import ImgsUpload from '@/components/imgs-upload'
import SupplierSelect from '@/components/supplier-select'
import { Debounce } from '@/utils/debounce'
export default {
  components: {
    ImgsUpload,
    SupplierSelect
  },
  created () {
    this.getCategoryList()
  },
  data () {
    var validate = (rule, value, callback) => {
      if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
        callback(new Error(this.$i18n.t('live.pleaseEnteThan0')))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error(this.$i18n.t('retailProd.tipError')))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (/^\s+$/g.test(value)) {
        callback(new Error(this.$i18n.t('product.itemNameCanEmpty')))
      } else {
        callback()
      }
    }
    // var validateImgs = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error(this.$i18n.t('product.pleaseUploadApicture')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      supplierSelectVisible: false,
      dataForm: {
        retailProdId: null,
        shopId: null,
        barCode: null,
        name: null,
        pic: null,
        imgs: null,
        spec: null,
        categoryId: null,
        unit: null,
        costPrice: 0.00,
        stocks: 0,
        status: 1,
        supplierId: null,
        version: null,
        createTime: null,
        updateTime: null,
        deleteTime: null,
        supplierName: null
      },
      dataRule: {
        name: [
          { required: true, message: this.$i18n.t('product.itemNameCanEmpty'), trigger: 'blur' },
          { validator: validateName }
        ],
        imgs: [
          { required: true, message: this.$i18n.t('product.pleaseUploadApicture'), trigger: 'blur' }
        ],
        costPrice: [
          // { required: true, message: '单品成本不能为空', trigger: 'blur' },
          { required: true, validator: validate, trigger: 'blur' }
        ],
        stocks: [
          // { required: true, message: '单品库存不能为空', trigger: 'blur' },
          { required: true, validator: validateNumber, trigger: 'blur' }
        ]
      },
      unitOption: unitOption,
      categoryList: [],
      supplierName: null
    }
  },
  methods: {
    init (retailProdId) {
      this.dataForm.retailProdId = retailProdId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.retailProdId) {
          this.$http({
            url: this.$http.adornUrl('/shop/retailProd/info/' + this.dataForm.retailProdId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.supplierName = this.dataForm.supplierName
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.imgs) {
            this.dataForm.pic = this.dataForm.imgs.split(',')[0]
          } else {
            this.$message.error(this.$i18n.t('publics.imageNoNull'))
            return false
          }
          this.$http({
            url: this.$http.adornUrl('/shop/retailProd'),
            method: this.dataForm.retailProdId ? 'put' : 'post',
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
    }, 1000),
    // 获取分类信息
    getCategoryList () {
      return this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          status: ''
        })
      }).then(({ data }) => {
        this.categoryList = data
        // this.testCategoryList()
      })
    },
    // 去除已下线的商品分类
    testCategoryList () {
      let categoryListTest = this.categoryList
      for (let i = 0; i < categoryListTest.length; i++) {
        if (categoryListTest[i].status === 0) {
          categoryListTest.splice(i, 1)
        }
      }
      this.categoryList = categoryListTest
    },
    // 选择供应商
    selectSupplier () {
      let suppliers = []
      suppliers.push({ supplierId: this.dataForm.supplierId })
      this.supplierSelectVisible = true
      this.$nextTick(() => {
        this.$refs.supplierSelect.init(suppliers)
      })
    },
    supplierSelectHandle (data) {
      if (data) {
        this.dataForm.supplierId = data[0].supplierId
        this.dataForm.supplierName = data[0].supplierName
        this.supplierName = this.dataForm.supplierName
      }
    },
    /**
    * 品牌删除按钮
    */
    handleClose () {
      // this.dataForm.supplierId = null
      this.supplierName = ''
      this.dataForm.supplierName = this.supplierName
      this.dataForm.supplierId = null
    },

    /**
     * 关闭回调
     */
    handleDialogClose () {
      this.dataForm.supplierName = ''
      this.supplierName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-form-dialog {
  .el-input.el-input--small {
    width: 287px;
  }
  .el-select.el-select--small {
    width: 287px;
  }
  .full-line-form-item {
    .el-input.el-input--small {
      width: calc(100% - 12px)
    }
  }

}
</style>
<style scoped>
  .errItem >>> .el-form-item__error {
    top: 59%
  }
</style>
