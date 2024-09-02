<template>
  <div class="mod-groupProd">
    <el-dialog
      :title="this.$i18n.t('groups.commSpenMan')"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="visible"
      :modal="true"
      width="50%"
    >
      <!-- 填写多个商品规格设置 -->
      <div >
        <el-table :data="this.dataForm.skuDtoList" style="width: 100%">
          <el-table-column
            prop="skuName"
            :label="this.$i18n.t('groups.skuName')"
            width="180"
          >
            <template slot-scope="scope">{{
              !scope.row.skuName || scope.row.skuName === ""
                ? dataForm.prodName
                : scope.row.skuName
            }}</template>
          </el-table-column>
          <!-- 销售价(元) -->
          <el-table-column
            prop="price"
            :label="this.$i18n.t('product.sellingPrice')"
            width="180"
          ></el-table-column>
          <!-- 拼团价(元) -->
          <el-table-column prop="actPrice" :label="this.$i18n.t('groups.groupPriceYuan')">
            <template slot-scope="scope">
              <el-input
                size="mini"
                type="text"
                :min="0.01"
                @input="changeNum(scope.$index, 'actPrice')"
                :disabled="!canEdit"
                v-model="scope.row.actPrice"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 团长价(元) -->
          <el-table-column
            v-if="dataForm.hasLeaderPrice === 1"
            prop="leaderPrice"
            :label="this.$i18n.t('groups.headPriceYuan') "
          >
            <template slot-scope="scope">
              <el-input
                size="mini"
                type="text"
                :min="0.01"
                :disabled="!canEdit"
                @input="changeNum(scope.$index, 'leaderPrice')"
                v-model="scope.row.leaderPrice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="stocks"
            :label="this.$i18n.t('groups.stock')"
          ></el-table-column>
        </el-table>

        <!-- 批量设置价格 -->
        <div style="float: left;margin-left:10px;margin-top: 10px;">
          <span>
            <strong>{{ $t("groups.batchSettings") }}:</strong>
          </span>
          <!-- 拼团价价格 -->
          <el-button
            type="text"
            v-if="!settingGroupPriceVisible"
            :disabled="!canEdit"
            @click="groupPriceSettingHandle()"
            >{{ $t("groups.groupPrice") }}</el-button
          >
          <el-input-number
            size="mini"
            v-if="settingGroupPriceVisible"
            style="width: 100px"
            :placeholder="this.$i18n.t('groups.enterPrice')"
            v-model="groupPrice"
            :precision="2"
            :min="0.01"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input-number>
          <el-button
            type="text"
            v-if="settingGroupPriceVisible"
            @click="checkGroupPriceHandle()"
            >{{ $t("crud.filter.submitBtn") }}</el-button
          >
          <el-button
            type="text"
            v-if="settingGroupPriceVisible"
            @click="settingGroupPriceVisible = false"
            >{{ $t("crud.filter.cancelBtn") }}</el-button
          >

          <!-- 团长价格 -->
          <el-button
            type="text"
            v-if="!settingLeaderPriceVisible && dataForm.hasLeaderPrice == 1"
            :disabled="!canEdit"
            @click="leaderPriceSettingHandle()"
            >{{ $t("groups.headPrice") }}</el-button
          >
          <el-input-number
            size="mini"
            v-if="settingLeaderPriceVisible && dataForm.hasLeaderPrice == 1"
            style="width: 100px"
            :placeholder="this.$i18n.t('groups.enterPrice')"
            type="number"
            v-model="leaderPrice"
            :min="0.01"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input-number>
          <el-button
            type="text"
            v-if="settingLeaderPriceVisible && dataForm.hasLeaderPrice == 1"
            @click="checkLeaderPriceHandle()"
            >{{ $t("crud.filter.submitBtn") }}</el-button
          >
          <el-button
            type="text"
            v-if="settingLeaderPriceVisible && dataForm.hasLeaderPrice == 1"
            @click="settingLeaderPriceVisible = false"
            >{{ $t("crud.filter.cancelBtn") }}</el-button
          >
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <div @click="visible = false" class="default-btn">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div
          type="primary"
          @click="dataFormSubmit(!canEdit)"
          :class="[!canEdit?'disabled-btn':'','default-btn primary-btn']"
          size="mini"
          >{{ $t("crud.filter.submitBtn") }}</div
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      groupSelectProdVisible: false,
      settingGroupPriceVisible: false,
      settingLeaderPriceVisible: false,
      dataForm: {},
      groupPrice: 0,
      leaderPrice: null,
      canEdit: true
    }
  },
  methods: {
    init (prodId) {
      this.visible = true
      this.$nextTick(() => {
        this.canEdit = true
        if (prodId) {
          this.$http({
            url: this.$http.adornUrl('/group/prod/getGroupProdAndSkuList/' + prodId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            if (this.dataForm) {
              this.judgeCanEdit(this.dataForm)
            }
          })
        }
      })
    },
    // 判断是否可以编辑
    judgeCanEdit (data) {
      if (data.activityStatus !== 1 && data.activityStatus !== 5) {
        this.canEdit = false
      }
    },
    // 表单提交
    dataFormSubmit (status) {
      if (status) {
        return
      }
      let list = this.dataForm.skuDtoList
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          const element = list[key]
          if (!parseFloat(element.actPrice)) {
            this.$message.error(this.$i18n.t('groups.activityPriceMus'))
            return
          }
          if (!parseFloat(element.leaderPrice)) {
            this.$message.error(this.$i18n.t('groups.theLeaderPriceMu'))
            return
          }
          if (parseFloat(element.actPrice) > parseFloat(element.price)) {
            this.$message.error(this.$i18n.t('groups.canTPlateauPrice'))
            return
          }
          if (parseFloat(element.actPrice) > parseFloat(element.price)) {
            this.$message.error(this.$i18n.t('groups.canTPlateauPrice'))
            return
          }
          if (parseFloat(element.leaderPrice) > parseFloat(element.price)) {
            this.$message.error(this.$i18n.t('groups.notTPY'))
            return
          }
          if (
            this.dataForm.hasLeaderPrice === 1 &&
            parseFloat(element.leaderPrice) > parseFloat(element.actPrice)
          ) {
            this.$message.error(this.$i18n.t('groups.notTAY'))
            return
          }
        }
      }
      if (this.settingGroupPriceVisible) {
        this.$message.error(this.$i18n.t('groups.pleaseSetTGP'))
        return
      }
      if (this.settingLeaderPriceVisible && this.dataForm.hasLeaderPrice === 1) {
        this.$message.error(this.$i18n.t('groups.pleaseSetFirst'))
        return
      }
      this.$http({
        url: this.$http.adornUrl('/group/sku/updateSkuBatch'),
        method: 'put',
        data: this.dataForm.skuDtoList
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
      })
    },
    // 选择商品操作
    selectProdHandle () {
      this.groupSelectProdVisible = true
      this.$nextTick(() => {
        this.$refs.groupSelectProd.init(this.dataForm.groupProds)
      })
    },
    // 选商品回调
    selectGroupProds (prods) {
      if (prods) {
        let prodIds = []
        this.dataForm.groupProds = prods
        for (let index = 0; index < prods.length; index++) {
          prodIds.push(prods[index].prodId)
        }
        this.getProdAndSkuListsByProdIds(prodIds)
        prodIds = []
      }
    },
    // 通过商品id列表，查询所有的对应的sku列表
    getProdAndSkuListsByProdIds (prodIds) {
      if (prodIds) {
        this.$http({
          url: this.$http.adornUrl(
            '/group/activity/getProdAndSkuLists?prodIds=' + prodIds
          ),
          method: 'get',
          params: {}
        }).then(({ data }) => {
          this.groupProdAndSkuLists = data
        })
      }
    },
    // 设置成团价格
    groupPriceSettingHandle () {
      this.groupPrice = null
      this.settingGroupPriceVisible = true
    },
    // 设置价格
    leaderPriceSettingHandle () {
      this.leaderPrice = null
      this.settingLeaderPriceVisible = true
    },
    // 设置拼团价格
    checkGroupPriceHandle () {
      if (this.groupPrice < 0.01) {
        this.$message.error(this.$i18n.t('groups.groupPriceMusThan0'))
        return
      }
      if (this.dataForm && this.groupPrice) {
        if (this.dataForm.skuDtoList) {
          for (let i = 0; i < this.dataForm.skuDtoList.length; i++) {
            this.dataForm.skuDtoList[i].actPrice = parseFloat(this.groupPrice)
          }
        }
      }
      this.settingGroupPriceVisible = false
    },
    // 设置团长价格
    checkLeaderPriceHandle () {
      if (parseFloat(this.leaderPrice) <= 0) {
        this.$message.error(this.$i18n.t('groups.theLeaderPriceMu'))
        return
      }
      if (this.dataForm && this.leaderPrice) {
        if (this.dataForm.skuDtoList) {
          for (let i = 0; i < this.dataForm.skuDtoList.length; i++) {
            this.dataForm.skuDtoList[i].leaderPrice = parseFloat(this.leaderPrice)
          }
        }
      }
      this.settingLeaderPriceVisible = false
    },

    changeNum (index, type) {
      const actPrice = this.dataForm.skuDtoList[index][type]
      let value = this.checkInput(actPrice)
      this.dataForm.skuDtoList[index][type] = value
    },
    /**
     * input输入框只允许输入正数和小数(保留小数点后两位)
     */
    checkInput (num) {
      if (num) {
        var tmpVal = num.replace(/[^\d^\\.]/g, '')
        var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
        if (!reg.test(tmpVal)) {
          tmpVal = tmpVal + ''
          tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
          var n = (tmpVal.split('.')).length - 1
          if (n > 1) {
            tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
          }
        }
        return tmpVal
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
.mod-groupProd {
  .card-prod-bottom {
    position: relative;
    text-align: left;
    .card-prod-name {
      margin: auto;
      padding: 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }
    .card-prod-name-button {
      position: absolute;
      top: 24px;
      right: 10px;
    }
  }
  .el-dialog__body {
    padding-bottom: 50px;
  }
  .el-dialog__footer {
    padding: 20px;
    padding-top: 20px;
  }
}
</style>
