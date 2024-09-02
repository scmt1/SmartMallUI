<template>
    <div class="micro-goodsFour-box">
        <!-- 预览控制区 start -->
        <div class="design-preview-controller">
            <module-component :config="formData"></module-component>
        </div>
        <!-- 预览控制区 end -->
        <!-- 编辑工作区 start -->
        <div v-if="isShowEdit" class="design-editor-item design-hide-class">
            <div class="design-config-editor">
                <div class="design-editor-component-title">{{$t('pcdecorate.componentTitle.goodsModule4')}}</div>
                <div class="config-item">
                    <div class="title">{{$t('shopFeature.goodsModule.addBigImg')}} <span>({{$t('shopFeature.goodsModule.suggestChoose')}}720*196px{{$t('shopFeature.goodsModule.sameScalePic')}})</span></div>
                    <div class="bottom-contents">
                        <div class="add-btn">
                            <div v-if="formData.topImg === ''" class="add-items" @click="handleAddImg">
                                <span>+</span>
                                <span>{{$t('shopFeature.imageAd.addPic')}}</span>
                            </div>
                            <el-image v-else :src="formData.topImg" fit="fill"></el-image>
                            <i class="el-icon-error" @click="handleRemoveImgs" v-if="formData.topImg != ''"></i>
                        </div>
                        <div class="right-content">
                            <div class="right-titles">{{$t('shopFeature.tabNav.link')}}</div>
                            <redirect-nav
                                class="link-redirect"
                                :selectedLink="formData.path.name"
                                :placeholder="$t('pcdecorate.placeholder.link')"
                                @handleNavSelect="handleNavSelect"
                                @handleRemoveSelected="handleRemoveSelected">
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
        topImg: '',
        path: {
          name: '',
          link: '',
          type: ''
        },
        goodsList: []
      },
      dialogVisible: false, // 弹窗
      currentSelectType: [],
      currentOperation: '', // 当前操作的类型
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      isMulilt: false, // 是否可以多选
      goodsNumber: 0, // 限制选择的数量
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 选择商品
    handleAddClick () {
      this.dialogVisible = true
      this.currentSelectType = [1]
      this.currentOperation = 'goods'
      this.isMulilt = true // 可以多选
      this.goodsNumber = 12 // 限制选择的数量
      this.echoDataList = []
      this.formData.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRemove (index) {
      this.formData.goodsList.splice(index, 1)
    },
        // 添加图片
    handleAddImg () {
      this.$refs.elxImgbox.init(1, 1)
    },
        // 选择图片的回调
    refreshPic (imagePath) {
      this.$set(this.formData, 'topImg', this.resourcesUrl + imagePath)
    },
        // 删除图片
    handleRemoveImgs () {
      this.formData.topImg = ''
    },
        // 选择商品链接
    handleNavSelect () {
      this.dialogVisible = true
      this.currentSelectType = [1, 2, 3, 4, 5, 6]
      this.currentOperation = 'links'
      this.isMulilt = false // 不能多选
      this.echoDataList = []
    },
        // 删除图片链接
    handleRemoveSelected () {
      this.formData.path.name = ''
      this.formData.path.link = ''
      this.formData.path.type = ''
    },
        // 弹窗关闭
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
      } else if (this.currentOperation === 'links') {
        if (type === '1') { // 当前选择的是商品
          this.$set(this.formData.path, 'name', value.goodsItem.prodName)
          this.$set(this.formData.path, 'link', value.goodsItem.prodId)
          this.$set(this.formData.path, 'type', '1')
        } else if (type === '2') { // 当前选择的是分类
          this.$set(this.formData.path, 'name', value.categoryItem.label)
          this.$set(this.formData.path, 'link', value.categoryItem.data)
          this.$set(this.formData.path, 'type', '2')
        } else if (type === '3') { // 当前选择的是店铺
          this.$set(this.formData.path, 'name', value.storeItem.shopName)
          this.$set(this.formData.path, 'link', value.storeItem.shopId)
          this.$set(this.formData.path, 'type', '3')
        } else if (type === '4') { // 当前选择的是页面
          this.$set(this.formData.path, 'name', value.pageItem.title)
          this.$set(this.formData.path, 'link', value.pageItem.link)
          this.$set(this.formData.path, 'type', '4')
        } else if (type === '5') { // 当前选择的是微页面
          this.$set(this.formData.path, 'name', value.smallPageItem.name)
          this.$set(this.formData.path, 'link', value.smallPageItem.renovationId)
          this.$set(this.formData.path, 'type', '5')
        } else if (type === '6') { // 自定义链接
          this.$set(this.formData.path, 'name', value.customLink)
          this.$set(this.formData.path, 'link', value.customLink)
          this.$set(this.formData.path, 'type', '6')
        }
      }
      this.dialogVisible = false
    },
        // 校检
    checkData () {
      let isPass = true
      let err_message = ''
      if (this.formData.topImg === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule4') + this.$t('shopFeature.goodsModule.goodsModuleTip9')
      } else if (this.formData.path.name === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule4') + this.$t('shopFeature.goodsModule.goodsModuleTip10')
      } else if (this.formData.goodsList.length === 0) {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule4') + this.$t('shopFeature.goodsModule.goodsModuleTip6')
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