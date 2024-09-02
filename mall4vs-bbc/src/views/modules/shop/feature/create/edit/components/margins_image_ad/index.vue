<template>
  <div class="micro-margins-image-ad-box">
    <!--预览区-->
    <div class="design-preview-controller">
      <div v-if="formData.imageList.length"
           class="ad-view-box"
           :class="'ad-view-'+formData.indicator">
        <div v-if="formData.indicator ===1">
          <div v-for="(item,index) in formData.imageList" :style="{display: 'block', height: formData.imgHeight + 'px'}">
            <el-image
                :key="index"
                 style="display: flex; align-items: center;justify-content: center; width: 100%; height: 100%;padding: 0 15px;"
                :src="item.url">
                <div slot="error" class="image-slot">
                    <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
                </div>
            </el-image>
            <!-- <img
                :key="index"
                style="display: block; width: 100%; height: 100%;"
                :src="item.url"
                alt=""> -->
          </div>
        </div>

        <!-- <div v-for="(item,index) in formData.imageList"
             v-else
             :key="index"
             class="image-ad-view"
             :style="{backgroundImage: `url(${item.url})`, height: formData.imgHeight + 'px'}" /> -->
          <el-image
            v-for="(item,index) in formData.imageList"
            v-if="formData.indicator ===2 || formData.indicator ===3"
            :style="{height: formData.imgHeight + 'px'}"
            :key="index"
            fit="fill"
            style="display: flex;justify-content: center;align-items: center;padding: 0 15px;"
            class="image-ad-view"
            :src="item.url">
            <div slot="error" class="image-slot">
                <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
            </div>
          </el-image>
        <el-image
                v-for="(item,index) in formData.imageList"
                v-if="formData.indicator ===4"
                :style="{height: formData.imgHeight + 'px'}"
                :key="index"
                fit="fill"
                style="display: flex;justify-content: center;align-items: center;"
                class="image-ad-view"
                :src="item.url">
          <div slot="error" class="image-slot">
            <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
          </div>
        </el-image>
        <el-image
                v-for="(item,index) in formData.imageList"
                v-if="formData.indicator ===5"
                :style="{height: formData.imgHeight + 'px'}"
                :key="index"
                fit="fill"
                style="display: flex;justify-content: center;align-items: center;"
                class="image-ad-view"
                :src="item.url">
          <div slot="error" class="image-slot">
            <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
          </div>
        </el-image>
          <div v-if="formData.indicator === 2 && formData.swiperOption.indicatorDots"
              class="ad-po" >
            <span :style="{background:formData.swiperOption.indicatorActiveColor}" />
            <span :style="{background:formData.swiperOption.indicatorColor}" />
            <span :style="{background:formData.swiperOption.indicatorColor}" />
          </div>
      </div>
      <div v-else
           class="image-ad-view">
        <div class="image-ad-title">
          {{$t('shopFeature.imageAd.widthSuggest')}}
        </div>
      </div>
    </div>
    <!--编辑区-->
    <div v-show="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.imageAd.imageAd')}}</div>
        <div class="design-editor-component-container">
          <div class="image-ad-edit">
            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                {{$t('shopFeature.imageAd.selModel')}}
              </div>
              <div class="ad-edit-item-content">
                <div v-for="(item,index) in typeList"
                    :key="index"
                    :class="['item-box-type',{active:index + 1 === formData.indicator}]"
                    @click="changeIndicator(index)">
                  <img v-if="index + 1 === formData.indicator" :src="item.picActive">
                  <img v-else :src="item.pic">
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </div>
            <el-form ref="formData"
                    class="ad-form"
                    label-width="100px"
                    v-if="formData.indicator === 2">
              <el-form-item label="是否自动轮播">
                <el-switch v-model="formData.swiperOption.autoPlay"
                           active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item :label="$i18n.t('shopFeature.imageAd.isShowDots')">
                <el-switch v-model="formData.swiperOption.indicatorDots"
                          active-color="#13ce66"
                          inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item :label="$i18n.t('shopFeature.imageAd.dotsColor')"
                            v-if="formData.swiperOption.indicatorDots">
                <el-color-picker v-model="formData.swiperOption.indicatorColor"
                                show-alpha />
              </el-form-item>
              <el-form-item :label="$i18n.t('shopFeature.imageAd.actDotColor')"
                            v-if="formData.swiperOption.indicatorDots">
                <el-color-picker v-model="formData.swiperOption.indicatorActiveColor"
                                show-alpha />
              </el-form-item>
            </el-form>

            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                <span class="img-tips">{{$t('shopFeature.imageAd.imgSizeTip')}}</span>
              </div>
              <div class="ad-edit-item-title ad-edit-img-height">
                {{$t('shopFeature.imageAd.imgHeight')}}
                <el-slider v-model="formData.imgHeight" style="width: 80%" @input="changeBoxHeight(true)" @change="changeBoxHeight(false)" :show-tooltip="showTooltip" show-input input-size="mini" :min="30" :max="2000"></el-slider>
              </div>
              <div class="ad-edit-item-title">
                {{$t('shopFeature.imageAd.addPic')}}
                <span class="tips">{{$t('shopFeature.imageAd.max10Ads')}}</span>
              </div>
              <draggable :list="formData.imageList"
                          ghost-class="ghost"
                          handle=".ad-handle">
                <div v-for="(item,index) in formData.imageList"
                      :key="index"
                      class="ad-image-list-item">
                  <div class="ad-image-list-img ad-handle"
                        :style="{backgroundImage:`url(${item.url})`}">
                    <p class="re-choose-img"
                        @click="changeImg(index)">{{$t('shopFeature.tabNav.changePic')}}</p>
                  </div>
                  <div class="ad-image-list-content">
                    <div class="ad-image-item">
                      <div class="ad-image-title">
                        {{$t('shopFeature.imageAd.picTit')}}
                      </div>
                      <el-input
                        v-model="item.imgTit"
                        size="mini"
                        :placeholder="$i18n.t('shopFeature.imageAd.picTit')" />
                        <redirect-nav
                          style="width: 200px"
                          :selectedLink="item.path && item.path.name"
                          :placeholder="$t('pcdecorate.placeholder.link')"
                          @handleNavSelect="handleNavSelect(item, index)"
                          @handleRemoveSelected="handleRemoveSelected(item, index)">
                        </redirect-nav>
                      <!-- <div class="ad-image-link">
                        <div class="ad-image-link-info">
                          <el-dropdown trigger="click"
                                        size="small"
                                        @command="command"
                                        class="ad-image-link-dropdown">
                            <div class="cursor color">
                              <span v-if="item.type"
                                    class="type-name">{{ item.type | typeNameFilter(that) }}
                                  <i class="el-icon-close" @click.stop="resetLink(index)"></i>
                              </span>
                              <span v-else
                                    class="type-name">{{$t('shopFeature.tabNav.choose')}}
                              </span>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item v-for="(linkItem,linkIndex) in linkList"
                                                :key="linkIndex"
                                                :command="({linkItem,index,currentEditIndex:index})">
                                <span style="font-size: 12px;">{{ linkItem.title }}</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                        <div class="title" v-if="item.title && (item.type===1 || item.type===4)" @click="handleChangeLinkOrProd(index,item.type)">
                          {{item.title}}
                        </div>
                      </div> -->
                    </div>
                    <i class="el-icon-error close-icon"
                        @click="formData.imageList.splice(index, 1)" />
                  </div>
                </div>
              </draggable>
              <!--选择图片框-->
              <div v-if="10 - formData.imageList.length !== 0"
                  class="ad-add-image p-add-btn"
                  @click="elxImgboxHandle">
                  <i class="el-icon-plus" /> {{$t('shopFeature.imageAd.addBgImg')}}
                <!-- <p style="color: #b7b7b7;">{{$t('shopFeature.imageAd.widthSuggest')}}</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox ref="elxImgbox"
                @refreshPic="refreshPic"
                :maxSize="10"
                :imgSizeLimit="false"></elx-imgbox>
    <!-- 商品选择弹窗  -->
    <prods-select v-if="dialogChooseGoods"
                  ref="ProdsSelect"
                  :isSingle="true"
                  @refreshSelectProds="chooseGoodsFun"></prods-select>
    <!--选择微页面-->
    <el-dialog custom-class="up-dialog"
               :close-on-click-modal="false"
               top="5vh"
               :title="$i18n.t('shopFeature.tabNav.microPage')"
               :visible.sync="dialogChoosePages"
               width="42%">
      <div class="choose-goods-compent">
        <choose-feature :isGetChooseData="isGetChooseFeature"
                        @chooseChooseFeaturesFun="chooseChooseFeaturesFun"></choose-feature>
        <div slot="footer"
             style="text-align: right;margin-top: 20px;">
          <el-button size="mini"
                     type="primary"
                     @click="isGetChooseFeature=!isGetChooseFeature">{{$t('shopFeature.tabNav.confirm')}}</el-button>
          <el-button size="mini"
                     @click="dialogChoosePages = false">{{$t('shopFeature.tabNav.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹窗: 输入自定义路径 -->
    <el-dialog custom-class="up-dialog" :title="$i18n.t('shopFeature.tabNav.customPath')" width="40%" top="30vh" :visible.sync="showPathInputDialog">
      <div class="custom-path-con">
        <span>{{$t('shopFeature.tabNav.routeLink')}}</span>
        <el-input style="margin-rigth: 10px;" :placeholder="$i18n.t('shopFeature.tabNav.pleaseFillThePath')" size="small" v-model="customPath">

        </el-input>
      </div>
      <div slot="footer" style="text-align: right;">
          <el-button size="mini"
                     type="primary"
                     @click="customPathComfirm">{{$t('shopFeature.tabNav.confirm')}}</el-button>
          <el-button size="mini"
                     @click="customPathCancel">{{$t('shopFeature.tabNav.cancel')}}</el-button>
        </div>
    </el-dialog>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :deviceType="'mobile'"
      :currentSelectType="[1, 2, 3, 4, 5, 6, 7]"
      @handleClose="handleDialogClose"
      @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import '../../directive/index'
import {microCreateMinis} from '../../minis'
import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort'
import draggable from 'vuedraggable'
import ProdsSelect from '@/components/prods-select'
import ElxImgbox from '@/components/elx-imgbox'
import ChooseFeature from '@/components/choose-feature/index.vue'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index.vue';
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
/** 图片广告 */
export default {
  name: 'micro-image-ad-box',
  mixins: [microCreateMinis],
  directives: {handle: HandleDirective},
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      mySelfCheckRules: 'mySelfCheckFun', // 我自己的验证规则函数  比如弹窗之类的
      hotScale: 392 / 500,
      typeList: [
        {
          title: this.$i18n.t('shopFeature.goods.oneLineItem1'),
          pic: require('@/assets/img/micro-page/one-line-one.png'),
          picActive: require('@/assets/img/micro-page/one-line-one-active.png')
        },
        {
          title: this.$i18n.t('shopFeature.imageAd.carouselPoster'),
          pic: require('@/assets/img/micro-page/carousel-swiper.png'),
          picActive: require('@/assets/img/micro-page/carousel-swiper-active.png')
        },
        {
          title: this.$i18n.t('shopFeature.imageAd.lateralSliding'),
          pic: require('@/assets/img/micro-page/lateral-sliding.png'),
          picActive: require('@/assets/img/micro-page/lateral-sliding-active.png')
        },
        {
          title: this.$i18n.t('shopFeature.goods.oneLineItem4'),
          pic: require('@/assets/img/micro-page/one-line-one.png'),
          picActive: require('@/assets/img/micro-page/one-line-one-active.png')
        },
        {
          title: this.$i18n.t('shopFeature.goods.oneLineItem2'),
          pic: require('@/assets/img/micro-page/one-line-one.png'),
          picActive: require('@/assets/img/micro-page/one-line-one-active.png')
        }
      ],
      dialogHot: false, // 是否显示热区
      dialogChooseGoods: false, // 选择商品
      isGetChooseData: false, // 开始返会商品
      cacheImage: false, // 是否是正在编辑热区的
      /** 选择图片的弹窗 */
      elxImgboxVisible: false, // 显示选择图片
      isGetChooseImages: false, // 返回图片
      canChooseImagesNum: 1, // 可以添加的图片数量
      isChangeImg: false, // 是否为更换图片模式
      currentEditIndex: 0, // 当前编辑的图片
      currentHotEditIndex: 0, // 当前编辑的热区
      formData: {
        indicator: 1, // 选择模板: 1一行一个; 2轮播海报; 3横向滑动; 4一行4个; 5一行2个; 6热区
        imgHeight: 160, // 图片高度
        imageList: [], // 图片列表
        swiperOption: {  // 轮播海报设置
          autoPlay: false, // 是否自动轮播
          indicatorDots: false, // 是否显示指示点
          indicatorColor: 'rgba(0, 0, 0, .3)', // 默认指示点颜色
          indicatorActiveColor: '#e43130' // 激活的指示点颜色
        }
      },
      cacheImageActiveBox: [], // 缓存当前box list
      boxItem: {// 盒子模板
        link: '',
        type: '',
        title: '',
        left: 0,
        top: 0,
        translateX: 0,
        translateY: 0,
        width: 102,
        height: 102
      },
      linkList: [
        {
          type: 1,
          title: this.$i18n.t('shopFeature.imageAd.prodDetPage'),
          link: ''
        },
        {
          type: 2,
          title: this.$i18n.t('shopFeature.tabNav.cart'),
          link: ''
        },
        {
          type: 3,
          title: this.$i18n.t('shopFeature.tabNav.personalCenter'),
          link: ''
        },
        {
          type: 4,
          title: this.$i18n.t('shopFeature.tabNav.customPath'),
          link: ''
        }
        // {
        //   type: 5,
        //   title: this.$i18n.t('shopFeature.headerAd.microPage'),
        //   link: ''
        // }
      ],
      commandInfo: {}, // 选择跳转的信息
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataForm: {
        featureGoodLists: []
      },
      that: this,
      // 微页面选择
      dialogChoosePages: false,
      isGetChooseFeature: false, // 是否可以返回微页面
      customPath: '', // 自定义路径
      showPathInputDialog: false, // 自定义路径输入弹窗
      errorMessage: '', // 报错信息
      editLinkType: 0, // 当前改项目的跳转类型
      adPic: require('../../../../../../../../assets/img/micro-page/ad-1.png'),
      dialogVisible: false, // 商品弹窗
      currentImgIndex: 0, // 当前操作广告
      showTooltip: true
    }
  },
  watch: {},
  components: {
    draggable,
    SlickList,
    SlickItem,
    ProdsSelect,
    ElxImgbox,
    ChooseFeature,
    redirectNav,
    decorateDialogSelect
  },
  props: {
    current: {
      type: Number
    }
  },
  filters: {
    typeNameFilter (val, that) {
      let str = ''
      switch (val) {
        case 1:
          str = that.$i18n.t('shopFeature.imageAd.prodDetPage')
          break
        case 2:
          str = that.$i18n.t('shopFeature.tabNav.cart')
          break
        case 3:
          str = that.$i18n.t('shopFeature.tabNav.personalCenter')
          break
        case 4:
          str = that.$i18n.t('shopFeature.tabNav.customPath')
          break
        case 5:
          str = that.$i18n.t('shopFeature.tabNav.microPage')
          break
      }
      return str
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    /**
     * 选择图片
     * @param {String} type
     * type 1 单选; 2 多选
     */
    elxImgboxHandle (type) {
      if (this.disabled) {
        return false
      }
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(type || 2, 10 - this.formData.imageList.length)
      })
    },
    /**
     * 选择图片回调
     * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
     */
    refreshPic (imagePath) {
      let imgsList = imagePath.split(',')
      for (let i = 0; i < imgsList.length; i++) {
        imgsList[i] = this.resourcesUrl + imgsList[i]
      }
      if (imgsList.length) {
        if (this.isChangeImg) { // 更换图片模式
          this.formData.imageList[this.currentEditIndex].url = imgsList[0]
          this.formData.imageList[this.currentEditIndex].title = ''
          return
        }
        imgsList.map(res => {
          this.formData.imageList.push({
            url: res,
            title: '',
            link: '',
            type: '',
            imgTit: '',
            path: {
              type: '',
              name: '',
              link: ''
            },
            activeBoxs: []
          })
        })
        let imgDef = new Image()
        imgDef.src = this.formData.imageList[0].url
        this.formData.imgHeight = Math.round(375 / imgDef.width * imgDef.height)
      }
    },
    /** 切换模板 */
    changeIndicator (index) {
      this.formData.indicator = index + 1
    },
    /** 更换图片 */
    changeImg (index) {
      this.isChangeImg = true
      this.currentEditIndex = index
      this.elxImgboxHandle(1)
      // this.canChooseImagesNum = 1
    },
    /** choose图片的回调 */
    chooseImagesEnd ($item) {
      this.elxImgboxVisible = false
      const $imgData = $item.data
      if ($imgData.length) {
        if (this.isChangeImg) { // 更换图片模式
          this.formData.imageList[this.currentEditIndex].url = $imgData[0].img
          this.formData.imageList[this.currentEditIndex].title = $imgData[0].productName
          return
        }
        $imgData.map(res => {
          this.formData.imageList.push({
            url: res.img,
            title: '',
            link: '',
            type: '',
            activeBoxs: []
          })
        })
      }
    },
    // 选择商品回调
    chooseGoodsFun ($event) {
      if ($event) {
        this.setLinkInfo({
          title: $event.prodName,
          link: $event.prodId
        })
      }
      this.dialogChooseGoods = false
    },
    // 选择跳转路径
    handleNavSelect(item, index) {
      this.dialogVisible = true;
      this.currentImgIndex = index;
    },
    // 删除跳转路径
    handleRemoveSelected(item, index) {
      this.formData.imageList[index].path.type = '';
      this.formData.imageList[index].path.name = '';
      this.formData.imageList[index].path.link = '';
    },
    // 关闭弹窗
    handleDialogClose() {
      this.dialogVisible = false;
    },
    // 商品弹窗确定
    handleDialogSubmit({ type, value }) {
      if(type === '1') { // 当前选择的是商品
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.goodsItem.prodName);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.goodsItem.prodId);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '1');
      } else if(type === '2') { // 当前选择的是分类
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.categoryItem.label);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.categoryItem.data);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '2');
      } else if(type === '3') { // 当前选择的是店铺
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.storeItem.shopName);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.storeItem.shopId);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '3');
      } else if(type === '4') { // 当前选择的是页面
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.pageItem.title);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.pageItem.link);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '4');
      } else if(type === '5') { // 当前选择的是微页面
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.smallPageItem.name);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.smallPageItem.renovationId);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '5');
      } else if(type === '6') { // 自定义链接
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.customLink);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.customLink);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '6');
      } else if(type === '7') { // 当前选择的是优惠券
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'name', value.couponItem.couponName);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'link', value.couponItem.couponId);
        this.$set(this.formData.imageList[this.currentImgIndex].path, 'type', '7');
      }
      this.dialogVisible = false;
    },
    /** 设置跳转信息 */
    setLinkInfo (obj) {
      this.formData.imageList[this.currentEditIndex].title = obj.title
      this.formData.imageList[this.currentEditIndex].link = obj.link
      this.formData.imageList[this.currentEditIndex].type = this.commandInfo.type || this.editLinkType

      this.$forceUpdate()
    },
    /** 选择跳转路径 */
    command (eve) {
      this.isCacheImage = eve.isCacheImage || false
      this.commandInfo = eve.linkItem
      if (eve.hasOwnProperty('currentEditIndex')) {
        this.currentEditIndex = eve.currentEditIndex
      }
      // 商品详情: 打开弹窗选择商品
      if (eve.linkItem.type === 1) {
        this.dialogChooseGoods = true
        this.$nextTick(() => {
          this.$refs.ProdsSelect.init()
        })
        return
      }
       // 自定义路径: 弹出路径输入框
      if (eve.linkItem.type === 4) {
        this.showPathInputDialog = true
        return
      }
      // 微页面: 弹窗选择一个页面
      if (eve.linkItem.type === 5) {
        this.choosePage()
      }
      this.setLinkInfo({
        title: this.commandInfo.title,
        link: this.commandInfo.link
      })
    },

    /**
     * 自定义路径弹窗确认
     */
    customPathComfirm () {
      if (!this.customPath.trim()) {
        this.$newMessage.error(this.$i18n.t('shopFeature.tabNav.pleaseFillThePath'))
        return
      }
      this.setLinkInfo({
        title: this.customPath,
        link: this.customPath
      })
      this.showPathInputDialog = false
      this.customPath = ''
    },
    /**
     * 自定义路径弹窗取消
     */
    customPathCancel () {
      this.showPathInputDialog = false
    },
    /**
     * 重置跳转类型
     */
    resetLink (index) {
      this.formData.imageList[index].title = ''
      this.formData.imageList[index].type = ''
    },

     /**
     * @param {当前操作项索引}} index
     */
    choosePage () {
      this.dialogChoosePages = true
    },
     // 选择微页面回调
    chooseChooseFeaturesFun ($event) {
      this.dialogChoosePages = false
    },
    /**
     * 修改商品
     */
    handleChangeLinkOrProd (index, type) {
      // type:  1修改商品  4修改自定义路径
      this.currentHotEditIndex = index
      this.editLinkType = type
      if (type === 1) {
        this.dialogChooseGoods = true
        this.$nextTick(() => {
          this.$refs.ProdsSelect.init()
        })
        return
      }
      if (type === 4) {
        this.customPath = this.formData.imageList[index].link
        this.showPathInputDialog = true
      }
    },
    /* 校验 */
    checkData () {
      let isPass = true
      let errorMessage = ''
      if (!this.formData.imageList.length) {
        isPass = false
        errorMessage = this.$i18n.t('shopFeature.imageAd.imageAd') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseAddPic')
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        // 弹窗提示错误消息
        this.showCheckForm()
        this.$newMessage.error(errorMessage)
      }
    },
    /* 控制滑块tooltip隐藏 */
    changeBoxHeight (t) {
      this.showTooltip = t
    }
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>
