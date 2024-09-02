<template>
    <div class="micro-goodsTwo-box">
        <!-- 预览控制区 start -->
        <div class="design-preview-controller">
            <module-component :config="formData"></module-component>
        </div>
        <!-- 预览控制区 end -->
        <!-- 编辑工作区 start -->
        <div v-if="isShowEdit" class="design-editor-item design-hide-class">
            <div class="design-config-editor">
                <div class="design-editor-component-title">{{$t('pcdecorate.componentTitle.goodsModule2')}}</div>
                <div class="config-item">
                    <div class="title">{{$t('shopFeature.goodsModule.subTitTwo')}}</div>
                    <div class="bottom-edit">
                            <div 
                                :class="{'edit-item': true, 'active': currentActive === 1}" 
                                @click="handleSelect(1)"></div>
                            <div class="edit-item">
                                <div 
                                :class="{'edit-item-son': true, 'active': currentActive === 2}" 
                                @click="handleSelect(2)"></div>
                                <div 
                                :class="{'edit-item-son': true, 'active': currentActive === 3}" 
                                @click="handleSelect(3)"></div>
                            </div>
                    </div>
                </div>
                <div v-show="currentActive === 1">
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.goodsModule2.customTitle')}}</div>
                        <div class="bottom-config">
                            <el-input maxlength="6" v-model.trim="formData.leftConfig.mainTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.labelSubTit')}}</div>
                        <div class="bottom-config">
                            <el-input maxlength="12" v-model.trim="formData.leftConfig.subTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</div>
                        <div class="bottom-config">
                            <redirect-nav
                                :selectedLink="formData.leftConfig.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleLeftNavSelect"
                                @handleRemoveSelected="handleLeftRemoveSelected">
                            </redirect-nav>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.mainTileColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.leftConfig.mainTitleColor"
                                @handleChangeColor="handleLeftTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.leftConfig.subTitleColor"
                                :resetColor="'rgba(243, 52, 51, 1)'" 
                                @handleChangeColor="handleLeftSubColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.titleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.leftConfig.mainTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.leftConfig.subTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.imageAd.addPic')}}</div>
                        <div class="bottom-config">
                            <div class="add-img-container">
                                <div class="add-btn">
                                    <div v-if="formData.leftConfig.imgMessage.img === ''" class="add-items" @click="handleAddImg">
                                        <span>+</span>
                                        <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                                    </div>
                                    <el-image v-else :src="formData.leftConfig.imgMessage.img" fit="fill"></el-image>
                                    <i class="el-icon-error" @click="handleRemove" v-if="formData.leftConfig.imgMessage.img != ''"></i>
                                </div>
                                <div class="right-content">
                                    <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                                    <redirect-nav
                                        class="link-redirect"
                                        :selectedLink="formData.leftConfig.imgMessage.path.name"
                                        :placeholder="$t('pcdecorate.placeholder.link')"
                                        @handleNavSelect="handleLeftimgNavSelect"
                                        @handleRemoveSelected="handleLeftImgRemove">
                                    </redirect-nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="currentActive === 2">
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.goodsModule2.customTitle')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.topConfig.mainTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.labelSubTit')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.topConfig.subTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</div>
                        <div class="bottom-config">
                            <redirect-nav
                                :selectedLink="formData.topConfig.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleTopNavSelect"
                                @handleRemoveSelected="handleTopRemoveSelected">
                            </redirect-nav>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.mainTileColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.topConfig.mainTitleColor" 
                                @handleChangeColor="handleTopTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.topConfig.subTitleColor"
                                :resetColor="'rgba(97, 200, 180, 1)'" 
                                @handleChangeColor="handleTopSubColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.titleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.topConfig.mainTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.topConfig.subTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.imageAd.addPic')}}</div>
                        <div class="bottom-config">
                            <div class="add-img-container">
                                <div class="add-btn">
                                    <div v-if="formData.topConfig.imgMessage.img === ''" class="add-items" @click="handleAddImg">
                                        <span>+</span>
                                        <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                                    </div>
                                    <el-image v-else :src="formData.topConfig.imgMessage.img" fit="fill"></el-image>
                                    <i class="el-icon-error" @click="handleRemove" v-if="formData.topConfig.imgMessage.img != ''"></i>
                                </div>
                                <div class="right-content">
                                    <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                                    <redirect-nav
                                        class="link-redirect"
                                        :selectedLink="formData.topConfig.imgMessage.path.name"
                                        :placeholder="$t('pcdecorate.placeholder.link')"
                                        @handleNavSelect="handleTopimgNavSelect"
                                        @handleRemoveSelected="handleTopImgRemove">
                                    </redirect-nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="currentActive === 3">
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.goodsModule2.customTitle')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.bottomConfig.mainTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.labelSubTit')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.bottomConfig.subTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</div>
                        <div class="bottom-config">
                            <redirect-nav
                                :selectedLink="formData.bottomConfig.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleBottomNavSelect"
                                @handleRemoveSelected="handleBottomRemoveSelected">
                            </redirect-nav>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.mainTileColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.bottomConfig.mainTitleColor" 
                                @handleChangeColor="handleBottomTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.bottomConfig.subTitleColor"
                                :resetColor="'rgba(255, 110, 0, 1)'"  
                                @handleChangeColor="handleBottomSubColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.titleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.bottomConfig.mainTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.bottomConfig.subTitleSize" 
                            show-input>
                        </el-slider>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('shopFeature.imageAd.addPic')}}</div>
                        <div class="bottom-config">
                            <div class="add-img-container">
                                <div class="add-btn">
                                    <div v-if="formData.bottomConfig.imgMessage.img === ''" class="add-items" @click="handleAddImg">
                                        <span>+</span>
                                        <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                                    </div>
                                    <el-image v-else :src="formData.bottomConfig.imgMessage.img" fit="fill"></el-image>
                                    <i class="el-icon-error" @click="handleRemove" v-if="formData.bottomConfig.imgMessage.img != ''"></i>
                                </div>
                                <div class="right-content">
                                    <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                                    <redirect-nav
                                        class="link-redirect"
                                        :selectedLink="formData.bottomConfig.imgMessage.path.name"
                                        :placeholder="$t('pcdecorate.placeholder.link')"
                                        @handleNavSelect="handleBottomimgNavSelect"
                                        @handleRemoveSelected="handleBottomImgRemove">
                                    </redirect-nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑工作区 end -->
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :deviceType="'mobile'"
          :currentSelectType="currentSelectType"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
        <!-- 弹窗, 新增图片 start -->
        <elx-imgbox 
            ref="elxImgbox"
            @refreshPic="refreshPic"
            :maxSize="10"
            :imgSizeLimit="false">
        </elx-imgbox>
        <!-- 弹窗，新增图片 end -->
    </div>
</template>
<script>
import { microCreateMinis } from '../../minis'
import pickColorComponent from '../../../../../decorate/create/commonComponent/pickColor/index.vue'
import selectGoodsComponent from '../../../../../decorate/create/commonComponent/selectGoodsComponent/index.vue'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index.vue'
import moduleComponent from './module.vue'
import ElxImgbox from '@/components/elx-imgbox'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'
export default {
  components: {
    pickColorComponent,
    selectGoodsComponent,
    moduleComponent,
    redirectNav,
    ElxImgbox,
    decorateDialogSelect
  },
  mixins: [microCreateMinis],
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      currentActive: 1, // 当前激活的是哪个
      addLength: 2,
      formData: {
        leftConfig: {
          mainTitle: this.$t('shopFeature.goodsModule.mainTitCon'), // 自定义标题
          subTitle: this.$t('shopFeature.goodsModule.conTwo1'), // 自定义副标题
          path: { // 跳转路径
            name: '',
            link: '',
            type: ''
          },
          mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
          subTitleColor: 'rgba(243, 52, 51, 1)', // 副标题颜色
          mainTitleSize: 15, // 主标题文字大小
          subTitleSize: 12, // 副标题文字大小
          imgMessage: {
            img: '',
            path: {
              type: '', // 链接跳转类型
              link: '',
              name: ''
            }
          }
        },
        topConfig: {
          mainTitle: this.$t('shopFeature.goodsModule.mainTitCon'), // 自定义标题
          subTitle: this.$t('shopFeature.goodsModule.conTwo2'), // 自定义副标题
          path: { // 跳转路径
            name: '',
            link: '',
            type: ''
          },
          mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
          subTitleColor: 'rgba(97, 200, 180, 1)', // 副标题颜色
          mainTitleSize: 15, // 主标题文字大小
          subTitleSize: 12, // 副标题文字大小
          imgMessage: {
            img: '',
            path: {
              type: '', // 链接跳转类型
              link: '',
              name: ''
            }
          }
        },
        bottomConfig: {
          mainTitle: this.$t('shopFeature.goodsModule.mainTitCon'), // 自定义标题
          subTitle: this.$t('shopFeature.goodsModule.conTwo3'), // 自定义副标题
          path: { // 跳转路径
            name: '',
            link: '',
            type: ''
          },
          mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
          subTitleColor: 'rgba(255, 110, 0, 1)', // 副标题颜色
          mainTitleSize: 15, // 主标题文字大小
          subTitleSize: 12, // 副标题文字大小
          imgMessage: {
            img: '',
            path: {
              type: '', // 链接跳转类型
              link: '',
              name: ''
            }
          }
        }
      },
      dialogVisible: false, // 弹窗是否显示
      currentSelectType: [], // 当前类型
      currentOperation: '', // 当前操作类型
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  methods: {
        // 选中哪个
    handleSelect (index) {
      this.currentActive = index
    },
        // -------------- 左边配置信息 ---------------------------
        // 左边跳转链接选择
    handleLeftNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'immediaty' // 立即抢购
    },
        // 跳转链接删除
    handleLeftRemoveSelected () {
      this.formData.leftConfig.path.name = ''
      this.formData.leftConfig.path.link = ''
      this.formData.leftConfig.path.type = ''
    },
        // 标题文字颜色
    handleLeftTitleColor (color) {
      this.formData.leftConfig.mainTitleColor = color
    },
        // 副标题文字颜色
    handleLeftSubColor (color) {
      this.formData.leftConfig.subTitleColor = color
    },
        // 图片跳转
    handleLeftimgNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'addImg' // 添加图片
    },
        // 图片链接删除
    handleLeftImgRemove () {
      this.formData.leftConfig.imgMessage.path.type = ''
      this.formData.leftConfig.imgMessage.path.link = ''
      this.formData.leftConfig.imgMessage.path.name = ''
    },
        // ---------------------- 上边配置信息 -------------------
        // 立即抢购跳转链接选择
    handleTopNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'immediaty' // 立即抢购
    },
        // 删除立即抢购的链接
    handleTopRemoveSelected () {
      this.formData.topConfig.path.name = ''
      this.formData.topConfig.path.link = ''
      this.formData.topConfig.path.type = ''
    },
        // 标题的文字颜色
    handleTopTitleColor (color) {
      this.$set(this.formData.topConfig, 'mainTitleColor', color)
    },
        // 副标题的文字颜色
    handleTopSubColor (color) {
      this.$set(this.formData.topConfig, 'subTitleColor', color)
    },
        // 图片跳转链接
    handleTopimgNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'addImg' // 添加图片
    },
        // 图片链接删除
    handleTopImgRemove () {
      this.formData.topConfig.imgMessage.path.type = ''
      this.formData.topConfig.imgMessage.path.link = ''
      this.formData.topConfig.imgMessage.path.name = ''
    },
        // ----------------- 下边配置信息 -----------------
        // 立即抢购链接
    handleBottomNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'immediaty' // 立即抢购
    },
        // 立即抢购链接删除
    handleBottomRemoveSelected () {
      this.formData.bottomConfig.path.name = ''
      this.formData.bottomConfig.path.link = ''
      this.formData.bottomConfig.path.type = ''
    },
        // 标题的文字颜色
    handleBottomTitleColor (color) {
      this.$set(this.formData.bottomConfig, 'mainTitleColor', color)
    },
        // 副标题文字颜色
    handleBottomSubColor (color) {
      this.$set(this.formData.bottomConfig, 'subTitleColor', color)
    },
        // 图片链接跳转
    handleBottomimgNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentOperation = 'addImg' // 添加图片
    },
        // 图片链接删除
    handleBottomImgRemove () {
      this.formData.bottomConfig.imgMessage.path.type = ''
      this.formData.bottomConfig.imgMessage.path.link = ''
      this.formData.bottomConfig.imgMessage.path.name = ''
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({ type, value}) {
      if (type === '1') { // 当前选择的商品
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.leftConfig.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.leftConfig.path, 'type', '1')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '1')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.topConfig.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.topConfig.path, 'type', '1')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '1')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.bottomConfig.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.bottomConfig.path, 'type', '1')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.goodsItem.prodName)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.goodsItem.prodId)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '1')
          }
        }
      } else if (type === '2') { // 当前选择的是分类
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.categoryItem.label)
            this.$set(this.formData.leftConfig.path, 'link', value.categoryItem.data)
            this.$set(this.formData.leftConfig.path, 'type', '2')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.categoryItem.label)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.categoryItem.data)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '2')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.categoryItem.label)
            this.$set(this.formData.topConfig.path, 'link', value.categoryItem.data)
            this.$set(this.formData.topConfig.path, 'type', '2')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.categoryItem.label)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.categoryItem.data)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '2')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.categoryItem.label)
            this.$set(this.formData.bottomConfig.path, 'link', value.categoryItem.data)
            this.$set(this.formData.bottomConfig.path, 'type', '2')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.categoryItem.label)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.categoryItem.data)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '2')
          }
        }
      } else if (type === '3') { // 当前选择的是店铺
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.leftConfig.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.leftConfig.path, 'type', '3')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '3')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.topConfig.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.topConfig.path, 'type', '3')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '3')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.bottomConfig.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.bottomConfig.path, 'type', '3')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.storeItem.shopName)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.storeItem.shopId)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '3')
          }
        }
      } else if (type === '4') { // 当前选择的是页面
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.pageItem.title)
            this.$set(this.formData.leftConfig.path, 'link', value.pageItem.link)
            this.$set(this.formData.leftConfig.path, 'type', '4')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.pageItem.title)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.pageItem.link)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '4')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.pageItem.title)
            this.$set(this.formData.topConfig.path, 'link', value.pageItem.link)
            this.$set(this.formData.topConfig.path, 'type', '4')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.pageItem.title)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.pageItem.link)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '4')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.pageItem.title)
            this.$set(this.formData.bottomConfig.path, 'link', value.pageItem.link)
            this.$set(this.formData.bottomConfig.path, 'type', '4')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.pageItem.title)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.pageItem.link)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '4')
          }
        }
      } else if (type === '5') { // 当前选择的是微页面
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.leftConfig.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.leftConfig.path, 'type', '5')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '5')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.topConfig.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.topConfig.path, 'type', '5')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '5')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.bottomConfig.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.bottomConfig.path, 'type', '5')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.smallPageItem.name)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.smallPageItem.renovationId)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '5')
          }
        }
      } else if (type === '6') { // 当前选择的是自定义链接
        if (this.currentActive === 1) { // 左边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.leftConfig.path, 'name', value.customLink)
            this.$set(this.formData.leftConfig.path, 'link', value.customLink)
            this.$set(this.formData.leftConfig.path, 'type', '6')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.leftConfig.imgMessage.path, 'name', value.customLink)
            this.$set(this.formData.leftConfig.imgMessage.path, 'link', value.customLink)
            this.$set(this.formData.leftConfig.imgMessage.path, 'type', '6')
          }
        } else if (this.currentActive === 2) { // 上边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.topConfig.path, 'name', value.customLink)
            this.$set(this.formData.topConfig.path, 'link', value.customLink)
            this.$set(this.formData.topConfig.path, 'type', '6')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.topConfig.imgMessage.path, 'name', value.customLink)
            this.$set(this.formData.topConfig.imgMessage.path, 'link', value.customLink)
            this.$set(this.formData.topConfig.imgMessage.path, 'type', '6')
          }
        } else if (this.currentActive === 3) { // 下边配置
          if (this.currentOperation === 'immediaty') { // 立即抢购
            this.$set(this.formData.bottomConfig.path, 'name', value.customLink)
            this.$set(this.formData.bottomConfig.path, 'link', value.customLink)
            this.$set(this.formData.bottomConfig.path, 'type', '6')
          } else if (this.currentOperation === 'addImg') { // 添加图片
            this.$set(this.formData.bottomConfig.imgMessage.path, 'name', value.customLink)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'link', value.customLink)
            this.$set(this.formData.bottomConfig.imgMessage.path, 'type', '6')
          }
        }
      }
      this.dialogVisible = false
    },
        // 选择图片
    handleAddImg () {
      this.$refs.elxImgbox.init(1, 1)
    },
        // 选择图片后回调
    refreshPic (imagePath) {
      if (this.currentActive === 1) { // 左边配置
        this.$set(this.formData.leftConfig.imgMessage, 'img', this.resourcesUrl + imagePath)
      } else if (this.currentActive === 2) { // 上边的配置
        this.$set(this.formData.topConfig.imgMessage, 'img', this.resourcesUrl + imagePath)
      } else if (this.currentActive === 3) {
        this.$set(this.formData.bottomConfig.imgMessage, 'img', this.resourcesUrl + imagePath)
      }
    },
        // 删除图片
    handleRemove () {
      if (this.currentActive === 1) { // 左边配置
        this.$set(this.formData.leftConfig.imgMessage, 'img', '')
      } else if (this.currentActive === 2) { // 上边的配置
        this.$set(this.formData.topConfig.imgMessage, 'img', '')
      } else if (this.currentActive === 3) {
        this.$set(this.formData.bottomConfig.imgMessage, 'img', '')
      }
    },
        // 校检
    checkData () {
      let isPass = true
      let err_message = ''
      if (this.formData.leftConfig.mainTitle === '' || this.formData.topConfig.mainTitle === '' || this.formData.bottomConfig.mainTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip1')
      } else if (this.formData.leftConfig.subTitle === '' || this.formData.topConfig.subTitle === '' || this.formData.bottomConfig.subTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip2')
      } else if (this.formData.leftConfig.path.name === '' || this.formData.topConfig.path.name === '' || this.formData.bottomConfig.path.name === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip3')
      } else if (this.formData.leftConfig.imgMessage.img === '' || this.formData.topConfig.imgMessage.img === '' || this.formData.bottomConfig.imgMessage.img === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip4')
      } else if (this.formData.leftConfig.imgMessage.path.name === '' || this.formData.topConfig.imgMessage.path.name === '' || this.formData.bottomConfig.imgMessage.path.name === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip5')
      } else {
        isPass = true
        err_message = ''
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        this.$newMessage.error(err_message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.config-item {
  .bottom-config .el-input__inner {
        height: 28px;
    }
}
</style>