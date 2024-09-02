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
                  :placeholder="this.$i18n.t('pictureManager.picName')"
                  @keypress.native.enter="searchImg(true)"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div
                  @click="searchImg(true)"
                  class="primary-btn default-btn"
                >{{$t("pictureManager.query")}}</div>
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
              >{{$t("pictureManager.uploadPic")}}</div>
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
                    <span class="group-name">{{$t("pictureManager.allPictures")}}</span>
                  </div>
                  <div :class="['group-item',groupId === item.attachFileGroupId ?'active': '']" v-for="(item) in groupList" :key="item.attachFileGroupId">

                    <el-input ref="updateGroupName" v-model="createGroupName" maxlength="6" v-if="isUploadGroup && updateGroupId === item.attachFileGroupId"  size="small" style="width: 210px">
                      <div slot="append" @click="submitGroup">
                        <div style="width: 100%">{{$t('chat.confirm')}}</div>
                      </div>
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
                  <div class="img-item" v-for="(img, itemIndex) in imgRes.records" :key="itemIndex">
                    <div class="thumb-wp" @click="onClickListImage(img)">
                      <img :src="resourcesUrl + img.filePath" />
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
                      style="width: 100px;outline: none;">
                    <div class="title" v-else @click="handleFileName(img)">{{img.fileName}}</div>
                    <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
                    <span class="selected" v-if="img.selected" @click="onClickListImage(img)">
                      <span class="icon el-icon-check"></span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="data-tips" v-if="!imgRes.records.length">{{$t("order.noData")}}</div>
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
      :append-to-body="showBatchMove"
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
    <!-- /批量移动分组 -->
    <upload-pic ref="uploadPic" v-if="uploadDialogVisible" @getImgListData="loadListImage(1)" @handleDialogClose="handleDialogClose" @getGroupData="getGroupList" />
    <group-add-or-update ref="groupAddOrUpdate" v-if="groupVisible" @getGroupData="getGroupList" />
  </div>
</template>

<script type="text/babel">
import uploadPic from './upload-pic.vue'
import groupAddOrUpdate from '@/components/group-add-or-update'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'ElxImgbox',
  components: {
    uploadPic,
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
        records: [],
        current: 1
      },
      selectAll: false,
      uploadFlag: 0,
      groupId: 0, // 点击分组
      updateGroupId: 0, // 修改分组的id
      uploadDialogVisible: false,
      isUploadGroup: false,
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
    uploadDialog () {
      this.uploadDialogVisible = true
      this.$nextTick(() => {
        this.$refs.uploadPic.show()
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
          type: 1
        })
      }).then(({ data }) => {
        this.$message({
          type: 'success',
          message: this.$i18n.t('resource.updateSuccess')
        })
        this.updateFileName = ''
        this.selectGroup = ''
        this.isUpdateFileName = false
        this.loadListImage(this.imgRes.current)
      }).catch(({ e }) => {
      })
    },
    /**
     * 批量删除图片
     */
    delectImgs () {
      if (!this.fileIds.length) {
        this.$message({
          message: this.$i18n.t('pictureManager.tips1'),
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
      console.log('111')
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
          size: 30,
          fileName: this.fileName ? this.fileName : null,
          attachFileGroupId: this.groupId,
          type: 1
        }
      } else {
        this.theData = {fileName: this.theData.fileName,
          ...{
            current: current,
            size: 30,
            attachFileGroupId: this.groupId,
            type: 1
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
          if (this.isExist(img)) {
            existCount++
            img.selected = true
          } else {
            img.selected = false
          }
        })
        // console.log(this.images)
        // console.log(this.fileIds)
        // this.fileIds = []
        this.isLoading = false
        this.selectAll = this.imgRes.records.length !== 0 && this.imgRes.records.length === existCount
        if (existCount && this.imgRes.records.length !== existCount) {
          this.isIndeterminate = true
        } else {
          this.isIndeterminate = false
        }
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
      this.loadListImage()
    },
    updateGroup (id, name) {
      this.updateGroupId = id
      this.createGroupName = name
      this.isUploadGroup = true
      this.$nextTick(() => { // 2. 弹框显示DOM更新完成后 获取refs.ref1 设置焦点
        this.$refs.updateGroupName[0].focus() // 设置焦点
      })
    },
    createGroup () {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupAddOrUpdate.show(1)
      })
    },
    updateBlur () {
      this.isUploadGroup = false
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
        type: 1 // 1、图片 2、视频 3、文件
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
            this.isUploadGroup = false
            this.getGroupList()
          }
        })
      })
    }),
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
      // console.log(this.selectAll)
      // console.log(this.imgRes.records)
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
      this.uploadDialogVisible = false
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
      width: 100%;
      border: 1px solid #E8E9EC;
      // 图片列表高度
      .img-item-con {
        padding-top: 15px;
      }
      .img-item {
        $imgSize: 98px;
        $size: 98px;
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
          height: 122px;
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
    color:#999
  }
}
.pagination {
  margin-top: 30px;
  padding-right:30px;
  width:100%
}
</style>
