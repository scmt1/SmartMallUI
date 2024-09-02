<template>
<!-- 发布商品页面 -->
  <div class="post-product-page">
    <div class="prod-main-containers">
      <!-- 步骤 -->
      <div class="post-step">
        <div class="step-item" :class="{'active': postingSteps === 1 || postingSteps === 2 || postingSteps === 3}">
          <!-- 01、选择商品类目 -->
          <div class="step-txt">01、{{ $t("product.selectProductCategory") }}</div>
        </div>
        <div class="step-item" :class="{'active': postingSteps === 2 || postingSteps === 3}">
          <!-- 02、编辑商品信息 -->
          <div class="step-txt">02、{{ $t("product.editProductInfo") }}</div>
        </div>
        <div class="step-item" :class="{'active': postingSteps === 3}">
          <!-- 03、编辑商品详情 -->
          <div class="step-txt">03、{{ $t("product.editProductDetails") }}</div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="prod-content">
        <!-- 01、选择商品类目 -->
        <div v-if="postingSteps === 1" class="prod-content-item">
          <selectCategory
            v-model="dataForm"
            @selectedCategoryName="selectedCategoryName"
            @refreshDataForm="getDataList"
          />
        </div>

        <!-- 02、编辑商品信息 -->
        <div v-if="postingSteps === 2" class="prod-content-item">
          <editProduct
            ref="editProduct"
            v-model="dataForm"
            :isCompose="isCompose"
            :platCategoryName="platCategoryName"
            :storeCategoryName="storeCategoryName"
            @changeCategory="changeCategory"
            @updataProdDataForm="updataProdDataForm"
            @changeWriteOffTime="changeWriteOffTime"
          />
        </div>

        <!-- 03、编辑商品详情 -->
        <div v-if="postingSteps === 3" class="prod-content-item">
          <productDetails
            v-model="dataForm"
            @updateContent="updateContent"
          />
        </div>
      </div>
    </div>

    <!-- 底部固定操作栏 -->
    <div class="prod-footer">
      <div class="foot">
        <div class="inner">
          <div v-if="postingSteps === 1" class="default-btn primary-btn" @click="nextStep">{{ $t("product.nextStep1") }}</div>
          <div v-if="postingSteps === 2">
            <div class="default-btn" @click="prevStep">{{ $t("product.prevStep") }}</div>
            <div class="default-btn save-btn" @click="saveStep">{{ $t("product.saveBtn1") }}</div>
            <div class="default-btn primary-btn" @click="nextStep">{{ $t("product.nextStep2") }}</div>
          </div>
          <div v-if="postingSteps === 3">
            <div class="default-btn" @click="prevStep">{{ $t("product.prevStep") }}</div>
            <div class="default-btn primary-btn" @click="saveStep">{{ $t("product.saveBtn1") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { idList } from '@/utils'
import selectCategory from './posting-select-category'
import editProduct from './posting-edit-product'
import productDetails from './posting-product-details'

export default {
  components: {
    selectCategory,
    editProduct,
    productDetails
  },
  data () {
    return {
      // 发布步骤：1选择商品类目 2编辑商品信息 3编辑商品详情
      postingSteps: null,
      // 商品详情信息
      dataForm: {
        // 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品)
        prodType: 0,
        mold: 0,
        prodNameEn: '',
        prodNameCn: '',
        contentEn: '',
        contentCn: '',
        briefEn: '',
        briefCn: '',
        video: '',
        pic: '',
        imgs: '',
        isCompose: 0,
        preSellStatus: 0,
        preSellTime: null,
        categoryId: this.$route.query.categoryId ? parseInt(this.$route.query.categoryId) : null,
        shopCategoryId: null, // 店铺分类id
        prodId: 0,
        brandId: 0,
        skuList: [],
        prodLangList: [],
        brandName: '',
        deliveryMode: {
          hasShopDelivery: false,
          hasUserPickUp: true,
          hasCityDelivery: false
        },
        // 运费模板id
        deliveryAmount: 0.01, // 统一运费的金额

        deliveryTemplateId: null,
        // 库存总和
        totalStocks: 0,

        useLang: 0 // 0中文 1中英文
      },

      // 平台选定分类名称
      platCategoryName: '',
      // 店铺选定分类名称
      storeCategoryName: '',

      isCompose: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },

      // 自定义核销有效天数
      validDays: 0,

      // 根据商品id返回来的商品类型
      originalProdType: null
    }
  },

  provide () {
    return {
      noshopCategoryId: this.noshopCategoryId
    }
  },

  watch: {
    isCompose (val) {
    }
  },

  mounted () {
    this.dataForm.prodId = this.$route.query.prodId
    this.page = this.$route.query.page ? JSON.parse(this.$route.query.page) : this.page
    if (!this.dataForm.prodId) {
      this.postingSteps = 1
    }
    // 获取产品详情数据
    this.getDataList()
  },

  methods: {
    /**
     * 获取产品详情数据
     */
    getDataList () {
      if (this.dataForm.prodId) {
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/info/${this.dataForm.prodId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.dataForm.prodLangList.forEach(prodLang => {
            if (prodLang.lang === 0) {
              this.dataForm.prodNameCn = prodLang.prodName
              this.dataForm.briefCn = prodLang.brief
              this.dataForm.contentCn = prodLang.content
            }
            if (prodLang.lang === 1) {
              this.dataForm.prodNameEn = prodLang.prodName
              this.dataForm.briefEn = prodLang.brief
              this.dataForm.contentEn = prodLang.content
            }
          })
          this.dataForm.deliveryMode = JSON.parse(data.deliveryMode)
          this.dataForm.deliveryMode.hasUserPickUp = true
          // this.dataForm.deliveryMode.hasShopDelivery = true

          // 运费选项处理
          if (this.dataForm.deliveryTemplateId < 1) {
            this.dataForm.tableRate = this.dataForm.deliveryTemplateId
            this.dataForm.deliveryTemplateId = null
          } else {
            this.dataForm.tableRate = 1
          }
          // this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
          // this.$refs.skuTag.init(data.skuList)
          if (data.brand) {
            this.dataForm.brandId = data.brand.brandId
            this.dataForm.brandName = data.brand.name
          }
          this.dataForm.skuList.forEach(sku => {
            sku.changeStock = parseInt(sku.stocks)
            sku.oriStock = parseInt(sku.stocks)
            sku.skuLangList.forEach(skulang => {
              if (skulang.lang === 0) {
                sku.prodNameCn = skulang.prodName
              } else {
                sku.prodNameEn = skulang.prodName
              }
            })
          })
          if (data.mold === 1 && data.writeOffTime !== -1 && data.writeOffTime !== 0 && data.writeOffTime !== 1) {
            this.changeWriteOffTime(data.writeOffTime)
          }
          // this.$refs.skuTable.init()
          this.postingSteps = 1
          this.$forceUpdate()
        }).catch(({ e }) => {
          this.postingSteps = 1
          // 出错，返回列表
          setTimeout(() => {
            this.$router.push('/prod-prodList')
          }, 1000)
        })
      } else {
        this.$nextTick(() => {
          this.postingSteps = 1
          // this.$refs['dataForm'].resetFields()
          // this.$refs.skuTag.init()
          this.dataForm.pic = ''
          this.dataForm.imgs = ''
          this.dataForm.video = ''
          this.brandName = ''
        })
      }
    },

    /**
     * 子组件更新数据
     */
    updataProdDataForm (value) {
      const dataForm = Object.assign(this.dataForm, value)
      this.dataForm = dataForm
    },

    /**
     * 获取选定的分类名称
     */
    selectedCategoryName (categoryName, categoryType) {
      if (categoryType === 'platform') {
        this.platCategoryName = categoryName
      }
      if (categoryType === 'store') {
        this.storeCategoryName = categoryName
      }
    },

    /**
     * 修改分类
     */
    changeCategory (type) {
      if (type === 1) {
        const platProdCategory = this.$store.state.prod.platProdCategory
        this.platCategoryName = platProdCategory.firstCat.categoryName +
          ' > ' +
          platProdCategory.secondCat.categoryName +
          ' > ' +
          platProdCategory.threeCat.categoryName
        this.dataForm.categoryId = platProdCategory.threeCat.id
      } else if (type === 2) {
        const storeProdCategory = this.$store.state.prod.storeProdCategory
        this.storeCategoryName = storeProdCategory.firstCat.categoryName
        this.dataForm.shopCategoryId = storeProdCategory.firstCat.id
      }
    },

    noshopCategoryId () {
      this.dataForm.shopCategoryId = ''
    },

    /**
     * 虚拟商品-获取自定义核销有效天数
     */
    changeWriteOffTime (validDays) {
      this.validDays = validDays
    },

    /**
     * 获取详情
     */
    updateContent (value, type) {
      if (type === 'cn') {
        this.$set(this.dataForm, 'content', value)
        this.$set(this.dataForm, 'contentCn', value)
      }
      if (type === 'en') {
        this.$set(this.dataForm, 'contentEn', value)
      }
    },

    /**
     * 下一步
     */
    nextStep () {
      if (this.postingSteps === 1) {
        if (!this.dataForm.categoryId) {
          // 请选择平台分类
          this.$message({
            message: this.$i18n.t('product.selectPlatformCategoryTips'),
            type: 'error',
            duration: 1000
          })
          return
        }
        if (!this.dataForm.shopCategoryId) {
          // 请选择店铺分类
          this.$message({
            message: this.$i18n.t('product.selectShopCategoryTips'),
            type: 'error',
            duration: 1000
          })
          return
        }
      }
      if (this.postingSteps === 2) {
        if (!this.$refs.editProduct.dataFormValidation()) {
          return
        }
        if (!this.dataForm.skuList.find(el => el.status)) {
          // 至少要启用一种商品规格
          this.$message({
            message: this.$i18n.t('product.enableSpec'),
            type: 'error',
            duration: 1500
          })
          return
        }
      }
      this.postingSteps += 1
    },
    /**
     * 上一步
     */
    prevStep () {
      if (this.postingSteps === 2) {
        // 返回第一步之前先更新已填写的商品信息
        this.$refs.editProduct.upadteProdInfo()
      }
      this.postingSteps -= 1
    },
    /**
     * 保存
     */
    saveStep () {
      if (this.postingSteps === 2 && !this.$refs.editProduct.dataFormValidation()) {
        return
      }
      this.dataFormSubmit()
    },

    paramSetPriceAndStocks (param) {
      // 获取规格属性信息
      // param.skuList = this.$refs.prodSpec.getTableSpecData()
      // 商品库存
      param.totalStocks = 0
      // 商品价格
      param.price = 0
      // 商品原价
      param.oriPrice = 0
      // 商品实际库存
      for (let i = 0; i < param.skuList.length; i++) {
        const element = param.skuList[i]
        if (element.status !== 1) {
          continue
        }
        if (param.price === 0) {
          param.price = element.price ? Number.parseFloat(element.price) : 0
        }
        // 商品价格为最低价的那件商品的价格
        param.price = Math.min(param.price, element.price)
        if ((param.price === element.price) || (Number.parseFloat(param.price) === Number.parseFloat(element.price))) {
          param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
        }
        param.totalStocks += element.stocks ? Number.parseInt(element.stocks) : 0
      }
      // 如果sku没有商品名称，则使用商品的商品名称
      if (param.skuList.length === 1 && !param.skuList[0].skuName) {
        param.skuList[0].prodName = this.dataForm.prodName
        param.skuList[0].prodNameCn = this.dataForm.prodNameCn
        param.skuList[0].prodNameEn = this.dataForm.prodNameEn
      }
    },

    // 表单提交
    dataFormSubmit () {
      if (!this.dataForm.categoryId || !this.dataForm.shopCategoryId) {
        // 请选择商品分类
        this.errorMsg(this.$i18n.t('product.thisProduCategroy'))
        return
      }
      if (!this.dataForm.skuList.find(el => el.status)) {
        // 至少要启用一种商品规格
        this.$message({
          message: this.$i18n.t('product.enableSpec'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.dataForm.prodName = this.dataForm.prodNameCn
      this.dataForm.brief = this.dataForm.briefCn
      let param = Object.assign({}, this.dataForm)
      // 运费处理
      param.deliveryTemplateId = param.tableRate < 1 ? param.tableRate : param.deliveryTemplateId
      if (param.deliveryTemplateId !== -1) {
        param.deliveryAmount = null
      }
      // 设置价格和库存
      this.paramSetPriceAndStocks(param)
      if (!param.prodId && param.totalStocks === 0) {
        this.$confirm(this.$i18n.t('product.saveTip'), this.$i18n.t('resource.tips'), {
          confirmButtonText: this.$i18n.t('resource.confirm'),
          cancelButtonText: this.$i18n.t('resource.cancel'),
          type: 'warning'
        }).then(() => {
          this.confirmMethod(param)
        })
      } else {
        this.confirmMethod(param)
      }
    },
    confirmMethod (param) {
      param.content = null
      if (this.dataForm.prodLangList.length) {
        this.dataForm.prodLangList.forEach(el => {
          if (el.lang === 0) {
            el.content = param.contentCn
            el.prodName = param.prodNameCn
            el.brief = param.briefCn
          }
          if (el.lang === 1) {
            el.content = param.contentEn
            el.prodName = param.prodNameEn
            el.brief = param.briefEn
          }
        })
      }

      this.dataForm.skuList.forEach(el => {
        el.changeStock = parseInt(el.stocks) - parseInt(el.oriStock)
      })

      param.deliveryMode = undefined
      param.deliveryModeVo = this.dataForm.deliveryMode
      // 商品主图
      param.pic = this.dataForm.imgs.split(',')[0]

      // 虚拟商品
      if (this.dataForm.mold === 1) {
        // 选择"无需核销"，没有核销有效期
        if (this.dataForm.writeOffNum === 0) { param.writeOffTime = null }
        // 自定义核销有效天数
        if (this.dataForm.writeOffNum !== 0 && this.dataForm.writeOffTime === 2) {
          param.writeOffTime = parseInt(this.validDays)
        }
        param.virtualRemark = JSON.stringify(this.dataForm.virtualRemark)
      }
      if (this.dataForm.mold !== 1) {
        // 普通商品，清空虚拟商品信息
        param = {
          ...param,
          virtualRemark: null,
          writeOffNum: null,
          writeOffTime: null,
          writeOffStart: null,
          writeOffEnd: null,
          isRefund: null
        }
      }

      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl(`/prod/prod`),
        method: param.prodId ? 'put' : 'post',
        data: this.$http.adornData(param)
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.isSubmit = false
            this.$store.commit('common/removeMainActiveTab')
            if (!this.isAuth('prod:prod:manage:view')) {
              this.$router.push({
                path: '/home',
                query: { page: JSON.stringify(this.page) }
              })
              return
            }
            this.$router.push({
              path: '/prod-prodList',
              query: { page: JSON.stringify(this.page) }
            })
            this.$emit('refreshDataList')
          }
        })
      }).catch((e) => {
        this.isSubmit = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-product-page {
  color: #333;
  .prod-main-containers {
    display: block;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 50px;

    // 步骤
    .post-step {
      display: flex;
      align-content: center;
      justify-content: space-between;
      .step-item {
        position: relative;
        flex: 1;
        .step-txt {
          display: block;
          font-size: 14px;
          text-align: center;
          box-sizing: border-box;
          background: #f9f9f9;
          padding: 12px 0;
        }
      }
      .step-item.active {
        .step-txt {
          color: #fff;
          background: #155bd4;
        }
      }
      // 右箭头
      .step-item:not(:last-child) {
        .step-txt {
          margin-right: 10px;
        }
        &::after {
          position: absolute;
          top: 0;
          right: 0;
          content: '';
          width: 0;
          height: 0;
          border-top: 20px solid transparent;
          border-left: 10px solid #f9f9f9;
          border-bottom: 20px solid transparent;
        }
      }
      .step-item.active:not(:last-child) {
        &::after {
          border-left: 10px solid #155bd4;
        }
      }
      // 左箭头
      .step-item:not(:first-child) {
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          content: '';
          width: 0;
          height: 0;
          border-top: 20px solid transparent;
          border-left: 10px solid #fff;
          border-bottom: 20px solid transparent;
        }
      }
    }

    // 内容
    .prod-content {
      display: block;
      width: 100%;
      margin-top: 20px;
      // 公共
      & ::v-deep .prod-title-row {
        display: block;
        width: 100%;
        background: #f9f9f9;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        padding: 10px;
        margin-bottom: 20px;
      }
    }
  }

  // 底部固定操作栏
  .prod-footer {
    position: fixed;
    bottom: 0;
    width: 93%;
    box-shadow: 0 -3px 5px #eee;
    z-index: 3;
    margin-top: 20px;
    margin-right: 20px;
    .foot {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      background: #fff;
      box-sizing: border-box;
      .inner {
        .default-btn.save-btn {
          border-color: #155bd4;
          color: #155bd4;
        }
      }
    }
  }
}
</style>
