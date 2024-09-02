<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      :title="$t('distributionMsg.statusModification')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="620px"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px"
      >
        <el-form-item :label="$t('product.status')" size="mini" prop="state">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
            <el-radio :label="2">{{$t('distribUserWallet.ban')}}</el-radio>
            <el-radio :label="-1">{{$t('distribUserWallet.perBan')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('home.reasons')" prop="banReason" v-if="dataForm.state != 0 && dataForm.state != 1">
          <el-select v-model="dataForm.banReason" size="small">
            <el-option :label="$t('distribUserWallet.lostContact')" :value="0"></el-option>
            <el-option :label="$t('distribUserWallet.maliciousSwipe')" :value="1"></el-option>
            <el-option :label="$t('prodList.other')" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('publics.remark')" prop="remarks">
          <el-input type="textarea" size="small" rows="5" :placeholder="$t('publics.remark')" v-model="dataForm.remarks" maxlength="250" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="openCheck()">{{$t('remindPop.confirm')}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        distributionUserId: null,
        state: 0,
        banReason: 0,
        remarks: ''
      },
      addProdVisible: false,
      visible: false,
      dataRule: {
        state: [
          { required: true, message: this.$i18n.t('distributionMsg.statusTip1'), trigger: 'change' }
        ],
        banReason: [
          { required: true, message: this.$i18n.t('distributionMsg.tip3'), trigger: 'blur' }
        ],
        remarks: [
          { max: 255, message: this.$i18n.t('recruit.limitLangTip2'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  methods: {
    init (data) {
      this.visible = true
      this.dataForm = Object.assign(this.dataForm, data)
    },
    // 表单提交
    dataFormSubmit (row, index, done, loading) {
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionUser/state`),
        method: 'put',
        data: this.$http.adornData({
          distributionUserId: this.dataForm.distributionUserId,
          state: this.dataForm.state,
          banReason: this.dataForm.state !== 1 ? this.dataForm.banReason : '',
          remarks: this.dataForm.remarks
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      })
    },
    openCheck () {
      // dataFormSubmit
      // if (action === 'confirm') {
      //   this.dataFormSubmit()
      // }
      if (this.dataForm.state === -1) {
        this.$confirm(this.$i18n.t('distribution.banTip1'), this.$i18n.t('remindPop.remind'), {
          confirmButtonText: this.$i18n.t('remindPop.confirm'),
          cancelButtonText: this.$i18n.t('remindPop.cancel'),
          type: 'warning'
        }).then(() => {
          this.dataFormSubmit()
        }).catch(() => {

        })
      } else if (this.dataForm.state === 2) {
        this.$confirm(this.$i18n.t('distribution.banTip2'), this.$i18n.t('remindPop.remind'), {
          confirmButtonText: this.$i18n.t('remindPop.confirm'),
          cancelButtonText: this.$i18n.t('remindPop.cancel'),
          type: 'warning'
        }).then(() => {
          this.dataFormSubmit()
        }).catch(() => {

        })
      } else if (this.dataForm.state === 1) {
        this.dataFormSubmit()
      }
    }
  }

}
</script>
