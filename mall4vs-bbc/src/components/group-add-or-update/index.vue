<template>
  <el-dialog
    :title="$t('resource.newGroup')"
    :visible.sync="groupVisible"
    top="200px"
    v-if="groupVisible"
    :append-to-body="groupVisible"
    width="500px"
  >
    <el-form ref="groupForm" label-width="80px" v-if="groupVisible">
      <el-form-item :label="$t('resource.groupName')">
        <el-input
          v-model="createGroupName"
          clearable
          size="small"
          maxlength="6"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="groupVisible = false">{{$t("resource.cancel")}}</div>
      <div class="primary-btn default-btn" @click="submitGroup()">{{$t("resource.confirm")}}</div>
    </span>
  </el-dialog>
</template>

<script type="text/babel">
import { Debounce } from '@/utils/debounce'
export default {
  name: 'uploadPic',
  data () {
    return {
      createGroupName: '', // 新建分组名
      groupVisible: false,
      showBatchMove: false,
      groupList: [], // 分组列表
      selectGroup: '',
      type: 1,
      visible: false,
      uploadSuccessCount: 0
    }
  },
  methods: {
    show (type) {
      this.groupVisible = true
      this.createGroupName = ''
      this.type = type
    },

    hide () {
      this.groupVisible = false
    },
    /**
     * 新建分组
     */
    submitGroup: Debounce(function () {
      if (!this.createGroupName.trim()) {
        return this.$message.error(this.$i18n.t('resource.CannotBeEmpty'))
      }
      const method = 'post'
      const param = {
        name: this.createGroupName,
        type: this.type // 1、图片 2、视频 3、文件
      }
      this.$http({
        url: this.$http.adornUrl('/admin/fileGroup'),
        method,
        data: param
      }).then(res => {
        this.$message({
          message: this.$i18n.t('resource.successTips'),
          type: 'success',
          duration: 1000,
          onClose: res => {
            this.groupVisible = false
            this.$emit('pageUpdateGroup')
            this.$emit('getGroupData')
          }
        })
      })
    })
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
</style>
<style lang="scss" scoped>
.search-bar {
  padding-bottom: 0px;
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
</style>
