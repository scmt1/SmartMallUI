<template>
  <el-dialog
    :title="dataForm.status === 1 ? $t('groups.applyForListing') : $t('groups.moderated')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="35%">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'English' ? '125px': '80px'"
      size="small"
    >
      <el-form-item :label="this.$i18n.t('components.handler')" prop="handler">
        <el-input v-model="dataForm.handler" :disabled="true" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('components.processingStatus')" prop="status">
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <span v-if="dataForm.status === 1">{{$t("publics.violationShelf")}}</span>
        <span v-else-if="dataForm.status === 2">{{$t("groups.moderated")}}</span>
        <span v-else-if="dataForm.status === 3">{{$t("productComm.pass")}}</span>
        <span v-else-if="dataForm.status === 4">{{$t("components.auditNotPassed")}}</span>
        <span v-else>{{$t("product.other")}}</span>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('components.reasonForOffline')" prop="offlineReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          v-model="dataForm.offlineReason"
          :disabled="true"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('components.offlineTime')" prop="createTime">
        <el-input v-model="dataForm.createTime" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item
        class="textarea-right"
        v-if="dataForm.status === 1 || dataForm.status === 4"
        :label="this.$i18n.t('components.reasonForApply')"
        prop="reapplyReason"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          show-word-limit
          v-model="dataForm.reapplyReason"
          :disabled="!(dataForm.status === 1 || dataForm.status === 4)"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-divider v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList[0].createTime"></el-divider>
    <div v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList[0].createTime" style="marginLeft: 12px">
      <div style="margin-bottom:10px">
        <strong>{{$t("components.applicationLog")}}</strong>
      </div>
      <div v-for="item in dataForm.offlineHandleEventItemList" :key="item.eventItemId">
        <el-row type="flex" justify="space-around">
          <el-col :span="4" :class="[$t('language') === 'English'?'text-width':'']">
            <strong>{{$t("components.applicationTime")}}：</strong>
          </el-col>
          <el-col :span="24">
            <span class="content-color">{{item.createTime}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="4" :class="[$t('language') === 'English'?'text-width':'']">
            <strong>{{$t("components.reasonForApply")}}：</strong>
          </el-col>
          <el-col :span="24">
            <div>
              <span class="content-color">{{item.reapplyReason}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around" v-if="item.auditTime">
          <el-col :span="4" :class="[$t('language') === 'English'?'text-width':'']">
            <strong>{{$t("components.reviewTime")}}：</strong>
          </el-col>
          <el-col :span="24">
            <div>
              <span class="content-color">{{item.auditTime}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around" v-if="item.refuseReason">
          <el-col :span="4" :class="[$t('language') === 'English'?'text-width':'']">
            <strong>{{$t("components.denialReason")}}：</strong>
          </el-col>
          <el-col :span="24">
            <div>
              <span class="content-color">{{item.refuseReason}}</span>
            </div>
          </el-col>
        </el-row>
        <div style="width:100%">
          <el-divider />
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <div @click="visible = false" size="mini" class="default-btn">{{$t("crud.filter.cancelBtn")}}</div>
      <div
        :class="[dataForm.status !== 1 && dataForm.status !== 4?'disabled-btn':'','default-btn primary-btn']"
        @click="dataFormSubmit(dataForm.status !== 1 && dataForm.status !== 4)"
      >{{$t("components.submitApplication")}}</div>
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
        reapplyReason: '',
        offlineReason: null
      },
      id: 0,
      dataRule: {
        reapplyReason: [
            { required: true, message: this.$i18n.t('components.applicaEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    selectUrl: {
      default: '',
      type: String
    },
    applyUrl: {
      default: '',
      type: String
    }
  },
  methods: {
    init (id) {
      this.id = id || 0
      const that = this
      this.visible = true
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        if (this.id) {
          this.$http({
            url: this.$http.adornUrl(this.selectUrl + '/' + id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (!data) {
              this.$message({
                message: this.$i18n.t('components.retryAfterRefresh'),
                type: 'error',
                duration: 1500,
                onClose: () => {
                  that.dataForm.reapplyReason = ''
                  that.visible = false
                  that.$emit('refreshDataList')
                }
              })
            } else {
              this.dataForm = data
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit (status) {
      var reg = /^\s+$/g
      if (status) {
        return
      }
      if (!this.dataForm.reapplyReason || !this.dataForm.reapplyReason.trim()) {
        this.$message.error(this.$i18n.t('components.applicaEmpty'))
        return
      }
      if (reg.test(this.dataForm.reapplyReason)) {
        this.$message.error(this.$i18n.t('shopProcess.inputAllSpace'))
        return
      }
      this.$confirm(this.$i18n.t('components.areYouSureAtion'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn')
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.applyUrl),
          method: 'post',
          data: this.$http.adornData({
            eventId: this.dataForm.eventId,
            handleId: this.id,
            reapplyReason: this.dataForm.reapplyReason
          })
        }).then(({ data }) => {
          this.visible = false
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataForm.reapplyReason = ''
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {
        })
      })
    }
  }
}
</script>
<style scoped>
.textarea-right >>> .el-textarea__inner{
  padding-right: 50px;
}
</style>
<style  lang="scss" scoped>
.content-color {
  color: #4395ff;
  word-break: break-word;
}
@media (max-width:1660px) {
  .text-width {
    width: 48% !important
  }
}
</style>
