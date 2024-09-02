<template>
  <el-dialog
    :title="dataForm.status === 1 ? $t('prodList.offShelfManage') : $t('product.pendingReview')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="35%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '130px' : '80px'"
    >
      <el-form-item :label="$t('groups.handler')" prop="handler">
        <el-input v-model="dataForm.handler" size="small" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('groups.reasonForOffline')" prop="offlineReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          size="small"
          v-model="dataForm.offlineReason"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('components.offlineTime')" prop="createTime">
        <el-input v-model="dataForm.createTime" size="small" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="isAudit" :label="$t('components.reasonForApply')" prop="applyReason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          size="small"
          v-model="dataForm.applyReason"
          :disabled="true"
        ></el-input>
      </el-form-item>

      <el-form-item
        v-if="dataForm.status>1"
        :label="$t('components.processingStatus')"
        prop="status"
      >
        <!-- 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过 -->
        <el-radio-group v-model="dataForm.status" :disabled="!isAudit">
          <el-radio :label="2" disabled>{{$t('product.pendingReview')}}</el-radio>
          <el-radio :label="3">{{$t('productComm.pass')}}</el-radio>
          <el-radio :label="4">{{$t('productComm.noPass')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status === 4"
        :label="$t('components.denialReason')"
        prop="refuseReason"
      >
        <el-input
          :disabled="!isAudit"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          maxlength="200"
          size="small"
          v-model="refuseReason"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-divider v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList[0].createTime"></el-divider>
    <el-form style="marginLeft:10px" v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList[0].createTime">
      <div>
        <div style="margin-bottom:10px">
          <strong>{{$t('components.applicationHistory')}}</strong>
        </div>
        <div v-for="item in dataForm.offlineHandleEventItemList" :key="item.eventItemId">
          <el-row type="flex" justify="space-around">
            <el-col :span="4">
              <strong>{{$t('order.applicationTime')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.createTime}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="4">
              <strong>{{$t('components.reasonForApply')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.reapplyReason}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around" v-if="item.auditTime">
            <el-col :span="4">
              <strong>{{$t('components.reviewTime')}}：</strong>
            </el-col>
            <el-col :span="24">
              <span class="content-color">{{item.auditTime}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around" v-if="item.refuseReason">
            <el-col :span="4">
              <div>
                <strong>{{$t('components.denialReason')}}：</strong>
              </div>
            </el-col>
            <el-col :span="24">
              <div>
                <span class="content-color">{{item.refuseReason}}</span>
              </div>
            </el-col>
          </el-row>
          <div>
            <el-divider />
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div :class="[!isAudit?'disabled-btn':'','default-btn primary-btn']" @click="dataFormSubmit()">{{$t('group.confirmReview')}}</div>
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
        // this.$refs['dataForm'].resetFields()
        if (this.id) {
          this.$http({
            url: this.$http.adornUrl(this.selectUrl + '/' + this.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (!data) {
              this.$message({
                message: this.$i18n.t('components.tipOfflineAuditTip1'),
                type: 'error',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
              return
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
      if (!this.isAudit) {
        return
      }
      if (this.dataForm.status === 2) {
        this.$message.warning(this.$i18n.t('components.aduitChangeTips'))
        return
      }
      if (this.dataForm.status === 4) {
        let reg = /^\s+$/g
        if (reg.test(this.refuseReason)) {
          this.$message.warning(this.$i18n.t('shopProcess.inputAllSpace'))
          return
        }
      }
      this.$confirm(this.$i18n.t('components.tipOfflineAuditTip2'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel')
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
  color: #155bd4;
  word-break: break-word;
}
</style>
