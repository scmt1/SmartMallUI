<template>
  <el-dialog
    :title="!dataForm.id ? $t('brand.add') : $t('user.editBtn')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    top="5vh"
    width="780px"
  >
    <el-form
      class="dialog-form"
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '150px' : '80px'"
    >
      <el-form-item :label="$t('shop.announcementTitle')" prop="title">
        <el-input size="small" maxlength="36" v-model="dataForm.title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.noticeContent')" prop="type">
        <el-radio-group v-model="dataForm.immediatelySend">
          <el-radio :label="1">{{ $t('publics.sendNow') }}</el-radio>
          <el-radio :label="0">{{ $t('publics.scheduledTransmission') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('platform.sendTime')" prop="type" v-show="dataForm.immediatelySend === 0">
        <el-date-picker
          size="small"
          v-model="dataForm.sendTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('platform.selectSendingTime')"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item :label="$t('shop.announcementType')" prop="type">
        <el-checkbox-group v-model="dataForm.types">
          <el-checkbox :label="1">{{ $t('publics.business') }}</el-checkbox>
          <el-checkbox :label="2">{{ $t('publics.user') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('shop.businessScope')" prop="type" v-show="dataForm.types.includes(1)">
        <el-radio-group v-model="dataForm.shopRange">
          <el-radio :label="1">{{ $t('shop.AllMerchants') }}</el-radio>
          <el-radio :label="2">{{ $t('shop.designatedMerchant') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <select-account-range v-if="dataForm.shopRange == 2 && dataForm.types.includes(1)" :table-list="dataForm.shopDetailList" :type="1" @getIds="(ids) => dataForm.multiShopIds = ids" />
      <el-form-item :label="$t('shop.userScope')" prop="type" v-show="dataForm.types.includes(2)">
        <el-radio-group v-model="dataForm.userRange">
          <el-radio :label="1">{{ $t('shop.allUsers') }}</el-radio>
          <el-radio :label="2">{{ $t('shop.specifyUser') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <select-account-range v-if="dataForm.userRange == 2 && dataForm.types.includes(2)" :type="2" :table-list="dataForm.userDetailList" @getIds="(ids) => dataForm.userIds = ids" />

      <!-- <el-form-item :label="$t('sysManagement.type')" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">{{ $t("shop.showOnPlatform") }}</el-radio>
          <el-radio :label="2">{{ $t("shop.showOnTheUserSide") }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item :label="$t('publics.status')" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{ $t("publics.publicar") }}</el-radio>
          <el-radio :label="0">{{ $t("publics.cancel") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('publics.isTop')" prop="isTop">
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="1">{{ $t("publics.yes") }}</el-radio>
          <el-radio :label="0">{{ $t("publics.no") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('shop.noticeContent')" prop="content" class="notice-content">
        <tiny-mce ref="tinyMce" v-model="dataForm.content" v-if="visible" :tinymceHeight="250"></tiny-mce>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
        $t("remindPop.cancel")
      }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
        $t("remindPop.confirm")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
import {isHtmlNull} from '@/utils/index.js'
import SelectAccountRange from '@/components/SelectAccountRange'
export default {
  data () {
    var validateTitle = (rule, value, callback) => {
      if (String(value).trim() === '') {
        callback(new Error(this.$i18n.t('shop.titCanNoBlank')))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        // 设置禁用状态，参数为当前日期
        disabledDate (time) {
          // return time.getTime() < Date.now(); //当天不可选
          return time.getTime() < new Date().getTime() - 86400000 //  - 86400000是否包括当天
        },
        // 控制时分秒不可选
        selectableRange: (() => {
          const data = new Date()
          const hour = data.getHours()
          const minute = data.getMinutes()
          const second = data.getSeconds()
          return [`${hour}:${minute}:${second} - 23:59:59`]
        })()
      },
      visible: false,
      dataForm: {
        title: null,
        content: null,
        url: null,
        status: 1,
        type: 1,
        isTop: 0,
        sendTime: '', // 发送时间
        types: [],
        immediatelySend: 1,
        shopRange: 1,
        userRange: 1,
        multiShopIds: [],
        userIds: []
      },
      isSubmit: false,
      dataRule: {
        title: [
          { required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur' },
          {validator: validateTitle, trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    TinyMce,
    SelectAccountRange
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isSubmit = false
      this.dataForm.sendTime = ''
      this.dataForm.types = []
      this.dataForm.immediatelySend = 1
      this.dataForm.shopRange = 1
      this.dataForm.userRange = 1
      this.dataForm.multiShopIds = []
      this.dataForm.userIds = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/platform/notice/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.$set(this.dataForm, 'types', this.dataForm.types.split(',').map(Number))
            this.$set(this.dataForm, 'shopRange', 1)
            this.$set(this.dataForm, 'userRange', 1)
            if (!this.dataForm.shopDetailList) {
              this.$set(this.dataForm, 'shopDetailList', [])
              this.$set(this.dataForm, 'multiShopIds', [])
            } else {
              this.$set(this.dataForm, 'multiShopIds', this.dataForm.shopDetailList.map(item => item.shopId))
            }
            if (!this.dataForm.userDetailList) {
              this.$set(this.dataForm, 'userDetailList', [])
              this.$set(this.dataForm, 'userIds', [])
            } else {
              this.$set(this.dataForm, 'userIds', this.dataForm.userDetailList.map(item => item.userId))
            }
            this.dataForm.types.forEach(type => {
              if (type === 1 && this.dataForm.shopDetailList.length > 0) {
                this.$set(this.dataForm, 'shopRange', 2)
              }
              if (type === 2 && this.dataForm.userDetailList.length > 0) {
                this.$set(this.dataForm, 'userRange', 2)
              }
            })
            this.$nextTick(() => this.$refs.tinyMce.setContent(this.dataForm.content))
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          if (isHtmlNull(this.dataForm.content)) {
            this.$message.error(this.$i18n.t('shopProcess.noticeTip'))
            return
          }
          if (this.dataForm.types.length === 0) {
            this.$message({
              message: this.$t('publics.notifyTips'),
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.dataForm.immediatelySend === 0 && !this.dataForm.sendTime) {
            this.$message({
              message: `${this.$t('tip.select')} ${this.$t('platform.sendTime')}`,
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.dataForm.shopRange === 2 && !this.dataForm.multiShopIds.length) {
            this.$message({
              message: `${this.$t('tip.select')} ${this.$t('shop.designatedMerchant')}`,
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.dataForm.userRange === 2 && !this.dataForm.userIds.length) {
            this.$message({
              message: `${this.$t('tip.select')} ${this.$t('shop.specifyUser')}`,
              type: 'error',
              duration: 1500
            })
            return
          }
          if (this.dataForm.shopRange === 1) {
            this.dataForm.multiShopIds = []
          }
          if (this.dataForm.userRange === 1) {
            this.dataForm.userIds = []
          }
          const obj = JSON.parse(JSON.stringify(this.dataForm))
          obj.types = obj.types.length > 0 ? obj.types.join(',') : null
          obj.multiShopIds = obj.multiShopIds.length > 0 ? obj.multiShopIds.join(',') : null
          obj.userIds = obj.userIds.length > 0 ? obj.userIds.join(',') : null
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/platform/notice'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(obj)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
                this.dataForm.content = ''
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

<style lang="scss" scoped>
.dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 4px;
  }
}
</style>

<style lang="scss" scoped>
.dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 4px;
  }
}
.question-icon {
  position: relative;
  right: 30px;
  // top: -13px;
  display: inline-block;
  width: 14px;
  height: 14px;
  line-height: 14px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background: #C8C9CC;
  border-radius: 50%;
  margin-left: 5px;
  cursor: default;
}.notice-content {
  ::v-deep .el-form-item__label:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
}
</style>
