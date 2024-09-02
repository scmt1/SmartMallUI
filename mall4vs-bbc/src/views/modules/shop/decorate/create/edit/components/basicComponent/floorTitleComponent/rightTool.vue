<template>
    <div class="floor_container_config">
        <el-form 
            :model="floorTitleForm" 
            ref="floorTitleForm"
            label-position="top">
            <el-form-item  :label="$t(`pcdecorate.floorTitle.mainTitle`)" prop="mainTitle">
                <el-input maxlength="8" v-model.trim="floorTitleForm.mainTitle" class="title-input"></el-input>
            </el-form-item>
            <el-form-item :label="$t(`pcdecorate.floorTitle.subTitle`)" prop="subTitle">
                <el-input maxlength="16" v-model.trim="floorTitleForm.subTitle" class="title-input"></el-input>
            </el-form-item>
            <el-form-item>
                <span class="title" style="margin-right: 20px">{{$t(`pcdecorate.floorTitle.more`)}}</span>
                <el-radio-group v-model="floorTitleForm.more">
                    <el-radio :label="0">{{$t(`pcdecorate.floorTitle.show`)}}</el-radio>
                    <el-radio :label="1">{{$t(`pcdecorate.floorTitle.hide`)}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="floorTitleForm.more == 0">
                    <redirect-nav
                        :selectedLink="floorTitleForm.path.name"
                        :placeholder="$t('pcdecorate.placeholder.link')"
                        @handleNavSelect="handleNavSelect"
                        @handleRemoveSelected="handleRemoveSelected">
                    </redirect-nav>
            </el-form-item>
            <el-form-item :label="$t(`pcdecorate.floorTitle.mainTitleColor`)">
                <pick-color-component
                    :defineColor="floorTitleForm.mainTextColor"
                    @handleChangeColor="handleChangeMainColor"></pick-color-component>
            </el-form-item>
            <el-form-item :label="$t(`pcdecorate.floorTitle.subTitleColor`)">
                <pick-color-component
                    :defineColor="floorTitleForm.subTextColor"
                    :resetColor="'rgba(153, 153, 153, 1)'"
                    @handleChangeColor="handleChangeSubColor"></pick-color-component>
            </el-form-item>
            <el-form-item :label="$t(`pcdecorate.floorTitle.moreTitleColor`)">
                <pick-color-component
                    :defineColor="floorTitleForm.moreTextColor"
                    :resetColor="'rgba(153, 153, 153, 1)'"
                    @handleChangeColor="handleChangeMoreColor"></pick-color-component>
            </el-form-item>
            <el-form-item :label="$t(`pcdecorate.floorTitle.titleBgColor`)">
                <pick-color-component
                    :defineColor="floorTitleForm.bgColor"
                    :resetColor="'rgba(244, 244, 244, 1)'"
                    @handleChangeColor="handleTitleBgColor"></pick-color-component>
            </el-form-item>
            <div class="config-item">
                <div class="items-content slider-content">
                    <div class="title">{{$t(`pcdecorate.floorTitle.titleSize`)}}</div>
                    <div class="right-select">
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="floorTitleForm.mainFontSize" 
                            show-input
                            @change="mainChange">
                        </el-slider>
                    </div>
                </div>
            </div>
            <div class="config-item">
                <div class="items-content slider-content">
                    <div class="title">{{$t(`pcdecorate.floorTitle.subTitleSize`)}}</div>
                    <div class="right-select">
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="floorTitleForm.subFontSize" 
                            show-input
                            @change="subChange">
                        </el-slider>
                    </div>
                </div>
            </div>
            <div class="config-item">
                <div class="items-content slider-content">
                    <div class="title">{{$t(`pcdecorate.floorTitle.marginTop`)}}</div>
                    <div class="right-select">
                        <el-slider 
                            :min="0" 
                            :max="100" 
                            v-model="floorTitleForm.marginTop" 
                            show-input
                            @change="topChange"></el-slider>
                    </div>
                </div>
            </div>
            <div class="config-item">
                <div class="items-content slider-content">
                    <div class="title">{{$t(`pcdecorate.floorTitle.marginBottom`)}}</div>
                    <div class="right-select">
                        <el-slider 
                            :min="0" 
                            :max="100" 
                            v-model="floorTitleForm.marginBottom" 
                            show-input
                            @change="bottomChange"></el-slider>
                    </div>
                </div>
            </div>
        </el-form>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="[1, 2, 4, 5, 6]"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import redirectNav from '../../../../commonComponent/redirectNav/index.vue'
import pickColorComponent from '../../../../commonComponent/pickColor/index.vue'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  components: {
    redirectNav,
    pickColorComponent,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前组件的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击当前组件回显右边配置信息
      type: Object,
      default: () => {}
    },
    editItem: { // 当前已经配置信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      floorTitleForm: {
        mainTitle: '', // 主标题文字
        subTitle: '', // 副标题文字
        more: 0,  // 查看更多
        path: {
          name: '',
          link: '',
          type: ''
        }, // 查看更多跳转的链接
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多文字的颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景色
        mainFontSize: 24, // 主标题的文字大小
        subFontSize: 12, // 副标题的文字大小
        marginTop: 18, // 上边距大小
        marginBottom: 18 // 下边距大小
      },
      dialogVisible: false // 弹窗显示隐藏
    }
  },
  methods: {
    init () {
      this.floorTitleForm = {
        mainTitle: this.$t('pcdecorate.floorTitle.mainTitCon'), // 主标题文字
        subTitle: this.$t('pcdecorate.floorTitle.subTitCon'), // 副标题文字
        more: 0,  // 查看更多
        path: {
          name: '',
          link: '',
          type: ''
        }, // 查看更多跳转的链接
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多文字的颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景色
        mainFontSize: 24, // 主标题的文字大小
        subFontSize: 12, // 副标题的文字大小
        marginTop: 18, // 上边距大小
        marginBottom: 18 // 下边距大小
      }
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.floorTitle.warning1')
      } else if (this.editItem.mainTitle === '') {
        status = false
        message = this.$i18n.t('pcdecorate.floorTitle.warning2')
      } else if (this.editItem.subTitle === '') {
        status = false
        message = this.$i18n.t('pcdecorate.floorTitle.warning3')
      } else if (this.editItem.more == 0 && this.editItem.path.name == '') {
        status = false
        message = this.$i18n.t('pcdecorate.floorTitle.warning4')
      } else {
        status = true
      }
      return {
        status: status,
        message: message
      }
    },
        // 提交信息
    handleSubmitMessage () {
      return this.floorTitleForm
    },
        // 主标题文字颜色
    handleChangeMainColor (color) {
      this.floorTitleForm.mainTextColor = color
    },
        // 副标题文字颜色
    handleChangeSubColor (color) {
      this.floorTitleForm.subTextColor = color
    },
        // 查看更多文字颜色
    handleChangeMoreColor (color) {
      this.floorTitleForm.moreTextColor = color
    },
        // 标题的背景色
    handleTitleBgColor (color) {
      this.floorTitleForm.bgColor = color
    },
        // 查看更多跳转弹窗
    handleNavSelect () {
      this.dialogVisible = true
    },
        // 删除查看更多的链接
    handleRemoveSelected () {
      this.floorTitleForm.path.name = ''
      this.floorTitleForm.path.link = ''
      this.floorTitleForm.path.type = ''
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 商品弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') { // 当前选择的是商品
        this.$set(this.floorTitleForm.path, 'name', value.goodsItem.prodName)
        this.$set(this.floorTitleForm.path, 'link', value.goodsItem.prodId)
        this.$set(this.floorTitleForm.path, 'type', '1')
      } else if (type === '2') { // 当前选择的是分类
        this.$set(this.floorTitleForm.path, 'name', value.categoryItem.label)
        this.$set(this.floorTitleForm.path, 'link', value.categoryItem.data)
        this.$set(this.floorTitleForm.path, 'type', '2')
      } else if (type === '3') { // 当前选择的是店铺
        this.$set(this.floorTitleForm.path, 'name', value.storeItem.shopName)
        this.$set(this.floorTitleForm.path, 'link', value.storeItem.shopId)
        this.$set(this.floorTitleForm.path, 'type', '3')
      } else if (type === '4') { // 当前选择的是页面
        this.$set(this.floorTitleForm.path, 'name', value.pageItem.title)
        this.$set(this.floorTitleForm.path, 'link', value.pageItem.link)
        this.$set(this.floorTitleForm.path, 'type', '4')
      } else if (type === '5') { // 当前选择的是微页面
        this.$set(this.floorTitleForm.path, 'name', value.smallPageItem.name)
        this.$set(this.floorTitleForm.path, 'link', [value.smallPageItem.renovationId, value.smallPageItem.shopId])
        this.$set(this.floorTitleForm.path, 'type', '5')
      } else if (type === '6') { // 自定义链接
        this.$set(this.floorTitleForm.path, 'name', value.customLink)
        this.$set(this.floorTitleForm.path, 'link', value.customLink)
        this.$set(this.floorTitleForm.path, 'type', '6')
      }
      this.dialogVisible = false
    },
        // 主标题文字大小限制
    mainChange (val) {
      return this.floorTitleForm.mainFontSize = Math.floor(val)
    },
        // 副标题文字大小限制
    subChange (val) {
      return this.floorTitleForm.subFontSize = Math.floor(val)
    },
        // 上边距大小控制
    topChange (val) {
      return this.floorTitleForm.marginTop = Math.floor(val)
    },
        // 下边距大小控制
    bottomChange (val) {
      return this.floorTitleForm.marginBottom = Math.floor(val)
    }
  },
  watch: {
    floorTitleForm: {
      handler (newVal, oldVal) {
        let obj = {
          type: 'floor_title',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听组件回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'floor_title') {
          if (JSON.stringify(newVal.config) != '{}') {
            let obj = {...newVal.config}
            this.floorTitleForm = obj
          } else {
            this.init()
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.floor_container_config {
    .el-form-item {
        margin-bottom: 0;
    }
     .config-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
            font-size: 14px;
            color: #666;
            font-family: Microsoft YaHei;
            margin-bottom: 12px;
            &.special-title {
                margin-top: 20px;
            }
        }
        .title-input {
            margin-bottom: 18px;
        }
        .items-content {
            display: flex;
            &.slider-content {
                margin-bottom: 10px;
                &:nth-child(1) {
                    margin-top: 10px;
                }
                .title {
                    padding-top: 10px;
                }
            }
            .title {
                width: 80px;
                display: flex;
                align-items: center;
            }
            .right-select {
                width: 100%;
            }
        }
    }
}
</style>
<style lang="scss">
.floor_container_config {
    .title-input.el-input {
        .el-input__inner {
            height: 28px;
        }
    }
    .el-form-item__label {
        padding: 0;
        padding: 0;
        font-size: 14px;
        color: #666;
        font-family: Microsoft YaHei!important;
    }
}
</style>