<template>
  <div class="video-box">
    <el-dialog
      :title="this.$i18n.t('videoManager.picManager')"
      :visible.sync="visible"
      class="elx-video-dialog"
      @close="handleDialogClose"
      width="900px"
      :append-to-body="visible"
    >
      <el-tabs v-model="options.activeTab" tab-position="top" @tab-click="tabClick">
        <el-tab-pane
          :label="this.$i18n.t('videoManager.chooseVideo')"
          name="pick"
          class="pick-block"
        >
          <div class="elx-img-list-loading" v-if="isLoading">
            <div class="el-icon-loading"></div>
          </div>
          <el-form :inline="true" :model="dataForm" class="demo-form-inline form">
            <el-form-item>
              <el-input
                v-model="fileName"
                size="medium"
                :placeholder="this.$i18n.t('videoManager.videoName')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div
                @click="searchImg"
                class="primary-btn default-btn"
              >{{$t("videoManager.query")}}</div>
              <div
                class="default-btn primary-btn"
                @click="options.activeTab='upload'"
                plain
                v-if="options.enableUpload"
                style="margin-left:10px"
              >{{$t("videoManager.uploadVideo")}}</div>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="clean">清空</el-button>
            </el-form-item>-->
          </el-form>
          <div class="box">
            <div class="group">
              <div :class="['group-item',groupId === 0 ?'active': '']"  @click="clickGroup(0)">
                <span class="group-name">{{$t("videoManager.AllVideos")}}</span>
              </div>
              <div :class="['group-item',groupId === item.attachFileGroupId ?'active': '']" v-for="(item,index) in groupList" :key="item.attachFileGroupId">
                <span class="group-name" @click="clickGroup(item.attachFileGroupId)">{{ item.name }}</span>
              </div>
            </div>
            <div class="img-list">
              <div class="elx-main elx-img-list">
                <div v-for="(img, itemIndex) in imgRes.records" :key="itemIndex" class="img-item">
                  <div class="thumb-wp" @click="onClickListImage(img)">
                    <!-- <img v-if="img.filePath" :src="(img.filePath).indexOf('http')===-1 ? resourcesUrl + img.filePath : img.filePath" alt="img.name" /> -->
                    <video
                      :src="resourcesUrl + img.filePath"
                      controls="controls"
                      class="showVideo"
                      style="width:175px;height:87.5px;"
                    />
                    </div>
                    <div class="title" @click="onClickListImage(img)">{{ img.fileName }}</div>
                    <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
                    <span v-if="img.selected" class="selected" @click="onClickListImage(img)">
                      <span class="icon el-icon-check" />
                    </span>
                  </div>
                </div>
                <div class="data-tips" v-if="!(imgRes.records&&imgRes.records.length)">{{$t("order.noData")}}</div>
                <el-pagination
                    layout="total, prev, pager, next"
                    :current-page="imgRes.current"
                    :page-size="imgRes.size"
                    :total="imgRes.total"
                    @current-change="onPageNumChange"
                ></el-pagination>
            </div>
          </div>
          <!-- 底部确定按钮 -->
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
          :label="this.$i18n.t('videoManager.uploadVideo')"
          name="upload"
          class="upload-block"
          v-if="options.enableUpload"
        >
          <div class="elx-upload-main">
            <div class="upload-title">{{$t("resource.selectGroup")}}:</div>
            <div class="select-group-box">
              <div class="select-group-box-item">{{$t("resource.group")}}:</div>
              <el-select size="small" v-model="selectGroup" clearable :placeholder="$t('resource.selectGroup')" @change="changeSelectGroup" class="select-group-box-item">
                <el-option
                  v-for="item in groupList"
                  :key="item.attachFileGroupId"
                  :label="item.name"
                  :value="item.attachFileGroupId">
                </el-option>
              </el-select>
              <el-button style="margin-left: 10px" type="text" size="small" @click="createGroup()">{{ $t('resource.newGroup') }}</el-button>
            </div>
            <div class="upload-title">{{$t("videoManager.selectLocalVideo")}}</div>
            <!-- 视频预览 -->
              <div class="upload-video-box">
                <div v-for="(item, index) in videoList" :key="index" class="video-preview">
                <video
                  v-if="item.url"
                  class="upShowVideo"
                  :src="item.url"
                  controls="controls"
                  style="width:175px;height:87.5px;"
                />
                <!-- 显示查看和删除的按钮弹窗 -->
                <div
                  class="avatar-uploader-popup"
                >
                  <i class="el-icon-delete" @click="preDeleteVideo(index)" />
                </div>
              </div>
            </div>
            <el-upload
              v-show="!uploadHide"
              ref="upload"
              class="upload-img-preview"
              list-type="picture-card"
              action=""
              :headers="{Authorization: $cookie.get('Authorization_vs'),locale:lang}"
              :multiple="true"
              accept="video/*"
              :auto-upload="false"
              :show-file-list="false"
              :limit="options.limit"
              :before-upload="beforeUploadVideo"
              :http-request="httpRequest"
              :on-change="onUploadChange"
              :on-progress="onUploadProgress"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-exceed="onUploadExceedTip"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div v-show="uploadHide" style="height:20px;"></div>

            <div class="upload-tip">{{ uploadTips() }}</div>

            <div class="elx-upload-foot">
              <div @click="options.activeTab = 'pick'" class="default-btn">{{$t("shopFeature.edit.back")}}</div>
              <div
                class="primary-btn default-btn"
                @click="onUploadConfirm"
              >{{$t("videoManager.confirmUpload")}}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" />
  </div>
</template>

<script type="text/babel">
import groupAddOrUpdate from '@/components/group-add-or-update'
export default {
  name: 'ElxVideobox',
  components: {
    groupAddOrUpdate
  },
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      images: [], // 已选视频
      fileIds: [], // 已选视频的fileId
      uploadHide: false,
      dataForm: {},
      uploadFileNum: 0,
      groupVisible: false,
      showBatchMove: false,
      options: {
        multiple: true, // 是否支持选取多个视频
        limit: 20, // 最多可选择视频数量
        maxSize: 2, // 最大尺寸（M）
        activeTab: 'pick',
        enableUpload: true, // 是否启用视频上传
        callback: null
      },
      groupList: [], // 分组列表
      selectGroup: '',
      showGroupType: 0, // 0：新建分组 1：修改分组
      newImgName: '',
      isTrue: true,
      imageObject: null,
      errShow: false,
      picNum: 0,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      changeNameVisible: false,
      type: 2,
      fileName: '',
      isLoading: true,
      visible: false,
      disabled: false,
      notImg: false,
      uploadSuccessCount: 0,
      imgRes: {
        current: 1
      },
      videoList: [],
      isSubmit: false,
      uploadFlag: 0,
      selectAll: false,
      groupId: 0, // 点击分组
      groupFileIds: [] // 分组视频ids
    }
  },

  methods: {
    /**
     * 初始化
     * type 1：单  2：多
     */
    init (type, limit) {
      this.visible = true
      this.isLoading = false
      this.options.activeTab = 'pick'
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
    // 确定选择该视频
    onConfirm () {
      if (this.type) {
        this.$emit('refreshPic', this.images[0].filePath)
      } else {
        let imgPaths = this.images.map(file => {
          return file.filePath
        }).join(',')
        this.$emit('refreshPic', imgPaths)
      }
      this.visible = false
    },
    /**
     * 提交修改后的视频名称
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
          type: 2
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
    changeSelectGroup () {
      if (!this.selectGroup) {
        this.groupFileIds = []
      }
    },
    submitBatchMove () {
      if (!this.selectGroup) {
        return
      }
      console.log('this.groupFileIds', this.groupFileIds)
      this.$http({
        url: this.$http.adornUrl('/admin/file/batchMove'),
        method: 'put',
        data: {
          fileIds: this.groupFileIds,
          attachFileGroupId: this.selectGroup
        }
      }).then(({ data }) => {
        this.images = []
        this.fileIds = []
        this.showBatchMove = false
        this.selectAll = false
        this.loadListImage()
      })
    },
    /**
     * 点击视频时选中或取消选中视频
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
      if (this.type && !this.uploadNumberLimit()) {
        this.message(this.$i18n.t('pictureManager.superiorLimit'))
        return false
      }
      this.images.push(JSON.parse(JSON.stringify(img)))
      this.fileIds.push(img.fileId)
      img.selected = true
    },
    /**
     * 清除所有已点击视频样式
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
         * 按视频名称搜索视频
         */
    searchImg () {
      this.loadListImage(1)
    },
    /**
     * 加载视频列表数据
     * @param page
     */
    loadListImage (current) {
      this.isLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/file/attachFilePage'),
        method: 'get',
        params: this.$http.adornParams({
          current: current,
          size: 9,
          fileName: this.fileName ? this.fileName : null,
          attachFileGroupId: this.groupId,
          type: 2
        })
      }).then(({ data }) => {
        this.imgRes = data
        this.imgRes.records.forEach(img => {
          if (this.fileIds.some(item => img.fileId === item)) {
            img.selected = true
          } else {
            img.selected = false
          }
        })
        this.isLoading = false
      })
    },

    /**
     * 视频已选则返回下标，未选则返回-1
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
    /**
     * 获取分组列表
     */
    getGroupList () {
      this.groupVisible = false
      this.$http({
        url: this.$http.adornUrl('/admin/fileGroup/list'),
        method: 'get',
        params: {
          type: 2 // 1、视频 2、视频 3、文件
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
      this.loadListImage(1)
    },
    /**
     * 提交上传
     */
    onUploadConfirm () {
      var length = this.$refs.upload.uploadFiles.length
      if (!length) {
        this.message(this.$i18n.t('publics.videoNoNull'), false)
        return
      }
      this.notImg = true
      this.isSubmit = true
      this.fileIds = []
      this.uploadFlag = 0
      this.$refs.upload.submit()
    },

    onUploadProgress (event, file, fileList) {

    },
    /**
     * 上传视频
     */
    httpRequest (event) {
      this.videoList.forEach(item => {
        if (item.uid === event.file.uid) {
          this.uploadFile(event)
          this.notImg = true
        }
      })
    },
    uploadFile (event) {
      const file = event.file
      // 获取本次上传文件的位置
      const formdata = new FormData()
      formdata.append('FileName', file.name)
      formdata.append('file', file)
      this.$http({
        url: this.$http.adornUrl('/admin/file/upload/element'),
        method: 'post',
        headers: {
          'Content-Type': file.type
        },
        data: formdata
      }).then(res => {
        event.onSuccess(res.data)
      })
    },
    // 视频预上传
    onUploadChange (file, fileList) {
      if (['video/mp4', 'video/ogg', 'video/webm'].indexOf(file.raw.type) === -1) {
        this.$newMessage.error(this.$i18n.t('videoManager.tips2'))
        return false
      }
      if (this.isSubmit) {
        return
      }
      const showVideoList = document.getElementsByClassName('upShowVideo') || []
      showVideoList.forEach((item) => {
        if (!item.paused) { item.pause() }
      })
      const videoSrc = URL.createObjectURL(file.raw)
      this.videoList.push({ url: videoSrc, uid: file.uid })
    },
    // 删除预览视频
    preDeleteVideo (index) {
      this.$refs.upload.uploadFiles.splice(index, 1)
      this.videoList.splice(index, 1)
    },
    errMsg () {
      if (this.errShow && this.uploadFileNum === this.picNum) {
        this.picNum = 0
        this.message(this.$i18n.t('videoManager.onlyPictures'), true)
        this.notImg = false
      }
    },
    // 新建分组
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(2)
      })
    },
    /**
     * 上传视频前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUploadVideo (file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传视频大小不能超过20MB哦!')
        return false
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
      return this.$i18n.t('videoManager.onlySupported') + ' mp4/mov/webm ' + this.$i18n.t('videoManager.video')
    },

    uploadSizeTip () {
      return this.$i18n.t('videoManager.notExceed') + '20M'
    },

    uploadTips () {
      let tips = [this.uploadTypeTip(), this.uploadSizeTip()]

      if (!this.options.multiple) {
        return tips.join('，')
      }

      if (this.images.length > 0) {
        tips.push(this.$i18n.t('videoManager.alreadyExist') + this.images.length + this.$i18n.t('videoManager.unit'))
      }

      const uploadFileNum = this.videoList.length
      if (uploadFileNum > 0) {
        tips.push(this.$i18n.t('videoManager.soonUpload') + uploadFileNum + this.$i18n.t('videoManager.unit'))
      }
      if (uploadFileNum >= this.options.limit) {
        this.uploadHide = true
      } else {
        this.uploadHide = false
      }
      this.uploadFileNum = uploadFileNum
      tips.push(this.$i18n.t('videoManager.remainder') + (this.options.limit - this.images.length - uploadFileNum) + this.$i18n.t('videoManager.unit') + this.$i18n.t('videoManager.upload'))

      return tips.join(',')
    },

    /**
     * 上传错误处理
     * @param err
     * @param file
     * @param fileList
     */
    onUploadError (err, file, fileList) {
      this.message(this.$i18n.t('videoManager.requestError'), true)
      // console.log(err)
      throw err
    },

    /**
     * 上传成功处理s
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess (fileId, file, fileList) {
      this.uploadFlag ++
      // this.fileIds.push(fileId)
      this.groupFileIds.push(fileId)
      if (this.videoList.length === this.uploadFlag) {
        this.disabled = true
        this.$refs.upload.uploadFiles = []
        if (this.selectGroup) {
          this.submitBatchMove()
        }
        this.options.activeTab = 'pick'
        setTimeout(() => {
          this.isSubmit = false
          this.videoList = []
        })
        this.loadListImage(1)
      }
    },

    /**
     * 选择上传文件超过限制文件个数提示
     */
    onUploadExceedTip () {
      this.message(this.$i18n.t('videoManager.maxSelect') + this.uploadNumberLimit() + this.$i18n.t('videoManager.unit') + this.$i18n.t('videoManager.upload'))
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
    this.getGroupList()
    this.loadListImage()
  },

  computed: {

  }
}
</script>

<style lang="scss">
.elx-images {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 78px;
    height: 78px;
    line-height: 82px;
    border-radius: 5px;
  }
}
.elx-head {
  background: #F7F7F7;
  height: 40px;
  width: 100%;
  line-height: 40px;
  .text {
    color: #606266;
    font-size: 14px;
    margin-left: 7px;
    cursor:pointer;
  }
}
.elx-video-dialog {
  $bg: #f6f6f6;
  height: 100% !important;
  .el-badge {
    vertical-align: bottom;
  }

  .el-dialog {
    width: 820px;
    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
    }

    .el-dialog__body {
      padding: 0;
      background: $bg;
    }
  }

  .el-tabs {
    .el-tabs__header {
      margin-right: 0;
      margin-top: 5px;
      .el-tabs__nav-wrap::after {
        background: $bg;
      }
    }
    .el-tabs__item.is-active {
      background: #fff;
    }
    .el-tabs--left .el-tabs__nav-wrap {
      padding-top: 15px;
    }

    .el-tabs__content {
      min-height: 740px;
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
.upload-block {
    .upload-img-preview {
      padding: 20px;

      /* 上传视频预览改为使用背景视频按比例缩放方式 */
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .el-upload-list--picture-card .el-upload-list__item .wp {
        width: 90px;
        height: 90px;
        line-height: 98px;
        background-size: cover;
        background-position: 50% 50%;
      }

      .el-upload-list--picture-card .el-upload-list__item-status-label i {
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
.upload-video-box {
  .video-preview {
    width: 175px;
    height: 100px;
    display: inline-block;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 8px;
    margin-bottom: 5px;
    margin-top: 20px;
}
.avatar-uploader-popup{
  width: 100%;
  background: #f6f6f6;
  height: 18px;
}
}
.group-box {
  height: 600px;
  min-width: 200px;
  overflow:auto;
}
.select-group-box {
  padding: 20px 0 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .select-group-box-item {
    margin-right: 10px;
  }
}
.box {
  display: flex;
  justify-content: flex-start;
  .group {
    min-width: 200px;
    height: 600px;
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
  .img-list {
    width: 1100px;
    position: relative;
    .data-tips {
      position: absolute;
      top: 30%;
      left: 38%;
      color: #999;
    }
  }
}
.pick-block {
    position: relative;
    $bg: #f6f6f6;
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
      min-height: 530px;
      // 视频列表高度

      .img-item {
        $imgSize: 175px;
        $size: 179px;
        float: left;
        margin: 10px;
        margin-bottom: 20px;
        margin-right: 20px;
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
          height: 143px;
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
      float: none;
      margin-right: 25px;

      * {
        background: none;
      }
    }
  }
.elx-upload-main {
  padding-left: 70px;
  .elx-upload-foot {
    padding: 15px 0 15px 10px;
    text-align: left;
    .el-button {
      margin: 0 0 0 10px;
    }
  }
}

</style>
<style scoped>
div >>> .el-tabs__header{
  display: none !important;
}
</style>
