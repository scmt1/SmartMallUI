<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">{{$t('user.pointsExpirationSetting')}}</div>
    <el-form
      ref="dataForm"
      label-width="120px"
      size="mini"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item
        :label="$t('user.expirationSwitch')"
        style="width:440px"
        prop="scoreExpireSwitch"
      >
        <el-switch v-model="dataForm.scoreExpireSwitch"></el-switch>
      </el-form-item>
      <el-form-item
        :label="$t('user.expiration')"
        prop="expireYear"
        v-if="dataForm.scoreExpireSwitch"
      >
        <!-- <tiny-mce v-model="dataForm.expire"
        style="width:900px"></tiny-mce>-->
        <el-input-number autosize v-model="dataForm.expireYear" width="330" :min="1" :max="100000000" @change="expireYearChange"></el-input-number>
        <span>{{$t('user.year')}}</span>
        <br />
        <span style="color:gray;">{{$t('user.expirationDes')}}</span>
        <span style="color:gray;">{{$t('user.expirationDes1')}}</span>
      </el-form-item>
    </el-form>
    <div class="default-btn" @click="dataFormSubmit()">{{$t('sysManagement.save')}}</div>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'

export default {
  components: {
    TinyMce
  },
  created () {
    this.getData()
  },
  methods: {
    expireYearChange (e) {
      if (String(e).length > 8) this.dataForm.expireYear = 1
    },
    // 获取数据
    getData () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreExpire/info/' + 'SCORE_EXPIRE'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data != null && data !== '') {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/scoreExpire/`),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'SCORE_EXPIRE',
              'expireYear': this.dataForm.expireYear,
              'scoreExpireSwitch': this.dataForm.scoreExpireSwitch,
              'remark': this.$i18n.t('user.expirationConfiguration')
            })
          }).then(({ data }) => {
            this.getData()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataForm: {
        expireYear: 1,
        scoreExpireSwitch: false
      },
      dataRule: {
        expireYear: [
          { required: true, message: this.$i18n.t('publics.enterExpiration'), trigger: 'brue' }
        ]
      }
    }
  }
}
</script>
<style lang="scss">
.distribution-withdraw-cash-set {
  .input-tips {
    font-size: 12px;
  }
}
</style>
