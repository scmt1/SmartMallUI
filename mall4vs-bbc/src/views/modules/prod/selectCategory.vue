<template>
  <div class="mod-prod-info">
    <el-form :model="dataForm" ref="dataForm" label-width="100px" :rules="dataRule">
<!-- 基本信息  -->
  <div class="tittle">
     {{this.$i18n.t('product.basicInformation')}}
  </div>
  <div class="basic-info">
      <!-- 商品分类 -->
        <el-form-item
            :label="this.$i18n.t('product.productCategories')"
            :label-width="this.$i18n.t('language') === 'English'?'140px':'100px'"
            :required="true"
          >
            <el-col :span="8">
              <div class="ca-box">
                <div class="ca-int-box">
                  <div class="int-box">
                    <a href="javascript:void(0)" class="a-click-box" @click="productCategory"></a>
                    <el-input :placeholder="this.$i18n.t('product.thisProduCategroy')"
                      v-model="categoryName"
                    ></el-input>
                  </div>
                  <!--新建/刷新-->
                  <!-- <div class="default-btn text-btn refresh-btn"
                            @click="refreshCategoriesChange">{{$t('admin.refresh')}}</div> -->
                </div>
                <div class='productCategories-error'></div>
              </div>
            </el-col>
        </el-form-item>
      <!-- 商品名称  -->
      <!-- <i class="el-icon-warning" style="font-size:18px"></i>{{this.$i18n.t('product.pleaseSelectTheProduct')}}！ -->
        <!-- <el-form-item
          :label="this.$i18n.t('product.prodName')"
          :label-width="this.$i18n.t('language') === 'English'?'140px':'100px'"
          prop="prodNameCn"
        >
          <el-col :span="8">
            <el-input
              v-model="dataForm.prodName"
              :placeholder="this.$i18n.t('product.prodName')"
              maxlength="50"
              style="width:110%"
            ></el-input>
          </el-col>
        </el-form-item> -->

      <!-- 产品卖点  -->
        <!-- <el-form-item
          :label="this.$i18n.t('product.prodellingPoint')"
          :label-width="this.$i18n.t('language') === 'English'?'140px':'100px'"
          prop="briefCn"
        >
          <el-col :span="8">
            <el-input
              v-model="briefCn"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              :placeholder="this.$i18n.t('product.prodellingPoint')"
              style="width:110%"
            ></el-input>
          </el-col>
        </el-form-item> -->

      <!-- 商品主图  -->
        <el-form-item :label="this.$i18n.t('temp.productMainImage')"
        :label-width="this.$i18n.t('language') === 'English'?'146px':'100px'"
          :rules="[
            { required: true, message: this.$i18n.t('product.thisProductImg') },
          ]"
        >
          <imgs-upload v-model="dataForm.imgs" :limit="9" />
          <span
           style="color:#999"
            >{{ $t("admin.recommImgSize") }}800*800，{{
              $t("product.draggableSort")
            }}9{{ $t("marketing.piece") }}</span
          >
        </el-form-item>

      <!-- 商品视频 -->
        <el-form-item :label="this.$i18n.t('product.productVideo')" class="video-k"
        :label-width="this.$i18n.t('language') === 'English'?'140px':'100px'"
        >
          <video-upload v-model="dataForm.video" />
        </el-form-item>

      <!-- 平台分类 -->
        <!-- <el-form-item
          :label="this.$i18n.t('product.platforation')"
          prop="categoryId"
        >
          <el-col :span="8">
            <el-cascader
              expand-trigger="hover"
              :options="category.list"
              :props="category.props"
              v-model="category.selected"
              change-on-select
              @change="handleCategoryChange"
            ></el-cascader>
          </el-col>
        </el-form-item> -->

      <!-- 本店分类 -->
        <el-form-item
          :label="this.$i18n.t('product.shopCategory')"
          :label-width="this.$i18n.t('language') === 'English'?'140px':'100px'"
          prop="shopCategoryId"
          :rules="[
            { required: true, message: this.$i18n.t('product.thisShopeEmpty') },
          ]"
        >
          <el-col :span="8">
            <el-select
              v-model="dataForm.shopCategoryId"
              :placeholder="this.$i18n.t('product.thisShopCategroy')"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
<!--            新建/刷新-->
            <div class="default-btn text-btn"
                       @click="refreshChange">{{$t('admin.refresh')}}</div>
            <el-divider direction="vertical"></el-divider>
            <div class="default-btn text-btn"
                       @click.stop="addOrUpdateHandle()">{{$t('admin.newConstruction')}}</div>
          </el-col>
        </el-form-item>
        <!-- 弹窗, 新建 -->
        <add-or-update v-if="addOrUpdateVisible"
                       ref="addOrUpdate"
                       @refreshDataList="getCategoryList"></add-or-update>
       <!--      品牌-->
       <el-form-item :label="this.$i18n.t('product.brand')" prop="brandId">
         <el-tooltip effect="light" :disabled="dataForm.categoryId" :content="this.$i18n.t('product.pleaseSelectCategoryAgainSelectBrand')" placement="top">
           <div style="width: 100px">
             <el-button
               plain
               @click="brandSelectHandle()"
               style="float: left"
               v-if="!brandName"
               :disabled="!dataForm.categoryId"
             >{{ $t("product.chooseABrand") }}</el-button
             >
             <el-tag v-else :closable="true"  @close="handleClose()">{{ dataForm.brandName }}</el-tag>
           </div>
         </el-tooltip>
       </el-form-item>
        <el-form-item :label="this.$i18n.t('product.whetPreSale')" :label-width="this.$i18n.t('language') === 'English'?'184px':'100px'">
          <el-radio-group v-model="dataForm.preSellStatus">
            <el-radio :label="0">{{ $t("station.close") }}</el-radio>
            <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 预售发货时间 -->
        <el-form-item
          v-if="dataForm.preSellStatus === 1"
          :label="this.$i18n.t('product.preSaleTime')"
          :label-width="this.$i18n.t('language') === 'English'?'181px':'106px'"
          prop="preSellTime"
        >
          <el-date-picker
            v-model="dataForm.preSellTime"
            type="datetime"
            :placeholder="this.$i18n.t('product.choosengDate')"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
  </div>

<!-- 规格库存 -->
  <div class="tittle">
     {{this.$i18n.t('product.specificationStock')}}
  </div>
  <div class="basic-info">

      <sku-tag
        ref="skuTag"
        @change="skuTagChangeSkuHandler"
        :skuList="dataForm.skuList"
      ></sku-tag>

      <sku-table
        ref="skuTable"
        v-model="dataForm.skuList"
        :prodNameCn.sync="prodNameCn"
        :prodNameEn.sync="prodNameEn"
        :isCompose="dataForm.isCompose"
      ></sku-table>
  </div>

<!-- 物流信息  -->
  <div class="tittle">
     {{this.$i18n.t('order.logisticsInformation')}}
  </div>
  <div class="basic-info">
      <!-- 配送方式 -->
      <el-form-item :label="this.$i18n.t('order.delType')">
        <el-checkbox v-model="dataForm.deliveryMode.hasShopDelivery" disabled>{{
          $t("product.ExpressDistribution")
        }}</el-checkbox>
        <el-checkbox v-model="dataForm.deliveryMode.hasUserPickUp" class="delType-text">{{
          $t("product.userMention")
        }}</el-checkbox>
        <el-checkbox
          v-model="dataForm.deliveryMode.hasCityDelivery"
          :disabled="sameCityStatus === 0"
          class="delType-text"
          >{{ $t("order.sameCityDelivery") }}</el-checkbox
        >
      </el-form-item>
      <!-- 运费设置 -->
      <prod-transport
        v-show="dataForm.deliveryMode.hasShopDelivery"
        v-model="dataForm.deliveryTemplateId"
      ></prod-transport>
  </div>

      <!-- <el-form-item :label="this.$i18n.t('product.')产品详情" prop="content">
        <tiny-mce v-model="dataForm.content" ref="content" style="width:1000px"></tiny-mce>
      </el-form-item>-->

      <!-- <el-tabs type="card">
        <el-tab-pane :label="this.$i18n.t('product.chinenInput')">
          <el-form-item
            :label="this.$i18n.t('homes.productDetails')"
            prop="contentCn"
          >
            <tiny-mce
              v-model="contentCn"
              ref="content"
              style="width: 1000px"
            ></tiny-mce>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="English Information">
          <el-form-item label="Prod name" prop="prodNameEn">
            <el-col :span="8">
              <el-input
                v-model="prodNameEn"
                placeholder="Prod name"
                maxlength="50"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="Selling point" prop="briefEn">
            <el-col :span="8">
              <el-input
                v-model="briefEn"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="Selling point"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="details" prop="contentEn">
            <tiny-mce
              v-model="contentEn"
              ref="content"
              style="width: 1000px"
            ></tiny-mce>
          </el-form-item>
        </el-tab-pane>
      </el-tabs> -->

 <!-- 商品详细信息 -->
    <div class="tittle">
       {{this.$i18n.t('homes.productDetails')}}
    </div>
    <div class="basic-info basic-iny-mce">
      <!-- <el-form-item
        prop="contentCn"
      >
        <tiny-mce
          v-model="contentCn"
          ref="content"
          style="width: 1000px"
          :key="tinymceFlag"
        ></tiny-mce>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dataFormSubmit()">{{
          $t("crud.filter.submitBtn")
        }}</el-button>
      </el-form-item> -->

      <!-- :rules="[{ required: true, message: this.$i18n.t('live.productNameEmpty')}]" -->
      <el-tabs type="card">
        <el-tab-pane :label="this.$i18n.t('product.chinenInput')">
          <el-form-item
            :label="this.$i18n.t('product.prodName')"
            prop="prodNameCn"
            class="product-prodName"
          >
            <!-- :rules="[{ required: true, message: '产品名称不能为空'}]" -->
            <el-col :span="8">
              <el-input
                v-model="prodNameCn"
                :placeholder="this.$i18n.t('product.prodName')"
                maxlength="50"
              ></el-input>
            </el-col>
          </el-form-item>

          <el-form-item
            :label="this.$i18n.t('product.prodellingPoint')"
            prop="briefCn"
          >
            <el-col :span="8">
              <el-input
                v-model="briefCn"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :placeholder="this.$i18n.t('product.prodellingPoint')"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item
            :label="this.$i18n.t('homes.productDetails')"
            prop="contentCn"
          >
            <tiny-mce
              v-model="contentCn"
              ref="content"
              style="width: 1000px"
              v-if="tinymceShow"
            ></tiny-mce>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="English Information">
          <el-form-item label="Product name" prop="prodNameEn">
            <!-- :rules="[{ required: true, message: 'Product English name cannot be empty'}]" -->
            <el-col :span="8">
              <el-input
                v-model="prodNameEn"
                placeholder="Product name"
                maxlength="50"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="Selling point" prop="briefEn">
            <el-col :span="8">
              <el-input
                v-model="briefEn"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="Selling point"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="Details" prop="contentEn">
            <tiny-mce
              v-model="contentEn"
              ref="content"
              style="width: 1000px"
              v-if="tinymceShow"
            ></tiny-mce>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

    </div>

    <el-form-item class="submit-product">
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("crud.filter.submitBtn")
      }}</div>
    </el-form-item>


    </el-form>
    <!-- 品牌选择弹窗-->
    <brand-select
      v-if="brandSelectVisible"
      ref="brandSelect"
      :isSingle="true"
      :categoryId="dataForm.categoryId"
      @refreshSelectBrand="selectBrand"
    ></brand-select>

    <!-- 商品分类弹窗 -->
    <product-category
    v-if="productCategoryVisible"
    @closee="closeAndAcquire(arguments)"
    ></product-category>

  </div>
</template>

<script>
// import MulPicUpload from '@/components/mul-pic-upload'
import ProductCategory from '@/components/product-category/index.vue'
import ImgsUpload from '@/components/imgs-upload'
import VideoUpload from '@/components/video-upload'
import ProdTransport from './prod-transport'
import SkuTag from './sku-tag'
import SkuTable from './sku-table'
import TinyMce from '@/components/tiny-mce'
import BrandSelect from '@/components/brand-select'
import { treeDataTranslate, idList } from '@/utils'
import AddOrUpdate from './category-add-or-update'

export default {
  data () {
    var validateTime = (rule, value, callback) => {
      if (rule.field === 'preSellTime' && new Date() > Date.parse(value)) {
        callback(new Error(this.$i18n.t('groups.deliveryTime')))
      } else {
        callback()
      }
    }
    return {
      // 平台分类树展示与回显
      category: {
        list: [],
        selected: [],
        props: {
          value: 'categoryId',
          label: 'categoryName',
          checkStrictly: false
        }
      },
      addOrUpdateVisible: false,
      dataRule: {
        preSellTime: [{ required: true, message: this.$i18n.t('product.thePreSaleDtBeEmpty'), trigger: 'blur' },
          { required: true, validator: validateTime, trigger: 'blur' }
        ]},
      // 本店分类
      categoryList: [],
      tinymceShow: true,
      categoryName: '',
      brandSelectVisible: false,
      productCategoryVisible: false,
      prodNameEn: '',
      prodNameCn: '',
      contentEn: '',
      contentCn: '',
      briefEn: '',
      briefCn: '',
      sameCityStatus: 0,
      // 规格列表
      dataForm: {
        prodNameEn: '',
        prodNameCn: '',
        contentEn: '',
        contentCn: '',
        briefEn: '',
        briefCn: '',
        video: '',
        pic: '',
        imgs: '',
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
          hasShopDelivery: true,
          hasUserPickUp: false,
          hasCityDelivery: false
        },
        deliveryTemplateId: null,
        isCompose: this.$route.query.isCompose != null ? parseInt(this.$route.query.isCompose) : null
      },
      brandName: '',
      isSubmit: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  created () {
    // this.productCategoryVisible = true
    // window.location.reload()
    // this.$nextTick(() => {
    //   this.tinymceFlag=1,
    //   this.tinymceFlagg=1
    // });
  },
  components: {
    ProductCategory,
    ImgsUpload,
    BrandSelect,
    VideoUpload,
    ProdTransport,
    TinyMce,
    SkuTag,
    SkuTable,
    AddOrUpdate
  },
  computed: {
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },

  activated () {
    this.tinymceShow = true
    this.getCategoryList()
    this.getCategoryTree()
    this.getSameCityDetail()
    this.getDataList()
  },
  deactivated () {
    this.tinymceShow = false
    this.$store.commit('prod/addProdCategory', {})
    this.categoryName = ''
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    refreshChange () {
      this.getCategoryList()
    },
    refreshCategoriesChange () {
      this.getCategoryTree()
    },
    /**
     * 获取店铺同城配送的配置
     */
    getSameCityDetail () {
      this.$http({
        url: this.$http.adornUrl(`/delivery/sameCity/getSameCityInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.sameCityStatus = data.status
        }
      })
    },
    testCategory () {
      var categoryTest = this.categoryList
      // for ()
      for (var i = 0; i < categoryTest.length; i++) {
        if (categoryTest[i].status === 0) {
          categoryTest.splice(i, 1)
        }
      }
      this.categoryList = categoryTest
    },
    // 获取分类数据
    getDataList () {
      if (this.dataForm.prodId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/info/${this.dataForm.prodId}`),
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
              this.prodNameEn = prodLang.prodName
              this.briefEn = prodLang.brief
              this.contentEn = prodLang.content
            }
          })
          this.dataForm.deliveryMode = JSON.parse(data.deliveryMode)
          this.dataForm.deliveryMode.hasShopDelivery = true
          this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
          this.$refs.skuTag.init(data.skuList)
          this.brandName = ''
          if (data.brand) {
            this.dataForm.brandId = data.brand.brandId
            this.dataForm.brandName = data.brand.name
            this.brandName = data.brand.name
          }
          this.dataForm.skuList.forEach(sku => {
            sku.skuLangList.forEach(skulang => {
              if (skulang.lang === 0) {
                sku.prodNameCn = skulang.prodName
              } else {
                sku.prodNameEn = skulang.prodName
              }
            })
          })
          this.$refs.skuTable.init()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.skuTag.init()
          this.dataForm.pic = ''
          this.dataForm.imgs = ''
          this.dataForm.video = ''
          this.brandName = ''
        })
      }
    },
    // 获取本店分类信息
    getCategoryList () {
      return this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          status: 1
        })
      }).then(({ data }) => {
        this.categoryList = data
        // this.testCategory()
      })
    },
    // 获取平台分类信息
    getCategoryTree () {
      return this.$http({
        url: this.$http.adornUrl('/prod/category/platformCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2
        })
      }).then(({ data }) => {
        this.category.list = treeDataTranslate(data, 'categoryId', 'parentId')
        this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
      })
    },
    // 选择平台分类改变事件
    handleCategoryChange (val) {
      this.dataForm.categoryId = val[val.length - 1]
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          document.body.scrollTop = document.documentElement.scrollTop = 0
          return
        }
        if (!this.categoryName) {
          this.errorMsg(this.$i18n.t('product.thisProduCategroy'))
          return
        }
        if (!this.dataForm.imgs) {
          this.errorMsg(this.$i18n.t('product.plePictureToUpload'))
          return
        }
        if (!this.dataForm.deliveryMode) {
          this.errorMsg(this.$i18n.t('product.pleeliveryMethod'))
          return
        }
        if (this.dataForm.deliveryMode.hasShopDelivery && !this.dataForm.deliveryTemplateId) {
          this.errorMsg(this.$i18n.t('product.pleShgTlate'))
          return
        }
        if (!this.prodNameCn) {
          this.errorMsg(this.$i18n.t('product.zhpleComAndEnName'))
          return
        }
        if (!this.prodNameEn) {
          this.prodNameEn = this.prodNameCn
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
        param.deliveryModeVo = this.dataForm.deliveryMode
        // 商品主图
        param.pic = this.dataForm.imgs.split(',')[0]
        if (this.isSubmit) {
          return false
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
              this.$store.commit('common/removeMainActiveTab')
              this.$router.push('/prod-prodList')
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
      this.dataForm.brandId = 0
      this.brandName = ''
      this.dataForm.brandName = this.brandName
    },
    /**
     * 显示添加指定品牌弹框
     */
    brandSelectHandle () {
      // this.brandSelectVisible = true
     // this.$nextTick(() => {
       // this.$refs.brandSelect.init()
      // })
      let brands = []
      brands.push({ brandId: this.dataForm.brandId })
      // console.log(brands)
      this.brandSelectVisible = true
      this.$nextTick(() => {
        this.$refs.brandSelect.init(brands)
      })
    },
    /**
     * 显示商品分类弹框
     */
    productCategory () {
      this.productCategoryVisible = true
    },
    /**
     * 添加指定品牌
     */
    selectBrand (brands) {
      if (brands) {
        this.brandName = brands[0].brandName
        this.dataForm.brandId = brands[0].brandId
        this.dataForm.brandName = this.brandName
      }
    },
    /**
     * 添加商品分类
     */
    closeAndAcquire (flag) {
      this.productCategoryVisible = flag[0]
      this.dataForm.categoryId = flag[1]
      this.dataForm.isCompose = flag[2]
      this.categoryName = flag[3] ? flag[3] + '>' + flag[4] + '>' + flag[5] : ''
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
        if (param.price === element.price) {
          param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
        }
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
          sku.skuNameEn = ''
          let properties = sku.properties.split(';')
          let propertiesEn = sku.propertiesEn.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          for (const propertiesKey in propertiesEn) {
            sku.skuNameEn += propertiesEn[propertiesKey].split(':')[1] + ' '
          }
          sku.prodNameCn = prodNameCn + ' ' + sku.skuName
          sku.prodNameEn = prodNameEn + ' ' + sku.skuNameEn
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
<style scoped>
/* 每项内容的标题 */
.tittle{
  margin: 5px 0 28px 0px;
  padding-left: 15px;
  background-color: #f6f6f6;
  line-height: 40px;
  font-weight: 800;
}
/* 每项内容盒子的设置 */
.basic-info{
  margin-left: 35px;
}

/* 平台分类 */
.ca-box .int-box {
  position: relative;
}
.ca-box .a-click-box {
  position: absolute;
  display: block;
  width: 185px;
  height: 40px;
  z-index:2;
}
.ca-box .ca-int-box {
  display: flex;
  align-items: center;
}
.ca-box .refresh-btn {
  display: inline-block;
  margin-left: 5px;
}
/* 商品分类警告的下方红字 */
.ca-box .productCategories-error{
  margin-bottom: 10px;
  color: red;
  width: 600px;
}
/* 平台分类 end */

/* 图片和视频上传样式修改 */
div >>> .mul-pic-upload div{
  color: #999;
}
div >>> .el-upload-list--picture-card .el-upload-list__item{
  border:0
}
div >>> .el-upload--picture-card{
  width: 100px;
  height: 100px;
  border: 1px dashed #999;
  background-color: #ffffff;
}
.video-k >>> .el-form-item__content{
  line-height: 1em;
}
/* .video-k >>> .el-form-item__content span{
    margin-top: 20px;
    display: inline-block;
} */
.video-k >>> .pic-uploader-component .el-upload{
  border: 1px dashed #999;
  background-color: #ffffff;
}
div >>> .el-upload--picture-card .el-icon-plus{
    position: relative;
    top: -19px;
}
div >>> .el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px
}
.delType-text{
  color:#999
}
.basic-iny-mce >>> .el-form-item__content{
  margin-left: 100px !important;
}
.submit-product{
  margin-top: 20px;
  text-align: center;
  /* margin-bottom: -10px; */
  /* box-shadow: 0px -8px 18px -10px #999; */
}

.submit-product button{
  margin-top: 10px;
}

.product-prodName .is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
</style>
