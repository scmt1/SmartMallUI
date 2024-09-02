<template>
    <div class="goods-moduleOne">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule1.select`)}}</div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 1}" @click="handleClick(1)"></div>
                <div :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 2}" @click="handleClick(2)"></div>
                <div :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 3}" @click="handleClick(3)"></div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule1.mainTitle`)}}</div>
        </div>
        <div class="config-items">
            <el-input maxlength="8" v-model.trim="goodsOneForm.mainTitle" ></el-input>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule1.subTitle`)}}</div>
        </div>
        <div class="config-items">
            <el-input maxlength="14" v-model.trim="goodsOneForm.subTitle" ></el-input>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule1.titleLink`)}}</div>
        </div>
        <div class="config-items">
            <redirectNav
                :placeholder="$t('pcdecorate.placeholder.link')"
                :selectedLink="goodsOneForm.titleLink.name"
                @handleNavSelect="handleNavSelect"
                @handleRemoveSelected="handleRemoveSelected">
            </redirectNav>
        </div>
        <div class="config-items">
            <div class="title" style="margin-bottom: 20px">{{$t(`pcdecorate.goodsList.addgoods`)}}(最多添加3个)</div>
            <select-goods-component
                :goodsList="goodsOneForm.goodsList"
                :addLength="addLength"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
        </div>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="currentSelectType"
          :isMulilt="isMulilt"
          :echoDataList="echoDataList"
          :goodsNumber="goodsNumber"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import redirectNav from '../../../../commonComponent/redirectNav/index.vue'
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  components: {
    redirectNav,
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
      goodsOneForm: {
        currentIndex: 1, // 当前选择哪列
        mainTitle: '', // 当前主标题
        subTitle: '', // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      },
      dialogVisible: false, // 弹窗显示隐藏
      addLength: 3, // 限制选择商品的个数
      currentSelectType: [], // 当前限制的类型
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      leftConfig: {}, // 左边配置信息
      centerConfig: {}, // 中间配置信息
      rightConfig: {}, // 右边配置信息
      currentClickType: '', // 当前点击的类型，判断点击的是商品，还是标题链接
      goodsNumber: 0, // 限制商品的数量
      isMulilt: false, // 是否允许多选
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
    init () {
      this.leftConfig = {
        currentIndex: 1, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
      this.goodsOneForm = this.leftConfig // 默认选中第一列
      this.rightConfig = {
        currentIndex: 3, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
      this.centerConfig = {
        currentIndex: 2, // 当前选择哪列
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 当前主标题
        subTitle: this.$t('pcdecorate.goodsModule1.subTitleCon'), // 副标题
        titleLink: {
          name: '', // 跳转的名字
          link: '' // 跳转的链接
        }, // 标题跳转的链接
        goodsList: [] // 商品
      }
    },
        // 清空值
    clearValues () {
      this.goodsOneForm = {
        currentIndex: 1,
        mainTitle: '',
        subTitle: '',
        titleLink: {
          name: '',
          link: '',
          type: ''
        },
        goodsList: []
      }
    },
        // 当前点击了哪列
    handleClick (val) {
            // 先清空所有的值
      this.clearValues()
      if (val === 1) { // 左边商品列表
        if (JSON.stringify(this.leftConfig) != '{}') {
          this.goodsOneForm = {...this.leftConfig}
        }
      } else if (val === 2) { // 中间商品列表
        if (JSON.stringify(this.centerConfig) != '{}') {
          this.goodsOneForm = {...this.centerConfig}
        }
      } else if (val === 3) { // 右边商品列表
        if (JSON.stringify(this.rightConfig) != '{}') {
          this.goodsOneForm = {...this.rightConfig}
        }
      }
      this.goodsOneForm.currentIndex = val
    },
        // 添加商品
    handleAddClick () {
      this.currentSelectType = [1]
      this.currentClickType = 'goods'
      this.dialogVisible = true
      this.isMulilt = true
      this.goodsNumber = 3 // 限制选中商品的数量
      this.echoDataList = []
      if (this.goodsOneForm.currentIndex == 1) { // 左边部分
        this.leftConfig.goodsList.forEach(item => {
          this.echoDataList.push(item)
        })
      } else if (this.goodsOneForm.currentIndex == 2) { // 中间部分
        this.centerConfig.goodsList.forEach(item => {
          this.echoDataList.push(item)
        })
      } else if (this.goodsOneForm.currentIndex == 3) { // 右边部分
        this.rightConfig.goodsList.forEach(item => {
          this.echoDataList.push(item)
        })
      }
    },
        // 移除商品
    handleRemove (index) {
      this.goodsOneForm.goodsList.splice(index, 1)
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (this.currentClickType === 'title') { // 如果当前点击的是标题选中
        if (type === '1') { // 当前选择的是商品
          this.$set(this.goodsOneForm.titleLink, 'name', value.goodsItem.prodName)
          this.$set(this.goodsOneForm.titleLink, 'link', value.goodsItem.prodId)
          this.$set(this.goodsOneForm.titleLink, 'type', '1')
        } else if (type === '2') { // 当前选择的是分类
          this.$set(this.goodsOneForm.titleLink, 'name', value.categoryItem.label)
          this.$set(this.goodsOneForm.titleLink, 'link', value.categoryItem.data)
          this.$set(this.goodsOneForm.titleLink, 'type', '2')
        } else if (type === '3') { // 当前选择的是店铺
          this.$set(this.goodsOneForm.titleLink, 'name', value.storeItem.shopName)
          this.$set(this.goodsOneForm.titleLink, 'link', value.storeItem.shopId)
          this.$set(this.goodsOneForm.titleLink, 'type', '3')
        } else if (type === '4') { // 当前选择的是页面
          this.$set(this.goodsOneForm.titleLink, 'name', value.pageItem.title)
          this.$set(this.goodsOneForm.titleLink, 'link', value.pageItem.link)
          this.$set(this.goodsOneForm.titleLink, 'type', '4')
        } else if (type === '5') { // 当前选择的是微页面
          this.$set(this.goodsOneForm.titleLink, 'name', value.smallPageItem.name)
          this.$set(this.goodsOneForm.titleLink, 'link', [value.smallPageItem.renovationId, value.smallPageItem.shopId])
          this.$set(this.goodsOneForm.titleLink, 'type', '5')
        } else if (type === '6') { // 自定义链接
          this.$set(this.goodsOneForm.titleLink, 'name', value.customLink)
          this.$set(this.goodsOneForm.titleLink, 'link', value.customLink)
          this.$set(this.goodsOneForm.titleLink, 'type', '6')
        }
      } else if (this.currentClickType === 'goods') { // 如果当前点击的是商品选中
        this.goodsOneForm.goodsList = []
        if (type === '1') {
          value.goodsItem.forEach(item => {
            this.goodsOneForm.goodsList.push({
              name: item.prodName, // 商品名称
              id: item.prodId, // 商品id
              prodType: item.prodType, // 商品状态类型
              price: item.price, // 商品价格
              status: item.status, // 商品状态
              orignPrice: item.oriPrice, // 商品原价
              imgs: item.pic, // 商品图片
              description: item.brief // 商品描述
            })
          })
        }
      }
      this.dialogVisible = false
    },
        // 标题链接
    handleNavSelect () {
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.currentClickType = 'title'
      this.dialogVisible = true
      this.isMulilt = false
      this.echoDataList = []
    },
        // 删除标题链接
    handleRemoveSelected () {
      this.goodsOneForm.titleLink.name = ''
      this.goodsOneForm.titleLink.link = ''
      this.goodsOneForm.titleLink.type = ''
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) != '{}') {
        if (JSON.stringify(this.editItem.leftConfig) != '{}' && JSON.stringify(this.editItem.centerConfig) != '{}' && JSON.stringify(this.editItem.rightConfig) != '{}') {
          if (this.editItem.leftConfig.mainTitle == '' || this.editItem.centerConfig.mainTitle == '' || this.editItem.rightConfig.mainTitle == '') {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule1.warning2')
          } else if (this.editItem.leftConfig.subTitle == '' || this.editItem.centerConfig.subTitle == '' || this.editItem.rightConfig.subTitle == '') {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule1.warning3')
          } else if (this.editItem.leftConfig.titleLink.name == '' || this.editItem.centerConfig.titleLink.name == '' || this.editItem.rightConfig.titleLink.name == '') {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule1.warning4')
          } else if (this.editItem.leftConfig.goodsList.length == 0 || this.editItem.centerConfig.goodsList.length == 0 || this.editItem.rightConfig.goodsList.length == 0) {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule1.warning5')
          } else {
            status = true
          }
        } else {
          status = false
          message = this.$i18n.t('pcdecorate.goodsModule1.warning1')
        }
      } else {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule1.warning1')
      }
      return {
        status: status,
        message: message
      }
    }
  },
  watch: {
    goodsOneForm: { // 监听配置信改变
      handler (newVal, oldVal) {
        if (this.goodsOneForm.currentIndex === 1) {
          this.leftConfig = {...newVal}
        } else if (this.goodsOneForm.currentIndex === 2) {
          this.centerConfig = {...newVal}
        } else if (this.goodsOneForm.currentIndex === 3) {
          this.rightConfig = {...newVal}
        }
        let obj = {
          type: 'goods_module1',
          ref: this.currentRef,
          config: {
            leftConfig: this.leftConfig,
            centerConfig: this.centerConfig,
            rightConfig: this.rightConfig
          }
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听组件的回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'goods_module1') {
          if (JSON.stringify(newVal.config) != '{}') {
            if (JSON.stringify(newVal.config.leftConfig) != '{}') {
              this.leftConfig = {...newVal.config.leftConfig}
                            // 默认选中第一个
              this.goodsOneForm = {...newVal.config.leftConfig}
            }
            if (JSON.stringify(newVal.config.centerConfig) != '{}') {
              this.centerConfig = {...newVal.config.centerConfig}
            }
            if (JSON.stringify(newVal.config.rightConfig) != '{}') {
              this.rightConfig = {...newVal.config.rightConfig}
            }
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
.goods-moduleOne {
    .config-items {
        margin-bottom: 20px;
        .items-content {
            width: 100%;
            height: 108px;
            display: flex;
            .items-rows {
                width: 33.3%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #DCDFE6;
                background: rgba(255, 255, 255, 0.39);
                cursor: pointer;
                &:nth-child(1) {
                    border-right: none;
                }
                &:nth-child(2) {
                    border-right: none;
                }
                &:hover {
                    background: rgba(21, 91, 212, 0.04);
                    border: 1px solid #155BD4;
                }
                &.active {
                    background: rgba(21, 91, 212, 0.04);
                    border: 1px solid #155BD4;
                }
            }
        }
        .link-list {
            position: relative;
            width: 100%;
            height: 32px;
            border: 1px solid #DCDFE6;
            border-radius: 3px;
            .link-img {
                position: absolute;
                right: 2px;
                top: 5px;
                cursor: pointer;
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>
<style lang="scss">
.goods-moduleOne {
    .el-input__inner {
        height: 32px;
    }
}
</style>