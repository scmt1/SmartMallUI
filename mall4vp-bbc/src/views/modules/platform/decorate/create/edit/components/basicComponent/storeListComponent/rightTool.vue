<template>
  <div class="store-config-content">
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeList.showSubTitle`)}}</div>
      <div class="right-select">
        <el-radio-group v-model="storeConfigForm.showSubTitle">
          <el-radio :label="0">{{$t(`pcdecorate.storeList.show`)}}</el-radio>
          <el-radio :label="1">{{$t(`pcdecorate.storeList.hide`)}}</el-radio>
        </el-radio-group>
      </div>
      <el-input 
        v-show="storeConfigForm.showSubTitle==0" 
        class="subtitle-input" 
        maxlength="9" 
        v-model.trim="storeConfigForm.subTitle">
      </el-input>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeList.mainTileColor`)}}</div>
      <pick-color-component
        :defineColor="storeConfigForm.mainTextColor" 
        @handleChangeColor="handleMainTitleColor">
      </pick-color-component>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeList.subTitleColor`)}}</div>
      <pick-color-component
        :defineColor="storeConfigForm.subTextColor"
        :resetColor="'rgba(153, 153, 153, 1)'"
        @handleChangeColor="handleSubTitleColor">
      </pick-color-component>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeList.titleBgColor`)}}</div>
      <pick-color-component
        :defineColor="storeConfigForm.bgColor"
        :resetColor="'rgba(244, 244, 244, 1)'"
        @handleChangeColor="handleBgColor">
      </pick-color-component>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">{{$t(`pcdecorate.storeList.titleSize`)}}</div>
        <div class="right-content">
          <el-slider 
            :min="12" 
            :max="40" 
            v-model="storeConfigForm.mainFontSize" 
            show-input
            @change="mainChange">
          </el-slider>
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">{{$t(`pcdecorate.storeList.subTitleSize`)}}</div>
        <div class="right-content">
          <el-slider 
            :min="12" 
            :max="40"
            v-model="storeConfigForm.subFontSize" 
            show-input
            @change="subChange">
          </el-slider>
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">{{$t(`pcdecorate.storeList.marginTop`)}}</div>
        <div class="right-content">
          <el-slider 
            :min="0" 
            :max="100" 
            v-model="storeConfigForm.marginTop" 
            show-input
            @change="topChange">
          </el-slider>
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content slider-content">
        <div class="title">{{$t(`pcdecorate.storeList.marginBottom`)}}</div>
        <div class="right-content">
          <el-slider 
            :min="0" 
            :max="100" 
            v-model="storeConfigForm.marginBottom" 
            show-input
            @change="bottomChange">
          </el-slider>
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeList.addStore`)}}</div>
      <!-- 选择店铺 start -->
      <select-goods-component
        :goodsList="storeConfigForm.storeList"
        @handleAddClick="handleAddClick"
        @handleRemove="handleRemove">
      </select-goods-component>
      <!-- 选择店铺 end -->
    </div>
    <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :currentSelectType="[3]"
      :isMulilt="true"
      :echoDataList="echoDataList"
      @handleClose="handleDialogClose"
      @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue' // 选择商品组件
import pickColorComponent from '../../../../commonComponent/pickColor/index.vue' // 颜色选择器
import { bigNumberTransform } from '@/utils/index.js'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  components: {
    selectGoodsComponent,
    pickColorComponent,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前组件的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击当前组件的显示配置信息
      type: Object,
      default: () => {}
    },
    editItem: { // 当前组件的配置信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      storeConfigForm: {
        showSubTitle: 0, // 是否显示副标题
        subTitle: '', // 副标题文字
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景颜色
        mainFontSize: 24, // 主标题文字大小
        subFontSize: 12, // 副标题文字大小
        marginTop: 18, // 上边距
        marginBottom: 18, // 下边距
        storeList: [] // 店铺信息
      },
      dialogVisible: false, // 弹窗是否显示
      echoDataList: [] // 回显店铺数据
    }
  },
  methods: {
    init () {
      this.storeConfigForm = {
        showSubTitle: 0, // 是否显示副标题
        subTitle: this.$t('pcdecorate.componentTitle.subTitleCon'), // 副标题文字
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景颜色
        mainFontSize: 24, // 主标题文字大小
        subFontSize: 12, // 副标题文字大小
        marginTop: 18, // 上边距
        marginBottom: 18, // 下边距
        storeList: [] // 店铺信息
      }
    },
    // 标题的文字颜色
    handleMainTitleColor (color) {
      this.storeConfigForm.mainTextColor = color
    },
    // 副标题文字颜色
    handleSubTitleColor (color) {
      this.storeConfigForm.subTextColor = color
    },
    // 标题背景色
    handleBgColor (color) {
      this.storeConfigForm.bgColor = color
    },
    // 添加店铺
    handleAddClick () {
      this.dialogVisible = true
      this.echoDataList = [] // 店铺数据
      this.storeConfigForm.storeList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
    // 删除店铺
    handleRemove (index) {
      this.storeConfigForm.storeList.splice(index, 1)
    },
    // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
    // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '3') { // 当前选择的是店铺
        this.storeConfigForm.storeList = []
        value.storeItem.forEach(item => {
          this.storeConfigForm.storeList.push({
            shopId: item.shopId, // 店铺id
            shopLogo: item.shopLogo, // 店铺logo(用于回显)
            imgs: item.shopLogo, // 店铺logo
            shopName: item.shopName, // 店铺名称
            shopStatus: item.shopStatus, // 店铺状态
            type: item.type, // 店铺类型
            fansCount: item.fansCount, // 关注人数
            shopFocusNumber: item.fansCount === null ? 0 : bigNumberTransform(item.fansCount) // 店铺关注人数
          })
        })
      }
      this.dialogVisible = false
    },
    // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.storeList.warning1')
      } else if (this.editItem.showSubTitle == 0 && this.editItem.subTitle === '') {
        status = false
        message = this.$i18n.t('pcdecorate.storeList.warning2')
      } else if (this.editItem.storeList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.storeList.warning3')
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
      return this.storeConfigForm
    },
    // 主标题防止小数
    mainChange (val) {
      return this.storeConfigForm.mainFontSize = Math.floor(val)
    },
    // 副标题防止小数
    subChange (val) {
      return this.storeConfigForm.subFontSize = Math.floor(val)
    },
    // 上边距防止小数
    topChange (val) {
      return this.storeConfigForm.marginTop = Math.floor(val)
    },
    // 下边距防止小数
    bottomChange (val) {
      return this.storeConfigForm.marginBottom = Math.floor(val)
    }
  },
  watch: {
    storeConfigForm: { // 监听
      handler (newVal, oldVal) {
        let obj = {
          type: 'store_list',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听组件回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'store_list') {
          if (JSON.stringify(newVal.config) != '{}') {
            let obj = {...newVal.config}
            this.storeConfigForm = obj
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
.store-config-content {
  .config-items {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    .title {
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      position: relative;
    }
    .right-select {
      margin: 0 0 20px 0;
      width: 100%;
    }
    .items-content {
      display: flex;
      align-items: center;
      overflow: hidden;
      .title {
        width: 70px;
        height: 100%;
        display: flex;
        align-items: center;
        padding-top: 15px;
      }
      .right-content {
        width: 78%;
        padding-bottom: 3px;
      }
    }
  }
}
</style>
<style lang="scss">
.store-config-content {
    .subtitle-input {
        .el-input__inner {
            height: 28px;
        }
    }
}
</style>