<template>
  <div class="mod-distribution-prod-add-or-update">
    <el-dialog
      :title="
        !dataForm.distributionProdId
          ? $t('marketing.newDisProducts')
          : $t('marketing.modifyDisnProducts')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="$t('language') === 'English' ? '130px' : '100px'"
      >
        <el-form-item :label="$t('groups.relatedProducts')">
          <div v-if="prodData[0] != null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <img :src="prodData[0].pic" style="height: 104px; width: 100%" />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ prodData[0].prodName }}</span>
                <div
                  class="default-btn text-btn"
                  @click="deleteRelation"
                  >{{ $t("text.delBtn") }}</div
                >
              </div>
            </el-card>
          </div>
          <div @click="addProd" v-if="prodData[0] == null" class="default-btn">{{
            $t("product.select")
          }}</div>
        </el-form-item>

        <!-- <el-form-item
          :label="$t('marketing.defaultReward')"
          prop="defaultReward"
        >
          <el-radio-group @change="dataForm.defaultReward === 1 ? getLevelDataList(0) : getLevelDataList(1)" v-model="dataForm.defaultReward">
            <el-radio :label="0">{{ $t("marketing.noUse") }}</el-radio>
            <el-radio :label="1">{{ $t("marketing.use") }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
          <el-form-item :label="$t('marketing.rewardRatio')" prop="awardType">
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
          <el-form-item :label="$t('marketing.inviterReward')" prop="awardType">
            <el-radio-group v-model="dataForm.parentAwardSet">
              <el-radio :label="0">{{ $t("station.close") }}</el-radio>
              <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label=" $t('marketing.rewardAmount')" prop="awardType">
            <div>
              <el-input
                v-model="dataForm.awardNumbers"
                :precision="2"
                :min="0"
                style="width: 200px"
              >
                <template slot="append">
                  <span v-if="dataForm.awardProportion === 1">{{
                    $t("admin.dollar")
                  }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>

              <span
                v-if="dataForm.parentAwardSet === 1"
              >&nbsp; {{ $t("marketing.inviterRewardAmount") }}:</span>
              <el-input
                v-if="dataForm.parentAwardSet === 1"
                v-model="dataForm.parentAwardNumbers"
                :precision="2"
                :min="0"
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

        <el-form-item
          :label="$t('product.status') + ':'"
          prop="state"
          v-if="dataForm.state < 2"
        >
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">{{ $t("publics.UpperShelf") }}</el-radio>
            <el-radio :label="0">{{ $t("publics.LowerShelf") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div  class="default-btn" @click="visible = false">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
          $t("crud.filter.submitBtn")
        }}</div>
      </span>
    </el-dialog>
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

export default {
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
      visible: false,
      isInviterReward: true,
      dataRule: {

      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    init (data) {
      this.visible = true
      this.isSubmit = false
      this.dataForm.distributionProdId = 0
      if (data) {
        this.dataForm = data
        this.prodData[0] = this.dataForm.product
      } else {
        this.$nextTick(() => {
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
        })
      }
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
            if (data === 0) {
              this.dataForm.prodId = prods[0].prodId
              this.$set(this.prodData, 0, prods[0])
            } else {
              this.$message({
                message: this.$i18n.t('marketing.theProduList'),
                type: 'warning'
              })
            }
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
                this.visible = false
                this.$emit('refreshDataList')
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
    },
    awardNumberSetChange (val) {
      if (val === 0) {
        this.dataForm.awardNumbers = 0
        this.dataForm.parentAwardNumbers = 0
      }
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
    margin-bottom: 0px;
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
</style>
