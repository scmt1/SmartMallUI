<template>
  <div class="micro-tab-nav-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <!--文本-->
      <div class="nav-list"
           v-if="formData.set.type === 3">
        <div :class="['nav-item-item text_overFlow_1 nav-item-image-li', formData.size==4? 'column-four': 'column-five']"
             v-for="(item,index) in showNav"
             :key="index">
          <span class="text_overFlow_1" :style="{color:formData.set.font_color}">{{item.title || `demo${index+1}`}}</span>
        </div>
      </div>
      <!--模式 图文-->
      <div v-else
           class="nav-item-image">
        <div :class="['nav-item-image-li', formData.size==4? 'column-four': 'column-five']"
             v-for="(item,index) in showNav"
             :key="index">
          <div class="img-con" :class="{'full-img': item.img}">
            <img :src="item.img || defPic">
          </div>
          <!--图文模式-->
          <span v-if="formData.set.type !==1"
             class="text_overFlow_1"
             :style="{color:formData.set.font_color}">
            {{item.title || `demo${index+1}`}}</span>
        </div>
        <!-- 补齐flex布局样式 -->
        <slot v-if="showNav.length % formData.size !=0">
          <div :class="['nav-item-image-li', formData.size==4? 'column-four': 'column-five']"
               style="visibility:hidden;"
               v-for="(item,index) in formData.size - (showNav.length % formData.size)"
               :key="index + 100">
            <div class="img-con">
              <img :src="defPic">
            </div>
            <!--图文模式-->
            <span v-if="formData.set.type !==1"
               class="text_overFlow_1">
              {{item.title || `demo${index+1}`}}</span>
          </div>
        </slot>
      </div>
      <!-- <div class="nav-content">
        显示内容，客户端才能展示
      </div> -->
    </div>
    <!--编辑工作区-->
    <div class="design-editor-item design-hide-class"
         v-if="isShowEdit">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.tabNav.navBar')}}</div>
        <div class="tab-nav-set design-editor-component-container">
          <!-- 配置-->
          <div class="tab-set-box">
            <el-form ref="formData" class="edit-form" size="small">
              <el-form-item label="选择模版" class="tab-set-style">
                <el-radio-group v-model="formData.set.type">
                  <el-radio v-for="(typeItem, index) in setTypeList"
                                   :key="index"
                                   :label="typeItem.type">{{typeItem.title}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$i18n.t('shopFeature.tabNav.countInLine')">
                <el-radio-group v-model="formData.size">
                  <el-radio v-for="(typeItem, index) in setCountsList"
                            :key="index"
                            :label="typeItem.value">{{typeItem.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <!-- 各个导航分类 -->
          <div class="tab-nav-set-item" :style="{borderColor:errIndex===index ? '#f56c6c': '#eee'}"
               v-for="(item,index) in formData.nav"
               :key="index">
            <div class="set-box">
              <!--图片-->
              <div class="set-image"
                   v-if="formData.set.type !==3"
                   @click="choosePic(index)"
                   :style="{backgroundImage:'url('+item.img+')'}">
                <div v-if="item.img" class="set-image-add">{{$t('shopFeature.tabNav.changePic')}}</div>

                <div v-else class="set-image-empty">
                  <div><i class="el-icon-plus"></i></div>
                  <div>{{ $t('shopFeature.tabNav.addPic')}}</div>
                </div>
              </div>
              <!-- 标题信息 -->
              <div class="set-info" :class="{'flex-center': formData.set.type === 1}">
                <div class="set-item-title"
                     v-if="formData.set.type !==1">
                  <span>{{$t('shopFeature.tabNav.tit')}}</span>
                  <el-input maxlength="25"
                            size="mini"
                            :style="{width: formData.set.type === 3 ? '274px' : '227px'}"
                            :placeholder="$i18n.t('shopFeature.tabNav.tit')"
                            v-model="item.title">
                  </el-input>
                </div>
                <div class="set-item-title">
                  <span>{{$t('shopFeature.tabNav.link')}}</span>
                  <div :style="{width: formData.set.type === 3 ? '274px' : '227px'}">
                    <redirect-nav
                      :selectedLink="item.path && item.path.name"
                      :placeholder="$t('pcdecorate.placeholder.link')"
                      @handleNavSelect="handleNavSelect(item, index)"
                      @handleRemoveSelected="handleRemoveSelected(item, index)">
                    </redirect-nav>
                  </div>
                </div>
              </div>
            </div>
            <i class="el-icon-close set-close" @click="formData.nav.splice(index,1)"></i>
          </div>
          <div class="p-add-btn" @click="addNav">{{$t('shopFeature.tabNav.addNav')}}</div>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      ref="elxImgbox"
      @refreshPic="refreshPic"
      :maxSize="10"
      :imgSizeLimit="false">
    </elx-imgbox>
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
import {microCreateMinis} from '../../minis'
import ProdsSelect from '@/components/prods-select'
import ChooseFeature from '@/components/choose-feature/index.vue'
import ElxImgbox from '@/components/elx-imgbox'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index.vue';
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
/** 导航配置 */
export default {
  name: 'micro-tab-nav-box',
  mixins: [microCreateMinis],
  data () {
    return {
      isGetChooseFeature: false, // 是否可以返回微页面
      dialogChoosePages: false, // 微页面弹窗
      /** 选择图片的弹窗 */
      isGetChooseImages: false,
      dialogChooseImgVisible: false,
      dialogChooseGoods: false,
      setTypeList: [// 模式
        {
          type: 1,
          title: this.$i18n.t('shopFeature.tabNav.picNav')
        },
        {
          type: 2,
          title: this.$i18n.t('shopFeature.tabNav.picTextNav')
        },
        {
          type: 3,
          title: this.$i18n.t('shopFeature.tabNav.tetxNav')
        }
      ],
      formData: {
        set: {
          type: 2 // 模板类型   1图片 2 图文 3 文字
          // bg_color: '#fff', // 背景颜色
          // font_color: '#222' // 字体颜色
        },
        // 配置
        nav: [],
        size: 4 // 默认一行四个导航
      },
      setCountsList: [
        {
          value: 4,
          label: this.$i18n.t('shopFeature.tabNav.line4item')
        },
        {
          value: 5,
          label: this.$i18n.t('shopFeature.tabNav.line5item')
        }
      ],
      linkList: [
        // {
        //   id: '',
        //   img: '',
        //   linkType: 1,
        //   microTitle: '',
        //   linkTitle: this.$i18n.t('shopFeature.imageAd.prodDetPage'),
        //   link: ''
        // },
        {
          img: '',
          linkType: 2,
          microTitle: '',
          linkTitle: this.$i18n.t('shopFeature.tabNav.cart'),
          link: ''
        },
        {
          img: '',
          linkType: 3,
          microTitle: '',
          linkTitle: this.$i18n.t('shopFeature.tabNav.personalCenter'),
          link: ''
        },
        {
          img: '',
          linkType: 4,
          microTitle: '',
          linkTitle: this.$i18n.t('shopFeature.tabNav.customPath'),
          link: ''
        },
        {
          img: '',
          linkType: 5,
          microTitle: '',
          linkTitle: this.$i18n.t('shopFeature.headerAd.microPage'),
          link: ''
        }
      ],
      demoNav: [],
      currentNav: 0,
      showNav: [],
      id: '',
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      selectLinkItem: null,
      customPath: '', // 自定义路径
      showPathInputDialog: false, // 自定义路径输入弹窗
      errIndex: '', // 信息不完整的导航项的索引
      customPathIndex: '',
      defPic: require('@/assets/img/micro-page/def.png'),
      dialogVisible: false, // 商品信息弹窗是否显示
      currentNavIndex: 0, // 当前操作导航
    }
  },
  props: {
    current: {
      type: Number
    }
  },
  watch: {
    formData: {
      deep: true,
      handler (res) {
        if (res.size === 4) {
          this.demoNav.splice(4, 1)
        } else if (res.size === 5 && this.demoNav.length === 4) {
          this.demoNav.push({
            title: 'demo5'
          })
        }
        if (res.nav.length) {
          this.showNav = res.nav
        } else {
          this.showNav = this.demoNav
        }
      }
    }
  },
  components: {
    ProdsSelect,
    ElxImgbox,
    ChooseFeature,
    redirectNav,
    decorateDialogSelect
  },
  computed: {},
  filters: {
    pathFilter (val) {
      if (!val) return ''
      return String(val)
    }
  },
  mounted () {
    for (let i = 0; i < 4; i++) {
      this.demoNav.push({
        title: `demo${i + 1}`
      })
    }
    if (this.formData.nav.length) {
      this.showNav = this.formData.nav
    } else {
      this.showNav = this.demoNav
    }
  },
  methods: {
    /**
     * 重新选择商品/微页面 (商品暂时注释了)
     */
    reChooseLink (item, index) {
      this.selectLinkItem = {}
      this.selectLinkItem.currentEditIndex = index
      this.selectLinkItem.linkItem = item
      if (item.linkType === 5) {
        // 微页面
        this.choosePage(index)
      }
      if (item.linkType === 4) {
        // 修改自定义路径
        this.customPath = this.formData.nav[index].link
        this.customPathIndex = index
        this.showPathInputDialog = true
      }
    },
     /**
      * 选择跳转路径
      **/
    command (selectLinkItem) {
      this.selectLinkItem = selectLinkItem
      // 跳转到商品
      // if (selectLinkItem.linkItem.linkType === 1) {
      //   this.dialogChooseGoods = true
      //   this.$nextTick(() => {
      //     this.$refs.ProdsSelect.init()
      //   })
      // }
      // 跳转到自定义路径: 显示路径输入弹窗
      if (selectLinkItem.linkItem.linkType === 4) {
        this.showPathInputDialog = true
        return
      }
      // 跳转到微页面: 打开微页面列表选择一个页面
      if (selectLinkItem.linkItem.linkType === 5) {
        this.choosePage(selectLinkItem.currentEditIndex)
        return
      }
      this.setLinkInfo()
    },
    /**
     * 重置跳转路径
     */
    resetLink (index) {
      this.formData.nav[index].link = ''
      this.formData.nav[index].linkType = ''
      this.formData.nav[index].linkTitle = ''
    },
    setLinkInfo () {
      if (this.customPathIndex !== '') {
        this.formData.nav[this.customPathIndex].link = this.customPath
        this.customPathIndex = ''
      } else {
        // 设置跳转信息
        this.currentNav = this.selectLinkItem.currentEditIndex
        this.formData.nav[this.selectLinkItem.currentEditIndex].link = this.selectLinkItem.linkItem.linkType === 4 ? this.customPath : this.selectLinkItem.linkItem.link
        this.formData.nav[this.selectLinkItem.currentEditIndex].linkType = this.selectLinkItem.linkItem.linkType
        this.formData.nav[this.selectLinkItem.currentEditIndex].linkTitle = this.selectLinkItem.linkItem.linkTitle
        this.formData.nav[this.selectLinkItem.currentEditIndex].microTitle = this.selectLinkItem.linkItem.microTitle
      }
    },
    /**
     * 自定义路径弹窗确认
     */
    customPathComfirm () {
      if (!this.customPath.trim()) {
        this.$newMessage.error(this.$i18n.t('shopFeature.tabNav.pleaseFillThePath'))
        return
      }
      this.setLinkInfo()
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
     * 点击图片
     */
    choosePic (index) {
      this.currentNav = index
      this.elxImgboxHandle(1)
    },
    /**
     * 选择图片
     * @param {String} type
     * type 1 单选; 2 多选
     */
    elxImgboxHandle (type) {
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(type)
      })
    },
    /**
     * 选择图片回调
     * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
     */
    refreshPic (imagePath) {
      // 导航这里只有单选的
      this.formData.nav[this.currentNav].img = this.resourcesUrl + imagePath
    },
    /** 添加导航 */
    addNav () {
      this.formData.nav.push({
        title: `demo${this.formData.nav.length + 1}`, // nav 标题
        microTitle: '', // 微页面的名称
        img: '', // 图文/图片导航  图片
        path: {
          type: '',
          name: '',
          link: ''
        }
      })
    },
    /**
     * @param {当前操作项索引} index
     * @param {*} img
     */
    choosePage (index, img = false) {
      this.currentNav = index || this.currentNav
      if (img) { // 选择图片
        this.elxImgboxHandle(1)
      } else {
        this.dialogChoosePages = true
      }
    },
    // 选择跳转路径
    handleNavSelect(item, index) {
      this.dialogVisible = true;
      this.currentNavIndex = index;
    },
    // 删除跳转路径
    handleRemoveSelected(item, index) {
      this.formData.nav[index].path.type = '';
      this.formData.nav[index].path.link = '';
      this.formData.nav[index].path.name = '';
    },
    // 商品弹窗关闭
    handleDialogClose() {
      this.dialogVisible = false;
    },
    // 商品弹窗确定
    handleDialogSubmit({type, value}) {
      if(type === '1') { // 当前选择的是商品
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.goodsItem.prodName);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.goodsItem.prodId);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '1');
      } else if(type === '2') { // 当前选择的是分类
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.categoryItem.label);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.categoryItem.data);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '2');
      } else if(type === '3') { // 当前选择的是店铺
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.storeItem.shopName);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.storeItem.shopId);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '3');
      } else if(type === '4') { // 当前选择的是页面
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.pageItem.title);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.pageItem.link);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '4');
      } else if(type === '5') { // 当前选择的是微页面
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.smallPageItem.name);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.smallPageItem.renovationId);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '5');
      } else if(type === '6') { // 自定义链接
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.customLink);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.customLink);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '6');
      } else if(type === '7') { // 当前选择的是优惠券
        this.$set(this.formData.nav[this.currentNavIndex].path, 'name', value.couponItem.couponName);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'link', value.couponItem.couponId);
        this.$set(this.formData.nav[this.currentNavIndex].path, 'type', '7');
      }
      this.dialogVisible = false;
    },
    // 选择微页面回调
    chooseChooseFeaturesFun ($event) {
      this.setLinkInfo()
      this.formData.nav[this.currentNav].link = $event.data.renovationId
      this.formData.nav[this.currentNav].microTitle = $event.data.name
      this.dialogChoosePages = false
    },

    /**
     * 开始验证
     * */
    checkData () {
      let isPass = true
      let errorMessage = ''
      if (!this.formData.nav.length) {
        isPass = false
        errorMessage = this.$i18n.t('shopFeature.tabNav.navBar') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseAddNav')
      } else {
        for (let index = 0; index < this.formData.nav.length; index++) {
          const navItem = this.formData.nav[index]
          // this.formData.set.type    1图片 2图文 3文字
          if (this.formData.set.type < 3) {
            // 图片校验
            if (!navItem.img || !navItem.img.trim()) {
              isPass = false
              errorMessage = this.$i18n.t('shopFeature.tabNav.navBar') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseAddPic')
              this.errIndex = index
              break
            }
          }
          if (this.formData.set.type > 1) {
            // 导航标题校验
            if (!navItem.title || !navItem.title.trim()) {
              isPass = false
              errorMessage = this.$i18n.t('shopFeature.tabNav.navBar') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseFillNavTitle')
              this.errIndex = index
              break
            }
          }
          // 公共校验
          if (navItem.path.name === '') {
            errorMessage = this.$i18n.t('shopFeature.tabNav.navBar') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseChooseRouteLink')
            isPass = false
            this.errIndex = index
            break
          }
          if (navItem.linkType === 4 && !navItem.link.trim()) {
            errorMessage = this.$i18n.t('shopFeature.tabNav.navBar') + this.current + this.$i18n.t('shopFeature.tabNav.pleaseFillThePath')
            isPass = false
            this.errIndex = index
            break
          }
        }
      }
      if (isPass) {
        this.myCheckResult(isPass)
        this.errIndex = ''
      } else {
        this.showCheckForm()  // 使用element-ui表单自定义校验规则: 需在form标签内,自定义rules:{required:true}
        this.$newMessage.error(errorMessage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
