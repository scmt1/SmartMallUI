<template>
  <div class="micro-create">
    <decorate-navbar ref="decorateNavbar"
    @handleSave="save" @view="view"
    v-show="currentOperationType!='detail'"
    :isTemplate="isTemplate"
    :dataFormL="dataForm"
    @handleSaveTemplate="handleSaveTemplate"
    @handleClickComponent="handleClickComponent" />

    <div class="micro-box-content" :style="{backgroundColor:setOther.bgColor}">
      <div class="design-page">
        <div class="design-page-content">
          <!-- 左侧所有装修组件 -->
          <div v-show="currentOperationType!='detail'" class="all-use-components" :class="{'border-left': !sidebarFold}">
            <!--所有可以选择的组件-->
            <allCanUseComponents
              :is-show-all-components="isShowAllComponents"
              :hide-these-components="hideTheseComponents"
              :show-these-components="showTheseComponents"
              @addComponent="addComponent"
              @retAllCanUseComponents="allCanUseComponents"
            />
            <!--end 所有可以选择的组件-->
          </div>
          <!-- 界面预览 -->
          <div id="scrollbar" class="design-editor" :class="currentOperationType === 'detail' ? 'view-class' : ''">
            <div ref="designBox" class="design-box">
              <div ref="designPreview" class="design-preview">
                <div v-if="componentLists.length" ref="Preview" class="item-list">
                  <!--头部-->
                  <div
                    v-for="(item,index) in configComponents"
                    id="headBox"
                    :key="index"
                    class="preview-item"
                    :index="index"
                    @click.stop="clickComponent(item,index,1)"
                  >
                    <div
                      :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                      :current="index"
                      :is-show-edit="currentEditConfigComponentsShow === index&&configComponentsShow"
                      :index-key="item.type+'_'+index"
                      :data-field="item.dataField || {}"
                      :current-component="item"
                      :is-check-my-self="item.isCheckMySelf"
                      :is-start-check-field-rules="isStartCheckFieldRules"
                      @myCheckResult="everyComponentsCheckResultFun"
                      @componentsValueChance="componentsValueChanceFromConfig"
                      @save="save"></div>
                  </div>
                  <!--组价-->
                    <SlickList
                      v-model="currentUseComponents"
                      :use-drag-handle="true"
                      lockAxis="y"
                      :pressDelay="500"
                      class="slickList-scroll"
                      @input="sortInput"
                      @sort-start="sortStart"
                      @sort-move="sortMove"
                      @sort-end="sortEnd"
                    >
                      <SlickItem
                        v-for="(item,index) in currentUseComponents"
                        :id="'previewItem_'+index"
                        :key="item.id"
                        :class="['preview-box',{isMoveIng:isMoveIng}]"
                        :index="index"
                      >
                        <div class="preview-item" @click.stop="clickComponent(item,index)">
                          <div
                            :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                            :current="index"
                            :currentUseComponents="currentUseComponents"
                            :is-show-edit="currentEditComponent === index&&isShowEdit"
                            :index-key="item.type+'_'+index"
                            :data-field="item.dataField || {}"
                            :current-component="item"
                            :is-check-my-self="item.isCheckMySelf"
                            :is-start-check-field-rules="isStartCheckFieldRules"
                            @topFixed="topFixed"
                            @myCheckResult="everyComponentsCheckResultFun"
                            @componentsValueChance="componentsValueChance"
                            @save="save"></div>
                          <!--边框、删除、添加-->
                          <div
                            v-if="currentOperationType!='detail'"
                            :style="{borderColor:setOther.viewTheme,borderStyle:'solid'}"
                            class="preview-item-border design-hide-class"
                            :class="currentEditComponent === index ? 'show':''"
                          >
                            <div v-handle class="drag-box" :style="{cursor:setOther.dragCursor}"/>
                            <!-- <el-popover
                              :ref="'pop_'+index"
                              placement="left"
                              width="200"
                              trigger="click"
                            >
                              <p style="word-break: break-word">{{$t('shopFeature.edit.deleteConfirm')}}</p>
                              <div style="text-align: right; margin: 10px 0 0">
                                <div
                                  class="default-btn"
                                  @click="popBtn(1, item,'pop_'+index,index)"
                                >{{$t('shopFeature.edit.cancel')}}
                                </div>
                                <div
                                  class="default-btn primary-btn"
                                  @click="popBtn(2, item,'pop_'+index,index)"
                                >{{$t('shopFeature.edit.confirm')}}
                                </div>
                              </div>
                              <span
                                v-show="!item.isHeader&&isShowClose"
                                slot="reference"
                                :style="{background:setOther.viewTheme}"
                                class="close-item"
                              >x</span>
                            </el-popover> -->
                            <!-- <span
                              v-show="isShowPushAdd"
                              :id="'appendTopBtn_'+index"
                              :ref="'appendTopBtn_'+index"
                              :style="{background:setOther.viewTheme}"
                              class="circle-plus-top"
                              @click.stop="appendComponents('top',index,'appendTopBtn_'+index,item)"
                            >+</span>
                            <span
                              v-show="isShowPushAdd"
                              :id="'appendBottomBtn_'+index"
                              :ref="'appendBottomBtn_'+index"
                              :style="{background:setOther.viewTheme}"
                              class="circle-plus-bottom"
                              @click.stop="appendComponents('bottom',index,'appendBottomBtn_'+index,item)"
                            >+</span> -->
                            <!--左边的小部件-->
                            <!-- <div class="eVue-widget">
                              <div class="widget-name">
                                <span class="widget-arrow-out"/>
                                <div class="component-name">{{ componentLists.find(x=>x.type === item.type) ?
                                  componentLists.find(x=>x.type === item.type).title : '' }} {{ index }}
                                </div>
                              </div>
                            </div> -->
                          </div>
                          <!--边框、删除、添加-->
                        </div>
                      </SlickItem>
                    </SlickList>
                  <!--插入-->
                  <div v-if="isShowEditorAllComponents" class="design-editor-item append-component-box">
                    <div class="design-config-editor">
                      <allCanUseComponents
                        :hide-these-components="hideTheseComponents"
                        @addComponent="addComponent"
                        @retAllCanUseComponents="allCanUseComponents"
                      />
                    </div>
                  </div>
                  <!--插入-->
                </div>
              </div>
            </div>
            <!--右侧管理列表-->
            <div class="preview-wrap" v-if="currentOperationType!='detail'">
              <div
                class="preview-wrap-item"
                :style="setOther.componentOperation ? 'background-color:'+setOther.viewTheme+';color:#fff;' : ''"
                @click="setOther.componentOperation = true"
              >
                <i class="el-icon-coin"/>{{$t('shopFeature.edit.componentManagement')}}
              </div>
            </div>
          </div>
           <!-- 组件管理 -->
          <div v-if="setOther.componentOperation" class="design-editor-item">
            <div class="design-config-editor">
              <div class="design-editor-component-title">
                {{$t('shopFeature.edit.componentManagement')}}
              </div>
              <div class="components-list-edit">
                <p class="clear-current-component" :style="[{color:setOther.viewTheme}]">
                  <span>{{$t('shopFeature.edit.componentSorting')}}</span>
                  <span
                    @click="currentUseComponents = []"
                  >{{$t('shopFeature.edit.removeAll')}}</span>
                </p>
                <SlickList
                  v-model="currentUseComponents"
                  :use-drag-handle="true"
                  axis="y"
                  @input="componentsSortInput"
                  helperClass="drag-class"
                >
                  <SlickItem
                    v-for="(item,index) in currentUseComponents"
                    :key="index"
                    class="components-list-edit-item"
                    :index="index"
                  >
                    <div v-handle class="drag-box">
                      {{ componentLists.find(x=>x.type === item.type) ?
                      componentLists.find(x=>x.type === item.type).title : '' }} <em>{{ index }}</em>
                    </div>
                    <div class="drag-box-icon">
                      <i :title="$i18n.t('shopFeature.edit.removeComponent')" class="el-icon-delete" @click="popBtn(2, item,'pop_'+index,index)"/>
                    </div>
                  </SlickItem>
                </SlickList>

                <div class="empty-template" v-if="currentUseComponents.length === 0">{{$t('shopFeature.edit.emptyTemplate')}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--保存按钮-->
        <!-- <div v-if="currentOperationType!='detail'" class="save-data" :style="{width: sidebarFold ? 'calc(100% - 100px)' : 'calc(100% - 230px)'}">
          <div class="inner">
            <div
              v-if="isShowSaveBtn_1"
              :loading="isSaving"
              :disabled="isSaving"
              class="default-btn primary-btn"
              @click="save(1)"
            >
              {{ saveBtn_title_1 }}
            </div>
            <div
              v-if="isShowSaveBtn_2"
              :loading="isSaving2"
              :disabled="isSaving2"
              @click="save(2)"
              class="default-btn"
              plain>{{saveBtn_title_2}}
            </div>
            <div
              class="default-btn"
              @click="backToList"
              plain>{{$t('shopFeature.edit.back')}}
            </div>
          </div>
        </div> -->
      </div>

      <!--配置弹窗-->
      <!-- <right-panel>
        <div class="drawer-container">
          <div>
            <h3 class="drawer-title">系统配置</h3>
            <div class="drawer-item">
              <span>背景颜色</span>
              <el-color-picker v-model="setOther.bgColor"></el-color-picker>
            </div>
            <div class="drawer-item">
              <span>预览区主题</span>
              <el-color-picker v-model="setOther.viewTheme"></el-color-picker>
            </div>
          </div>
        </div>
      </right-panel> -->
    </div>
  </div>
</template>
<script>
import i18n from '../../../../../../../src/i18n/i18n'
import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort'
import allCanUseComponents from './components/all-can-use-components/index.vue'
import RightPanel from '../RightPanel/index.vue'
// 顶边栏
import decorateNavbar from './decorate-navbar.vue'
// mock 数据
// import {detail} from '@/api/feature';

/**
 * 作为组件时传入说明
 *  props 解析看下文
 *  currentConfigComponents  默认配置顶部项的组件  默认为config组件
 *  currentUseComponents 正在预览区的组件  默认 []
 * */
export default {
  name: 'micro-create',
  directives: {handle: HandleDirective},
  props: {
    isShowPushAdd: {// 是否显示插入的模式
      type: Boolean,
      default: true
    },
    isShowClose: {// 是否关闭的模式
      type: Boolean,
      default: true
    },
    hideTheseComponents: {// 隐藏这些组件 结构如：[{type: 'config',isHide:true}]
      type: Array,
      default: () => []
    },
    showTheseComponents: {// 显示这些组件 结构如：[{type: 'config',isHide:true}]
      type: Array,
      default: () => []
    },
    isShowAllComponents: {// 是否隐藏所有组件
      type: Boolean,
      default: true
    },
    saveBtn_title_1: { // 按钮1的文本
      type: String,
      default: i18n.t('shopFeature.edit.save')
    },
    saveBtn_title_2: { // 按钮2的文本
      type: String,
      default: i18n.t('shopFeature.edit.saveAndCon')
    },
    saveBtn_title_3: { // 按钮3的文本
      type: String,
      default: i18n.t('shopFeature.edit.moreOper')
    },
    isShowSaveBtn_1: {// 是否显示 上架 按扭
      type: Boolean,
      default: true
    },
    isShowSaveBtn_2: {// 是否显示 保存并继续 按扭
      type: Boolean,
      default: true
    },
    isShowSaveBtn_3: {// 是否显示 更多操作 按扭
      type: Boolean,
      default: true
    },
    // 是否需要返回最后保存的值，在当前页面被用作组件的时候可使用
    isNeedReturnSaveData: {
      type: Boolean,
      default: false
    },
    /** 配置顶部项的组件 */
    currentConfigComponents: {
      type: Array,
      default: () => [{type: 'config'}] // 配置项不能删除、排序
    },
    /** 其他的组件传过来只能使用的组件 */
    currentCanUseComponents: {
      type: Array,
      default: () => [] //
    },
    microId: { // 主要运用于其他的调用微页面组件获取详情使用，具体可参考：公告广告
      type: Number,
      default: null
    },
    microKeyWord: { // 微页面 主要运用于其他的调用微页面组件获取详情使用，具体可参考：微集合
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isSaving: false, // 是否正在保存
      isSaving2: false,
      isCheckMySelf: false, // 在规则判断不通过改变通知子组件
      isStartCheckFieldRules: false, // 是否开始校验所有组件的规则
      isMoveIng: false, // 是否正在移动
      isDrag: false, // 是否拖动了位置
      appendPosition: {
        index: '',
        position: 'bottom', // 默认底部
        theRefs: null
      }, // 插入组件的位置
      isShowEditorAllComponents: false, // 是否显示插入组件区域，永远与isShowEdit相反
      isShowEdit: false, // 是否显示组件的编辑区
      componentLists: [], // 所有可用的组件
      configComponentsShow: true,
      /** 正在编辑的组件 */
      currentEditConfigComponentsShow: 0,
      /** 正在编辑的组件 */
      currentEditComponent: 0,
      currentUseComponents: [],
      renovationId: this.$route.query.renovationId || null,
      templateId: this.$route.query.templateId || null,
      /** 配置顶部项的组件 */
      configComponents: [{type: 'config'}],

      // 所有每次校验的结果
      allCheckResult: [],
      saveType: 2, // 保存的类型=> 2保存 1上架 3更多操作

      scrollTopHeight: 0,
      // 设置
      setOther: {
        viewTheme: '#155BD4',
        bgColor: '#fff', // 背景
        dragCursor: 'all-scroll', // 显示的图标 all-scroll
        componentOperation: false// 是否操作组件
      },
      dontShowMessage: false,
      currentOperationType: '', // 当前操作类型

      isView: false, // 是否预览
      isTemplate: '0', // 是否为模板编辑
      dataForm: {
        name: '',
        remark: '',
        imgUrl: ''
      }, // 模板信息
      pageType: '',
      savePageType: '0' // 保存类型
    }
  },
  watch: {
    microId (val) {
      if (val) {
        this.id = val
        this.getInfo()
      }
    },
    // 通过微页面关键字获取详情
    microKeyWord (val) {
      if (val) {
        this.id = null
        this.currentUseComponents = []
        if (val !== 'productCatalog') {
          this.microKeyWord = 'other'
        }
        this.getInfo()
      }
    },
    currentUseComponents (val) {
      this.$nextTick(() => {
        this.$emit('currentUseComponentsChange', val)
      })
    }
  },
  components: {
    decorateNavbar,
    allCanUseComponents,
    SlickList,
    SlickItem,
    RightPanel
  },
  computed: {
    sidebarFold () {
      return this.$store.state.common.sidebarFold
    }
  },
  mounted () {
    // const renovationId = this.$route.query.renovationId
    // if (renovationId) {
    //   this.renovationId = renovationId
    //   this.getInfo()
    //   this.handleInit()
    // } else if (localStorage.getItem('viewContent')) {
    //   this.handleInit()
    //   this.viewContent(JSON.parse(localStorage.getItem('viewContent')))
    //   localStorage.removeItem('viewContent')
    // } else {
    //   this.configComponents = JSON.parse(JSON.stringify(this.currentConfigComponents))
    // }
    // this.$nextTick(() => {
    //   this.$store.commit('common/updateSidebarFold', true)
    // })
    this.isTemplate = this.$route.query.template
    const renovationId = this.$route.query.renovationId
    const templateId = this.$route.query.templateId
    this.pageType = this.$route.query.type
    this.handleInit()
    if (this.pageType === 'edit') {
      this.renovationId = renovationId
      this.templateId = templateId
      if (this.isTemplate === '0') {
        this.getInfo()
      } else {
        this.getTemplateDetail()
      }
    } else if (this.pageType === 'add' && templateId) {
      this.templateId = templateId
      this.getTemplateDetail()
    } else if (localStorage.getItem('viewContent')) {
      this.viewContent(JSON.parse(localStorage.getItem('viewContent')))
      localStorage.removeItem('viewContent')
    } else {
      this.configComponents = JSON.parse(JSON.stringify(this.currentConfigComponents))
    }
    if (this.pageType === 'detail' && renovationId) {
      this.getInfo()
    }
    this.$nextTick(() => {
      this.$store.commit('common/updateSidebarFold', true)
    })
  },
  activated () {
    if (this.$route.query.renovationId && this.$route.query.renovationId !== this.renovationId) {
      this.renovationId = this.$route.query.renovationId
      this.getInfo()
    }
  },
  deactivated () {
    this.configComponents = []
    this.configComponents = JSON.parse(JSON.stringify(this.currentConfigComponents))
  },
  methods: {
    handleInit () {
      if (this.$route.query.type === 'detail') {
        this.currentOperationType = 'detail'
      }
    },
    // 预览
    view () {
      this.allCheckResult = []
      this.isStartCheckFieldRules = !this.isStartCheckFieldRules// 开始校验
      this.isView = true
    },
    toView () {
      const $data = this.configComponents.concat(this.currentUseComponents)
      const par = {
        content: JSON.stringify($data),
        name: $data[0].dataField.title
      }
      localStorage.setItem('viewContent', JSON.stringify(par))
      let newPage = this.$router.resolve({
        path: '/platform-feature/create/edit/index',
        query: {
          type: 'detail'
        }
      })
      this.isView = false
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    // 组件管理
    handleClickComponent () {
      this.setOther.componentOperation = !this.setOther.componentOperation
      this.isShowEditorAllComponents = false
    },
    /** 关闭组件管理 */
    componentOperation () {
      this.setOther.componentOperation = false
    },
    /**
     * 获取所有可用的组件
     * */
    allCanUseComponents ($list) {
      if ($list) {
        this.componentLists = $list
      } else {
        this.$newMessage.success(i18n.t('shopFeature.edit.noneUseableCom'))
      }
    },
    /**
     *  添加组件
     *  */
    addComponent (item) {
      const scrollBox = document.getElementById('scrollbar')
      this.scrollTopHeight = scrollBox.scrollTop
      const allCurrentUseComponents = this.currentUseComponents
      const $par = {type: item.type, id: Math.floor(Math.random() * 10000000000)}
      const $appendPositionIndex = this.appendPosition.index
      if ($appendPositionIndex !== '') { // 插入模式
        const $in = this.appendPosition.position === 'top' ? $appendPositionIndex : $appendPositionIndex + 1
        allCurrentUseComponents.splice($in, 0, item)
        this.currentEditComponent = $in
      } else {
        allCurrentUseComponents.push($par)
        this.currentEditComponent = allCurrentUseComponents.length - 1
      }
      setTimeout(() => {
        // 重置插入位置为空
        this.$forceUpdate()
        this.currentUseComponents = allCurrentUseComponents
        this.appendPosition.index = ''
        this.reSetIsShowEdit()
        scrollBox.scrollTop = this.scrollTopHeight
        // console.log('this.scrollTopHeight===', this.scrollTopHeight);
      }, 5)
    },

    /**
     * 插入
     * */
    appendComponents ($position = 'bottom', $index, theRefs) {
      this.appendPosition = {
        index: $index,
        position: $position, // 默认底部
        theRefs: theRefs // 默认底部
      }
      this.reSetIsShowEdit(false)
    },
    /**
     * 重置isShowEdit
     * */
    reSetIsShowEdit ($is = true, isReSetOperation = true) {
      this.configComponentsShow = false
      this.isShowEdit = $is
      this.isShowEditorAllComponents = !this.isShowEdit
      if (isReSetOperation) {
        this.componentOperation()
      }
    },
    /**
     * 点击某个组件
     * $isConfigComponents =  1 时为顶部
     * */
    clickComponent ($item, $index, $isConfigComponents = 0) {
      if ($isConfigComponents === 1) {
        this.currentEditConfigComponentsShow = $index
        this.configComponentsShow = true
        this.isShowEdit = false
        this.isShowEditorAllComponents = false
      } else {
        this.currentEditComponent = $index
        this.reSetIsShowEdit()
      }
      this.componentOperation()
    },
    /**
     * 移除某个组件
     * */
    popBtn ($type, item, ref, index) {
      if ($type === 2) { // 确定
        const $currentUseComponents = this.currentUseComponents
        $currentUseComponents.splice(index, 1)
        this.currentUseComponents = []
        setTimeout(() => {
          this.currentUseComponents = $currentUseComponents
        }, 5)
      }
      this.$refs[ref][0].showPopper = false
      this.isShowEditorAllComponents = false
    },
    // 监听某个组件的变化
    componentsValueChanceFromConfig ($val) {
      if ($val) {
        this.configComponents[$val.current].dataField = $val.dataField
      }
    },
    componentsValueChance ($val) {
      if ($val) {
        this.currentUseComponents[$val.current].dataField = $val.dataField
      }
    },
    // 拖拽
    sortStart () {
      this.setOther.dragCursor = 'all-scroll'
      this.isMoveIng = true
    },
    // 拖动过程，改变鼠标样式
    sortMove () {
    },
    // 结束拖拽
    sortEnd (val) {
      // this.isDrag = (val.oldIndex !== val.newIndex)
      this.currentEditComponent = val.newIndex
      this.isMoveIng = false
    },
    // 拖拽之后的结果
    sortInput (val, isReSet = true) {
      if (this.isDrag) {
        this.currentUseComponents = []
        setTimeout(() => {
          this.currentUseComponents = val
        }, 5)
        this.appendPosition.index = ''
      }
      this.isDrag = false
      this.configComponentsShow = false
      this.reSetIsShowEdit(true, isReSet)
    },
    /** 右边组件的拖拽 */
    componentsSortInput (val) {
      this.isDrag = true
      this.sortInput(val, false)
    },
    componentsSorMove () {
      // console.log('右边组件的拖拽')
    },
    /**
     * 保存事件 先校验
     * @param {Number/String} $type 保存类型: 1保存后返回列表页;  2保存后留在编辑页
     * @param {Boolean} dontShowMessage 是否显示 "保存成功" 消息提示
     * */
    save ($type, dontShowMessage) {
      this.savePageType = '0'
      this.saveType = $type
      this.dontShowMessage = dontShowMessage
      this.allCheckResult = []
      this.isStartCheckFieldRules = !this.isStartCheckFieldRules// 开始校验
    },
    /**
     * 保存模板 先校验
     * @param {Boolean} dataForm 模板信息
     * */
    handleSaveTemplate (dataForm) {
      this.savePageType = '1'
      this.dataForm = dataForm
      // this.dontShowMessage = dontShowMessage
      this.allCheckResult = []
      this.isStartCheckFieldRules = !this.isStartCheckFieldRules// 开始校验
    },
    /** 所有的正在编辑的校验结果 */
    everyComponentsCheckResultFun (ev) {
      this.allCheckResult.push(ev.data)
      /** 统计当前所有正在使用组件的数量 */
      const currentUserAllComponentsList = this.currentUseComponents.length + this.configComponents.length
      // // console.log('--', currentUserAllComponentsList);
      if (this.allCheckResult.length === currentUserAllComponentsList) {
        // // console.log('已经获得所有的值', this.allCheckResult);
        const $allCheckResult = this.allCheckResult
        for (let i = 0; i < $allCheckResult.length; i++) {
          const cur = $allCheckResult[i]
          if (!cur.isPass) {
            let $type = 0
            if (cur.isHeader) { // 头部的验证规则不通过
              this.configComponents[cur.current]['isCheckMySelf'] = !this.configComponents[cur.current]['isCheckMySelf']
              $type = 1
            } else { // 底部的不通过
              this.currentUseComponents[cur.current]['isCheckMySelf'] = !this.currentUseComponents[cur.current]['isCheckMySelf']
            }
            this.clickComponent({}, cur.current, $type)
            this.isStartCheckFieldRules = false
            // 开始通知子组件开始提示用户 ，弹窗等。。。
            this.isCheckMySelf = !this.isCheckMySelf
            break
          }
          if (i === $allCheckResult.length - 1) { // 验证完成，可以保存了
            if (this.isView) {
              this.toView()
            } else {
              this.savePush()
            }
          }
        }
      }
    },
    // 验证完毕之后发布push
    savePush () {
      const $parameter = this.configComponents.concat(this.currentUseComponents)
      // // console.log($parameter);
      $parameter.map(re => { // 移除isCheckMySelf字段，不能上传数据库
        delete re['isCheckMySelf']
      })
      if (this.isNeedReturnSaveData) { // 返回最后保存的值  当前微页面被使用成组件时
        this.$emit('returnData',
          {
            typeDecs: this.saveType === 1 ? this.saveBtn_title_1 : this.saveType === 2 ? this.saveBtn_title_2 : this.saveBtn_title_3,
            type: this.saveType, // 按钮类型
            data: $parameter
          }
        )
        return
      }
      if (this.savePageType === '0') {
        this.saveData($parameter, this.saveType)
      } else {
        this.saveTemplateData($parameter, this.saveType)
      }
    },
    /** 保存到数据库 */
    async saveData ($data, saveType) {
      // saveType === 1 ? this.isSaving = true : this.isSaving2 = true
      const par = {
        content: JSON.stringify($data),
        name: $data[0].dataField.title || i18n.t('shopFeature.header.microTitle')
      }
      if (this.renovationId) {
        par['renovationId'] = this.renovationId
      }
      let url = ''
      let method = ''
      if (this.renovationId) {
        url = this.$http.adornUrl('/platform/shopRenovation/operate/updateMove')
        method = 'put'
      } else {
        url = this.$http.adornUrl('/platform/shopRenovation/saveMove')
        method = 'post'
      }
      this.$http({
        url: url,
        method: method,
        data: this.$http.adornData(par)
      }).then(({ data }) => {
        // saveType === 1 ? this.isSaving = false : this.isSaving2 = false
        if (!this.renovationId) {
          this.renovationId = data
        }
        if (!this.dontShowMessage) {
          this.$newMessage({
            message: i18n.t('shopFeature.edit.saveSuccess'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              // if (saveType !== 2) {
              //   this.$router.push({
              //     name: 'platform-feature/list/index',
              //     params: {
              //       activeName: 'mobile'
              //     }
              //   })
              // }
            }
          })
        } else {
          this.dontShowMessage = false
        }
      })
    },
    /** 保存模板到数据库 */
    async saveTemplateData ($data, saveType) {
      // saveType === 1 ? this.isSaving = true : this.isSaving2 = true
      const par = {
        content: JSON.stringify($data),
        remark: this.dataForm.remark,
        image: this.dataForm.imgUrl,
        name: this.dataForm.name, // 模板名称
        type: 2 // 装修类型
      }
      if (this.templateId) {
        par['templateId'] = this.templateId
      }
      let url = ''
      let method = ''
      if (this.templateId) {
        url = this.$http.adornUrl('/platform/shopTemplate/updateMove')
        method = 'put'
      } else {
        url = this.$http.adornUrl('/platform/shopTemplate/saveMove')
        method = 'post'
      }
      this.$http({
        url: url,
        method: method,
        data: this.$http.adornData(par)
      }).then(({ data }) => {
        // saveType === 1 ? this.isSaving = false : this.isSaving2 = false
        if (!this.templateId) {
          this.templateId = data
        }
        if (!this.dontShowMessage) {
          this.$newMessage({
            message: i18n.t('shopFeature.edit.saveSuccess'),
            type: 'success',
            duration: 1500
            // onClose: () => {
            //   if (saveType !== 2) {
            //     this.$router.push({
            //       name: 'shop-feature/list/index',
            //       params: {
            //         activeName: 'mobile'
            //       }
            //     })
            //   }
            // }
          })
        } else {
          this.dontShowMessage = false
        }
      })
    },
    async viewContent (data) {
      this.configComponents = []
      let par = {}
      if (this.microKeyWord) {
        par.keyword = this.microKeyWord
      }
      if (this.renovationId) {
        par.renovationId = this.renovationId
      }
      let detail = {
        keyword: 'other',
        pageData: data.content
      }
      if (this.microKeyWord === 'productCatalog') {
        detail = {
          keyword: 'productCatalog',
          pageData: data.content
        }
      }
      let $data = JSON.parse(detail.pageData)
      $data = await this.matchproducts($data)
      if ($data.length) {
        this.configComponents = []
        $data.map(re => {
          if (re.type.indexOf('config') !== -1) {
            this.configComponents.push(re)
          } else {
            this.currentUseComponents.push(re)
          }
        })
      }
    },
    /**
     * 获取详情
     */
    getInfo () {
      this.$http({
        url: this.$http.adornUrl('/platform/shopRenovation/info/' + this.renovationId),
        method: 'GET'
      }).then(async ({ data }) => { //
        this.configComponents = []
        let par = {}
        if (this.microKeyWord) {
          par.keyword = this.microKeyWord
        }
        if (this.renovationId) {
          par.renovationId = this.renovationId
        }
        let detail = {
          keyword: 'other',
          pageData: data.content
        }
        if (this.microKeyWord === 'productCatalog') {
          detail = {
            keyword: 'productCatalog',
            pageData: data.content
          }
        }
        let $data = JSON.parse(detail.pageData)
        $data = await this.matchproducts($data)
        if ($data.length) {
          this.configComponents = []
          $data.map(re => {
            re['id'] = Math.floor(Math.random() * 10000000000)
            if (re.type.indexOf('config') !== -1) {
              this.configComponents.push(re)
            } else {
              this.currentUseComponents.push(re)
            }
          })
        }
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 获取模板详情
    getTemplateDetail () {
      this.$http({
        url: this.$http.adornUrl('/platform/shopTemplate/info/' + this.templateId),
        method: 'GET'
      }).then(async({ data }) => {
        this.configComponents = []
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
        let par = {}
        if (this.microKeyWord) {
          par.keyword = this.microKeyWord
        }
        if (this.templateId) {
          par.templateId = this.templateId
        }
        let detail = {
          keyword: 'other',
          pageData: data.content
        }
        if (this.microKeyWord === 'productCatalog') {
          detail = {
            keyword: 'productCatalog',
            pageData: data.content
          }
        }
        let $data = JSON.parse(detail.pageData)
        $data = await this.matchproducts($data)
        if ($data.length) {
          this.configComponents = []
          $data.map(re => {
            re['id'] = Math.floor(Math.random() * 10000000000)
            if (re.type.indexOf('config') !== -1) {
              this.configComponents.push(re)
            } else {
              this.currentUseComponents.push(re)
            }
          })
        }
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 匹配商品
    async matchproducts (arr) {
      let res = await this.searchGoodsMessage(arr)
      arr.forEach(item => {
        if (item.type === 'goods') { // 商品列表
          let goodsParams = {
            prodName: 'prodName',
            status: 'status',
            price: 'price',
            pic: 'pic',
            brief: 'brief'
          }
          item.dataField.goods = this.handleScreenGoods(item.dataField.goods, res, 'prodId', goodsParams)
        } else if (item.type === 'promotionalActivities') { // 促销活动
          let promoParams = {
            prodName: 'prodName',
            prodType: 'prodType',
            status: 'status',
            price: 'activityPrice',
            pic: 'pic',
            brief: 'brief',
            oriPrice: 'price',
            activityPrice: 'activityPrice'
          }
          item.dataField.prodIds = this.handleScreenGoods(item.dataField.prodIds, res, 'prodId', promoParams)
        } else if (item.type === 'goodsModule1') { // 商品模块1
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') { // 商品模块3 4 5
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        } else if (item.type === 'hotGoods') { // 热销商品
          let goodsParams = {
            prodName: 'prodName',
            prodType: 'prodType',
            status: 'status',
            price: 'activityPrice',
            pic: 'pic',
            brief: 'brief',
            oriPrice: 'price',
          }
          item.dataField.goods = this.handleScreenGoods(item.dataField.goods, res, 'prodId', goodsParams)
        }
      })
      return arr
    },
    // 查询商品信息
    searchGoodsMessage (arr) {
      let goodsArr = []
      arr.forEach(item => {
        if (item.type === 'goods' || item.type === 'hotGoods') { // 商品信息
          item.dataField.goods.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'promotionalActivities') { // 促销和活动
          item.dataField.prodIds.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'goodsModule1') { // 商品模块1
          item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule3') { // 商品模块3
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule4') { // 商品模块4
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule5') { // 商品模块5
          item.dataField.goodsList.forEach(v => {
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
          prodType: 'prodType', // 商品类型
          status: 'status', // 商品状态
          price: 'price', // 商品价格
          imgs: 'pic', // 商品图片
          orignPrice: 'oriPrice', // 商品原价
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
            currentArr[i].orignPrice ? currentArr[i].orignPrice = backReturnArr[j].oriPrice : ''
            !currentArr[i].price ? currentArr[i].price = backReturnArr[j].price : ''
            arr.push(currentArr[i])
          }
        }
      }
      return arr
    },
    /**
     * 返回
     */
    backToList () {
      this.$router.push({
        name: 'platform-feature/list/index',
        params: {
          activeName: 'mobile'
        }
      })
    },
    topFixed () {
      this.currentEditComponent = 0
    }
  }
}
</script>

<style lang="scss">
@import './edit.scss';
</style>
