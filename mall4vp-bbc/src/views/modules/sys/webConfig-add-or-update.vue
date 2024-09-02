<template>
  <!-- <el-dialog
    :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')"
    :close-on-click-modal="false"
    top="10vh"
    :visible.sync="visible"
    class="el-dialog-body"
    > -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="142px">
      <!--后台相关配置-->
      <span v-if="paramKey=='PLATFROM_WEBSITE_CONFIG' || paramKey=='MULTISHOP_WEBSITE_CONFIG' || paramKey=='CASHIER_WEBSITE_CONFIG'">

        <el-form-item :label="this.$i18n.t('webInfoConfig.loginLogo')" prop="bsLoginLogoImg">
          <imgs-upload v-model="dataForm.bsLoginLogoImg" :limit="1" :size="'380*96'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '380*96' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.loginBg')" prop="bsLoginBgImg">
          <imgs-upload v-model="dataForm.bsLoginBgImg" :limit="1" :size="'1920*940'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '1920*940' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsCopyright')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="bsCopyrightCn">
          <el-input v-model="dataForm.bsCopyrightCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsCopyright')+'-'+this.$i18n.t('webInfoConfig.english')" prop="bsCopyrightEn">
          <el-input v-model="dataForm.bsCopyrightEn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsTitleContent')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="bsTitleContentCn">
          <el-input v-model="dataForm.bsTitleContentCn"  maxlength="15" size="small" show-word-limit></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsTitleContent')+'-'+this.$i18n.t('webInfoConfig.english')" prop="bsTitleContentEn">
          <el-input v-model="dataForm.bsTitleContentEn" maxlength="20" size="small" show-word-limit></el-input>
        </el-form-item>

         <el-form-item :label="this.$i18n.t('webInfoConfig.pcTitleImg')" prop="bsTitleImg">
          <imgs-upload v-model="dataForm.bsTitleImg" :limit="1" :size="'100*100'"  />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.TopIcon')" prop="bsTopBarIcon">
          <imgs-upload v-model="dataForm.bsTopBarIcon" :limit="1" :size="'160*48'"  />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '160*48' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsMenuTitleOpen')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="bsMenuTitleOpenCn">
          <el-input v-model="dataForm.bsMenuTitleOpenCn" maxlength="15" size="small" show-word-limit></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsMenuTitleOpen')+'-'+this.$i18n.t('webInfoConfig.english')" prop="bsMenuTitleOpenEn">
          <el-input v-model="dataForm.bsMenuTitleOpenEn" maxlength="20" size="small" show-word-limit></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsMenuTitleClose')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="bsMenuTitleCloseCn">
          <el-input v-model="dataForm.bsMenuTitleCloseCn" maxlength="6" size="small" show-word-limit></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsMenuTitleClose')+'-'+this.$i18n.t('webInfoConfig.english')" prop="bsMenuTitleCloseEn">
          <el-input v-model="dataForm.bsMenuTitleCloseEn" maxlength="6" size="small" show-word-limit></el-input>
        </el-form-item>
      </span>

      <!--PC端相关配置-->
      <span v-if="paramKey=='PC_WEBSITE_CONFIG'">

        <el-form-item :label="this.$i18n.t('webInfoConfig.logo')" prop="pcLogoImg">
          <imgs-upload v-model="dataForm.pcLogoImg" :limit="1" :size="'100*100'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.loginBg')" prop="pcLoginBgImg">
          <imgs-upload v-model="dataForm.pcLoginBgImg" :limit="1" :size="'1920*600'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '1920*600' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsCopyright')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="pcCopyrightCn">
          <el-input v-model="dataForm.pcCopyrightCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.bsCopyright')+'-'+this.$i18n.t('webInfoConfig.english')" prop="pcCopyrightEn">
          <el-input v-model="dataForm.pcCopyrightEn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcQrcodeImg')" prop="pcQrcodeImg">
          <imgs-upload v-model="dataForm.pcQrcodeImg" :limit="1" :size="'100*100'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcCompanyName')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="pcCompanyNameCn">
          <el-input v-model="dataForm.pcCompanyNameCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcCompanyName')+'-'+this.$i18n.t('webInfoConfig.english')" prop="pcCompanyNameEn">
          <el-input v-model="dataForm.pcCompanyNameEn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcCompanyInfo')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="pcCompanyInfoCn">
          <el-input type="textarea" v-model="dataForm.pcCompanyInfoCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcCompanyInfo')+'-'+this.$i18n.t('webInfoConfig.english')" prop="pcCompanyInfoEn">
          <el-input type="textarea" v-model="dataForm.pcCompanyInfoEn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcTitleContent')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="pcTitleContentCn">
          <el-input v-model="dataForm.pcTitleContentCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcTitleContent')+'-'+this.$i18n.t('webInfoConfig.english')" prop="pcTitleContentEn">
          <el-input v-model="dataForm.pcTitleContentEn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcTitleImg')" prop="pcTitleImg">
          <imgs-upload v-model="dataForm.pcTitleImg" :limit="1" :size="'100*100'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>
<!--        <el-form-item label="公司简写名称-中文" prop="pcCompanyNameShortCn">-->
<!--          <el-input v-model="dataForm.pcCompanyNameShortCn"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="公司简写名称-英文" prop="pcCompanyNameShortEn">-->
<!--          <el-input v-model="dataForm.pcCompanyNameShortEn"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item :label="this.$i18n.t('webInfoConfig.pcLogoImgText')" prop="pcLogoImgText">
          <imgs-upload v-model="dataForm.pcLogoImgText" :limit="1" :size="'380*96'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '380*96' + $t("webInfoConfig.px") }}</div>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcWelcome')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="pcWelcomeCn">
          <el-input v-model="dataForm.pcWelcomeCn" size="small"></el-input>
        </el-form-item>

        <el-form-item :label="this.$i18n.t('webInfoConfig.pcWelcome')+'-'+this.$i18n.t('webInfoConfig.english')" prop="pcWelcomeEn">
          <el-input v-model="dataForm.pcWelcomeEn" size="small"></el-input>
        </el-form-item>
      </span>

      <!--H5端相关配置-->
      <span v-if="paramKey=='H5_WEBSITE_CONFIG'">
        <el-form-item :label="this.$i18n.t('webInfoConfig.loginLogo')" prop="uniLoginLogoImg">
          <imgs-upload v-model="dataForm.uniLoginLogoImg" :limit="1" :size="'100*100'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('webInfoConfig.uniTitleContent')+'-'+this.$i18n.t('webInfoConfig.chinese')" prop="uniTitleContentCn">
          <el-input v-model="dataForm.uniTitleContentCn" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('webInfoConfig.uniTitleContent')+'-'+this.$i18n.t('webInfoConfig.english')" prop="uniTitleContentEn">
          <el-input v-model="dataForm.uniTitleContentEn" size="small"></el-input>
        </el-form-item>
      </span>

      <!--自提点端相关配置-->
      <span v-if="paramKey=='STATION_WEBSITE_CONFIG'">
        <el-form-item :label="this.$i18n.t('webInfoConfig.loginLogo')" prop="stationLoginLogoImg">
          <imgs-upload v-model="dataForm.stationLoginLogoImg" :limit="1" :size="'100*100'" />
          <div class="el-form-item-tips">{{ $t("webInfoConfig.imgsTip") + '100*100' + $t("webInfoConfig.px") }}</div>
        </el-form-item>
      </span>

      <!-- <el-form-item :label="this.$i18n.t('webInfoConfig.activationStatus')" prop="isActivity">
        <el-radio-group v-model="dataForm.isActivity">
          <el-radio :label="0">{{$i18n.t('webInfoConfig.close')}}</el-radio>
          <el-radio :label="1">{{$i18n.t('webInfoConfig.open')}}</el-radio>
        </el-radio-group>
      </el-form-item> -->

       <el-form-item>
        <el-button type="primary" size="small" @click="dataFormSubmit()">{{ $i18n.t('webInfoConfig.save') }}</el-button>
      </el-form-item>
    </el-form>



    <!-- <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$i18n.t('webInfoConfig.cancellation')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$i18n.t('webInfoConfig.determine')}}</div>
      <el-button @click="visible = false">{{$i18n.t('webInfoConfig.cancellation')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$i18n.t('webInfoConfig.determine')}}</el-button>
    </span> -->
  <!-- </el-dialog> -->
</template>

<script>
  import ImgsUpload from '@/components/img-upload'
  export default {
    props: {
      paramKey: {
        type: String,
        default: 'PLATFROM_WEBSITE_CONFIG'
      },
      remark: {
        type: String
      }
      // configId: {
      //   type: Number,
      //   default: 0
      // }
    },
    data () {
      return {
        visible: false,
        dataForm: {
          id: null,
          isActivity: 0,
          bsLoginLogoImg: null,
          bsLoginBgImg: null,
          bsCopyrightCn: null,
          bsCopyrightEn: null,
          bsTitleContentCn: null,
          bsTitleContentEn: null,
          bsTitleImg: null,
          bsTopBarIcon: null,
          bsMenuTitleOpenCn: null,
          bsMenuTitleOpenEn: null,
          bsMenuTitleCloseCn: null,
          bsMenuTitleCloseEn: null,
          pcLogoImg: null,
          pcCopyrightCn: null,
          pcCopyrightEn: null,
          pcQrcodeImg: null,
          pcCompanyNameCn: null,
          pcCompanyNameEn: null,
          pcCompanyInfoCn: null,
          pcCompanyInfoEn: null,
          pcTitleContentCn: null,
          pcTitleContentEn: null,
          pcTitleImg: null,
          pcCompanyNameShortCn: null,
          pcCompanyNameShortEn: null,
          pcLogoImgText: null,
          pcWelcomeCn: null,
          pcWelcomeEn: null,
          pcLoginBgImg: null,
          uniLoginLogoImg: null,
          stationLoginLogoImg: null
        },
        dataRule: {}
      }
    },
    components: {
      ImgsUpload
    },
    mounted () {
      // this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getConfigData()
      })
    },
    methods: {
      getConfigData () {
        if (this.paramKey) {
          this.$http({
            url: this.$http.adornUrl(`/sys/webConfig/info/${this.paramKey}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm = JSON.parse(data) || {}
          })
        }
      },
      // init (configType, id) {
      //   this.dataForm.id = id || 0
      //   this.dataForm.configType = configType
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //     if (this.dataForm.id) {
      //       this.$http({
      //         url: this.$http.adornUrl('/sys/webConfig/info/' + this.dataForm.id),
      //         method: 'get',
      //         params: this.$http.adornParams()
      //       }).then(({data}) => {
      //         this.dataForm = data
      //       })
      //     }
      //   })
      // },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return
          }

          // 后台配置判断
          if (this.paramKey === 'PLATFROM_WEBSITE_CONFIG' || this.paramKey === 'MULTISHOP_WEBSITE_CONFIG' || this.paramKey === 'CASHIER_WEBSITE_CONFIG') {
            if (!this.dataForm.bsLoginLogoImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.loginLogo') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.bsLoginBgImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.loginBg') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.bsCopyrightCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsCopyright') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.bsCopyrightEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.bsCopyright') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.bsTitleContentCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsTitleContent') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.bsTitleContentEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.bsTitleContent') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.bsTitleImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsTitleImg') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // TopIcon
            if (!this.dataForm.bsTopBarIcon) {
              this.errorMsg(this.$i18n.t('webInfoConfig.TopIcon') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.bsMenuTitleOpenCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsMenuTitleOpen') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.bsMenuTitleOpenEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.bsMenuTitleOpen') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.bsMenuTitleCloseCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsMenuTitleClose') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.bsMenuTitleCloseEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.bsMenuTitleClose') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
          }

          // pc端配置判断
          if (this.paramKey === 'PC_WEBSITE_CONFIG') {
            if (!this.dataForm.pcLogoImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.logo') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.pcLoginBgImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.loginBg') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.pcCopyrightCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsCopyright') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.pcCopyrightEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.bsCopyright') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.pcQrcodeImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcQrcodeImg') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.pcCompanyNameCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcCompanyName') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.pcCompanyNameEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.pcCompanyName') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.pcCompanyInfoCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcCompanyInfo') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.pcCompanyInfoEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.pcCompanyInfo') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.pcTitleContentCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcTitleContent') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.pcTitleContentEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.pcTitleContent') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
            if (!this.dataForm.pcTitleImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.bsTitleImg') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.pcLogoImgText) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcLogoImgText') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            if (!this.dataForm.pcWelcomeCn) {
              this.errorMsg(this.$i18n.t('webInfoConfig.pcWelcome') + '-' + this.$i18n.t('webInfoConfig.chinese') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
            // if (!this.dataForm.pcWelcomeEn) {
            //   this.errorMsg(this.$i18n.t('webInfoConfig.pcWelcome') + '-' + this.$i18n.t('webInfoConfig.english') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            //   return
            // }
          }
          // h5端配置判断
          if (this.paramKey === 'H5_WEBSITE_CONFIG') {
            if (!this.dataForm.uniLoginLogoImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.loginLogo') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
          }

          // 自提点端配置判断
          if (this.paramKey === 'STATION_WEBSITE_CONFIG') {
            if (!this.dataForm.stationLoginLogoImg) {
              this.errorMsg(this.$i18n.t('webInfoConfig.loginLogo') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
              return
            }
          }

          // 新增或修改配置
          const paramsData = {
            id: this.dataForm.id || 0,
            paramKey: this.paramKey,
            paramValue: JSON.stringify(this.dataForm),
            remark: this.remark
          }
          this.$http({
            url: this.$http.adornUrl('/sys/webConfig/save'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(paramsData)
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              customClass: 'zZindex'
              // onClose: () => {
              //   this.visible = false
              //   this.$emit('refreshDataList')
              // }
            })
            this.updateWebConfigData()
          })
        })
      },

      errorMsg (message) {
        this.$message({
          message: message,
          type: 'error',
          duration: 1500,
          customClass: 'zZindex'
        })
      },

      // 更新网站配置信息
      updateWebConfigData () {
        if (this.paramKey !== 'PLATFROM_WEBSITE_CONFIG') {
          return false
        }
        this.$http({
          url: this.$http.adornUrl('/sys/webConfig/getActivity'),
          method: 'get'
        }).then(({data}) => {
          this.$store.commit('webConfig/addData', data)
        })
      }
    }
  }
</script>

<style scoped>
/* .el-dialog-body .el-dialog__header{
  border-bottom: 1px solid #c0ccda;
}
.el-dialog-body .el-dialog__body {
    height: 650px;
    overflow-y: auto;
}
.el-dialog-body .el-dialog__footer{
  border-top: 1px solid #c0ccda;
}
.zZindex{
  z-index: 9999 !important;
} */

  .el-form-item-tips {
    font-size: 12px;
    color: #999;
    line-height: 1em;
    padding-top: 8px;
    padding-bottom: 5px;
  }
</style>
<style scoped lang="scss">
  ::v-deep .el-input {
    width: 60%;
  }
  ::v-deep .el-textarea {
    width: 60%;
  }
</style>
