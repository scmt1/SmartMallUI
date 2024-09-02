<template>
  <!--所有可以选择的组件-->
  <div v-show="isShowAllComponents"
       id="allComponents"
       class="all-grouped all-can-use-components">
    <div class="add-component-grouped">
      <div class="add-component-grouped-item" >
        <div class="add-grouped-item-title">{{$t('shopFeature.allCanUse.basicComponents')}}</div>
        <div class="add-grouped-item-list">
            <!-- 基础组件 -->
          <draggable :list="componentLists"
                     :group="{ name: 'people', pull: 'clone', put: false }"
                     :clone="cloneDog"
                     ghost-class="ghost"
                     :disabled="!isDrag">
            <div v-for="(item,index) in baseList"
                 :key="index"
                 class="add-grouped-item-list-btn">
              <div  v-if="!item.isHide" @click="addComponent(item, index)" class="add-grouped-item-list-con">
                <div class="add-grouped-item-list-btn-title" :class="{'active': item.type === currentActiveType}">
                  <div class="item-pic-container">
                    <img v-if="item.type === currentActiveType " :src="item.picActive" alt="">
                    <img v-else :src="item.pic" alt="">
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
        <div class="add-grouped-item-title">{{$t('shopFeature.allCanUse.productMarketing')}}</div>
        <div class="add-grouped-item-list">
            <!-- 商品营销 -->
          <draggable :list="componentLists"
                     :group="{ name: 'people', pull: 'clone', put: false }"
                     :clone="cloneDog"
                     ghost-class="ghost"
                     :disabled="!isDrag">
            <div v-for="(item,index) in shopDisList"
                 :key="index"
                 class="add-grouped-item-list-btn">
              <div @click="addComponent(item, index)"
                   v-if="!item.isHide">
                <div class="add-grouped-item-list-btn-title" :class="{'active': item.type === currentActiveType}">
                  <div class="item-pic-container">
                    <img v-if="item.type === currentActiveType " :src="item.picActive" alt="">
                    <img v-else :src="item.pic" alt="">
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
        <div class="add-grouped-item-title">{{$t('shopFeature.allCanUse.extendComponent')}}</div>
        <div class="add-grouped-item-list">
          <draggable
            :list="componentLists"
            :group="{name: 'people', pull: 'clone', put: false}"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag">
            <div
              v-for="(item, index) in extendComponentList"
              :key="index"
              class="add-grouped-item-list-btn">
              <div v-if="!item.isHide" @click="addComponent(item, index)">
                <div class="add-grouped-item-list-btn-title" :class="{'active': item.type === currentActiveType}">
                  <div class="item-pic-container">
                    <img v-if="item.type === currentActiveType " :src="item.picActive" alt="">
                    <img v-else :src="item.pic" alt="">
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <!--end 所有可以选择的组件-->
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'micro-all-can-use-components',
  props: {
    /**
     * 结构
     * hideTheseComponents = [{type: 'config',isHide:true}]
     * */
    hideTheseComponents: {// 隐藏这些组件
      type: Array,
      default: () => []
    },
    showTheseComponents: {// 显示这些组件
      type: Array,
      default: () => []
    },
    isShowAllComponents: {// 是否隐藏所有组件
      type: Boolean,
      default: true
    }
  },
  components: {
    draggable
  },
  watch: {
    hideTheseComponents: {
      deep: true,
      handler () {
        this.hideComponents()
      }
    },
    showTheseComponents: {
      deep: true,
      handler () {
        this.showComponents()
      }
    }
  },
  data () {
    return {
      componentLists: [// 所有可用的组件
        {
          type: 'config', // 组件名称标识
          title: this.$i18n.t('shopFeature.allCanUse.config'),
          isHide: true, // 是否隐藏选择
          isHeader: true, // 是否为头部
          routerPath: () => import('../header/index.vue')// 路由地址
        },
        {// 公共广告头部配置
          type: 'config_common_ad',
          title: this.$i18n.t('shopFeature.allCanUse.config'),
          isHide: true, // 是否隐藏选择
          isHeader: true, // 是否为头部
          routerPath: () => import('../header_ad/index.vue')
        },
        // 标题文本
        {
          type: 'titleText',
          title: this.$i18n.t('shopFeature.allCanUse.titleText'),
          pic: require('@/assets/img/micro-page/p-text.png'),
          picActive: require('@/assets/img/micro-page/p-text-active.png'),
          routerPath: () => import('../title-text/index.vue')
        },
        // 公告
        {
          type: 'notice',
          title: this.$i18n.t('shopFeature.allCanUse.notice'),
          pic: require('@/assets/img/micro-page/p-notice.png'),
          picActive: require('@/assets/img/micro-page/p-notice-active.png'),
          routerPath: () => import('../notice/index.vue')
        },
        // 搜索
        {
          type: 'search',
          title: this.$i18n.t('shopFeature.searchBar.searchBar'),
          pic: require('@/assets/img/micro-page/p-search.png'),
          picActive: require('@/assets/img/micro-page/p-search-active.png'),
          routerPath: () => import('../search/index.vue')
        },
        // 商品列表
        {
          type: 'goods',
          title: this.$i18n.t('shopFeature.allCanUse.goodsList'),
          pic: require('@/assets/img/micro-page/p-prod-list.png'),
          picActive: require('@/assets/img/micro-page/p-prod-list-active.png'),
          routerPath: () => import('../goods/index.vue')
        },
        // 热销商品列表
        {
          type: 'hotGoods',
          title: "热销商品",
          pic: require('@/assets/img/micro-page/p-prod-list.png'),
          picActive: require('@/assets/img/micro-page/p-prod-list-active.png'),
          routerPath: () => import('../hotGoods/index.vue')
        },
        // 商品分类
        {
          type: 'classify',
          title: "商品分类",
          pic: require('@/assets/img/micro-page/p-prod-list.png'),
          picActive: require('@/assets/img/micro-page/p-prod-list-active.png'),
          routerPath: () => import('../goods-classify/index.vue')
        },
        // 图片广告
        {
          type: 'imageAd',
          title: this.$i18n.t('shopFeature.allCanUse.imgAd'),
          pic: require('@/assets/img/micro-page/p-image-ad.png'),
          picActive: require('@/assets/img/micro-page/p-image-ad-active.png'),
          routerPath: () => import('../image_ad/index.vue')
        },
        // 带边距图片广告
        {
          type: 'marginsImageAd',
          title: '带边距图片广告',
          pic: require('@/assets/img/micro-page/p-image-ad.png'),
          picActive: require('@/assets/img/micro-page/p-image-ad-active.png'),
          routerPath: () => import('../margins_image_ad/index.vue')
        },
         // 视频
        {
          type: 'video',
          title: this.$i18n.t('shopFeature.allCanUse.video'),
          pic: require('@/assets/img/micro-page//p-link.png'),
          picActive: require('@/assets/img/micro-page/p-link-active.png'),
          routerPath: () => import('../video/index.vue')
        },
        // 导航栏
        {
          type: 'tabNav',
          title: this.$i18n.t('shopFeature.allCanUse.navigationBar'),
          pic: require('@/assets/img/micro-page/p-tabs.png'),
          picActive: require('@/assets/img/micro-page/p-tabs-active.png'),
          routerPath: () => import('../tab-nav/index.vue')
        },
        // 促销活动
        {
          type: 'promotionalActivities',
          title: this.$i18n.t('shopFeature.allCanUse.activities'),
          pic: require('@/assets/img/micro-page/p-promotion.png'),
          picActive: require('@/assets/img/micro-page/p-promotion-active.png'),
          routerPath: () => import('../promotional-activities/index.vue')
        },
        // 热区
        {
          type: 'hotArea',
          title: this.$i18n.t('shopFeature.imageAd.hotAreaTit'),
          pic: require('@/assets/img/micro-page/p-hotarea.png'),
          picActive: require('@/assets/img/micro-page/p-hotarea-active.png'),
          routerPath: () => import('../hot-area/index.vue')
        },
        {
          type: 'goodsModule1',
          title: this.$i18n.t('shopFeature.allCanUse.goodsModule1'),
          pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
          picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
          routerPath: () => import('../goodsModuleOne/index.vue')
        },
        {
          type: 'goodsModule2',
          title: this.$i18n.t('shopFeature.allCanUse.goodsModule2'),
          pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
          picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
          routerPath: () => import('../goodsModuleTwo/index.vue')
        },
        {
          type: 'goodsModule3',
          title: this.$i18n.t('shopFeature.allCanUse.goodsModule3'),
          pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
          picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
          routerPath: () => import('../goodsModuleThree/index.vue')
        },
        {
          type: 'goodsModule4',
          title: this.$i18n.t('shopFeature.allCanUse.goodsModule4'),
          pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
          picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
          routerPath: () => import('../goodsModuleFour/index.vue')
        },
        {
          type: 'goodsModule5',
          title: this.$i18n.t('shopFeature.allCanUse.goodsModule5'),
          pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
          picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
          routerPath: () => import('../goodsModuleFive/index.vue')
        }
        // ,
        // // 分类
        // {
        //   type: 'classificationList',
        //   title: '分类列表',
        //   routerPath: () => import('../classification-list/index.vue')
        // }
      ],
      isDrag: true,
      // 当前选中的组件
      currentActiveType: '',
      shopDisList: [],
      baseList: [],
      extendComponentList: [] // 扩展组件
    }
  },
  created () {
    this.groupcomponent()
  },
  mounted () {
    this.$emit('retAllCanUseComponents', this.componentLists)
    this.hideComponents()
    this.showComponents()
  },
  methods: {
    /**
     *  组件分组
     */
    groupcomponent () {
      let baseList = []
      let shopDisList = []
      let extendComponent = []
      for (let i = 0; i < this.componentLists.length; i++) {
        const item = this.componentLists[i]
        if (item.type === 'promotionalActivities' || item.type === 'goods' || item.type === 'hotGoods' || item.type === 'classify') {
          shopDisList.push(item)
        } else if (item.type === 'goodsModule1' || item.type === 'goodsModule2' || item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') {
          extendComponent.push(item)
        } else {
          baseList.push(item)
        }
      }
      this.baseList = baseList
      this.shopDisList = shopDisList
      this.extendComponentList = extendComponent
    },

    cloneDog ({ type }) {
      return this.componentLists.find(x => x.type === type)
    },
    /** 添加组件 */
    addComponent (item) {
      this.currentActiveType = item.type
      this.$emit('addComponent', item)
    },
    /** 隐藏组件 */
    hideComponents () {
      if (this.hideTheseComponents.length) { // 判断是否隐藏这些组件，那么其他的组件均显示（除了isHeader的）
        this.componentLists.map(res => {
          if (!res.isHeader) {
            this.$set(res, 'isHide', false)
          }
        })
      }
      this.isShowOrHide(this.hideTheseComponents, true)
    },
    showComponents () {
      if (this.showTheseComponents.length) { // 判断是否显示这些组件，那么其他的组件均隐藏
        this.componentLists.map(res => {
          if (!res.isHeader) {
            this.$set(res, 'isHide', true)
          }
        })
      }
      this.isShowOrHide(this.showTheseComponents, false)
    },
    isShowOrHide ($data, isHide) {
      if (!$data.length) return
      $data.map(res => {
        if (res.type) {
          const $index = this.componentLists.findIndex(x => x.type === res.type)
          if ($index >= 0) {
            this.$set(this.componentLists[$index], 'isHide', isHide)
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
