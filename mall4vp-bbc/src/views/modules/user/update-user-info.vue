<template>
  <div>
    <el-dialog
      :title="$t('coupon.edit')"
      :visible.sync="visible"
      width="36%"
      :close-on-click-modal="false"
      class="el-upload-list el-upload-list--picture-card"
    >
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="demo-form-inline form">
        <el-form-item :label="$t('users.name') + ':'" prop="nickName">
          <el-input
            v-model="dataForm.nickName"
            maxlength="35"
            :disabled="false"
            size="small"
            :placeholder="$t('users.name')"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('publics.status')+ ':'" size="mini" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
            <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.status === 0" :label="$t('publics.disableRemark')+ ':'" size="mini" prop="disableRemark">
          <el-input v-model="dataForm.disableRemark" maxlength="100" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="confirm">{{$t('remindPop.confirm')}}</div>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data () {
    return {
      visible: false,
      confirmLoad: false,
      dataForm: {},
      dataRule: {
        disableRemark: [
          { required: true, message: this.$i18n.t('home.disableRemarkNoNull'), trigger: 'blur' }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      searchForm: {
      }
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    init (data) {
      this.visible = true
      this.dataForm = {
        userId: data.userId,
        nickName: data.nickName,
        status: data.status,
        disableRemark: data.status === 0 ? data.disableRemark : ''
      }
    },
    confirm () {
      if (!this.dataForm.nickName || !this.dataForm.nickName.trim()) {
        return this.$message.error(this.$t('sys.nickNameNoNull'))
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.confirmLoad = true
          this.$http({
            url: this.$http.adornUrl(`/admin/user`),
            method: 'put',
            data: this.$http.adornData({
              userId: this.dataForm.userId,
              nickName: this.dataForm.nickName,
              status: this.dataForm.status,
              disableRemark: this.dataForm.status === 0 ? this.dataForm.disableRemark : ''
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.confirmLoad = false
                this.$emit('refreshUserInfo', this.page)
              }
            })
          })
        }
      })
    }
  }
}
</script>
