<template>
  <div class="micro-create-pc">
    <decorate-navbar ref="decorateNavbar" 
    @addComponent="addComponent" 
    @handleClickComponent="handleClickComponent" @handleSave="handleSave" 
    @closeComponentManage="isshowComponentManage = false" 
    :isTemplate="isTemplate"
    :dataFormL="dataForm"
    @handleSaveTemplate="handleSaveTemplate"
    @view="view"
    @closeRight="isRightShow = false; storeHeaderStatus = false" />

    <div class="micro-box-content" @click="closeDecorateNavbar" :style="{backgroundColor:'#fff'}">
      <div class="design-page">
        <div class="design-page-content">
          <!-- 左侧装修组件 start -->
          <!-- <div class="all-use-components" :class="{'border-left': !sidebarFold}">
            <all-can-use-components 
              v-show="isshowLeftComponent" 
              @addComponent="addComponent">
            </all-can-use-components>
          </div> -->
          <!-- 左侧装修组件 end -->
          <!-- 界面预览 start -->
          <div id="scrollbar" ref="designEditor" :style="{'overflow': 'auto', 'background': pageBackgroundColor}" class="design-container">
            <div style="width:100vw">
              <div class="design-editor" :style="scaleFun">
                <!-- <div class="components-management" @click="handleClickComponent">{{$t('pcdecorate.commonModal.component')}}</div> -->
                <!-- 商家招牌 start -->
                <template v-if="HeaderComponent.length > 0">
                  <div 
                    v-for="(itemHeader, itemIndex) in HeaderComponent"
                    :key="itemIndex"
                    style="cursor: pointer;position: relative"
                    class="header-component"
                    :class="currentIndex == '-1' ? 'isHeader' : ''">
                    <storeSignate
                      :itemComponent="itemHeader"
                      @click.native="handleHeaderClick(itemHeader, itemIndex)">
                    </storeSignate>
                    <!-- <el-popover
                      placement="left"
                      width="200"
                      class="header-PopRef"
                      ref="headerPopRef"
                      trigger="click">
                      <p>{{$t('pcdecorate.commonModal.delText')}}？</p>
                      <div class="del-content" style="display: flex;margin: 10px 0 0 0;justify-content: flex-end">
                        <el-button 
                          size="mini" 
                          style="width: 52px;border: 1px solid #dcdfe6;color:#666" 
                          type="text" 
                          @click="handleCloseRemoveHeader('1')">{{$t('pcdecorate.commonModal.cancel')}}</el-button>
                        <el-button 
                          type="primary" 
                          size="mini" 
                          @click="handleCloseRemoveHeader('2')">{{$t('pcdecorate.commonModal.sure')}}</el-button>
                      </div>
                      <div slot="reference" class="component-close-x">x</div>
                    </el-popover> -->
                  </div>
                </template>
                <!-- 商家招牌 end -->
                <slick-list
                  v-model="currentUseComponents"
                  :use-drag-handle="true"
                  lock-axis="y"
                  :lockToContainerEdges="true"
                  helper-class="draggerStyles"
                  appendTo=".design-editor"
                  :pressDelay="500"
                  class="slickList-scroll"
                  @input="sortInput"
                  @sort-start="sortStart"
                  @sort-move="sortMove"
                  @sort-end="sortEnd">
                  <slick-item
                    v-for="(item, index) in currentUseComponents"
                    :id="'previewItem_'+index"
                    :key="index"
                    :class="{'component-items': true, 'isborderActive': index === currentIndex}"
                    :index="index"
                    @mousedown.native="clickComponent(item, index)">
                    <div class="preiview-item">
                      <!-- 中间不同的组件进行预览 start -->
                      <component
                        :is="item.components" 
                        :currentIndex="index"
                        :itemComponent="item"
                        :ref="item.Ref+index"
                        :currentRefs="item.Ref+index" />
                      <!-- 中间不同的组件进行预览 end  -->
                      <div class="component-hover-style">
                        <div v-handle class="drag-box"></div>
                        <!-- 删除 start -->
                        <!-- <el-popover
                          placement="left"
                          width="200"
                          :ref="'pop_'+index"
                          trigger="click">
                          <p>{{$t('pcdecorate.commonModal.delText')}}？</p>
                          <div class="del-content" style="display: flex;margin: 10px 0 0 0;justify-content: flex-end">
                            <el-button size="mini" style="width: 52px;border: 1px solid #dcdfe6;color:#666" type="text" @click="handleCloseRemoveComponent('1', item, 'pop_'+index, index)">{{$t('pcdecorate.commonModal.cancel')}}</el-button>
                            <el-button type="primary" size="mini" @click="handleCloseRemoveComponent('2', item, 'pop_'+index, index)">{{$t('pcdecorate.commonModal.sure')}}</el-button>
                          </div>
                          <div slot="reference" class="component-close-x">x</div>
                        </el-popover> -->
                        <!-- 删除 end -->
                      </div>
                    </div>
                  </slick-item>
                </slick-list>
              </div>
            </div>
          </div>
          <!-- 界面预览 end -->
          
          <!-- 右边配置信息 start -->
            <!-- 招牌头部配置 start -->
            <div class="component-management-container" v-show="storeHeaderStatus" :class="storeHeaderStatus && 'fade-open'">
              <template v-for="(itemHeader, itemIndex) in HeaderComponent">
                <store-signate-tool
                  :key="itemIndex"
                  :ref="itemHeader.Ref+itemIndex"
                  :currentRef="configMessage.Ref"
                  :currentItem="configMessage"
                  :editItem="itemHeader.rightConfigMessage"
                  @closeStoreSignateConfig="storeHeaderStatus = false"
                  @handleUpdateMessage="handleHeaderMessage">
                </store-signate-tool>
              </template>
            </div>
            <!-- 招牌头部配置 end -->
            <!-- 组件管理 start -->
            <div class="component-management-container" v-show="isshowComponentManage" :class="isshowComponentManage && 'fade-open'">
              <component-management
                ref="componentManageRef"
                :currentUseComponents="currentUseComponents"
                :HeaderComponent="HeaderComponent"
                @handleSortComponent="handleSortComponent"
                @handleSingleRemove="handleSingleRemove"
                @handleRemoveComponnent="handleRemoveComponnent"
                @closeComponentManageContainer="isshowComponentManage = false"
                @handleHeaderDel="handleHeaderDel"
                @handlePageColor="handlePageColor">
              </component-management>
            </div>
            <!-- 组件管理 end -->
            <!-- 右边工具配置栏 start -->
            <div v-show="isRightShow" class="right-toolbars" :class="isRightShow && 'fade-open'">
              <right-config-message
                ref="rightConfigForm"
                :configMessage="configMessage"
                :operationType="operationType"
                @closeRightConfigContainer="isRightShow = false"
                :currentUseComponents="currentUseComponents"
                @handleUpdateMessage="handleUpdateMessage" />
            </div>
            <!-- 右边工具配置栏 end -->
          <!-- 右边配置信息 end -->
        </div>
      </div>
    </div>
    <!-- <div class="save-btns">
      <el-button class="btns1" @click="handleSave('1')" :loading="saveLoading">保存</el-button>
      <el-button class="btns1" @click="handleSave('2')">保存并继续</el-button>
      <el-button class="returnBtn" @click="handleReturn" >返回</el-button>
    </div> -->
  </div>
</template>
<script>
// 顶边栏
import decorateNavbar from './decorate-navbar.vue'

// import allCanUseComponents from './components/allCanUseComponents/index.vue' // 左边组件列表
import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort' // 拖动组件
import rightConfigMessage from './components/rightConfigMessage/index.vue' // 右边对应的配置信息
// 基础组件
import storeSignate from './components/basicComponent/storeSignate/index.vue' // 商家招牌组件
import pictureShuffling from './components/basicComponent/pictureShuffling/index.vue' // 图片轮播组件
import intervalComponent from './components/basicComponent/intervalComponent/index.vue' // 辅助间隔组件
import floorTitleComponent from './components/basicComponent/floorTitleComponent/index.vue' // 楼层标题组件
import goodListComponent from './components/basicComponent/goodListComponent/index.vue' // 商品列表组件
import hotSpotComponent from './components/basicComponent/hotSpotComponent/index.vue' // 万能热区组件
import storeListComponent from './components/basicComponent/storeListComponent/index.vue' // 店铺列表配置信息
// 营销活动
import limitedSkillComponent from './components/marketingActivities/limitedSkillComponent/index.vue' // 限时秒杀组件
import discountCouponComponent from './components/marketingActivities/discountCouponComponent/index.vue' // 优惠团购组件
// 扩展组件
import goodsModuleComponentOne from './components/extendComponent/goodsModuleComponentOne/index.vue' // 商品模块1组件
import goodsModuleComponentTwo from './components/extendComponent/goodsModuleComponentTwo/index.vue' // 商品模块2组件
import goodsModuleComponentThree from './components/extendComponent/goodsModuleComponentThree/index.vue' // 商品模块3组件
import goodsModuleComponentFour from './components/extendComponent/goodsModuleComponentFour/index.vue' // 商品模块4组件
import goodsModuleComponentFive from './components/extendComponent/goodsModuleComponentFive/index.vue' // 商品模块5组件间
// 组件管理
import componentManagement from './components/componentManagement/index' // 组件管理
import storeSignateTool from './components/basicComponent/storeSignate/rightTool.vue' // 招牌配置组件
import { configComponentList } from './components/configComponent' // 左边组件信息
export default {
  components: {
    decorateNavbar,
    // allCanUseComponents,
    SlickList,
    SlickItem,
    storeSignate,
    pictureShuffling,
    intervalComponent,
    floorTitleComponent,
    goodListComponent,
    hotSpotComponent,
    storeListComponent,
    rightConfigMessage,
    limitedSkillComponent,
    discountCouponComponent,
    goodsModuleComponentOne,
    goodsModuleComponentTwo,
    goodsModuleComponentThree,
    goodsModuleComponentFour,
    goodsModuleComponentFive,
    componentManagement,
    storeSignateTool
  },
  directives: {handle: HandleDirective},
  data () {
    return {
      isshowLeftComponent: true, // 是否展示左边的所有组件
      currentUseComponents: [], // 当前正在编辑的组件
      scrollTopHeight: 0, // 当前组件页面滚动的高度
      isMoveIng: true, // 组件是否正在移动
      isRightShow: false, // 右边导航是否显示
      configMessage: { // 右边的配置信息
        currentConfigTitle: '', // 右边配置标题
        type: '', // 当前配置的是左边的组件还是排序信息
        currentConfigType: '', // 右边配置左边那个组件的信息
        config: {} // 配置信息
      },
      windowWidth: '', // 当前页面窗口的大小
      windowHeight: '', // 当前页面窗口的大小
      scaleFun: {
        transform: 'scale(1)'
      },
      isShowClose: false, // 是否显示关闭按钮
      currentIndex: '', // 当前点击的组件
      startX: '', // 拖拽开始距离x
      endX: '', // 拖拽结束距离x
      startY: '', // 拖拽开始距离y
      endY: '', // 拖拽结束距离y
      isshowComponentManage: false, // 是否展示组件管理
      renovationId: '', // 店铺装修id
      templateId: '', // 模板装修id
      saveLoading: false, // 保存loading
      operationType: '', // 当前操作的类型
      nodeOffsetTop: 0, // 当前节点距离顶部的距离
      pageBackgroundColor: 'rgba(244, 244, 244, 1)', // 页面背景颜色
      HeaderComponent: [], // 头部组件
      storeHeaderStatus: false, // 头部组件配置信息是否显示
      timer: null,
      pageWidth: '', // 可视容器的宽度
      isCollapse: false,
      isTemplate: '0', // 是否为模板编辑
      dataForm: {
        name: '',
        remark: '',
        imgUrl: ''
      }, // 模板信息
      pageType: ''
    }
  },
  beforeRouteEnter (to, form, next) {
    document.querySelector('body').setAttribute('style', 'overflow-x: hidden')
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('body').setAttribute('style', 'overflow-x: auto')
    next()
  },
  mounted () {
    this.isshowComponentManage = true
    // 将左边菜单给隐藏掉
    this.$store.commit('common/updateSidebarFold', true)
    // 监听布局页面的改动
    this.getCurrentPageWidth()
    window.onresize = () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.windowWidth = document.body.clientWidth
        this.windowHeight = document.body.clientHeight
      }, 200)
    }
    // 拿到当前编辑的店铺装修id
    let { renovationId, type, templateId } = this.$route.query
    this.isTemplate = this.$route.query.template
    this.pageType = type
    if (type === 'edit') {
      this.operationType = 'edit' // 当前是编辑
      this.renovationId = renovationId
      this.templateId = templateId
      if (this.isTemplate === '0') {
        this.getDetail()
      } else {
        this.getTemplateDetail()
      }
    } else if (type === 'add' && templateId) {
      this.templateId = templateId
      this.getTemplateDetail()
    }
  },
  computed: {
    sidebarFold () {
      return this.$store.state.common.sidebarFold
    }
  },
  methods: {
    // 预览
    view () {
      let params = {
        content: JSON.stringify(this.beforeSave()), // 配置内容
        name: this.$refs.componentManageRef.smallPageName // 页面名称
      }
      localStorage.setItem('viewContent', JSON.stringify(params))
      let newPage = this.$router.resolve({
        path: '/platform-decorate/create/select-decorate/index',
        query: {
          type: 'detail'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    // 清除菜单选择
    closeDecorateNavbar () {
      this.$refs.decorateNavbar.menuActive = -1
      this.$refs.decorateNavbar.visible = false
    },
    // 返回
    handleReturn () {
      this.$router.push({
        name: 'platform-feature/list/index'
      })
    },
    // 获取详情数据
    getDetail () {
      this.$http({
        url: this.$http.adornUrl(`/platform/shopRenovation/info/${this.renovationId}`),
        method: 'get'
      }).then(async ({data}) => {
        let useArr = []
        let contentArr = JSON.parse(data.content)
        // 匹配商品
        contentArr = await this.matchproducts(contentArr)
        contentArr.forEach(ele => {
          if (ele.type === 'page_background') { // 页面背景颜色
            this.pageBackgroundColor = ele.dataField.background
            this.$refs.componentManageRef.pageBackground = ele.dataField.background
          }
          configComponentList.forEach(item => {
            if (ele.type === item.type) {
              useArr.push({
                ...item,
                rightConfigMessage: ele.dataField
              })
            }
          })
        })
        this.$refs.componentManageRef.smallPageName = data.name
        let arr = []
        let headerArr = []
        useArr.forEach(item => {
          if (item.type === 'shop_signs') {
            headerArr.push(item)
          } else {
            arr.push(item)
          }
        })
        this.HeaderComponent = headerArr // 头部组件
        this.currentUseComponents = arr // 其他组件
      }).catch(err => {
        this.currentUseComponents = []
        this.HeaderComponent = []
      })
    },
    // 获取模板详情
    getTemplateDetail () {
      this.$http({
        url: this.$http.adornUrl(`/platform/shopTemplate/info/${this.templateId}`),
        method: 'get'
      }).then(async({data}) => {
        let useArr = []
        if (this.pageType === 'edit') {
          this.dataForm = {
            name: data.name || '',
            remark: data.remark || '',
            imgUrl: data.image || ''
          }
        }
        if (this.pageType === 'add' && this.isTemplate === '0') {
          this.templateId = null
        }
        let contentArr = JSON.parse(data.content)
        // 匹配商品
        contentArr = await this.matchproducts(contentArr)
        contentArr.forEach(ele => {
          if (ele.type === 'page_background') { // 页面背景颜色
            this.pageBackgroundColor = ele.dataField.background
            this.$refs.componentManageRef.pageBackground = ele.dataField.background
          }
          configComponentList.forEach(item => {
            if (ele.type === item.type) {
              useArr.push({
                ...item,
                rightConfigMessage: ele.dataField
              })
            }
          })
        })
        // this.$refs.componentManageRef.smallPageName = data.name
        let arr = []
        let headerArr = []
        useArr.forEach(item => {
          if (item.type === 'shop_signs') {
            headerArr.push(item)
          } else {
            arr.push(item)
          }
        })
        this.HeaderComponent = headerArr // 头部组件
        this.currentUseComponents = arr // 其他组件
      }).catch(err => {
        this.currentUseComponents = []
        this.HeaderComponent = []
      })
    },
    // 匹配商品
    async matchproducts (arr) {
      let res = await this.searchGoodsMessage(arr) // 根据现有的id查询所有的商品信息
      let stores = await this.searchStoreMessage(arr) // 根据现有的店铺id查询所有的店铺信息
      arr.forEach(item => {
        if (item.type === 'goods_list') { // 商品列表 优惠团购
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        } else if (item.type === 'discount_coupon') {
          let discountParams = {
            name: 'prodName', // 商品名称
            status: 'status',
            price: 'activityPrice',
            imgs: 'pic',
            description: 'brief'  // 商品描述
          }
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id', discountParams)
        } else if (item.type === 'limited_skill') { // 秒杀商品
          let limitedParams = {
            name: 'prodName', // 商品名称
            status: 'status',
            price: 'activityPrice',
            imgs: 'pic',
            description: 'brief'  // 商品描述
          }
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'prodId', limitedParams)
        } else if (item.type === 'goods_module1') { // 商品模块1
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.centerConfig.goodsList = this.handleScreenGoods(item.dataField.centerConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goods_module2') { // 商品模块2
          item.dataField.maingoodsList = this.handleScreenGoods(item.dataField.maingoodsList, res, 'id')
          item.dataField.othergoodsList = this.handleScreenGoods(item.dataField.othergoodsList, res, 'id')
        } else if (item.type === 'goods_module3') { // 商品模块3
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goods_module4' || item.type === 'goods_module5') { // 商品模块4
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        } else if (item.type === 'store_list') { // 店铺列表
          item.dataField.storeList = this.handleScreenStrore(item.dataField.storeList, stores)
        }
      })
      return arr
    },
    // 查询商品信息
    searchGoodsMessage (arr) {
      let goodsArr = []
      arr.forEach(item => {
        if (item.type === 'limited_skill') { // 秒杀商品
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'discount_coupon') { // 优惠团购
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_list') { // 商品信息
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module1') { // 商品模块1
          item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.centerConfig && item.dataField.centerConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module2') { // 商品模块2
          item.dataField.maingoodsList && item.dataField.maingoodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.othergoodsList && item.dataField.othergoodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module3') { // 商品模块3
          item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module4') { // 商品模块4
          item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module5') { // 商品模块5
          item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        }
      })
      goodsArr = Array.from(new Set(goodsArr))
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/platform/search/prod/renovationPage'),
          method: 'get',
          params: this.$http.adornParams({
            prodIds: goodsArr,
            current: 1,
            size: goodsArr.length,
            getDelete: true
          })
        }).then(({data}) => {
          resolve(data.records)
        })
      })
    },
    // 查询店铺信息
    searchStoreMessage (arr) {
      let storeArr = []
      arr.forEach(item => {
        if (item.type === 'store_list') {
          item.dataField.storeList.forEach(v => {
            storeArr.push(v.shopId)
          })
        }
      })
      storeArr = Array.from(new Set(storeArr))
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/platform/shopDetail/searchShops'),
          method: 'get',
          params: this.$http.adornParams({
            shopIds: storeArr,
            current: 1,
            size: storeArr.length
          })
        }).then(res => {
          resolve(res.data.records)
        })
      })
    },
    // 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
    handleScreenGoods (currentArr, backReturnArr, type, otherParams) {
      let params = {}
      if (otherParams) {
        params = {
          ...otherParams
        }
      } else {
        params = {
          name: 'prodName', // 商品名称
          status: 'status', // 商品状态
          price: 'price', // 商品价格
          imgs: 'pic', // 商品图片
          description: 'brief'  // 商品描述
        }
      }
      let arr = []
      for (let i = 0; i < currentArr.length; i++) {
        for (let j = 0; j < backReturnArr.length; j++) {
          if (currentArr[i][type] == backReturnArr[j].prodId) {
            for (let key in params) {
              currentArr[i][key] = backReturnArr[j][params[key]]
            }
            currentArr[i].price == null ? currentArr[i].price = backReturnArr[j].price : ''
            currentArr[i].orignPrice ? currentArr[i].orignPrice = backReturnArr[j].oriPrice : ''
            currentArr[i].prodType ? currentArr[i].prodType = backReturnArr[j].prodType : ''
            arr.push(currentArr[i])
          }
        }
      }
      return arr
    },
    // 筛选店铺信息
    handleScreenStrore (currentArr, backReturnArr) {
      let storeParams = {
        shopLogo: 'shopLogo',
        imgs: 'shopLogo',
        shopName: 'shopName',
        shopStatus: 'shopStatus',
        type: 'type',
        fansCount: 'fansCount',
        shopFocusNumber: 'fansCount'
      }
      let arr = []
      for (let i = 0; i < currentArr.length; i++) {
        for (let j = 0; j < backReturnArr.length; j++) {
          if (currentArr[i].shopId === backReturnArr[j].shopId) {
            for (let key in storeParams) {
              currentArr[i][key] = backReturnArr[j][storeParams[key]]
            }
            arr.push(currentArr[i])
          }
        }
      }
      return arr
    },
    // 添加组件
    addComponent (item) {
      // 判断当前配置的组件是否已经有头部组件
      let isUse = this.HeaderComponent.findIndex(v => v.type === 'shop_signs')
      if (item.type === 'shop_signs' && isUse != -1) {
        return this.$message.warning(this.$t('pcdecorate.componentTitle.businessSignsTip1'))
      }
      if (item.type === 'shop_signs') {
        item.rightConfigMessage = {
          showLogo: 0,
          showCategory: 0,
          showSearch: 0,
          showNavs: 0,
          navList: [],
          bgUrl: ''
        }
      }
      this.operationType = 'add' // 当前是添加组件
      const scrollBox = document.getElementById('scrollbar')
      this.scrollTopHeight = scrollBox.scrollTop // 当前滚动的高度
      // 拿到当前页面已经拼接的所有组件
      let allCurrentUseComponents = this.currentUseComponents
      let HeaderComponent = this.HeaderComponent
      if (item.type != 'shop_signs') {
        allCurrentUseComponents.push(item)
      } else {
        HeaderComponent.push(item)
      }
      setTimeout(() => {
        let arr = []
        allCurrentUseComponents.forEach(item => {
          arr.push(item)
        })
        this.currentUseComponents = [...arr] // 其他组件
        this.HeaderComponent = [...HeaderComponent] // 头部组件
      }, 5)
    },
    // 当拖拽结束后产生新的列表触发
    sortInput (newList) {
      if (this.startX != this.endX && this.startY != this.endY) {
        // 如果在移动的过程中，招牌不在第二个，给一个提示
        for (let i = 0; i < newList.length; i++) {
          if (newList[i].type === 'shop_signs') {
            if (newList[0].type != 'shop_signs') {
              this.$message.warning(this.$t('pcdecorate.componentTitle.businessSignsTip2'))
            }
          }
        }
      }
      // 始终保证招牌在顶部
      let arr = []
      let HeaderComponent = []
      newList.forEach(item => {
        if (item.type === 'shop_signs') {
          HeaderComponent.push(item)
        } else {
          arr.push(item)
        }
      })
      this.currentUseComponents = [...arr]
      // 滑动之后选择当前的
      setTimeout(() => {
        this.currentUseComponents.forEach((item, index) => {
          if (this.currentIndex == index) {
            this.isRightShow = true  // 显示右边配置信息
            this.isshowComponentManage = false // 右边组件管理隐藏
            this.storeHeaderStatus = false // 头部组件配置信息隐藏
            this.configMessage = {
              currentConfigTitle: item.rightConfigTitle,
              type: 'basic_component',
              currentConfigType: item.type,
              Ref: item.Ref + index,
              config: item.rightConfigMessage
            }
          }
        })
      }, 500)
    },
    // 当拖拽开始触发
    sortStart (e) {
      // this.startX = e.event.x
      // this.startY = e.event.y
      // this.nodeOffsetTop = e.node.offsetTop
      // document.getElementsByClassName('draggerStyles')[0].style.top = (e.node.offsetTop + 50) + 'px'
    },
    // 当拖拽时鼠标移动时触发
    sortMove (e) {
      this.isRightShow = false // 右边配置信息隐藏
      this.isMoveIng = true
    },
    // 当拖拽结束时触发
    sortEnd (val) {
      this.currentIndex = val.newIndex // 新的下标
      this.endX = val.event.x
      this.endY = val.event.y
    },
    // 点击当前某个组件
    clickComponent (item, index) {
      if (this.startX === this.endX && this.startY === this.endY) {
        this.isRightShow = true  // 显示右边配置信息
        this.isshowComponentManage = false // 右边组件管理隐藏
        this.storeHeaderStatus = false // 头部组件信息不展示
        this.currentIndex = index // 当前选中的组件
        this.configMessage = {
          currentConfigTitle: item.rightConfigTitle,
          type: 'basic_component',
          currentConfigType: item.type,
          Ref: item.Ref + index,
          config: item.rightConfigMessage
        }
      } else {
        // console.log('拖拽')
      }
    },
    // 获取当前页面的宽度
    getCurrentPageWidth () {
      this.setPageScale()
    },
    // 根据页面不同的宽度，对页面进行等比例缩放
    setPageScale () {
      this.windowWidth = document.body.clientWidth
      this.windowHeight = document.body.clientHeight
      this.pageWidth = this.$refs.designEditor && this.$refs.designEditor.clientWidth
      let width = this.pageWidth
      if (this.windowWidth > 1400) {
        let scales = width / 1400
        scales > 1 ? scales = 1 : scales
        this.scaleFun.width = '100%'
        this.scaleFun = {
          // 'transform': 'scale(' + scales + ')',
          'transform-origin': 'left top',
          'width': '100%',
          'height': (this.windowHeight / this.windowWidth) / width + 'px'
        }
        // this.$refs.designEditor.style['overflow-x'] = 'hidden'
        // this.$refs.designEditor.style['overflow-y'] = 'auto'
      } else {
        this.scaleFun = {
          'width': '100%',
          'transform-origin': 'left top',
          // 'transform': 'scale(' + (1100 / 1400) + ')',
          'height': '100%'
        }
        this.$refs.designEditor.style.overflow = 'auto'
      }
    },
    // 头部验证
    handleValidateHeader () {
      let arr = []
      this.HeaderComponent.forEach((item, index) => {
        if (this.$refs[item.Ref + index]) {
          arr.push(this.$refs[item.Ref + index][0].handleValidate())
        }
      })
      return arr
    },
    beforeSave () {
      let arr = [] // 其他组件信息
      let HeaderArr = [] // 头部组件信息
      const isValidateArr = this.$refs.rightConfigForm.handleChangeValidate()
      // 验证页面标题
      // if (this.$refs.componentManageRef.smallPageName === '') {
      //   return this.$message.warning(this.$i18n.t('pcdecorate.componentTitle.pageTitle'))
      // }
      // 验证头部组件信息
      let isValidateHeaderArr = this.handleValidateHeader()
      // if (isValidateArr.length > 0 || isValidateHeaderArr.length > 0) { // 判断验证情况
      let indexs = isValidateArr.findIndex(item => item.status === false)
      let headerIndex = isValidateHeaderArr.findIndex(item => item.status === false)
      if (indexs !== -1) { // 各个组件的信息提示
        return this.$message.warning(`${isValidateArr[indexs].message}`)
      }
      if (headerIndex !== -1) { // 头部信息提示
        return this.$message.warning(`${isValidateHeaderArr[headerIndex].message}`)
      }
      // 其他组件信息
      this.currentUseComponents.forEach(item => {
        arr.push({
          type: item.type, // 当前组件的类型
          dataField: {
            ...item.rightConfigMessage
          }
        })
      })
      // 头部组件信息
      this.HeaderComponent.forEach(item => {
        HeaderArr.push({
          type: item.type, // 当前组件的类型
          dataField: {
            ...item.rightConfigMessage
          }
        })
      })
      let pageParams = [{
        type: 'page_background',
        dataField: {
          background: this.pageBackgroundColor
        }
      }]
      // 调用配置保存的接口
      return [...HeaderArr, ...arr, ...pageParams]
    },
    // 保存
    handleSave (type) {
      // let arr = [] // 其他组件信息
      // let HeaderArr = [] // 头部组件信息
      let finallArr = [] // 所有组件信息
      const isValidateArr = this.$refs.rightConfigForm.handleChangeValidate()
      // 验证页面标题
      if (this.$refs.componentManageRef.smallPageName === '') { // 页面标题不能为空
        return this.$message.warning(this.$i18n.t('pcdecorate.componentTitle.pageTitle'))
      }
      // 验证头部组件信息
      let isValidateHeaderArr = this.handleValidateHeader()
      // 验证各个组件的必填
      if (isValidateArr.length > 0 || isValidateHeaderArr.length > 0) { // 判断验证情况
        finallArr = this.beforeSave()
        // console.log('提交的参数', finallArr)
        // 调用配置保存的接口
        let params = {
          content: JSON.stringify(finallArr), // 配置内容
          name: this.$refs.componentManageRef.smallPageName, // 页面名称
          renovationType: 1, // 装修类型
          renovationId: this.renovationId // 装修店铺id
        }
        let url = ''
        let method = ''
        let tips = ''
        if (this.renovationId) {
          url = this.$http.adornUrl('/platform/shopRenovation/operate/updatePC')
          method = 'put'
          tips = this.$t('shopFeature.edit.saveSuccess')
        } else {
          url = this.$http.adornUrl('/platform/shopRenovation/savePC')
          method = 'post'
          tips = this.$t('shopFeature.edit.saveSuccess')
        }
        if (type === '1') {
          this.saveLoading = true
        }
        this.$http({
          url: url,
          method: method,
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (!this.renovationId) {
            this.renovationId = data
          }
          this.$message.success(tips)
          this.saveLoading = false
          if (type === '1') { // 当用户点击保存的时候才让他跳转到列表页
            this.$router.push({
              path: '/platform-feature/list/index'
            })
          }
        }).catch(err => {
          this.saveLoading = false
        })
      } else {
        this.$message.warning(this.$t('pcdecorate.componentTitle.componentTip'))
      }
    },
    // 保存模板
    handleSaveTemplate (dataForm) {
      let finallArr = [] // 所有组件信息
      const isValidateArr = this.$refs.rightConfigForm.handleChangeValidate()
      // 验证页面标题
      // if (this.$refs.componentManageRef.smallPageName === '') {
      //   return this.$message.warning(this.$i18n.t('pcdecorate.componentTitle.pageTitle'))
      // }
      // 验证头部组件信息
      let isValidateHeaderArr = this.handleValidateHeader()
      if (isValidateArr.length > 0 || isValidateHeaderArr.length > 0) { // 判断验证情况
        // 调用配置保存的接口
        // finallArr = [...HeaderArr, ...arr, ...pageParams]
        finallArr = this.beforeSave()
        // console.log('提交的参数', finallArr)
        let params = {
          remark: dataForm.remark,
          image: dataForm.imgUrl,
          content: JSON.stringify(finallArr), // 配置内容
          name: dataForm.name, // 模板名称
          type: 1, // 装修类型
          // shopId: this.renovationId // 装修店铺id
          templateId: this.templateId ? this.templateId : null
        }
        let url = ''
        let method = ''
        let tips = ''
        if (this.templateId) {
          url = this.$http.adornUrl('/platform/shopTemplate/updatePC')
          method = 'put'
          tips = this.$t('shopFeature.edit.saveSuccess')
        } else {
          url = this.$http.adornUrl('/platform/shopTemplate/savePC')
          method = 'post'
          tips = this.$t('shopFeature.edit.saveSuccess')
        }
        // if (type === '1') {
        this.saveLoading = true
        // }
        this.$http({
          url: url,
          method: method,
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (!this.templateId) {
            this.templateId = data
          }
          this.$message.success(tips)
          this.saveLoading = false
          // if (type === '1') {
          //   this.$router.push({ // 当用户点击保存的时候才让他跳转到列表页
          //     path: '/shop-feature/list/index'
          //   })
          // }
        }).catch(err => {
          this.saveLoading = false
        })
      } else {
        this.$message.warning(this.$t('pcdecorate.componentTitle.componentTip'))
      }
    },
    // 移除组件
    handleCloseRemoveComponent (type, item, ref, index) {
      if (type === '1') { // 取消
        this.$refs[ref][0].showPopper = false
      } else if (type === '2') { // 确定
        this.currentUseComponents.splice(index, 1) // 将当前组件进行删除
        this.isRightShow = false // 右边配置信息不显示
      }
    },
    // 右边配置信息的改变
    handleUpdateMessage (obj) {
      let arr = []
      arr = JSON.parse(JSON.stringify(this.currentUseComponents))
      arr.forEach((item, index) => {
        if (item.type === 'picture_by') { // 图片轮播
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'auxiliary_interval') { // 辅助间隔
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'floor_title') { // 楼层标题
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_list') { // 商品列表
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'universal_hotspot') { // 万能热区
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'store_list') { // 店铺列表
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'limited_skill') { // 限时秒杀
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'discount_coupon') { // 优惠团购
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_module1') { // 商品模块1
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_module2') { // 商品模块2
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_module3') { // 商品模块3
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_module4') { // 商品模块4
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        } else if (item.type === 'goods_module5') { // 商品模块5
          if (item.Ref + index === obj.ref) {
            item.rightConfigMessage = {...obj.config}
          }
        }
      })
      this.currentUseComponents = JSON.parse(JSON.stringify(arr))
    },
    // 点击组件管理
    handleClickComponent () {
      this.isshowComponentManage = !this.isshowComponentManage
      this.isRightShow = false  // 隐藏右边配置信息
      this.storeHeaderStatus = false // 头部组件隐藏
      this.currentIndex = '' // 当前选中的组件
    },
    // 组件管理组件排序
    handleSortComponent (newArr) {
      let arr = []
      arr = JSON.parse(JSON.stringify(newArr))
      this.currentUseComponents = []
      this.currentUseComponents = arr
    },
    // 删除单个组件
    handleSingleRemove (index) {
      this.currentUseComponents.splice(index, 1)
    },
    // 组件管理
    handlePageColor (color) {
      this.pageBackgroundColor = color
    },
    // 清空组件
    handleRemoveComponnent () {
      this.currentUseComponents = []
      this.HeaderComponent = []
    },
    // 头部组件删除
    handleHeaderDel (index) {
      this.HeaderComponent = []
    },
    // 头部组件点击
    handleHeaderClick (item, index) {
      this.currentIndex = '-1'
      this.storeHeaderStatus = true
      this.isshowComponentManage = false
      this.isRightShow = false
      this.configMessage = {
        currentConfigTitle: item.rightConfigTitle,
        type: 'basic_component',
        currentConfigType: item.type,
        Ref: item.Ref + index,
        config: item.rightConfigMessage
      }
    },
    // 头部信息组件改变
    handleHeaderMessage (item) {
      this.HeaderComponent.forEach((v, index) => {
        if (v.Ref + index === item.ref) {
          v.rightConfigMessage = {...item.config}
        }
      })
    },
    // 头部删除 | 取消
    handleCloseRemoveHeader (index) {
      if (index === '1') { // 取消
        this.$refs.headerPopRef[0].showPopper = false
      } else if (index === '2') { // 删除确定
        this.HeaderComponent = []
        this.storeHeaderStatus = false
      }
    }
  },
  watch: {
    sidebarFold (val) { // 监听侧边栏展示隐藏来展示右边内容缩放比例
      setTimeout(() => {
        this.pageWidth = this.$refs.designEditor && this.$refs.designEditor.clientWidth
        this.setPageScale()
      }, 500)
    },
    windowWidth (val) {
      this.setPageScale()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './edit.scss';
</style>
<style lang="scss">
.component-items.draggerStyles {
  background:#fff;
  box-sizing: border-box;
  border: 1px solid #155bd4;
  z-index: 99;
  left: 0!important;
  .component-close-x {
    display: none;
  }
}
.title-config-message {
  .el-input__inner {
    height: 28px;
  }
}

</style>