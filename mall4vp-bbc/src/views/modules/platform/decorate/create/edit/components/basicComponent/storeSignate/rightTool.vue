<template>
    <!-- 当前页面是招牌的配置信息 -->
  <div class="store-signate-Config">
    <div class="header-title">{{$t('pcdecorate.componentTitle.businessSigns')}}
        <i class="el-icon-close" @click="closeStoreSignateConfig"></i>
    </div>
    <div class="title-border"></div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeSignate.logo`)}}</div>
      <div class="right-select">
        <el-radio-group v-model="configForm.showLogo">
          <el-radio :label="0">{{$t(`pcdecorate.storeSignate.show`)}}</el-radio>
          <el-radio :label="1">{{$t(`pcdecorate.storeSignate.hide`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeSignate.searchBar`)}}</div>
      <div class="right-select">
        <el-radio-group v-model="configForm.showSearch">
          <el-radio :label="0">{{$t(`pcdecorate.storeSignate.show`)}}</el-radio>
          <el-radio :label="1">{{$t(`pcdecorate.storeSignate.hide`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title">{{$t(`pcdecorate.storeSignate.navsBar`)}}</div>
      <div class="right-select">
        <el-radio-group v-model="configForm.showNavs">
          <el-radio :label="0">{{$t(`pcdecorate.storeSignate.show`)}}</el-radio>
          <el-radio :label="1">{{$t(`pcdecorate.storeSignate.hide`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items" v-show="configForm.showNavs == 0">
      <div class="title">{{$t(`pcdecorate.storeSignate.goodsCategory`)}}</div>
      <div class="right-select">
        <el-radio-group v-model="configForm.showCategory">
          <el-radio :label="0">{{$t(`pcdecorate.storeSignate.show`)}}</el-radio>
          <el-radio :label="1">{{$t(`pcdecorate.storeSignate.hide`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items" style="margin-bottom: 15px" v-show="configForm.showNavs == 0">
      <div class="add-navs" @click="addNav">
        <span style="font-size: 21px;margin-right: 4px;margin-bottom: 4px;">+</span>
        <span>{{$t(`pcdecorate.storeSignate.addNavs`)}}</span>
      </div>
      <div class="tips">{{$t(`pcdecorate.storeSignate.navsBarTip`)}}</div>
    </div>
    <div class="config-items nav-solid" v-show="configForm.showNavs == 0">
      <template v-if="configForm.navList && configForm.navList.length > 0">
        <div 
          class="navs-items" 
          v-for="(item, index) in configForm.navList" 
          :key="index">
          <el-row class="navs-hovers" style="margin: 10px 5px;position: relative;">
            <el-col 
              :span="11" 
              style="display: flex;font-size: 12px;align-items: center;">
              <span 
                style="width:35px;margin-right:3%;white-space: nowrap">
                {{$t(`pcdecorate.storeSignate.navs`)}}{{index + 1}}
              </span>
              <el-input 
                v-model.trim="item.name" 
                maxlength="6"
                :placeholder="$t('pcdecorate.storeSignate.navsBarTip1')"
                class="config-input" 
                style="width: 100px;">
              </el-input>
            </el-col>
            <el-col 
              :span="11" 
              style="display: flex;font-size: 12px;align-items: center;line-height: 1">
              <span style="width: 55px;margin-right:3%;white-space: nowrap">
                {{$t(`pcdecorate.storeSignate.path`)}}
              </span>
              <direction-navs 
                style="width: 100px;overflow: hidden;"
                :placeholder="$t('pcdecorate.placeholder.link')"
                :selectedLink="item.path.name"
                @handleNavSelect="handleNavSelect(item, index)"
                @handleRemoveSelected="handleRemoveSelected(item, index)">
              </direction-navs>
            </el-col>
            <i class="el-icon-close nav-close" @click="handleNavsDel(index)"></i>
          </el-row>
        </div>
      </template>
      <template v-else>
          <div class="special-water">{{$t(`pcdecorate.storeSignate.navBarsArea`)}}</div>
      </template>
    </div>
    <div class="config-items config-bg">
        <div class="b-title">{{$t(`pcdecorate.storeSignate.signboardBack`)}}</div>
        <div class="b-tips">{{$t(`pcdecorate.storeSignate.signTips`)}}</div>
        <add-bg-component
            :imgUrl="configForm.bgUrl"
            @handleAddImage="handleAddImage"
            @handleRemmoveImage="handleRemmoveImage">
        </add-bg-component>
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :currentSelectType="[1, 2, 3, 4, 5, 6]"
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
import directionNavs from '../../../../commonComponent/redirectNav/index.vue' // 导航链接
import addBgComponent from '../../../../commonComponent/addBgComponent/index.vue' // 添加背景图
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue' // 选择商品
import ElxImgbox from '@/components/elx-imgbox' // 添加图片组件弹窗
export default {
  components: {
    directionNavs,
    addBgComponent,
    ElxImgbox,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前组件显示的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 当前组件信息
      type: Object,
      default: () => {}
    },
    editItem: { // 编辑时候验证消息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      configForm: {
        showLogo: 0,   // 平台logo是否显示
        showCategory: 0, // 全部分类是否显示
        showSearch: 0, // 搜索栏是否限时
        showNavs: 0, // 导航栏是否显示
        navList: [], // 导航栏个数
        bgUrl: '' // 图片背景
      },
      dialogVisible: false, // 弹窗是否打开
      currentIndex: '', // 当前操作的index
      updateIndex: '', // 修改图片的下标
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL // 服务地址
    }
  },
  methods: {
    // 关闭商家招牌
    closeStoreSignateConfig () {
      this.$emit('closeStoreSignateConfig')
    },
      // 添加导航
    addNav () {
      if (this.configForm.navList.length >= 7) {
        return this.$message.warning(this.$i18n.t('pcdecorate.storeSignate.warning1'))
      }
      this.configForm.navList.push({
        name: '', // 导航名
        path: {
          name: '',
          link: '',
          type: ''
        } // 导航链接
      })
    },
      // 删除添加的导航栏
    handleNavsDel (index) {
      this.configForm.navList.splice(index, 1)
    },
      // 选择跳转路径打开弹窗
    handleNavSelect (item, index) {
      this.currentIndex = index
      this.dialogVisible = true
    },
      // 关闭商品弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
      // 弹窗确定
    handleDialogSubmit ({type, value}) {
      let obj = {
        name: '',
        link: '',
        type: ''
      }
      switch (Number(type)) {
        case 1: // 商品
          obj = {
            name: value.goodsItem.prodName, // 商品名称
            link: value.goodsItem.prodId, // 商品id
            type: '1'
          }
          break
        case 2: // 分类
          obj = {
            name: value.categoryItem.label, // 分类名字[三级分类的最后的名字]
            link: value.categoryItem.data, // 分类的数据(数组)
            type: '2'
          }
          break
        case 3: // 店铺
          obj = {
            name: value.storeItem.shopName, // 店铺名
            link: value.storeItem.shopId, // 店铺id
            type: '3'
          }
          break
        case 4: // 页面
          obj = {
            name: value.pageItem.title,
            link: value.pageItem.link,
            type: '4'
          }
          break
        case 5: // 微页面
          obj = {
            name: value.smallPageItem.name, // 微页面名
            link: [value.smallPageItem.renovationId, value.smallPageItem.shopId],
            type: '5'
          }
          break
        case 6: // 自定义链接
          obj = {
            name: value.customLink,
            link: value.customLink,
            type: '6'
          }
          break
        default:
          break
      }
      this.configForm.navList.forEach((ele, index) => {
        if (this.currentIndex === index) {
          ele.path = obj
        }
      })
      this.dialogVisible = false
    },
      // 删除跳转路径
    handleRemoveSelected (item, index) {
      this.configForm.navList.forEach((ele, i) => {
        if (index === i) {
          ele.path.name = ''
          ele.path.link = ''
          ele.path.type = ''
        }
      })
    },
      // 添加招牌背景图
    handleAddImage () {
      this.updateIndex = ''
      this.$refs.elxImgbox.init(1, 1)
    },
      // 选择图片之后的回调
    refreshPic (imagePath) {
      this.configForm.bgUrl = this.resourcesUrl + imagePath
    },
      // 删除招牌背景图
    handleRemmoveImage () {
      this.$set(this.configForm, 'bgUrl', '')
    },
      // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (this.editItem.showNavs == 0) { // 如果展示了导航栏
        let currentStatus = this.editItem.navList.every(item => {
          return item.name != '' && item.path.name != '' && item.path.link != ''
        })
        if (currentStatus) {
          status = true
        } else {
          status = false
          message = this.$i18n.t('pcdecorate.storeSignate.warning2')
        }
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
    configForm: {
      handler (newVal, oldVal) {
        let obj = {
          tpye: 'shop_signs',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 对当前组件绑定的信息进行回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'shop_signs') { // 商家招牌
          if (JSON.stringify(newVal.config) != '{}') { // 如果当前配置信息不为空，则表示已经配置过
            let obj = {...newVal.config}
            this.configForm = obj
          } else {
            this.configForm = {
              showLogo: 0,
              showCategory: 0,
              showSearch: 0,
              showNavs: 0,
              navList: [],
              bgUrl: ''
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.store-signate-Config {
    width: 450px;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    // position: fixed;
    top: 50px;
    right: 0;
    z-index: 99;
    background: #fff;
    padding-bottom: 45px;
    .header-title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: #333;
      position: relative;
      margin-left: 10px;
      &::before {
        content: '';
        position: absolute;
        width: 3px;
        height: 15px;
        left: -10px;
        top: 2px;
        background: rgba(21, 91, 212, 1);
      }
      .el-icon-close {
        color: #8C8C8C;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
    .title-border {
      width: 100%;
      height: 1px;
      background: #EDEDF2;
      margin: 20px 0;
    }
    .config-items {
        margin-bottom: 25px;
        display: flex;
        .title {
            width: 90px;
        }
        .add-navs {
            width: 102px;
            height: 28px;
            box-sizing: border-box;
            border: 1px solid #155BD4;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            span {
                font-size: 12px;
                color: #155BD4;
                font-family: Microsoft YaHei;
            }
        }
        .tips {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999999;
      font-family: Microsoft YaHei;
      margin-left: 10px;
  }
        .navs-items {
            width: 100%;
            height: 50px;
            .nav-close {
                background: #155BD4;
                color: #fff;
                border-radius: 50%;
                font-size: 12px;
                padding: 3px;
                position: absolute;
                top: 6px;
                right: 3px;
                cursor: pointer;
            }
        }
        .special-water {
            display: flex;
            height: 40px;
            justify-content: center;
            align-items: center;
            color: rgba(153, 153, 153, 0.6);
        }
        .config-input {
          font-size: 12px;
        }
    }
    .config-items.nav-solid {
        min-height: 40px;
        border: 1px dashed #DCDFE6 ;
        display: flex;
        flex-direction: column;
    }
    .config-items.config-bg {
        display: flex;
        flex-direction: column;
        .b-title {
            font-size: 14px;
            color: #333;
            font-family: Microsoft YaHei;
        }
        .b-tips {
            font-size: 12px;
            color: #999999;
            font-family: Microsoft YaHei;
            margin: 8px 0 15px 0;
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
}
</style>
<style lang="scss">
.navs-items {
    .el-input__inner {
        height: 28px;
        padding: 0 5px;
    }
    input::-webkit-input-placeholder { /* WebKit browsers */ 
      color: #999;
      font-size: 12px;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
      color: #999;
      font-size: 12px;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
      color: #999;
      font-size: 12px;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
      color: #999;
      font-size: 12px; 
    }
}

</style>