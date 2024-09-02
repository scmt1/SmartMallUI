<template>
  <div class="business-info-wrap">
    <div class="business-info-mod">
      <el-form ref="companyInfoForm" label-width="140px" :model="companyInfoForm" size="small">
        <div class="ci-wrapper">

          <div class="left-item-wrap">
            <el-form-item :label="$t('shopProcess.creditCode') + '：'" required>
              {{ companyInfoForm.creditCode }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.firmName') + '：'" required>
              {{ companyInfoForm.firmName }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.representative') + '：'" required>
              {{ companyInfoForm.representative }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.capital') + '：'" >
              <span v-if="companyInfoForm.capital">{{ companyInfoForm.capital}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.residence') + '：'" >
              <span v-if="companyInfoForm.residence">{{ companyInfoForm.residence}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.fountTime') + '：'" >
              <span v-if="companyInfoForm.foundTime">{{ companyInfoForm.foundTime}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.businessTerm') + '：'" required>
              {{ companyInfoForm.startTime.slice(0,10) + ' - ' + companyInfoForm.endTime.slice(0,10) }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.businessScope') + '：'" required>
              {{ companyInfoForm.businessScope }}
            </el-form-item>
          </div>
          <div class="right-item-wrap">
            <!-- 右侧图片 -->
            <el-form-item :label="$t('shopProcess.businessLicense') + '：'" required>
              <div class="business-license-box">
                <div class="logo-image-box" >
                  <el-image
                    v-if="companyInfoForm.businessLicense"
                    class="logo-image"
                    :src="companyInfoForm.businessLicense.indexOf('http') === 0 ? companyInfoForm.businessLicense : resourcesUrl + companyInfoForm.businessLicense"
                  />
                 <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.corporateIdentityCard') + '：'" required>
              <div class="business-license-box">
                <div class="logo-image-box" v-if="companyInfoForm.identityCardFront || companyInfoForm.identityCardLater">
                  <el-image
                    v-if="companyInfoForm.identityCardFront"
                    class="logo-image"
                    :src="companyInfoForm.identityCardFront.indexOf('http') === 0 ? companyInfoForm.identityCardFront : resourcesUrl + companyInfoForm.identityCardFront"
                  />
                   <el-image
                    v-if="companyInfoForm.identityCardLater"
                    class="logo-image"
                    :src="companyInfoForm.identityCardLater.indexOf('http') === 0 ? companyInfoForm.identityCardLater : resourcesUrl + companyInfoForm.identityCardLater"
                  />
                </div>
                <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="foot-box">
        <div class="btn default-btn primary-btn" v-show="status != 0" @click="modifyBasicInfor">{{ $t('shopProcess.modify') }}</div>
        <!-- <div class="btn default-btn primary-btn" v-show="status == 0 || status == 1 || status == -1"  @click="viewModify">查看修改信息</div> -->
        <div class="btn default-btn primary-btn" v-show="status == 0 || status == -1"  @click="viewModify">{{ $t('shopProcess.viewModify') }}</div>
      </div>
    </div>

    <!-- 查看修改信息 -->
    <view-modify-business-information
      v-if="isModifyBusinessInfor"
      ref="viewModifyBusinessInfor"
      :modifyInformation = "companyInfoForm"
      @closeModifyBusiness="closeModifyBusinessInfor"
    >
    </view-modify-business-information>
  </div>
</template>

<script>
  import viewModifyBusinessInformation from './view-modify-business-information.vue'
  export default {
    components: {
      viewModifyBusinessInformation
    },
    data () {
      return {
          // 工商信息
        companyInfoForm: {
          creditCode: '',
          identityCardLater: '',
          identityCardFront: '',
          businessLicense: '',
          businessScope: '',
          startTime: '',
          foundTime: '',
          residence: '',
          capital: '',
          representative: '',
          firmName: ''
        },
        status: '', // 状态
        isModifyBusinessInfor: false,
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL // 图片前缀
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getBusinessInfor()
        this.getmodifyInformation()
      },
      // 修改信息
      modifyBasicInfor () {
        this.$emit('closeBusinessBrowse')
      },
      // 获取工商信息
      getBusinessInfor () {
        this.$http({
          url: this.$http.adornUrl(`/shop/shopCompany`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.companyInfoForm = data
        })
      },
      // 查看审核提交信息
      getmodifyInformation () {
        this.$http({
          url: this.$http.adornUrl(`/shop/companyAuditing/auditInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.$nextTick(() => {
              this.status = data.status
            })
          }
        })
      },
      // 查看修改信息
      viewModify () {
        this.isModifyBusinessInfor = true
        this.$nextTick(() => {
          this.$refs.viewModifyBusinessInfor.init()
        })
      },
      closeModifyBusinessInfor () {
        this.closeModifyBusinessInfor = false
        this.$nextTick(() => {
          this.getBusinessInfor()
          this.getmodifyInformation()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .business-info-wrap {
    color: #606266;
    font-size: 14px;
    margin-top: 30px;
  }
  .logo-image-box {
    height: 98px;
    display: flex;
    flex-wrap: nowrap;
  }
  .logo-image {
    width: 98px;
    height: 98px;
  }
  .logo-image:not(.logo-image:first-child) {
    margin-left: 20px;
  }

  .ci-wrapper {
    display: flex;
    justify-content: space-evenly;
    .left-item-wrap {
      width: 50%;
    }
    .right-item-wrap {
      width: 50%;
    }
  }
  .foot-box {
    margin-left: 140px;
  }
  .noyet-wrap {
    color: #999;
  }
  div ::v-deep .el-form-item__label {
    min-width: 150px;
  }
</style>