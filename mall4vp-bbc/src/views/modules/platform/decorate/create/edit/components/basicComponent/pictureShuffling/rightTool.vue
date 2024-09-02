<template>
    <div class="picture_by_container">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.pictureBy.picsize`)}}</div>
            <div class="right-select">
                <el-radio-group v-model="pciConfigForm.size">
                    <el-radio :label="1920">{{$t(`pcdecorate.univerHot.one`)}}</el-radio>
                    <el-radio :label="1200">{{$t(`pcdecorate.univerHot.two`)}}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="tips">{{$t(`pcdecorate.pictureBy.picTips`)}}</div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.pictureBy.highly`)}}</div>
            <div class="right-select">
                <el-slider :min="50" :max="1000" v-model="pciConfigForm.height" show-input @change="picchange"></el-slider>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.pictureBy.pagenation`)}}</div>
            <div class="right-select">
                <el-radio-group v-model="pciConfigForm.pageation">
                    <el-radio :label="0">{{$t(`pcdecorate.pictureBy.show`)}}</el-radio>
                    <el-radio :label="1">{{$t(`pcdecorate.pictureBy.hide`)}}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="picture-styles">
            <div class="picture-items" v-for="(item, index) in pciConfigForm.picList" :key="index">
                <el-image :src="item.img" fit="fill" style="position: relative">
                    <div slot="error" class="image-slot" >
                        <img src="@/assets/img/pc-micro-page/show-default.png">
                    </div>
                </el-image>
                <div class="picture-text">
                    <span class="title" style="width: 40px">{{$t(`pcdecorate.pictureBy.link`)}}</span>
                    <redirect-nav
                        style="width: calc(100% - 45px)"
                        :selectedLink="item.path.name"
                        :placeholder="$t(`pcdecorate.placeholder.link`)"
                        @handleNavSelect="handleNavSelect(item, index)"
                        @handleRemoveSelected="handleRemoveSelected(item, index)"></redirect-nav>
                </div>
                <i class="el-icon-delete" @click="handleRemovePic(index)"></i>
            </div>
            <div class="b-btns" @click="handleAddImage">
                <span>+</span>
                <span>{{$t(`pcdecorate.pictureBy.addImg`)}}</span>
            </div>
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
import redirectNav from '../../../../commonComponent/redirectNav/index.vue'; // 导航链接跳转组件
import ElxImgbox from '@/components/elx-imgbox'; // 添加图片组件弹窗
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
export default {
  components: {
    redirectNav,
    ElxImgbox,
    decorateDialogSelect
  },
  props: {
    currentRef: { // 当前操作的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 当前组件的回显信息,新增的时候
      type: Object,
      default: () => {}
    },
    editItem: { // 编辑时候组件的回显信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pciConfigForm: {
        size: 1920,
        height: 500,
        pageation: 0,
        picList: []
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
      updateIndex: '', // 修改图片的下标
      dialogVisible: false, // 弹窗打开关闭
      currentIndex: '', // 当前操作的index
    }
  },
    methods: {
      // 选择链接
      handleNavSelect(item, index) {
        this.currentIndex = index;
        this.dialogVisible = true;
      },
      // 删除链接
      handleRemoveSelected(item, index) {
        this.pciConfigForm.picList.forEach((ele, i) => {
          if(index === i) {
            ele.path.name = '';
            ele.path.link = '';
          }
        })
      },
        // 添加图片
      handleAddImage() {
          /**
           * init(args, args2):
           *  第一个参数表示单选还是多选：1：单选，2：多选
           *  第二个参数：表示最多选择的数量
           */
        this.updateIndex = '';
        this.$refs.elxImgbox.init(2, 10 - this.pciConfigForm.picList.length);
      },
      // 选择图片之后进行回调
      refreshPic(imagePath) {
        let updateStatus = false;
        // 更改图片的回调
        this.pciConfigForm.picList.forEach((item, index) => {
          if(this.updateIndex === index) {
            item.img = this.resourcesUrl + imagePath;
            updateStatus = true;
          } else {    
            updateStatus = false;
          }
        })
        let arr = [];
        if(imagePath.indexOf(',')) {
          arr = imagePath.split(',')
        }
        if(arr.length > 0) { // 说明是多选
          arr.forEach(item => {
            if(!updateStatus) { // 如果不是更改图片就让他增加
              this.pciConfigForm.picList.push({
                img: this.resourcesUrl + item,
                path: {
                  name: '',
                  link: '',
                  type: ''
                }
              })
            }
          })
        } else { // 就是单选
          if(!updateStatus) { // 如果不是更改图片就让他增加
            this.pciConfigForm.picList.push({
              img: this.resourcesUrl + imagePath,
              path: {
                name: '',
                link: '',
                type: ''
              }
            })
          }
        }
      },
      // 更改图片
      handleUpdatePic(index) {
        this.updateIndex = index;
        this.$refs.elxImgbox.init(2, 1);
      },
      // 移除图片
      handleRemovePic(index) {
        this.pciConfigForm.picList.splice(index, 1);
      },
      // 商品弹窗关闭
      handleDialogClose() {
        this.dialogVisible = false;
      },
      // 商品弹窗确定
      handleDialogSubmit({type, value}) {
        if(type === '1') { // 当前选择的是商品
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.goodsItem.prodName, // 商品名称
                link: value.goodsItem.prodId, // 商品id
                type: '1'
              }
            }
          })
        } else if(type === '2') { // 当前选择的是分类
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.categoryItem.label, // 分类名字
                link: value.categoryItem.data, // 分类的数据(数组)
                type: '2'
              }
            }
          })
        } else if(type === '3') { // 当前选择的是店铺
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.storeItem.shopName, // 店铺名
                link: value.storeItem.shopId, // 店铺id
                type: '3'
              }
            }
          })
        } else if(type === '4') { // 当前选择的是页面
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.pageItem.title,
                link: value.pageItem.link,
                type: '4'
              }
            }
          })
        } else if(type === '5') { // 当前选择的是页面
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.smallPageItem.name, // 微页面名称
                link: [value.smallPageItem.renovationId, value.smallPageItem.shopId],
                type: '5'
              }
            }
          })
        } else if(type === '6') { // 自定义链接
          this.pciConfigForm.picList.forEach((ele, index) => {
            if(this.currentIndex === index) {
              ele.path = {
                name: value.customLink, // 微页面名称
                link: value.customLink,
                type: '6'
              }
            }
          })
        }
        this.dialogVisible = false;
      },
      // 验证信息
      handleValidate() {
          let status = false;
          let message = '';
          if(JSON.stringify(this.editItem) === '{}') {
              status = false;
              message = this.$i18n.t('pcdecorate.pictureBy.warning1');
          } else if(this.editItem.height === 0) {
              status = false;
              message = this.$i18n.t('pcdecorate.pictureBy.warning2');
          } else if(this.editItem.picList.length === 0) {
              status = false;
              message = this.$i18n.t('pcdecorate.pictureBy.warning3');
          } else if(this.editItem.picList.length > 0) {
              status = this.editItem.picList.every(item => {
                  return item.img != '' && item.path.link != '';
              })
              message = this.$i18n.t('pcdecorate.pictureBy.warning4');
          }
          else {
              status = true;
          }
          return {
              status: status,
              message: message
          };
      },
      // 高度防止输入小数
      picchange(val) {
        return this.pciConfigForm.height = Math.floor(val);
      }
    },
    watch: {
      pciConfigForm: { // 监听图片配置信息改变
        handler(newVal, oldVal) {
          let obj = {
            type: 'picture_by',
            ref: this.currentRef,
            config: newVal
          }
          this.$emit('handleUpdateMessage', obj);
        },
        deep: true
      },
      currentItem: { // 监听当前是否已经配置
        handler(newVal, oldVal) {
          if(newVal.currentConfigType === 'picture_by') {
            if(JSON.stringify(newVal.config) != '{}') { // 如果当前不能为空
              let obj = {
                  ...newVal.config
              }
              this.pciConfigForm = obj;
            } else {
              this.pciConfigForm = {
                size: 1920,
                height: 500,
                pageation: 0,
                picList: []
              }
            }
          }
        },
          // deep: true
      },
    }
}
</script>
<style lang="scss" scoped>
.picture_by_container {
  .config-items {
    margin-bottom: 25px;
    display: flex;
    position: relative;
    .title {
      width: 90px;
      display: flex;
      align-items: center;
    }
    &:nth-child(1) {
        margin-bottom: 10px;
    }
    .right-select {
        width: 100%;
    }
  }
  .tips {
    color: #999;
    font-size: 12px;
    font-family: Microsoft YaHei;
    margin-bottom: 20px;
  }
    .picture-styles {
        .picture-items {
          position: relative;
          margin-bottom: 20px;
          .el-image {
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
            .picture-text {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              span {
                  display: flex;
                  align-items: center;
              }
              .link-styles {
                  width: 88%;
                  height: 32px;
                  background: rgba(255, 255, 255, 0.39);
                  border: 1px solid #DCDFE6;
                  border-radius: 3px;
                  position: relative;
                  cursor: pointer;
                  .link-placeholder {
                      position: absolute;
                      left: 11px;
                      top: 9px;
                      color: #999;
                      font-size: 12px;
                      font-family: Microsoft YaHei;
                  }
                  .link-imgicon {
                      position: absolute;
                      width: 18px;
                      height: 18px;
                      right: 7px;
                      top: 6px;
                  }
                }
            }
            .el-icon-delete {
                position: absolute;
                top: 35%;
                color: #fff;
                right: 45%;
                transform: translate(-50%, -50%);
                font-size: 16px;
                display: none;
                cursor: pointer;
            }
            .update-pic {
                position: absolute;
                width: 100%;
                height: 20px;
                color: #fff;
                background: rgba(0, 0, 0 ,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                top: 80px;
                font-size: 12px;
                border-radius: 4px 4px 0 0;
                cursor: pointer;
            }
            &:hover {
                .el-image {
                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.39);
                    }
                }
                .el-icon-delete {
                    display: block;
                }
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
}
</style>