<template>
  <div class="mod-user-info">
    <el-dialog
      :title="$t('distributionMsg.titleTip1')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @before-close="close"
      width="570px"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="this.$i18n.t('language') === 'language' ? '180px' : '100px'"
      >
        <el-form-item :label="$t('distributionMsg.distriTelPhone')" prop="remarks">
          <el-input  size="small" v-model="dataForm.userMobile" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item :label="$t('distribution.idCardNo')" prop="identityCardNumber">
          <el-input  size="small" v-model="dataForm.identityCardNumber" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item :label="$t('distribution.realName')" prop="realName">
          <el-input  size="small" v-model="dataForm.realName" :disabled="true"></el-input>
        </el-form-item>

          <el-form-item label="个人信息">
            <div class="pic-con" v-if="infoList.length">
              <div class="pic-item"
                v-for="(pic, index) in infoList"
                :key="index">
                <el-image
                  :src="pic.srcLink"
                  :preview-src-list="srcList">
                </el-image>
                <span>{{pic.title}}</span>
              </div>
            </div>
            <span v-else>无</span>
          </el-form-item>

<!--
        <el-form-item :label="$t('distributionMsg.idCardFront')">
          <el-image
            v-if="dataForm.identityCardPicFront"
            style="width: 100px; height: 100px"
            :src="dataForm.identityCardPicFront"
            :preview-src-list="srcList">
          </el-image>
          <span v-else>无</span>
        </el-form-item>

        <el-form-item :label="$t('distributionMsg.idCardBack')">
          <el-image
            v-if="dataForm.identityCardPicBack"
            style="width: 100px; height: 100px"
            :src="dataForm.identityCardPicBack"
            :preview-src-list="srcList">
          </el-image>
          <span v-else>无</span>
        </el-form-item>

        <el-form-item :label="$t('distributionMsg.holdIdCard')">
          <el-image
            v-if="dataForm.identityCardPicHold"
            style="width: 100px; height: 100px"
            :src="dataForm.identityCardPicHold"
            :preview-src-list="srcList">
          </el-image>
          <span v-else>无</span>
        </el-form-item> -->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="close()">{{$t('seckill.close')}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
      },
      addProdVisible: false,
      visible: false,
      dataRule: {
      },
      srcList: [],
      infoList: []
    }
  },
  components: {
  },
  methods: {
    init (data) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dataForm = Object.assign(this.dataForm, data)
      let infoList = []
      if (this.dataForm.identityCardPicFront) {
        infoList.push({
          title: this.$i18n.t('distributionMsg.idCardFront'),
          srcLink: this.dataForm.identityCardPicFront
        })
      }
      if (this.dataForm.identityCardPicBack) {
        infoList.push({
          title: this.$i18n.t('distributionMsg.idCardBack'),
          srcLink: this.dataForm.identityCardPicBack
        })
      }
      if (this.dataForm.identityCardPicHold) {
        infoList.push({
          title: this.$i18n.t('distributionMsg.holdIdCard'),
          srcLink: this.dataForm.identityCardPicHold
        })
      }
      this.infoList = infoList
      if (infoList.length) {
        for (let i = 0; i < infoList.length; i++) {
          const element = infoList[i]
          this.srcList.push(element.srcLink)
        }
      }
    },
    close () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    }
  }

}
</script>

<style lang="scss" scoped>
.mod-user-info ::v-deep .el-dialog__body {
  padding-bottom: 0;
}
.pic-con {
  display: flex;
  .pic-item {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    .el-image {
      width: 80px;
      height: 80px;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>

<style lang="scss" scoped>
.mod-user-info ::v-deep .el-dialog__body {
  padding-bottom: 0;
}
.pic-con {
  display: flex;
  .pic-item {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    .el-image {
      width: 80px;
      height: 80px;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
