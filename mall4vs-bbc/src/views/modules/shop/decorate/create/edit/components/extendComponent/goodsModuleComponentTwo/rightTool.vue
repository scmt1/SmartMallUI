<template>
    <div class="goods-moduleOne">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule2.customTitle`)}}</div>
            <el-input maxlength="15" v-model.trim="goodsForm.title" :placeholder="$t(`pcdecorate.goodsModule2.placeholder`)"></el-input>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule2.titleLink`)}}</div>
            <redirect-nav
                :selectedLink="goodsForm.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handleNavSelect="handleNavSelect"
                @handleRemoveSelected="handleRemoveSelected">
            </redirect-nav>
        </div>
        <div class="config-items">
            <div class="title" style="margin-bottom: 15px">{{$t(`pcdecorate.goodsModule2.addMainGoods`)}}</div>
            <select-goods-component
                :goodsList="goodsForm.maingoodsList"
                :addLength="mainLength"
                @handleAddClick="handleMainClick"
                @handleRemove="handleRemoveMain">
            </select-goods-component>
        </div>
        <div class="config-items">
            <div class="title" style="margin-bottom: 15px">{{$t(`pcdecorate.goodsModule2.addOtherGoods`)}}</div>
            <select-goods-component
                :goodsList="goodsForm.othergoodsList"
                :addLength="addLength"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
        </div>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="currentSelectType"
          :goodsNumber="goodsNumber"
          :isMulilt="isMulilt"
          :echoDataList="echoDataList"
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
      goodsForm: {
        title: '', // 自定义标题
        path: {
          name: '', // 链接名
          link: '', // 链接地址
          type: '' // 链接的类型
        }, // 标题链接
        maingoodsList: [], // 主商品
        othergoodsList: [] // 其他商品
      },
      dialogVisible: false, // 弹窗是否显示
      mainLength: 1, // 主商品限制个数
      addLength: 6, // 其他商品限制个数
      currentSelectType: [], // 当前允许选择的类型
      types: '', // 当前是主商品添加，还是其他商品添加
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      currentClickType: '', // 当前点击的类型
      isMulilt: false, // 是否允许多选
      goodsNumber: 0, // 限制商品的数量
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 选择标题链接
    handleNavSelect () {
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.dialogVisible = true
      this.currentClickType = 'titles'
      this.isMulilt = false // 不能多选
      this.echoDataList = []
    },
        // 删除标题链接
    handleRemoveSelected () {
      this.goodsForm.path.name = ''
      this.goodsForm.path.link = ''
      this.goodsForm.path.type = ''
    },
        // 关闭弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (this.currentClickType === 'titles') { // 当前选择的是标题
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
        } else if (type === '6') { // 当前选择的是自定义链接
          this.$set(this.goodsForm.path, 'name', value.customLink)
          this.$set(this.goodsForm.path, 'link', value.customLink)
          this.$set(this.goodsForm.path, 'type', '6')
        }
      } else if (this.currentClickType === 'goods') { // 当前选择的是商品
        if (type === '1') {
          if (this.types === 'main') {
            this.goodsForm.maingoodsList = []
            this.goodsForm.maingoodsList.push({
              name: value.goodsItem.prodName, // 商品名称
              id: value.goodsItem.prodId, // 商品id
              prodType: value.goodsItem.prodType, // 商品状态类型
              price: value.goodsItem.price, // 商品价格
              status: value.goodsItem.status, // 商品状态
              orignPrice: value.goodsItem.oriPrice, // 商品原价
              imgs: value.goodsItem.pic, // 商品图片
              description: value.goodsItem.brief // 商品描述
            })
          } else if (this.types === 'other') {
            this.goodsForm.othergoodsList = []
            value.goodsItem.forEach(item => {
              this.goodsForm.othergoodsList.push({
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
      }
      this.dialogVisible = false
    },
        // 添加主商品
    handleMainClick () {
      this.currentClickType = 'goods'
      this.currentSelectType = [1] // 表示当前只能选择商品，不能选择其他类型
      this.dialogVisible = true // 弹窗显示
      this.types = 'main'
      this.isMulilt = false // 主商品不允许多选
      this.echoDataList = []
      this.goodsForm.maingoodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 移除主商品
    handleRemoveMain (index) {
      this.goodsForm.maingoodsList.splice(index, 1)
    },
        // 添加商品
    handleAddClick () {
      this.currentClickType = 'goods'
      this.currentSelectType = [1] // 表示当前只能选择商品，不能选择其他类型
      this.dialogVisible = true
      this.types = 'other'
      this.isMulilt = true // 其他商品允许多选
      this.goodsNumber = 6  // 限制多选的长度
      this.echoDataList = []
      this.goodsForm.othergoodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 移除其他商品
    handleRemove (index) {
      this.goodsForm.othergoodsList.splice(index, 1)
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule2.warning1')
      } else if (this.editItem.title === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule2.warning2')
      } else if (this.editItem.path.name === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule2.warning3')
      } else if (this.editItem.maingoodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule2.warning4')
      } else if (this.editItem.othergoodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule2.warning5')
      } else {
        status = true
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
        let obj = {
          type: 'goods_module2',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听信息回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'goods_module2') {
          if (JSON.stringify(newVal.config) != '{}') {
            this.goodsForm = {...newVal.config}
          } else {
            this.goodsForm = {
              title: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 自定义标题
              path: {
                name: '', // 链接名
                link: '', // 链接地址
                type: '' // 链接的类型
              }, // 标题链接
              maingoodsList: [], // 主商品
              othergoodsList: [] // 其他商品
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-moduleOne {
    margin-top: 10px;
    .config-items {
        margin-bottom: 20px;
        .title {
            margin-bottom: 12px;
        }
        .items-content {
            display: flex;
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