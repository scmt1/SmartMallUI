<template>
  <div class="mod-distribution-prod-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.distributionProdId
          ? $t('marketing.newDisProducts')
          : $t('marketing.modifyDisnProducts')
        }}
      </div>
    </div>
    <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        class="form-box"
        label-width="auto"
        @keyup.enter.native="dataFormSubmit()"
        size="small"
      >
        <el-form-item :label="$t('groups.relatedProducts')+':'">
          <div v-if="prodData[0] != null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <prod-pic
                  height="104px"
                  width="100%"
                  :pic="prodData[0].pic"
                ></prod-pic>
              <div class="card-prod-bottom">
                <span style="width: 79px;" class="card-prod-name">{{ prodData[0].prodName }}</span>
                <div
                  class="default-btn text-btn"
                  @click="deleteRelation"
                  >{{ $t("text.delBtn") }}</div
                >
              </div>
            </el-card>
          </div>
          <div v-else @click="addProd" class="default-btn">{{
            $t("product.select")
          }}</div>
        </el-form-item>


        <div v-if="dataForm.defaultReward === 0">
          <el-form-item :label="$t('marketing.rewardRatio')+':'" prop="awardType">
            <el-radio-group v-model="dataForm.awardProportion">
              <el-radio :label="0">{{ $t("marketing.proporteward") }}</el-radio>
              <el-radio :label="1">{{ $t("marketing.rewardByFixedValue") }}
                <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">{{ $t("marketing.tips")}}</div>
                  <span>
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('marketing.inviterReward')+':'" prop="awardType">
            <el-radio-group v-model="dataForm.parentAwardSet">
              <el-radio :label="0">{{ $t("station.close") }}</el-radio>
              <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="(dataForm.awardNumberSet === 1 ? $t('marketing.amountSetting') : $t('marketing.rewardAmount'))+ ':'" prop="awardType">
            <div v-if="dataForm.awardNumberSet === 0">
              <el-input
                v-model="dataForm.awardNumbers"
                :precision="2"
                :min="0"
                size="small"
                style="width: 200px"
              >
                <template slot="append">
                  <span v-if="dataForm.awardProportion === 1">{{
                    $t("admin.dollar")
                  }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item v-if="dataForm.awardNumberSet === 0 && dataForm.parentAwardSet === 1" :label="$t('marketing.inviterRewardAmount')+':'">
            <el-input
              v-model="dataForm.parentAwardNumbers"
              :precision="2"
              :min="0"
              size="small"
              v-if="dataForm.parentAwardSet === 1"
              style="width: 200px"
            >
              <template slot="append">
                <span v-if="dataForm.awardProportion === 1">{{
                  $t("admin.dollar")
                }}</span>
                <span v-else>%</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            :label="$t('product.status')+':'"
            prop="state"
            v-if="dataForm.state < 2"
          >
            <el-radio-group v-model="dataForm.state">
              <el-radio :label="1">{{ $t("publics.UpperShelf") }}</el-radio>
              <el-radio :label="0">{{ $t("publics.LowerShelf") }}</el-radio>
            </el-radio-group>
        </el-form-item>
        </div>
        <el-form-item  style="margin-top: 20px">
          <div class="default-btn" @click="back()">{{
            $t("shopFeature.edit.back")
          }}</div>
          <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
            $t("crud.filter.submitBtn")
          }}</div>
        </el-form-item>
      </el-form>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addProdVisible"
      ref="addProd"
      @refreshDiscountProds="selectDiscountProds"
      :isDistribution="true"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from '../marketing/distributionProd-add-or-update'
import ProdPic from '@/components/prod-pic'
export default {
  name: 'new-distribution-prod',
  data () {
    return {
      dataForm: {
        'prodId': 0,
        'distributionAmount': 0,
        'awardId': 0,
        'state': 1,
        'defaultReward': 0,
        'awardProportion': 0,
        'awardNumberSet': 0,
        'awardNumbers': '',
        'parentAwardNumbers': '',
        'parentAwardSet': 0
      },
      levelData: [],
      prodData: [],
      isSubmit: false,
      addProdVisible: false,
      isInviterReward: true,
      dataRule: {

      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    AddOrUpdate,
    ProdPic
  },
  mounted () {
    const flag = sessionStorage.getItem('distributionProdData') !== 'undefined'
    const data = flag ? JSON.parse(sessionStorage.getItem('distributionProdData')) : null
    this.init(data)
    let title = !this.dataForm.distributionProdId ? this.$t('marketing.newDisProducts') : this.$t('marketing.modifyDisnProducts')
    this.$store.commit('common/replaceSelectMenu', title)
  },
  methods: {
    init (data) {
      this.isSubmit = false
      this.dataForm.distributionProdId = 0
      if (data) {
        data.product.pic = data.product.pic.indexOf('http') !== -1 ? data.product.pic : this.resourcesUrl + data.product.pic
        this.dataForm = data
        this.prodData[0] = this.dataForm.product
      } else {
        this.$refs['dataForm'].resetFields()
        this.dataForm.defaultReward = 0
        this.dataForm.awardProportion = 0
        this.dataForm.awardNumberSet = 0
        this.dataForm.parentAwardSet = 0
        this.dataForm.awardNumbers = 1
        this.dataForm.parentAwardNumbers = 1
        this.dataForm.state = 1
        this.levelData = []
        this.prodData = []
      }
      // this.getLevelDataList(data)
      sessionStorage.setItem('distributionProdData', undefined)
    },
    // 获取等级数据列表
    getLevelDataList (isReadLevelData) {
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionLevel/info'),
        method: 'get'
      }).then(({ data }) => {
        // this.isInviterReward
        this.levelData = data
        if (this.levelData[0].parentAwardSwitch === 0) {
          this.isInviterReward = false
        } else {
          this.isInviterReward = true
        }
        if (isReadLevelData) {
          // 如果是根据等级奖励
          if (this.dataForm.awardNumberSet === 1) {
            // 从奖励表获取奖励数额json
            let awardNumbers = JSON.parse(this.dataForm.awardNumbers)
            let parentAwardNumbers = JSON.parse(this.dataForm.parentAwardNumbers)
            // 从Map中匹配对应的数额
            this.levelData.forEach((item, index) => {
              this.levelData[index].awardNumber = awardNumbers[index]
              this.levelData[index].parentAwardNumber = parentAwardNumbers[index]
            })
          }
        }
      })
    },
    // 删除关联商品数据
    deleteRelation () {
      this.dataForm.prodId = null
      this.prodData = []
    },
    // 打开选择商品
    addProd () {
      this.addProdVisible = true
      this.$nextTick(() => {
        this.$refs.addProd.init(0, this.prodData)
      })
    },
    // 商品选择回调
    selectDiscountProds (prods) {
      if (prods) {
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/distribution/distributionProd/count'),
            method: 'get',
            params: this.$http.adornParams({
              prodId: prods[0].prodId
            })
          }).then(({ data }) => {
            this.dataForm.prodId = prods[0].prodId
            this.$set(this.prodData, 0, prods[0])
          })
        })
      }
    },
    checkAwardNumberSet () {
      if (this.dataForm.awardNumberSet === 0) {
        if (this.checkAwardNumbers(this.dataForm.awardNumbers) ||
            (this.dataForm.parentAwardSet === 1 && this.checkAwardNumbers(this.dataForm.parentAwardNumbers))) {
          return true
        }
      }
      if (this.dataForm.awardNumberSet === 1) {
        for (var i = 0; i < this.levelData.length; i++) {
          let level = this.levelData[i]
          if (this.checkAwardNumbers(level.awardNumber) || (this.dataForm.parentAwardSet === 1 && this.checkAwardNumbers(level.parentAwardNumber))) {
            return true
          }
        }
      }
      return false
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.defaultReward === 0 && this.checkAwardNumberSet()) {
        return
      }
      if (this.dataForm.awardNumberSet === 0 && this.dataForm.parentAwardSet === 1) {
        if (parseFloat(this.dataForm.parentAwardNumbers) <= 0) {
          this.$message.error(this.$i18n.t('marketing.valueSetting'))
          return
        }
      }

      if (this.prodData[0] == null) {
        this.$message.error(this.$i18n.t('marketing.pleaseSelectAProduct'))
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.awardNumberSet === 1) {
            // 创建json存入奖励表
            let awardNumberjson = []
            let parentAwardNumberjson = []
            this.levelData.forEach((item, index) => {
              awardNumberjson.push(Number.parseFloat(item.awardNumber).toFixed(2))
              parentAwardNumberjson.push(Number.parseFloat(item.parentAwardNumber).toFixed(2))
            })
            this.dataForm.awardNumbers = JSON.stringify(awardNumberjson)
            this.dataForm.parentAwardNumbers = JSON.stringify(parentAwardNumberjson)
          }
          let param = this.dataForm
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionProd`),
            method: param.distributionProdId ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.back()
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    checkAwardNumbers (number) {
      if (!number && number !== 0) {
        this.$message.error(this.$i18n.t('marketing.valueSetBeEmpty'))
        return true
      }
      let regex = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!regex.test(number)) {
        this.$message.error(this.$i18n.t('marketing.valueSetting'))
        return true
      }
      if (this.dataForm.parentAwardSet && !this.dataForm.awardProportion) {
        if (parseFloat(this.dataForm.parentAwardNumbers) + parseFloat(this.dataForm.awardNumbers) >= 100) {
          this.$message.error(this.$i18n.t('marketing.rewardAmount') + '+' + this.$i18n.t('marketing.inviterRewardAmount') + this.$i18n.t('marketing.totalAwardOverTips'))
          return true
        }
        if (parseFloat(this.dataForm.awardNumbers) > 100) {
          this.$message.error(this.$i18n.t('marketing.rewardRatio') + this.$i18n.t('marketing.totalAwardOverTips'))
          return true
        }
      }
    },
    awardNumberSetChange (val) {
      if (val === 0) {
        this.dataForm.awardNumbers = 0
        this.dataForm.parentAwardNumbers = 0
      }
    },
    back () {
      this.$router.push({
        name: 'marketing-distribution-prod'
      })
    }
  }
}
</script>
<style lang="scss">
.mod-distribution-prod-add-or-update {
  .el-input__inner {
    padding: 2px;
    border-radius: 3px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .award-box {
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 10px;
    }
  }
}
.level-table-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px;
}
.elTable th {
  padding: 10px 0 !important;
}
.elTable td {
  padding: 2px 0 !important;
}
.table-input-box {
  margin-top: 300px;
  width: 300px;
}
.table-template {
  text-align: left;
}
.table-template > * {
  display: inline-block;
  margin: auto;
}
.card-prod-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.form-box {
    margin-left: 40px;
  }
</style>
<style scoped>
.mod-distribution-prod-add-or-update ::v-deep .el-form-item--mini.el-form-item,
.mod-distribution-prod-add-or-update ::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 20px;
}
div >>> .el-input-group__prepend{
  padding: 0 12px;
}
</style>
