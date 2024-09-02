<template>
  <div class="elx-imgbox">
    <el-dialog
      :title="this.$i18n.t('pictureManager.picManager')"
      :visible.sync="visible"
      class="elx-imgbox-dialog"
      @close="handleDialogClose"
      top="0"
      width="900px"
      :append-to-body="visible"
    >
      <el-tabs v-model="options.activeTab" tab-position="top" @tab-click="tabClick">
        <el-tab-pane
          :label="this.$i18n.t('pictureManager.choosePic')"
          name="pick"
          class="pick-block"
        >
          <div class="elx-img-list-loading" v-if="isLoading">
            <div class="el-icon-loading"></div>
          </div>
          <el-form :inline="true" :model="dataForm" class="demo-form-inline form" size="small">
            <el-form-item>
              <el-input
                v-model="fileName"
                size="medium"
                :placeholder="this.$i18n.t('pictureManager.picName')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div
               class="default-btn primary-btn"
                @click="searchImg"
              >{{$t("pictureManager.query")}}</div>
              <div
                class="default-btn primary-btn"
                @click="uploadPicClick"
                plain
                v-if="options.enableUpload"
                style="margin-left:10px"
              >{{$t("pictureManager.uploadPic")}}</div>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="clean">清空</el-button>
            </el-form-item>-->
          </el-form>
          <div class="main">
            <div class="group-box">
              <div class="group">
                <div :class="['group-item',groupId === 0 ?'active': '']"  @click="clickGroup(0)">
                  <span class="group-name">{{$t("pictureManager.allPictures")}}</span>
                </div>
                <div :class="['group-item',groupId === item.attachFileGroupId ?'active': '']" v-for="(item,index) in groupList" :key="item.attachFileGroupId">
                  <span class="group-name" @click="clickGroup(item.attachFileGroupId)">{{ item.name }}</span>
                </div>
              </div>
            </div>
            <div class="img-list">
              <div class="elx-main elx-img-list">
                <div class="img-item" v-for="(img, itemIndex) in imgRes.records" :key="itemIndex">
                  <div class="thumb-wp" @click="onClickListImage(img)">
                    <img :src="resourcesUrl + img.filePath" alt="img.name" />
                  </div>
                  <div class="title" @click="onClickListImage(img)">{{img.fileName}}</div>
                  <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
                  <span class="selected" v-if="img.selected" @click="onClickListImage(img)">
                    <span class="icon el-icon-check"></span>
                  </span>
                </div>
                <div class="noData" v-show="imgRes.records!==undefined&&imgRes.records.length<1">{{$t("order.noData")}}</div>
              </div>
              <el-pagination
                layout="total, prev, pager, next"
                :current-page="imgRes.current"
                :page-size="imgRes.size"
                :total="imgRes.total"
                @current-change="onPageNumChange"
              ></el-pagination>
            </div>
          </div>
          <div class="elx-foot">
            <el-badge :value="images.length" class="item" v-if="!type">
              <div class="default-btn" @click="visible = false">{{$t("resource.cancel")}}</div>
              <div
                :class="[images.length == 0?'disabled-btn':'','default-btn primary-btn']"
                :disabled="images.length == 0"
                @click="onConfirm"
                style="margin-right:3px;"
              >{{$t("resource.confirm")}}</div>
            </el-badge>
            <div
              :class="[images.length == 0?'disabled-btn':'','default-btn primary-btn']"
              :disabled="disabled"
              @click="onConfirm"
              v-else
            >{{$t("resource.confirm")}}</div>

          </div>
        </el-tab-pane>

        <el-tab-pane
          :label="this.$i18n.t('pictureManager.uploadPic')"
          name="upload"
          class="upload-block"
          v-if="options.enableUpload"
        >
          <div class="elx-main">
            <div class="upload-box">
              <div class="upload-title">{{$t("resource.selectGroup")}}:</div>
              <div class="select-group-box">
                <div class="select-group-box-item">{{$t("resource.group")}}:</div>
                <el-select size="small" v-model="selectGroup" clearable :placeholder="$t('resource.selectGroup')" class="select-group-box-item">
                  <el-option
                    v-for="item in groupList"
                    :key="item.attachFileGroupId"
                    :label="item.name"
                    :value="item.attachFileGroupId">
                  </el-option>
                </el-select>
                <el-button style="margin-left: 10px" type="text" size="small" @click="createGroup()">{{ $t('resource.newGroup') }}</el-button>
              </div>
              <div class="upload-title">{{$t("pictureManager.selectLocalPic")}}</div>
              <el-upload
                ref="upload"
                :class="['upload-img-preview',hideUpload?'upload-hide':'']"
                list-type="picture-card"
                accept="image/*"
                :action="$http.adornUrl('/admin/file/upload/img')"
                :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"
                :multiple="true"
                :auto-upload="false"
                :limit="options.limit"
                :before-upload="beforeUpload"
                :on-change="onUploadChange"
                :on-progress="onUploadProgress"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :on-exceed="onUploadExceedTip"
                :before-remove="beforeRemove"
                :on-remove="onRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>

              <div class="upload-tip">{{ uploadTips() }}</div>

              <div class="elx-upload-foot">
                <div @click="options.activeTab = 'pick'" class="default-btn">{{$t("shop.return")}}</div>
                <div
                  class="default-btn primary-btn"
                  @click="onUploadConfirm"
                >{{$t("pictureManager.confirmUpload")}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 修改物流弹窗 -->
    <el-dialog
      :title="this.$i18n.t('pictureManager.revisePicName')"
      :close-on-click-modal="false"
      :visible.sync="changeNameVisible"
      top="200px"
      :append-to-body="visible"
      width="600px"
    >
      <el-form :model="imageObject" ref="imgDataForm" label-width="80px" v-if="changeNameVisible" size="samll">
        <el-form-item :label="this.$i18n.t('pictureManager.oldName')">
          <span>{{imageObject.fileName}}</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('pictureManager.revName')">
          <el-input
            :placeholder="this.$i18n.t('pictureManager.inputNewName')"
            v-model="newImgName"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="changeNameVisible = false">{{$t("resource.cancel")}}</div>
        <div  class="default-btn" @click="submitImgName()">{{$t("resource.confirm")}}</div>
      </span>
    </el-dialog>
    <!-- /修改物流弹窗 -->

    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" />
  </div>
</template>

<script type="text/babel">
import groupAddOrUpdate from '@/components/group-add-or-update'
import imageCompression from 'browser-image-compression'
export default {
  name: 'ElxImgbox',
  components: {
    groupAddOrUpdate
  },
  props: {
    maxSize: {
      default: 2,
      type: Number
    },
    imgSizeLimit: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      images: [], // 已选图片
      fileIds: [], // 已选图片的fileId
      hideUpload: false, // 上传按钮显隐
      dataForm: {},
      uploadDisabled: false,
      uploadSubmitFlag: false,
      uploadFileNum: 0,
      options: {
        multiple: true, // 是否支持选取多个图片
        limit: 20, // 最多可选择图片数量
        maxSize: 2, // 最大尺寸（M）
        activeTab: 'pick',
        enableUpload: true, // 是否启用图片上传
        callback: null
      },
      groupList: [], // 分组列表
      selectGroup: '',
      groupId: '',
      newImgName: '',
      isTrue: true,
      imageObject: null,
      errShow: false,
      picNum: 0,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      changeNameVisible: false,
      type: 2,
      fileName: '',
      listType: 'picture',
      isLoading: true,
      visible: false,
      disabled: false,
      notImg: false,
      uploadSuccessCount: 0,
      imgRes: {
        current: 1
      },
      uploadFlag: 0,
      groupVisible: false
    }
  },

  methods: {
    /**
     * 初始化
     * type 1：单图  2：多图
     */
    init (type, limit) {
      this.options.activeTab = 'pick'
      this.visible = true
      this.isLoading = false
      this.images = []
      this.fileIds = []
      this.type = type
      if (type === 1) {
        this.type = true
        this.disabled = true
      } else {
        this.type = false
        this.limit = limit
      }
      if (this.$refs.upload) {
        this.$refs.upload.uploadFiles = []
      }
      // 获取产品数据 - 第一页的数据
      this.loadListImage(1)
      this.getGroupList()
    },
    show () {
      this.visible = true
    },

    hide () {
      this.visible = false
    },

    onConfirm () {
      if (this.images.length === 0 || this.disabled) {
        return
      }
      if (this.type) {
        // 如果大于传过来的限制大小，则抛出异常
        const isSize = this.images[0].fileSize / (1024 * 1024) > this.options.maxSize
        if (isSize && this.options.maxSize < 1) {
          this.message(this.$i18n.t('components.sizeCannotExceed') + (this.options.maxSize * 1000) + 'K')
          return
        }
        if (isSize) {
          this.message(this.$i18n.t('components.sizeCannotExceed') + this.options.maxSize + 'M')
          return
        }
        var img = new Image()
        img.src = this.resourcesUrl + this.images[0].filePath
        var _this = this
        img.onload = function () {
          console.log(_this.imgSizeLimit, img.width, img.height)
          console.log(_this.imgSizeLimit && (img.width > 300 || img.height > 300))
          if (_this.imgSizeLimit && (img.width > 300 || img.height > 300)) {
            _this.$message.error(_this.$i18n.t('components.imageExc300Px'))
            return
          }
          _this.$emit('refreshPic', _this.images[0].filePath)
          _this.visible = false
        }
        img.onerror = function () {
          _this.$message.error(_this.$i18n.t('components.imgLoadFailed'))
        }
      } else {
        let imgPaths = this.images.map(file => {
          return file.filePath
        }).join(',')
        this.$emit('refreshPic', imgPaths)
        this.visible = false
      }
    },
    /**
     * 提交修改后的图片名称
     */
    submitImgName () {
      if (!this.isTrue) {
        return false
      }
      this.isTrue = false
      this.$http({
        url: this.$http.adornUrl('/admin/file/updateFile'),
        method: 'put',
        data: this.$http.adornData({
          fileId: this.imageObject.fileId,
          fileName: this.newImgName,
          attachFileGroupId: this.selectGroup,
          type: 1
        })
      }).then(({ data }) => {
        this.newImgName = ''
        this.isTrue = true
        this.selectGroup = ''
        this.changeNameVisible = false
        this.loadListImage(this.imgRes.current)
      }).catch(({ e }) => {
        this.isTrue = true
      })
    },
    /**
     * 获取分组列表
     */
    getGroupList () {
      this.groupVisible = false
      this.$http({
        url: this.$http.adornUrl('/admin/fileGroup/list'),
        method: 'get',
        params: {
          type: 1 // 1、图片 2、视频 3、文件
        }
      }).then(res => {
        this.groupList = res.data
      })
    },
    /**
     * 点击分组
     */
    clickGroup (id) {
      this.groupId = id
      this.loadListImage()
    },

    /**
     * 点击上传图片
     */
    uploadPicClick () {
      this.options.activeTab = 'upload'
      this.selectGroup = this.groupId || ''
    },
    /**
     * 修改图片名称
     */
    changeName (img) {
      this.newImgName = ''
      this.imageObject = img
      this.isTrue = true
      this.changeNameVisible = true
    },
    /**
     * 删除图片
     */
    delectImg (fileId) {
      this.$confirm(this.$i18n.t('scoreProdList.isDelete'), this.$i18n.t('resource.tips'), {
        confirmButtonText: this.$i18n.t('resource.confirm'),
        cancelButtonText: this.$i18n.t('resource.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/file/deleteFile/' + fileId),
          method: 'delete'
        }).then(({ data }) => {
          this.images = []
          this.loadListImage(this.imgRes.current)
        })
      })
    },
    /**
     * 点击图片时选中或取消选中图片
     * @param img object
     */
    onClickListImage (img) {
      // if(!this.uploadNumberLimit()) {
      //   return this.onUploadExceedTip()
      // }
      // 单选图片
      if (this.type) {
        this.clearListSelected()
        this.images = []
        this.fileIds = []
        this.disabled = false
      } else {
        // 多选图片-如果已选中则取消选中
        var imgIndex = this.selectedImageIndex(img)
        if (imgIndex >= 0) {
          // 取消图片已选状态
          img.selected = false
          this.images.splice(imgIndex, 1)
          this.fileIds.splice(imgIndex, 1)
          return
        }
      }
      if (!this.type && this.images.length >= this.limit) {
        this.message(this.$i18n.t('pictureManager.superiorLimit'))
        return false
      }
      this.images.push(JSON.parse(JSON.stringify(img)))
      this.fileIds.push(img.fileId)
      img.selected = true
    },
    /**
     * 清除所有已点击图片样式
     */
    clearListSelected () {
      if (this.type) {
        let list = this.imgRes.records
        list.forEach(element => {
          element.selected = false
        })
      }
    },
    /**
         * 按图片名称搜索图片
         */
    searchImg () {
      this.loadListImage(1)
    },
    /**
     * 加载图片列表数据
     * @param page
     */
    loadListImage (current) {
      this.isLoading = true
      let that = this
      this.$http({
        url: this.$http.adornUrl('/admin/file/attachFilePage'),
        method: 'get',
        params: this.$http.adornParams({
          current: current,
          size: 15,
          fileName: this.fileName ? this.fileName : null,
          attachFileGroupId: this.groupId,
          type: 1
        })
      }).then(({ data }) => {
        this.imgRes = data
        this.imgRes.records.forEach(img => {
          if (that.selectedImageIndex(img) > -1) {
            img.selected = true
          } else {
            img.selected = false
          }
        })
        this.isLoading = false
      })
    },

    /**
     * 图片已选则返回下标，未选则返回-1
     */
    selectedImageIndex (img) {
      for (let i = 0; i < this.images.length; i++) {
        var selectedImg = this.images[i]
        if (selectedImg.fileId === img.fileId) {
          return i
        }
      }
      return -1
    },

    /**
     * 分页页面变化时刷新数据
     * @param page
     */
    onPageNumChange (page) {
      this.loadListImage(page)
    },
    submitBatchMove () {
      if (!this.selectGroup) {
        return
      }
      this.$http({
        url: this.$http.adornUrl('/admin/file/batchMove'),
        method: 'put',
        data: {
          fileIds: this.fileIds.map(x => x.data),
          attachFileGroupId: this.selectGroup
        }
        // params: {
        //   groupId: this.selectGroup
        // }
      }).then(({ data }) => {
        // this.images = []
        // this.fileIds = []
        this.selectGroup = ''

        this.loadListImage()
      })
    },

    // 新建分组
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(1)
      })
    },
    /**
     * 提交上传图片
     */
    onUploadConfirm () {
      var length = this.$refs.upload.uploadFiles.length
      if (!length) {
        this.message(this.$i18n.t('publics.imageNoNull'), false)
        return
      }
      this.uploadSubmitFlag = true
      var time = setTimeout(() => { this.uploadSubmitFlag = false; clearTimeout(time) }, 1000)
      this.notImg = true
      this.uploadFlag = 0
      this.fileIds = []
      this.$refs.upload.submit()
    },
    beforeRemove (file, fileList) {
      // 防止用户频繁点击导致删除过多
      if (this.uploadDisabled) {
        return false
      } else {
        return true
      }
    },
    onRemove (file, fileList) {
      var time = setTimeout(() => { this.hideUpload = false; clearTimeout(time) }, 1000)
      if (this.uploadSubmitFlag) {
        this.uploadDisabled = false
      } else {
        this.uploadDisabled = true
        var time1 = setTimeout(() => { this.uploadDisabled = false; clearTimeout(time1) }, 1000)
      }
    },

    onUploadProgress (event, file, fileList) {

    },

    onUploadChange (file, fileList) {
      if (this.$refs.upload.uploadFiles.length >= 20) { this.hideUpload = true }
      this.$forceUpdate()
    },
    errMsg () {
      if (this.errShow && this.uploadFileNum === this.picNum) {
        this.picNum = 0
        this.message(this.$i18n.t('pictureManager.onlyPictures'), true)
        this.notImg = false
        this.errShow = false
      }
    },
    /**
     * 上传图片前检查合法性
     * @param file
     * @returns {boolean}
     */
    async beforeUpload (file) {
      this.picNum++
      let typeArray = file.type.split('/')
      this.errMsg()
      if (typeArray[0] !== 'image') {
        this.errShow = true
        this.errMsg()
        return Promise().reject()
      }
      if (this.uploadFileNum === this.picNum) {
        this.picNum = 0
      }
      const isSize = file.size / (1024 * 1024) < 2
      if (!isSize) {
        try {
          const resultBlob = await imageCompression(file, {
            maxSizeMB: 2 // 压缩大小
          })
          const fs = new File([resultBlob], file.name, {
            type: file.type
          })
          return fs
        } catch (error) {
          return Promise().reject()
        }
        // this.errShow = true
        // this.errMsg()
        // return false
      }
      return true
    },

    uploadNumberLimit () {
      if (!this.options.multiple) {
        return 1
      }
      return this.options.limit - this.images.length - this.uploadFileNum
    },

    uploadTypeTip () {
      return this.$i18n.t('pictureManager.onlySupported') + ' jpg/png/gif ' + this.$i18n.t('pictureManager.pic')
    },

    uploadSizeTip () {
      return this.$i18n.t('pictureManager.notExceed') + '2M'
    },

    uploadTips () {
      let tips = [this.uploadTypeTip(), this.uploadSizeTip()]

      if (!this.options.multiple) {
        return tips.join('，')
      }

      if (this.images.length > 0) {
        tips.push(this.$i18n.t('pictureManager.alreadyExist') + this.images.length + this.$i18n.t('pictureManager.unit'))
      }

      const uploadFileNum = this.$refs.upload ? this.$refs.upload.uploadFiles.length : 0
      if (uploadFileNum > 0) {
        tips.push(this.$i18n.t('pictureManager.soonUpload') + uploadFileNum + this.$i18n.t('pictureManager.unit'))
      }
      this.uploadFileNum = uploadFileNum
      tips.push(this.$i18n.t('pictureManager.remainder') + (this.options.limit - this.images.length - uploadFileNum) + this.$i18n.t('pictureManager.unit') + this.$i18n.t('pictureManager.upload'))

      return tips.join(',')
    },

    /**
     * 上传错误处理
     * @param err
     * @param file
     * @param fileList
     */
    onUploadError (err, file, fileList) {
      this.message(this.$i18n.t('pictureManager.requestError'), true)
      // console.log(err)
      throw err
    },

    /**
     * 上传成功处理
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess (response, file, fileList) {
      this.uploadFlag ++
      this.fileIds.push(response)
      // this.disabled = true
      if (this.uploadFileNum === this.uploadFlag) {
        if (this.selectGroup) {
          this.submitBatchMove()
        }
        this.$refs.upload.uploadFiles = []
        this.options.activeTab = 'pick'
        this.loadListImage(1)
      }
    },

    /**
     * 选择上传文件超过限制文件个数提示
     */
    onUploadExceedTip () {
      this.message(this.$i18n.t('pictureManager.maxSelect') + this.uploadNumberLimit() + this.$i18n.t('pictureManager.unit') + this.$i18n.t('pictureManager.upload'))
    },
    message (msg, isInfo) {
      var type = 'error'
      if (isInfo) {
        type = 'info'
      }
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    },

    /**
     * tab切换事件
     */
    tabClick (tab) {
      this.fileName = ''
      if (tab.name === 'pick') {
        this.loadListImage(1)
      }
    },

    /**
     * 关闭回调
     */
    handleDialogClose () {
      this.fileName = ''
    }
  },

  mounted () {
    this.loadListImage()
  },

  computed: {

  }
}
</script>

<style lang="scss" scoped>
.elx-images {
  & >>> .el-upload-list__item,
  & >>> .el-upload--picture-card {
    width: 78px;
    height: 78px;
    line-height: 82px;
    border-radius: 5px;
  }
}
.elx-imgbox-dialog {
  height: 100% !important;
}

.elx-imgbox-dialog {
  $bg: #f6f6f6;
  top: 40px;
  .el-badge {
    vertical-align: bottom;
  }

  & >>> .el-dialog {
    width: 820px;
    & >>> .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
    }

    & >>> .el-dialog__body {
      padding: 0;
      background: $bg;
    }
  }

  >>> .el-dialog__header{
    position: sticky;
    top: 0px;
    z-index: 100;
    background-color: white;
    
  }

  & >>> .el-tabs {
    & >>> .el-tabs__header {
      margin-right: 0;
      margin-top: 5px;
      .el-tabs__nav-wrap::after {
        background: $bg;
      }
    }
    & >>> .el-tabs__item.is-active {
      background: #fff;
    }
    & >>> .el-tabs--left .el-tabs__nav-wrap {
      padding-top: 15px;
    }

    & >>> .el-tabs__content {
      height: 740px;
      // 弹窗高度
      background: #fff;
    }
  }

  .elx-foot {
    padding: 15px 0 0 10px;
    text-align: right;
    margin-right: 30px;
    .el-button {
      margin: 0 0 0 10px;
    }
  }
  .elx-upload-foot {
    padding: 15px 0 0 10px;
    text-align: left;
    .el-button {
      margin: 0 0 0 10px;
    }
  }

  .pick-block {
    position: relative;

    .elx-img-list-loading {
      position: absolute;
      top: 60px;
      z-index: 9;
      left: 0;
      right: 0;
      width: 100%;
      height: 520px;
      // 加载层高度
      background: #fff;
      text-align: center;

      .el-icon-loading {
        font-size: 50px;
        color: #409eff;
        line-height: 460px;
      }
    }

    .elx-img-list {
      padding: 10px;
      height: 530px;
      // 图片列表高度
      width: 650px;
       .noData{
          text-align: center;
          width: 100%;
          margin-top:30% ;
          color: #999;
        }
      .img-item {
        $imgSize: 100px;
        $size: 104px;
        float: left;
        margin: 10px;
        width: $imgSize;
        cursor: pointer;
        position: relative;
        font-size: 12px;

        img {
          width: $imgSize;
          height: $imgSize;
          display: block;
          object-fit: contain
        }

        .title {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          background: $bg;
          padding: 0 5px;
        }

        .title {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          background: $bg;
          padding: 0 5px;
        }
        .operate {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          // background: $bg;
          margin-top: 2px;
          padding: 0 5px;
          .edit {
            float: left;
            padding-left: 5px;
          }
          .del {
            float: right;
            padding-right: 5px;
          }
        }

        .label {
          position: absolute;
          z-index: 9;
          left: 0;
          bottom: 24px;
          width: 100%;
          height: 21px;
          line-height: 21px;
          text-align: center;
          color: #fff;

          &:after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 21px;
            background: #000;
            opacity: 0.3;
            z-index: -1;
          }
        }

        .selected {
          position: absolute;
          right: -3px;
          top: -3px;
          width: $size;
          height: 130px;
          border: 3px solid #409eff;
          border-radius: 3px;
          text-align: right;
          .icon {
            background: #409eff;
            text-align: center;
            height: 24px;
            width: 24px;
            line-height: 24px;
            display: inline-block;
            font-size: 16px;
            color: #fff;
            border-radius: 0 0 0 3px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }

      &::after {
        content: " ";
        display: table;
        height: 0;
        clear: both;
        visibility: hidden;
      }
    }

    .el-pagination {
      position: relative;
      padding: 5px;
      text-align: right;
      * {
        background: none;
      }
    }
  }

  .upload-block {
    .upload-img-preview {
      padding: 20px;

      /* 上传图片预览改为使用背景图片按比例缩放方式 */
      & >>> .el-upload--picture-card,
      & >>> .el-upload-list--picture-card .el-upload-list__item,
      & >>> .el-upload-list--picture-card .el-upload-list__item .wp {
        width: 90px;
        height: 90px;
        line-height: 98px;
        background-size: cover;
        background-position: 50% 50%;
      }

      & >>> .el-upload-list--picture-card .el-upload-list__item-status-label i {
        margin-top: 12px;
        vertical-align: top;
      }
    }

    .upload-tip {
      padding: 0 20px;
      font-size: 13px;
      color: #999;
    }

    .upload-title {
      font-size: 16px;
      color: #666;
      padding: 20px 0 0 20px;
    }
  }
}

.form {
  padding: 15px 0px 0px 20px;
}

.el-upload-list__item-actions {
  a {
    i {
      color: #fff;
    }
  }
}
</style>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: flex-start;
  .group {
    min-width: 200px;
    padding: 10px;
    .group-item {
      height: 38px;
      line-height: 38px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      cursor:pointer;

      .group-name {
        width: 180px;
      }
      .sidebar-operate {
        .el-icon-delete,
        .el-icon-edit {
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
    .group-item:hover{
      background: #F7F7F7;
    }
    .active {
      background: #F7F7F7;
    }
  }
  // .img-list {
  //   width: 600px;
  // }
  .group-box {
    height: 600px;
    min-width: 200px;
    overflow:auto;
  }

}
.upload-box {
  margin-left: 50px;
  .select-group-box {
    padding: 20px 0 0 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .select-group-box-item {
      margin-right: 10px;
    }
  }
}
</style>
<style scoped>
div >>> .el-tabs__header{
  display: none !important;
}
.elx-imgbox-dialog .upload-block .upload-img-preview >>> .el-upload-list--picture-card .el-upload-list__item-status-label i{
  margin-top:0 !important;
}
.upload-box /deep/ .el-upload-list__item img.el-upload-list__item-thumbnail{
  vertical-align: initial;
}
</style>
<style lang="scss">
.upload-hide{
  .el-upload--picture-card{
    display: none;
  }
}
</style>