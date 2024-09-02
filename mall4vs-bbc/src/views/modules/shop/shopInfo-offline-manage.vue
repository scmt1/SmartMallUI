<template>
  <el-dialog
    :close-on-click-modal="false"
    title="申请上线"
    :lock-scroll="true"
    :append-to-body="true"
    :destroy-on-close="true"
    :visible.sync="operateDialogVisible"
    class="operate-dlg"
  >
    <div class="off-shelf-mag">
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
        <div class="msg-item" v-if="offlineDetail.status === 1 || offlineDetail.status === 4">
          <div class="tit">申请理由：</div>
          <div class="int"><el-input maxlength="200" v-model="reapplyReason" type="textarea" placeholder="请输入200字以内的申请理由" size="small"/></div>
        </div>
      </div>
      <div v-if="offlineDetail.offlineHandleEventItemList && offlineDetail.offlineHandleEventItemList.length && offlineDetail.offlineHandleEventItemList[0].reapplyReason" class="log">
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
          <p v-if="item.refuseReason">拒绝原因：{{ item.refuseReason }}</p>
        </div>
      </div>
    </div>
    <span slot="footer">
      <div class="default-btn" @click="operateDialogVisible = false">取消</div>
      <div v-if="offlineDetail.status === 1 || offlineDetail.status === 4" class="default-btn primary-btn" @click="rereapplyDataSubmit()">提交申请</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      operateDialogVisible: false, // 操作对话框
      offlineDetail: {}, // 最新下线商品
      offlineReasonError: false, // 理由出错
      reapplyReason: '' // 申请理由
    }
  },

  methods: {
    init (data) {
      this.operateDialogVisible = true
      this.offlineDetail = data
    },

    /**
     * 提交上架申请
     */
    rereapplyDataSubmit () {
      if (!this.reapplyReason) {
        this.$message({
          message: '请填写申请理由',
          type: 'warning',
          duration: 1000
        })
        return
      }
      let data = {
        eventId: this.offlineDetail.eventId,
        reapplyReason: this.reapplyReason
      }
      this.$emit('rereapplyDataSubmit', data)
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
  & ::v-deep .el-dialog__body {
    padding: 10px 20px;
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
            // width: 380px;
            width: 100%;
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
</style>
