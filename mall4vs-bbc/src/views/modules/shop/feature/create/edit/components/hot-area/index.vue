<template>
  <div class="micro-image-ad-box">
    <!--预览区-->
    <div class="design-preview-controller">
      <div v-if="formData.imageList.length"
           class="ad-view-box"
           :class="'ad-view-'+formData.indicator">
        <div v-if="formData.indicator ===1 || formData.indicator ===4 ">
          <img v-for="(item, index) in formData.imageList"
               :key="index"
               style="display: block"
               :src="item.url"
               alt="">
        </div>
      </div>
      <div v-else
           class="image-ad-view">
        <div class="image-ad-title">
          <img src="~@/assets/img/micro-page/p-ad-def.png" >
          {{$t('shopFeature.imageAd.widthSuggest')}}
        </div>
      </div>
    </div>
    <!--编辑区-->
    <div
        v-show="isShowEdit"
        class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.imageAd.hotArea')}}</div>
        <div class="image-ad-edit">
          <div class="ad-edit-item-title">{{$t('shopFeature.imageAd.addPic')}}
            <span class="tips">{{$t('shopFeature.imageAd.max10Ads')}}</span>
          </div>
          <!--hot model-->
          <draggable
            :list="formData.imageList"
            ghost-class="ghost"
            style="width: 376px;"
            handle=".ad-handle">
            <div
              v-for="(item,index) in formData.imageList"
              :key="index"
              class="ad-image-hot">
              <div class="add-ad-image" @click="showHotAreaPop(index)">{{$t('shopFeature.imageAd.addHotArea')}}</div>
              <div class="add-ad-image" @click="changeImg(index)">{{$t('shopFeature.tabNav.changePic')}} </div>
              <div class="ad-image-hot-box">
                <div v-show="item.activeBoxs.length" class="ad-image-hot-content ad-handle">
                  <span v-for="(hotItem,hotIndex) in item.activeBoxs"
                        :key="hotIndex"
                        class="ad-hot-box-item"
                        :style="`transform: translate(${hotItem.translateX * hotScale}px,${hotItem.translateY * hotScale}px);width:${hotItem.width * hotScale}px;height:${hotItem.height * hotScale}px;`">
                    <div class="redirect-title">{{hotItem.title}}</div>
                    <i class="el-icon-close close-icon" @click="item.activeBoxs.splice(hotIndex, 1)" />
                  </span>
                </div>
                <img class="ad-handle" :src="item.url">
                <i class="el-icon-error close-icon" @click="formData.imageList.splice(index, 1)" />
              </div>
            </div>
          </draggable>
          <!--选择图片框-->
          <div v-if="10 - formData.imageList.length !== 0"
               class="p-add-btn"
               @click="elxImgboxHandle">
            <i class="el-icon-plus" /> {{$t('shopFeature.imageAd.addBgImg')}}
          </div>
        </div>
      </div>
    </div>
    <!-- 添加热区弹窗 start -->
    <el-dialog custom-class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$i18n.t('shopFeature.imageAd.addHotArea')"
      :visible.sync="dialogHot"
      width="550px">
      <div class="ad-hot-box">
        <div v-if="dialogHot&&formData.imageList.length">
          <img :src="formData.imageList[currentEditIndex].url" class="box-img">
          <div
            v-for="(item,index) in cacheImageActiveBox"
            :key="index"
            v-drag="{cacheImageActiveBox,index}"
            class="ad-drag">
            <div
              class="titles"
              style="text-align: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer"
              @click.stop="handleNavLink(item, index)">
              {{item.title}}
            </div>
            <i class="el-icon-close close-icon" @click="cacheImageActiveBox.splice(index, 1)" />
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align: right;margin-top: 20px;">
        <el-button size="mini" type="primary" @click="addHotArea">{{$t('shopFeature.imageAd.addHotArea')}}</el-button>
        <el-button size="mini" @click="saveHotBox">{{$t('shopFeature.imageAd.save')}}</el-button>
      </div>
    </el-dialog>
    <!-- 添加热区弹窗 end -->
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      ref="elxImgbox"
      @refreshPic="refreshPic"
      :maxSize="10"
      :imgSizeLimit="false"></elx-imgbox>
    <!-- 商品选择弹窗  -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
     <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :deviceType="'mobile'"
      :customLinkArr="customLinkArr"
      :currentSelectType="[1, 2, 4, 5, 6, 7]"
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
import ChooseFeature from '@/components/choose-feature'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
/** 图片广告 */
export default {
  name: 'micro-image-ad-box',
  mixins: [microCreateMinis],
  directives: {handle: HandleDirective},
  props: {
    current: {
      type: Number
    }
  },
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      hotScale: 376 / 500,
      typeList: [
        {
          title: this.$i18n.t('shopFeature.imageAd.hotArea')
        }
      ],
      dialogHot: false, // 是否显示热区
      dialogChooseGoods: false, // 选择商品
      cacheImage: false, // 是否是正在编辑热区的
      /** 选择图片的弹窗 */
      elxImgboxVisible: false, // 显示选择图片
      isGetChooseImages: false, // 返回图片
      canChooseImagesNum: 1, // 可以添加的图片数量
      isChangeImg: false, // 是否为更换图片模式
      currentEditIndex: 0, // 当前编辑的图片
      currentHotEditIndex: 0, // 当前编辑的热区
      formData: {
        indicator: 4, // 选择模板: 1一行一个; 2轮播海报; 3横向滑动; 4热区
        imageList: [] // 图片列表
      },
      cacheImageActiveBox: [], // 缓存当前box list
      boxItem: {// 盒子模板
        link: '',
        type: '',
        title: '跳转链接',
        left: 0,
        top: 0,
        translateX: 0,
        translateY: 0,
        width: 102,
        height: 102
      },
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
      dialogVisible: false, // 商品弹窗
      currentImgIndex: 0, // 当前操作热区
      customLinkArr: {} // 自定义连接回显
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
    decorateDialogSelect
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
            activeBoxs: []
          })
        })
      }
    },
    /** 显示添加热区 */
    showHotAreaPop (index) {
      this.dialogHot = true
      this.currentEditIndex = index
      this.cacheImageActiveBox = JSON.parse(JSON.stringify(this.formData.imageList[this.currentEditIndex].activeBoxs))
    },
    /** 点击添加热区 */
    addHotArea () {
      this.cacheImageActiveBox.push(JSON.parse(JSON.stringify(this.boxItem)))
    },
    /** 保存热区 */
    saveHotBox () {
      const hotAreaBoxs = this.cacheImageActiveBox
      let flag = true
      for (let i = 0; i < hotAreaBoxs.length; i++) {
        const el = hotAreaBoxs[i]
        if (!el.type) {
          flag = false
          this.$newMessage.error(this.$i18n.t('shopFeature.imageAd.setHotAreaRoute'))
          break
        }
      }
      if (flag) {
        this.formData.imageList[this.currentEditIndex].activeBoxs = hotAreaBoxs
        this.dialogHot = false
      }
    },
    /** 更换图片 */
    changeImg (index) {
      this.isChangeImg = true
      this.currentEditIndex = index
      this.elxImgboxHandle(1)
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
    /** 设置跳转信息 */
    setLinkInfo (obj) {
      if (this.isCacheImage) { // 热区弹窗编辑模式
        this.cacheImageActiveBox[this.currentHotEditIndex].title = obj.title
        this.cacheImageActiveBox[this.currentHotEditIndex].link = obj.link
        this.cacheImageActiveBox[this.currentHotEditIndex].type = obj.type
        this.$forceUpdate()
        return
      }
      if (this.formData.indicator === 4) { // 热区非弹窗编辑模式
        this.formData.imageList[this.currentEditIndex].activeBoxs[this.currentHotEditIndex].title = obj.title
        this.formData.imageList[this.currentEditIndex].activeBoxs[this.currentHotEditIndex].link = obj.link
        this.formData.imageList[this.currentEditIndex].activeBoxs[this.currentHotEditIndex].type = obj.type
      }
      this.$forceUpdate()
    },
    // 热区跳转路径
    handleNavLink (item, index) {
      this.dialogVisible = true
      this.currentImgIndex = index
      this.customLinkArr = this.cacheImageActiveBox[index]
    },
    // 商品弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
    // 商品弹窗确定
    handleDialogSubmit ({ type, value }) {
      console.log(value)
      if (type === '1') { // 当前选择的是商品
        this.cacheImageActiveBox[this.currentImgIndex].type = '1'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.goodsItem.prodName
        this.cacheImageActiveBox[this.currentImgIndex].link = value.goodsItem.prodId
      } else if (type === '2') { // 当前选择的是分类
        this.cacheImageActiveBox[this.currentImgIndex].type = '2'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.categoryItem.label
        this.cacheImageActiveBox[this.currentImgIndex].link = value.categoryItem.data
      } else if (type === '4') { // 当前选择的是页面
        this.cacheImageActiveBox[this.currentImgIndex].type = '4'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.pageItem.title
        this.cacheImageActiveBox[this.currentImgIndex].link = value.pageItem.link
      } else if (type === '5') { // 当前选择的是微页面
        this.cacheImageActiveBox[this.currentImgIndex].type = '5'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.smallPageItem.name
        this.cacheImageActiveBox[this.currentImgIndex].link = value.smallPageItem.renovationId
      } else if (type === '6') { // 自定义链接
        this.cacheImageActiveBox[this.currentImgIndex].type = '6'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.customLink
        this.cacheImageActiveBox[this.currentImgIndex].link = value.customLink
      } else if (type === '7') { // 当前选择的是分类
        this.cacheImageActiveBox[this.currentImgIndex].type = '7'
        this.cacheImageActiveBox[this.currentImgIndex].title = value.couponItem.couponName
        this.cacheImageActiveBox[this.currentImgIndex].link = value.couponItem.couponId
      }
      this.dialogVisible = false
    },
    /* 校验 */
    checkData () {
      if (this.formData.imageList.length > 0) {
        this.myCheckResult(true)
      } else {
        // 弹窗提示错误消息
        this.showCheckForm()
        this.$newMessage.error(this.$i18n.t('shopFeature.imageAd.hotAreaTit') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseAddPic'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
