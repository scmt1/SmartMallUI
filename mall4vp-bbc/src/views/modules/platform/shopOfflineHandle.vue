<template>
  <el-dialog title="违规管理" :close-on-click-modal="false" :visible.sync="visible" width="35%">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="处理人" prop="handler">
        <el-input v-model="dataForm.handler" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="下线原因" prop="offlineReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          v-model="dataForm.offlineReason"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="下线时间" prop="createTime">
        <el-input v-model="dataForm.createTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="处理状态" prop="status">
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">违规下线</el-radio>
          <el-radio :label="3">恢复上线</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" size="mini" @click="dataFormSubmit()">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        eventId: null,
        handleType: null,
        handleId: null,
        shopId: null,
        handlerId: null,
        status: null,
        offlineReason: null,
        applyReason: null,
        eventItemId: null,
        lastOfflineHandleEventItem: null
      },
      isAudit: false,
      refuseReason: '',
      id: 0,
      dataRule: {
      }
    }
  },
  props: {
    selectUrl: {
      default: '',
      type: String
    },
    updateUrl: {
      default: '',
      type: String
    }
  },
  methods: {
    init (id) {
      this.id = id || 0
      this.isAudit = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.id) {
          this.$http({
            url: this.$http.adornUrl(this.selectUrl + '/' + this.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (!data) {
              this.$message({
                message: '未找到该商品的违规信息',
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
            this.dataForm = data
            let lastOfflineHandleEventItem = data.lastOfflineHandleEventItem
            if (lastOfflineHandleEventItem) {
              this.dataForm.applyReason = lastOfflineHandleEventItem.reapplyReason
              this.dataForm.eventItemId = lastOfflineHandleEventItem.eventItemId
              this.refuseReason = lastOfflineHandleEventItem.refuseReason
            }
            if (data.status === 2) {
              this.refuseReason = ''
              this.isAudit = true
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$confirm('确认对该店铺进行审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.visible = false
        this.$http({
          url: this.$http.adornUrl(this.updateUrl),
          method: 'post',
          data: this.$http.adornData({
            eventId: this.dataForm.eventId,
            eventItemId: this.dataForm.eventItemId,
            handleId: this.id,
            status: this.dataForm.status,
            refuseReason: this.refuseReason || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        })
      })
    }
  }
}
</script>
<style  lang="scss" scoped>
.content-color {
  color: #4395ff;
}
</style>
