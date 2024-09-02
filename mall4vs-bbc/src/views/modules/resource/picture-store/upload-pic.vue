<template>
  <el-dialog
      :title="$t('pictureManager.uploadPic')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      top="200px"
      v-if="visible"
      width="770px"
      @close="handleDialogClose"
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
          <el-form-item :label="$t('pictureManager.uploadPic')+':'">
            <el-upload
              ref="upload"
              :class="['upload-img-preview',uploadNumberLimit()?'uoloadSty':'disUoloadSty',hideUploadEdit?'hide':'']"
              list-type="picture-card"
              accept="image/*"
              :action="$http.adornUrl('/admin/file/upload/img')"
              :headers="{Authorization: $cookie.get('Authorization_vs'),locale:lang}"
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
              <i class="el-icon-plus" v-if="uploadNumberLimit()"></i>
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
    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" @pageUpdateGroup="pageUpdateGroup" />
  </el-dialog>
</template>

<script type="text/babel">
// import { Debounce } from '@/utils/debounce'
import groupAddOrUpdate from '@/components/group-add-or-update'
import imageCompression from 'browser-image-compression'
export default {
  name: 'uploadPic',
  components: {
    groupAddOrUpdate
  },
  data () {
    return {
      lang: localStorage.getItem('lang') || 'zh_CN',
      fileIds: [], // 已选图片的fileId
      dataForm: {},
      uploadFileNum: 0,
      uploadDisabled: false,
      uploadSubmitFlag: false,
      createGroupName: '', // 新建分组名
      groupVisible: false,
      showBatchMove: false,
      options: {
        multiple: true, // 是否支持选取多个图片
        limit: 20, // 最多可选择图片数量
        maxSize: 2, // 最大尺寸（M）
        enableUpload: true, // 是否启用图片上传
        callback: null
      },
      groupList: [], // 分组列表
      selectGroup: '',
      showGroupType: 0, // 0：新建分组 1：修改分组
      newImgName: '',
      isTrue: true,
      errShow: false,
      hideUploadEdit: false, // 上传图片按钮显隐
      picNum: 0,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      type: 2,
      fileName: '',
      listType: 'picture',
      isLoading: true,
      visible: false,
      notImg: false,
      uploadSuccessCount: 0,
      imgRes: {
        current: 1
      },
      selectAll: false,
      uploadFlag: 0,
      groupId: 0, // 点击分组
      updateGroupId: 0 // 修改分组的id
    }
  },
  mounted () {

    // console.log(this.$refs.upload)
  },
  methods: {
    show () {
      this.selectGroup = ''
      this.getGroupList()
      this.visible = true
    },

    hide () {
      this.visible = false
      // console.log(12312)
    },
    /**
     * 批量移动分组
     */
    batchMove () {
      if (!this.fileIds.length) {
        this.$message({
          message: this.$i18n.t('pictureManager.tips1'),
          type: 'error',
          duration: 1000
        })
        return
      }
      this.showBatchMove = true

      // console.log(this.fileIds)
    },
    submitBatchMove () {
      if (!this.selectGroup) {
        this.visible = false
        this.$emit('getImgListData')
        return this.$message({
          type: 'success',
          message: this.$i18n.t('pictureManager.pic') + this.$i18n.t('resource.uploadSuccess')
        })
      }
      this.$http({
        url: this.$http.adornUrl('/admin/file/batchMove'),
        method: 'put',
        data: {
          fileIds: this.fileIds.map(x => x.data),
          attachFileGroupId: this.selectGroup
        }
      }).then(({ data }) => {
        this.fileIds = []
        this.$message({
          type: 'success',
          message: this.$i18n.t('pictureManager.pic') + this.$i18n.t('resource.uploadSuccess')
        })
        this.$emit('getImgListData')
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
    },
    updateGroup (id, name) {
      this.updateGroupId = id
      this.createGroupName = name
      this.showGroupType = 1
      this.groupVisible = true
    },
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(1)
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
      this.uploadSubmitFlag = true
      var time = setTimeout(() => { this.uploadSubmitFlag = false; clearTimeout(time) }, 1000)
      this.uploadFlag = 0
      this.fileIds = []
      this.notImg = true
      if (!this.$refs.upload.uploadFiles || !this.$refs.upload.uploadFiles.length) {
        return this.$message.error(this.$i18n.t('pictureManager.tips1'))
      }
      this.$refs.upload.submit()
    },

    onUploadProgress (event, file, fileList) {

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
      this.uploadFileNum = this.$refs.upload.uploadFiles.length
      var time = setTimeout(() => { this.hideUploadEdit = false; clearTimeout(time) }, 1000)
      if (this.uploadSubmitFlag) {
        this.uploadDisabled = false
      } else {
        this.uploadDisabled = true
        var time1 = setTimeout(() => { this.uploadDisabled = false; clearTimeout(time1) }, 1000)
      }
    },
    onUploadChange (file, fileList) {
      this.uploadFileNum = this.$refs.upload.uploadFiles.length
      if (this.$refs.upload.uploadFiles.length >= this.options.limit) {
        this.hideUploadEdit = true
      } else {
        this.hideUploadEdit = false
      }
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
      return this.options.limit - this.uploadFileNum
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
      if (this.uploadFileNum > 0) {
        tips.push(this.$i18n.t('pictureManager.soonUpload') + this.uploadFileNum + this.$i18n.t('pictureManager.unit'))
      }
      tips.push(this.$i18n.t('pictureManager.remainder') + (this.options.limit - this.uploadFileNum) + this.$i18n.t('pictureManager.unit') + this.$i18n.t('pictureManager.upload'))

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
        this.submitBatchMove()
        this.$refs.upload.uploadFiles = []
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
     * 关闭回调
     */
    handleDialogClose () {
      this.$emit('handleDialogClose')
      this.fileName = ''
      this.visible = false
      this.fileIds = []
    }
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
.el-upload-list--picture-card .el-upload-list__item-status-label {
  top: -5px;
}
.el-upload-list--picture-card .el-upload-list__item-status-label i {
  vertical-align: top;
}
</style>
<style lang="scss" scoped>
.select-group-box-item {
  margin-right: 10px;
}
div >>> .el-tabs__header{
  display: none !important;
}
.upload-tip {
  font-size: 12px;
  color: #999999;
}
</style>
<style scoped>
.hide >>> .el-upload--picture-card{
  display: none;
}
</style>


