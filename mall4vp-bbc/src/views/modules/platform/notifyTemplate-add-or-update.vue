<template>
  <el-dialog
    :title="!dataForm.templateId ? $t('brand.add') : $t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      size="small"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '220px' : '130px'"
    >
      <!--      <el-alert-->
      <!--        :closable="false"-->
      <!--        :title="$t('platform.smsTip1')"-->
      <!--        type="warning"-->
      <!--        show-icon-->
      <!--      ></el-alert>-->
      <el-form-item :label="$t('platform.sendType')" prop="sendType">
        <el-select
          v-model="type"
          :placeholder="$t('platform.sendType')"
          @change="changeSendType"
        >
          <el-option :label="$t('platform.buyer')" :value="1" />
          <el-option :label="$t('platform.seller')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('platform.msgType') + '：'" prop="sendType">
        <!-- <el-input v-model="dataForm.sendType"></el-input> -->
        <el-select v-model="dataForm.sendType" :placeholder="$t('tip.select')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <span v-if="type === 1 || type === 3">{{
            $t('platform.sendByUser')
          }}
        </span>
        <span type="success" v-else>{{ $t('platform.sendMer') }}</span> -->
      </el-form-item>
      <el-form-item :label="$t('platform.msgNotifyConten') + '：'" prop="message">
        <el-input v-model="dataForm.message"></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.notifyType') + '：'" prop="templateTypeList">
        <el-checkbox-group v-model="dataForm.templateTypeList" @change="checkboxChange">
          <el-checkbox :label="1">{{
              $t('platform.msgNotifyFree')
            }}
          </el-checkbox>
          <el-checkbox :label="2" v-if="type === 1">{{
              $t('platform.publicNotify')
            }}
          </el-checkbox>
          <el-checkbox :label="3">{{
              $t('platform.appletMessage')
            }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :label="$t('platform.smsTemplateCode') + '：'"
        prop="templateCode"
        v-if="boxcheckedOne === 1"
      >
        <el-input v-model="dataForm.templateCode"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('platform.publicTemplateCode') + '：'"
        prop="mpCode"
        v-if="type === 1 && boxcheckedTwo === 1"
      >
        <el-input v-model="dataForm.mpCode"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
          $t('remindPop.cancel')
        }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
          $t('remindPop.confirm')
        }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      isCheck: false,
      isConfirm: false,
      type: 1, // 1:用户消息  2：商家消息
      boxcheckedOne: 0, // 1:显示短信  0:不显示
      boxcheckedTwo: 0, // 1:显示公众号 0:不显示
      templateTypeList: [],
      dataForm: {
        templateId: null,
        sendType: null,
        templateTypeList: [],
        message: null,
        templateCode: null,
        mpCode: null,
        createTime: null,
        templateTypes: ''
      },
      dataRule: {
        sendType: [
          {required: true, message: this.$i18n.t('platform.seleMsgType'), trigger: 'blur'}
        ],
        message: [
          {required: true, message: this.$i18n.t('platform.notifyContenNoNull'), trigger: 'blur'}
        ]
        // templateTypeList: [
        //   {required: true, message: this.$i18n.t('platform.seleNotifyType'), trigger: 'blur'}
        // ]
        // templateCode: [
        //   { required: true, message: '短信模板code不能为空', trigger: 'blur' }
        // ],
        // mpCode: [
        //   { required: true, message: '短信模板code不能为空', trigger: 'blur' }
        // ]
      },
      options: [],
      // 用户选项
      userOptions: [{
        value: 0,
        label: this.$i18n.t('platform.customisedMsg')
      }, {
        value: 1,
        label: this.$i18n.t('platform.orderPay')
      }, {
        value: 2,
        label: this.$i18n.t('platform.paySuccNotify')
      }, {
        value: 3,
        label: this.$i18n.t('platform.merAgreeReturn')
      }, {
        value: 4,
        label: this.$i18n.t('order.refusedRefund')
      }, {
        value: 5,
        label: this.$i18n.t('platform.wriOffRem')
      }, {
        value: 6,
        label: this.$i18n.t('platform.shipRem')
      }, {
        value: 7,
        label: this.$i18n.t('platform.groupFailRem')
      }, {
        value: 8,
        label: this.$i18n.t('platform.groupSuccRem')
      }, {
        value: 9,
        label: this.$i18n.t('platform.startGroupRem')
      }, {
        value: 10,
        label: this.$i18n.t('platform.memUpRem')
      }, {
        value: 11,
        label: this.$i18n.t('platform.timeoutRem')
      }, {
        value: 12,
        label: this.$i18n.t('platform.register')
      }, {
        value: 13,
        label: this.$i18n.t('platform.login')
      }, {
        value: 14,
        label: this.$i18n.t('platform.updatePassword')
      }, {
        value: 15,
        label: this.$i18n.t('platform.vaild')
      }, {
        value: 16,
        label: this.$i18n.t('platform.orderBalanceRefundSuccess')
      }, {
          value: 17,
          label: "提货卡到期提醒"
      }, {
          value: 18,
          label: "购买优惠券到期提醒"
      },
          {
              value: 99,
              label: '自定义短信'
          }],
      // 商家选项
      merchantOptions: [{
        value: 102,
        label: this.$i18n.t('platform.confirmReceRem')
      }, {
        value: 103,
        label: this.$i18n.t('platform.buyerRefundRem')
      }, {
        value: 104,
        label: this.$i18n.t('platform.buyerReturnRem')
      }, {
        value: 105,
        label: this.$i18n.t('platform.buyerPaySuccessRem')
      }, {
        value: 106,
        label: this.$i18n.t('platform.productRemovalReminder')
      }, {
        value: 107,
        label: this.$i18n.t('platform.commodityAuditResultReminder')
      }, {
        value: 108,
        label: this.$i18n.t('platform.ReminderPurchased')
      }, {
        value: 109,
        label: this.$i18n.t('platform.reminderToNeReceived')
      }, {
        value: 110,
        label: this.$i18n.t('platform.ReminderMarketingActivityOffShelf')
      }, {
        value: 111,
        label: this.$i18n.t('platform.ActivityAuditResultReminder')
      }]
    }
  },
  methods: {
    init (templateId) {
      this.isConfirm = false
      this.isCheck = false
      this.dataForm.templateTypeList = []
      this.dataForm.templateId = templateId || 0
      this.visible = true
      this.type = 1
      this.boxcheckedOne = null
      this.boxcheckedTwo = null
      this.dataForm.templateCode = ''
      this.dataForm.mpCode = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.templateId) {
          this.$http({
            url: this.$http.adornUrl('/platform/notifyTemplate/info/' + this.dataForm.templateId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = data
            // this.updateType()
            this.updateOptions()
            this.type = data.msgType
            this.checkboxChange()
            this.dataForm.templateTypeList = data.templateTypeList
          })
        }else{
          this.updateOptions()
        }
      })
    },
    msg (text) {
      this.$message({
        message: text,
        type: 'error',
        duration: 1500
      })
      this.isCheck = true
    },
    checkboxChange (val) {
      if (val) this.dataForm.templateTypes = val.join(',')
      this.boxcheckedOne = 0
      this.boxcheckedTwo = 0
      this.dataForm.templateTypeList.forEach(item => {
        if (item === 1) {
          this.boxcheckedOne = 1
        } else if (item === 2) {
          this.boxcheckedTwo = 1
        }
      })
    },
    /**
     * 根据消息的推送对象，更改数据
     */
    changeSendType () {
      this.dataForm.templateTypeList = []
      this.boxcheckedOne = 0
      this.boxcheckedTwo = 0
      this.dataForm.templateCode = ''
      this.dataForm.mpCode = ''
      this.dataForm.sendType = ''
      // this.updateType()
      this.updateOptions()
    },
    updateOptions () {
      if (this.type === 1) {
        this.options = this.userOptions
      }
      if (this.type === 2) {
        this.options = this.merchantOptions
      }
      if (this.type === 3) {
        this.options = this.supplierOptions
      }
    },
    updateType () {
      let sendType = this.dataForm.sendType
      this.options.forEach(item => {
        if (sendType === item.value) {
          this.type = sendType > 100 ? 2 : 1
          if (sendType === 12 || sendType === 13 || sendType === 14 || sendType === 15) {
            this.type = 3
          }
          if (this.type === 2 || this.type === 3) {
            this.dataForm.templateTypeList.forEach(temp => {
              if (temp === 1) {
                this.dataForm.templateTypeList = [1]
              }
            })
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isCheck = false
          // if (this.dataForm.templateTypeList === undefined || this.dataForm.templateTypeList.length <= 0) {
          //   this.msg(this.$i18n.t('platform.errorTip1'))
          // }
          this.dataForm.templateTypeList.forEach(type => {
            if (type === 1 && this.dataForm.templateCode == null) {
              this.msg(this.$i18n.t('platform.notifyTempNoNull'))
            }
            if (type === 2 && this.dataForm.mpCode == null) {
              this.msg(this.$i18n.t('platform.errorTip2'))
            }
          })
          if (this.isCheck || this.isConfirm) {
            return
          }
          this.isConfirm = true
          this.$http({
            url: this.$http.adornUrl('/platform/notifyTemplate'),
            method: this.dataForm.templateId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            console.log('boom')
            this.isConfirm = false
          })
        }
      })
    }
  }
}
</script>
