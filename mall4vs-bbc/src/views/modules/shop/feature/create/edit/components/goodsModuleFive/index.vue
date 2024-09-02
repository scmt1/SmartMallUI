<template>
    <div class="micro-goodsFive-box">
        <!-- 预览控制区 start -->
        <div class="design-preview-controller">
            <module-component :config="formData"></module-component>
        </div>
        <!-- 预览控制区 end -->
        <!-- 编辑工作区 start -->
        <div v-if="isShowEdit" class="design-editor-item design-hide-class">
            <div class="design-config-editor">
                <div class="design-editor-component-title">{{$t('pcdecorate.componentTitle.goodsModule5')}}</div>
                <div class="config-item">
                    <div class="title">{{$t('shopFeature.goodsModule.addBigImg')}} <span>({{$t('shopFeature.goodsModule.suggestChoose')}}334*196px{{$t('shopFeature.goodsModule.sameScalePic')}})</span></div>
                    <div class="bottom-contents">
                        <div class="add-btn">
                            <div 
                                v-if="formData.leftMessage.img === ''" 
                                class="add-items" 
                                @click="handleAddLeftImg">
                                <span>+</span>
                                <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                            </div>
                            <el-image v-else :src="formData.leftMessage.img" fit="fill"></el-image>
                            <i 
                                class="el-icon-error" 
                                @click="handleRemoveLeftImgs" 
                                v-if="formData.leftMessage.img != ''"></i>
                        </div>
                        <div class="right-content">
                            <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                            <redirect-nav
                                class="link-redirect"
                                :selectedLink="formData.leftMessage.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleLeftNavSelect"
                                @handleRemoveSelected="handleLeftRemoveSelected">
                            </redirect-nav>
                        </div>
                    </div>
                </div>
                <div class="config-item">
                    <div class="bottom-contents">
                        <div class="add-btn">
                            <div 
                                v-if="formData.rightMessage.img === ''" 
                                class="add-items" 
                                @click="handleAddRightImg">
                                <span>+</span>
                                <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                            </div>
                            <el-image v-else :src="formData.rightMessage.img" fit="fill"></el-image>
                            <i 
                                class="el-icon-error" 
                                @click="handleRemoveRightImgs" 
                                v-if="formData.rightMessage.img != ''">
                            </i>
                        </div>
                        <div class="right-content">
                            <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                            <redirect-nav
                                class="link-redirect"
                                :selectedLink="formData.rightMessage.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleRightNavSelect"
                                @handleRemoveSelected="handleRightRemoveSelected">
                            </redirect-nav>
                        </div>
                    </div>
                </div>
                <div class="config-item">
                    <div class="title">{{$t('pcdecorate.goodsList.addgoods')}} <span>({{$t('shopFeature.goodsModule.maxAdd')}}12{{$t('shopFeature.goodsModule.piece')}})</span></div>
                    <div class="bottom-config">
                        <select-goods-component
                            :goodsList="formData.goodsList"
                            :addLength="addLength"
                            @handleAddClick="handleAddClick"
                            @handleRemove="handleRemove">
                        </select-goods-component>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑工作区 end -->
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="currentSelectType"
          :isMulilt="isMulilt"
          :deviceType="'mobile'"
          :echoDataList="echoDataList"
          :goodsNumber="goodsNumber"
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
import selectGoodsComponent from '../../../../../decorate/create/commonComponent/selectGoodsComponent/index.vue'
import moduleComponent from './module.vue'
import redirectNav from '../../../../../decorate/create/commonComponent/redirectNav/index.vue'
import ElxImgbox from '@/components/elx-imgbox'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'
export default {
  components: {
    selectGoodsComponent,
    moduleComponent,
    redirectNav,
    ElxImgbox,
    decorateDialogSelect
  },
  mixins: [microCreateMinis],
  data () {
    return {
      addLength: 12,
      formData: {
        leftMessage: {
          img: '',
          path: {
            name: '',
            link: '',
            type: ''
          }
        },
        rightMessage: {
          img: '',
          path: {
            name: '',
            link: '',
            type: ''
          }
        },
        goodsList: [] // 商品列表
      },
      dialogVisible: false, // 商品弹窗
      currentSelectType: [], // 当前的限制选择的类型
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      currentOperation: '',
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      isMulilt: false, // 是否可以多选
      goodsNumber: 0, // 限制多少个商品
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 添加图片1
    handleAddLeftImg () {
      this.currentOperation = 'addImg1'
      this.$refs.elxImgbox.init(2, 1)
    },
        // 删除图片1
    handleRemoveLeftImgs () {
      this.formData.leftMessage.img = ''
    },
        // 添加图片2
    handleAddRightImg () {
      this.currentOperation = 'addImg2'
      this.$refs.elxImgbox.init(2, 1)
    },
        // 删除图片2
    handleRemoveRightImgs () {
      this.formData.rightMessage.img = ''
    },
        // 图片1的选择跳转链接
    handleLeftNavSelect () {
      this.currentOperation = 'link1'
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.isMulilt = false
      this.echoDataList = []
    },
        // 图片1的删除跳转链接
    handleLeftRemoveSelected () {
      this.formData.leftMessage.path.name = ''
      this.formData.leftMessage.path.link = ''
      this.formData.leftMessage.path.type = ''
    },
        // 图片2的选择跳转链接
    handleRightNavSelect () {
      this.currentOperation = 'link2'
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.isMulilt = false
      this.echoDataList = []
    },
        // 图片2的删除跳转链接
    handleRightRemoveSelected () {
      this.formData.rightMessage.path.name = ''
      this.formData.rightMessage.path.link = ''
      this.formData.rightMessage.path.type = ''
    },
        // 图片选择回调
    refreshPic (imagePath) {
      if (this.currentOperation === 'addImg1') {
        this.formData.leftMessage.img = this.resourcesUrl + imagePath
      } else if (this.currentOperation === 'addImg2') {
        this.formData.rightMessage.img = this.resourcesUrl + imagePath
      }
    },
        // 关闭弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (this.currentOperation === 'goods') {
        if (type === '1') {
          this.formData.goodsList = []
          value.goodsItem.forEach(item => {
            this.formData.goodsList.push({
              id: item.prodId, // 商品id
              name: item.prodName, // 商品名称
              prodType: item.prodType, // 商品类型
              price: item.price, // 商品价格
              status: item.status, // 商品状态
              imgs: item.pic, // 商品图片
              orignPrice: item.oriPrice, // 商品原价
              description: item.brief // 商品描述
            })
          })
        }
      } else if (this.currentOperation === 'link1') {
        if (type === '1') { // 当前选择的是商品
          this.$set(this.formData.leftMessage.path, 'name', value.goodsItem.prodName)
          this.$set(this.formData.leftMessage.path, 'link', value.goodsItem.prodId)
          this.$set(this.formData.leftMessage.path, 'type', '1')
        } else if (type === '2') { // 当前选择的是分类
          this.$set(this.formData.leftMessage.path, 'name', value.categoryItem.label)
          this.$set(this.formData.leftMessage.path, 'link', value.categoryItem.data)
          this.$set(this.formData.leftMessage.path, 'type', '2')
        } else if (type === '3') { // 当前选择的是店铺
          this.$set(this.formData.leftMessage.path, 'name', value.storeItem.shopName)
          this.$set(this.formData.leftMessage.path, 'link', value.storeItem.shopId)
          this.$set(this.formData.leftMessage.path, 'type', '3')
        } else if (type === '4') { // 当前选择的是页面
          this.$set(this.formData.leftMessage.path, 'name', value.pageItem.title)
          this.$set(this.formData.leftMessage.path, 'link', value.pageItem.link)
          this.$set(this.formData.leftMessage.path, 'type', '4')
        } else if (type === '5') { // 当前选择的是微页面
          this.$set(this.formData.leftMessage.path, 'name', value.smallPageItem.name)
          this.$set(this.formData.leftMessage.path, 'link', value.smallPageItem.renovationId)
          this.$set(this.formData.leftMessage.path, 'type', '5')
        } else if (type === '6') { // 自定义链接
          this.$set(this.formData.leftMessage.path, 'name', value.customLink)
          this.$set(this.formData.leftMessage.path, 'link', value.customLink)
          this.$set(this.formData.leftMessage.path, 'type', '6')
        }
      } else if (this.currentOperation === 'link2') {
        if (type === '1') { // 当前选择的是商品
          this.$set(this.formData.rightMessage.path, 'name', value.goodsItem.prodName)
          this.$set(this.formData.rightMessage.path, 'link', value.goodsItem.prodId)
          this.$set(this.formData.rightMessage.path, 'type', '1')
        } else if (type === '2') { // 当前选择的是分类
          this.$set(this.formData.rightMessage.path, 'name', value.categoryItem.label)
          this.$set(this.formData.rightMessage.path, 'link', value.categoryItem.data)
          this.$set(this.formData.rightMessage.path, 'type', '2')
        } else if (type === '3') { // 当前选择的是店铺
          this.$set(this.formData.rightMessage.path, 'name', value.storeItem.shopName)
          this.$set(this.formData.rightMessage.path, 'link', value.storeItem.shopId)
          this.$set(this.formData.rightMessage.path, 'type', '3')
        } else if (type === '4') { // 当前选择的是页面
          this.$set(this.formData.rightMessage.path, 'name', value.pageItem.title)
          this.$set(this.formData.rightMessage.path, 'link', value.pageItem.link)
          this.$set(this.formData.rightMessage.path, 'type', '4')
        } else if (type === '5') { // 当前选择的是微页面
          this.$set(this.formData.rightMessage.path, 'name', value.smallPageItem.name)
          this.$set(this.formData.rightMessage.path, 'link', value.smallPageItem.renovationId)
          this.$set(this.formData.rightMessage.path, 'type', '5')
        } else if (type === '6') { // 自定义链接
          this.$set(this.formData.rightMessage.path, 'name', value.customLink)
          this.$set(this.formData.rightMessage.path, 'link', value.customLink)
          this.$set(this.formData.rightMessage.path, 'type', '6')
        }
      }
      this.dialogVisible = false
    },
        // 选择商品
    handleAddClick () {
      this.dialogVisible = true
      this.currentOperation = 'goods'
      this.currentSelectType = [1]
      this.isMulilt = true // 商品可以多选
      this.goodsNumber = 12 // 限制选择商品的个数
      this.echoDataList = []
      this.formData.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRemove (index) {
      this.formData.goodsList.splice(index, 1)
    },
        // 校检
    checkData () {
      let isPass = true
      let err_message = ''
      if (this.formData.leftMessage.img === '' || this.formData.rightMessage.img === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule5') + this.$t('shopFeature.goodsModule.goodsModuleTip9')
      } else if (this.formData.leftMessage.path.name === '' || this.formData.rightMessage.path.name === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule5') + this.$t('shopFeature.goodsModule.goodsModuleTip10')
      } else if (this.formData.goodsList.length === 0) {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule5') + this.$t('shopFeature.goodsModule.goodsModuleTip6')
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