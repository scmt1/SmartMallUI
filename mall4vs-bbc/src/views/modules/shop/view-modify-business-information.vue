<template>
  <el-dialog
    :title="$t('shopProcess.changeBusinessInfor')"
    :visible.sync="visible"
    :append-to-body="true"

    :close-on-click-modal="false"
    top="10vh"
    width="70%"
    class="shop-in-category-pup-dialog"
  >
  <div class="popup">
    <!-- 审核状态 -->
    <div class="topModifyColumn">
      <div>{{ $t('shopProcess.auditStatus') }} : {{ auditStatus == -1 ? $t('shopProcess.notPass') : auditStatus == 1 ? $t('shopProcess.passed') : $t('shopProcess.notAudit') }}</div>
      <div v-if="auditStatus == 0" class="default-btn primary-btn" @click="withdrawReview">{{ $t('shopProcess.reAmendmentRequest') }}</div>
    </div>
    <!-- 修改信息 -->
    <el-form ref="modifyInformation" label-width="140px" :model="modifyInformation" size="small">
        <div class="ci-wrapper">
          <div class="left-item-wrap">
            <el-form-item :label="$t('shopProcess.creditCode') + '：'" required>
              {{ modifyInformation.creditCode }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.firmName') + '：'" required>
              {{ modifyInformation.firmName }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.representative') + '：'" required>
              {{ modifyInformation.representative }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.capital') + '：'" >
              <span v-if="modifyInformation.capital">{{ modifyInformation.capital}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.residence') + '：'" >
              <span v-if="modifyInformation.residence">{{ modifyInformation.residence}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
           
            <el-form-item :label="$t('shopProcess.fountTime') + '：'" >
              <span v-if="modifyInformation.foundTime">{{ modifyInformation.foundTime}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.businessTerm') + '：'" required>
              {{ modifyInformation.startTime + ' - ' + modifyInformation.endTime }}
            </el-form-item>
            <el-form-item :label="$t('shopProcess.businessScope') + '：'" required>
              {{ modifyInformation.businessScope }}
            </el-form-item>
            <!-- 审核失败-拒绝原因 -->
            <el-form-item v-if="auditStatus == -1" :label="$t('shopProcess.denialReason') + '：'">
              <span v-if="modifyInformation.remarks">{{ modifyInformation.remarks}}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
          </div>
          <div class="right-item-wrap">
            <!-- 右侧图片 -->
            <el-form-item :label="$t('shopProcess.businessLicense') + '：'" required>
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="modifyInformation.businessLicense"
                    class="logo-image"
                    :src="modifyInformation.businessLicense.indexOf('http') === 0 ? modifyInformation.businessLicense : resourcesUrl + modifyInformation.businessLicense"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('shopProcess.corporateIdentityCard') + '：'" required>
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="modifyInformation.identityCardFront"
                    class="logo-image"
                    :src="modifyInformation.identityCardFront.indexOf('http') === 0 ? modifyInformation.identityCardFront : resourcesUrl + modifyInformation.identityCardFront"
                  />
                   <el-image
                    v-if="modifyInformation.identityCardLater"
                    class="logo-image"
                    :src="modifyInformation.identityCardLater.indexOf('http') === 0 ? modifyInformation.identityCardLater : resourcesUrl + modifyInformation.identityCardLater"
                  />
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{ $t('shopProcess.close') }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      // 控制显示
      visible: false,
      // 审核情况
      auditStatus: '',
      modifyInformation: {
        creditCode: '',
        firmName: '',
        representative: '',
        capital: '',
        residence: '',
        fountTime: '',
        startTime: '',
        endTime: '',
        businessScope: '',
        businessLicense: '',
        identityCardFront: '',
        identityCardLater: ''
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL // 图片前缀
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getmodifyInformation()
    },
    getmodifyInformation () {
      this.$http({
        url: this.$http.adornUrl(`/shop/companyAuditing/auditInfo`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$nextTick(() => {
          this.modifyInformation = {...data, ...data.shopCompany}
          this.auditStatus = data.status
        })
      })
    },
    // 撤销申请
    withdrawReview () {
      this.$http({
        url: this.$http.adornUrl('/shop/companyAuditing/revoke'),
        method: 'put',
        data: this.modifyInformation.companyAuditingId
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('shopProcess.auditTip2'),
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.closePop()
          }
        })
      }).catch(res => {
        this.closePop()
      })
    },
    closePop () {
      this.visible = false
      this.$nextTick(() => {
        this.$emit('closeModifyBusiness')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-in-category-pup-dialog {
  & ::v-deep .el-dialog {
    min-width: 950px;
  }
  .popup {
    display: block;
    color: #606266;
    font-size: 14px;
    .topModifyColumn {
      height: 90px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
  }
}
.noyet-wrap {
  color: #999;
}
</style>
