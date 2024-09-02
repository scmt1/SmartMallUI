<template>
  <!-- 下架管理 -->
  <el-dialog
    :visible.sync="operateDialogVisible"
    :close-on-click-modal="false"
    title="下线管理"
    :lock-scroll="true"
    :append-to-body="true"
    :destroy-on-close="true"
    class="operate-dlg"
    @close="onClose"
  >
    <div v-if="showOfflineManage" class="off-shelf-mag">
      <div class="msg">
        <div class="msg-item">
          <div class="tit">处理人：</div>
          <div class="int">{{ offlineDetail.handler }}</div>
        </div>
        <div class="msg-item">
          <div class="tit">下线时间：</div>
          <div class="int">{{ offlineDetail.createTime }}</div>
        </div>
        <div class="msg-item">
          <div class="tit">处理状态：</div>
          <el-tag v-if="offlineDetail.status === 1" type="danger">平台下线</el-tag>
          <el-tag v-if="offlineDetail.status === 2" type="warning">等待审核</el-tag>
          <el-tag v-if="offlineDetail.status === 3" type="success">审核通过</el-tag>
          <el-tag v-if="offlineDetail.status === 4" type="danger">审核未通过</el-tag>
        </div>
        <div class="msg-item">
          <div class="tit">下线原因：</div>
          <div class="int">{{ offlineDetail.offlineReason }}</div>
        </div>
        <div v-if="offlineDetail.status === 2" class="msg-item">
          <div class="tit">处理状态：</div>
          <div class="int">
            <el-radio-group v-model="examineStatus">
              <el-radio :label="3">审核通过</el-radio>
              <el-radio :label="4">审核不通过</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="offlineDetail.status === 2 && examineStatus===4" class="msg-item">
          <div class="tit">拒绝原因：</div>
          <div class="int">
            <el-input v-model="refuseReason" maxlength="200" type="textarea" size="small" :rows="2" placeholder="审核不通过的原因，200字以内" />
          </div>
        </div>
      </div>
      <div v-if="offlineDetail.offlineHandleEventItemList.length > 0" class="log">
        <div class="log-tit">申请历史</div>
        <div v-for="(item,index) in offlineDetail.offlineHandleEventItemList" :key="index" class="log-item">
          <p>
            <span class="tit">申请时间：</span>
            <span class="txt">{{ item.reapplyTime }}</span>
          </p>
          <p>
            <span class="tit">申请理由：</span>
            <span class="txt">{{ item.reapplyReason }}</span>
          </p>
          <p v-if="item.auditTime">审核时间：{{ item.auditTime }}</p>
          <p v-if="item.refuseReason" class="ints">拒绝原因：{{ item.refuseReason }}</p>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="default-btn" @click="operateDialogVisible = false">取消</div>
      <div v-if="offlineDetail.status === 2" class="default-btn primary-btn" @click="offlineDataSubmit()">确认审核</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      operateDialogVisible: false, // 操作对话框
      showOfflineManage: false, // 下架管理
      offlineDetail: {}, // 最新下线
      offlineReasonError: false, // 理由出错
      refuseReason: '', // 拒绝理由
      examineStatus: 3, // 审核
      showApplicationHistory: false // 申请历史显隐
    }
  },

  methods: {
    init (data) {
      this.operateDialogVisible = true
      this.showOfflineManage = true
      this.showOfflineOperate = false
      this.offlineDetail = data
    },

    // 审核商家上架申请
    offlineDataSubmit () {
      if (this.examineStatus === 4 && !this.refuseReason) {
        this.$message({
          message: '请填写拒绝理由',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (this.isSubmit) {
        return
      }
      const data = {
        handleId: this.offlineDetail.shopId,
        eventId: this.offlineDetail.eventId,
        status: this.examineStatus, // 审核状态
        refuseReason: this.refuseReason // 拒绝理由
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl(`/platform/shopDetail/auditShop`),
        method: 'POST',
        data: data
      }).then(({ data }) => {
        this.$message({
          message: '提交成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            // this.offlineDialogVisible = false
            this.onClose()
            this.$emit('refreshDataList')
          }
        })
        this.isSubmit = false
      }).catch(e => {
        this.isSubmit = false
      })
    },

    // 当关闭时
    onClose () {
      this.operateDialogVisible = false // 操作对话框
      this.showOfflineManage = false // 下架管理
      this.couponName = '' // 名称
      this.offlineDetail = {} // 最新下线
      this.offlineReasonError = false // 理由出错
      this.refuseReason = '' // 拒绝理由
      this.examineStatus = 3 // 审核
      this.showApplicationHistory = false // 申请历史显隐
    }
  }
}
</script>

<style lang="scss" scoped>
// 下架管理-操作弹窗
.operate-dlg.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.operate-dlg {
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
    .offline {
      margin-bottom: 10px;
      .confirm-tips {
        margin-bottom: 20px;
        line-height: 1.5em;
      }
      .error {
        margin-top: 10px;
        color: #e43130;
      }
      .foot {
        display: block;
        width: 100%;
        text-align: right;
        margin-top: 30px;
      }
    }
    .off-shelf-mag {
      .msg {
        padding: 10px 0;
        margin-bottom: 10px;
        .msg-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          .tit {
            width: 90px;
            min-width: 90px;
            padding-right: 10px;
            text-align: right;
          }
          .int {
            width: 380px;
            word-break: break-word;
          }
        }
        .msg-item:not(:last-child) {
          margin-bottom: 20px;
        }
      }
      .log {
        border-top: 1px solid #eee;
        padding: 10px 0;
        p {
          margin: 0;
          padding: 0;
          line-height: 1.5em;
        }
        .log-tit {
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 15px;
          .tit {
            min-width: 70px;
          }
        }
        .log-item {
          p {
            word-break: break-word;
          }
        }
        .log-item:not(:last-child) {
          padding-bottom: 10px;
          border-bottom: 1px dashed #eee;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.ints {
  width:380px;
  word-break: break-word;
}
</style>
