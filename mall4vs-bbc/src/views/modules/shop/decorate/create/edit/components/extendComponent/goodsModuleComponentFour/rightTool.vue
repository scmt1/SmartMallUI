<template>
    <div class="goods-modulefour-configPage">
        <div class="config-items">
            <div v-if="goodsForm.bgImg === ''" class="bg-pic" @click="handAddBg">
                <div class="bg-icon">
                    <span>+</span>
                    <span>{{$t(`pcdecorate.goodsModule4.addBg`)}}</span>
                </div>
                <div class="bg-title">{{$t(`pcdecorate.goodsModule4.addTips`)}}</div>
            </div>
            <div v-else class="bg-pic has-bg">
                <el-image :src="goodsForm.bgImg" fit="fill">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <div class="close-icon" @click="hanldeBgRemove">x</div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsModule4.picLink`)}}</div>
            <redirect-nav
                :placeholder="$t('pcdecorate.placeholder.link')"
                :selectedLink="goodsForm.path.name"
                @handleNavSelect="handleNavSelect"
                @handleRemoveSelected="handleRemoveSelected">
            </redirect-nav>
        </div>
        <div class="config-items">
            <div class="title" style="margin-bottom: 14px">{{$t(`pcdecorate.goodsModule4.addOtherGoods`)}}</div>
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
          :goodsNumber="goodsNumber"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
        <!-- 添加图片弹窗组件 start -->
        <elx-imgbox 
            ref="elxImgbox"
            :maxSize="10"
            :imgSizeLimit="false"
            @refreshPic="refreshPic" />
        <!-- 添加图片弹窗组件 end -->
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
        bgImg: '', // 背景图
        path: { // 图片跳转路径
          name: '',
          link: '',
          type: ''
        },
        goodsList: [] // 商品
      },
      currentSelectType: [], // 当前选择的类型
      dialogVisible: false, // 弹窗是否显示
      addLength: 4, // 限制添加商品的个数
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      currentClickType: '', // 当前点击的类型
      goodsNumber: 0, // 限制商品的数量
      isMulilt: false, // 是否允许多选
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 跳转路径选择
    handleNavSelect () {
      this.currentClickType = 'titles'
      this.currentSelectType = [1, 2, 4, 5, 6]
      this.dialogVisible = true
      this.isMulilt = false // 禁止多选
      this.echoDataList = []
    },
        // 删除跳转链接
    handleRemoveSelected () {
      this.goodsForm.path.name = ''
      this.goodsForm.path.link = ''
      this.goodsForm.path.type = ''
    },
        // 关闭弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗的确定
    handleDialogSubmit ({ type, value}) {
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
      this.isMulilt = true // 允许多选
      this.goodsNumber = 4// 限制多选的数量
      this.echoDataList = []
      this.goodsForm.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 移除商品
    handleRemove (index) {
      this.goodsForm.goodsList.splice(index, 1)
    },
        // 添加背景图
    handAddBg () {
      this.$refs.elxImgbox.init(1, 1)
    },
        // 删除背景图片
    hanldeBgRemove () {
      this.$set(this.goodsForm, 'bgImg', '')
    },
        // 选择图片之后的回调
    refreshPic (imagePath) {
      this.goodsForm.bgImg = this.resourcesUrl + imagePath
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule4.warning1')
      } else if (this.editItem.bgImg === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule4.warning4')
      } else if (this.editItem.path.name === '') {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule4.warning2')
      } else if (this.editItem.goodsList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.goodsModule4.warning3')
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
    goodsForm: { // 监听配置信息的改变j
      handler (newVal, oldVal) {
        let obj = {
          type: 'goods_module4',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听数据回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'goods_module4') {
          if (JSON.stringify(newVal.config) != '{}') {
            this.goodsForm = {...newVal.config}
          } else {
            this.goodsForm = {
              bgImg: '', // 背景图
              path: { // 图片跳转路径
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
.goods-modulefour-configPage {
    .config-items {
        margin-bottom: 20px;
        .bg-pic {
            width: 100%;
            height: 99px;
            background: rgba(243, 245, 247, 0.39);
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            .el-image {
                width: 100%;
                height: 100%;
            }
            .bg-icon {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                span {
                    color: #155BD4;
                    &:nth-child(1) {
                        font-size: 30px;
                        margin-right: 10px;
                    }
                    &:nth-child(2) {
                        font-size: 14px;
                        font-family: Microsoft YaHei
                    }
                }
            }
            .bg-title {
                font-size: 12px;
                color: #9FA4B1;
                text-align: center;
            }
            .update-img {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 20px;
                background: rgba(0, 0, 0, 0.3);
                color: #fff;
                line-height: 20px;
                text-align: center;
                font-size: 12px;
            }
            .close-icon {
                position: absolute;
                right: -5px;
                top: -5px;
                font-size: 20px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(21, 91, 212, 1);
                color: #fff;
                text-align: center;
                line-height: 20px;
                font-size: 12px;
            }
            &.has-bg {
                width: 100%;
                height: 99px;
            }
        }
        .title {
            margin-bottom: 8px;
        }
        &:nth-child(2) {
            margin-bottom: 34px;
        }
    }
}
</style>