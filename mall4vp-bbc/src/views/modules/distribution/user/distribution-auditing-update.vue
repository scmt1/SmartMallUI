<template>
  <div class="mod-auditing-add-or-update">
    <el-dialog
      :title="$t('distributionMsg.distributorAudit')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="540px"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="auto"
      >
        <el-form-item :label="$t('productComm.audit')" size="mini" prop="state">
          <el-radio-group v-model="dataForm.state" :disabled="!isEdit">
            <el-radio :label="1">{{$t('productComm.pass')}}</el-radio>
            <el-radio :label="-1">{{$t('distributionMsg.noPass')}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="dataForm.state === -1" :label="$t('home.reasons')" prop="reason">
          <el-select v-model="dataForm.reason" size="small" :disabled="!isEdit" :readonly="!isEdit">
            <el-option :label="$t('distributionMsg.insufficientInfo')" :value="0"></el-option>
            <el-option :label="$t('distributionMsg.illConditioned')" :value="1"></el-option>
            <el-option :label="$t('distributionMsg.noRecruitment')" :value="2"></el-option>
            <el-option :label="$t('prodList.other')" :value="-1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('publics.remark')" prop="remarks">
          <el-input
            type="textarea"
            :placeholder="$t('publics.remark')"
            v-model="dataForm.remarks"
            size="small"
            :readonly="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('distribUserWallet.operator')" v-if="!isEdit" prop="sysUsername">
          <div v-if="dataForm.modifier === 0">{{$t('distribUserWallet.system')}}</div>
          <el-input v-else v-model="dataForm.sysUsername" size="small" :readonly="!isEdit"></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('distribUserWallet.operatorTime')"
          v-if="!isEdit"
          prop="updateTime"
        >
          <el-input v-model="dataForm.updateTime" size="small" :readonly="!isEdit"></el-input>
        </el-form-item>

        <el-form-item :label="$t('distributionMsg.viewUserAppalyInfo')">
          <div class="default-btn" @click="info(dataForm)">{{$t('distributionMsg.clickView')}}</div>
          <!-- <el-button @click="info(dataForm)">{{$t('distributionMsg.clickView')}}</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer" v-if="isEdit" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
      </span>
      <span v-if="!isEdit" slot="footer" class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{$t('seckill.close')}}</div>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <Info v-if="infoVisible" ref="info"></Info>
  </div>
</template>

<script>
import Info from './distribution-user-info'
export default {
  data () {
    return {
      isEdit: true,
      dataForm: {
        'auditingId': null,
        'state': null,
        'reason': null,
        'remarks': null,
        'msg': null
      },
      addProdVisible: false,
      infoVisible: false,
      isSubmit: false,
      visible: false,
      dataRule: {
        state: [
          { required: true, message: this.$i18n.t('distributionMsg.tip2'), trigger: 'change' }
        ],
        reason: [
          { required: true, message: this.$i18n.t('distributionMsg.tip3'), trigger: 'blur' }
        ],
        remarks: [
          { max: 255, message: this.$i18n.t('recruit.limitLangTip2'), trigger: 'blur' }
        ],
        msg: [
          { max: 1000, message: this.$i18n.t('recruit.limitLangTip2').replace('255', '1000'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Info
  },
  methods: {
    init (data, isEdit) {
      this.isEdit = isEdit
      this.isSubmit = false
      if (isEdit) {
        data.remarks = ''
      }
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      // })
      this.dataForm = JSON.parse(JSON.stringify(data))
      if (this.dataForm.state === 0) {
        // 如果为审核窗口则把审核状态置为null,用以rules校验
        this.dataForm.state = null
      }
      this.visible = true
    },
    // 新增 / 修改
    info (data) {
      this.infoVisible = true
      this.$nextTick(() => {
        this.$refs.info.init(data)
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionAuditing`),
            method: 'put',
            data: this.$http.adornData(
              param
              , false)
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
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
