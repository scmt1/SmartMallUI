<template>
  <div class="elx-imgbox">
    <div class="elx-imgbox-dialog">
        <div
          class="pick-block"
        >
          <div class="search-bar">
            <el-form :inline="true" :model="dataForm">
              <el-form-item>
                <el-input
                  v-model="fileName"
                  size="small"
                  :placeholder="this.$i18n.t('videoManager.videoName')"
                  @keypress.native.enter="searchImg(true)"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div
                  @click="searchImg(true)"
                  class="primary-btn default-btn"
                >{{$t("videoManager.query")}}</div>
                <div
                class="primary-btn default-btn"
                :disabled="disabled"
                @click="createGroup"
              >{{$t("resource.newGroup")}}</div>
              </el-form-item>
              <!-- <el-form-item>
                <el-button type="primary" @click="clean">清空</el-button>
              </el-form-item>-->
            </el-form>
          </div>
          <div class="operation-bar">
            <div
                class="default-btn primary-btn"
                @click="uploadDialog"
              >{{$t("videoManager.uploadVideo")}}</div>
          </div>
          <div class="box">
            <div class="group-box">
              <div class="group">
                <div class="group-item active-title">
                  <span class="group-name">{{$t("resource.groupName")}}</span>
                  <span class="sidebar-operate">{{$t("crud.menu")}}</span>
                </div>
                <div class="group-list">
                  <div :class="['group-item',groupId === 0 ?'active': '']"  @click="clickGroup(0)">
                    <span class="group-name">{{$t("videoManager.AllVideos")}}</span>
                  </div>
                  <div :class="['group-item',groupId === item.attachFileGroupId ?'active': '']" v-for="(item) in groupList" :key="item.attachFileGroupId">

                    <el-input style="height: 31px !important;width: 210px" ref="updateGroupName" v-model="createGroupName" maxlength="6" v-if="isUploadGroup && updateGroupId === item.attachFileGroupId"  size="small">
                      <template slot="append">
                        <span @click="submitGroup">{{$t("resource.confirm")}}</span>
                      </template>
                    </el-input>
                    <span v-else class="group-name" @click="clickGroup(item.attachFileGroupId)">{{ item.name }}</span>
                    <span class="sidebar-operate">
                      <div class="default-btn text-btn" @click="updateGroup(item.attachFileGroupId,item.name)" >{{$t("resource.update")}}</div>
                      <div class="default-btn text-btn" @click="deleteGroup(item.attachFileGroupId)" >{{$t("resource.Delete")}}</div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="elx-img-list-loading" v-if="isLoading">
              <div class="el-icon-loading"></div>
            </div>
            <div class="img-list" v-else>
              <div class="elx-main elx-img-list">
                <div class="elx-head">
                  <span class="text"><el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="selectAllEvent">{{$t("resource.selectAll")}}</el-checkbox></span>
                  <span class="text" @click="delectImgs">{{$t("resource.Delete")}}</span>
                  <span class="text" @click="batchMove">{{$t("resource.Move")}}</span>
                </div>
                <div class="img-item-con">
                  <div v-for="(img, itemIndex) in imgRes.records" :key="itemIndex" class="img-item">
                    <div class="thumb-wp" @click.stop="onClickListImage(img)">
                      <!-- <img v-if="img.filePath" :src="(img.filePath).indexOf('http')===-1 ? resourcesUrl + img.filePath : img.filePath" alt="img.name" /> -->
                      <video
                        :src="resourcesUrl + img.filePath"
                        controls="controls"
                        class="showVideo"
                        style="width:175px;height:87.5px;"
                      />
                      </div>
                      <input
                        type="text"
                        @blur="isUpdateFileName = false"
                        v-if="isUpdateFileName && updateFileId === img.fileId"
                        v-model="updateFileName"
                        autofocus
                        ref="updateName"
                        maxlength="20"
                        @keyup.enter="submitImgName"
                        style="width: 175px;outline: none;">
                      <div class="title" v-else @click="handleFileName(img)">{{img.fileName}}</div>
                      <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
                      <span class="selected-def" @click="onClickListImage(img)">
                      </span>
                      <span v-if="img.selected" class="selected" @click="onClickListImage(img)">
                        <span class="icon el-icon-check" />
                      </span>
                    </div>
                  </div>
                </div>
                <div class="data-tips" v-if="!imgRes.records||!imgRes.records.length">{{$t("order.noData")}}</div>
                <el-pagination
                    layout="total, prev, pager, next, jumper"
                    :current-page="imgRes.current"
                    :page-size="imgRes.size"
                    :total="imgRes.total"
                    class="pagination"
                    @current-change="onPageNumChange"
                ></el-pagination>
            </div>
          </div>
        </div>
    </div>
    <!-- 批量移动分组 -->
    <el-dialog
      :title="$t('resource.mobileGroup')"
      :close-on-click-modal="false"
      :visible.sync="showBatchMove"
      top="200px"
      :append-to-body="visible"
      width="500px"
    >
      <el-form ref="groupForm" label-width="80px">
        <el-form-item :label="$t('resource.group')">
          <el-select size="small" v-model="selectGroup" :placeholder="$t('resource.selectGroup')">
            <el-option
              v-for="item in groupList"
              :key="item.attachFileGroupId"
              :label="item.name"
              :value="item.attachFileGroupId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="showBatchMove = false">{{$t("resource.cancel")}}</div>
        <div class="primary-btn default-btn" @click="submitBatchMove()">{{$t("resource.confirm")}}</div>
      </span>
    </el-dialog>
    <upload-video ref="uploadVideo" v-if="uploadDialogVisible" @getVideoListData="loadListImage(1)" @getGroupData="getGroupList" @uploadClose="uploadClose"  />
    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" />
    <!-- /批量移动分组 -->
  </div>
</template>

<script type="text/babel">
import uploadVideo from './upload-video.vue'
import { Debounce } from '@/utils/debounce'
import groupAddOrUpdate from '@/components/group-add-or-update'
export default {
  name: 'ElxImgbox',
  components: {
    uploadVideo,
    groupAddOrUpdate
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      images: [], // 已选图片
      fileIds: [], // 已选图片的fileId
      dataForm: {},
      uploadFileNum: 0,
      createGroupName: '', // 新建分组名
      groupVisible: false,
      showBatchMove: false,
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
      showGroupType: 0, // 0：新建分组 1：修改分组
      errShow: false,
      picNum: 0,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
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
      videoList: [],
      isSubmit: false,
      uploadFlag: 0,
      selectAll: false,

      uploadDialogVisible: false,
      isUploadGroup: false,
      groupId: 0, // 点击分组
      updateGroupId: 0, // 修改分组的id
      isUpdateFileName: false,
      updateFileName: '',
      updateFileId: '',
      isIndeterminate: false
    }
  },

  methods: {
    handleFileName (img) {
      this.selectGroup = img.attachFileGroupId
      this.updateFileId = img.fileId
      this.updateFileName = img.fileName
      this.isUpdateFileName = true
      this.$nextTick(() => { // 2. 弹框显示DOM更新完成后 获取refs.ref1 设置焦点
        this.$refs.updateName[0].focus() // 设置焦点
      })
    },
    show () {
      this.visible = true
    },

    hide () {
      this.visible = false
    },
    uploadClose () {
      this.uploadDialogVisible = false
    },
    uploadDialog () {
      this.uploadDialogVisible = true
      this.$nextTick(() => {
        this.$refs.uploadVideo.show()
      })
    },
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
     * 提交修改后的图片名称
     */
    submitImgName () {
      this.$http({
        url: this.$http.adornUrl('/admin/file/updateFile'),
        method: 'put',
        data: this.$http.adornData({
          fileId: this.updateFileId,
          fileName: this.updateFileName,
          attachFileGroupId: this.selectGroup,
          type: 2
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('resource.updateSuccess'),
          type: 'success',
          duration: 1000,
          onClose: res => {
            this.selectGroup = ''
            this.isUpdateFileName = false
            this.loadListImage(this.imgRes.current)
          }
        })
      }).catch(({ e }) => {
      })
    },
    /**
     * 批量删除
     */
    delectImgs () {
      if (!this.fileIds.length) {
        this.$message({
          message: this.$i18n.t('videoManager.tips1'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.$confirm(this.$i18n.t('pictureManager.tips3'), this.$i18n.t('resource.tips'), {
        confirmButtonText: this.$i18n.t('resource.confirm'),
        cancelButtonText: this.$i18n.t('resource.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/file/deleteByIds'),
          method: 'delete',
          data: this.fileIds
        }).then(({ data }) => {
          this.images = []
          this.fileIds = []
          this.selectAll = false
          this.selectAllEvent()
          this.loadListImage()
        })
      })
    },
    /**
     * 批量移动分组
     */
    batchMove () {
      if (!this.fileIds.length) {
        this.$message({
          message: this.$i18n.t('videoManager.tips1'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.showBatchMove = true
    },
    submitBatchMove () {
      this.$http({
        url: this.$http.adornUrl('/admin/file/batchMove'),
        method: 'put',
        data: {
          fileIds: this.fileIds,
          attachFileGroupId: this.selectGroup
        }
      }).then(({ data }) => {
        this.images = []
        this.fileIds = []
        this.showBatchMove = false
        this.selectAll = false
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.loadListImage()
            this.isIndeterminate = false
          }
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
        // 多选图片-如果已选中则取消选中
      var imgIndex = this.selectedImageIndex(img)
      if (img.selected) {
          // 取消图片已选状态
        img.selected = false
        this.images.splice(imgIndex, 1)
        this.fileIds.splice(imgIndex, 1)
      } else {
        img.selected = true
        this.images.push(JSON.parse(JSON.stringify(img)))
        this.fileIds.push(img.fileId)
      }

      // 全选按钮状态
      const everyRes = this.imgRes.records.every(imgItem => imgItem.selected)
      this.selectAll = everyRes  // 当前页面的图片是否全选
      this.isIndeterminate = !everyRes

      this.$forceUpdate()
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
    searchImg (newData = false) {
      this.loadListImage(1, newData)
    },
    /**
     * 加载图片列表数据
     * @param page
     */
    loadListImage (current, newData = false) {
      this.isLoading = true
      if (newData || !this.theData) {
        this.theData = {
          current: current,
          size: 18,
          fileName: this.fileName ? this.fileName : null,
          attachFileGroupId: this.groupId,
          type: 2
        }
      } else {
        this.theData = {fileName: this.theData.fileName,
          ...{
            current: current,
            size: 18,
            attachFileGroupId: this.groupId,
            type: 2
          } }
      }
      this.$http({
        url: this.$http.adornUrl('/admin/file/attachFilePage'),
        method: 'get',
        params: this.$http.adornParams(this.theData)
      }).then(({ data }) => {
        this.imgRes = data
        let existCount = 0
        this.imgRes.records.forEach(img => {
          if (!this.isExist(img)) {
            img.selected = false
          } else {
            existCount++
            img.selected = true
          }
        })
        // this.fileIds = []
        this.isLoading = false
        // 是否全选
        this.selectAll = this.imgRes.records.length !== 0 && this.imgRes.records.length === existCount
        if (existCount && this.imgRes.records.length !== existCount) {
          this.isIndeterminate = true
        } else {
          this.isIndeterminate = false
        }
        // this.selectAll = false
        this.isUploadGroup = false
      })
    },
    isExist (img) {
      for (let i = 0; i < this.images.length; i++) {
        if (img.fileId === this.images[i].fileId) {
          return true
        }
      }
      return false
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
    /**
     * 新建分组
     */
    submitGroup: Debounce(function () {
      if (!this.createGroupName.trim()) {
        return this.$message.error(this.$i18n.t('resource.CannotBeEmpty'))
      }
      const method = 'put'
      const param = {
        name: this.createGroupName,
        type: 2 // 1、图片 2、视频 3、文件
      }
      param.attachFileGroupId = this.updateGroupId
      this.$http({
        url: this.$http.adornUrl('/admin/fileGroup'),
        method,
        data: param
      }).then(res => {
        this.$message({
          message: this.$i18n.t('resource.successTips1'),
          type: 'success',
          duration: 1000,
          onClose: res => {
            this.getGroupList()
            this.isUploadGroup = false
          }
        })
      })
    }),
    /**
     * 获取分组列表
     */
    getGroupList () {
      this.$http({
        url: this.$http.adornUrl('/admin/fileGroup/list'),
        method: 'get',
        params: {
          type: 2 // 1、图片 2、视频 3、文件
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
    updateGroup (id, name) {
      this.updateGroupId = id
      this.createGroupName = name
      this.isUploadGroup = true
      this.$nextTick(() => { // 2. 弹框显示DOM更新完成后 获取refs 设置焦点
        this.$refs.updateGroupName[0].focus() // 设置焦点
      })
    },
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(2)
      })
    },
    deleteGroup (id) {
      this.$confirm(this.$i18n.t('pictureManager.tips2'), this.$i18n.t('resource.tips'), {
        confirmButtonText: this.$i18n.t('resource.confirm'),
        cancelButtonText: this.$i18n.t('resource.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/fileGroup'),
          method: 'delete',
          params: {
            attachFileGroupId: id
          }
        }).then(res => {
          this.getGroupList()
        })
      })
    },
    /**
     * 提交上传图片
     */
    onUploadConfirm () {
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
        this.$message.error(this.$i18n.t('videoManager.tips2'))
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
      this.videoList.splice(index, 1)
    },
    errMsg () {
      if (this.errShow && this.uploadFileNum === this.picNum) {
        this.picNum = 0
        this.message(this.$i18n.t('videoManager.onlyPictures'), true)
        this.notImg = false
      }
    },
    /**
     * 上传视频前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUploadVideo (file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error(this.$i18n.t('videoManager.tips3'))
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
      throw err
    },

    /**
     * 上传成功处理
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess (fileId, file, fileList) {
      this.uploadFlag ++
      this.fileIds.push(fileId)
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
     * 全选图片事件
     */
    selectAllEvent () {
      if (this.selectAll) {
        this.imgRes.records.forEach(img => {
          // 当其为未选中状态时才push，防止重复添加数据
          if (!img.selected) {
            this.images.push(JSON.parse(JSON.stringify(img)))
            this.fileIds.push(img.fileId)
            img.selected = true
          }
        })
      } else {
        this.imgRes.records.forEach(img => {
          img.selected = false
        })
        this.fileIds = []
        this.images = []
      }
      this.isIndeterminate = false
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
</style>
<style lang="scss" scoped>
div ::v-deep .el-input-group__append, .el-input-group__prepend {
  background: #155BD4 !important;
  color: #FFFFFF;
  border: none;
}
.search-bar {
  padding-bottom: 0px;
}
.box {
  display: flex;
  justify-content: flex-start;
  .group {
    min-width: 200px;

    // 增加滚动条样式
    .group-list{
      height:490px;
      overflow:auto;

      &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          background-color: #c1c1c1;
      }
      
      &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          border-radius: 5px;
          background-color: #f1f1f1;
      }
    }

    .group-item {
      height: 44px;
      line-height: 44px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor:pointer;

      .group-name {
        width: 200px;
      }
      .sidebar-operate {
        .default-btn + .default-btn {
          margin-left: 12px;
        }
      }
    }
    .group-item:hover{
      background: #F2F7FF;
    }
    .active {
      background: #F2F7FF;
    }
    .active-title {
      height: 40px;
      line-height: 40px;
      background: #f7f8fa !important;
      cursor: auto;
    }
  }
}
.group-box {
  height: 530px;
  min-width: 380px;
  margin-right: 25px;
  border: 1px solid #E8E9EC;
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
.pick-block {
    $bg: #f6f6f6;
    position: relative;
    .elx-img-list-loading {
      // position: absolute;
      // top: 60px;
      // z-index: 9;
      // left: 0;
      // right: 0;
      width: 100%;
      height: 100%;
      // height: 520px;
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
      min-height: 530px;
      max-width: 1200px;
      border: 1px solid #E8E9EC;
      // 图片列表高度
      .img-item-con {
        padding-top: 15px;
      }
      .img-item {
        $imgSize: 175px;
        $size: 175px;
        float: left;
        width: $imgSize;
        cursor: pointer;
        position: relative;
        font-size: 12px;
        margin: 0 10px 20px;
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
          cursor: text;
          word-break: break-word;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
         /* autoprefixer: ignore next */
          -webkit-box-orient: vertical;
          line-height: 20px;
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
          right: 0;
          top: 0;
          width: $size;
          height: 115px;
          border: 1px solid #155BD4;
          text-align: right;
          .icon {
            background: #155BD4;
            text-align: center;
            height: 18px;
            width: 18px;
            line-height: 18px;
            display: inline-block;
            font-size: 16px;
            color: #fff;
            border-radius: 0 0 0 3px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        .selected-def {
          position: absolute;
          right: 0;
          top: 0;
          width: 175px;
          height: 50%;
          text-align: left;
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
}
div ::v-deep .el-tabs__header{
  display: none !important;
}
.operation-bar {
  margin: 20px 0;
}
.img-list {
  width: 100%;
  position: relative;
    .data-tips {
    position: absolute;
    top: 30%;
    left: 38%;
    color: #999;
  }
}
.pagination {
  margin-top: 30px;
  margin-right: 30px;
}
</style>
