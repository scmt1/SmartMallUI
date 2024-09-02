<template>
  <el-dialog
      :title="$t('videoManager.uploadVideo')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="handleDialogClose"
      top="200px"
      v-if="visible"
      width="770px"
    >
    <div class="elx-imgbox-dialog">
      <div class="elx-main">
        <el-form label-width="auto">
          <el-form-item :label="$t('resource.selectGroup')+':'">
            <el-select size="small" v-model="selectGroup" clearable :placeholder="$t('tip.select')" class="select-group-box-item">
            <el-option
              v-for="item in groupList"
              :key="item.attachFileGroupId"
              :label="item.name"
              :value="item.attachFileGroupId">
            </el-option>
          </el-select>
          <div class="default-btn text-btn select-group-box-item" @click="createGroup">{{$t("resource.newGroup")}}</div>
          </el-form-item>
          <el-form-item :label="$t('videoManager.uploadVideo')+':'">
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
                <div  class="avatar-uploader-popup" >
                  <i class="el-icon-delete" @click="preDeleteVideo(index)" />
                </div>
              </div>
            </div>
              <el-upload
                ref="upload"
                :class="['upload-img-preview',uploadNumberLimit()?'uoloadSty':'disUoloadSty']"
                list-type="picture-card"
                action=""
                :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"
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
          </el-form-item>
          <el-form-item>
            <div class="upload-tip">{{ uploadTips() }}</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer">
      <div class="default-btn" @click="handleDialogClose">{{$t("shopFeature.edit.back")}}</div>
      <div
        class="primary-btn default-btn"
        @click="onUploadConfirm"
      >{{$t("pictureManager.confirmUpload")}}</div>
    </span>
    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" @pageUpdateGroup="pageUpdateGroup"  />
  </el-dialog>
</template>

<script type="text/babel">
import groupAddOrUpdate from '@/components/group-add-or-update'
import { Debounce } from '@/utils/debounce'
export default {
  components: {
    groupAddOrUpdate
  },
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      images: [], // 已选图片
      fileIds: [], // 已选图片的fileId
      dataForm: {},
      uploadFileNum: 0,
      groupVisible: false,
      showBatchMove: false,
      options: {
        multiple: true, // 是否支持选取多个图片
        limit: 9, // 最多可选择图片数量
        maxSize: 20, // 最大尺寸（M）
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
      updateGroupId: 0 // 修改分组的id
    }
  },

  methods: {
    show () {
      this.getGroupList()
      this.selectGroup = ''
      this.visible = true
    },

    hide () {
      this.visible = false
    },
    submitBatchMove () {
      if (!this.selectGroup) {
        this.visible = false
        this.$emit('getVideoListData')
        return this.$message({
          type: 'success',
          message: this.$i18n.t('videoManager.video') + this.$i18n.t('resource.uploadSuccess')
        })
      }
      this.$http({
        url: this.$http.adornUrl('/admin/file/batchMove'),
        method: 'put',
        data: {
          fileIds: this.fileIds,
          attachFileGroupId: this.selectGroup
        }
        // params: {
        //   groupId: this.selectGroup
        // }
      }).then(({ data }) => {
        this.fileIds = []
        this.$message({
          type: 'success',
          message: this.$i18n.t('videoManager.video') + this.$i18n.t('resource.uploadSuccess')
        })
        this.$emit('getVideoListData')
        this.visible = false
      })
    },
    pageUpdateGroup () {
      this.$emit('getGroupData')
    },
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
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(2)
      })
    },
    /**
     * 提交上传图片
     */
    onUploadConfirm: Debounce(function () {
      if (!this.videoList.length) {
        this.message(this.$i18n.t('videoManager.tips1'), false)
        return
      }
      this.notImg = true
      this.isSubmit = true
      this.fileIds = []
      this.uploadFlag = 0
      this.$refs.upload.submit()
    }, 1500),

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
        this.uploadFlag ++
        if (this.videoList.length === this.uploadFlag) {
          event.onSuccess(res.data)
        }
      })
    },
    // 视频预上传
    onUploadChange (file, fileList) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error(this.$i18n.t('videoManager.tips3'))
        this.$refs.upload.uploadFiles.splice(-1, 1)
        return
      }
      if (['video/mp4', 'video/ogg', 'video/webm'].indexOf(file.raw.type) === -1) {
        this.$message.error(this.$i18n.t('videoManager.tips2'))
        this.$refs.upload.uploadFiles.splice(-1, 1)
        return false
      }
      if (this.isSubmit) {
        this.$refs.upload.uploadFiles.splice(-1, 1)
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
    /**
     * 上传视频前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUploadVideo (file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      return isLt20M
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
      this.isSubmit = false
      this.message(this.$i18n.t('videoManager.requestError'), true)
      // console.log(err)
      this.videoList = []
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
      // this.uploadFlag ++
      this.fileIds.push(fileId)
      if (this.videoList.length === this.uploadFlag) {
        this.disabled = true
        this.$refs.upload.uploadFiles = []
        this.submitBatchMove()
        setTimeout(() => {
          this.isSubmit = false
          this.videoList = []
        })
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
     * 关闭回调
     */
    handleDialogClose () {
      this.$emit('uploadClose')
      this.visible = false
      this.fileName = ''
      this.videoList = []
    }
  },

  mounted () {

  },

  computed: {

  }
}
</script>

<style lang="scss">
.elx-imgbox-dialog {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 78px !important;
    height: 78px !important;
    line-height: 78px;
    border-radius: 5px;
  }
}
.disUoloadSty .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
</style>
<style lang="scss" scoped>
.select-group-box-item {
  margin-right: 10px;
}
div ::v-deep .el-tabs__header{
  display: none !important;
}
.operation-bar {
  margin: 10px 0;
}
.upload-tip {
  font-size: 12px;
  color: #999999;
}
.upload-video-box {
  width: 600px;
  .video-preview {
    width: 175px;
    height: 100px;
    display: inline-block;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 8px;
    margin-top: 20px;
  }
}
.avatar-uploader-popup{
  width: 100%;
  background: #f6f6f6;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-icon-delete {
  cursor: pointer;
}
</style>
