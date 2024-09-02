<template>
  <div class="mod-prod-info">
    <!-- 步骤 -->
    <div class="post-step">
      <div class="step-item" :class="{'active': postingSteps === 1 || postingSteps === 2}">
        <!-- 01、选择商品类目 -->
        <div class="step-txt">01、{{ $t("product.selectProductCategory") }}</div>
      </div>
      <div class="step-item" :class="{'active': postingSteps === 2}">
        <!-- 02、编辑商品信息 -->
        <div class="step-txt">02、{{ $t("product.editProductInfo") }}</div>
      </div>

    </div>
    <!-- <div class="title">新增积分商品</div> -->
    <el-form ref="dataForm" :model="dataForm" label-width="100px" size="small">
      <!-- 选择语言 -->
      <el-form-item
        v-show="postingSteps === 1"
        :label="this.$i18n.t('product.selectLanguage')"
      >
        <el-select
          v-model="curLang"
          multiple
          :placeholder="this.$i18n.t('product.tip1')"
          class="select-lang"
          @change="selectLang"
        >
          <el-option
            v-for="item in langOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="el-form-item-tips">{{ $t("product.postProductTips2") }}</div>
      </el-form-item>

      <div v-show="postingSteps === 1" class="prod-name-box">
        <el-form-item
          :label="this.$i18n.t('product.prodName')"
          prop="prodNameCn"
          class="prod-name-con is-required"
        >
          <el-input class="prod-name-input" v-model="prodNameCn" maxlength="60" />
          <!-- <div class="el-form-item-tips">{{ $t("product.postProductTips3") }}</div> -->
          <div class="el-form-item-tips">商品名称建议：商品描述+属性，长度不超过60个字符</div>
        </el-form-item>
        <el-form-item
          v-if="curLang.includes(2)"
          label-width="0"
          prop="prodNameEn"
          class="prod-name-con"
        >
          <el-input class="prod-name-input" v-model="prodNameEn" maxlength="60" />
          <div class="el-form-item-tips">The suggestion: description + attribute, length cannot exceed 60</div>
        </el-form-item>
      </div>
      <!-- 商品卖点 -->
      <div v-show="postingSteps === 1" class="prod-name-box">
        <el-form-item
          :label="this.$i18n.t('product.productSellingPoints')"
          prop="briefCn"
          class="prod-name-con"
        >
          <el-input class="prod-name-input" v-model="briefCn" maxlength="100" />
          <!-- <div class="el-form-item-tips">{{ $t("product.postProductTips4") }}</div> -->
          <div class="el-form-item-tips">商品卖点展示在商品详情标题下面，长度不超过100个字符</div>
        </el-form-item>
        <el-form-item
          v-if="curLang.includes(2)"
          label-width="0"
          prop="briefEn"
          class="prod-name-con"
        >
          <el-input class="prod-name-input" v-model="briefEn" maxlength="100" />
          <div class="el-form-item-tips">Displayed under the title, the length cannot exceed 100</div>
        </el-form-item>
      </div>

      <el-form-item v-show="postingSteps === 1" :label="this.$i18n.t('product.video')">
        <video-upload v-model="dataForm.video" />
      </el-form-item>
      <el-form-item v-show="postingSteps === 1" :label="this.$i18n.t('discount.commodityPictures')"
      class="productImg-label"
      >
        <!-- <mul-pic-upload v-model="dataForm.imgs" /> -->
        <imgs-upload v-model="dataForm.imgs" />
        <span>{{$t("platform.recommImgSize")}}800*800，{{$t("product.picUploadTips")}}</span>
      </el-form-item>
      <sku-tag v-show="postingSteps === 1" ref="skuTag" @change="skuTagChangeSkuHandler" :skuList="dataForm.skuList"></sku-tag>
      <sku-table
        v-show="postingSteps === 1"
        ref="skuTable"
        v-model="dataForm.skuList"
        :prodNameCn.sync="prodNameCn"
        :prodNameEn.sync="prodNameEn"
      ></sku-table>

      <prod-transport
        v-show="postingSteps === 1"
        v-model="dataForm.deliveryTemplateId"
        :dataForm="dataForm"
      ></prod-transport>
      <el-tabs v-show="postingSteps === 2" type="card">
        <el-tab-pane :label="this.$i18n.t('product.chineseInf')">
          <el-form-item :label="this.$i18n.t('homes.productDetails')" prop="contentCn">
            <tiny-mce v-model="contentCn" ref="content" style="width:95%"></tiny-mce>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="English Information">
          <el-form-item label="Product Details" prop="contentEn">
            <tiny-mce v-model="contentEn" ref="content" style="width:95%"></tiny-mce>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 底部固定操作栏 -->
    <div class="prod-footer">
      <div class="foot">
        <div class="inner">
          <div v-if="postingSteps === 1">
            <div class="default-btn save-btn" @click="dataFormSubmit">{{ $t("product.saveBtn1") }}</div>
            <div class="default-btn primary-btn" @click="nextStep">{{ $t("product.nextStep2") }}</div>
          </div>
          <div v-if="postingSteps === 2">
            <div @click="prevStep" class="default-btn save-btn">{{ $t("product.prevStep") }}</div>
            <div class="default-btn primary-btn" @click="dataFormSubmit">{{ $t("product.saveBtn1") }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 品牌选择弹窗-->
    <brand-select
      v-if="brandSelectVisible"
      ref="brandSelect"
      :isSingle="true"
      @refreshSelectBrand="selectBrand"
    ></brand-select>
  </div>
</template>

<script>
// import MulPicUpload from '@/components/mul-pic-upload'
import VideoUpload from '@/components/video-upload'
import SkuTag from './sku-tag'
import SkuTable from './sku-table'
import TinyMce from '@/components/tiny-mce'
import ImgUpload from '@/components/img-upload'
import ImgsUpload from '@/components/imgs-upload'
import BrandSelect from '@/components/brand-select'
import ProdTransport from './prod-transport'
// import { isHtmlNull } from '@/utils/index.js'
// import { treeDataTranslate, idList } from '@/utils'

export default {
  data () {
    return {
      // 语言选项
      langOptions: [{
        value: 1,
        label: '简体中文'
      }, {
        value: 2,
        label: 'English'
      }],
      curLang: [1],

      // 平台分类树展示与回显
      // category: {
      //   list: [],
      //   selected: [],
      //   props: {
      //     value: 'categoryId',
      //     label: 'categoryName'
      //   }
      // },
      // 本店分类
      // categoryList: [],
      postingSteps: 1,
      brandSelectVisible: false,
      prodNameEn: '',
      prodNameCn: '',
      contentEn: '',
      contentCn: '',
      briefEn: '',
      briefCn: '',
      sameCityStatus: 0,
      // 规格列表
      dataForm: {
        tableRate: -1, // 0 包邮 -1 固定运费 大于0运费模板id
        prodName: '',
        brief: '',
        pic: '',
        imgs: '',
        video: '',
        categoryId: this.$route.query.categoryId ? parseInt(this.$route.query.categoryId) : null,
        shopCategoryId: null, // 店铺分类id
        prodId: 0,
        brandId: 0,
        prodScore: 0,
        scorePrice: 0,
        skuList: [],
        scoreProdType: 0,
        prodNameEn: '',
        prodNameCn: '',
        contentEn: '',
        contentCn: '',
        briefEn: '',
        briefCn: '',
        content: '',
        brandName: '',
        deliveryMode: {},
        isCheck: false,
        value: false,
        deliveryAmount: 0.01, // 统一运费的金额
        deliveryTemplateId: null,
        prodLangList: []
      },
      deliveryMode: {
        hasShopDelivery: true,
        hasUserPickUp: true,
        hasCityDelivery: false
      },
      brandName: '',
      isSubmit: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  watch: {
    'dataForm.imgs': {
      deep: true, // 深度监听设置为 true
      immediate: true,
      handler (newV, oldV) {
        if (newV.split(',').length > 9) {
          this.dataForm.imgs = oldV
          this.errorMsg(this.$i18n.t('product.downloadTemplateTips3'))
        }
      }
    }
  },
  components: {
    // MulPicUpload,
    BrandSelect,
    ImgUpload,
    ImgsUpload,
    VideoUpload,
    TinyMce,
    SkuTag,
    SkuTable,
    ProdTransport
  },
  computed: {
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  mounted () {
    // console.log(2222222)
    this.dataForm.prodId = this.$route.query.prodId
    // this.getCategoryList()
    // this.getCategoryTree()
    this.getDataList()
  },
  methods: {
    // 上一步
    prevStep () {
      this.postingSteps = 1
    },
    // 下一步
    nextStep () {
      this.$refs['dataForm'].validate((valid) => {
        if (!this.prodNameCn) {
          this.errorMsg(this.$i18n.t('product.pleComProdName'))
          return
        }
        // 运费处理
        this.dataForm.deliveryTemplateId = this.dataForm.tableRate < 1 ? this.dataForm.tableRate : this.dataForm.deliveryTemplateId
        // 运费处理
        if (this.dataForm.deliveryTemplateId !== -1) {
          this.dataForm.deliveryAmount = null
        }
        console.log(this.dataForm.deliveryAmount)
        if (!this.dataForm.imgs) {
          this.errorMsg(this.$i18n.t('product.choosePicUpload'))
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
        // 检验是否有选择品牌
        // if (!this.dataForm.brandName) {
        //   this.errorMsg('请选择一个所属品牌')
        //   return
        // }
        // 校验sku列表
        this.checkSkuList()
        if (this.isCheck) {
          this.errorMsg(this.value)
          return
        }

        if (!this.prodNameEn) {
          this.prodNameEn = this.prodNameCn
        }
        if (/^\s+$/g.test(this.prodNameEn)) {
          this.prodNameEn = this.prodNameCn
        }
        if (/^\s+$/g.test(this.briefEn) || /^\s+$/g.test(this.briefCn)) {
          this.errorMsg(this.$i18n.t('shopProcess.inputAllSpace'))
          return
        }
        if (this.dataForm.deliveryTemplateId === null) {
          this.errorMsg(this.$i18n.t('product.pleShgTlate'))
          return
        }
        this.postingSteps = 2
      })
    },
        /**
     * 选择语言(中文信息必填)
     */
    selectLang (value) {
      if (!value.length) {
        this.curLang = [1]
        return
      }
      this.curLang = JSON.parse(JSON.stringify(value))
      if (this.curLang.find(el => el === 2)) {
        this.enInfoVisible = true
      } else {
        this.dataForm.prodLangList.forEach((el, index) => {
          if (el.lang === 1) {
            el.prodNameEn = ''
            el.briefEn = ''
            this.$set(this.dataForm, 'briefEn', '')
            this.$set(this.dataForm, 'prodNameEn', '')
          }
        })
        this.enInfoVisible = false
      }
      if (!this.curLang.find(el => el === 1)) {
        this.curLang.unshift(1)
      }
    },
    // 获取分类数据
    getDataList () {
      this.isSubmit = false
      if (this.dataForm.prodId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/platform/scoreProduct/info/${this.dataForm.prodId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.dataForm.prodLangList.forEach(prodLang => {
            if (prodLang.lang === 0) {
              this.prodNameCn = prodLang.prodName
              this.briefCn = prodLang.brief
              this.contentCn = prodLang.content
            }
            if (prodLang.lang === 1) {
              prodLang.prodName && (this.curLang = [1, 2])
              this.prodNameEn = prodLang.prodName
              this.briefEn = prodLang.brief
              this.contentEn = prodLang.content
            }
          })

          // 运费选项处理
          if (this.dataForm.deliveryTemplateId < 1) {
            // this.dataForm.tableRate = this.dataForm.deliveryTemplateId
            this.$set(this.dataForm, 'tableRate', this.dataForm.deliveryTemplateId)
            this.dataForm.deliveryTemplateId = null
          } else {
            // this.dataForm.tableRate = 1
            this.$set(this.dataForm, 'tableRate', 1)
          }
          this.dataForm.deliveryMode = JSON.parse(data.deliveryMode)
          this.dataForm.deliveryMode.hasShopDelivery = true
          // this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
          if (data.brand) {
            this.dataForm.brandId = data.brand.brandId
            this.dataForm.brandName = data.brand.brandName
            this.brandName = data.brandName
          }
          this.$refs.skuTag.init(data.skuList)
          this.dataForm.skuList.forEach(sku => {
            sku.oriStock = sku.stocks
            sku.skuLangList.forEach(skulang => {
              if (skulang.lang === 0) {
                sku.prodNameCn = skulang.prodName
              } else {
                sku.prodNameEn = skulang.prodName
              }
            })
          })
          this.$refs.skuTable.init()
          this.dataForm.skuList.forEach(item => {
            item.changeStock = item.stocks
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.skuTag.init()
          this.dataForm.pic = ''
          this.dataForm.imgs = ''
          this.dataForm.video = ''
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (!this.prodNameCn) {
          this.errorMsg(this.$i18n.t('product.pleComProdName'))
          return
        }
        // 运费处理
        this.dataForm.deliveryTemplateId = this.dataForm.tableRate < 1 ? this.dataForm.tableRate : this.dataForm.deliveryTemplateId
        // 运费处理
        if (this.dataForm.deliveryTemplateId !== -1) {
          this.dataForm.deliveryAmount = null
        }
        console.log(this.dataForm.deliveryAmount)
        if (!this.dataForm.imgs) {
          this.errorMsg(this.$i18n.t('product.choosePicUpload'))
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
        // 检验是否有选择品牌
        // if (!this.dataForm.brandName) {
        //   this.errorMsg('请选择一个所属品牌')
        //   return
        // }
        // 校验sku列表
        this.checkSkuList()
        if (this.isCheck) {
          this.errorMsg(this.value)
          return
        }

        if (!this.prodNameEn) {
          this.prodNameEn = this.prodNameCn
        }
        if (/^\s+$/g.test(this.prodNameEn)) {
          this.prodNameEn = this.prodNameCn
        }
        if (/^\s+$/g.test(this.briefEn) || /^\s+$/g.test(this.briefCn)) {
          this.errorMsg(this.$i18n.t('shopProcess.inputAllSpace'))
          return
        }
        if (this.dataForm.deliveryTemplateId === null) {
          this.errorMsg(this.$i18n.t('product.pleShgTlate'))
          return
        }
        this.dataForm.prodNameCn = this.prodNameCn
        this.dataForm.briefCn = this.briefCn
        this.dataForm.contentCn = this.contentCn
        this.dataForm.prodNameEn = this.prodNameEn
        this.dataForm.briefEn = this.briefEn
        this.dataForm.contentEn = this.contentEn
        this.dataForm.prodName = this.dataForm.prodNameCn
        let param = Object.assign({}, this.dataForm)
        // 设置价格和库存
        this.paramSetPriceAndStocks(param)
        param.deliveryMode = undefined
        param.deliveryModeVo = this.deliveryMode
        this.dataForm.skuList.forEach(item => {
          item.changeStock = item.stocks - item.oriStock
        })
        // 商品主图
        param.pic = this.dataForm.imgs.split(',')[0]
        // console.log('this.dataForm', this.dataForm.skuList)
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl(`/platform/scoreProduct`),
          method: param.prodId ? 'put' : 'post',
          data: this.$http.adornData(param)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$store.commit('common/removeMainActiveTab')
              this.$router.push({ name: 'prod-scoreProdList' })
              this.$emit('refreshDataList')
            }
          })
        }).catch((e) => {
          this.isSubmit = false
        })
      })
    },
    /**
     * 品牌删除按钮
     */
    handleClose () {
      this.dataForm.brandId = null
      this.brandName = ''
      this.dataForm.brandName = this.brandName
    },
    /**
     * 显示添加指定品牌弹框
     */
    brandSelectHandle () {
      this.brandSelectVisible = true
      this.$nextTick(() => {
        this.$refs.brandSelect.init()
      })
    },
    /**
     * 添加指定品牌
     */
    selectBrand (brands) {
      if (brands) {
        this.brandName = brands[0].brandName
        this.dataForm.brandId = brands[0].brandId
        this.dataForm.brandName = this.brandName
        // this.$set(this.dataForm, 'brandId', this.dataForm.brandId)
        // this.$set(this.dataForm, 'brandName', this.dataForm.brandName)
      }
    },
    /**
     * 删除视频
     */
    deleteVideo () {
      this.dataForm.video = null
    },

    checkSkuList () {
      // console.log('skuList', this.dataForm.skuList)
      this.dataForm.skuList.forEach(item => {
        this.isCheck = false
        // if (!item.pic) {
        //   this.isCheck = true
        //   this.value = '请上传sku图片'
        //   return false
        // }
        if (!item.price && item.price !== 0) {
          this.isCheck = true
          this.value = this.$i18n.t('product.emptyPrice')
          return false
        }
        if (!item.oriPrice && item.oriPrice !== 0) {
          this.isCheck = true
          this.value = this.$i18n.t('product.emptyMarketValue')
          return false
        }
        if (!item.skuScore) {
          this.isCheck = true
          this.value = this.$i18n.t('product.emptyScorePrice')
          return false
        }
        if (item.stocks === null || item.stocks === undefined) {
          this.isCheck = true
          this.value = this.$i18n.t('product.emptyStocks')
          return false
        }
      })
    },
    paramSetPriceAndStocks (param) {
      // 获取规格属性信息
      // param.skuList = this.$refs.prodSpec.getTableSpecData()
      // 商品库存
      param.totalStocks = 0
      // 商品价格
      param.price = param.skuList[0].price
      // 商品原价
      param.oriPrice = ''
      // 商品积分价格
      param.scorePrice = param.skuList[0].skuScore
      // 商品实际库存
      for (let i = 0; i < param.skuList.length; i++) {
        const element = param.skuList[i]
        console.log('element.status', element.status)
        if (element.status !== 1) {
          console.log('end', param.totalStocks, element.stocks)
          continue
        }
        if (i === 0) {
          param.price = element.price ? Number.parseFloat(element.price) : 0
          param.scorePrice = element.skuScore ? Number.parseFloat(element.skuScore) : 0
          param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
        }
        // 商品价格为最低价的那件商品的价格
        param.price = Math.min(param.price, element.price)
        if (param.price === element.price) {
          param.price = element.price
        }
        // 设置最低市场价
        param.oriPrice = param.oriPrice !== '' ? Math.min(param.oriPrice, element.oriPrice) : element.oriPrice
        if (param.oriPrice === element.oriPrice) {
          param.oriPrice = element.oriPrice
        }
        // 设置最低积分价格
        param.scorePrice = Math.min(param.scorePrice, element.skuScore)
        if (param.scorePrice === element.skuScore) {
          param.scorePrice = element.skuScore
        }

        console.log(element.skuScore)
        console.log(param.scorePrice)
        param.totalStocks += element.stocks ? Number.parseInt(element.stocks) : 0
      }
      // 如果sku没有商品名称，则使用商品的商品名称
      if (param.skuList.length === 1 && !param.skuList[0].skuName) {
        param.skuList[0].prodNameCn = this.dataForm.prodNameCn
        param.skuList[0].prodNameEn = this.dataForm.prodNameEn
      }
    },
    skuTagChangeSkuHandler (skuList) {
      const prodNameCn = this.prodNameCn
      const prodNameEn = this.prodNameEn
      skuList.forEach(sku => {
        if (sku.properties) {
          sku.skuName = ''
          let properties = sku.properties.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          sku.prodNameCn = prodNameCn + ' ' + sku.skuName
          sku.prodNameEn = prodNameEn + ' ' + sku.skuName
        }
      })
      this.dataForm.skuList = skuList
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style>
 .el-upload--picture-card{
    background: #ffffff;
  }
  .productImg-label .el-form-item__label:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
  .productImg-label .el-upload--picture-card i {
    position: absolute;
    top: 39%;
    left: 37%;
  }
  /* .stress {
          color: #FF2120;
          padding-right: 5px;
        } */

.mod-prod-info .el-textarea__inner:focus{
  border-color:#c0c4cc !important;
}
</style>
<style lang="scss" scoped>
.mod-prod-info{
  // 步骤
  .post-step {
    margin-bottom: 30px;
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
  // 底部固定操作栏
  .prod-footer {
    width: calc(100% - 250px);
    left: 250px;
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
  // 选择语言
  .select-lang {
    display: block;
    width: 400px;
  }

  // 商品名称
  .prod-name-box {
    & >>> .el-input__inner {
      width: 400px;
      padding: 0 8px!important;
    }
    .prod-name-con {
      display: inline-block;
      margin-right: 15px;
    }
    .prod-name-input{
      width: 400px;
    }
  }
}



</style>
