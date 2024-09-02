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
                <span v-if="modifyInformation.capital"> {{ modifyInformation.capital }} </span>
                <span v-else class="noyet-wrap">{{ $t('shopProcess.notYet') }}</span>
              </el-form-item>
              <el-form-item :label="$t('shopProcess.residence') + '：'" >
                <span v-if="modifyInformation.residence"> {{ modifyInformation.residence }} </span>
                <span v-else class="noyet-wrap">{{ $t('shopProcess.notYet') }}</span>
              </el-form-item>
              <el-form-item :label="$t('shopProcess.fountTime') + '：'" >
                <span v-if="modifyInformation.foundTime"> {{ modifyInformation.foundTime }} </span>
                <span v-else class="noyet-wrap">{{ $t('shopProcess.notYet') }}</span>
              </el-form-item>
              <el-form-item :label="$t('shopProcess.businessPeriod') + '：'" required>
                {{ modifyInformation.startTime + ' - ' + modifyInformation.endTime }}
              </el-form-item>
              <el-form-item :label="$t('shopProcess.businessScope') + '：'" required>
                {{ modifyInformation.businessScope }}
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
        <!-- 审核状态 -->
        <div class="audit-status-wrap">
          <div class="cloumn-item">{{ $t('shopProcess.auditStatus') }}：</div>
          <el-radio disabled v-model="auditRadio" label="0" size="small">{{ $t('shopProcess.onlinePendingReview') }}</el-radio>
          <el-radio v-model="auditRadio" label="1" size="small">{{ $t('shopProcess.passed') }}</el-radio>
          <el-radio v-model="auditRadio" label="-1" size="small">{{ $t('shopProcess.notThrough') }}</el-radio>
        </div>
        <div class="reason-wrap" v-show="auditRadio== -1">
          <span>{{ $t('shopProcess.rejectReason') + '：' }}</span>
          <el-input v-model="remarks" type="textarea" show-word-limit maxlength="50" :placeholder="$t('shopProcess.rejectReason')" />
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="closePop">{{ $t('shopProcess.close') }}</div>
      <div class="default-btn primary-btn" @click="subAuditResult">{{ $t('shopProcess.confirm') }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 图片前缀
      visible: false, // 控制显示
      auditRadio: '0', // 审核状态选择
      remarks: '', // 拒绝原因
      modifyInformation: {
        creditCode: '',
        firmName: '',
        representative: '',
        capital: '',
        residence: '',
        foundTime: '',
        startTime: '',
        endTime: '',
        businessScope: '',
        businessLicense: '',
        identityCardFront: '',
        identityCardLater: ''
      }
    }
  },
  methods: {
    init (id) {
      this.visible = true
      if (id) this.getmodifyInformation(id)
    },
    getmodifyInformation (shopId) {
      this.$http({
        url: this.$http.adornUrl('/platform/companyAuditing/auditInfo'),
        method: 'get',
        params: this.$http.adornParams({
          shopId: shopId
        })
      }).then(({ data }) => {
        this.$nextTick(() => {
          this.modifyInformation = { ...data, ...data.shopCompany }
          this.auditRadio = data.status
        })
      })
    },
    // 确定审核结果
    subAuditResult () {
      // 拦截
      if (this.auditRadio == '0') {
        return this.$message({
          message: this.$t('shopProcess.auditTip1'),
          type: 'error',
          duration: 1500
        })
      }
      if (this.auditRadio == '-1' && !this.remarks) {
        return this.$message({
          message: this.$t('shopProcess.auditTip3'),
          type: 'error',
          duration: 1500
        })
      }
      let param = {
        companyAuditingId: this.modifyInformation.companyAuditingId,
        shopCompanyId: this.modifyInformation.shopCompanyId,
        shopId: this.modifyInformation.shopId,
        status: this.auditRadio,
        remarks: this.remarks
      }
      this.$http({
        url: this.$http.adornUrl(`/platform/companyAuditing/audit`),
        method: 'put',
        data: this.$http.adornData(param)
      }).then(() => {
        this.$message({
          message: this.$t('shopProcess.auditTip2'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.closePop()
          }
        })
      }).catch(() => {
        this.closePop()
      })
    },
    // 关闭弹窗
    closePop () {
      this.visible = false
      this.$emit('closePops')
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
    .audit-status-wrap,
    .topModifyColumn {
      height: 90px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .audit-status-wrap {
      justify-content: flex-start;
      .cloumn-item {
        text-align: right;
        width: 90px;
      }
    }
    .reason-wrap {
      display: flex;
      justify-content: flex-start;
      span {
        min-width: 90px;
        text-align: right;
      }
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
.popup ::v-deep .el-form-item__label {
  min-width: 150px;
  text-align: right;
}
.reason-wrap span::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
</style>
