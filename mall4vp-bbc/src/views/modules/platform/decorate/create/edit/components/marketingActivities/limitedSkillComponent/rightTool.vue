<template>
    <div class="limit-skill-config">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.showSubTitle`)}}</div>
        </div>
        <div class="config-items">
            <div class="title-input">
                <el-radio-group v-model="limitSkillForm.showSubTitle" style="display: flex;margin-bottom: 20px">
                   <el-radio :label="0">{{$t(`pcdecorate.storeList.show`)}}</el-radio>
                   <el-radio :label="1">{{$t(`pcdecorate.storeList.hide`)}}</el-radio>
               </el-radio-group>
                <el-input v-show="limitSkillForm.showSubTitle === 0" v-model="limitSkillForm.subTitle"></el-input>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsList.showContent`)}}</div>
        </div>
        <div class="config-items">
            <div class="title-checkbox">
               <el-checkbox-group v-model="limitSkillForm.showContent" style="display: flex;">
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
                :defineColor="limitSkillForm.mainTextColor"
                @handleChangeColor="handleMainTitleColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.subTitleColor`)}}</div>
        </div>
        <div class="config-items">
            <pick-color-component
                :defineColor="limitSkillForm.subTextColor"
                :resetColor="'rgba(153, 153, 153, 1)'"
                @handleChangeColor="handleSubTitleColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.titleBgColor`)}}</div>
        </div>
        <div class="config-items">
            <pick-color-component
                :defineColor="limitSkillForm.bgColor"
                :resetColor="'rgba(244, 244, 244, 1)'"
                @handleChangeColor="handleBgColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.titleSize`)}}</div>
                <div class="right-select">
                    <el-slider :min="12" :max="40" v-model="limitSkillForm.mainFontSize" show-input @change="mainChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.subTitleSize`)}}</div>
                <div class="right-select">
                    <el-slider :min="12" :max="40" v-model="limitSkillForm.subFontSize" show-input @change="subChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginTop`)}}</div>
                <div class="right-select">
                    <el-slider :min="0" :max="100" v-model="limitSkillForm.marginTop" show-input @change="topChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginBottom`)}}</div>
                <div class="right-select">
                    <el-slider :min="0" :max="100" v-model="limitSkillForm.marginBottom" show-input @change="bottomChange"></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsList.addgoods`)}}</div>
        </div>
        <div class="config-items">
            <select-goods-component
                :goodsList="limitSkillForm.goodsList"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
        </div>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="[1]"
          :goodsType="2"
          :isMulilt="true"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import pickColorComponent from '../../../../commonComponent/pickColor/index.vue'
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue'
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
    editItem: { // 已经配置的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      limitSkillForm: {
        showSubTitle: 0, // 显示副标题
        subTitle: '', // 副标题的内容
        showContent: ['0', '1', '2'], // 显示内容
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字
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
      this.limitSkillForm = {
        showSubTitle: 0, // 显示副标题
        subTitle: this.$t('pcdecorate.limitedSkill.subTitle'), // 副标题的内容
        showContent: ['0', '1', '2'], // 显示内容
        mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
        subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字
        bgColor: 'rgba(244, 244, 244, 1)', // 标题背景颜色
        mainFontSize: 24, // 主标题字号
        subFontSize: 12, // 副标题字号
        marginTop: 30, // 上边距
        marginBottom: 20, // 下边距
        goodsList: []
      }
    },
        // 标题的文字颜色
    handleMainTitleColor (color) {
      this.limitSkillForm.mainTextColor = color
    },
        // 副标题文字颜色
    handleSubTitleColor (color) {
      this.limitSkillForm.subTextColor = color
    },
        // 标题的背景颜色
    handleBgColor (color) {
      this.limitSkillForm.bgColor = color
    },
        // 添加商品
    handleAddClick () {
      this.dialogVisible = true
      this.echoDataList = []
      this.limitSkillForm.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRemove (index) {
      this.limitSkillForm.goodsList.splice(index, 1)
    },
        // 关闭弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') { // 表示当前选择的是商品
        this.limitSkillForm.goodsList = []
        value.goodsItem.forEach(item => {
          this.limitSkillForm.goodsList.push({
            name: item.prodName, // 商品名称
            prodType: item.prodType, // 商品状态类型
            id: item.activityId, // 活动id
            prodId: item.prodId, // 商品id
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
        message = this.$i18n.t('pcdecorate.limitedSkill.warning1')
      } else if (this.editItem.showSubTitle == 0 && this.editItem.subTitle == '') {
        status = false
        message = this.$i18n.t('pcdecorate.limitedSkill.warning2')
      } else if (this.editItem.goodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.limitedSkill.warning3')
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
      return this.limitSkillForm
    },
        // 主标题限制输入小数
    mainChange (val) {
      return this.limitSkillForm.mainFontSize = Math.floor(val)
    },
        // 副标题限制输入小数
    subChange (val) {
      return this.limitSkillForm.subFontSize = Math.floor(val)
    },
        // 上边距限制输入小数
    topChange (val) {
      return this.limitSkillForm.marginTop = Math.floor(val)
    },
        // 下边距限制输入小数
    bottomChange (val) {
      return this.limitSkillForm.marginBottom = Math.floor(val)
    }
  },
  watch: {
    limitSkillForm: { // 监听配置信息的改变
      handler (newVal, oldVal) {
        let obj = {
          type: 'limited_skill',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听数据回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'limited_skill') {
          if (JSON.stringify(newVal.config) != '{}') {
            let obj = {...newVal.config}
            this.limitSkillForm = obj
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