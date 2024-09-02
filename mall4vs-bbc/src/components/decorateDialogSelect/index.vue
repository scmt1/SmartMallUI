<template>
  <div class="dialog-message-content">
    <dialog-component
      :dialogVisible="dialogVisible"
      :dialogWidth="'914px'"
      @handleClose="handleClose">
      <div slot="title">
        <el-tabs v-model="activeName" class="dialog-tab-pc">
          <el-tab-pane
            v-for="item in switchTitleData"
            :label="item.title"
            :key="item.id"
            :name="item.id">
            <component
              ref="tabbarRef"
              :activeName="activeName"
              :is="item.components"
              :deviceType="deviceType"
              :goodsType="goodsType"
              :isMulilt="isMulilt"
              :goodsNumber="goodsNumber"
              :prodType="prodType"
              :echoDataList="echoDataList"
              :dataUrl="dataUrl"
              :customLinkArr="customLinkArr"
              @handleGoodsSelect="handleGoodsSelect">
            </component>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template slot="footers">
        <el-button size="small" @click="handleClose">{{$t('pcdecorate.commonModal.cancel')}}</el-button>
        <el-button size="small" type="primary" @click="handleSure">{{$t('pcdecorate.commonModal.sure')}}</el-button>
      </template>
      </dialog-component>
  </div>
</template>
<script>
import DialogComponent from '@/components/DialogComponent/index.vue' // 弹窗公共组件
import goodsComponent from './components/goodsComponent/index.vue' // 商品组件
import categoryComponent from './components/categoryComponent/index.vue' // 分类组件
import storeComponent from './components/storeComponent/index.vue' // 店铺组件
import pageComponent from './components/pageComponent/index.vue' // 页面组件
import smallPageComponent from './components/smallPageComponent/index.vue' // 微页面组件
import customComponent from './components/customComponent/index.vue' // 自定义链接
import couponComponent from './components/couponComponent/index.vue' // 优惠券组件
export default {
  components: {
    DialogComponent,
    goodsComponent,
    categoryComponent,
    storeComponent,
    pageComponent,
    smallPageComponent,
    customComponent,
    couponComponent
  },
  props: {
    dialogVisible: { // 弹窗是否显示
      type: Boolean,
      default: () => false
    },
    currentSelectType: { // 当前可选择的类型
      type: Array,
      default: () => []
    },
    goodsType: { // 查询的商品类型
      type: String | Number,
      default: () => ''
    },
    isMulilt: { // 是否支持多选
      type: Boolean,
      default: () => false
    },
    goodsNumber: { // 限制添加的个数
      type: Number | String,
      default: () => 0
    },
    deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
      type: String,
      default: () => 'pc'
    },
    prodType: { // 类型
      type: Number
    },
    dataUrl: { // 活动的url
      type: String
    },
    echoDataList: { // 回显数据
      type: Array,
      default: () => []
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      activeName: '', // 当前激活哪个tabbar
      switchTitleData: [], // 弹窗的列表
      titleArr: [ // 对应的标题组件
        { title: this.$i18n.t('pcdecorate.commonModal.goods'), id: '1', components: 'goodsComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.category'), id: '2', components: 'categoryComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.store'), id: '3', components: 'storeComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.page'), id: '4', components: 'pageComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.smallPage'), id: '5', components: 'smallPageComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.customLink'), id: '6', components: 'customComponent'},
        { title: this.$i18n.t('pcdecorate.commonModal.coupon'), id: '7', components: 'couponComponent'},
      ],
      currentSelectedObj: { // 选择信息
        goodsItem: {}, // 选中的商品
        categoryItem: {}, // 选中的分类
        storeItem: {}, // 选中的店铺
        pageItem: {}, // 选中的页面
        smallPageItem: {}, // 选中的微页面
        customLink: '', // 自定义链接
        couponItem: {} //选中的优惠券
      }
    }
  },
  methods: {
    // 弹窗关闭
    handleClose () {
      this.$emit('handleClose')
      setTimeout(() => {
        this.activeName = ''
      }, 500)
    },
    // 选中的数据
    handleGoodsSelect ({type, value}) {
      this.currentSelectedObj[type] = value
    },
    // 弹窗确定
    handleSure () {
      if (this.currentSelectType.indexOf(Number(this.activeName)) == -1) {
        return this.$message.warning('不支持选择当前的类型，请切换到符合的类型')
      }
      if (this.handleIsValidate(this.activeName)) {
        if (this.activeName === '6') {
          return this.$message.warning(this.$t('pcdecorate.commonModal.customLinkTips'))
        } else {
          return this.$message.warning(this.$t('pcdecorate.commonModal.selectTypeTips'))
        }
      }
      this.$emit('handleDialogSubmit', { type: this.activeName, value: this.currentSelectedObj})
      setTimeout(() => {
        this.activeName = ''
      }, 500)
    },
    // 弹窗验证
    handleIsValidate (active) {
      switch (active) {
        case '1': // 商品
          return this.isDataValidate(this.currentSelectedObj.goodsItem)
        case '2': // 分类
          return this.isDataValidate(this.currentSelectedObj.categoryItem)
        case '3': // 店铺
          return this.isDataValidate(this.currentSelectedObj.storeItem)
        case '4': // 页面
          return this.isDataValidate(this.currentSelectedObj.pageItem)
        case '5': // 微页面
          return this.isDataValidate(this.currentSelectedObj.smallPageItem)
        case '6': // 自定义链接
          return this.isDataValidate(this.currentSelectedObj.customLink)
        case '7': // 优惠券
          return this.isDataValidate(this.currentSelectedObj.couponItem)
        default:
          break
      }
    },
    // 判断是否符合
    isDataValidate (val) {
      let status = true
      if (JSON.stringify(val) === '{}' || val == undefined || val == null || val == '') {
        status = true
      } else {
        status = false
      }
      return status
    }
  },
  watch: {
    dialogVisible (val) { // 监听弹窗是否显示
      if (val) {
        let newArr = []
        if (this.currentSelectType && Array.isArray(this.currentSelectType)) {
          this.currentSelectType.forEach(item => {
            this.titleArr.forEach(ele => {
              if (Number(item) === Number(ele.id)) {
                newArr.push(ele)
              }
            })
          })
          this.switchTitleData = newArr
        }
        this.$nextTick(() => {
          if (this.customLinkArr && this.customLinkArr.type != '') { // 判断如果在操作热区
            this.activeName = this.customLinkArr.type
          } else {
            this.activeName = this.switchTitleData[0].id || '1' // 进来默认激活第一个
          }
          this.$refs.tabbarRef && this.$refs.tabbarRef[0].$refs.multipTable.clearSelection()
        })
        this.currentSelectedObj = {
          goodsItem: {}, // 选中的商品
          categoryItem: {}, // 选中的分类
          storeItem: {}, // 选中的店铺
          pageItem: {}, // 选中的页面
          smallPageItem: {}, // 选中的微页面
          customLink: '', // 自定义链接
          couponItem: {}, // 选中的优惠券
        }
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-tab-pc {
  width: 100%;
  .el-tabs__header {
    margin: 0 0 20px;
    .el-tabs__nav-scroll {
      height: 56px;
      line-height: 56px;
      .el-tabs__nav {
        margin-left: 40px;
      }
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  .el-tabs__item {
    padding: 0 31px;
  }
}
</style>
