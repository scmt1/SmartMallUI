<template>
  <div class="micro-image-ad-box">
    <div class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="image-ad-edit">
          <div class="config-items">
            <div class="title">{{$t(`pcdecorate.univerHot.picSize`)}}</div>
            <div class="right-select">
              <el-radio-group v-model="hotForm.size">
                <el-radio :label="1920">{{$t(`pcdecorate.univerHot.one`)}}</el-radio>
                <el-radio :label="1200">{{$t(`pcdecorate.univerHot.two`)}}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="config-items" style="margin-bottom: 15px;">
            <div class="title">{{$t(`pcdecorate.univerHot.addImage`)}}</div>
            <div class="right-select tips">{{$t(`pcdecorate.univerHot.imageTips`)}}</div>
          </div>
          <div class="hot-preivew-container">
            <draggable 
              :list="hotForm.imgList"
              ghost-class="ghost"
              handle=".ad-handle">
              <div 
                v-for="(item, index) in hotForm.imgList"
                :key="index"
                class="ad-image-hot">
                <div 
                  class="add-ad-image" 
                  @click="showHotAreaPop(index)">
                  {{$t(`pcdecorate.univerHot.addHot`)}}
                </div>
                <div
                  class="add-ad-image" 
                  @click="changeImg(index)">
                  {{$t(`pcdecorate.univerHot.updateImage`)}}
                </div>
                <div class="ad-image-hot-box">
                  <div 
                    v-show="item.activeBoxs && item.activeBoxs.length"
                    class="ad-image-hot-content ad-handle">
                    <span 
                      v-for="(hotItem, hotIndex) in item.activeBoxs"
                      :key="hotIndex"
                      class="ad-hot-box-item"
                      :style="`transform: translate(${hotItem.translateX * hotScale}px,${hotItem.translateY * hotScale}px);width:${hotItem.width * hotScale}px;height:${hotItem.height * hotScale}px;`">
                      <div class="redirect-title">{{hotItem.title}}</div>
                      <i 
                        class="el-icon-close close-icon"
                        @click="item.activeBoxs.splice(hotIndex, 1)" />
                    </span>
                    </div>
                    <img class="ad-hanlde" :src="item.url" alt="">
                    <div class="icon-error" @click="hotForm.imgList.splice(index, 1)">x</div>
                </div>
              </div>
            </draggable>
          </div>
          <div class="config-items" v-if="hotForm.imgList.length < 10">
            <div class="b-btns" @click="handleAddImage">
              <span>+</span>
              <span>{{$t(`pcdecorate.univerHot.addImage`)}}</span>
            </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 添加热区弹窗 start -->
    <el-dialog 
      custom-class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$i18n.t('shopFeature.imageAd.addHotArea')"
      :visible.sync="dialogHot"
      append-to-body
      width="550px">
      <div class="ad-hot-box">
        <div v-if="dialogHot&&hotForm.imgList.length">
          <img :src="hotForm.imgList[currentEditIndex].url" class="box-img">
          <div 
            v-for="(item,index) in cacheImageActiveBox"
            :key="index"
            v-drag="{cacheImageActiveBox,index}"
            class="ad-drag">
            <div class="title" @click="handleSelectRedirect(index)">{{item.title}}</div>
            <i class="el-icon-close close-icon" @click="cacheImageActiveBox.splice(index, 1)" />
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align: right;margin-top: 20px;">
        <el-button size="mini" type="primary" @click="addHotArea">{{$t('shopFeature.imageAd.addHotArea')}}</el-button>
        <el-button size="mini" @click="saveHotBox">{{$t('shopFeature.imageAd.save')}}</el-button>
      </div>
    </el-dialog>
    <!-- 添加热区弹窗 end -->
    <!-- 弹窗, 新增图片 start -->
    <elx-imgbox 
      ref="elxImgbox"
      @refreshPic="refreshPic"
      :maxSize="10"
      :imgSizeLimit="false">
    </elx-imgbox>
    <!-- 弹窗，新增图片 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :currentSelectType="[1, 2, 3, 4, 5, 6]"
      :customLinkArr="customLinkArr"
      @handleClose="handleDialogClose"
      @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script>
import '../../../../../../feature/create/edit/directive/index'
import draggable from 'vuedraggable'
import ElxImgbox from '@/components/elx-imgbox'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
export default {
  name: 'micro-image-ad-box',
  props: {
    currentRef: { // 当前操作的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击当前组件的回显配置信息
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
      dialogVisible: false, // 弹窗是否显示
      hotScale: 350 / 500, // 热区比例
      dialogHot: false, // 是否显示热区
      cacheImage: false, // 是否是正在编辑热区的
      /** 选择图片的弹窗 */
      isChangeImg: false, // 是否为更换图片模式
      currentEditIndex: 0, // 当前编辑的图片
      currentHotEditIndex: 0, // 当前编辑的热区
      hotForm: {
        size: 1920, // 图片尺寸大小
        imgList: [] // 图片
      },
      cacheImageActiveBox: [], // 缓存当前box list
      boxItem: {// 盒子模板
        link: '',
        type: '',
        title: this.$t('shopFeature.pcHeader.jumpLinks'),
        left: 0,
        top: 0,
        translateX: 0,
        translateY: 0,
        width: 102,
        height: 102
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      customPath: '', // 自定义路径
      customLinkArr: {} // 自定义链接回显
    }
  },
  components: {
    draggable,
    ElxImgbox,
    decorateDialogSelect
  },
  methods: {
      // 打开商品弹窗
    handleSelectRedirect (index) {
      this.currentHotEditIndex = index
      this.dialogVisible = true
      this.customLinkArr = this.cacheImageActiveBox[index]
    },
      // 关闭商品弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
      // 商品弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') { // 当前选择的是商品
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.goodsItem.prodName, // 商品名称
          this.cacheImageActiveBox[this.currentHotEditIndex].link = value.goodsItem.prodId, // 商品id
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '1' // 当前选择的类型
      } else if (type === '2') { // 当前选择的是分类
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.categoryItem.label, // 分类标题
          this.cacheImageActiveBox[this.currentHotEditIndex].link = value.categoryItem.data, // 分类数据
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '2' // 当前选择的类型
      } else if (type === '3') { // 当前选择的是店铺
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.storeItem.shopName, // 店铺名称
          this.cacheImageActiveBox[this.currentHotEditIndex].link = value.storeItem.shopId, // 店铺id
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '3' // 当前选择的类型
      } else if (type === '4') { // 当前选择的是页面
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.pageItem.title, // 页面名称
          this.cacheImageActiveBox[this.currentHotEditIndex].link = value.pageItem.link, // 页面路径
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '4' // 当前选择的类型
      } else if (type === '5') { // 当前选择的是微页面
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.smallPageItem.name, // 微页面名称
          this.cacheImageActiveBox[this.currentHotEditIndex].link = [value.smallPageItem.renovationId, value.smallPageItem.shopId], // 微页面装修id
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '5' // 当前选择的类型
      } else if (type === '6') { // 当前选择的是自定义链接
        this.cacheImageActiveBox[this.currentHotEditIndex].title = value.customLink, // 自定义链接名称
          this.cacheImageActiveBox[this.currentHotEditIndex].link = value.customLink, // 自定义链接路径
          this.cacheImageActiveBox[this.currentHotEditIndex].type = '6' // 当前选择的类型
      }
      this.dialogVisible = false
    },
      // 添加图片
    handleAddImage () {
      this.$refs.elxImgbox.init(2, 10 - this.hotForm.imgList.length)
      this.isChangeImg = false
    },
      /**
       * 选择图片回调
       * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
       */
    refreshPic (imagePath) {
      if (this.isChangeImg) { // 更换图片模式
        this.hotForm.imgList[this.currentEditIndex].url = this.resourcesUrl + imagePath
        return
      }
      let arr = []
      if (imagePath.indexOf(',')) {
        arr = imagePath.split(',')
      }
      if (arr.length > 0) { // 说明是多选
        arr.forEach(item => {
          this.hotForm.imgList.push({
            url: this.resourcesUrl + item,
            title: '',
            link: '',
            type: '',
            imgTit: '',
            activeBoxs: []
          })
        })
      } else { // 就是单选
        this.hotForm.imgList.push({
          url: this.resourcesUrl + imagePath,
          title: '',
          link: '',
          type: '',
          imgTit: '',
          activeBoxs: []
        })
      }
    },
      /** 显示添加热区 */
    showHotAreaPop (index) {
      this.dialogHot = true
      this.currentEditIndex = index
      this.cacheImageActiveBox = JSON.parse(JSON.stringify(this.hotForm.imgList[this.currentEditIndex].activeBoxs))
    },
      /** 点击添加热区 */
    addHotArea () {
      this.cacheImageActiveBox.push(JSON.parse(JSON.stringify(this.boxItem)))
    },
      /** 保存热区 */
    saveHotBox () {
      let status = this.cacheImageActiveBox.some(item => item.link === '')
      if (status) {
        return this.$message.warning(this.$i18n.t('pcdecorate.univerHot.warning3'))
      }
      const hotAreaBoxs = this.cacheImageActiveBox
      this.hotForm.imgList[this.currentEditIndex].activeBoxs = hotAreaBoxs
      this.dialogHot = false
    },
      /** 更换图片 */
    changeImg (index) {
      this.isChangeImg = true // 开启当前是否更换图片
      this.currentEditIndex = index
      this.$refs.elxImgbox.init(2, 1)
    },
      // 验证
    handleValidate () {
      let status = true
      let message = ''
      if (JSON.stringify(this.editItem) === '{}') {
        status = false
        message = this.$i18n.t('pcdecorate.univerHot.warning1')
      } else if (this.editItem.imgList.length === 0) {
        status = false
        message = this.$i18n.t('pcdecorate.univerHot.warning2')
      } else {
        status = true
      }
      return {
        status,
        message
      }
    }
  },
  watch: {
    hotForm: {
      handler (newVal, oldVal) {
        let obj = {
          type: 'universal_hotspot',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听当前是否已经配置
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'universal_hotspot') {
          if (JSON.stringify(newVal.config) != '{}') {
            let obj = {
              ...newVal.config
            }
            this.hotForm = obj
          } else {
            this.hotForm = {
              size: 1920, // 图片尺寸大小
              imgList: [] // 图片
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ad-hot-box {
    position: relative;
    width: 500px;
    margin: 0 auto;
    overflow: hidden;
    .box-img {
        position: relative;
        height: auto;
        width: 500px;
        vertical-align: middle;
        border: 0;
    }
}
.ad-drag {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
    user-select: auto;
    touch-action: none;
    cursor: move;
    border: 1px solid #38f;
    background: rgba(51, 136, 255, .5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-close {
        position: absolute;
        top: 0;
        right: 0;
    }
    &:hover {
        .el-icon-close {
            display: block;
            cursor: pointer;
        }
    }
    .hot-item-title {
        max-width: 100%;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin-top: 5px;
    }
    * {
        user-select: auto;
        touch-action: none;
    }
    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
}
.micro-image-ad-box {
    .config-items {
        width: 100%;
        margin-bottom: 25px;
        display: flex;
        position: relative;
        .title {
            width: 90px;
            display: flex;
            align-items: center;
            position: relative;
        }
        .right-select {
            width: 100%;
            &.tips {
                color: #999;
                font-size: 12px;
                font-family: Microsoft YaHei;
                display: flex;
                align-items: flex-end;
            }
        }
        .b-btns {
            width: 100%;
            height: 42px;
            background: rgba(243, 245, 247, 0.39);
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            cursor: pointer;
            span {
                font-size: 14px;
                font-family: Microsoft YaHei;
                color: #155BD4;
                &:nth-child(1) {
                    font-size: 25px;
                    margin-right: 5px;
                }
                &:nth-child(2) {
                    padding-top: 2px;
                }
            }
        }
    }
    .close-icon {
        position: absolute;
        top: 0px;
        right: 0px;
        font-size: 20px;
        display: none;
    }
    .ad-image-hot {
        position: relative;
        padding-bottom: 20px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 20px;
        .ad-image-hot-box {
            width: 350px;
            position: relative;
            &:hover {
                .close-icon {
                    cursor: pointer;
                    display: block;
                }
                .icon-error {
                    display: block;
                }
            }
        }
        .add-ad-image {
            display: inline-block;
            margin-bottom: 15px;
            width: 90px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border: 1px solid #155BD4;
            cursor: pointer;
            color: #155BD4;
            margin-right: 10px;
            font-size: 12px;
            border-radius: 2px;
        }
        img {
            width: 100%;
            user-select: none;
        }
        .ad-image-hot-content {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            cursor: all-scroll;
            overflow: hidden;
            span.ad-hot-box-item {
                position: absolute;
                border: 1px solid #38f;
                background: rgba(51, 136, 255, .5);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                cursor: pointer;
                max-width: 100%;
                max-height: 100%;
                &:hover {
                    .el-icon-close {
                        display: block;
                        cursor: pointer;
                    }
                    .icon-error {
                        display: block;
                    }
                }
                .hot-item-title {
                max-width: 100%;
                word-break: break-all;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                margin-top: 5px;
                }
            }
        }
        .pic-close-icon {
            position: absolute;
            top: -13px;
            right: -8px;
        }
        .icon-error {
            position: absolute;
            top: -13px;
            right: -8px; 
            width: 18px;
            height: 18px;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
            background: #155bd4;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
            display: none;
        }
    }
}
.ad-image-list {
    display: flex;
    background: #fff;
    padding: 10px;
    border: 1px dashed #e5e5e5;
    margin-top: 10px;
    align-items: center;
    &:hover {
        border: 1px dashed #38f;
    }
    > div {
        &:first-child {
        position: relative;
        width: 80px;
        height: 80px;
        cursor: all-scroll;

    .re-choose-img {
        position: absolute;
        margin: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.52);
        text-align: center;
        padding: 2px 0;
        cursor: pointer;
        color: #fff;
    }
    }
    &:last-child {
    flex: 1;
    }
}
.ad-image-list-img {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #ccc;
}
.ad-image-list-content {
    position: relative;
    padding-left: 10px;
    display: flex;
    align-items: center;
    .custom-link-input {
    margin: 10px auto;
    width: 100%!important;
    }
    .close-icon {
    top: -10px;
    right: -10px;
    }
    &:hover {
    .close-icon {
        cursor: pointer;
        display: block;
    }
    }
    .el-input {
    width: 200px;
    margin-left: 10px;
    }
    .ad-image-link {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .el-dropdown-selfdefine {
        margin-left: 10px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    }
}
}
.custom-path-con {
    margin-top: 10px;
    max-width: 100%;
    display: flex;
    align-items: center;
    span {
        white-space: nowrap;
        margin-right: 10px;
    }
}
  
.redirect-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
