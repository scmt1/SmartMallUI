<template>
  <div class="mod-groupProd">
    <el-dialog :title="$t('groups.commSpenMan')"
               :visible.sync="visible"
               :modal="true"
               width="50%"
               append-to-body>
      <!-- 填写多个商品规格设置 -->
      <div v-if="true">
        <el-table :data="this.dataForm.skuDtoList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  style="width: 100%">
          <el-table-column prop="skuName"
                           :label="$t('groups.skuName')"
                           width="180">
            <template slot-scope="scope">
              {{scope.row.skuName ==="" || scope.row.skuName?dataForm.prodName:scope.row.skuName}}
            </template>
          </el-table-column>
          <!-- 销售价(元) -->
          <el-table-column prop="price"
                           :label="$t('prodList.salesPrice')"
                           width="180">
          </el-table-column>
          <!-- 拼团价(元) -->
          <el-table-column prop="actPrice"
                           :label="$t('groups.groupPriceYuan')">
            <template slot-scope="scope">
              <el-input size="small"
                        :disabled="true"
                        v-model="scope.row.actPrice"></el-input>
            </template>
          </el-table-column>
          <!-- 团长价(元) -->
          <el-table-column v-if="dataForm.hasLeaderPrice === 1"
                           prop="leaderPrice"
                           :label="$t('groups.headPriceYuan')">
            <template slot-scope="scope">
              <el-input size="small"
                        :disabled="true"
                        v-model="scope.row.leaderPrice"></el-input>
            </template>

          </el-table-column>
          <el-table-column prop="stocks"
                           :label="$t('groups.stock')"
                           align="center">
          </el-table-column>
        </el-table>

      </div>

      <span slot="footer"
            class="dialog-footer">
        <div class="default-btn primary-btn"
        @click="visible = false">{{$t('groups.determine')}}</div>
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
      dataForm: {
      },
      groupPrice: 0,
      leaderPrice: null
    }
  },
  methods: {
    init (groupProdId) {
      this.visible = true
      this.$nextTick(() => {
        if (groupProdId) {
          this.$http({
            url: this.$http.adornUrl('/platform/group/prod/getGroupProdAndSkuList/' + groupProdId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      let list = this.dataForm.skuDtoList
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          const element = list[key]
          if (parseFloat(element.leaderPrice) <= 0) {
            this.$message.error(this.$t('groups.theLeaderPriceMu'))
            return
          }
          if (parseFloat(element.actPrice) <= 0) {
            this.$message.error(this.$t('groups.activityPriceMus'))
            return
          }
          if (parseFloat(element.actPrice) > parseFloat(element.price)) {
            this.$message.error(this.$t('groups.canTPlateauPrice'))
            return
          }
          if (parseFloat(element.actPrice) > parseFloat(element.price)) {
            this.$message.error(this.$t('groups.canTPlateauPrice'))
            return
          }
          if (parseFloat(element.leaderPrice) > parseFloat(element.price)) {
            this.$message.error(this.$t('groups.notTPY'))
            return
          }
          if (this.dataForm.hasLeaderPrice === 1 && parseFloat(element.leaderPrice) > parseFloat(element.actPrice)) {
            this.$message.error(this.$t('groups.notTAY'))
            return
          }
        }
      }

      this.$http({
        url: this.$http.adornUrl('/group/sku/updateSkuBatch'),
        method: 'put',
        data: this.dataForm.skuDtoList
      }).then(({ data }) => {
        this.$message({
          message: this.$t('groups.successfulOperation'),
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
          url: this.$http.adornUrl('/group/activity/getProdAndSkuLists?prodIds=' + prodIds),
          method: 'get',
          params: {

          }
        }).then(({ data }) => {
          this.groupProdAndSkuLists = data
        })
      }
    },
    // 设置成团价格
    groupPriceSettingHandle () {
      this.settingGroupPriceVisible = true
    },
    // 设置价格
    leaderPriceSettingHandle () {
      this.settingLeaderPriceVisible = true
    },
    // 设置拼团价格
    checkGroupPriceHandle () {
      if (parseInt(this.groupPrice) < 0) {
        this.$message.error(this.$t('groups.groupPriceMusThan0'))
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
      if (this.dataForm && this.leaderPrice) {
        if (this.dataForm.skuDtoList) {
          for (let i = 0; i < this.dataForm.skuDtoList.length; i++) {
            this.dataForm.skuDtoList[i].leaderPrice = parseFloat(this.leaderPrice)
          }
        }
      }
      this.settingLeaderPriceVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
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
}
</style>
