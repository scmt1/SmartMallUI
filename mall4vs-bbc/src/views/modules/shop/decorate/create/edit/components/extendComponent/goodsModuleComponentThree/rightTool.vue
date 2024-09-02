<template>
    <div class="goods-moduleOne">
        <div class="config-items">
            <div class="title" style="margin-bottom: 18px">{{$t(`pcdecorate.goodsModule1.select`)}}</div>
            <div class="items-content">
                <div :class="{'items-rows': true , 'active': goodsForm.currentIndex === 1}" @click="handleClick(1)"></div>
                <div :class="{'items-rows': true , 'active': goodsForm.currentIndex === 2}" @click="handleClick(2)"></div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule2.customTitle`)}}</div>
            <el-input maxlength="8" v-model.trim="goodsForm.title"></el-input>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule2.titleLink`)}}</div>
            <redirectNav
                :placeholder="$t('pcdecorate.placeholder.link')"
                :selectedLink="goodsForm.path.name"
                @handleNavSelect="handleNavSelect"
                @handleRemoveSelected="handleRemoveSelected">
            </redirectNav>
        </div>
        <div class="config-items" style="margin-top: 30px">
            <div class="title" style="margin-bottom: 15px">{{$t(`pcdecorate.goodsModule3.addOtherGoods`)}}</div>
            <select-goods-component
                :goodsList="goodsForm.goodsList"
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
import redirectNav from '../../../../commonComponent/redirectNav/index.vue' // 链接跳转组件
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue' // 选择商品组件
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
    currentItem: { // 点击当前组件的配置
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
      goodsForm: {
        currentIndex: 1, // 当前选中哪列
        title: '', // 自定义标题
        path: {
          name: '', // 链接名
          link: '', // 链接地址
          type: '' // 链接类型
        }, // 标题链接
        goodsList: [] // 商品
      },
      dialogVisible: false, // 商品弹窗是否显示
      currentSelectType: [], // 当前限制选的类型
      addLength: 3, // 限制商品选择的个数
      leftConfigMessage: {}, // 左列表配置信息
      rightConfigMessage: {}, // 右列表配置信息
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      currentClickType: '', // 当前点击的类型
      goodsNumber: 0, // 限制商品的数量
      isMulilt: false, // 是否允许多选
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
    init () {
      this.leftConfigMessage = {
        currentIndex: 1, // 当前选中哪列
        title: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 自定义标题
        path: {
          name: '', // 链接名
          link: '', // 链接地址
          type: '' // 链接类型
        }, // 标题链接
        goodsList: [] // 商品
      }
      this.goodsForm = this.leftConfigMessage
      this.rightConfigMessage = {
        currentIndex: 2, // 当前选中哪列
        title: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 自定义标题
        path: {
          name: '', // 链接名
          link: '', // 链接地址
          type: '' // 链接类型
        }, // 标题链接
        goodsList: [] // 商品
      }
    },
        // 清空数据
    clearValues () {
      this.goodsForm = {
        currentIndex: 1,
        title: '',
        path: {
          name: '',
          link: '',
          type: ''
        },
        goodsList: []
      }
    },
        // 点击列数
    handleClick (val) {
      this.clearValues()
      if (val === 1) { // 左边列表
        if (JSON.stringify(this.leftConfigMessage) != '{}') {
          this.goodsForm = {...this.leftConfigMessage}
        }
      } else if (val === 2) { // 右边列表
        if (JSON.stringify(this.rightConfigMessage) != '{}') {
          this.goodsForm = {...this.rightConfigMessage}
        }
      }
      this.goodsForm.currentIndex = val
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (this.currentClickType === 'titles') { // 当前属于选择标题类型
        if (type === '1') { // 当前选择的是商品
          this.$set(this.goodsForm.path, 'name', value.goodsItem.prodName)
          this.$set(this.goodsForm.path, 'link', value.goodsItem.prodId)
          this.$set(this.goodsForm.path, 'type', '1')
        } else if (type === '2') { // 当前选择的是分类
          this.$set(this.goodsForm.path, 'name', value.categoryItem.label)
          this.$set(this.goodsForm.path, 'link', value.categoryItem.data)
          this.$set(this.goodsForm.path, 'type', '2')
        } else if (type === '3') { // 当前选择的是店铺
          this.$set(this.goodsForm.path, 'name', value.storeItem.shopName)
          this.$set(this.goodsForm.path, 'link', value.storeItem.shopId)
          this.$set(this.goodsForm.path, 'type', '3')
        } else if (type === '4') { // 当前选择的是页面
          this.$set(this.goodsForm.path, 'name', value.pageItem.title)
          this.$set(this.goodsForm.path, 'link', value.pageItem.link)
          this.$set(this.goodsForm.path, 'type', '4')
        } else if (type === '5') { // 当前选择的是微页面
          this.$set(this.goodsForm.path, 'name', value.smallPageItem.name)
          this.$set(this.goodsForm.path, 'link', [value.smallPageItem.renovationId, value.smallPageItem.shopId])
          this.$set(this.goodsForm.path, 'type', '5')
        } else if (type === '6') { // 自定义链接
          this.$set(this.goodsForm.path, 'name', value.customLink)
          this.$set(this.goodsForm.path, 'link', value.customLink)
          this.$set(this.goodsForm.path, 'type', '6')
        }
      } else if (this.currentClickType === 'goods') { // 当前属于选择商品类型
        if (type === '1') { // 当前选择的是商品
          this.goodsForm.goodsList = []
          value.goodsItem.forEach(item => {
            this.goodsForm.goodsList.push({
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
        // 添加商品
    handleAddClick () {
      this.currentClickType = 'goods'
      this.currentSelectType = [1]
      this.dialogVisible = true
      this.isMulilt = true // 商品允许多选
      this.goodsNumber = 3 // 限制选的数量
      this.echoDataList = []
      if (this.goodsForm.currentIndex == 1) { // 左边列表
        this.leftConfigMessage.goodsList.forEach(item => {
          this.echoDataList.push(item)
        })
      } else if (this.goodsForm.currentIndex === 2) { // 右边列表
        this.rightConfigMessage.goodsList.forEach(item => {
          this.echoDataList.push(item)
        })
      }
    },
        // 删除商品
    handleRemove (index) {
      this.goodsForm.goodsList.splice(index, 1)
    },
        // 选择标题链接
    handleNavSelect () {
      this.currentClickType = 'titles'
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.dialogVisible = true
      this.isMulilt = false // 禁止多选
      this.echoDataList = []
    },
        // 删除标题链接
    handleRemoveSelected () {
      this.goodsForm.path.name = ''
      this.goodsForm.path.link = ''
      this.goodsForm.path.type = ''
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) != '{}') {
        if (JSON.stringify(this.editItem.leftConfig) != '{}' && JSON.stringify(this.editItem.rightConfig) != '{}') {
          if (this.editItem.leftConfig.title === '' || this.editItem.rightConfig.title === '') {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule3.warning2')
          } else if (this.editItem.leftConfig.path.name == '' || this.editItem.rightConfig.path.name == '') {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule3.warning3')
          } else if (this.editItem.leftConfig.goodsList.length == 0 || this.editItem.rightConfig.goodsList.length == 0) {
            status = false
            message = this.$i18n.t('pcdecorate.goodsModule3.warning4')
          } else {
            status = true
          }
        } else {
          status = false
          message = this.$i18n.t('pcdecorate.goodsModule3.warning1')
        }
      } else {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule3.warning1')
      }
      return {
        status: status,
        message: message
      }
    }
  },
  watch: {
    goodsForm: { // 监听配置信息改变
      handler (newVal, oldVal) {
        if (this.goodsForm.currentIndex === 1) {
          this.leftConfigMessage = {...newVal}
        } else if (this.goodsForm.currentIndex === 2) {
          this.rightConfigMessage = {...newVal}
        }
        let obj = {
          type: 'goods_module3',
          ref: this.currentRef,
          config: {
            leftConfig: this.leftConfigMessage,
            rightConfig: this.rightConfigMessage
          }
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: {
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'goods_module3') {
          if (JSON.stringify(newVal.config) != '{}') {
            if (JSON.stringify(newVal.config.leftConfig) != '{}') {
              this.leftConfigMessage = {...newVal.config.leftConfig}
                            // 默认选中第一个
              this.goodsForm = {...newVal.config.leftConfig}
            }
            if (JSON.stringify(newVal.config.rightConfig) != '{}') {
              this.rightConfigMessage = {...newVal.config.rightConfig}
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
        .title {
            margin-bottom: 12px;
        }
        .items-content {
            width: 100%;
            height: 108px;
            display: flex;
            .items-rows {
                width: 50%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #DCDFE6;
                background: rgba(255, 255, 255, 0.39);
                cursor: pointer;
                &:nth-child(1) {
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