<template>
  <el-dialog :title="!dataForm.logId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="日志id"
                    prop="logId">
        <el-input v-model="dataForm.logId"></el-input>
      </el-form-item>
      <el-form-item label="用户id"
                    prop="userId">
        <el-input v-model="dataForm.userId"></el-input>
      </el-form-item>
      <el-form-item label="来源 1订单"
                    prop="source">
        <el-input v-model="dataForm.source"></el-input>
      </el-form-item>
      <el-form-item label="业务id"
                    prop="bizId">
        <el-input v-model="dataForm.bizId"></el-input>
      </el-form-item>
      <el-form-item label="出入类型 0=支出 1=收入"
                    prop="ioType">
        <el-input v-model="dataForm.ioType"></el-input>
      </el-form-item>
      <el-form-item label="创建时间"
                    prop="createTime">
        <el-input v-model="dataForm.createTime"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <div class="default-btn" @click="visible = false">取消</div>
      <el-button class="primary-btn default-btn"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        logId: null,
        userId: null,
        source: null,
        bizId: null,
        ioType: null,
        createTime: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (logId) {
      this.dataForm.logId = logId || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.logId) {
          this.$http({
            url: this.$http.adornUrl('/user/userScoreLog/info/' + this.dataForm.logId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/user/userScoreLog'),
            method: this.dataForm.logId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
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
        }
      })
    }
  }
}
</script>
