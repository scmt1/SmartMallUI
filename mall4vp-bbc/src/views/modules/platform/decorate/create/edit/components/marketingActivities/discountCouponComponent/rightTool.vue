<template>
    <div class="limit-skill-config">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.showSubTitle`)}}</div>
        </div>
        <div class="config-items">
            <div class="title-input">
                <el-radio-group v-model="disCountForm.showSubTitle" style="display: flex;margin-bottom: 20px">
                   <el-radio :label="0">{{$t(`pcdecorate.storeList.show`)}}</el-radio>
                   <el-radio :label="1">{{$t(`pcdecorate.storeList.hide`)}}</el-radio>
               </el-radio-group>
                <el-input v-show="disCountForm.showSubTitle === 0" v-model="disCountForm.subTitle" ></el-input>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsList.showContent`)}}</div>
        </div>
        <div class="config-items">
            <div class="title-checkbox">
               <el-checkbox-group v-model="disCountForm.showContent" style="display: flex;">
                    <el-checkbox label="0" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsName`)}}</el-checkbox>
                    <el-checkbox label="1" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsDescription`)}}</el-checkbox>
                    <el-checkbox label="2" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsPrice`)}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.mainTileColor`)}}</div>
        </div>
        <div class="config-items">
            <pick-color-component
                :defineColor="disCountForm.mainTextColor" 
                @handleChangeColor="handleMainTitleColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.subTitleColor`)}}</div>
        </div>
        <div class="config-items">
            <pick-color-component
                :defineColor="disCountForm.subTextColor"
                :resetColor="'rgba(153, 153, 153, 1)'"
                @handleChangeColor="handleSubTitleColor">
            </pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.titleBgColor`)}}</div>
        </div>
        <div class="config-items">
            <pick-color-component 
                :defineColor="disCountForm.bgColor"
                :resetColor="'rgba(244, 244, 244, 1)'"
                @handleChangeColor="handleBgColor">
            </pick-color-component>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.titleSize`)}}</div>
                <div class="right-select">
                    <el-slider 
                        :min="12" 
                        :max="40" 
                        v-model="disCountForm.mainFontSize" 
                        show-input
                        @change="mainChange">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.subTitleSize`)}}</div>
                <div class="right-select">
                    <el-slider 
                        :min="12" 
                        :max="40" 
                        v-model="disCountForm.subFontSize" 
                        show-input
                        @change="subChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginTop`)}}</div>
                <div class="right-select">
                    <el-slider 
                        :min="0" 
                        :max="100" 
                        v-model="disCountForm.marginTop" 
                        show-input
                        @change="topChange">
                    </el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginBottom`)}}</div>
                <div class="right-select">
                    <el-slider 
                        :min="0" 
                        :max="100" 
                        v-model="disCountForm.marginBottom" 
                        show-input
                        @change="bottomChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsList.addgoods`)}}</div>
        </div>
        <div class="config-items">
          <select-goods-component
            :goodsList="disCountForm.goodsList"
            @handleAddClick="handleAddClick"
            @handleRemove="handleRemove">
          </select-goods-component>
        </div>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="[1]"
          :goodsType="1"
          :isMulilt="true"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import pickColorComponent from '../../../../commonComponent/pickColor/index.vue' // 颜色选择器
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue' // 选择商品
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  components: {
    pickColorComponent,
    selectGoodsComponent,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前组件的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击当前组件的配置信息
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
      disCountForm: {
        showSubTitle: 0, // 显示副标题
        subTitle: '', // 副标题的内容
        showContent: ['0', '1', '2'], // 显示内容
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题背景颜色
        mainFontSize: 24, // 主标题字号
        subFontSize: 12, // 副标题字号
        marginTop: 30, // 上边距
        marginBottom: 20, // 下边距
        goodsList: []
      },
      dialogVisible: false, // 弹窗是否显示
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
    init () {
      this.disCountForm = {
        showSubTitle: 0, // 显示副标题
        subTitle: this.$t('pcdecorate.disCountForm.subTitle'), // 副标题的内容
        showContent: ['0', '1', '2'], // 显示内容
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
        bgColor: 'rgba(244, 244, 244, 1)', // 标题背景颜色
        mainFontSize: 24, // 主标题字号
        subFontSize: 12, // 副标题字号
        marginTop: 30, // 上边距
        marginBottom: 20, // 下边距
        goodsList: []
      }
    },
        // 标题文字颜色
    handleMainTitleColor (color) {
      this.disCountForm.mainTextColor = color
    },
        // 副标题文字颜色
    handleSubTitleColor (color) {
      this.disCountForm.subTextColor = color
    },
        // 标题的背景颜色
    handleBgColor (color) {
      this.disCountForm.bgColor = color
    },
        // 添加商品
    handleAddClick () {
      this.dialogVisible = true
      this.echoDataList = []
      this.disCountForm.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 移除商品
    handleRemove (index) {
      this.disCountForm.goodsList.splice(index, 1)
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') { // 表示当前选择的是商品
        this.disCountForm.goodsList = []
        value.goodsItem.forEach(item => {
          this.disCountForm.goodsList.push({
            name: item.prodName, // 商品名称
            prodType: item.prodType, // 商品状态类型
            id: item.prodId, // 商品id
            status: item.status, // 商品状态
            price: item.price, // 商品价格
            imgs: item.pic, // 商品图片
            description: item.brief // 商品描述
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
        message = this.$i18n.t('pcdecorate.disCountForm.warning1')
      } else if (this.editItem.showSubTitle === 0 && this.editItem.subTitle === '') {
        status = false
        message = this.$i18n.t('pcdecorate.disCountForm.warning2')
      } else if (this.editItem.goodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.disCountForm.warning3')
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
      return this.disCountForm
    },
        // 主标题限制小数
    mainChange (val) {
      return this.disCountForm.mainFontSize = Math.floor(val)
    },
        // 副标题限制小数
    subChange (val) {
      return this.disCountForm.subFontSize = Math.floor(val)
    },
        // 上边距限制小数
    topChange (val) {
      return this.disCountForm.marginTop = Math.floor(val)
    },
        // 下边距限制小数
    bottomChange (val) {
      return this.disCountForm.marginBottom = Math.floor(val)
    }
  },
  watch: {
    disCountForm: { // 监听信息的改变
      handler (newVal, oldVal) {
        let obj = {
          type: 'discount_coupon',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听当前是否已经配置
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'discount_coupon') {
          if (JSON.stringify(newVal.config) != '{}') {
            let obj = {...newVal.config}
            this.disCountForm = obj
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
.limit-skill-config {
    .config-items {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .items-content {
            display: flex;
            align-items: center;
            .title {
                width: 70px;
            }
            .right-select {
                width: calc(100% - 70px);
            }
        }
    }
}
</style>
<style lang="scss">
.limit-skill-config {
    .el-input__inner {
        height: 32px;
    }
}
</style>