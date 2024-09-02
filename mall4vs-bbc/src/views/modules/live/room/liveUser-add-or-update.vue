<template>
  <el-dialog
    :title="
      !dataForm.liveUserId
        ? this.$i18n.t('crud.addTitle')
        : this.$i18n.t('temp.modify')
    "
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="auto"
    >
      <!-- <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="dataForm.anchorName"
          maxlength="15"
          show-word-limit
        ></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('shop.weChatNumber')" prop="anchorWechat">
        <el-input
          size="small"
          v-model="dataForm.anchorWechat"
          :disabled="dataForm.liveUserId !== 0"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('live.selectRole')" prop="roleList">
        <el-radio disabled v-model="roleList" :label="2">{{
          $t("live.anchor")
        }}</el-radio>
        <!-- <el-radio v-model="roleList" :label="3">{{
          $t("liveRoom.liveOperators")
        }}</el-radio> -->
        <!-- <el-checkbox-group v-model="roleList"> -->
        <!-- <el-checkbox :label="1">{{ $t("liveRoom.liveUser") }}</el-checkbox>
          <el-checkbox :label="3">{{
            $t("liveRoom.liveOperators")
          }}</el-checkbox> -->
        <!-- </el-checkbox-group> -->
      </el-form-item>
      <el-form-item v-if="isRealName">
        <img
          :src="codeImg"
          width="300"
          height="300"
          class="el-upload-list__item-thumbnail"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" v-if="!dataForm.id" @click="dataFormSubmit()">{{
        $t("crud.filter.submitBtn")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      isSubmit: false,
      dataForm: {
        liveUserId: null,
        nickName: null,
        liveOperators: null,
        anchorWechat: null,
        roleList: []
      },
      roleList: 2,
      codeImg: '',
      isRealName: false,
      dataRule: {
        anchorWechat: [
          { required: true, message: this.$i18n.t('live.anchorWechatNotNull'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (liveUserId) {
      this.codeImg = ''
      this.isRealName = false
      this.dataForm.liveUserId = liveUserId || 0
      this.dataForm.roleList = []
      this.roleList = 2
      this.isSubmit = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.liveUserId) {
          this.$http({
            url: this.$http.adornUrl('/multishop/live/liveUser/info/' + this.dataForm.liveUserId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.roleList = this.dataForm.roleList
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (!this.roleList || this.roleList.length <= 0) {
          //   this.$message({
          //     message: this.$i18n.t('liveRoom.selRoleCheck'),
          //     type: 'error',
          //     duration: 1500
          //   })
          //   return
          // }
          if (this.isSubmit) {
            return
          }
          this.isSubmit = true
          this.dataForm.roleList.push(this.roleList)
          this.$http({
            url: this.$http.adornUrl('/multishop/live/liveUser'),
            method: this.dataForm.liveUserId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data && data.isRealName === 0) {
              this.$message({
                message: this.$i18n.t('live.noRealName'),
                type: 'warning',
                duration: 1500
              })
              this.isSubmit = false
              this.isRealName = true
              this.codeImg = data.img
              return
            }
            this.isSubmit = true
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            console.log('boom')
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
