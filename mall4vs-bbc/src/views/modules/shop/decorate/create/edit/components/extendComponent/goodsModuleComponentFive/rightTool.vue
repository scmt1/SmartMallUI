<template>
    <div class="goods-moduleFive-config">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule5.addMain`)}}</div>
        </div>
        <div class="config-items">
            <div class="items-content">
                <div class="item-left">
                    <div class="item-operation" v-if="goodsForm.bgImg === ''" @click="handleAddImg">
                        <span>+</span>
                        <span>{{$t(`pcdecorate.goodsModule5.addImage`)}}</span>
                    </div>
                    <div class="item-operation has-bg" v-else>
                        <el-image :src="goodsForm.bgImg" fit="fill">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <i class="icon-error" @click="hanldeBgRemove">x</i>
                    </div>
                </div>
                <div class="item-right">
                    <div class="title">{{$t(`pcdecorate.goodsModule5.link`)}}</div>
                    <redirect-nav
                        style="width: 210px"
                        :placeholder="$t('pcdecorate.placeholder.link')"
                        :selectedLink="goodsForm.path.name"
                        @handleNavSelect="handleNavSelect"
                        @handleRemoveSelected="handleRemoveSelected">
                    </redirect-nav>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="title" style="margin-bottom: 15px">{{$t(`pcdecorate.goodsModule5.addGoods`)}}</div>
            <select-goods-component
                :goodsList="goodsForm.goodsList"
                :addLength="addLength"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
        </div>
        <!-- 添加图片弹窗组件 start -->
        <elx-imgbox 
            ref="elxImgbox"
            :maxSize="10"
            :imgSizeLimit="false"
            @refreshPic="refreshPic" />
        <!-- 添加图片弹窗组件 end -->
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="currentSelectType"
          :isMulilt="isMulilt"
          :goodsNumber="goodsNumber"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import redirectNav from '../../../../commonComponent/redirectNav/index.vue' // 链接跳转
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue'
import ElxImgbox from '@/components/elx-imgbox' // 添加图片组件弹窗
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  components: {
    redirectNav,
    selectGoodsComponent,
    ElxImgbox,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前组件的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击当前组件的信息
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
        bgImg: '', // 图片
        path: { // 图片跳转的链接
          name: '',
          link: '',
          type: ''
        },
        goodsList: [] // 商品
      },
      addLength: 4, // 最多添加1几个商品
      currentSelectType: [], // 当前选择的类型
      dialogVisible: false, // 弹窗是否显示
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      currentClickType: '', // 当前点击的类型
      goodsNumber: 0, // 限制商品的数量
      isMulilt: false, // 是否允许多选
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 添加图片
    handleAddImg () {
      this.$refs.elxImgbox.init(1, 1)
    },
        // 选择图片之后的回调
    refreshPic (imagePath) {
      this.goodsForm.bgImg = this.resourcesUrl + imagePath
    },
        // 删除图片
    hanldeBgRemove () {
      this.dialogVisible = false
      this.goodsForm.bgImg = ''
    },
        // 选择链接
    handleNavSelect () {
      this.currentClickType = 'titles'
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.dialogVisible = true
      this.isMulilt = false // 禁止多选
      this.echoDataList = []
    },
        // 删除链接
    handleRemoveSelected () {
      this.goodsForm.path.name = ''
      this.goodsForm.path.link = ''
      this.goodsForm.path.type = ''
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 添加商品
    handleAddClick () {
      this.currentClickType = 'goods'
      this.currentSelectType = [1]
      this.dialogVisible = true
      this.isMulilt = true // 允许多选
      this.goodsNumber = 4 // 限制选择商品个数
      this.echoDataList = []
      this.goodsForm.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRemove (index) {
      this.goodsForm.goodsList.splice(index, 1)
    },
        // 弹窗确定
    handleDialogSubmit ({ type, value }) {
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
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule5.warning1')
      } else if (this.editItem.bgImg === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule5.warning2')
      } else if (this.editItem.path.name === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule5.warning3')
      } else if (this.editItem.goodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule5.warning4')
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
    goodsForm: { // 监听配置信息的改变
      handler (newVal, oldVal) {
        let obj = {
          type: 'goods_module5',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听数据回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'goods_module5') {
          if (JSON.stringify(newVal.config) != '{}') {
            this.goodsForm = {...newVal.config}
          } else {
            this.goodsForm = {
              bgImg: '', // 图片
              path: { // 图片跳转的链接
                name: '',
                link: '',
                type: ''
              },
              goodsList: [] // 商品
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-moduleFive-config {
    .config-items {
        margin-bottom: 20px;
        .items-content {
            width: 100%;
            height: 100px;
            display: flex;
            background: rgba(255, 255, 255, 0.39);
            border: 1px solid #EAEAF2;
            border-radius: 2px;
            padding: 20px 15px;
            .item-left {
                .item-operation {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background: rgba(234, 234, 242, 0.39);
                    position: relative;
                    cursor: pointer;
                    .el-image {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    span {
                        font-size: 12px;
                        font-family: Microsoft YaHei;
                        color: #9FA4B1;
                        &:nth-child(1) {
                            font-size: 20px;
                        }
                        &:nth-child(2) {
                            transform: scale(0.9);
                        }
                    }
                    .icon-error {
                        position: absolute;
                        top: -6px;
                        right: -6px;
                        font-size: 16px;
                        z-index: 99;
                        display: flex;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 12px;
                        align-items: center;
                        justify-content: center;
                        background: #155bd4;
                    }
                }
            }
            .item-right {
                width: 100%;
                display: flex;
                align-items: center;
                margin-left: 15px;
                .title {
                    white-space: nowrap;
                    margin-right: 15px;
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
    }
}
</style>